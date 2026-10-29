import { Link, Page, Text, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { tokenizeInline } from "../lib/md";
import versao from "../version.json";
import { COR, s } from "./tema";

/** Página em que cada seção caiu na passada anterior — alimenta o sumário. */
export type Paginas = Map<string, number>;

export const VERSAO = versao.version;

const MESES = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" });

/** `2026-08-06` sem passar por UTC, que adiantaria ou atrasaria um dia. */
function dataLocal(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export const DATA_VERSAO = MESES.format(dataLocal(versao.date));

export function carimboGeracao(agora: Date): string {
  const hh = String(agora.getHours()).padStart(2, "0");
  const mm = String(agora.getMinutes()).padStart(2, "0");
  return `${MESES.format(agora)} às ${hh}h${mm}`;
}

/**
 * Máscara, tipo e nome de campo não têm espaço (`NN/NNNNN/AA/TT-NNN`) e o
 * react-pdf não quebra palavra: sem um ponto de quebra, a coluna transborda.
 */
export function quebravel(texto: string): string {
  return texto.replace(/([/\-_.|,(])/g, "$1​");
}

/** Texto em parágrafos: a linha em branco do Markdown vira espaço entre blocos. */
export function ParagrafosMd({ text, style }: { text: string | null | undefined; style?: Style | Style[] }) {
  if (!text) return null;
  const paragrafos = text.split(/\n\s*\n/).filter((p) => p.trim());
  const base = Array.isArray(style) ? style : style ? [style] : [];
  return (
    <View>
      {paragrafos.map((p, i) => (
        <TextoMd key={i} text={p} style={[...base, { marginBottom: 6 }]} />
      ))}
    </View>
  );
}

/** Texto com `código` e **negrito** resolvidos — o mesmo corte do `<Md>` da tela. */
export function TextoMd({ text, style }: { text: string | null | undefined; style?: Style | Style[] }) {
  if (!text) return null;
  // Quebra simples do Markdown é espaço; só a linha em branco separa parágrafo.
  const prosa = text.replace(/[ \t]*\n(?!\n)[ \t]*/g, " ").replace(/\n{2,}/g, "\n\n");
  return (
    <Text style={style}>
      {tokenizeInline(prosa).map((t, i) =>
        t.kind === "code" ? (
          <Text key={i} style={s.code}>
            {t.text}
          </Text>
        ) : t.kind === "strong" ? (
          <Text key={i} style={s.strong}>
            {t.text}
          </Text>
        ) : (
          t.text
        ),
      )}
    </Text>
  );
}

/**
 * Título de seção que anota a própria página. Na primeira passada o sumário sai
 * em branco; na segunda ele lê o que foi anotado aqui.
 */
export function TituloMarcado({
  id,
  texto,
  coletor,
  style,
}: {
  id: string;
  texto: string;
  coletor: Paginas;
  style?: Style | Style[];
}) {
  // O `render` só é chamado por página em elemento `fixed` — por isso a anotação
  // vai num marcador fixo e vazio ao lado do título, e não no próprio título.
  return (
    <>
      <Text
        fixed
        style={{ position: "absolute", top: 0, left: 0, fontSize: 1 }}
        render={({ pageNumber }) => {
          if (!coletor.has(id)) coletor.set(id, pageNumber);
          return "";
        }}
      />
      <Text style={style}>{texto}</Text>
    </>
  );
}

export function Rodape({ rotulo, paisagem }: { rotulo: string; paisagem?: boolean }) {
  return (
    <View style={paisagem ? [s.footer, s.footerLandscape] : s.footer} fixed>
      <Text>{rotulo}</Text>
      <Text render={({ pageNumber, totalPages }) => `página ${pageNumber} de ${totalPages}`} />
    </View>
  );
}

export interface Contagem {
  n: number;
  rotulo: string;
}

export function Capa({
  sistema,
  titulo,
  subtitulo,
  geradoEm,
  contagens,
  paisagem,
}: {
  sistema: string;
  titulo: string;
  subtitulo: string;
  geradoEm: string;
  contagens: Contagem[];
  paisagem?: boolean;
}) {
  return (
    <Page
      size="A4"
      orientation={paisagem ? "landscape" : "portrait"}
      style={[paisagem ? s.pageLandscape : s.page, { justifyContent: "center" }]}
    >
      <View style={[s.corpo, { marginBottom: paisagem ? 0 : 120 }]}>
        <Text style={s.eyebrow}>{sistema}</Text>
        <Text style={[s.h1, { fontSize: 34, marginTop: 10 }]}>{titulo}</Text>
        <Text style={{ fontSize: 11.5, color: COR.muted, marginTop: 14, maxWidth: 380, lineHeight: 1.55 }}>
          {subtitulo}
        </Text>
        <View style={s.bar} />
        <Text style={{ fontSize: 11 }}>
          <Text style={{ fontSize: 14, fontWeight: 500, color: COR.navy }}>Versão {VERSAO}</Text>
          {"   ·   "}atualizada em {DATA_VERSAO}
        </Text>
        <Text style={{ fontSize: 8, color: COR.muted, marginTop: 6 }}>PDF gerado em {geradoEm}</Text>

        <View style={{ marginTop: 34 }}>
          {contagens.map((c) => (
            <View key={c.rotulo} style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 6 }}>
              <Text style={{ width: 44, textAlign: "right", fontSize: 13, fontWeight: 600, color: COR.navy }}>
                {c.n}
              </Text>
              <Text style={{ marginLeft: 12, fontSize: 10 }}>{c.rotulo}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}

export function Contracapa({
  sistema,
  titulo,
  geradoEm,
  paisagem,
}: {
  sistema: string;
  titulo: string;
  geradoEm: string;
  paisagem?: boolean;
}) {
  return (
    <Page
      size="A4"
      orientation={paisagem ? "landscape" : "portrait"}
      style={[paisagem ? s.pageLandscape : s.page, { justifyContent: "center" }]}
    >
      <View style={[s.corpo, { marginBottom: paisagem ? 0 : 80 }]}>
        <View style={[s.bar, { marginTop: 0 }]} />
        <Text style={s.eyebrow}>{sistema}</Text>
        <Text style={[s.h2, { fontSize: 20, marginTop: 6 }]}>{titulo}</Text>
        <Text style={{ fontSize: 8.5, color: COR.muted, marginTop: 14 }}>
          Versão {VERSAO} · atualizada em {DATA_VERSAO} · PDF gerado em {geradoEm}
        </Text>
        <Text style={{ fontSize: 9, marginTop: 14, maxWidth: 520, lineHeight: 1.6 }}>
          Documento gerado automaticamente a partir do aplicativo de requisitos e fluxogramas. Em caso de
          divergência entre este PDF e o aplicativo, prevalece a versão mais recente do aplicativo.
        </Text>
      </View>
    </Page>
  );
}

export interface ItemSumario {
  id: string;
  texto: string;
  nivel: 0 | 1;
}

/** Sumário clicável. Na primeira passada os números ficam vazios. */
export function Sumario({ itens, paginas }: { itens: ItemSumario[]; paginas: Paginas | null }) {
  return (
    <View style={s.corpo}>
      <Text style={[s.h1, { marginBottom: 18 }]}>Sumário</Text>
      {itens.map((it) => (
        <Link key={it.id} src={`#${it.id}`} style={{ textDecoration: "none" }}>
          <View
            wrap={false}
            style={{
              flexDirection: "row",
              paddingVertical: it.nivel === 0 ? 4 : 2.5,
              paddingLeft: it.nivel === 0 ? 0 : 16,
              marginTop: it.nivel === 0 ? 5 : 0,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: it.nivel === 0 ? 10 : 8.5,
                fontWeight: it.nivel === 0 ? 600 : 400,
                color: it.nivel === 0 ? COR.navy : COR.ink,
                paddingRight: 12,
              }}
            >
              {it.texto}
            </Text>
            <Text
              style={{ width: 30, textAlign: "right", fontSize: it.nivel === 0 ? 10 : 8.5, color: COR.ink }}
            >
              {paginas?.get(it.id) ?? " "}
            </Text>
          </View>
        </Link>
      ))}
    </View>
  );
}
