import { useState } from "react";
import { dataPorExtenso, ROTULO_ESCOPO, versaoDaHu } from "../lib/versoes";

const REPO = "https://github.com/dudarmouras/sial-requisitos";

/** Versão, data e escopo da HU, com o histórico recolhido. */
export default function HuVersion({ huId }: { huId: string }) {
  const [aberto, setAberto] = useState(false);
  const v = versaoDaHu(huId);

  if (!v) {
    return (
      <div className="hu-version">
        <span className="hu-version-num">Versão v1.0</span>
      </div>
    );
  }

  return (
    <div className="hu-version">
      <span className="hu-version-num">Versão v{v.versao}</span>
      <span className="hu-version-date">Atualizado em {dataPorExtenso(v.data)}</span>
      <span className={"escopo escopo-" + v.escopo}>{ROTULO_ESCOPO[v.escopo]}</span>
      {v.historico.length > 1 && (
        <button
          type="button"
          className="hu-version-toggle"
          onClick={() => setAberto((x) => !x)}
          aria-expanded={aberto}
        >
          {aberto ? "ocultar histórico" : `histórico (${v.historico.length})`}
        </button>
      )}
      {aberto && (
        <ol className="hu-version-hist">
          {[...v.historico].reverse().map((h) => (
            <li key={h.versao}>
              <span className="hu-version-num">v{h.versao}</span>
              <span className="hu-version-date">{dataPorExtenso(h.data)}</span>
              <span className={"escopo escopo-" + h.escopo}>{ROTULO_ESCOPO[h.escopo]}</span>
              <span className="hu-version-resumo">{h.resumo}</span>
              {h.pr && (
                <a href={`${REPO}/pull/${h.pr}`} target="_blank" rel="noreferrer">
                  PR #{h.pr}
                </a>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
