import Md from "../lib/md";
import type { Screen } from "../lib/types";

function Required({ value }: { value: boolean | string | null }) {
  if (value === true) return <span className="req-yes">Sim</span>;
  if (value === false) return <span className="req-no">Não</span>;
  if (!value) return <span className="req-no">—</span>;
  return <span className="req-cond">{value}</span>;
}

/** `varchar` + `190` viram `varchar(190)`, como no app de referência. */
function tipo(type: string | null, size: number | string | null) {
  if (!type) return null;
  return size != null && size !== "" ? `${type}(${size})` : type;
}

/**
 * Dicionário de campos de uma tela — mesmas seis colunas do app de referência
 * SIAL: campo, tipo, obrigatório, máscara, validações e origem no banco. O
 * controle de tela do legado (`TextBox`, `DropDownList`) não é coluna: fica no
 * nome do campo, e a observação entra sob as validações.
 */
export default function ScreenFields({ screen }: { screen: Screen }) {
  if (screen.groups.length === 0) {
    return (
      <p className="api-empty">
        A documentação de origem não relaciona os campos desta tela.
      </p>
    );
  }

  const varios = screen.groups.length > 1;

  return (
    <div className="screen-list">
      <div className="screen-card">
        <div className="screen-head">
          <span className="screen-name">{screen.name}</span>
          {screen.legacyRoute && <span className="screen-route">{screen.legacyRoute}</span>}
        </div>
        <div className="fields-scroll">
          <table className="fields-table">
            <thead>
              <tr>
                <th>Campo</th>
                <th>Tipo</th>
                <th>Obrigatório</th>
                <th>Máscara</th>
                <th className="field-validations">Validações</th>
                <th>Origem no banco</th>
              </tr>
            </thead>
            <tbody>
              {screen.groups.map((group, gi) => (
                <>
                  {/* Grupo de campos só ganha linha própria quando a tela tem mais
                      de um e a origem deu nome a ele. */}
                  {varios && group.label && (
                    <tr key={`g${gi}`} className="field-group">
                      <td colSpan={6}>{group.label}</td>
                    </tr>
                  )}
                  {group.fields.map((f, fi) => (
                    <tr key={`${gi}-${fi}`}>
                      <td>
                        {f.label && <span className="field-label">{f.label}</span>}
                        {f.field && <code className="field-name">{f.field}</code>}
                      </td>
                      <td>
                        {tipo(f.type, f.size) ? (
                          <code className="field-type">{tipo(f.type, f.size)}</code>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <Required value={f.required} />
                      </td>
                      <td>{f.mask ? <code className="field-mask">{f.mask}</code> : "—"}</td>
                      <td className="field-validations">
                        {f.validations.length
                          ? f.validations.map((v, vi) => (
                              <span key={vi}>
                                {vi > 0 && "; "}
                                <Md text={v} />
                              </span>
                            ))
                          : "—"}
                        {f.notes && (
                          <div className="field-notes">
                            <Md text={f.notes} />
                          </div>
                        )}
                      </td>
                      <td className="field-db-cell">
                        {f.dbSource ? <code className="field-db">{f.dbSource}</code> : "—"}
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
