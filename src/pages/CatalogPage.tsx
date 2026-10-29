import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useData } from "../lib/data";
import { MdInline } from "../lib/mdblock";
import type { ArtifactKind } from "../lib/types";

export const KIND_LABEL: Record<ArtifactKind, string> = {
  RN: "Regras de negócio",
  ENT: "Entidades de dados",
  INT: "Integrações",
  MSG: "Mensagens e erros",
  DIV: "Divergências",
  Q: "Perguntas ao cliente",
  DEC: "Decisões",
  RF: "Requisitos funcionais",
  RNF: "Requisitos não funcionais",
  BL: "Itens de backlog",
};

const KINDS = Object.keys(KIND_LABEL) as ArtifactKind[];

type Filtro = "todas" | "sem" | "com";

/** Lista de um tipo de id do índice, num sistema. DIV e Q filtram por desfecho.     */
export default function CatalogPage() {
  const { systemId, kind } = useParams();
  const { artifacts, systemById } = useData();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todas");

  const sys = systemId ? systemById.get(systemId) : undefined;
  const tipo = KINDS.includes(kind as ArtifactKind) ? (kind as ArtifactKind) : null;

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return artifacts.filter(
      (a) =>
        a.system === systemId &&
        a.kind === tipo &&
        (filtro === "todas" || (filtro === "com") === Boolean(a.hasOutcome)) &&
        (!q || a.id.toLowerCase().includes(q) || a.title.toLowerCase().includes(q) || a.text.toLowerCase().includes(q))
    );
  }, [artifacts, systemId, tipo, busca, filtro]);

  if (!sys || !tipo) return <Navigate to={sys ? `/sistema/${sys.id}` : "/"} replace />;

  const comDesfecho = tipo === "DIV" || tipo === "Q";
  const contagem = (k: ArtifactKind) => artifacts.filter((a) => a.system === sys.id && a.kind === k).length;

  return (
    <div className="page">
      <div className="hu-topbar">
        <Link to={`/sistema/${sys.id}`} className="chip-module">
          {sys.short}
        </Link>
        {KINDS.filter((k) => contagem(k) > 0).map((k) => (
          <Link key={k} to={`/sistema/${sys.id}/catalogo/${k}`} className={"chip-module" + (k === tipo ? " chip-active" : "")}>
            {KIND_LABEL[k]} · {contagem(k)}
          </Link>
        ))}
      </div>

      <h1 className="hu-title">
        {KIND_LABEL[tipo]} <span className="title-count">{lista.length}</span>
      </h1>

      <div className="catalog-filters">
        <input
          className="catalog-search"
          placeholder="Filtrar por id ou texto…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        {comDesfecho &&
          (["todas", "sem", "com"] as Filtro[]).map((f) => (
            <button
              key={f}
              type="button"
              className={"board-tab" + (filtro === f ? " active" : "")}
              onClick={() => setFiltro(f)}
            >
              {f === "todas" ? "Todas" : f === "sem" ? "Sem desfecho" : "Com desfecho"}
            </button>
          ))}
      </div>

      <div className="hu-list">
        {lista.map((a) => (
          <Link key={a.id} to={`/id/${a.id}`} className="hu-list-item">
            <span className="code">{a.id}</span>
            <span className="t">
              <MdInline text={a.title} />
            </span>
            {a.severity && <span className="meta">{a.severity}</span>}
            {a.hasOutcome !== null && <span className="meta">{a.hasOutcome ? "com desfecho" : "sem desfecho"}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
