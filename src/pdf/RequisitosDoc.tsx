import { Document, Page, Text, View } from "@react-pdf/renderer";
import { numeroDaPrancha } from "../lib/flow";
import type { Board, Hu, Integration, Module, Screen, ScreenField, System } from "../lib/types";
import {
  Capa,
  Contracapa,
  ParagrafosMd,
  quebravel,
  Rodape,
  Sumario,
  TextoMd,
  TituloMarcado,
  VERSAO,
  type ItemSumario,
  type Paginas,
} from "./comum";
import { COR, s } from "./tema";

export interface DadosRequisitos {
  sistema: System;
  modules: Module[];
  hus: Hu[];
  screens: Screen[];
  boardById: Map<string, Board>;
  huBoards: Map<string, string[]>;
  screenById: Map<string, Screen>;
  integrationById: Map<string, Integration>;
}

interface Secao {
  id: string;
  label: string;
  hus: Hu[];
}

/** Módulos na ordem do sistema; HU sem módulo conhecido vai para um bloco no fim. */
export function secoesDoSistema(d: DadosRequisitos): Secao[] {
  const secoes: Secao[] = d.modules
    .map((m) => ({ id: `mod-${m.id}`, label: m.label, hus: d.hus.filter((h) => h.module === m.id) }))
    .filter((sec) => sec.hus.length > 0);
  const conhecidos = new Set(d.modules.map((m) => m.id));
  const soltas = d.hus.filter((h) => !h.module || !conhecidos.has(h.module));
  if (soltas.length) secoes.push({ id: "mod-sem-modulo", label: "Outras histórias", hus: soltas });
  return secoes;
}

export function itensDoSumario(d: DadosRequisitos): ItemSumario[] {
  return secoesDoSistema(d).flatMap((sec) => [
    { id: sec.id, texto: sec.label, nivel: 0 as const },
    ...sec.hus.map((h) => ({ id: h.docId, texto: `${h.docId} — ${h.title}`, nivel: 1 as const })),
  ]);
}

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

function Rotulo({ children, n }: { children: string; n?: number }) {
  return (
    <Text style={s.sectionLabel} minPresenceAhead={40}>
      {children}
      {n !== undefined ? ` (${n})` : ""}
    </Text>
  );
}

function Historia({ hu }: { hu: Hu }) {
  if (!hu.como && !hu.gostaria && !hu.para) return null;
  const linha = (chave: string, texto: string | null) =>
    texto ? (
      <Text style={{ marginBottom: 2 }}>
        <Text style={{ fontWeight: 600, color: COR.ink }}>{chave} </Text>
        <TextoMd text={texto} />
      </Text>
    ) : null;
  return (
    // Rótulo e caixa juntos: a caixa é indivisível e não pode deixar o rótulo órfão.
    <View wrap={false}>
      <Rotulo>História de usuário</Rotulo>
      <View style={{ backgroundColor: COR.blueSoft, borderRadius: 4, padding: 12 }}>
        {linha("Como", hu.como)}
        {linha("Gostaria de", hu.gostaria)}
        {linha("Para que", hu.para)}
      </View>
    </View>
  );
}

function OndeEntra({ hu, d }: { hu: Hu; d: DadosRequisitos }) {
  const pranchas = (d.huBoards.get(hu.docId) ?? [])
    .map((id) => d.boardById.get(id))
    .filter((b): b is Board => Boolean(b));
  if (!pranchas.length) return null;
  return (
    <View wrap={false}>
      <Rotulo>Onde entra no fluxo</Rotulo>
      <Text>{pranchas.map((b) => `Prancha ${numeroDaPrancha(b.docId)} — ${b.title}`).join("   ·   ")}</Text>
      <Text style={[s.italicNote, { marginTop: 2 }]}>
        Os fluxogramas completos estão no PDF “Fluxogramas {d.sistema.label}”.
      </Text>
    </View>
  );
}

function Regras({ hu }: { hu: Hu }) {
  if (!hu.rules.length) return null;
  return (
    <>
      <Rotulo n={hu.rules.length}>Regras de negócio</Rotulo>
      {hu.rules.map((r) => (
        <View key={r.num} style={{ flexDirection: "row", marginBottom: 6 }}>
          <Text style={{ width: 34, fontWeight: 600, color: COR.navy }}>{r.num}</Text>
          <View style={{ flex: 1 }}>
            <TextoMd text={r.text} />
            {r.catalog && (
              <Text style={[s.italicNote, { marginTop: 2 }]}>
                <Text style={{ fontWeight: 600 }}>Catálogo do sistema: </Text>
                <TextoMd text={r.catalog} />
              </Text>
            )}
          </View>
        </View>
      ))}
    </>
  );
}

function Criterios({ hu }: { hu: Hu }) {
  if (!hu.criteria.length) return null;
  const linha = (chave: string, cor: string, texto: string | null) =>
    texto ? (
      <Text style={{ marginBottom: 2 }}>
        <Text style={{ fontWeight: 600, color: cor }}>{chave} </Text>
        <TextoMd text={texto} />
      </Text>
    ) : null;
  return (
    <>
      <Rotulo n={hu.criteria.length}>Critérios de aceitação</Rotulo>
      {hu.criteria.map((c, i) => (
        <View
          key={c.id || i}
          wrap={false}
          style={{ borderWidth: 0.75, borderColor: COR.border, borderRadius: 3, marginBottom: 7 }}
        >
          <View
            style={{
              backgroundColor: COR.blueSoft,
              borderBottomWidth: 0.75,
              borderBottomColor: COR.border,
              paddingVertical: 4,
              paddingHorizontal: 9,
            }}
          >
            <Text style={{ fontSize: 7.5, lineHeight: 1.4, fontWeight: 600, letterSpacing: 0.8, color: COR.navyStrong }}>
              {c.id ? `${c.id}  ·  ` : ""}
              {(c.scenario ?? "").toUpperCase()}
            </Text>
          </View>
          <View style={{ paddingVertical: 6, paddingHorizontal: 9 }}>
            {linha("Dado", COR.given, c.given)}
            {linha("Quando", COR.when, c.when)}
            {linha("Então", COR.then, c.then)}
          </View>
        </View>
      ))}
    </>
  );
}

const COLS = [
  { titulo: "Campo", w: "22%" },
  { titulo: "Tipo", w: "13%" },
  { titulo: "Obrig.", w: "9%" },
  { titulo: "Máscara", w: "14%" },
  { titulo: "Validações e observações", w: "42%" },
] as const;

const linhaTabela = {
  flexDirection: "row" as const,
  borderLeftWidth: 0.75,
  borderRightWidth: 0.75,
  borderBottomWidth: 0.5,
  borderColor: COR.border,
};

const celula = (w: string) => ({ width: w, paddingVertical: 4, paddingHorizontal: 5 });

function obrigatorio(v: ScreenField["required"]): string {
  if (v === true) return "Sim";
  if (v === false) return "Não";
  return v || "—";
}

function tipo(f: ScreenField): string {
  if (!f.type) return "—";
  return f.size != null && f.size !== "" ? `${f.type}(${f.size})` : f.type;
}

function TabelaCampos({ screen }: { screen: Screen }) {
  const varios = screen.groups.length > 1;
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 5 }} minPresenceAhead={60}>
        <Text style={{ fontSize: 10.5, fontWeight: 600, color: COR.navyStrong }}>{screen.name}</Text>
        {screen.legacyRoute && (
          <Text style={{ fontSize: 7.5, color: COR.muted, marginLeft: 8 }}>{screen.legacyRoute}</Text>
        )}
      </View>
      {screen.groups.length === 0 ? (
        <Text style={s.italicNote}>Sem dicionário de campos para esta tela.</Text>
      ) : (
        // Tabela plana, com a borda em cada linha: linha indivisível dentro de
        // um contêiner com borda que se parte entre páginas desanda o layout
        // do react-pdf.
        <View style={{ fontSize: 7.5, lineHeight: 1.4 }}>
          <View wrap={false} style={[linhaTabela, { backgroundColor: COR.blueSoft, borderTopWidth: 0.75 }]}>
            {COLS.map((c) => (
              <Text key={c.titulo} style={[celula(c.w), { fontWeight: 600, color: COR.navyStrong }]}>
                {c.titulo}
              </Text>
            ))}
          </View>
          {screen.groups.flatMap((g, gi) => [
            varios && g.label ? (
              <View key={`g${gi}`} wrap={false} style={[linhaTabela, { backgroundColor: "#f7f8fc" }]}>
                <Text style={{ paddingVertical: 3, paddingHorizontal: 5, fontWeight: 600, color: COR.navy }}>
                  {g.label}
                </Text>
              </View>
            ) : null,
            ...g.fields.map((f, fi) => (
              <View key={`${gi}-${fi}`} wrap={false} style={linhaTabela}>
                <View style={celula(COLS[0].w)}>
                  {f.label && <Text style={{ fontWeight: 600 }}>{f.label}</Text>}
                  {f.field && <Text style={{ color: COR.muted, fontSize: 6.8 }}>{quebravel(f.field)}</Text>}
                </View>
                <Text style={celula(COLS[1].w)}>{quebravel(tipo(f))}</Text>
                <TextoMd text={obrigatorio(f.required)} style={celula(COLS[2].w)} />
                <Text style={celula(COLS[3].w)}>{quebravel(f.mask || "—")}</Text>
                <View style={celula(COLS[4].w)}>
                  {f.validations.length ? <TextoMd text={f.validations.join("; ")} /> : <Text>—</Text>}
                  {f.notes && (
                    <TextoMd text={f.notes} style={{ fontStyle: "italic", color: COR.muted, marginTop: 1 }} />
                  )}
                  {f.dbSource && (
                    <Text style={{ color: COR.muted, fontSize: 6.8, marginTop: 1 }}>
                      Origem: {f.dbSource}
                    </Text>
                  )}
                </View>
              </View>
            )),
          ])}
        </View>
      )}
    </View>
  );
}

function Telas({ hu, d }: { hu: Hu; d: DadosRequisitos }) {
  const telas = hu.screensRefs.map((id) => d.screenById.get(id)).filter((t): t is Screen => Boolean(t));
  if (!telas.length) return null;
  return (
    <>
      <Rotulo n={telas.length}>Telas e campos</Rotulo>
      {telas.map((t) => (
        <TabelaCampos key={t.docId} screen={t} />
      ))}
    </>
  );
}

function Integracoes({ hu, d }: { hu: Hu; d: DadosRequisitos }) {
  return (
    <View wrap={hu.integrations.length > 2}>
      <Rotulo>Integrações e APIs</Rotulo>
      {hu.integrations.length === 0 ? (
        <Text style={s.italicNote}>Nenhuma integração externa prevista para esta história de usuário.</Text>
      ) : (
        <>
          {hu.integrations.map((id) => {
            const it = d.integrationById.get(id);
            const meta = [it?.nature, it?.direction].filter(Boolean).join(" · ");
            return (
              <View key={id} style={{ marginBottom: 4 }} wrap={false}>
                <Text>
                  <Text style={{ fontWeight: 600, color: COR.navy }}>{id}</Text>
                  <Text> {it?.name ?? "não consta no catálogo consolidado"}</Text>
                </Text>
                {meta && <TextoMd text={meta} style={{ fontSize: 8, lineHeight: 1.4, color: COR.muted }} />}
              </View>
            );
          })}
          {hu.integrationsNote && <TextoMd text={hu.integrationsNote} style={{ marginTop: 3 }} />}
        </>
      )}
    </View>
  );
}

function PaginaHu({
  hu,
  d,
  coletor,
  rodape,
}: {
  hu: Hu;
  d: DadosRequisitos;
  coletor: Paginas;
  rodape: string;
}) {
  // Uma <Page> por HU, e não `break` numa View: com HU de várias páginas o
  // `break` aninhado faz o layout do react-pdf divergir.
  return (
    <Page size="A4" style={s.page}>
      <View id={hu.docId} style={s.corpo}>
        <TituloMarcado id={hu.docId} texto={`${hu.docId} — ${hu.title}`} coletor={coletor} style={s.h2} />
        <Text style={{ fontSize: 8, color: COR.muted, marginTop: 3, marginBottom: 8 }}>
          {d.sistema.label}
          {hu.moduleLabel ? `  ·  ${hu.moduleLabel}` : ""}
        </Text>
        <ParagrafosMd text={hu.description} style={{ fontSize: 10.5, lineHeight: 1.55 }} />
        <Historia hu={hu} />
        <OndeEntra hu={hu} d={d} />
        <Regras hu={hu} />
        <Criterios hu={hu} />
        <Telas hu={hu} d={d} />
        <Integracoes hu={hu} d={d} />
      </View>
      <Rodape rotulo={rodape} />
    </Page>
  );
}

export function contagensRequisitos(d: DadosRequisitos) {
  const campos = d.screens.reduce((n, t) => n + t.groups.reduce((m, g) => m + g.fields.length, 0), 0);
  return [
    { n: d.hus.length, rotulo: "histórias de usuário" },
    { n: d.hus.reduce((n, h) => n + h.rules.length, 0), rotulo: "regras de negócio" },
    { n: d.hus.reduce((n, h) => n + h.criteria.length, 0), rotulo: "critérios de aceitação" },
    { n: d.screens.length, rotulo: `telas especificadas (${campos} campos)` },
    { n: secoesDoSistema(d).length, rotulo: "módulos" },
  ];
}

export default function RequisitosDoc({
  d,
  geradoEm,
  paginas,
  coletor,
}: {
  d: DadosRequisitos;
  geradoEm: string;
  paginas: Paginas | null;
  coletor: Paginas;
}) {
  const rodape = `Requisitos ${d.sistema.label} · v${VERSAO}`;
  const secoes = secoesDoSistema(d);

  return (
    <Document
      title={`Documento de Requisitos — ${d.sistema.label}`}
      author="Requisitos SEAL"
      subject={`Versão ${VERSAO}`}
      language="pt-BR"
    >
      <Capa
        sistema={d.sistema.label}
        titulo="Documento de Requisitos"
        subtitulo={`Histórias de usuário, regras de negócio, critérios de aceitação, telas e campos e integrações do ${d.sistema.label}.`}
        geradoEm={geradoEm}
        contagens={contagensRequisitos(d)}
      />

      <Page size="A4" style={s.page}>
        <Sumario itens={itensDoSumario(d)} paginas={paginas} />
        <Rodape rotulo={rodape} />
      </Page>

      {secoes.flatMap((sec) => [
        <Page key={sec.id} size="A4" style={s.page}>
          <View id={sec.id} style={[s.corpo, { paddingTop: 140 }]}>
            <TituloMarcado id={sec.id} texto={sec.label} coletor={coletor} style={[s.h1, { fontSize: 28 }]} />
            <Text style={{ fontSize: 10.5, color: COR.muted, marginTop: 6 }}>
              {plural(sec.hus.length, "história de usuário", "histórias de usuário")}
            </Text>
            <View style={s.bar} />
            {sec.hus.map((h) => (
              <View key={h.docId} style={{ flexDirection: "row", marginBottom: 5 }} wrap={false}>
                <Text style={{ width: 80, fontWeight: 600, color: COR.navy, fontSize: 9 }}>{h.docId}</Text>
                <Text style={{ flex: 1, fontSize: 9 }}>{h.title}</Text>
              </View>
            ))}
          </View>
          <Rodape rotulo={rodape} />
        </Page>,
        ...sec.hus.map((h) => <PaginaHu key={h.docId} hu={h} d={d} coletor={coletor} rodape={rodape} />),
      ])}

      <Contracapa sistema={d.sistema.label} titulo="Documento de Requisitos" geradoEm={geradoEm} />
    </Document>
  );
}
