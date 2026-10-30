import { Fragment, useCallback, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useData } from "./data";
import MermaidBoard from "../components/MermaidBoard";
import type { Board } from "./types";

/*
 * Markdown em bloco, para a leitura integral dos documentos (`DocPage`) e para os
 * textos de catálogo (`ArtifactPage`). Cobre o que a documentação usa: títulos,
 * parágrafos, tabelas, listas, citações, blocos de código e linha horizontal.
 * O bloco ```mermaid é desenhado; o ```board vira link para o fluxograma, que tem
 * página própria.
 *
 * Todo id que o modelo conhece vira link — HU, tela, fluxograma e os ids do
 * índice (RN, ENT, INT, MSG, DIV, Q). O id que o modelo não conhece fica como
 * texto: o vazio é informação, e costuma indicar divergência entre documentos.
 */

const RE_ID_SRC = String.raw`(?:HU|RN|TL|FLX|ENT|MSG|DIV|Q|DEC|RF|RNF|BL)-[A-Z]{2}-\d+|INT-\d{3}`;
const INLINE = new RegExp(
  String.raw`\x60([^\x60]+)\x60|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|<br\s*\/?>|\b(${RE_ID_SRC})\b|(?<![\w*])\*([^*\s][^*]*?)\*(?![\w*])`,
  "g"
);
const RE_ID_EXATO = new RegExp(`^(?:${RE_ID_SRC})$`);

const PASTA_DO_SISTEMA: Record<string, string> = {
  "00-visao-geral": "geral",
  "01-sealog": "sl",
};

/** Caminho no app para um id, ou nulo quando o modelo não o conhece. */
export function useIdHref() {
  const { huById, screenById, boards, artifactById } = useData();
  return useCallback(
    (id: string): string | null => {
      if (huById.has(id)) return `/hu/${id}`;
      if (screenById.has(id)) return `/telas/${id}`;
      if (id.startsWith("FLX-") && boards.some((b) => b.docId === id)) return `/fluxos/${id}`;
      if (artifactById.has(id)) return `/id/${id}`;
      return null;
    },
    [huById, screenById, boards, artifactById]
  );
}

/** Link relativo entre arquivos `.md` vira rota da leitura integral. */
function rotaDeArquivo(href: string, system: string | undefined): string | null {
  const m = href.match(/(?:(\d\d-[a-z-]+)\/)?(\d\d-[\w-]+|[a-z][\w-]+)\.md(?:#(.+))?$/);
  if (!m || /^https?:/.test(href)) return null;
  const sis = m[1] ? PASTA_DO_SISTEMA[m[1]] : system;
  if (!sis) return null;
  return `/doc/${sis}/${m[2]}${m[3] ? `#${m[3]}` : ""}`;
}

function Inline({ text, system }: { text: string; system?: string }) {
  const href = useIdHref();
  const parts: ReactNode[] = [];
  let last = 0;
  INLINE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = INLINE.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const k = parts.length;
    if (m[1] !== undefined) {
      const alvo = RE_ID_EXATO.test(m[1]) ? href(m[1]) : null;
      parts.push(
        alvo ? (
          <Link key={k} to={alvo} className="md-code md-id">
            {m[1]}
          </Link>
        ) : (
          <code key={k} className="md-code">
            {m[1]}
          </code>
        )
      );
    } else if (m[2] !== undefined) {
      parts.push(
        <strong key={k}>
          <Inline text={m[2]} system={system} />
        </strong>
      );
    } else if (m[3] !== undefined) {
      const interno = rotaDeArquivo(m[4], system);
      parts.push(
        interno ? (
          <Link key={k} to={interno}>
            <Inline text={m[3]} system={system} />
          </Link>
        ) : (
          <a key={k} href={m[4]} target="_blank" rel="noreferrer">
            <Inline text={m[3]} system={system} />
          </a>
        )
      );
    } else if (m[5] !== undefined) {
      const alvo = href(m[5]);
      parts.push(
        alvo ? (
          <Link key={k} to={alvo} className="md-id">
            {m[5]}
          </Link>
        ) : (
          m[5]
        )
      );
    } else if (m[6] !== undefined) {
      parts.push(
        <em key={k}>
          <Inline text={m[6]} system={system} />
        </em>
      );
    } else {
      parts.push(<br key={k} />);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}

function cells(linha: string): string[] {
  const partes = linha
    .replace(/\\\|/g, "\u0000")
    .split("|")
    .map((c) => c.replace(/\u0000/g, "|").trim());
  if (partes[0] === "") partes.shift();
  if (partes[partes.length - 1] === "") partes.pop();
  return partes;
}

const ehSeparador = (l: string) => /^\|?[\s:|-]+\|?$/.test(l.trim()) && l.includes("-");

type Bloco =
  | { t: "h"; level: number; text: string }
  | { t: "p"; text: string }
  | { t: "table"; header: string[]; rows: string[][] }
  | { t: "list"; ordered: boolean; items: string[][] }
  | { t: "quote"; lines: string[] }
  | { t: "code"; lang: string; code: string }
  | { t: "img"; alt: string; src: string }
  | { t: "hr" };

function blocos(md: string): Bloco[] {
  const linhas = md.replace(/\r\n/g, "\n").split("\n");
  const out: Bloco[] = [];
  let i = 0;
  while (i < linhas.length) {
    const l = linhas[i];
    const t = l.trim();
    if (!t) {
      i++;
      continue;
    }
    const cerca = t.match(/^(```|~~~)\s*([\w-]*)/);
    if (cerca) {
      const fim = cerca[1];
      const corpo: string[] = [];
      i++;
      while (i < linhas.length && !linhas[i].trim().startsWith(fim)) corpo.push(linhas[i++]);
      i++;
      out.push({ t: "code", lang: cerca[2], code: corpo.join("\n") });
      continue;
    }
    const h = t.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      out.push({ t: "h", level: h[1].length, text: h[2] });
      i++;
      continue;
    }
    const img = t.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (img) {
      out.push({ t: "img", alt: img[1], src: img[2] });
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(t)) {
      out.push({ t: "hr" });
      i++;
      continue;
    }
    if (t.startsWith("|") && linhas[i + 1] && ehSeparador(linhas[i + 1])) {
      const header = cells(t);
      const rows: string[][] = [];
      i += 2;
      while (i < linhas.length && linhas[i].trim().startsWith("|")) rows.push(cells(linhas[i++].trim()));
      out.push({ t: "table", header, rows });
      continue;
    }
    if (t.startsWith(">")) {
      const q: string[] = [];
      while (i < linhas.length && linhas[i].trim().startsWith(">")) q.push(linhas[i++].trim().replace(/^>\s?/, ""));
      out.push({ t: "quote", lines: q });
      continue;
    }
    const item = l.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
    if (item) {
      const ordered = /\d/.test(item[2]);
      const items: string[][] = [];
      while (i < linhas.length) {
        const li = linhas[i].match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
        if (li && li[1].length <= item[1].length) {
          items.push([li[3]]);
          i++;
        } else if (linhas[i].trim() && (/^\s+/.test(linhas[i]) || li) && items.length) {
          // Continuação ou subitem: entra no item corrente, como Markdown próprio.
          items[items.length - 1].push(linhas[i].replace(/^\s{2,4}/, ""));
          i++;
        } else break;
      }
      out.push({ t: "list", ordered, items });
      continue;
    }
    const par: string[] = [];
    while (
      i < linhas.length &&
      linhas[i].trim() &&
      !/^(#{1,6}\s|```|~~~|>|\||!\[|(-{3,}|\*{3,})$)/.test(linhas[i].trim()) &&
      !/^\s*([-*+]|\d+\.)\s+/.test(linhas[i])
    ) {
      par.push(linhas[i++].trim());
    }
    if (par.length) out.push({ t: "p", text: par.join(" ") });
    else i++;
  }
  return out;
}

function Codigo({ lang, code, id }: { lang: string; code: string; id: string }) {
  if (lang === "mermaid") {
    const board = { docId: id, mermaid: code } as Board;
    return (
      <div className="md-mermaid mermaid-md">
        <MermaidBoard board={board} />
      </div>
    );
  }
  if (lang === "board") {
    return <p className="md-board-note">Prancha desenhada — abra o fluxograma pelo link no título da seção.</p>;
  }
  return (
    <pre className="md-pre">
      <code>{code}</code>
    </pre>
  );
}

/** Markdown em bloco da documentação. `system` resolve os links relativos entre arquivos. */
export default function MdBlock({ text, system, idBase = "md" }: { text: string; system?: string; idBase?: string }) {
  if (!text) return null;
  return (
    <div className="md-block">
      {blocos(text).map((b, i) => {
        switch (b.t) {
          case "h": {
            const Tag = `h${Math.min(6, Math.max(3, b.level))}` as "h3";
            return (
              <Tag key={i} className="md-h">
                <Inline text={b.text} system={system} />
              </Tag>
            );
          }
          case "p":
            return (
              <p key={i}>
                <Inline text={b.text} system={system} />
              </p>
            );
          case "hr":
            return <hr key={i} />;
          case "img":
            return (
              <figure key={i} className="md-figure">
                <a href={b.src} target="_blank" rel="noreferrer">
                  <img src={b.src} alt={b.alt} loading="lazy" />
                </a>
                {b.alt && <figcaption>{b.alt}</figcaption>}
              </figure>
            );
          case "quote":
            return (
              <blockquote key={i} className="md-quote">
                <MdBlock text={b.lines.join("\n")} system={system} idBase={`${idBase}-${i}`} />
              </blockquote>
            );
          case "code":
            return <Codigo key={i} lang={b.lang} code={b.code} id={`${idBase}-${i}`} />;
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={i} className="md-list">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Inline text={it[0]} system={system} />
                    {it.length > 1 && <MdBlock text={it.slice(1).join("\n")} system={system} idBase={`${idBase}-${i}-${j}`} />}
                  </li>
                ))}
              </Tag>
            );
          }
          case "table":
            return (
              <div key={i} className="md-table-wrap">
                <table className="md-table">
                  <thead>
                    <tr>
                      {b.header.map((h, j) => (
                        <th key={j}>
                          <Inline text={h} system={system} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {b.header.map((_, c) => (
                          <td key={c}>
                            <Inline text={r[c] ?? ""} system={system} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}

/** Markdown inline com os ids resolvidos em link — para células e títulos fora do MdBlock. */
export function MdInline({ text, system }: { text: string | null | undefined; system?: string }) {
  if (!text) return null;
  return <Inline text={text} system={system} />;
}
