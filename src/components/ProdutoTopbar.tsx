import { Link } from "react-router-dom";

/** Topo das páginas da visão de produto. As sete páginas já estão na barra lateral; aqui fica só o
 *  rótulo da seção e o Markdown de origem — que as páginas de texto corrido já mostram inteiro e
 *  dispensam (`documento={false}`). */
export default function ProdutoTopbar({ file, documento = true }: { file: string; documento?: boolean }) {
  return (
    <div className="hu-topbar produto-topbar">
      <span className="produto-eyebrow">Produto</span>
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
