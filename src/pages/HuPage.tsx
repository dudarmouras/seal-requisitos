import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { numeroDaPrancha } from "../lib/flow";
import { useData } from "../lib/data";
import Md from "../lib/md";
import RuleList from "../components/RuleList";
import CriteriaCards from "../components/CriteriaCards";
import HuIntegrations from "../components/HuIntegrations";
import ScreenFields from "../components/ScreenFields";
import MermaidBoard from "../components/MermaidBoard";
import FlowBoard from "../components/FlowBoard";
import HuVersion from "../components/HuVersion";

export default function HuPage() {
  const { huId } = useParams();
  const { hus, huById, huBoards, boards, screenById, systemById, integrationById, endpoints, issuesCiting } =
    useData();
  const navigate = useNavigate();

  // Chip de HU na prévia leva à página daquela HU — é o caminho de volta do
  // desenho para o requisito.
  const irParaHu = useCallback((id: string) => navigate(`/hu/${id}`), [navigate]);

  const hu = huId ? huById.get(huId) : undefined;

  const boardIds = useMemo(() => (hu ? huBoards.get(hu.docId) ?? [] : []), [hu, huBoards]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [telasAbertas, setTelasAbertas] = useState(false);

  useEffect(() => {
    setActiveBoardId(boardIds[0] ?? null);
    window.scrollTo({ top: 0 });
  }, [boardIds]);

  if (!hu) return <Navigate to="/" replace />;

  const sys = systemById.get(hu.system);
  // Anterior/próxima dentro do módulo — em 584 HUs, paginar pela lista global
  // atravessaria sistemas sem aviso.
  const siblings = hus.filter((h) => h.system === hu.system && h.module === hu.module);
  const idx = siblings.findIndex((h) => h.docId === hu.docId);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const activeBoard = boards.find((b) => b.docId === activeBoardId);
  const huScreens = hu.screensRefs.map((id) => screenById.get(id)).filter(Boolean);
  const huEndpoints = endpoints.filter((e) => e.hus.includes(hu.docId));
  // Só o que ainda espera resposta: a DIV/Q já com desfecho é histórico, e está no 09.
  const pendencias = (issuesCiting.get(hu.docId) ?? []).filter((a) => !a.hasOutcome);

  return (
    <div className="page page-doc">
      <div className="hu-topbar">
        {sys && (
          <Link to={`/sistema/${sys.id}`} className="chip-module">
            {sys.short}
          </Link>
        )}
        {hu.module && (
          <Link to={`/sistema/${hu.system}/modulo/${hu.module}`} className="chip-module">
            {hu.moduleLabel ?? hu.module}
          </Link>
        )}
        {hu.priority && (
          <span className={"prio prio-" + hu.priority.toLowerCase().replace("é", "e")}>
            {hu.priority}
          </span>
        )}
        <div className="hu-pager">
          <Link
            to={`/doc/${hu.system}/03-historias-de-usuario#${hu.docId}`}
            className="pager-btn"
            title="A história no texto integral do 03"
          >
            Texto integral
          </Link>
          <Link
            to={prev ? `/hu/${prev.docId}` : "#"}
            className={"pager-btn" + (prev ? "" : " disabled")}
            title={prev ? `${prev.docId} — ${prev.title}` : undefined}
          >
            ‹ {prev ? prev.docId : "Anterior"}
          </Link>
          <Link
            to={next ? `/hu/${next.docId}` : "#"}
            className={"pager-btn" + (next ? "" : " disabled")}
            title={next ? `${next.docId} — ${next.title}` : undefined}
          >
            {next ? next.docId : "Próxima"} ›
          </Link>
        </div>
      </div>

      <div className="hu-code">{hu.docId}</div>
      <HuVersion huId={hu.docId} />
      <h1 className="hu-title">{hu.title}</h1>
      {hu.description && (
        <p className="hu-desc">
          <Md text={hu.description} />
        </p>
      )}

      {(hu.como || hu.gostaria || hu.para) && (
        <>
          <div className="hu-section-label">História de usuário</div>
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
        </>
      )}

      {activeBoard && (
        <>
          <div className="hu-section-label">Onde entra no fluxo</div>
          {boardIds.length > 1 && (
            <div className="board-tabs">
              {boardIds.map((bid) => {
                const b = boards.find((x) => x.docId === bid);
                if (!b) return null;
                return (
                  <button
                    key={bid}
                    type="button"
                    className={"board-tab" + (bid === activeBoardId ? " active" : "")}
                    onClick={() => setActiveBoardId(bid)}
                  >
                    {numeroDaPrancha(b.docId)} · {b.title}
                  </button>
                );
              })}
            </div>
          )}
          <div className="miniflow-card">
            <div className="miniflow-head">
              <span className="num">{numeroDaPrancha(activeBoard.docId)}</span>
              <span className="t">{activeBoard.title}</span>
              <Link
                to={`/fluxos/${activeBoard.docId}?hu=${hu.docId}`}
                className="miniflow-open"
              >
                Abrir fluxograma completo ↗
              </Link>
            </div>
            <div className="miniflow-body">
              {activeBoard.nodes.length ? (
                <FlowBoard
                  board={activeBoard}
                  mini
                  highlightHuId={hu.docId}
                  onHuClick={irParaHu}
                />
              ) : (
                <MermaidBoard board={activeBoard} mini />
              )}
            </div>
          </div>
        </>
      )}

      {hu.rules.length > 0 && (
        <>
          <div className="hu-section-label">
            Regras de negócio <span className="n">{hu.rules.length}</span>
          </div>
          <RuleList rules={hu.rules} />
        </>
      )}

      {hu.criteria.length > 0 && (
        <>
          <div className="hu-section-label">
            Critérios de aceitação <span className="n">{hu.criteria.length}</span>
          </div>
          <CriteriaCards criteria={hu.criteria} />
        </>
      )}

      {huScreens.length > 0 && (
        <>
          <button
            type="button"
            className={"hu-section-label section-toggle" + (telasAbertas ? " open" : "")}
            onClick={() => setTelasAbertas((v) => !v)}
            aria-expanded={telasAbertas}
          >
            <span className="section-toggle-chevron" aria-hidden="true">
              ▸
            </span>
            Telas e campos <span className="n">{huScreens.length}</span>
            <span className="section-toggle-hint">{telasAbertas ? "ocultar" : "mostrar"}</span>
          </button>
          {telasAbertas &&
            huScreens.map((screen) => <ScreenFields key={screen!.docId} screen={screen!} />)}
        </>
      )}

      <div className="hu-section-label">
        Integrações e APIs
        {hu.integrations.length > 0 && <span className="n">{hu.integrations.length}</span>}
      </div>
      <HuIntegrations
        ids={hu.integrations}
        note={hu.integrationsNote}
        catalog={integrationById}
      />

      {huEndpoints.length > 0 && (
        <>
          <div className="hu-section-label">
            Endpoints <span className="n">{huEndpoints.length}</span>
          </div>
          <div className="hu-list">
            {huEndpoints.map((e) => (
              <Link
                key={e.method + e.key}
                to={`/sistema/${e.system}/api#${e.method}-${e.key}`}
                className="hu-list-item"
              >
                <span className="code">{e.method}</span>
                <span className="t">
                  <code className="md-code">{e.route}</code>
                  {e.purpose && (
                    <span className="route">
                      <Md text={e.purpose} />
                    </span>
                  )}
                </span>
                {e.int && <span className="meta">{e.int}</span>}
              </Link>
            ))}
          </div>
        </>
      )}

      {pendencias.length > 0 && (
        <>
          <div className="hu-section-label">
            Pendências <span className="n">{pendencias.length}</span>
          </div>
          <div className="legend-items">
            {pendencias.map((a) => (
              <Link key={a.id} to={`/id/${a.id}`} className="legend-item">
                <span className="code">{a.id}</span>
                <span>
                  <Md text={a.title} />
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
