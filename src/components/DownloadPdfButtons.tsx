import { useState } from "react";
import { useData } from "../lib/data";

type Qual = "requisitos" | "fluxogramas";

/**
 * Os dois PDFs do sistema, no formato do app SIAL. O gerador (e o
 * @react-pdf/renderer com ele) só é baixado no primeiro clique.
 */
export default function DownloadPdfButtons({
  systemId,
  temPranchas,
}: {
  systemId: string;
  temPranchas: boolean;
}) {
  const data = useData();
  const [gerando, setGerando] = useState<Qual | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function baixar(qual: Qual) {
    setGerando(qual);
    setErro(null);
    try {
      const gerar = await import("../pdf/gerar");
      if (qual === "requisitos") await gerar.baixarRequisitos(data, systemId);
      else await gerar.baixarFluxogramas(data, systemId);
    } catch (e) {
      console.error(e);
      setErro("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setGerando(null);
    }
  }

  return (
    <div className="pdf-downloads">
      <div className="pdf-buttons">
        <button
          type="button"
          className="pdf-btn primary"
          disabled={gerando !== null || data.loading}
          onClick={() => baixar("requisitos")}
        >
          <IconeDownload />
          {gerando === "requisitos" ? "Gerando PDF…" : "Baixar requisitos (PDF)"}
        </button>
        {temPranchas && (
          <button
            type="button"
            className="pdf-btn"
            disabled={gerando !== null || data.loading}
            onClick={() => baixar("fluxogramas")}
          >
            <IconeDownload />
            {gerando === "fluxogramas" ? "Gerando PDF…" : "Baixar fluxogramas (PDF)"}
          </button>
        )}
      </div>
      {erro && <p className="pdf-error">{erro}</p>}
    </div>
  );
}

function IconeDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 1.5v8.2m0 0 3.2-3.2M8 9.7 4.8 6.5M2.5 11.5v2h11v-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
