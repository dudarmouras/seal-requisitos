import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useData } from "../lib/data";
import MdBlock, { MdInline } from "../lib/mdblock";
import ScreenFields from "../components/ScreenFields";

export default function ScreenPage() {
  const { screenId } = useParams();
  const { screenById, huById, systemById, screens } = useData();
  const [integral, setIntegral] = useState(false);

  const screen = screenId ? screenById.get(screenId) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setIntegral(false);
  }, [screenId]);

  if (!screen) return <Navigate to="/telas" replace />;
  const actions = screen.actions ?? [];

  const sys = systemById.get(screen.system);
  const siblings = screens.filter((s) => s.system === screen.system);
  const idx = siblings.findIndex((s) => s.docId === screen.docId);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="hu-topbar">
        <Link to="/telas" className="chip-module">
          Telas
        </Link>
        {sys && (
          <Link to={`/sistema/${sys.id}`} className="chip-module">
            {sys.short}
          </Link>
        )}
        <div className="hu-pager">
          <Link
            to={prev ? `/telas/${prev.docId}` : "#"}
            className={"pager-btn" + (prev ? "" : " disabled")}
          >
            ‹ {prev ? prev.docId : "Anterior"}
          </Link>
          <Link
            to={next ? `/telas/${next.docId}` : "#"}
            className={"pager-btn" + (next ? "" : " disabled")}
          >
            {next ? next.docId : "Próxima"} ›
          </Link>
        </div>
      </div>

      <div className="hu-code">{screen.docId}</div>
      <h1 className="hu-title">{screen.name}</h1>

      <div className="hu-meta-row">
        {screen.legacyRoute && (
          <div className="hu-meta">
            <span className="k">Rota legada</span>
            <span className="v">
              <code className="md-code">{screen.legacyRoute}</code>
            </span>
          </div>
        )}
        {screen.targetRoute && (
          <div className="hu-meta">
            <span className="k">Rota proposta</span>
            <span className="v">
              <code className="md-code">{screen.targetRoute}</code>
            </span>
          </div>
        )}
        {screen.profiles && (
          <div className="hu-meta">
            <span className="k">Perfis</span>
            <span className="v">{screen.profiles}</span>
          </div>
        )}
        {screen.implementation && (
          <div className="hu-meta">
            <span className="k">Implementação</span>
            <span className="v">
              <code className="md-code">{screen.implementation}</code>
            </span>
          </div>
        )}
      </div>

      {screen.hus.length > 0 && (
        <>
          <div className="hu-section-label">
            Histórias de usuário que usam esta tela <span className="n">{screen.hus.length}</span>
          </div>
          <div className="legend-items">
            {screen.hus.map((id) => {
              const hu = huById.get(id);
              return hu ? (
                <Link key={id} to={`/hu/${id}`} className="legend-item">
                  <span className="code">{id}</span>
                  <span>{hu.title}</span>
                </Link>
              ) : (
                <span key={id} className="legend-item">
                  <span className="code">{id}</span>
                  <span>não encontrada no modelo</span>
                </span>
              );
            })}
          </div>
        </>
      )}

      <div className="hu-section-label">
        Dicionário de dados
        <span className="n">
          {screen.groups.reduce((a, g) => a + g.fields.length, 0)}
        </span>
      </div>
      <ScreenFields screen={screen} />

      {actions.length > 0 && (
        <>
          <div className="hu-section-label">
            Ações da tela <span className="n">{actions.length}</span>
          </div>
          <div className="fields-scroll">
            <table className="fields-table">
              <thead>
                <tr>
                  <th>Ação</th>
                  <th>Controle</th>
                  <th>Quem pode</th>
                  <th className="field-validations">Observações</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((a, i) => (
                  <tr key={i}>
                    <td>
                      <span className="field-label">
                        <MdInline text={a.action} system={screen.system} />
                      </span>
                      {a.endpoint && (
                        <div className="field-notes">
                          <MdInline text={a.endpoint} system={screen.system} />
                        </div>
                      )}
                    </td>
                    <td>
                      <MdInline text={a.control ?? "—"} system={screen.system} />
                    </td>
                    <td>
                      <MdInline text={a.who ?? "—"} system={screen.system} />
                    </td>
                    <td className="field-validations">
                      <MdInline text={a.notes ?? "—"} system={screen.system} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {screen.markdown && (
        <>
          <button
            type="button"
            className={"hu-section-label section-toggle" + (integral ? " open" : "")}
            onClick={() => setIntegral((v) => !v)}
            aria-expanded={integral}
          >
            <span className="section-toggle-chevron" aria-hidden="true">
              ▸
            </span>
            Texto integral da tela
            <span className="section-toggle-hint">{integral ? "ocultar" : "mostrar"}</span>
          </button>
          {integral && <MdBlock text={screen.markdown} system={screen.system} idBase={screen.docId} />}
        </>
      )}
    </div>
  );
}
