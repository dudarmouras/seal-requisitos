import { Font, StyleSheet } from "@react-pdf/renderer";

/*
 * Identidade do PDF: os mesmos tokens de `global.css` e a mesma Poppins do app.
 * As fontes ficam em `public/fonts/` — o PDF não depende do Google Fonts.
 */

export const COR = {
  navy: "#17339b",
  navyStrong: "#122a80",
  navySoft: "#99a8dd",
  lavender: "#c9cfec",
  paper: "#fbfbf9",
  line: "#b9bdc7",
  ink: "#23262e",
  muted: "#7a8090",
  border: "#e4e4de",
  blueSoft: "#eef1fb",
  groupBorder: "#c7d0ef",
  groupFill: "#f1f3fb",
  given: "#17339b",
  when: "#8a6210",
  then: "#1c7a45",
  edgeText: "#6d7383",
  note: "#fff8e6",
};

let registrada = false;

export function registrarFontes() {
  if (registrada) return;
  registrada = true;
  const base = `${import.meta.env.BASE_URL}fonts/`;
  Font.register({
    family: "Poppins",
    fonts: [
      { src: `${base}Poppins-Regular.ttf`, fontWeight: 400 },
      { src: `${base}Poppins-Italic.ttf`, fontWeight: 400, fontStyle: "italic" },
      { src: `${base}Poppins-Medium.ttf`, fontWeight: 500 },
      { src: `${base}Poppins-SemiBold.ttf`, fontWeight: 600 },
      { src: `${base}Poppins-Bold.ttf`, fontWeight: 700 },
    ],
  });
  // A hifenização padrão é a do inglês; em português ela quebra palavras errado.
  Font.registerHyphenationCallback((palavra) => [palavra]);
}

export const s = StyleSheet.create({
  page: {
    fontFamily: "Poppins",
    fontSize: 9.5,
    color: COR.ink,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 50,
    backgroundColor: "#ffffff",
  },
  pageLandscape: {
    fontFamily: "Poppins",
    fontSize: 9.5,
    color: COR.ink,
    paddingTop: 34,
    paddingBottom: 46,
    paddingHorizontal: 40,
    backgroundColor: "#ffffff",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: COR.muted,
  },
  /*
   * A entrelinha vai no bloco de conteúdo, nunca na <Page>. O rodapé é `fixed`
   * e o react-pdf o refaz a cada página multiplicando de novo o `lineHeight`
   * herdado — em poucas páginas o valor estoura ("unsupported number").
   */
  // Com o `fontSize` junto: sem ele o react-pdf resolve a entrelinha com 12pt.
  corpo: { fontSize: 9.5, lineHeight: 1.5 },
  footerLandscape: { left: 40, right: 40, bottom: 18 },

  eyebrow: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 2.2,
    color: COR.navy,
    textTransform: "uppercase",
  },
  h1: { fontSize: 22, fontWeight: 600, color: COR.navyStrong, lineHeight: 1.25 },
  h2: { fontSize: 15, fontWeight: 600, color: COR.navyStrong, lineHeight: 1.3 },
  bar: { width: 130, height: 3, backgroundColor: COR.navy, marginVertical: 22 },
  muted: { color: COR.muted },
  small: { fontSize: 8 },

  sectionLabel: {
    marginTop: 16,
    marginBottom: 7,
    fontSize: 7.5,
    fontWeight: 600,
    letterSpacing: 1.4,
    lineHeight: 1.3,
    color: COR.muted,
    textTransform: "uppercase",
  },
  code: { fontWeight: 500, color: COR.navyStrong },
  strong: { fontWeight: 600 },
  italicNote: { fontStyle: "italic", color: COR.muted, fontSize: 8, lineHeight: 1.45 },
});
