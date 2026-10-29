import dados from "../../data/versoes.json";

/* Versão de cada HU, de data/versoes.json. O arquivo entra no bundle: vale no
   modo local e contra o banco, sem tabela própria. Quem o mantém é a
   Versionadora, a cada PR mergeada — ver docs/_convencoes/VERSIONAMENTO.md. */

export type Escopo = "base" | "pedido-cliente" | "correcao-bug";

export interface VersaoHu {
  versao: string;
  data: string;
  escopo: Escopo;
  resumo: string;
  pr?: number;
  commit?: string;
}

export interface HistoricoHu {
  versao: string;
  data: string;
  escopo: Escopo;
  historico: VersaoHu[];
}

const porHu = (dados as unknown as { hus: Record<string, HistoricoHu> }).hus;

/** HU fora do arquivo ainda não foi versionada: vale como 1.0, sem data. */
export function versaoDaHu(id: string): HistoricoHu | null {
  return porHu[id] ?? null;
}

export const ROTULO_ESCOPO: Record<Escopo, string> = {
  base: "Original",
  "pedido-cliente": "Pedido do cliente",
  "correcao-bug": "Correção de bug",
};

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** `2026-09-04` -> `4 de setembro de 2026`, sem passar por fuso horário. */
export function dataPorExtenso(iso: string): string {
  const [a, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}
