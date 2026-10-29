import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useData } from "../lib/data";
import { MdInline } from "../lib/mdblock";
import { idsDoTexto } from "../lib/produto";
import ProdutoTopbar from "../components/ProdutoTopbar";
import type { Artifact } from "../lib/types";

/** Agrupa preservando a ordem em que cada grupo aparece pela primeira vez. */
function agrupar(lista: Artifact[], campo: string): [string, Artifact[]][] {
  const grupos = new Map<string, Artifact[]>();
  for (const a of lista) {
    const g = a.fields[campo] || "Sem " + campo.toLowerCase();
    grupos.set(g, [...(grupos.get(g) ?? []), a]);
  }
  return [...grupos];
}

const casa = (a: Artifact, q: string) =>
  !q || [a.id, a.title, ...Object.values(a.fields)].some((v) => v.toLowerCase().includes(q));

/**
 * Requisitos funcionais (`RF-*`) e não funcionais (`RNF-*`), de
 * `docs/00-visao-geral/requisitos.md`. O funcional aponta as HUs que o detalham; a página
 * confere que toda HU navegável está coberta por algum RF e mostra a que não está.
 */
export default function RequisitosPage() {
  const { artifacts, hus, huById } = useData();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const aba = hash === "#nao-funcionais" ? "rnf" : "rf";
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);

  useEffect(() => window.scrollTo({ top: 0 }), [aba]);

  const rf = useMemo(() => artifacts.filter((a) => a.kind === "RF"), [artifacts]);
  const rnf = useMemo(() => artifacts.filter((a) => a.kind === "RNF"), [artifacts]);
  const categorias = useMemo(() => [...new Set(rnf.map((r) => r.fields["Categoria"]).filter(Boolean))], [rnf]);

  const cobertas = useMemo(() => new Set(rf.flatMap((r) => idsDoTexto(r.fields["HUs"]))), [rf]);
  const semRf = hus.filter((h) => !cobertas.has(h.docId));

  const q = busca.trim().toLowerCase();
  const rfFiltrados = rf.filter((r) => casa(r, q));
  const rnfFiltrados = rnf.filter((r) => casa(r, q) && (!categoria || r.fields["Categoria"] === categoria));

  return (
    <div className="page produto-page">
      <ProdutoTopbar file="requisitos" />
      <h1 className="hu-title">Requisitos funcionais e não funcionais</h1>
      <p className="produto-lead">
        O funcional diz <strong>o que</strong> o sistema faz e aponta as histórias que o detalham, com critérios de
        aceitação. O não funcional diz <strong>como</strong> ele precisa se comportar, com uma meta que se possa
        verificar.
      </p>

      <div className="stat-row">
        <div className="stat-card">
          <div className="n">{rf.length}</div>
          <div className="l">Funcionais</div>
        </div>
        <div className="stat-card">
          <div className="n">{rnf.length}</div>
          <div className="l">Não funcionais</div>
        </div>
        <div className="stat-card">
          <div className="n">
            {hus.length - semRf.length}/{hus.length}
          </div>
          <div className="l">Histórias cobertas por um RF</div>
        </div>
        <div className="stat-card">
          <div className="n">{categorias.length}</div>
          <div className="l">Categorias de qualidade</div>
        </div>
      </div>

      {semRf.length > 0 && (
        <div className="produto-alerta">
          <strong>Histórias sem requisito funcional:</strong>{" "}
          {semRf.map((h, i) => (
            <span key={h.docId}>
              {i > 0 && ", "}
              <Link to={`/hu/${h.docId}`}>{h.docId}</Link>
            </span>
          ))}
        </div>
      )}

      <div className="board-tabs produto-abas">
        <button type="button" className={"board-tab" + (aba === "rf" ? " active" : "")} onClick={() => navigate({ hash: "" })}>
          Funcionais · {rf.length}
        </button>
        <button
          type="button"
          className={"board-tab" + (aba === "rnf" ? " active" : "")}
          onClick={() => navigate({ hash: "nao-funcionais" })}
        >
          Não funcionais · {rnf.length}
        </button>
      </div>

      <div className="catalog-filters">
        <input className="catalog-search" placeholder="Filtrar por id, texto ou HU…" value={busca} onChange={(e) => setBusca(e.target.value)} />
        {aba === "rnf" && (
          <>
            <button type="button" className={"board-tab" + (!categoria ? " active" : "")} onClick={() => setCategoria(null)}>
              Todas
            </button>
            {categorias.map((c) => (
              <button key={c} type="button" className={"board-tab" + (categoria === c ? " active" : "")} onClick={() => setCategoria(c)}>
                {c}
              </button>
            ))}
          </>
        )}
      </div>

      {aba === "rf" &&
        agrupar(rfFiltrados, "Módulo").map(([modulo, lista]) => (
          <section key={modulo}>
            <div className="section-heading">{modulo}</div>
            <div className="md-table-wrap">
              <table className="md-table req-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Requisito</th>
                    <th>Histórias</th>
                    <th>Regras</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Link to={`/id/${r.id}`} className="md-code md-id">
                          {r.id}
                        </Link>
                      </td>
                      <td>
                        <MdInline text={r.fields["Requisito"] ?? r.title} />
                      </td>
                      <td>
                        {idsDoTexto(r.fields["HUs"]).map((id) => {
                          const hu = huById.get(id);
                          return hu ? (
                            <Link key={id} to={`/hu/${id}`} className="req-hu" title={hu.title}>
                              <span className="code">{id}</span> {hu.title}
                            </Link>
                          ) : (
                            <span key={id} className="req-hu">
                              <span className="code">{id}</span>
                            </span>
                          );
                        })}
                      </td>
                      <td>
                        <MdInline text={r.fields["Regras"] ?? "—"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

      {aba === "rnf" &&
        agrupar(rnfFiltrados, "Categoria").map(([cat, lista]) => (
          <section key={cat}>
            <div className="section-heading">{cat}</div>
            <div className="md-table-wrap">
              <table className="md-table req-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Requisito</th>
                    <th>Meta</th>
                    <th>Como verificar</th>
                    <th>Origem</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Link to={`/id/${r.id}`} className="md-code md-id">
                          {r.id}
                        </Link>
                      </td>
                      <td>
                        <MdInline text={r.fields["Requisito"] ?? r.title} />
                      </td>
                      <td>
                        <MdInline text={r.fields["Meta"] ?? "—"} />
                      </td>
                      <td>
                        <MdInline text={r.fields["Como verificar"] ?? "—"} />
                      </td>
                      <td>
                        <MdInline text={r.fields["Origem"] ?? "—"} />
                        {/proposta/i.test(r.fields["Origem"] ?? "") && <span className="chip-module chip-open req-proposta">meta proposta</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
    </div>
  );
}
