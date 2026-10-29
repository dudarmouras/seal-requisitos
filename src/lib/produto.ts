import type { ArtifactKind, DocFile } from "./types";

/*
 * Visão de produto: sete arquivos de `docs/00-visao-geral/`, cada um com rota própria.
 * Decisões, requisitos e backlog são lidos pelos ids (`DEC`, `RF`, `RNF`, `BL`) e pelas
 * colunas de cada um (`Artifact.fields`); os outros quatro são texto corrido, e a página
 * os mostra inteiros, como a leitura integral.
 */

export interface PaginaProduto {
  path: string;
  file: string;
  label: string;
}

export const PAGINAS_PRODUTO: PaginaProduto[] = [
  { path: "/decisoes", file: "decisoes", label: "Principais decisões" },
  { path: "/requisitos", file: "requisitos", label: "Requisitos funcionais e não funcionais" },
  { path: "/backlog", file: "backlog", label: "Backlog e priorização" },
  { path: "/arquitetura", file: "arquitetura", label: "Arquitetura do sistema" },
  { path: "/infraestrutura", file: "infraestrutura-e-custos", label: "Infraestrutura e custos" },
  { path: "/adocao", file: "adocao-gradual", label: "Adoção gradual" },
  { path: "/escalabilidade", file: "escalabilidade", label: "Escalabilidade adaptativa" },
];

export const paginaDoArquivo = (file: string) => PAGINAS_PRODUTO.find((p) => p.file === file);

/** Página própria de cada tipo de id da visão de produto. */
export const PAGINA_DO_TIPO: Partial<Record<ArtifactKind, string>> = {
  DEC: "/decisoes",
  RF: "/requisitos",
  RNF: "/requisitos#nao-funcionais",
  BL: "/backlog",
};

const RE_ID = /\b(?:[A-Z]+-[A-Z]{2}-\d+|INT-\d{3})\b/g;

/** Ids citados num texto, na ordem e sem repetição. */
export const idsDoTexto = (texto: string | undefined) => [...new Set(texto?.match(RE_ID) ?? [])];

/** "Alta" -> "alta", "Média" -> "media": o sufixo das classes `prio-*`. */
export const classeDePrioridade = (p: string) => p.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function cells(linha: string): string[] {
  const partes = linha
    .replace(/\\\|/g, "\u0000")
    .split("|")
    .map((c) => c.replace(/\u0000/g, "|").trim());
  if (partes[0] === "") partes.shift();
  if (partes[partes.length - 1] === "") partes.pop();
  return partes;
}

/** Primeira tabela da seção de `doc` cujo título contém `trecho`, como linhas de objetos pelo cabeçalho. */
export function tabelaDaSecao(doc: DocFile | undefined, trecho: string): Record<string, string>[] {
  const secao = doc?.sections.find((s) => s.title.toLowerCase().includes(trecho.toLowerCase()));
  if (!secao) return [];
  const linhas = secao.body.split("\n");
  const i = linhas.findIndex((l, n) => l.trim().startsWith("|") && /^\|?[\s:|-]+\|?$/.test(linhas[n + 1]?.trim() ?? "x"));
  if (i < 0) return [];
  const header = cells(linhas[i]);
  const rows: Record<string, string>[] = [];
  for (let j = i + 2; j < linhas.length && linhas[j].trim().startsWith("|"); j++) {
    const c = cells(linhas[j]);
    rows.push(Object.fromEntries(header.map((h, k) => [h, c[k] ?? ""])));
  }
  return rows;
}
