import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { FlowGroupData, FlowNodeData } from "../lib/flow";

/*
 * Os quatro tipos de nó da prancha, herdados do app SIAL.
 *
 * Cada nó registra handles nos quatro lados (source e target), todos zerados
 * pelo CSS. É isso que permite a aresta declarar `fromSide: "right"` no dado em
 * vez de depender do roteamento automático da biblioteca.
 */

const SIDES = [
  { id: "top", position: Position.Top },
  { id: "bottom", position: Position.Bottom },
  { id: "left", position: Position.Left },
  { id: "right", position: Position.Right },
] as const;

function Handles() {
  return (
    <>
      {SIDES.map((s) => (
        <Handle key={`s-${s.id}`} id={`s-${s.id}`} type="source" position={s.position} />
      ))}
      {SIDES.map((s) => (
        <Handle key={`t-${s.id}`} id={`t-${s.id}`} type="target" position={s.position} />
      ))}
    </>
  );
}

/** Códigos de HU flutuando fora da caixa — é o que liga desenho e requisito. */
function HuChips({ data }: { data: FlowNodeData }) {
  if (!data.hus.length) return null;
  return (
    <div className={`rf-chips ${data.huSide}`}>
      {data.hus.map((huId) => (
        <button
          key={huId}
          type="button"
          className={"rf-chip" + (huId === data.activeHuId ? " hot" : "")}
          onClick={(ev) => {
            ev.stopPropagation();
            data.onHuClick?.(huId);
          }}
        >
          {huId}
        </button>
      ))}
    </div>
  );
}

export function SialNodeView({ data }: NodeProps) {
  const d = data as FlowNodeData;
  const highlight = d.highlighted ? " highlight" : "";

  if (d.kind === "label") {
    return (
      <div className="rf-label">
        <Handles />
        {d.label}
        <HuChips data={d} />
      </div>
    );
  }

  if (d.kind === "decision") {
    return (
      <div
        className={"rf-decision" + highlight}
        onClick={() => d.openFirstHu?.()}
        style={{ width: "100%", height: "100%" }}
      >
        <Handles />
        {/* Losango como <polygon>, não como div rotacionado: com largura
            variável, `rotate(45deg)` só forma losango se o nó for quadrado.
            `non-scaling-stroke` impede a borda de deformar junto. */}
        <svg
          className="rf-decision-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="50,1 99,50 50,99 1,50" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="label">{d.label}</span>
        <HuChips data={d} />
      </div>
    );
  }

  return (
    <div
      className={`rf-node ${d.kind}${highlight}`}
      onClick={() => d.openFirstHu?.()}
      style={{ width: "100%", height: "100%" }}
    >
      <Handles />
      {d.label}
      <HuChips data={d} />
    </div>
  );
}

export function SialGroupView({ data }: NodeProps) {
  const d = data as FlowGroupData;
  return (
    <div className="rf-group">
      <div className="g-title">{d.title}</div>
    </div>
  );
}

export const nodeTypes = {
  sialNode: SialNodeView,
  sialGroup: SialGroupView,
};
