import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../lib/data";
import { MdInline } from "../lib/mdblock";
import ProdutoTopbar from "../components/ProdutoTopbar";

const STATUS = ["Tomada", "Proposta", "Em aberto"] as const;
const CLASSE_STATUS: Record<string, string> = { Tomada: "chip-ok", Proposta: "chip-module", "Em aberto": "chip-open" };

/** Os campos de uma decisão que a página abre, na ordem em que se leem. */
const DETALHE = ["Contexto", "Alternativas descartadas", "Consequências", "Referências"];

/**
 * Principais decisões (`DEC-*`), de `docs/00-visao-geral/decisoes.md`. Cada decisão é uma
 * seção com a tabela **Campo** | valor; a página filtra por status e por tema, e lista no fim
 * as perguntas ao cliente que as decisões citam e que ainda não têm desfecho.
 */
export default function DecisoesPage() {
  const { artifacts, artifactById } = useData();
  const [status, setStatus] = useState<string | null>(null);
  const [tema, setTema] = useState<string | null>(null);
  const [abertas, setAbertas] = useState<Set<string>>(new Set());

  const decisoes = useMemo(() => artifacts.filter((a) => a.kind === "DEC"), [artifacts]);
  const temas = useMemo(() => [...new Set(decisoes.map((d) => d.fields["Tema"]).filter(Boolean))], [decisoes]);
  const lista = decisoes.filter((d) => (!status || d.fields["Status"] === status) && (!tema || d.fields["Tema"] === tema));

  // Perguntas que travam decisões: Q citada por uma DEC e sem desfecho.
  const perguntas = useMemo(() => {
    const ids = new Set(decisoes.flatMap((d) => d.cites.filter((c) => c.startsWith("Q-"))));
    return [...ids]
      .map((id) => artifactById.get(id))
      .filter((q): q is NonNullable<typeof q> => !!q && !q.hasOutcome)
      .sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
  }, [decisoes, artifactById]);

  const alternar = (id: string) =>
    setAbertas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="page">
      <ProdutoTopbar file="decisoes" />
      <h1 className="hu-title">
        Principais decisões <span className="title-count">{decisoes.length}</span>
      </h1>
      <p className="produto-lead">
        O que foi decidido, por quê, o que se descartou e o que cada decisão custa. <strong>Tomada</strong> é
        decisão da equipe; <strong>Proposta</strong> depende de confirmação da SEALog; <strong>Em aberto</strong>{" "}
        ainda espera informação.
      </p>

      <div className="stat-row">
        {STATUS.map((s) => (
          <div key={s} className="stat-card">
            <div className="n">{decisoes.filter((d) => d.fields["Status"] === s).length}</div>
            <div className="l">{s}</div>
          </div>
        ))}
        <div className="stat-card">
          <div className="n">{perguntas.length}</div>
          <div className="l">Perguntas que travam decisões</div>
        </div>
      </div>

      <div className="catalog-filters">
        <button type="button" className={"board-tab" + (!status ? " active" : "")} onClick={() => setStatus(null)}>
          Todos os status
        </button>
        {STATUS.map((s) => (
          <button key={s} type="button" className={"board-tab" + (status === s ? " active" : "")} onClick={() => setStatus(s)}>
            {s}
          </button>
        ))}
        <span className="filtro-sep" />
        <button type="button" className={"board-tab" + (!tema ? " active" : "")} onClick={() => setTema(null)}>
          Todos os temas
        </button>
        {temas.map((t) => (
          <button key={t} type="button" className={"board-tab" + (tema === t ? " active" : "")} onClick={() => setTema(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="dec-list">
        {lista.map((d) => {
          const aberta = abertas.has(d.id);
          return (
            <article key={d.id} className="dec-card">
              <header className="dec-head">
                <Link to={`/id/${d.id}`} className="code">
                  {d.id}
                </Link>
                <span className={"chip-module " + (CLASSE_STATUS[d.fields["Status"]] ?? "")}>{d.fields["Status"] ?? "sem status"}</span>
                {d.fields["Tema"] && <span className="chip-module chip-file">{d.fields["Tema"]}</span>}
                {d.fields["Data"] && <span className="dec-date">{d.fields["Data"]}</span>}
              </header>
              <h2 className="dec-title">
                <MdInline text={d.title} system={d.system} />
              </h2>
              <p className="dec-decisao">
                <MdInline text={d.fields["Decisão"] ?? "Decisão não informada no documento."} system={d.system} />
              </p>
              {aberta && (
                <dl className="dec-detalhe">
                  {DETALHE.filter((k) => d.fields[k] && d.fields[k] !== "—").map((k) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>
                        <MdInline text={d.fields[k]} system={d.system} />
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              <button type="button" className="dec-toggle" onClick={() => alternar(d.id)}>
                {aberta ? "Recolher" : "Contexto, alternativas e consequências"}
              </button>
            </article>
          );
        })}
        {lista.length === 0 && <p className="produto-vazio">Nenhuma decisão com esse filtro.</p>}
      </div>

      {perguntas.length > 0 && (
        <>
          <div className="section-heading">Perguntas à SEALog que as decisões esperam</div>
          <div className="hu-list">
            {perguntas.map((q) => (
              <Link key={q.id} to={`/id/${q.id}`} className="hu-list-item">
                <span className="code">{q.id}</span>
                <span className="t">
                  <MdInline text={q.title} />
                </span>
                <span className="meta">
                  {decisoes.filter((d) => d.cites.includes(q.id)).map((d) => d.id).join(", ")}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
