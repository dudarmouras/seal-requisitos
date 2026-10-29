import { useState } from "react";
import { Link } from "react-router-dom";
import { porExtenso, useData } from "../lib/data";
import { numeroDaPrancha } from "../lib/flow";
import FlowCardPreview from "../components/FlowCardPreview";

export default function FlowsPage() {
  const { systems, boards, modules } = useData();
  const [filter, setFilter] = useState<string | null>(null);

  const visible = filter ? boards.filter((b) => b.system === filter) : boards;

  function moduleLabel(systemId: string, moduleId: string | null) {
    if (!moduleId) return "transversal";
    return modules.find((m) => m.system === systemId && m.id === moduleId)?.label ?? moduleId;
  }

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="home-hero">
        <h1>Fluxogramas</h1>
        <p>
          {boards.length} diagramas dos processos dos {porExtenso(systems.length)} sistemas, gerados
          a partir da própria
          documentação. Abra um para navegar com zoom e ver as histórias de usuário que ele
          atravessa.
        </p>
      </div>

      <div className="board-tabs filter-tabs">
        <button
          type="button"
          className={"board-tab" + (filter === null ? " active" : "")}
          onClick={() => setFilter(null)}
        >
          Todos ({boards.length})
        </button>
        {systems.map((sys) => {
          const n = boards.filter((b) => b.system === sys.id).length;
          return (
            <button
              key={sys.id}
              type="button"
              className={"board-tab" + (filter === sys.id ? " active" : "")}
              onClick={() => setFilter(sys.id)}
            >
              {sys.short} ({n})
            </button>
          );
        })}
      </div>

      {systems
        .filter((sys) => !filter || sys.id === filter)
        .map((sys) => {
          const sysBoards = visible.filter((b) => b.system === sys.id);
          if (!sysBoards.length) return null;
          return (
            <div key={sys.id}>
              <div className="section-heading">{sys.label}</div>
              <div className="flows-grid">
                {sysBoards.map((board) => (
                  <Link key={board.docId} to={`/fluxos/${board.docId}`} className="flow-card">
                    <FlowCardPreview board={board} />
                    <div className="flow-card-body">
                      <span className="num">PRANCHA {numeroDaPrancha(board.docId)}</span>
                      <strong>{board.title}</strong>
                      <span>
                        {board.nodes.length} etapas · {board.hus.length} HUs
                      </span>
                      <span>
                        {moduleLabel(board.system, board.module)} · {board.docId}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}
