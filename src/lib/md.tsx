import { Fragment, type ReactNode } from "react";

/**
 * A documentação de origem é markdown e usa crase e negrito no meio da prosa
 * o tempo todo — rotas, colunas, stored procedures, identificadores. Renderizar
 * o texto cru deixaria `GET /AtenaAccess/Logar` literalmente com crases na tela.
 *
 * Este renderizador cobre só o inline que aparece nos campos do modelo:
 * `código` e **negrito**. Blocos (listas, tabelas, títulos) não ocorrem nesses
 * campos — quando ocorrem, o texto passa intacto, sem quebrar a página.
 */
const INLINE = /`([^`]+)`|\*\*([^*]+)\*\*/g;

export interface InlineToken {
  kind: "text" | "code" | "strong";
  text: string;
}

/** O parse do inline, sem React — o PDF usa o mesmo corte que a tela. */
export function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  INLINE.lastIndex = 0;

  while ((match = INLINE.exec(text))) {
    if (match.index > last) tokens.push({ kind: "text", text: text.slice(last, match.index) });
    if (match[1] !== undefined) tokens.push({ kind: "code", text: match[1] });
    else tokens.push({ kind: "strong", text: match[2] });
    last = match.index + match[0].length;
  }
  if (last < text.length) tokens.push({ kind: "text", text: text.slice(last) });
  return tokens;
}

export function renderInline(text: string): ReactNode[] {
  return tokenizeInline(text).map((t, i) =>
    t.kind === "code" ? (
      <code className="md-code" key={i}>
        {t.text}
      </code>
    ) : t.kind === "strong" ? (
      <strong key={i}>{t.text}</strong>
    ) : (
      t.text
    )
  );
}

/** Texto da documentação com markdown inline resolvido. */
export default function Md({ text }: { text: string | null | undefined }) {
  if (!text) return null;
  return <Fragment>{renderInline(text)}</Fragment>;
}

/** Mesma coisa, mas devolvendo texto puro — para busca e atributos title. */
export function stripInline(text: string): string {
  return text.replace(/`/g, "").replace(/\*\*/g, "");
}
