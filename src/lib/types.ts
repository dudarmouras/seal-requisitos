/** Um dos sistemas legados documentados. */
export interface System {
  id: string;
  label: string;
  short: string;
  legacyStack: string | null;
}

/** Módulo de um sistema. O id só é único dentro do sistema. */
export interface Module {
  id: string;
  system: string;
  label: string;
}

/** Regra de negócio da HU; `catalog` aponta para o RN-* do catálogo do sistema. */
export interface BusinessRule {
  num: string;
  text: string;
  catalog: string | null;
}

export interface AcceptanceCriterion {
  id: string;
  scenario: string;
  given: string;
  when: string;
  then: string;
}

export interface Hu {
  docId: string;
  system: string;
  module: string | null;
  moduleLabel: string | null;
  title: string;
  actors: string | null;
  legacySource: string | null;
  priority: string | null;
  como: string | null;
  gostaria: string | null;
  para: string | null;
  description: string | null;
  rules: BusinessRule[];
  criteria: AcceptanceCriterion[];
  refs: string[];
  /** Telas usadas pela HU, por `TL-*` */
  screensRefs: string[];
  /** Integrações citadas, por `INT-*` do catálogo global */
  integrations: string[];
  integrationsNote: string | null;
  /** Onde a HU está na implementação, quando houver. Rastreio — não aparece na página. */
  implementation?: string | null;
}

/* ---- Fluxograma desenhado: modelo de prancha ----
   Herdado do app SIAL. Nenhum nó declara pixel: a posição é coluna (`c`) e
   linha (`r`) numa grade, e o adaptador (`src/lib/flow.ts`) multiplica pelas
   constantes `CW`/`RH`. Mover meia coluna é `c: 3.1` em vez de `c: 3.6`. */

export type NodeSide = "top" | "bottom" | "left" | "right";
export type ChipSide = NodeSide | "inline";

export interface BoardNode {
  id: string;
  /** `action` é o passo; `dim` marca começo e fim; `label` é rótulo de raia. */
  type?: "action" | "dim" | "decision" | "label";
  label: string;
  /** Coluna do **centro** do nó, em unidades de grade. Aceita fração. */
  c: number;
  /** Linha do **centro** do nó, em unidades de grade. Aceita fração. */
  r: number;
  /** Caracteres por linha antes de quebrar. Default 22 (ação) / 14 (decisão). */
  wrap?: number;
  /** Largura fixa, em pixels. Só quando o auto-size erra. */
  w?: number;
  /** HUs ancoradas neste nó — viram chips clicáveis ao lado da caixa. */
  hu?: string[];
  huSide?: ChipSide;
}

/** Retângulo tracejado atrás da prancha, agrupando uma região com um título. */
export interface BoardGroup {
  id: string;
  title: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  hu?: string[];
}

export interface BoardEdge {
  from: string;
  to: string;
  /** Omitidos, os lados são inferidos pela posição relativa dos dois nós. */
  fromSide?: NodeSide;
  toSide?: NodeSide;
  label?: string;
  dashed?: boolean;
  /** `false` remove a ponta da seta. */
  arrow?: boolean;
}

/** Fluxograma. `module` é nulo nos fluxos transversais a vários módulos.
 *
 *  Duas representações convivem, e um board tem uma **ou** outra:
 *  - `nodes`/`edges`/`groups` — prancha desenhada, renderizada com React Flow;
 *  - `mermaid` — diagrama em texto, renderizado pelo Mermaid.
 *  O SEALog usa a primeira; a segunda continua aceita. */
export interface Board {
  docId: string;
  system: string;
  module: string | null;
  title: string;
  scope: string | null;
  hus: string[];
  mermaid: string | null;
  nodes: BoardNode[];
  edges: BoardEdge[];
  groups: BoardGroup[];
}

/** Campo de uma tela — dicionário de dados. */
export interface ScreenField {
  field: string | null;
  label: string | null;
  control: string | null;
  type: string | null;
  size: string | null;
  /** true/false quando a origem diz "Sim"/"Não"; texto quando é condicional. */
  required: boolean | string | null;
  mask: string | null;
  validations: string[];
  dbSource: string | null;
  notes: string | null;
}

/** Bloco de campos dentro de uma tela (ex.: "Filtros de busca"). */
export interface ScreenFieldGroup {
  label: string | null;
  fields: ScreenField[];
}

export interface Screen {
  docId: string;
  system: string;
  name: string;
  legacyRoute: string | null;
  targetRoute: string | null;
  profiles: string | null;
  hus: string[];
  groups: ScreenFieldGroup[];
  /** O arquivo da tela na implementação, quando houver. */
  implementation?: string | null;
  actions?: ScreenAction[];
  /** O bloco inteiro da tela no 05, para a leitura integral. */
  markdown?: string | null;
}

export interface Integration {
  id: string;
  name: string | null;
  direction: string | null;
  nature: string | null;
}

/* ---- Leitura integral e índices (CONVENCOES.md §10 e §12) ---- */

/** Ação de uma tela — botão, link ou comando, e quem pode usá-lo. */
export interface ScreenAction {
  action: string;
  control: string | null;
  who: string | null;
  endpoint: string | null;
  notes: string | null;
}

/** Seção de um arquivo da documentação, nos títulos `##` e `###`. */
export interface DocSection {
  anchor: string;
  level: number;
  title: string;
  /** Markdown do corpo, com os títulos `####` em diante. */
  body: string;
  /** Ids citados na seção. */
  ids: string[];
}

/** Um dos dez arquivos de um sistema, ou um da visão geral (`system` = "geral"). */
export interface DocFile {
  system: string;
  file: string;
  title: string;
  intro: string;
  sections: DocSection[];
}

/** Os seis do catálogo de cada sistema, e os quatro da visão de produto (`docs/00-visao-geral/`):
 *  decisão, requisito funcional, requisito não funcional e item de backlog. */
export type ArtifactKind = "RN" | "ENT" | "INT" | "MSG" | "DIV" | "Q" | "DEC" | "RF" | "RNF" | "BL";

/** Id de catálogo e a seção ou linha de tabela que o define. */
export interface Artifact {
  id: string;
  kind: ArtifactKind;
  system: string;
  file: string;
  anchor: string;
  title: string;
  text: string;
  via: "secao" | "tabela";
  /** DIV/Q: severidade declarada, quando há. */
  severity: string | null;
  /** DIV/Q: se a entrada já tem `**Desfecho**`. */
  hasOutcome: boolean | null;
  cites: string[];
  /** As colunas da linha de tabela, ou a tabela `**Campo** | valor` da seção, pelo cabeçalho. */
  fields: Record<string, string>;
}

/** Endpoint da reconstrução, de uma tabela "Método e rota" do 07. */
export interface Endpoint {
  system: string;
  int: string | null;
  method: string;
  route: string;
  key: string;
  purpose: string | null;
  input: string | null;
  output: string | null;
  tables: string | null;
  hus: string[];
  implementation: string | null;
  notes: string | null;
  section: string;
}

/** DTO de entrada ou saída de um endpoint. */
export interface Contract {
  system: string;
  int: string | null;
  name: string;
  section: string;
  fields: { field: string; type: string | null; required: string | null; notes: string | null }[];
}
