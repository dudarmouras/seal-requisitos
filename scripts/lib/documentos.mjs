// Leitura integral dos dez arquivos de cada sistema, e dos índices que o app navega por id.
//
// O gerador lê HU, fluxograma e tela campo a campo (03, 04, 05). Os outros arquivos — atores,
// catálogo de regras, modelo de dados, integrações, mensagens, divergências — têm formatos que
// variam de sistema para sistema, e um parser por formato perderia conteúdo em silêncio. Por
// isso eles entram **inteiros**, seção por seção, e o app os renderiza como Markdown. Por cima
// disso, um índice por id (`RN-*`, `ENT-*`, `INT-*`, `MSG-*`, `DIV-*`, `Q-*`) aponta para a
// seção ou a linha de tabela que define cada um.
//
// Ver docs/_convencoes/CONVENCOES.md §10 e §12.

/** Ids que o documento define, e o arquivo em que cada tipo é definido. */
export const KIND_HOME = {
  RN: "02-regras-de-negocio",
  ENT: "06-modelo-de-dados",
  INT: "07-integracoes",
  MSG: "08-mensagens-e-erros",
  DIV: "09-divergencias-e-lacunas",
  Q: "09-divergencias-e-lacunas",
  // Visão de produto, em docs/00-visao-geral/ — cada uma com página própria no app.
  DEC: "decisoes",
  RF: "requisitos",
  RNF: "requisitos",
  BL: "backlog",
};

export const RE_ID = /\b(?:(?:HU|RN|TL|FLX|ENT|MSG|DIV|Q|DEC|RF|RNF|BL)-[A-Z]{2}-\d+|INT-\d{3})\b/g;

const RE_ID_EXATO = /^(?:(?:HU|RN|TL|FLX|ENT|MSG|DIV|Q|DEC|RF|RNF|BL)-[A-Z]{2}-\d+|INT-\d{3})$/;

const kindOf = (id) => id.match(/^([A-Z]+)-/)[1];

/** Âncora estável de seção: o id quando o título começa por um, senão o título em slug. */
function anchorFor(title, usados) {
  const id = title.match(/^(?:[\d.]+\s+)?`?((?:[A-Z]+-[A-Z]{2}-\d+)|INT-\d{3})`?/)?.[1];
  let base =
    id ??
    title
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/`/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
  if (!base) base = "secao";
  let anchor = base;
  for (let n = 2; usados.has(anchor); n++) anchor = `${base}-${n}`;
  usados.add(anchor);
  return anchor;
}

/**
 * Quebra um arquivo em seções nos títulos `##` e `###`, fora de bloco de código. Os títulos
 * `####` em diante ficam dentro do corpo da seção.
 */
export function parseDocumento(content, { system, file }) {
  const linhas = content.split("\n");
  const title = (linhas.find((l) => /^# /.test(l)) ?? "").replace(/^#\s+/, "").trim() || file;
  const usados = new Set();
  const sections = [];
  let intro = [];
  let atual = null;
  let cerca = false;

  for (const linha of linhas) {
    if (/^\s*(```|~~~)/.test(linha)) cerca = !cerca;
    const h = !cerca && linha.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (h) {
      if (atual) sections.push(atual);
      atual = { anchor: anchorFor(h[2], usados), level: h[1].length, title: h[2], lines: [] };
      continue;
    }
    if (!atual) {
      if (!/^# /.test(linha)) intro.push(linha);
      continue;
    }
    atual.lines.push(linha);
  }
  if (atual) sections.push(atual);

  return {
    system,
    file,
    title,
    intro: intro.join("\n").trim(),
    sections: sections.map(({ lines, ...s }) => {
      const body = lines.join("\n").trim();
      return { ...s, body, ids: [...new Set((s.title + "\n" + body).match(RE_ID) ?? [])] };
    }),
  };
}

function cells(linha) {
  // `\|` é pipe escapado dentro da célula, não separador.
  const partes = linha.replace(/\\\|/g, "\u0000").split("|").map((c) => c.replace(/\u0000/g, "|").trim());
  if (partes[0] === "") partes.shift();
  if (partes[partes.length - 1] === "") partes.pop();
  return partes;
}

const separador = (linha) => /^\|?[\s:|-]+\|?$/.test(linha.trim()) && linha.includes("-");

/** Tabelas Markdown de um corpo: `{ header, rows }`, fora de bloco de código. */
export function tabelas(body) {
  const saida = [];
  const linhas = body.split("\n");
  let cerca = false;
  for (let i = 0; i < linhas.length; i++) {
    if (/^\s*(```|~~~)/.test(linhas[i])) cerca = !cerca;
    if (cerca) continue;
    if (linhas[i].trim().startsWith("|") && linhas[i + 1] && separador(linhas[i + 1])) {
      const header = cells(linhas[i]);
      const rows = [];
      let j = i + 2;
      for (; j < linhas.length && linhas[j].trim().startsWith("|"); j++) rows.push(cells(linhas[j]));
      saida.push({ header, rows, linha: i });
      i = j - 1;
    }
  }
  return saida;
}

const semCrase = (s) => (s ?? "").replace(/`/g, "").trim();

/** Cabeçalho da coluna que nomeia o item numa tabela de catálogo. */
const RE_COLUNA_TITULO = /^(t[íi]tulo|regra|nome|contexto|mensagem|texto|tabela|entidade|pergunta|diverg[êe]ncia|integra[çc][ãa]o|requisito|item)/i;

/** Tabela "| **Campo** | valor |" do corpo de uma seção -> { Campo: valor }. */
function camposDaSecao(body) {
  const campos = {};
  for (const m of body.matchAll(/^\|\s*\*\*(.+?)\*\*\s*\|\s*(.*?)\s*\|\s*$/gm)) campos[m[1].trim()] = m[2].trim();
  return campos;
}

/**
 * Índice dos ids definidos nos arquivos de catálogo. Um id é definido por um título de seção
 * (`### RN-GC-001 — …`) ou, quando não há título, por uma linha de tabela cuja primeira célula
 * é o id. O título vence: as tabelas de índice repetem os ids que as seções definem.
 */
export function parseArtefatos(docs) {
  const porId = new Map();

  for (const doc of docs) {
    const tipos = Object.entries(KIND_HOME).filter(([, f]) => f === doc.file).map(([k]) => k);
    if (!tipos.length) continue;

    for (const s of doc.sections) {
      const m = s.title.match(/^(?:[\d.]+\s+)?`?((?:[A-Z]+-[A-Z]{2}-\d+)|INT-\d{3})`?\s*(?:—|-)\s*(.+)$/);
      if (m && tipos.includes(kindOf(m[1]))) {
        porId.set(m[1], {
          id: m[1],
          kind: kindOf(m[1]),
          system: doc.system,
          file: doc.file,
          anchor: s.anchor,
          title: m[2].trim(),
          text: s.body,
          via: "secao",
          fields: camposDaSecao(s.body),
        });
      }
    }

    for (const s of doc.sections) {
      for (const t of tabelas(s.body)) {
        for (const row of t.rows) {
          const id = semCrase(row[0]);
          if (!RE_ID_EXATO.test(id) || !tipos.includes(kindOf(id))) continue;
          const existente = porId.get(id);
          if (existente?.via === "secao") continue;
          // A coluna que nomeia o item vira o título; as demais, o texto. Sem coluna
          // reconhecível, a segunda faz o papel.
          let iTitulo = t.header.findIndex((h, i) => i > 0 && RE_COLUNA_TITULO.test(semCrase(h)));
          if (iTitulo < 0) iTitulo = 1;
          const text = t.header
            .map((h, i) => (i > 0 && i !== iTitulo && row[i] && row[i] !== "—" ? `**${h}:** ${row[i]}` : null))
            .filter(Boolean)
            .join("\n\n");
          // Repetido em mais de uma tabela: fica a linha mais completa.
          if (existente && existente.text.length >= text.length) continue;
          porId.set(id, {
            id,
            kind: kindOf(id),
            system: doc.system,
            file: doc.file,
            anchor: s.anchor,
            title: row[iTitulo] ?? id,
            text,
            via: "tabela",
            // Cada coluna, pelo cabeçalho: é o que as páginas de decisões, requisitos e
            // backlog filtram e agrupam.
            fields: Object.fromEntries(
              t.header.map((h, i) => [semCrase(h), row[i] ?? ""]).filter(([, v], i) => i > 0 && v && v !== "—")
            ),
          });
        }
      }
    }
  }

  return [...porId.values()]
    .map((a) => {
      const severidade =
        a.text.match(/\*\*Severidade:?\*\*:?\s*([A-ZÁÉÍÓÚa-záéíóúâêôãõç]+)/)?.[1] ??
        (a.via === "tabela" ? a.text.match(/\*\*(?:Severidade|Impacto)[^*]*:\*\*\s*(Crítica|Alta|Média|Baixa)/)?.[1] : null) ??
        null;
      return {
        ...a,
        severity: ["DIV", "Q"].includes(a.kind) ? severidade : null,
        hasOutcome: ["DIV", "Q"].includes(a.kind) ? /\*\*Desfecho/.test(a.text) : null,
        cites: [...new Set(a.text.match(RE_ID) ?? [])].filter((x) => x !== a.id),
      };
    })
    .sort((x, y) => x.id.localeCompare(y.id, "en", { numeric: true }));
}

const METODOS = "GET|POST|PUT|PATCH|DELETE";

/** "`HU-GC-013` a `HU-GC-017`, `HU-GC-049`" -> lista expandida. */
export function idsComIntervalo(texto) {
  const saida = new Set();
  const re = /`?(HU-[A-Z]{2}-)(\d+)`?(?:\s+a\s+`?HU-[A-Z]{2}-(\d+)`?)?/g;
  for (const m of (texto ?? "").matchAll(re)) {
    const [, prefixo, ini, fim] = m;
    const a = Number(ini);
    const b = fim ? Number(fim) : a;
    for (let i = a; i <= b; i++) saida.add(prefixo + String(i).padStart(ini.length, "0"));
  }
  return [...saida];
}

/** Rota como a implementação a casa: minúscula, parâmetros como `{}`, sem query. */
export function chaveDeRota(rota) {
  return (
    "/" +
    rota
      .split("?")[0]
      .replace(/\{[^}]*\}/g, "{}")
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase()
  );
}

/** Os endpoints que uma célula declara — `GET /x`, ou "`GET`, `PUT /{id}` em `/base`". */
function endpointsDaCelula(celula) {
  const base = celula.match(/\bem\s+`(\/[^`]+)`/)?.[1];
  const saida = [];
  for (const m of celula.matchAll(new RegExp("`(" + METODOS + ")(?:\\s+(\\/[^`]*))?`", "g"))) {
    const [, metodo, rota] = m;
    const completa = base ? base.replace(/\/$/, "") + (rota && rota !== "/" ? rota : "") : rota;
    if (completa) saida.push({ method: metodo, route: completa });
  }
  return saida;
}

const coluna = (header, ...nomes) => header.findIndex((h) => nomes.some((n) => h.toLowerCase().startsWith(n)));

/**
 * Tabelas de endpoints do `07` (cabeçalho começando por "Método e rota"), com o `INT-*` da
 * seção `##` em que estão. Contratos: `#### \`Nome\`` + tabela `Campo | Tipo | Obrig. | …`
 * dentro de uma seção de contratos.
 */
export function parseEndpointsEContratos(doc) {
  const endpoints = [];
  const contracts = [];
  let int = null;
  let secaoH2 = null;

  for (const s of doc.sections) {
    if (s.level === 2) {
      int = s.title.match(/`?(INT-\d{3})`?/)?.[1] ?? null;
      secaoH2 = s.anchor;
    }
    for (const t of tabelas(s.body)) {
      const h = t.header.map(semCrase);
      if (!/^m[ée]todo/i.test(h[0] ?? "")) continue;
      const iUso = coluna(h, "uso", "o que faz", "finalidade");
      const iEntrada = coluna(h, "entrada");
      const iSaida = coluna(h, "saída", "saida", "resposta");
      const iTabelas = coluna(h, "tabelas");
      const iHus = coluna(h, "histórias", "hus");
      const iImpl = coluna(h, "implementação");
      const iObs = coluna(h, "observação", "observações");
      for (const row of t.rows) {
        for (const ep of endpointsDaCelula(row[0] ?? "")) {
          const get = (i) => (i >= 0 && row[i] && row[i] !== "—" ? row[i] : null);
          endpoints.push({
            system: doc.system,
            int,
            method: ep.method,
            route: ep.route,
            key: chaveDeRota(ep.route),
            purpose: get(iUso),
            input: get(iEntrada),
            output: get(iSaida),
            tables: get(iTabelas),
            hus: idsComIntervalo(get(iHus)),
            implementation: get(iImpl),
            notes: get(iObs),
            section: s.anchor,
            intSection: secaoH2,
          });
        }
      }
    }

    // Contratos: cada `#### \`Nome\`` seguido de tabela Campo | Tipo | Obrig.
    const blocos = s.body.split(/^####\s+/m).slice(1);
    for (const bloco of blocos) {
      const nome = bloco.match(/^`?([\w.<>]+)`?/)?.[1];
      const t = tabelas(bloco)[0];
      if (!nome || !t || !/^campo$/i.test(semCrase(t.header[0])) || !/^tipo/i.test(semCrase(t.header[1] ?? ""))) continue;
      contracts.push({
        system: doc.system,
        int,
        name: nome,
        section: s.anchor,
        fields: t.rows.map((r) => ({
          field: semCrase(r[0]),
          type: r[1] ?? null,
          required: r[2] ?? null,
          notes: r[3] && r[3] !== "—" ? r[3] : null,
        })),
      });
    }
  }
  return { endpoints, contracts };
}
