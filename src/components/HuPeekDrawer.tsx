import { Link } from "react-router-dom";
import { useData } from "../lib/data";
import Md from "../lib/md";

/** Prévia da HU sem sair do fluxograma. */
export default function HuPeekDrawer({
  huId,
  onClose,
}: {
  huId: string;
  onClose: () => void;
}) {
  const { huById, systemById } = useData();
  const hu = huById.get(huId);
  if (!hu) return null;

  const sys = systemById.get(hu.system);

  return (
    <>
      <div className="peek-overlay" onClick={onClose} />
      <aside className="peek">
        <button type="button" className="peek-close" onClick={onClose} aria-label="Fechar">
          ×
        </button>
        <div className="doc-ref">
          {sys?.label}
          {hu.moduleLabel ? ` · ${hu.moduleLabel}` : ""}
        </div>
        <div className="hu-code">{hu.docId}</div>
        <h2 className="hu-title">{hu.title}</h2>

        {(hu.como || hu.gostaria || hu.para) && (
          <div className="story-card">
            {hu.como && (
              <p>
                <strong>Como</strong> <Md text={hu.como} />
              </p>
            )}
            {hu.gostaria && (
              <p>
                <strong>Gostaria de</strong> <Md text={hu.gostaria} />
              </p>
            )}
            {hu.para && (
              <p>
                <strong>Para que</strong> <Md text={hu.para} />
              </p>
            )}
          </div>
        )}

        <div className="peek-stats">
          <div className="peek-stat">
            <div className="n">{hu.rules.length}</div>
            <div className="l">Regras</div>
          </div>
          <div className="peek-stat">
            <div className="n">{hu.criteria.length}</div>
            <div className="l">Critérios</div>
          </div>
          <div className="peek-stat">
            <div className="n">{hu.integrations.length}</div>
            <div className="l">Integrações</div>
          </div>
        </div>

        <div className="peek-actions">
          <Link to={`/hu/${hu.docId}`} className="btn-primary" style={{ textAlign: "center" }}>
            Abrir requisito completo
          </Link>
        </div>
      </aside>
    </>
  );
}
