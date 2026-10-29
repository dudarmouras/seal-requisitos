import { MarkerType, type Edge, type Node } from "@xyflow/react";
import type { Board, BoardNode, NodeSide } from "./types";

/*
 * Geometria da prancha. A regra é: o dado declara coluna e linha, nunca pixel.
 * Aqui é o único lugar que converte um no outro — mudar `CW`/`RH` reescala a
 * prancha inteira sem tocar em nenhum board.
 */
export const CW = 190; // largura de uma coluna
export const RH = 96; // altura de uma linha

/**
 * O número da prancha, para exibição: `FLX-IN-04` → `04`.
 *
 * Dentro de um sistema o número basta e lê melhor que o código inteiro — é
 * assim no app SIAL. Só que ali existe um sistema; aqui existem vários, e
 * `04` sozinho é ambíguo entre `FLX-IN-04` e `FLX-GC-04`. Por isso o número
 * curto só aparece onde o sistema já está estabelecido pelo contexto (a
 * página da HU, o cartão sob o título do sistema), e o código completo
 * continua visível nas telas que atravessam sistemas.
 */
export function numeroDaPrancha(docId: string): string {
  return docId.split("-").pop() ?? docId;
}

const gx = (c: number) => c * CW;
const gy = (r: number) => r * RH;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/** Quebra gulosa por número de caracteres — sem medir texto de verdade. */
export function wrapText(text: string, max: number): string[] {
  const linhas: string[] = [];
  let atual = "";
  for (const palavra of text.split(/\s+/)) {
    if (!atual) atual = palavra;
    else if (atual.length + 1 + palavra.length <= max) atual += ` ${palavra}`;
    else {
      linhas.push(atual);
      atual = palavra;
    }
  }
  if (atual) linhas.push(atual);
  return linhas.length ? linhas : [""];
}

const maxLen = (linhas: string[]) =>
  linhas.reduce((m, l) => Math.max(m, l.length), 0);

/*
 * O tamanho do nó é derivado do texto, nunca declarado. As constantes são a
 * métrica aproximada de Poppins 11px (ação) e 10px (decisão) — trocar a fonte
 * exige recalibrar 6.6, 5.4, 8.2, 16 e 13.
 */
export function nodeSize(node: BoardNode): { w: number; h: number } {
  const type = node.type ?? "action";

  if (type === "decision") {
    const linhas = wrapText(node.label, node.wrap ?? 14);
    const rx = clamp(maxLen(linhas) * 5.4 + 18, 64, 104);
    const ry = clamp(linhas.length * 13 + 24, 46, 80);
    return { w: rx * 2, h: ry * 2 };
  }

  if (type === "label") {
    return { w: node.label.length * 8.2 + 8, h: 20 };
  }

  const linhas = wrapText(node.label, node.wrap ?? 22);
  const w = node.w ?? clamp(maxLen(linhas) * 6.6 + 30, 108, 236);
  return { w, h: linhas.length * 16 + 18 };
}

interface Center {
  cx: number;
  cy: number;
}

/** De que lado a aresta sai e entra, quando o board não diz. */
function autoSides(from: Center, to: Center): { from: NodeSide; to: NodeSide } {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  if (Math.abs(dy) >= Math.abs(dx)) {
    return dy >= 0 ? { from: "bottom", to: "top" } : { from: "top", to: "bottom" };
  }
  return dx >= 0 ? { from: "right", to: "left" } : { from: "left", to: "right" };
}

export interface GeoGroup {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GeoNode {
  id: string;
  kind: "action" | "dim" | "decision" | "label";
  label: string;
  /** Centro e tamanho, em pixel da prancha. */
  cx: number;
  cy: number;
  w: number;
  h: number;
  hus: string[];
  huSide: string;
  /** Quebra de linha que define o tamanho — o PDF desenha com ela. */
  lines: string[];
}

export interface GeoEdge {
  index: number;
  from: string;
  to: string;
  fromSide: NodeSide;
  toSide: NodeSide;
  label?: string;
  dashed: boolean;
  arrow: boolean;
}

/**
 * A prancha em pixel, sem biblioteca: grupos, nós e arestas com o lado de saída
 * e de entrada já resolvido. A tela (via `boardToFlow`) e o PDF desenham a partir
 * daqui, e por isso não divergem.
 */
export function boardGeometry(board: Board): {
  groups: GeoGroup[];
  nodes: GeoNode[];
  edges: GeoEdge[];
} {
  const groups: GeoGroup[] = (board.groups ?? []).map((g) => ({
    id: g.id,
    title: g.title,
    x: gx(g.x1),
    y: gy(g.y1),
    w: gx(g.x2 - g.x1),
    h: gy(g.y2 - g.y1),
  }));

  const nodes: GeoNode[] = (board.nodes ?? []).map((n) => {
    const kind = n.type ?? "action";
    const { w, h } = nodeSize(n);
    const lines =
      kind === "label"
        ? [n.label]
        : wrapText(n.label, n.wrap ?? (kind === "decision" ? 14 : 22));
    return {
      id: n.id,
      kind,
      label: n.label,
      cx: gx(n.c),
      cy: gy(n.r),
      w,
      h,
      hus: n.hu ?? [],
      huSide: n.huSide ?? "top",
      lines,
    };
  });

  const centros = new Map<string, Center>(nodes.map((n) => [n.id, { cx: n.cx, cy: n.cy }]));

  const edges: GeoEdge[] = (board.edges ?? []).map((e, index) => {
    const from = centros.get(e.from);
    const to = centros.get(e.to);
    const auto =
      from && to ? autoSides(from, to) : { from: "bottom" as NodeSide, to: "top" as NodeSide };
    return {
      index,
      from: e.from,
      to: e.to,
      fromSide: e.fromSide ?? auto.from,
      toSide: e.toSide ?? auto.to,
      label: e.label,
      dashed: Boolean(e.dashed),
      arrow: e.arrow !== false,
    };
  });

  return { groups, nodes, edges };
}

export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  kind: "action" | "dim" | "decision" | "label";
  hus: string[];
  huSide: string;
  highlighted: boolean;
  activeHuId?: string;
  onHuClick?: (huId: string) => void;
  openFirstHu?: () => void;
}

export interface FlowGroupData extends Record<string, unknown> {
  title: string;
}

export type SialNode = Node<FlowNodeData | FlowGroupData>;

interface BoardToFlowOptions {
  highlightHuId?: string;
  onHuClick?: (huId: string) => void;
}

/**
 * Converte a prancha no par `{ nodes, edges }` do React Flow. É a única peça do
 * app que conhece a biblioteca; o resto trabalha com `Board`.
 */
export function boardToFlow(
  board: Board,
  options: BoardToFlowOptions = {}
): { nodes: SialNode[]; edges: Edge[] } {
  const { highlightHuId, onHuClick } = options;
  const geo = boardGeometry(board);
  const nodes: SialNode[] = [];

  // Grupos primeiro: ficam atrás de tudo e não recebem interação.
  for (const g of geo.groups) {
    nodes.push({
      id: g.id,
      type: "sialGroup",
      position: { x: g.x, y: g.y },
      data: { title: g.title },
      width: g.w,
      height: g.h,
      draggable: false,
      selectable: false,
      zIndex: -10,
    });
  }

  for (const n of geo.nodes) {
    const hus = n.hus;
    const highlighted = Boolean(highlightHuId && hus.includes(highlightHuId));

    nodes.push({
      id: n.id,
      type: "sialNode",
      position: { x: n.cx - n.w / 2, y: n.cy - n.h / 2 },
      width: n.w,
      height: n.h,
      draggable: false,
      data: {
        label: n.label,
        kind: n.kind,
        hus,
        huSide: n.huSide,
        highlighted,
        activeHuId: highlightHuId,
        onHuClick,
        openFirstHu: hus.length ? () => onHuClick?.(hus[0]) : undefined,
      },
    });
  }

  const edges: Edge[] = geo.edges.map((e) => {
    // `as const` no type é o que faz o TS escolher a variante SmoothStepEdge
    // da união `Edge` — sem isso, `pathOptions` não existe no tipo.
    return {
      id: `${board.docId}-e${e.index}`,
      source: e.from,
      target: e.to,
      sourceHandle: `s-${e.fromSide}`,
      targetHandle: `t-${e.toSide}`,
      type: "smoothstep" as const,
      pathOptions: { borderRadius: 10 },
      label: e.label,
      className: e.dashed ? "dashed" : undefined,
      markerEnd: e.arrow
        ? { type: MarkerType.ArrowClosed, color: "#b9bdc7", width: 16, height: 16 }
        : undefined,
    };
  });

  return { nodes, edges };
}
