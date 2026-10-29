import Md from "../lib/md";
import type { Integration } from "../lib/types";

/**
 * Integrações e APIs da HU. Os `INT-*` citados na história são resolvidos contra o
 * catálogo global consolidado; quando um id não está no catálogo, ele aparece
 * mesmo assim, sem nome — o vazio é informação (aponta divergência entre a HU
 * e o catálogo).
 */
export default function HuIntegrations({
  ids,
  note,
  catalog,
}: {
  ids: string[];
  note: string | null;
  catalog: Map<string, Integration>;
}) {
  if (ids.length === 0) {
    return (
      <p className="api-empty">
        Nenhuma integração externa prevista para esta história de usuário.
      </p>
    );
  }

  return (
    <>
      <div className="api-list">
        {ids.map((id) => {
          const it = catalog.get(id);
          return (
            <div key={id} className="api-card">
              <div className="api-head">
                <span className="api-name">{id}</span>
                <span className="api-purpose">
                  {it?.name ?? "não consta no catálogo consolidado"}
                </span>
              </div>
              {it && (
                <div className="api-services">
                  {it.direction && (
                    <>
                      <span className="api-services-label">Direção</span>
                      <span className="api-meta">
                        <Md text={it.direction} />
                      </span>
                    </>
                  )}
                  {it.nature && (
                    <>
                      <span className="api-services-label">Natureza</span>
                      <span className="api-meta">
                        <Md text={it.nature} />
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {note && (
        <p className="api-note">
          <Md text={note} />
        </p>
      )}
    </>
  );
}
