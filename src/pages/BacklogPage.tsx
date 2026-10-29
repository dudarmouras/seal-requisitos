import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../lib/data";
import { MdInline } from "../lib/mdblock";
import { classeDePrioridade, idsDoTexto, tabelaDaSecao } from "../lib/produto";
import ProdutoTopbar from "../components/ProdutoTopbar";
import type { Artifact, Hu } from "../lib/types";

const MOSCOW = ["Must", "Should", "Could", "Won't"] as const;
const VALORES = ["Alto", "Médio", "Baixo"];
const ESFORCOS = ["P", "M", "G"];
const FORA = "Fora";

const releaseDe = (b: Artifact) => b.fields["Release"]?.match(/R\d+/)?.[0] ?? FORA;
const classeMoscow = (m: string | undefined) => "moscow moscow-" + (m ?? "").toLowerCase().replace(/[^a-z]/g, "");

/** A ordem do backlog contraria a prioridade da HU: Must com HU não Alta, ou Should/Could com HU Alta. */
function divergeDaHu(moscow: string | undefined, hu: Hu | undefined) {
  if (!hu?.priority || !moscow || moscow === "Won't") return false;
  return moscow === "Must" ? hu.priority !== "Alta" : hu.priority === "Alta";
}

/**
 * Backlog e priorização (`BL-*`), de `docs/00-visao-geral/backlog.md`. Agrupa por release,
 * mostra a classe MoSCoW, valor, esforço e dependências de cada item, a prioridade da HU que
 * ele entrega — e onde as duas divergem —, e confere que toda HU navegável está no backlog.
 */
export default function BacklogPage() {
  const { artifacts, documentByKey, hus, huById } = useData();
  const [moscow, setMoscow] = useState<string | null>(null);

  const itens = useMemo(() => artifacts.filter((a) => a.kind === "BL"), [artifacts]);
  const releases = tabelaDaSecao(documentByKey.get("geral/backlog"), "Releases");

  const noBacklog = useMemo(() => new Set(itens.flatMap((b) => idsDoTexto(b.fields["HUs"]))), [itens]);
  const foraDoBacklog = hus.filter((h) => !noBacklog.has(h.docId));
  const divergentes = itens.filter((b) => idsDoTexto(b.fields["HUs"]).some((id) => divergeDaHu(b.fields["MoSCoW"], huById.get(id))));

  const visiveis = itens.filter((b) => !moscow || b.fields["MoSCoW"] === moscow);
  const grupos = [...new Set(itens.map(releaseDe))].map((r) => ({
    codigo: r,
    meta: releases.find((x) => (r === FORA ? /fora/i.test(x["Release"] ?? "") : (x["Release"] ?? "").includes(r))),
    itens: visiveis.filter((b) => releaseDe(b) === r),
  }));

  return (
    <div className="page produto-page">
      <ProdutoTopbar file="backlog" />
      <h1 className="hu-title">
        Backlog e priorização <span className="title-count">{itens.length}</span>
      </h1>
      <p className="produto-lead">
        Os itens em ordem de entrega. A classe <strong>MoSCoW</strong> diz se a release funciona sem o item; valor,
        esforço e dependência decidem a ordem. Por isso a ordem pode divergir da prioridade escrita na história, e a
        página mostra onde.
      </p>

      <div className="stat-row">
        {MOSCOW.map((m) => (
          <div key={m} className="stat-card">
            <div className="n">{itens.filter((b) => b.fields["MoSCoW"] === m).length}</div>
            <div className="l">{m}</div>
          </div>
        ))}
        <div className="stat-card">
          <div className="n">
            {hus.length - foraDoBacklog.length}/{hus.length}
          </div>
          <div className="l">Histórias no backlog</div>
        </div>
        <div className="stat-card">
          <div className="n">{divergentes.length}</div>
          <div className="l">Ordem ≠ prioridade da HU</div>
        </div>
      </div>

      {foraDoBacklog.length > 0 && (
        <div className="produto-alerta">
          <strong>Histórias fora do backlog:</strong>{" "}
          {foraDoBacklog.map((h, i) => (
            <span key={h.docId}>
              {i > 0 && ", "}
              <Link to={`/hu/${h.docId}`}>{h.docId}</Link>
            </span>
          ))}
        </div>
      )}

      <div className="section-heading">Valor × esforço</div>
      <div className="matriz">
        <div />
        {ESFORCOS.map((e) => (
          <div key={e} className="matriz-eixo">
            Esforço {e}
          </div>
        ))}
        {VALORES.map((v) => (
          <MatrizLinha key={v} valor={v} itens={itens} />
        ))}
      </div>
      <p className="matriz-legenda">
        Canto superior esquerdo: muito valor, pouco esforço — entra primeiro. Itens Won't em cinza.
      </p>

      <div className="catalog-filters">
        <button type="button" className={"board-tab" + (!moscow ? " active" : "")} onClick={() => setMoscow(null)}>
          Todos
        </button>
        {MOSCOW.map((m) => (
          <button key={m} type="button" className={"board-tab" + (moscow === m ? " active" : "")} onClick={() => setMoscow(m)}>
            {m}
          </button>
        ))}
      </div>

      {grupos
        .filter((g) => g.itens.length > 0)
        .map((g) => (
          <section key={g.codigo} className="release">
            <div className="release-head">
              <h2>
                <MdInline text={g.meta?.["Release"] ?? (g.codigo === FORA ? "Fora desta versão" : g.codigo)} />
              </h2>
              {g.meta?.["Objetivo"] && (
                <p>
                  <MdInline text={g.meta["Objetivo"]} />
                </p>
              )}
              <div className="release-meta">
                {g.meta?.["Casos que resolve"] && g.meta["Casos que resolve"] !== "—" && (
                  <span>
                    Resolve: <MdInline text={g.meta["Casos que resolve"]} />
                  </span>
                )}
                {g.meta?.["Fase da adoção"] && g.meta["Fase da adoção"] !== "—" && (
                  <span>
                    Adoção: <Link to="/adocao">{g.meta["Fase da adoção"]}</Link>
                  </span>
                )}
              </div>
            </div>

            <ol className="bl-list">
              {g.itens.map((b) => {
                const hus = idsDoTexto(b.fields["HUs"]);
                const depende = b.fields["Depende de"];
                return (
                  <li key={b.id} className="bl-row">
                    <span className="bl-ordem">{itens.indexOf(b) + 1}</span>
                    <div className="bl-main">
                      <div className="bl-titulo">
                        <MdInline text={b.fields["Item"] ?? b.title} />
                      </div>
                      {b.fields["Por quê"] && (
                        <p className="bl-porque">
                          <MdInline text={b.fields["Por quê"]} />
                        </p>
                      )}
                      <div className="bl-links">
                        <Link to={`/id/${b.id}`} className="bl-id">
                          {b.id}
                        </Link>
                        {hus.map((id) => {
                          const hu = huById.get(id);
                          return (
                            <span key={id} className="bl-hu">
                              <Link to={`/hu/${id}`} title={hu?.title} className="code">
                                {id}
                              </Link>
                              {hu?.priority && <span className={"prio prio-" + classeDePrioridade(hu.priority)}>{hu.priority}</span>}
                              {divergeDaHu(b.fields["MoSCoW"], hu) && (
                                <span className="bl-diverge" title="A ordem do backlog diverge da prioridade escrita na história">
                                  ≠ ordem
                                </span>
                              )}
                            </span>
                          );
                        })}
                        {hus.length === 0 && <span className="bl-habilitador">{b.fields["MoSCoW"] === "Won't" ? "sem história" : "habilitador"}</span>}
                        {depende && depende !== "—" && (
                          <span className="bl-depende">
                            depende de <MdInline text={depende} />
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bl-meta">
                      <span className={classeMoscow(b.fields["MoSCoW"])}>{b.fields["MoSCoW"] ?? "—"}</span>
                      <span className="bl-va">
                        Valor <strong>{b.fields["Valor"] ?? "—"}</strong>
                      </span>
                      <span className="bl-va">
                        Esforço <strong>{b.fields["Esforço"] ?? "—"}</strong>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
    </div>
  );
}

function MatrizLinha({ valor, itens }: { valor: string; itens: Artifact[] }) {
  return (
    <>
      <div className="matriz-eixo">Valor {valor.toLowerCase()}</div>
      {ESFORCOS.map((e) => (
        <div key={e} className="matriz-celula">
          {itens
            .filter((b) => b.fields["Valor"] === valor && b.fields["Esforço"] === e)
            .map((b) => (
              <Link key={b.id} to={`/id/${b.id}`} className={classeMoscow(b.fields["MoSCoW"]) + " matriz-item"} title={b.fields["Item"] ?? b.title}>
                {b.id.replace(/^BL-[A-Z]{2}-/, "")}
              </Link>
            ))}
        </div>
      ))}
    </>
  );
}
