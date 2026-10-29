import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useData } from "../lib/data";
import Md from "../lib/md";
import MermaidBoard from "../components/MermaidBoard";
import FlowBoard from "../components/FlowBoard";
import { numeroDaPrancha } from "../lib/flow";
import HuPeekDrawer from "../components/HuPeekDrawer";

export default function FlowBoardPage() {
  const { boardId } = useParams();
  const { boards, huById, systemById } = useData();
  const navigate = useNavigate();
  // `?hu=HU-IN-004` destaca os nós daquela HU na prancha. É como a página da
  // HU aponta para cá sem perder o contexto de onde o leitor veio.
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightHuId = searchParams.get("hu") ?? undefined;

  const idx = boards.findIndex((b) => b.docId === boardId);
  const board = idx >= 0 ? boards[idx] : undefined;

  const [peekHuId, setPeekHuId] = useState<string | null>(null);
  useEffect(() => setPeekHuId(null), [boardId]);

  const abrirHu = useCallback((huId: string) => setPeekHuId(huId), []);
  const limparDestaque = useCallback(() => {
    const p = new URLSearchParams(searchParams);
    p.delete("hu");
    setSearchParams(p, { replace: true });
  }, [searchParams, setSearchParams]);

  // Navegação por teclado entre fluxogramas
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.target instanceof HTMLInputElement || ev.target instanceof HTMLTextAreaElement) return;
      if (ev.key === "ArrowLeft" && idx > 0) navigate(`/fluxos/${boards[idx - 1].docId}`);
      else if (ev.key === "ArrowRight" && idx >= 0 && idx < boards.length - 1)
        navigate(`/fluxos/${boards[idx + 1].docId}`);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, boards, navigate]);

  if (!board) return <Navigate to="/fluxos" replace />;

  const sys = systemById.get(board.system);
  const prev = idx > 0 ? boards[idx - 1] : null;
  const next = idx < boards.length - 1 ? boards[idx + 1] : null;

  return (
    <div className="flow-page">
      <div className="flow-topbar">
        <Link to="/fluxos" className="pager-btn">
          ‹ Fluxogramas
        </Link>
        <div className="title">
          <span className="mod">
            {sys?.label} · {board.docId}
            {board.scope ? " · " : ""}
            {board.scope && <Md text={board.scope} />}
          </span>
          <strong>
            Prancha {numeroDaPrancha(board.docId)} · {board.title}
          </strong>
        </div>
        {highlightHuId && (
          <button type="button" className="hu-highlight-pill" onClick={limparDestaque}>
            Destacando {highlightHuId} <span aria-hidden="true">×</span>
          </button>
        )}
        <Link
          to={prev ? `/fluxos/${prev.docId}` : "#"}
          className={"pager-btn" + (prev ? "" : " disabled")}
          title={prev ? `${prev.docId} · ${prev.title}` : undefined}
        >
          ‹ {prev ? prev.docId : "Anterior"}
        </Link>
        <Link
          to={next ? `/fluxos/${next.docId}` : "#"}
          className={"pager-btn" + (next ? "" : " disabled")}
          title={next ? `${next.docId} · ${next.title}` : undefined}
        >
          {next ? next.docId : "Próximo"} ›
        </Link>
      </div>

      <div className="flow-canvas">
        {board.nodes.length ? (
          <FlowBoard board={board} highlightHuId={highlightHuId} onHuClick={abrirHu} />
        ) : (
          <MermaidBoard board={board} />
        )}
      </div>

      {board.hus.length > 0 && (
        <div className="flow-legend">
          <div className="legend-title">Histórias de usuário neste fluxograma</div>
          <div className="legend-items">
            {board.hus.map((id) => {
              const hu = huById.get(id);
              return (
                <button
                  key={id}
                  type="button"
                  className="legend-item"
                  onClick={() => setPeekHuId(id)}
                  disabled={!hu}
                >
                  <span className="code">{id}</span>
                  <span>{hu?.title ?? "não encontrada no modelo"}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {peekHuId && <HuPeekDrawer huId={peekHuId} onClose={() => setPeekHuId(null)} />}
    </div>
  );
}
