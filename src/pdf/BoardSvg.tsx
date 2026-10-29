import { G, Path, Polygon, Rect, Svg, Text as SvgText } from "@react-pdf/renderer";
import { getSmoothStepPath, Position } from "@xyflow/react";
import { boardGeometry, type GeoNode } from "../lib/flow";
import type { Board, NodeSide } from "../lib/types";
import { COR } from "./tema";

/*
 * A prancha em vetor, para o PDF. A geometria é a de `boardGeometry` — a mesma
 * que alimenta o React Flow na tela — e o traçado da aresta é o `smoothstep` da
 * própria biblioteca, então o desenho impresso é o desenho da tela.
 */

// O `style` do <Text> de SVG aceita fonte em tempo de execução, mas o tipo não diz.
type FonteSvg = Record<string, string | number>;
const fonte = (f: FonteSvg) => f as never;

const POS: Record<NodeSide, Position> = {
  top: Position.Top,
  bottom: Position.Bottom,
  left: Position.Left,
  right: Position.Right,
};

function ancora(n: GeoNode, lado: NodeSide): { x: number; y: number } {
  switch (lado) {
    case "top":
      return { x: n.cx, y: n.cy - n.h / 2 };
    case "bottom":
      return { x: n.cx, y: n.cy + n.h / 2 };
    case "left":
      return { x: n.cx - n.w / 2, y: n.cy };
    default:
      return { x: n.cx + n.w / 2, y: n.cy };
  }
}

/** Ponta de seta fechada, apontando para dentro do nó pelo lado de entrada. */
function seta(x: number, y: number, lado: NodeSide): string {
  const L = 7;
  const W = 3.6;
  switch (lado) {
    case "top":
      return `${x},${y} ${x - W},${y - L} ${x + W},${y - L}`;
    case "bottom":
      return `${x},${y} ${x - W},${y + L} ${x + W},${y + L}`;
    case "left":
      return `${x},${y} ${x - L},${y - W} ${x - L},${y + W}`;
    default:
      return `${x},${y} ${x + L},${y - W} ${x + L},${y + W}`;
  }
}

const CHIP_H = 12.5;
const chipW = (id: string) => id.length * 6.2 + 4;

interface Chip {
  id: string;
  x: number; // centro
  y: number; // linha de base
  anchor: "start" | "middle" | "end";
}

function chipsDoNo(n: GeoNode): Chip[] {
  const top = n.cy - n.h / 2;
  const bottom = n.cy + n.h / 2;
  const left = n.cx - n.w / 2;
  const right = n.cx + n.w / 2;
  const k = n.hus.length;
  return n.hus.map((id, i) => {
    switch (n.huSide) {
      case "bottom":
        return { id, x: n.cx, y: bottom + 4 + (i + 1) * CHIP_H - 3, anchor: "middle" };
      case "left":
        return { id, x: left - 7, y: n.cy - (k * CHIP_H) / 2 + (i + 1) * CHIP_H - 3, anchor: "end" };
      case "right":
        return { id, x: right + 7, y: n.cy - (k * CHIP_H) / 2 + (i + 1) * CHIP_H - 3, anchor: "start" };
      case "inline": {
        const antes = n.hus.slice(0, i).reduce((s, h) => s + chipW(h) + 4, 0);
        return { id, x: left + 150 + antes, y: top + 10 + CHIP_H - 3, anchor: "start" };
      }
      default:
        return { id, x: n.cx, y: top - 4 - (k - 1 - i) * CHIP_H - 3, anchor: "middle" };
    }
  });
}

interface Caixa {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function caixaDoChip(c: Chip): Caixa {
  const w = chipW(c.id);
  const x1 = c.anchor === "start" ? c.x : c.anchor === "end" ? c.x - w : c.x - w / 2;
  return { x1, y1: c.y - CHIP_H + 3, x2: x1 + w, y2: c.y + 3 };
}

/** Linhas de texto centradas verticalmente em `cy`. */
function linhas(n: GeoNode, tamanho: number, entre: number, cor: string, peso: number, maiusc = false) {
  const total = n.lines.length * entre;
  return n.lines.map((l, i) => (
    <SvgText
      key={i}
      x={n.cx}
      y={n.cy - total / 2 + i * entre + entre * 0.72}
      textAnchor="middle"
      fill={cor}
      style={fonte({ fontFamily: "Poppins", fontSize: tamanho, fontWeight: peso })}
    >
      {maiusc ? l.toUpperCase() : l}
    </SvgText>
  ));
}

function No({ n }: { n: GeoNode }) {
  const x = n.cx - n.w / 2;
  const y = n.cy - n.h / 2;
  if (n.kind === "label") {
    return <G>{linhas(n, 11.5, 15, COR.navy, 600, true)}</G>;
  }
  if (n.kind === "decision") {
    const pts = `${n.cx},${y} ${x + n.w},${n.cy} ${n.cx},${y + n.h} ${x},${n.cy}`;
    return (
      <G>
        <Polygon points={pts} fill={COR.paper} stroke={COR.navy} strokeWidth={1.5} strokeLinejoin="round" />
        {linhas(n, 10, 13, COR.navy, 500)}
      </G>
    );
  }
  return (
    <G>
      <Rect x={x} y={y} width={n.w} height={n.h} rx={7} fill={n.kind === "dim" ? COR.navySoft : COR.navy} />
      {linhas(n, 11, 16, "#ffffff", 500)}
    </G>
  );
}

/**
 * Desenha a prancha cabendo em `largura` × `altura` (pontos do PDF), sem
 * distorcer. Devolve `null` para prancha sem nós (diagrama em texto).
 */
export default function BoardSvg({
  board,
  largura,
  altura,
}: {
  board: Board;
  largura: number;
  altura: number;
}) {
  const geo = boardGeometry(board);
  if (!geo.nodes.length) return null;

  const porId = new Map(geo.nodes.map((n) => [n.id, n]));
  const chips = geo.nodes.flatMap(chipsDoNo);

  const caixas: Caixa[] = [
    ...geo.groups.map((g) => ({ x1: g.x, y1: g.y, x2: g.x + g.w, y2: g.y + g.h })),
    ...geo.nodes.map((n) => ({
      x1: n.cx - n.w / 2,
      y1: n.cy - n.h / 2,
      x2: n.cx + n.w / 2,
      y2: n.cy + n.h / 2,
    })),
    ...chips.map(caixaDoChip),
  ];

  const arestas = geo.edges.flatMap((e) => {
    const a = porId.get(e.from);
    const b = porId.get(e.to);
    if (!a || !b) return [];
    const p = ancora(a, e.fromSide);
    const q = ancora(b, e.toSide);
    const [d, labelX, labelY] = getSmoothStepPath({
      sourceX: p.x,
      sourceY: p.y,
      sourcePosition: POS[e.fromSide],
      targetX: q.x,
      targetY: q.y,
      targetPosition: POS[e.toSide],
      borderRadius: 10,
    });
    caixas.push({
      x1: Math.min(p.x, q.x) - 20,
      y1: Math.min(p.y, q.y) - 20,
      x2: Math.max(p.x, q.x) + 20,
      y2: Math.max(p.y, q.y) + 20,
    });
    return [{ e, d, labelX, labelY, q }];
  });

  const pad = 16;
  const x1 = Math.min(...caixas.map((c) => c.x1)) - pad;
  const y1 = Math.min(...caixas.map((c) => c.y1)) - pad;
  const x2 = Math.max(...caixas.map((c) => c.x2)) + pad;
  const y2 = Math.max(...caixas.map((c) => c.y2)) + pad;
  const bw = x2 - x1;
  const bh = y2 - y1;
  const escala = Math.min(largura / bw, altura / bh, 1.15);

  return (
    <Svg width={bw * escala} height={bh * escala} viewBox={`${x1} ${y1} ${bw} ${bh}`}>
      {geo.groups.map((g) => (
        <G key={g.id}>
          <Rect
            x={g.x}
            y={g.y}
            width={g.w}
            height={g.h}
            rx={14}
            fill={COR.groupFill}
            stroke={COR.groupBorder}
            strokeWidth={1}
            strokeDasharray="4 3"
          />
          <SvgText
            x={g.x + 16}
            y={g.y + 22}
            fill={COR.navy}
            style={fonte({ fontFamily: "Poppins", fontSize: 10.5, fontWeight: 600 })}
          >
            {g.title.toUpperCase()}
          </SvgText>
        </G>
      ))}

      {arestas.map(({ e, d, q }) => (
        <G key={e.index}>
          <Path
            d={d}
            fill="none"
            stroke={COR.line}
            strokeWidth={1.3}
            strokeDasharray={e.dashed ? "5 4" : undefined}
          />
          {e.arrow && <Polygon points={seta(q.x, q.y, e.toSide)} fill={COR.line} />}
        </G>
      ))}

      {geo.nodes.map((n) => (
        <No key={n.id} n={n} />
      ))}

      {arestas
        .filter(({ e }) => e.label)
        .map(({ e, labelX, labelY }) => {
          const w = e.label!.length * 5.4 + 8;
          return (
            <G key={`l${e.index}`}>
              <Rect x={labelX - w / 2} y={labelY - 7} width={w} height={14} rx={2} fill={COR.paper} />
              <SvgText
                x={labelX}
                y={labelY + 3.3}
                textAnchor="middle"
                fill={COR.edgeText}
                style={fonte({ fontFamily: "Poppins", fontSize: 9.5, fontWeight: 500 })}
              >
                {e.label!}
              </SvgText>
            </G>
          );
        })}

      {chips.map((c, i) => (
        <SvgText
          key={`c${i}`}
          x={c.x}
          y={c.y}
          textAnchor={c.anchor}
          fill={COR.navy}
          style={fonte({ fontFamily: "Poppins", fontSize: 10, fontWeight: 700 })}
        >
          {c.id}
        </SvgText>
      ))}
    </Svg>
  );
}
