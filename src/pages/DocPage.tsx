import { useEffect, useMemo } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useData } from "../lib/data";
import MdBlock, { MdInline } from "../lib/mdblock";
import { numeroDoArquivo, rotuloDoArquivo } from "../lib/docs";
import { paginaDoArquivo } from "../lib/produto";
import ProdutoTopbar from "../components/ProdutoTopbar";

/**
 * Leitura integral de um arquivo da documentação — os dez de cada sistema e os da
 * visão geral. É o caminho para o que não tem página própria: atores e permissões,
 * catálogo de regras, modelo de dados, integrações, mensagens, divergências. Nada
 * do Markdown fica de fora da tela.
 */
export default function DocPage(props: { systemId?: string; file?: string }) {
  const params = useParams();
  // A visão de produto passa o arquivo pela rota própria (`/arquitetura`, …); o resto, pela URL.
  const systemId = props.systemId ?? params.systemId;
  const file = props.file ?? params.file;
  const { documents, documentByKey, systemById } = useData();
  const { hash } = useLocation();

  const doc = systemId && file ? documentByKey.get(`${systemId}/${file}`) : undefined;
  const irmaos = useMemo(() => documents.filter((d) => d.system === systemId), [documents, systemId]);

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    // A seção pode ser longa de renderizar; espera o próximo quadro.
    const id = decodeURIComponent(hash.slice(1));
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
  }, [hash, file, systemId]);

  if (!doc) return <Navigate to={systemId && systemId !== "geral" ? `/sistema/${systemId}` : "/"} replace />;

  const sys = systemById.get(doc.system);
  // Nas páginas da visão de produto, elas já estão na barra lateral: o índice fica só com as seções.
  const produto = props.file ? paginaDoArquivo(doc.file) : undefined;
  const arquivos = produto
    ? []
    : irmaos.map((d) => ({
        key: d.file,
        to: `/doc/${d.system}/${d.file}`,
        num: numeroDoArquivo(d.file),
        label: rotuloDoArquivo(d.file, d.title),
        title: d.title,
        active: d.file === doc.file,
      }));

  return (
    <div className={"page doc-layout" + (produto ? " doc-produto" : "")}>
      {/* As páginas de produto já estão na barra lateral: sem índice próprio ("Nesta página"). */}
      {!produto && (
        <aside className="doc-toc">
          <div className="doc-toc-files">
            {arquivos.map((a) => (
              <Link key={a.key} to={a.to} className={"doc-toc-file" + (a.active ? " active" : "")} title={a.title}>
                {a.num && <span className="num">{a.num}</span>}
                <span>{a.label}</span>
              </Link>
            ))}
          </div>
          <div className="doc-toc-sections">
            {doc.sections.map((s) => (
              <a key={s.anchor} href={`#${s.anchor}`} className={"doc-toc-sec lvl" + s.level}>
                <MdInline text={s.title.replace(/`/g, "")} />
              </a>
            ))}
          </div>
        </aside>
      )}

      <article className="doc-body">
        {produto ? (
          <ProdutoTopbar file={doc.file} documento={false} />
        ) : (
          <div className="hu-topbar">
            {sys ? (
              <Link to={`/sistema/${sys.id}`} className="chip-module">
                {sys.short}
              </Link>
            ) : (
              <Link to="/" className="chip-module">
                Visão geral
              </Link>
            )}
            <span className="chip-module chip-file">{doc.file}.md</span>
          </div>
        )}
        <h1 className="hu-title">{produto ? produto.label : doc.title}</h1>
        {doc.intro && <MdBlock text={doc.intro} system={doc.system} idBase={`${doc.file}-intro`} />}

        {doc.sections.map((s) => {
          const Tag = s.level === 2 ? "h2" : "h3";
          return (
            <section key={s.anchor} id={s.anchor} className={"doc-sec lvl" + s.level}>
              <Tag className="doc-sec-title">
                <a href={`#${s.anchor}`} className="doc-anchor" aria-hidden="true">
                  #
                </a>
                <MdInline text={s.title} system={doc.system} />
              </Tag>
              <MdBlock text={s.body} system={doc.system} idBase={`${doc.file}-${s.anchor}`} />
            </section>
          );
        })}
      </article>
    </div>
  );
}
