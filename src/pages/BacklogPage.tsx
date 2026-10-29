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
const NIVEIS: Record<string, string> = { Must: "Essencial", Should: "Importante", Could: "Desejável", "Won't": "Fora desta versão" };
const nivelDe = (m: string | undefined) => (m && NIVEIS[m]) || "Sem classe";

const releaseDe = (b: Artifact) => b.fields["Release"]?.match(/R\d+/)?.[0] ?? FORA;
const classeMoscow = (m: string | undefined) => "moscow moscow-" + (m ?? "").toLowerCase().replace(/[^a-z]/g, "");
const classeCamada = (c: string) => c.toLowerCase().replace(/[^a-z]/g, "");

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
  const [camada, setCamada] = useState<string | null>(null);
  const [visao, setVisao] = useState<"release" | "prioridade">("release");

  // A ordem de entrega vem da coluna `Ordem`; os ids não seguem a ordem, porque são estáveis.
  const itens = useMemo(
    () =>
      artifacts
        .filter((a) => a.kind === "BL")
        .sort((a, b) => Number(a.fields["Ordem"] ?? Infinity) - Number(b.fields["Ordem"] ?? Infinity)),
    [artifacts]
  );
  const camadas = useMemo(() => [...new Set(itens.map((b) => b.fields["Camada"]).filter(Boolean))] as string[], [itens]);
  const releases = tabelaDaSecao(documentByKey.get("geral/backlog"), "Releases");
  const processo = tabelaDaSecao(documentByKey.get("geral/backlog"), "Processo de desenvolvimento");

  const noBacklog = useMemo(() => new Set(itens.flatMap((b) => idsDoTexto(b.fields["HUs"]))), [itens]);
  const foraDoBacklog = hus.filter((h) => !noBacklog.has(h.docId));
  const divergentes = itens.filter((b) => idsDoTexto(b.fields["HUs"]).some((id) => divergeDaHu(b.fields["MoSCoW"], huById.get(id))));

  const visiveis = itens.filter(
    (b) => (!moscow || b.fields["MoSCoW"] === moscow) && (!camada || b.fields["Camada"] === camada)
  );
  const ordemValor = (b: Artifact) => VALORES.indexOf(b.fields["Valor"] ?? "");
  const grupos =
    visao === "release"
      ? [...new Set(itens.map(releaseDe))].map((r) => ({
          codigo: r,
          meta: releases.find((x) => (r === FORA ? /fora/i.test(x["Release"] ?? "") : (x["Release"] ?? "").includes(r))),
          titulo: undefined as string | undefined,
          itens: visiveis.filter((b) => releaseDe(b) === r),
        }))
      : MOSCOW.map((m) => ({
          codigo: m as string,
          meta: undefined,
          titulo: `${NIVEIS[m]} (${m})`,
          // Dentro do nível: mais valor primeiro, e a ordem de entrega desempata.
          itens: visiveis.filter((b) => b.fields["MoSCoW"] === m).sort((a, b) => ordemValor(a) - ordemValor(b)),
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
            <div className="l">{NIVEIS[m]}</div>
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
        <button type="button" className={"board-tab" + (visao === "release" ? " active" : "")} onClick={() => setVisao("release")}>
          Por release
        </button>
        <button type="button" className={"board-tab" + (visao === "prioridade" ? " active" : "")} onClick={() => setVisao("prioridade")}>
          Por prioridade
        </button>
        <span className="filtro-sep" />
        <button type="button" className={"board-tab" + (!moscow ? " active" : "")} onClick={() => setMoscow(null)}>
          Todos
        </button>
        {MOSCOW.map((m) => (
          <button key={m} type="button" className={"board-tab" + (moscow === m ? " active" : "")} onClick={() => setMoscow(m)}>
            {NIVEIS[m]}
          </button>
        ))}
        {camadas.length > 0 && <span className="filtro-sep" />}
        {camadas.map((c) => (
          <button key={c} type="button" className={"board-tab" + (camada === c ? " active" : "")} onClick={() => setCamada(camada === c ? null : c)}>
            {c}
          </button>
        ))}
      </div>

      {grupos
        .filter((g) => g.itens.length > 0)
        .map((g) => (
          <section key={g.codigo} className="release">
            <div className="release-head">
              <h2>
                <MdInline text={g.titulo ?? g.meta?.["Release"] ?? (g.codigo === FORA ? "Fora desta versão" : g.codigo)} />
                {visao === "prioridade" && <span className="title-count">{g.itens.length}</span>}
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
                    <span className="bl-ordem">{b.fields["Ordem"] ?? "—"}</span>
                    <div className="bl-main">
                      {b.fields["Camada"] && <span className={"bl-camada bl-camada-" + classeCamada(b.fields["Camada"])}>{b.fields["Camada"]}</span>}
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
                      <span className={classeMoscow(b.fields["MoSCoW"])} title={b.fields["MoSCoW"]}>
                        {nivelDe(b.fields["MoSCoW"])}
                      </span>
                      {visao === "prioridade" && <span className="bl-va">{b.fields["Release"] ?? "—"}</span>}
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

      {processo.length > 0 && (
        <section className="release">
          <div className="release-head">
            <h2>Processo de desenvolvimento</h2>
            <p>Todo item percorre estas etapas, do backlog ao uso real.</p>
          </div>
          <ol className="bl-list">
            {processo.map((e, i) => (
              <li key={i} className="bl-row">
                <span className="bl-ordem">{i + 1}</span>
                <div className="bl-main">
                  <div className="bl-titulo">
                    <MdInline text={(e["Etapa"] ?? "").replace(/^\**\d+\.\s*/, "").replace(/\*\*$/, "")} />
                  </div>
                  <p className="bl-porque">
                    <MdInline text={e["O que acontece"] ?? ""} />
                  </p>
                </div>
                <div className="bl-meta">
                  <span className="bl-va">
                    Quem <strong>{e["Quem"] ?? "—"}</strong>
                  </span>
                  <span className="bl-va">
                    Sai quando <MdInline text={e["Sai quando"] ?? "—"} />
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
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
