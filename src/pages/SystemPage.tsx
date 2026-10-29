import { Link, Navigate, useParams } from "react-router-dom";
import { useData } from "../lib/data";
import { KIND_LABEL } from "./CatalogPage";
import { numeroDoArquivo, rotuloDoArquivo } from "../lib/docs";
import type { ArtifactKind } from "../lib/types";
import DownloadPdfButtons from "../components/DownloadPdfButtons";

export default function SystemPage() {
  const { systemId } = useParams();
  const { systemById, modules, hus, boards, screens, documents, artifacts, endpoints } = useData();

  const sys = systemId ? systemById.get(systemId) : undefined;
  if (!sys) return <Navigate to="/" replace />;

  const sysModules = modules.filter((m) => m.system === sys.id);
  const sysHus = hus.filter((h) => h.system === sys.id);
  const sysBoards = boards.filter((b) => b.system === sys.id);
  const sysScreens = screens.filter((s) => s.system === sys.id);
  const sysDocs = documents.filter((d) => d.system === sys.id);
  const sysArtifacts = artifacts.filter((a) => a.system === sys.id);
  const sysEndpoints = endpoints.filter((e) => e.system === sys.id);
  const kinds = (Object.keys(KIND_LABEL) as ArtifactKind[])
    .map((k) => [k, sysArtifacts.filter((a) => a.kind === k).length] as const)
    .filter(([, n]) => n > 0);
  const semDesfecho = (k: ArtifactKind) => sysArtifacts.filter((a) => a.kind === k && !a.hasOutcome).length;

  return (
    <div className="page">
      <div className="home-hero">
        <div className="hero-eyebrow">
          <span className="sys-badge">{sys.short}</span> Sistema
        </div>
        <h1>{sys.label}</h1>
        {sys.legacyStack && (
          <p>
            Stack legada: <strong>{sys.legacyStack}</strong>
          </p>
        )}
        <DownloadPdfButtons
          systemId={sys.id}
          temPranchas={sysBoards.some((b) => b.nodes.length > 0)}
        />
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="n">{sysHus.length}</div>
          <div className="l">Histórias de usuário</div>
        </div>
        <div className="stat-card">
          <div className="n">{sysModules.length}</div>
          <div className="l">Módulos</div>
        </div>
        <div className="stat-card">
          <div className="n">{sysBoards.length}</div>
          <div className="l">Fluxogramas</div>
        </div>
        <div className="stat-card">
          <div className="n">{sysScreens.length}</div>
          <div className="l">Telas</div>
        </div>
      </div>

      <div className="section-heading">Módulos</div>
      <div className="module-grid">
        {sysModules.map((mod) => {
          const count = sysHus.filter((h) => h.module === mod.id).length;
          return (
            <Link
              key={mod.id}
              to={`/sistema/${sys.id}/modulo/${mod.id}`}
              className="module-card"
            >
              <strong>{mod.label}</strong>
              <span>{count} histórias de usuário</span>
            </Link>
          );
        })}
      </div>

      <div className="section-heading">Documentação</div>
      <div className="doc-grid">
        {sysDocs.map((d) => (
          <Link key={d.file} to={`/doc/${sys.id}/${d.file}`} className="module-card">
            <strong>
              {numeroDoArquivo(d.file)} · {rotuloDoArquivo(d.file, d.title)}
            </strong>
            <span>{d.sections.length} seções</span>
          </Link>
        ))}
      </div>

      {(kinds.length > 0 || sysEndpoints.length > 0) && (
        <>
          <div className="section-heading">Catálogos</div>
          <div className="doc-grid">
            {kinds.map(([k, n]) => (
              <Link key={k} to={`/sistema/${sys.id}/catalogo/${k}`} className="module-card">
                <strong>{KIND_LABEL[k]}</strong>
                <span>{n} {k === "DIV" || k === "Q" ? `· ${semDesfecho(k)} sem desfecho` : "itens"}</span>
              </Link>
            ))}
            {sysEndpoints.length > 0 && (
              <Link to={`/sistema/${sys.id}/api`} className="module-card">
                <strong>API da reconstrução</strong>
                <span>{sysEndpoints.length} endpoints</span>
              </Link>
            )}
          </div>
        </>
      )}

      {sysBoards.length > 0 && (
        <>
          <div className="section-heading">Fluxogramas</div>
          <div className="hu-list">
            {sysBoards.map((board) => (
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
