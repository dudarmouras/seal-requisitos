import type { ReactElement } from "react";
import { Document, Page, Path, Polygon, Svg, Text, View } from "@react-pdf/renderer";
import { numeroDaPrancha } from "../lib/flow";
import type { Board, Module, System } from "../lib/types";
import BoardSvg from "./BoardSvg";
import {
  Capa,
  Contracapa,
  Rodape,
  Sumario,
  TituloMarcado,
  VERSAO,
  type ItemSumario,
  type Paginas,
} from "./comum";
import { COR, s } from "./tema";

export interface DadosFluxogramas {
  sistema: System;
  modules: Module[];
  boards: Board[];
}

// A4 paisagem (842 × 595) menos margens, cabeçalho da prancha e rodapé.
const AREA_L = 842 - 80;
const AREA_A = 595 - 34 - 46 - 58;

const tituloPrancha = (b: Board) => `Prancha ${numeroDaPrancha(b.docId)} — ${b.title}`;

export function itensDoSumarioFluxos(d: DadosFluxogramas): ItemSumario[] {
  return d.boards.map((b) => ({ id: b.docId, texto: tituloPrancha(b), nivel: 1 as const }));
}

function moduloDe(d: DadosFluxogramas, b: Board): string {
  if (!b.module) return "Transversal";
  return d.modules.find((m) => m.system === b.system && m.id === b.module)?.label ?? b.module;
}

/** HUs da prancha: as da linha `**HUs:**` somadas às ancoradas nos nós, como na legenda da tela. */
function husDaPrancha(b: Board): number {
  const ids = new Set(b.hus);
  for (const n of b.nodes) for (const h of n.hu ?? []) ids.add(h);
  return ids.size;
}

const etapas = (b: Board) => b.nodes.filter((n) => (n.type ?? "action") !== "label").length;

/** Uma linha da legenda: amostra à esquerda, explicação à direita. */
function Legenda({ amostra, texto }: { amostra: ReactElement; texto: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
      <View style={{ width: 180, alignItems: "flex-start" }}>{amostra}</View>
      <Text style={{ flex: 1, fontSize: 9.5 }}>{texto}</Text>
    </View>
  );
}

function caixa(rotulo: string, fundo: string) {
  return (
    <View
      style={{
        backgroundColor: fundo,
        borderRadius: 5,
        paddingVertical: 6,
        width: 130,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#ffffff", fontSize: 9, fontWeight: 500 }}>{rotulo}</Text>
    </View>
  );
}

function ComoLer() {
  return (
    <View style={s.corpo}>
      <Text style={s.h1}>Como ler as pranchas</Text>
      <Text style={{ color: COR.muted, marginTop: 4, marginBottom: 24 }}>
        Convenções usadas em todos os fluxogramas deste documento.
      </Text>
      <Legenda amostra={caixa("Etapa do fluxo", COR.navy)} texto="Etapa ou ação executada no sistema." />
      <Legenda
        amostra={caixa("Contexto", COR.navySoft)}
        texto="Etapa atenuada: início, fim, contexto ou ponto fora do escopo da prancha."
      />
      <Legenda
        amostra={
          <Svg width={130} height={44} viewBox="0 0 130 44">
            <Polygon points="65,1 129,22 65,43 1,22" fill={COR.paper} stroke={COR.navy} strokeWidth={1.2} />
          </Svg>
        }
        texto="Decisão: o fluxo segue pelo caminho indicado no rótulo de cada seta (Sim / Não)."
      />
      <Legenda
        amostra={
          <View
            style={{
              width: 130,
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: COR.groupBorder,
              backgroundColor: COR.groupFill,
              borderRadius: 8,
              paddingVertical: 7,
              paddingHorizontal: 9,
            }}
          >
            <Text style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: 0.8, color: COR.navy }}>
              AGRUPAMENTO
            </Text>
          </View>
        }
        texto="Agrupamento temático de etapas relacionadas."
      />
      <Legenda
        amostra={<Text style={{ fontSize: 10, fontWeight: 700, color: COR.navy }}>HU-SL-001</Text>}
        texto="História de usuário ligada à etapa — detalhada no PDF “Documento de Requisitos”."
      />
      <Legenda
        amostra={
          <Svg width={130} height={10} viewBox="0 0 130 10">
            <Path d="M 2 5 L 120 5" stroke={COR.line} strokeWidth={1.3} strokeDasharray="5 4" />
            <Polygon points="128,5 120,1.5 120,8.5" fill={COR.line} />
          </Svg>
        }
        texto="Seta tracejada: retorno, ligação secundária ou fluxo de correção e reenvio."
      />
      <Legenda
        amostra={
          <Svg width={130} height={10} viewBox="0 0 130 10">
            <Path d="M 2 5 L 120 5" stroke={COR.line} strokeWidth={1.3} />
            <Polygon points="128,5 120,1.5 120,8.5" fill={COR.line} />
          </Svg>
        }
        texto="Seta contínua: sequência do fluxo."
      />
    </View>
  );
}

export default function FluxogramasDoc({
  d,
  geradoEm,
  paginas,
  coletor,
}: {
  d: DadosFluxogramas;
  geradoEm: string;
  paginas: Paginas | null;
  coletor: Paginas;
}) {
  const rodape = `Fluxogramas ${d.sistema.label} · v${VERSAO}`;
  return (
    <Document
      title={`Fluxogramas — ${d.sistema.label}`}
      author="Requisitos SEAL"
      subject={`Versão ${VERSAO}`}
      language="pt-BR"
    >
      <Capa
        paisagem
        sistema={d.sistema.label}
        titulo="Fluxogramas"
        subtitulo={`As pranchas dos processos ponta a ponta do ${d.sistema.label}, com as histórias de usuário posicionadas em cada etapa.`}
        geradoEm={geradoEm}
        contagens={[{ n: d.boards.length, rotulo: "pranchas de fluxo, uma por página, em A4 paisagem" }]}
      />

      <Page size="A4" orientation="landscape" style={s.pageLandscape}>
        <Sumario itens={itensDoSumarioFluxos(d)} paginas={paginas} />
        <Rodape rotulo={rodape} paisagem />
      </Page>

      <Page size="A4" orientation="landscape" style={s.pageLandscape}>
        <ComoLer />
        <Rodape rotulo={rodape} paisagem />
      </Page>

      {d.boards.map((b) => (
        <Page key={b.docId} size="A4" orientation="landscape" style={s.pageLandscape}>
          <View id={b.docId} style={s.corpo}>
            <TituloMarcado id={b.docId} texto={tituloPrancha(b)} coletor={coletor} style={s.h2} />
            <Text style={{ fontSize: 8, color: COR.muted, marginTop: 2 }}>
              {moduloDe(d, b)} · {etapas(b)} etapas · {husDaPrancha(b)} histórias de usuário
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            <BoardSvg board={b} largura={AREA_L} altura={AREA_A} />
          </View>
          <Rodape rotulo={rodape} paisagem />
        </Page>
      ))}

      <Contracapa paisagem sistema={d.sistema.label} titulo="Fluxogramas" geradoEm={geradoEm} />
    </Document>
  );
}
