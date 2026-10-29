import type { ReactElement } from "react";
import { pdf, type DocumentProps } from "@react-pdf/renderer";
import type { Board, Hu, Integration, Module, Screen, System } from "../lib/types";
import { carimboGeracao, VERSAO, type Paginas } from "./comum";
import FluxogramasDoc, { type DadosFluxogramas } from "./FluxogramasDoc";
import RequisitosDoc, { type DadosRequisitos } from "./RequisitosDoc";
import { registrarFontes } from "./tema";

/*
 * Ponto de entrada dos PDFs. Este módulo só é carregado no clique (import
 * dinâmico em `DownloadPdfButtons`), e com ele o @react-pdf/renderer — o bundle
 * inicial do app não muda.
 *
 * Cada PDF sai em duas passadas: a primeira anota em que página cada seção caiu,
 * a segunda imprime o sumário com esses números. O sumário tem o mesmo número de
 * linhas nas duas, então a paginação não se mexe entre elas.
 */

export interface DadosApp {
  systemById: Map<string, System>;
  modules: Module[];
  hus: Hu[];
  boards: Board[];
  screens: Screen[];
  huBoards: Map<string, string[]>;
  screenById: Map<string, Screen>;
  integrationById: Map<string, Integration>;
}

function salvar(blob: Blob, nome: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

async function duasPassadas(
  montar: (paginas: Paginas | null, coletor: Paginas) => ReactElement,
): Promise<Blob> {
  const doc = (el: ReactElement) => el as ReactElement<DocumentProps>;
  const primeira: Paginas = new Map();
  await pdf(doc(montar(null, primeira))).toBlob();
  return pdf(doc(montar(primeira, new Map()))).toBlob();
}

function sistemaDe(app: DadosApp, systemId: string): System {
  const sistema = app.systemById.get(systemId);
  if (!sistema) throw new Error(`Sistema desconhecido: ${systemId}`);
  return sistema;
}

export async function baixarRequisitos(app: DadosApp, systemId: string): Promise<void> {
  registrarFontes();
  const sistema = sistemaDe(app, systemId);
  const d: DadosRequisitos = {
    sistema,
    modules: app.modules.filter((m) => m.system === systemId),
    hus: app.hus.filter((h) => h.system === systemId),
    screens: app.screens.filter((t) => t.system === systemId),
    boardById: new Map(app.boards.map((b) => [b.docId, b])),
    huBoards: app.huBoards,
    screenById: app.screenById,
    integrationById: app.integrationById,
  };
  const geradoEm = carimboGeracao(new Date());
  const blob = await duasPassadas((paginas, coletor) => (
    <RequisitosDoc d={d} geradoEm={geradoEm} paginas={paginas} coletor={coletor} />
  ));
  salvar(blob, `Requisitos-${sistema.short}-v${VERSAO}.pdf`);
}

export async function baixarFluxogramas(app: DadosApp, systemId: string): Promise<void> {
  registrarFontes();
  const sistema = sistemaDe(app, systemId);
  const d: DadosFluxogramas = {
    sistema,
    modules: app.modules,
    // Só pranchas desenhadas: o diagrama em texto (Mermaid) não tem vetor no PDF.
    boards: app.boards.filter((b) => b.system === systemId && b.nodes.length > 0),
  };
  const geradoEm = carimboGeracao(new Date());
  const blob = await duasPassadas((paginas, coletor) => (
    <FluxogramasDoc d={d} geradoEm={geradoEm} paginas={paginas} coletor={coletor} />
  ));
  salvar(blob, `Fluxogramas-${sistema.short}-v${VERSAO}.pdf`);
}
