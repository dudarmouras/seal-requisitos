#!/usr/bin/env node
// Gera data/requisitos.json a partir do Markdown em docs/.
// O Markdown é sempre a fonte da verdade — ver docs/_convencoes/CONVENCOES.md §10.
// Uso: node scripts/gerar-requisitos-json.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocumento, parseArtefatos, parseEndpointsEContratos, RE_ID } from "./lib/documentos.mjs";
import { HUS_OCULTAS, FLUXOGRAMAS_OCULTOS, TELAS_OCULTAS, semMarcasDeOculto } from "./lib/ocultos.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const OUT = path.join(ROOT, "data", "requisitos.json");

// Um sistema hoje. A sigla tem de ter duas letras: `RE_ID` (scripts/lib/documentos.mjs)
// e o app só reconhecem `HU-XX-NNN`. Sistema novo entra aqui e em
// `scripts/conferir-md-vs-json.mjs`; o resto da cadeia se ajusta sozinho.
const SYSTEMS = [
  {
    id: "sl",
    label: "SEALog",
    short: "SL",
    // O "legado" do SEALog é a operação manual de hoje, não um sistema.
    legacyStack: "Operação manual: WhatsApp + planilhas",
    folder: "01-sealog",
  },
];

function readDoc(folder, name) {
  const p = path.join(DOCS, folder, name);
  if (!fs.existsSync(p)) return "";
  // Normaliza CRLF: todos os padrões daqui para baixo ancoram em "\n". Num
  // checkout Windows com core.autocrlf=true os arquivos chegam com "\r\n", e
  // sem esta troca o "\r" sobra dentro dos capturados — o bloco ```mermaid,
  // por exemplo, deixa de casar e o fluxograma some do app.
  // As marcas `<!-- OCULTO ... -->` dos blocos obsoletos saem aqui (scripts/lib/ocultos.mjs).
  return semMarcasDeOculto(fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n"));
}

/** Extrai linhas de uma tabela markdown (ignora cabeçalho e separador). */
function parseTableRows(block) {
  const lines = block.split("\n").filter((l) => l.trim().startsWith("|"));
  const dataLines = lines.filter((l) => !/^\|?\s*:?-{2,}/.test(l.replace(/\|/g, "").trim()) && !/^[\s|:-]+$/.test(l));
  const rows = dataLines.map((l) => {
    const cells = l.split("|").map((c) => c.trim());
    // remove primeira/última célula vazia (bordas "| a | b |")
    if (cells[0] === "") cells.shift();
    if (cells[cells.length - 1] === "") cells.pop();
    return cells;
  });
  return rows;
}

/** Tabela "| **Campo** | valor |" -> { Campo: valor } */
function parseMetaTable(block) {
  const meta = {};
  const re = /^\|\s*\*\*(.+?)\*\*\s*\|\s*(.*?)\s*\|\s*$/gm;
  let m;
  while ((m = re.exec(block))) {
    meta[m[1].trim()] = m[2].trim();
  }
  return meta;
}

function sliceBetween(block, startMarker, endMarkers) {
  const startIdx = block.indexOf(startMarker);
  if (startIdx === -1) return null;
  const from = startIdx + startMarker.length;
  let endIdx = block.length;
  for (const marker of endMarkers) {
    const idx = block.indexOf(marker, from);
    if (idx !== -1 && idx < endIdx) endIdx = idx;
  }
  return block.slice(from, endIdx).trim();
}

function parseComoGostariaPara(block) {
  const como = block.match(/\*\*Como\*\*\s*(.+)/);
  const gostaria = block.match(/\*\*Gostaria de\*\*\s*(.+)/);
  const para = block.match(/\*\*Para que\*\*\s*(.+)/);
  return {
    como: como ? como[1].trim() : null,
    gostaria: gostaria ? gostaria[1].trim() : null,
    para: para ? para[1].replace(/\.$/, "").trim() : null,
  };
}

function parseRules(block) {
  const text = sliceBetween(block, "**Regras de negócio**", [
    "**Critérios de aceitação**",
    "**Integrações e APIs**",
    "**Referências**",
  ]);
  if (!text) return [];
  const rows = parseTableRows(text);
  return rows
    .filter((r) => r.length >= 3 && /^RN\d+$/.test(r[0]))
    .map((r) => ({ num: r[0], text: r[1], catalog: r[2] === "—" ? null : r[2].replace(/`/g, "") }));
}

function parseCriteria(block) {
  const text = sliceBetween(block, "**Critérios de aceitação**", [
    "**Integrações e APIs**",
    "**Referências**",
  ]);
  if (!text) return [];
  const rows = parseTableRows(text);
  return rows
    .filter((r) => r.length >= 5 && /^CA\d+$/.test(r[0]))
    .map((r) => ({
      id: r[0],
      scenario: r[1],
      given: r[2],
      when: r[3],
      then: r[4],
    }));
}

function parseInlineList(block, marker, nextMarkers) {
  const text = sliceBetween(block, marker, nextMarkers);
  if (!text) return null;
  return text.replace(/^\s*—\s*/, "").replace(/\n+/g, " ").trim();
}

/** Headings de nível 2 usados como "seção do módulo" — varia de formato entre sistemas,
 *  por isso a associação HU → módulo amigável é feita por posição no texto, não por
 *  parsing do índice (o formato do índice muda de sistema para sistema). */
function parseSectionHeadings(content) {
  const re = /^##\s+(.+?)\s*$/gm;
  const skip = /^(Índice|Cobertura|Resumo)/i;
  return [...content.matchAll(re)]
    .filter((m) => !skip.test(m[1]))
    .map((m) => ({ index: m.index, label: cleanSectionLabel(m[1]) }));
}

function cleanSectionLabel(raw) {
  return raw
    .replace(/`[a-z0-9-]+`/gi, "")
    .replace(/\(\s*\)/g, "")
    .replace(/^[\s—-]+|[\s—-]+$/g, "")
    .replace(/^Módulo\s*/i, "")
    .trim();
}

/** Para sistema cujos headings de seção são "## Módulo `slug`" sem nome amigável —
 *  depois de limpar sobra vazio, então cobre-se com um pequeno dicionário manual
 *  (`"<sistema>:<slug>": "Rótulo"`) em vez de expor o slug bruto ao usuário final.
 *  O SEALog dá nome a todas as seções e não precisa dele. */
const MODULE_LABEL_OVERRIDES = {};

function labelForModule(sections, huIndex, fallback) {
  let label = null;
  for (const s of sections) {
    if (s.index <= huIndex) label = s.label;
    else break;
  }
  return label || fallback;
}

function parseHUs(content, systemId) {
  const headingRe = /^###\s+(HU-[A-Z]+-\d+)\s+—\s+(.+?)\s*$/gm;
  const matches = [...content.matchAll(headingRe)];
  const sections = parseSectionHeadings(content);
  const hus = [];
  for (let i = 0; i < matches.length; i++) {
    const docId = matches[i][1];
    const title = matches[i][2].trim();
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    const block = content.slice(start, end);

    const meta = parseMetaTable(block);
    const { como, gostaria, para } = parseComoGostariaPara(block);
    const description = sliceBetween(block, "**Descrição**", [
      "**Regras de negócio**",
      "**Critérios de aceitação**",
    ]);
    const rules = parseRules(block);
    const criteria = parseCriteria(block);
    const integracoesText = parseInlineList(block, "**Integrações e APIs**", ["**Referências**", "**Implementação**", "\n---"]);
    const refsText = parseInlineList(block, "**Referências**", ["**Implementação**", "\n---"]);
    // Onde a HU está na implementação, quando houver uma (CONVENCOES.md §12).
    const implText = parseInlineList(block, "**Implementação**", ["\n---", "\n### "]);

    const modulo = meta["Módulo"] ? meta["Módulo"].replace(/`/g, "") : null;
    const moduleLabel = modulo
      ? MODULE_LABEL_OVERRIDES[`${systemId}:${modulo}`] || labelForModule(sections, matches[i].index, modulo)
      : null;
    const telas = meta["Telas"]
      ? [...meta["Telas"].matchAll(/`(TL-[A-Z]+-\d+)`/g)].map((m) => m[1])
      : [];
    const integracoes = integracoesText
      ? [...integracoesText.matchAll(/`(INT-\d+)`/g)].map((m) => m[1])
      : [];
    const refs = refsText ? refsText.split(";").map((r) => r.trim()).filter(Boolean) : [];

    hus.push({
      docId,
      system: systemId,
      module: modulo,
      moduleLabel,
      title,
      actors: meta["Atores"] || null,
      screensRefs: telas,
      legacySource: meta["Origem legada"] || null,
      priority: meta["Prioridade"] || null,
      como,
      gostaria,
      para,
      description: description || null,
      rules,
      criteria,
      integrations: integracoes,
      integrationsNote: integracoesText,
      refs,
      implementation: implText,
    });
  }
  return hus;
}

/** Constrói a lista de módulos a partir das próprias HUs já parseadas (na ordem de
 *  aparição), usando o label da seção "##" que precede cada HU. Evitar depender do
 *  bloco de índice do documento: cada sistema usa um formato
 *  (slug na coluna 1, slug em coluna própria, label sem slug, label com slug entre
 *  parênteses, ou nenhum índice), então extrair diretamente do corpo é mais confiável. */
function parseModules(hus, systemId) {
  const modules = new Map();
  for (const hu of hus) {
    if (!hu.module) continue;
    if (!modules.has(hu.module)) {
      modules.set(hu.module, { id: hu.module, system: systemId, label: hu.moduleLabel || hu.module });
    }
  }
  return [...modules.values()];
}

/** O documento de fluxogramas não tem campo "Módulo" explícito — inferido a partir do
 *  módulo das HUs citadas em "**HUs:**". Fluxogramas transversais (que citam HUs de
 *  módulos diferentes, ou "todas") ficam com `module: null` de propósito. */
/**
 * Lê a linha **HUs:** de um fluxograma, expandindo a notação de intervalo.
 *
 * O documento escreve "`HU-IN-001` a `HU-IN-012`" — são doze histórias, não
 * duas. Extrair só o que está entre crases fazia o app mostrar a seção "Onde
 * entra no fluxo" em 30% a 39% das HUs, quando a documentação já declarava
 * de 59% a 93%.
 *
 * Só entra HU que existe de fato: a faixa numérica costuma ter buracos, e
 * inventar id aqui produziria item morto na legenda do fluxograma.
 */
function parseHuList(texto, huModuleById) {
  const re =
    /`(?<ini>HU-[A-Z]+-(?<iniN>\d+))`(?:\s*a\s*`(?<fim>HU-[A-Z]+-(?<fimN>\d+))`)?/g;
  const encontradas = new Set();

  for (const m of texto.matchAll(re)) {
    const { ini, iniN, fim, fimN } = m.groups;
    if (!fim) {
      if (huModuleById.has(ini)) encontradas.add(ini);
      continue;
    }
    const prefixo = ini.slice(0, ini.lastIndexOf("-") + 1);
    for (let i = Number(iniN); i <= Number(fimN); i++) {
      const id = prefixo + String(i).padStart(iniN.length, "0");
      if (huModuleById.has(id)) encontradas.add(id);
    }
  }
  return [...encontradas].sort();
}

function inferBoardModule(hus, huModuleById) {
  const mods = new Set(hus.map((id) => huModuleById.get(id)).filter(Boolean));
  return mods.size === 1 ? [...mods][0] : null;
}

/* ---------------------------------------------------------------------------
 * Telas e campos (05-telas-e-campos.md)
 * ------------------------------------------------------------------------ */

const CELL_EMPTY = /^(—|-|n\/a|não informado.*)$/i;

function cell(value) {
  const v = (value ?? "").trim();
  return !v || CELL_EMPTY.test(v) ? null : v;
}

/** "Sim"/"Não"/"Condicional" -> boolean | string | null */
function parseRequired(value) {
  const v = cell(value);
  if (!v) return null;
  if (/^sim$/i.test(v)) return true;
  if (/^n[ãa]o$/i.test(v)) return false;
  return v; // "Condicional", "Sim se ...", etc. — preservado como veio
}

function splitValidations(value) {
  const v = cell(value);
  if (!v) return [];
  return v
    .split(/;|\s+e\s+(?=[a-z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Os documentos de todos os sistemas usam a mesma tabela de dez colunas para o dicionário de
 * dados — `Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara |
 * Validações | Origem no banco | Observações` — com duas variações conhecidas:
 * a primeira coluna às vezes é `Elemento` (telas somente leitura) e a última é
 * `Opções de resposta` na Ouvidoria SEE. Tabelas com outro cabeçalho (ações da
 * tela, índices, domínios) são ignoradas de propósito.
 */
function isFieldTableHeader(cells) {
  if (cells.length < 9) return false;
  const first = (cells[0] || "").toLowerCase();
  const second = (cells[1] || "").toLowerCase();
  return /^(campo|elemento|coluna)$/.test(first) && second.startsWith("rótulo");
}

/** Quebra o corpo de uma tela em grupos "#### Título" / "**Título**" + tabela. */
function parseScreenFieldGroups(block) {
  const lines = block.split("\n");
  const groups = [];
  let currentLabel = null;
  let pending = [];

  const flush = () => {
    if (!pending.length) {
      pending = [];
      return;
    }
    const header = pending[0];
    if (isFieldTableHeader(header)) {
      const fields = pending
        .slice(1)
        .filter((r) => r.length >= 9 && cell(r[0]))
        .map((r) => ({
          // Colunas que são sempre código no documento perdem as crases aqui —
          // a UI já as renderiza em fonte monoespaçada. Nas colunas de prosa
          // (validações, observações) a crase é markdown inline e fica.
          field: cell(r[0]?.replace(/`/g, "")),
          label: cell(r[1]),
          control: cell(r[2]),
          type: cell(r[3]?.replace(/`/g, "")),
          size: cell(r[4]),
          required: parseRequired(r[5]),
          mask: cell(r[6]?.replace(/`/g, "")),
          validations: splitValidations(r[7]),
          dbSource: cell(r[8]?.replace(/`/g, "")),
          notes: cell(r[9]),
        }));
      if (fields.length) groups.push({ label: currentLabel, fields });
    }
    pending = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("|")) {
      const row = parseTableRows(trimmed);
      if (row.length) pending.push(row[0]);
      continue;
    }
    flush();
    const heading = trimmed.match(/^#{4,6}\s+(.+?)\s*$/);
    if (heading) {
      currentLabel = cleanScreenGroupLabel(heading[1]);
      continue;
    }
    const bold = trimmed.match(/^\*\*(.+?)\*\*\s*$/);
    if (bold && !/^refer[êe]ncias/i.test(bold[1])) {
      currentLabel = cleanScreenGroupLabel(bold[1]);
    }
  }
  flush();

  return groups;
}

/** Tabelas "Ação | Controle | Quem pode | Observações", com as variações de cabeçalho em uso. */
function parseScreenActions(block) {
  const actions = [];
  const linhas = block.split("\n");
  for (let i = 0; i < linhas.length; i++) {
    if (!linhas[i].trim().startsWith("|")) continue;
    const header = parseTableRows(linhas[i].trim())[0];
    if (!header || !/^ação$/i.test(header[0] ?? "")) continue;
    const idx = (re) => header.findIndex((h) => re.test(h));
    const iControle = idx(/^controle|^rótulo/i);
    const iQuem = idx(/^quem pode|^perfis/i);
    const iEndpoint = idx(/^endpoint/i);
    const iObs = idx(/^observa|^comportamento/i);
    for (let j = i + 2; j < linhas.length && linhas[j].trim().startsWith("|"); j++) {
      const r = parseTableRows(linhas[j].trim())[0];
      if (!r || !cell(r[0])) continue;
      actions.push({
        action: cell(r[0]),
        control: iControle >= 0 ? cell(r[iControle]) : null,
        who: iQuem >= 0 ? cell(r[iQuem]) : null,
        endpoint: iEndpoint >= 0 ? cell(r[iEndpoint]) : null,
        notes: iObs >= 0 ? cell(r[iObs]) : null,
      });
    }
  }
  return actions;
}

function cleanScreenGroupLabel(raw) {
  return raw.replace(/\s*\(`[^`]+`\)\s*$/, "").replace(/`/g, "").trim() || null;
}

function parseScreens(content, systemId, huScreensById) {
  const headingRe = /^#{2,4}\s+`?(TL-[A-Z]+-\d+)`?\s+—\s+(.+?)\s*$/gm;
  const matches = [...content.matchAll(headingRe)];
  const screens = [];

  for (let i = 0; i < matches.length; i++) {
    const docId = matches[i][1];
    const name = matches[i][2].trim();
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    const block = content.slice(start, end);

    const meta = parseMetaTable(block);
    // As HUs da tela vêm da própria tela quando declaradas; quando não, são
    // reconstruídas pelo caminho inverso (o campo "Telas" das HUs).
    const declared = meta["HUs"]
      ? [...meta["HUs"].matchAll(/`?(HU-[A-Z]+-\d+)`?/g)].map((m) => m[1])
      : [];
    const hus = declared.length ? declared : huScreensById.get(docId) ?? [];

    screens.push({
      docId,
      system: systemId,
      name,
      legacyRoute: cell(meta["Rota legada"]?.replace(/`/g, "")),
      targetRoute: cell(meta["Rota proposta"]?.replace(/`/g, "")),
      profiles: cell(meta["Perfis"]),
      implementation: cell(meta["Implementação"]?.replace(/`/g, "")),
      hus: [...new Set(hus)],
      groups: parseScreenFieldGroups(block),
      actions: parseScreenActions(block),
      // O bloco inteiro da tela, para a leitura integral: o que não é campo nem ação
      // (colunas do resultado, conteúdo da página estática, notas) não se perde.
      markdown: block.trim(),
    });
  }
  return screens;
}

/* ---------------------------------------------------------------------------
 * Catálogo consolidado de integrações (00-visao-geral/integracoes-externas.md)
 * ------------------------------------------------------------------------ */

/**
 * A seção "Catálogo consolidado" traz uma tabela por sistema, no formato
 * `ID | Nome | Direção | Natureza`. É a única fonte sem colisão de IDs — as
 * faixas por sistema foram renumeradas nessa consolidação —, então o app usa
 * esse catálogo para dar nome aos `INT-*` citados nas HUs.
 */
function parseIntegrations(content) {
  const startIdx = content.indexOf("## 2. Catálogo consolidado");
  const body = startIdx === -1 ? content : content.slice(startIdx);
  const rows = parseTableRows(body);
  const integrations = new Map();

  for (const row of rows) {
    if (row.length < 4) continue;
    const id = (row[0] || "").replace(/`/g, "").trim();
    if (!/^INT-\d+$/.test(id) || integrations.has(id)) continue;
    integrations.set(id, {
      id,
      name: cell(row[1]?.replace(/`/g, "")),
      direction: cell(row[2]),
      nature: cell(row[3]?.replace(/\*\*/g, "")),
    });
  }
  return [...integrations.values()];
}

/**
 * Lê o bloco ```board — a prancha desenhada, com coordenadas de grade.
 *
 * Não há compilador olhando esse JSON, então a validação aqui é dura de
 * propósito: erro de digitação em id de nó vira prancha muda no app, e o
 * sintoma (aresta que some) não aponta para a causa.
 */
function parseBoardLayout(block, docId, hus, huModuleById) {
  const match = block.match(/```board\n([\s\S]*?)\n```/);
  if (!match) return { nodes: [], edges: [], groups: [] };

  let dados;
  try {
    dados = JSON.parse(match[1]);
  } catch (err) {
    throw new Error(`${docId}: bloco \`\`\`board não é JSON válido — ${err.message}`);
  }

  const nodes = dados.nodes ?? [];
  const edges = dados.edges ?? [];
  const groups = dados.groups ?? [];
  const erros = [];

  const vistos = new Set();
  for (const n of nodes) {
    if (!n.id) erros.push(`nó sem id: ${JSON.stringify(n)}`);
    else if (vistos.has(n.id)) erros.push(`id de nó repetido: ${n.id}`);
    else vistos.add(n.id);

    if (typeof n.c !== "number" || typeof n.r !== "number") {
      erros.push(`nó ${n.id} sem coordenada c/r`);
    }
    // A HU ancorada não precisa estar na linha **HUs:** — ela costuma trazer
    // intervalo ("HU-IN-001 a HU-IN-012"), do qual só as pontas são
    // extraíveis. O que precisa é a HU existir de fato.
    for (const hu of n.hu ?? []) {
      if (!huModuleById.has(hu)) {
        erros.push(`nó ${n.id} ancora ${hu}, que não existe neste sistema`);
      }
    }
  }

  for (const e of edges) {
    if (!vistos.has(e.from)) erros.push(`aresta sai de id inexistente: ${e.from}`);
    if (!vistos.has(e.to)) erros.push(`aresta chega em id inexistente: ${e.to}`);
    // Rótulo é texto. Objeto ali derruba a prancha inteira no navegador, com
    // um erro do React que não menciona qual aresta causou.
    if (e.label !== undefined && typeof e.label !== "string") {
      erros.push(`aresta ${e.from} → ${e.to} tem rótulo que não é texto: ${JSON.stringify(e.label)}`);
    }
  }

  for (const g of groups) {
    if (!g.id) erros.push(`grupo sem id: ${JSON.stringify(g)}`);
    if ([g.x1, g.y1, g.x2, g.y2].some((v) => typeof v !== "number")) {
      erros.push(`grupo ${g.id} sem os quatro cantos`);
    }
  }

  if (erros.length) {
    throw new Error(`${docId}: ${erros.length} problema(s) no bloco board\n  - ${erros.join("\n  - ")}`);
  }

  return { nodes, edges, groups };
}

function parseBoards(content, systemId, huModuleById) {
  const headingRe = /^#{2,3}\s+(?:\d+\.\s*)?`?(FLX-[A-Z]+-\d+)`?\s+—\s+(.+?)\s*$/gm;
  const matches = [...content.matchAll(headingRe)];
  const boards = [];
  for (let i = 0; i < matches.length; i++) {
    const docId = matches[i][1];
    const title = matches[i][2].trim();
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    const block = content.slice(start, end);

    const scopeMatch = block.match(/\*\*Escopo:\*\*\s*([\s\S]*?)(?:\*\*HUs:\*\*|\n```)/);
    const husMatch = block.match(/\*\*HUs:\*\*\s*([\s\S]*?)(?:\n\n|\n```)/);
    const mermaidMatch = block.match(/```mermaid\n([\s\S]*?)\n```/);

    const hus = husMatch ? parseHuList(husMatch[1], huModuleById) : [];

    const layout = parseBoardLayout(block, docId, hus, huModuleById);

    // A prancha desenhada ancora HUs em nós específicos, e é essa a lista
    // completa — a linha **HUs:** costuma abreviar em intervalo. Quando há
    // âncoras, elas entram na legenda do fluxograma junto com as declaradas.
    const ancoradas = layout.nodes.flatMap((n) => n.hu ?? []);
    const todasHus = [...new Set([...hus, ...ancoradas])].sort();

    boards.push({
      docId,
      system: systemId,
      module: inferBoardModule(todasHus, huModuleById),
      title,
      scope: scopeMatch ? scopeMatch[1].replace(/\n/g, " ").trim() : null,
      hus: todasHus,
      // Um board tem prancha desenhada OU diagrama Mermaid. Quando tem as
      // duas, a prancha manda e o Mermaid vira histórico — ver CLAUDE.md.
      mermaid: mermaidMatch ? mermaidMatch[1].trim() : null,
      nodes: layout.nodes,
      edges: layout.edges,
      groups: layout.groups,
    });
  }
  return boards;
}

function main() {
  const systems = SYSTEMS.map(({ folder, ...rest }) => rest);
  const modules = [];
  const hus = [];
  const boards = [];
  const screens = [];

  for (const sys of SYSTEMS) {
    const huContent = readDoc(sys.folder, "03-historias-de-usuario.md");
    const flxContent = readDoc(sys.folder, "04-fluxogramas.md");
    const telaContent = readDoc(sys.folder, "05-telas-e-campos.md");

    // As HUs ocultas (`scripts/lib/ocultos.mjs`) ainda existem no Markdown: a
    // prancha que as ancora é validada contra todas, e só depois elas saem.
    const todasHus = parseHUs(huContent, sys.id);
    const huModuleById = new Map(todasHus.map((hu) => [hu.docId, hu.module]));
    const sysHus = todasHus
      .filter((hu) => !HUS_OCULTAS.has(hu.docId))
      .map((hu) => ({ ...hu, screensRefs: hu.screensRefs.filter((t) => !TELAS_OCULTAS.has(t)) }));
    const sysModules = parseModules(sysHus, sys.id);
    const sysBoards = parseBoards(flxContent, sys.id, huModuleById)
      .filter((b) => !FLUXOGRAMAS_OCULTOS.has(b.docId))
      .map((b) => {
        const visiveis = b.hus.filter((id) => !HUS_OCULTAS.has(id));
        return {
          ...b,
          module: inferBoardModule(visiveis, huModuleById),
          hus: visiveis,
          nodes: b.nodes.map((n) => (n.hu ? { ...n, hu: n.hu.filter((id) => !HUS_OCULTAS.has(id)) } : n)),
        };
      });

    // Caminho inverso HU → tela, para as telas que não declaram "HUs" na meta.
    const huScreensById = new Map();
    for (const hu of sysHus) {
      for (const tela of hu.screensRefs) {
        if (!huScreensById.has(tela)) huScreensById.set(tela, []);
        huScreensById.get(tela).push(hu.docId);
      }
    }
    const sysScreens = parseScreens(telaContent, sys.id, huScreensById)
      .filter((t) => !TELAS_OCULTAS.has(t.docId))
      .map((t) => ({ ...t, hus: t.hus.filter((id) => !HUS_OCULTAS.has(id)) }));

    modules.push(...sysModules);
    hus.push(...sysHus);
    boards.push(...sysBoards);
    screens.push(...sysScreens);

    const desenhados = sysBoards.filter((b) => b.nodes.length).length;
    console.log(
      `${sys.short.padEnd(3)} — ${String(sysModules.length).padStart(3)} módulos, ` +
        `${String(sysHus.length).padStart(3)} HUs, ${String(sysBoards.length).padStart(2)} fluxogramas ` +
        `(${String(desenhados).padStart(2)} desenhados), ` +
        `${String(sysScreens.length).padStart(3)} telas`
    );
  }

  const integrations = parseIntegrations(
    readDoc("00-visao-geral", "integracoes-externas.md")
  );

  // Leitura integral: os dez arquivos de cada sistema e a visão geral transversal.
  const documents = [];
  for (const sys of [...SYSTEMS, { id: "geral", folder: "00-visao-geral" }]) {
    const nomes = fs.readdirSync(path.join(DOCS, sys.folder)).filter((n) => n.endsWith(".md")).sort();
    for (const nome of nomes) {
      documents.push(parseDocumento(readDoc(sys.folder, nome), { system: sys.id, file: nome.replace(/\.md$/, "") }));
    }
  }
  const artifacts = parseArtefatos(documents);
  const endpoints = [];
  const contracts = [];
  for (const doc of documents.filter((d) => d.file === "07-integracoes")) {
    const r = parseEndpointsEContratos(doc);
    endpoints.push(...r.endpoints);
    contracts.push(...r.contracts);
  }

  // O catálogo consolidado ganha as integrações que só existem no 07 de um sistema.
  for (const a of artifacts.filter((x) => x.kind === "INT")) {
    if (!integrations.some((i) => i.id === a.id)) {
      integrations.push({ id: a.id, name: a.title.replace(/`/g, ""), direction: null, nature: null });
    }
  }
  integrations.sort((x, y) => x.id.localeCompare(y.id));

  // Id de catálogo citado que nenhum documento define: a UI mostraria o id cru.
  const definidos = new Set([
    ...artifacts.map((a) => a.id),
    ...hus.map((h) => h.docId),
    ...screens.map((t) => t.docId),
    ...boards.map((b) => b.docId),
    // Oculto não é órfão: está definido no Markdown, só não vai às páginas navegáveis.
    ...HUS_OCULTAS,
    ...FLUXOGRAMAS_OCULTOS,
    ...TELAS_OCULTAS,
  ]);
  const orfaos = new Map();
  const citar = (origem, texto) => {
    for (const id of (texto ?? "").match(RE_ID) ?? []) {
      const sis = id.match(/^[A-Z]+-([A-Z]{2})-/)?.[1]?.toLowerCase();
      if (!sis || !SYSTEMS.some((x) => x.id === sis) || definidos.has(id)) continue;
      if (!orfaos.has(id)) orfaos.set(id, new Set());
      orfaos.get(id).add(origem);
    }
  };
  for (const hu of hus) for (const r of hu.rules) citar(hu.docId, r.catalog);
  for (const hu of hus) citar(hu.docId, hu.screensRefs.join(" "));
  for (const ep of endpoints) citar(`${ep.method} ${ep.route}`, ep.hus.join(" "));

  // Chave repetida passa no JSON e só estoura na carga, com o banco a meio caminho.
  // Falha aqui, com a mesma chave das tabelas de supabase/schema.sql.
  const repetidas = [
    ["endpoints", endpoints, (e) => `${e.system} ${e.method} ${e.key}`],
    ["contracts", contracts, (c) => `${c.system} ${c.int ?? ""} ${c.name}`],
    ["documents", documents, (d) => `${d.system} ${d.file}`],
    ["screens", screens, (s) => s.docId],
    ["hus", hus, (h) => h.docId],
    ["boards", boards, (b) => b.docId],
  ].flatMap(([tabela, lista, chave]) => {
    const vistas = new Set();
    return lista.map(chave).filter((k) => vistas.has(k) || !vistas.add(k)).map((k) => `${tabela}: ${k}`);
  });
  if (repetidas.length) {
    throw new Error(`chave repetida — a carga no banco falharia:\n  - ${repetidas.join("\n  - ")}`);
  }

  const data = { systems, modules, hus, boards, screens, integrations, documents, artifacts, endpoints, contracts };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n", "utf8");

  const totalFields = screens.reduce(
    (acc, s) => acc + s.groups.reduce((a, g) => a + g.fields.length, 0),
    0
  );
  console.log(
    `\nTotal: ${systems.length} sistemas, ${modules.length} módulos, ${hus.length} HUs, ` +
      `${boards.length} fluxogramas, ${screens.length} telas (${totalFields} campos), ` +
      `${integrations.length} integrações.`
  );
  const porTipo = artifacts.reduce((m, a) => ({ ...m, [a.kind]: (m[a.kind] ?? 0) + 1 }), {});
  const secoes = documents.reduce((n, d) => n + d.sections.length, 0);
  console.log(
    `Leitura integral: ${documents.length} arquivos, ${secoes} seções. ` +
      `Índice: ${Object.entries(porTipo).map(([k, n]) => `${n} ${k}`).join(", ")}. ` +
      `${endpoints.length} endpoints, ${contracts.length} contratos.`
  );
  if (orfaos.size) {
    console.warn(`\nAviso: ${orfaos.size} id(s) citado(s) que nenhum documento define:`);
    for (const [id, de] of orfaos) {
      console.warn(`  - ${id}  (em ${[...de].slice(0, 4).join(", ")}${de.size > 4 ? ", …" : ""})`);
    }
  }
  console.log(`Gerado em ${path.relative(ROOT, OUT)}`);
}

main();
