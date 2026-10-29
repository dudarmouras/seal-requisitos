import { Link, Navigate, useParams } from "react-router-dom";
import { useData } from "../lib/data";

export default function ModulePage() {
  const { systemId, moduleId } = useParams();
  const { systemById, modules, hus, boards } = useData();

  const sys = systemId ? systemById.get(systemId) : undefined;
  const mod = modules.find((m) => m.system === systemId && m.id === moduleId);
  if (!sys || !mod) return <Navigate to="/" replace />;

  const moduleHus = hus.filter((h) => h.system === sys.id && h.module === mod.id);
  const moduleBoards = boards.filter((b) => b.system === sys.id && b.module === mod.id);

  return (
    <div className="page">
      <div className="home-hero">
        <div className="hero-eyebrow">
          <Link to={`/sistema/${sys.id}`} className="chip-module">
            {sys.label}
          </Link>
        </div>
        <h1>{mod.label}</h1>
        <p>{moduleHus.length} histórias de usuário neste módulo.</p>
      </div>

      <div className="hu-list">
        {moduleHus.map((hu) => (
          <Link key={hu.docId} to={`/hu/${hu.docId}`} className="hu-list-item">
            <span className="code">{hu.docId}</span>
            <span className="t">{hu.title}</span>
            {hu.priority && (
              <span className={"prio prio-" + hu.priority.toLowerCase().replace("é", "e")}>
                {hu.priority}
              </span>
            )}
            <span className="meta">
              {hu.rules.length} RN · {hu.criteria.length} CA
            </span>
          </Link>
        ))}
      </div>

      {moduleBoards.length > 0 && (
        <>
          <div className="section-heading">Fluxogramas deste módulo</div>
          <div className="hu-list">
            {moduleBoards.map((board) => (
              <Link key={board.docId} to={`/fluxos/${board.docId}`} className="hu-list-item">
                <span className="code">{board.docId}</span>
                <span className="t">{board.title}</span>
                <span className="meta">{board.hus.length} HUs</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
