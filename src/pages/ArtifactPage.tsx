import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useData } from "../lib/data";
import MdBlock, { MdInline, useIdHref } from "../lib/mdblock";
import { KIND_LABEL } from "./CatalogPage";
import { PAGINA_DO_TIPO } from "../lib/produto";

/**
 * Página de um id do índice — regra do catálogo, entidade, integração, mensagem,
 * divergência ou pergunta. Mostra o texto que o define e, no sentido inverso,
 * quem o usa: as HUs que aplicam a regra, os endpoints da integração, as
 * divergências que o citam.
 */
export default function ArtifactPage() {
  const { id } = useParams();
  const { artifactById, hus, endpoints, artifacts, systemById, issuesCiting } = useData();
  const href = useIdHref();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  const art = id ? artifactById.get(id) : undefined;
  if (!art) return <Navigate to="/" replace />;

  const sys = systemById.get(art.system);
  const husQueAplicam =
    art.kind === "RN"
      ? hus.filter((h) => h.rules.some((r) => (r.catalog ?? "").includes(art.id)))
      : art.kind === "INT"
        ? hus.filter((h) => h.integrations.includes(art.id))
        : [];
  const endpointsDaInt = art.kind === "INT" ? endpoints.filter((e) => e.int === art.id) : [];
  const citadoPor = artifacts.filter((a) => a.id !== art.id && a.cites.includes(art.id) && a.kind !== "DIV" && a.kind !== "Q");
  const pendencias = issuesCiting.get(art.id) ?? [];

  return (
    <div className="page page-doc">
      <div className="hu-topbar">
        {sys && (
          <Link to={`/sistema/${sys.id}`} className="chip-module">
            {sys.short}
          </Link>
        )}
        {/* Os ids da visão de produto não são de sistema: voltam à página própria. */}
        <Link to={PAGINA_DO_TIPO[art.kind] ?? `/sistema/${art.system}/catalogo/${art.kind}`} className="chip-module">
          {KIND_LABEL[art.kind]}
        </Link>
        {art.severity && <span className="chip-module">Severidade {art.severity}</span>}
        {art.hasOutcome !== null && (
          <span className={"chip-module " + (art.hasOutcome ? "chip-ok" : "chip-open")}>
            {art.hasOutcome ? "com desfecho" : "sem desfecho"}
          </span>
        )}
        <div className="hu-pager">
          <Link to={`/doc/${art.system}/${art.file}#${art.anchor}`} className="pager-btn">
            Ver no documento ↗
          </Link>
        </div>
      </div>

      <div className="hu-code">{art.id}</div>
      <h1 className="hu-title">
        <MdInline text={art.title} system={art.system} />
      </h1>

      <MdBlock text={art.text} system={art.system} idBase={art.id} />

      {husQueAplicam.length > 0 && (
        <>
          <div className="hu-section-label">
            {art.kind === "RN" ? "Histórias que aplicam esta regra" : "Histórias que usam esta integração"}
            <span className="n">{husQueAplicam.length}</span>
          </div>
          <div className="legend-items">
            {husQueAplicam.map((h) => (
              <Link key={h.docId} to={`/hu/${h.docId}`} className="legend-item">
                <span className="code">{h.docId}</span>
                <span>{h.title}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {endpointsDaInt.length > 0 && (
        <>
          <div className="hu-section-label">
            Endpoints <span className="n">{endpointsDaInt.length}</span>
          </div>
          <div className="hu-list">
            {endpointsDaInt.map((e) => (
              <Link key={e.method + e.key} to={`/sistema/${e.system}/api#${e.method}-${e.key}`} className="hu-list-item">
                <span className="code">{e.method}</span>
                <span className="t">
                  <code className="md-code">{e.route}</code>
                </span>
                <span className="meta">{e.hus.length} HUs</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {citadoPor.length > 0 && (
        <>
          <div className="hu-section-label">
            Citado por <span className="n">{citadoPor.length}</span>
          </div>
          <div className="legend-items">
            {citadoPor.map((a) => (
              <Link key={a.id} to={`/id/${a.id}`} className="legend-item">
                <span className="code">{a.id}</span>
                <span>
                  <MdInline text={a.title} />
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {pendencias.length > 0 && (
        <>
          <div className="hu-section-label">
            Divergências e perguntas que citam este id <span className="n">{pendencias.length}</span>
          </div>
          <div className="legend-items">
            {pendencias.map((a) => (
              <Link key={a.id} to={href(a.id) ?? "#"} className="legend-item">
                <span className="code">{a.id}</span>
                <span>
                  <MdInline text={a.title} />
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
