import { Link } from "react-router-dom";
import { PAGINAS_PRODUTO } from "../lib/produto";

/** Topo das páginas da visão de produto: as sete, lado a lado, e o Markdown de origem — que as
 *  páginas de texto corrido já mostram inteiro e dispensam (`documento={false}`). */
export default function ProdutoTopbar({ file, documento = true }: { file: string; documento?: boolean }) {
  return (
    <div className="hu-topbar produto-topbar">
      {PAGINAS_PRODUTO.map((p) => (
        <Link key={p.file} to={p.path} className={"chip-module" + (p.file === file ? " chip-active" : "")}>
          {p.label}
        </Link>
      ))}
      {documento && (
        <div className="hu-pager">
          <Link to={`/doc/geral/${file}`} className="pager-btn">
            Ver no documento ↗
          </Link>
        </div>
      )}
    </div>
  );
}
