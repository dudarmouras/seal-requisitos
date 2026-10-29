import { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../lib/data";

export default function ScreensPage() {
  const { systems, screens } = useData();
  const [filter, setFilter] = useState<string | null>(null);

  const totalFields = screens.reduce(
    (acc, s) => acc + s.groups.reduce((a, g) => a + g.fields.length, 0),
    0
  );

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="home-hero">
        <h1>Telas e campos</h1>
        <p>
          {screens.length} telas com o dicionário de dados levantado da documentação de origem —
          {" "}{totalFields} campos com tipo, tamanho, obrigatoriedade, máscara, validações e
          origem no banco legado.
        </p>
      </div>

      <div className="board-tabs filter-tabs">
        <button
          type="button"
          className={"board-tab" + (filter === null ? " active" : "")}
          onClick={() => setFilter(null)}
        >
          Todas ({screens.length})
        </button>
        {systems.map((sys) => {
          const n = screens.filter((s) => s.system === sys.id).length;
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
          const sysScreens = screens.filter((s) => s.system === sys.id);
          if (!sysScreens.length) return null;
          return (
            <div key={sys.id}>
              <div className="section-heading">{sys.label}</div>
              <div className="hu-list">
                {sysScreens.map((screen) => {
                  const fields = screen.groups.reduce((a, g) => a + g.fields.length, 0);
                  return (
                    <Link
                      key={screen.docId}
                      to={`/telas/${screen.docId}`}
                      className="hu-list-item"
                    >
                      <span className="code">{screen.docId}</span>
                      <span className="t">{screen.name}</span>
                      {screen.legacyRoute && (
                        <code className="route">{screen.legacyRoute}</code>
                      )}
                      <span className="meta">
                        {fields ? `${fields} campos` : "sem campos na origem"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
