import { useEffect, useMemo } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useData } from "../lib/data";
import { MdInline } from "../lib/mdblock";

/**
 * Os endpoints de um sistema, agrupados pela integração (`INT-*`)
 * que os declara, e os contratos de entrada e saída. É o que o `07` especifica
 * para quem vai construir o back end. O SEALog ainda não tem nenhum: a stack
 * não está definida (`Q-SL-01`).
 */
export default function ApiPage() {
  const { systemId } = useParams();
  const { endpoints, contracts, systemById, huById, artifactById } = useData();
  const { hash } = useLocation();

  const sys = systemId ? systemById.get(systemId) : undefined;
  const doSistema = useMemo(() => endpoints.filter((e) => e.system === systemId), [endpoints, systemId]);
  const contratos = useMemo(() => contracts.filter((c) => c.system === systemId), [contracts, systemId]);
  const grupos = useMemo(() => {
    const m = new Map<string, typeof doSistema>();
    for (const e of doSistema) {
      const k = e.int ?? "—";
      m.set(k, [...(m.get(k) ?? []), e]);
    }
    return [...m.entries()];
  }, [doSistema]);

  useEffect(() => {
    if (hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView());
  }, [hash]);

  if (!sys) return <Navigate to="/" replace />;

  return (
    <div className="page" style={{ maxWidth: 1320 }}>
      <div className="hu-topbar">
        <Link to={`/sistema/${sys.id}`} className="chip-module">
          {sys.short}
        </Link>
        <Link to={`/doc/${sys.id}/07-integracoes`} className="chip-module">
          07-integracoes.md
        </Link>
      </div>
      <h1 className="hu-title">
        API da reconstrução <span className="title-count">{doSistema.length}</span>
      </h1>

      {doSistema.length === 0 && (
        <p className="api-empty">Nenhuma tabela de endpoints no `07` deste sistema.</p>
      )}

      {grupos.map(([int, eps]) => (
        <section key={int}>
          <div className="section-heading">
            {int !== "—" ? (
              <Link to={`/id/${int}`}>
                {int} · {artifactById.get(int)?.title.replace(/`/g, "") ?? "não consta no índice"}
              </Link>
            ) : (
              "Sem integração declarada"
            )}
          </div>
          <div className="fields-scroll">
            <table className="fields-table endpoints-table">
              <thead>
                <tr>
                  <th>Método e rota</th>
                  <th>Uso</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                  <th>Tabelas</th>
                  <th>Histórias</th>
                </tr>
              </thead>
              <tbody>
                {eps.map((e) => (
                  <tr key={e.method + e.key} id={`${e.method}-${e.key}`}>
                    <td>
                      <code className="field-type">{e.method}</code> <code className="field-name">{e.route}</code>
                      {e.implementation && (
                        <div className="field-notes">
                          <MdInline text={e.implementation} />
                        </div>
                      )}
                    </td>
                    <td>
                      <MdInline text={e.purpose ?? "—"} system={sys.id} />
                      {e.notes && (
                        <div className="field-notes">
                          <MdInline text={e.notes} system={sys.id} />
                        </div>
                      )}
                    </td>
                    <td>
                      <MdInline text={e.input ?? "—"} />
                    </td>
                    <td>
                      <MdInline text={e.output ?? "—"} />
                    </td>
                    <td>
                      <MdInline text={e.tables ?? "—"} />
                    </td>
                    <td>
                      {e.hus.length
                        ? e.hus.map((h) => (
                            <Link key={h} to={`/hu/${h}`} className="hu-chip" title={huById.get(h)?.title}>
                              {h}
                            </Link>
                          ))
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {contratos.length > 0 && (
        <>
          <div className="section-heading">Contratos</div>
          {contratos.map((c) => (
            <div key={`${c.int ?? ""}-${c.name}`} className="screen-card contract-card" id={c.name}>
              <div className="screen-head">
                <span className="screen-name">
                  <code className="md-code">{c.name}</code>
                </span>
                {c.int && <span className="screen-route">{c.int}</span>}
              </div>
              <table className="fields-table">
                <thead>
                  <tr>
                    <th>Campo</th>
                    <th>Tipo</th>
                    <th>Obrig.</th>
                    <th>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {c.fields.map((f) => (
                    <tr key={f.field}>
                      <td>
                        <code className="field-name">{f.field}</code>
                      </td>
                      <td>
                        <MdInline text={f.type ?? "—"} />
                      </td>
                      <td>{f.required ?? "—"}</td>
                      <td>
                        <MdInline text={f.notes ?? "—"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
