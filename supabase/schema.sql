-- =========================================================
-- Requisitos SEAL — schema do Supabase
-- Rodar antes da carga: node scripts/carregar-banco.mjs
--
-- Tabelas no schema dedicado: app_requisitos_seal
--
-- IMPORTANTE: a API REST só enxerga schemas expostos. Duas formas:
--
--   1. Painel: Project Settings → Data API → "Exposed schemas".
--      É a fonte de verdade — salvar essa tela sobrescreve o item 2.
--   2. SQL (o que este arquivo faz no final): ajusta `pgrst.db_schemas` no
--      role `authenticator` e manda o PostgREST recarregar.
--
-- Use as duas: o SQL deixa o schema no ar na hora, e o painel garante que
-- ele continue exposto se alguém salvar aquela tela depois.
--
-- O schema é reexecutável: create ... if not exists em tudo, e
-- drop-then-create nas policies (create policy não aceita if not exists).
-- =========================================================

create schema if not exists app_requisitos_seal;

-- ---------------------------------------------------------
-- Sistemas — os legados documentados que o gerador publica
-- ---------------------------------------------------------
create table if not exists app_requisitos_seal.systems (
  id           text primary key,          -- sl
  label        text not null,
  short        text not null,             -- SL
  legacy_stack text,
  sort         integer not null default 0
);

-- ---------------------------------------------------------
-- Módulos — um sistema tem N módulos; o id só é único dentro do sistema
-- (ex.: o mesmo slug em dois sistemas), daí a PK composta.
-- ---------------------------------------------------------
create table if not exists app_requisitos_seal.modules (
  id        text not null,
  system_id text not null references app_requisitos_seal.systems (id),
  label     text not null,
  sort      integer not null default 0,
  primary key (system_id, id)
);

-- ---------------------------------------------------------
-- Histórias de usuário — doc_id (HU-SL-001) é global e serve de PK
--
-- rules:    [{ num, text, catalog }]      catalog = RN-* no catálogo do sistema
-- criteria: [{ id, scenario, given, when, then }]
-- refs:     [texto]                       referências aos documentos de origem
-- screens_refs:  [TL-*]                   telas usadas pela HU
-- integrations:  [INT-*]                  integrações citadas (catálogo global)
-- ---------------------------------------------------------
create table if not exists app_requisitos_seal.hus (
  doc_id            text primary key,
  system_id         text not null references app_requisitos_seal.systems (id),
  module_id         text,
  module_label      text,
  title             text not null,
  actors            text,
  legacy_source     text,
  priority          text,
  como              text,
  gostaria          text,
  para              text,
  description       text,
  rules             jsonb not null default '[]'::jsonb,
  criteria          jsonb not null default '[]'::jsonb,
  refs              jsonb not null default '[]'::jsonb,
  screens_refs      jsonb not null default '[]'::jsonb,
  integrations      jsonb not null default '[]'::jsonb,
  integrations_note text,
  sort              integer not null default 0,
  foreign key (system_id, module_id) references app_requisitos_seal.modules (system_id, id)
);

create index if not exists hus_system_module_idx
  on app_requisitos_seal.hus (system_id, module_id, sort);

-- ---------------------------------------------------------
-- Fluxogramas — o diagrama é guardado como fonte Mermaid e renderizado
-- no navegador. module_id é nulo de propósito nos fluxos transversais,
-- que atravessam mais de um módulo.
-- ---------------------------------------------------------
-- Duas representações convivem, e um fluxograma tem uma OU outra:
--
--   nodes/edges/groups  prancha desenhada, com coordenadas de grade escritas
--                       à mão na documentação (bloco ```board). Renderizada
--                       com React Flow. Hoje, todos os do SEALog.
--   mermaid             diagrama em texto. Renderizado pelo Mermaid.
--                       Os outros quatro sistemas.
--
-- nodes:  [{ id, type, label, c, r, wrap, w, hu, huSide }]  c/r em unidades
--         de grade, não em pixel — ver src/lib/flow.ts
-- edges:  [{ from, to, fromSide, toSide, label, dashed, arrow }]
-- groups: [{ id, title, x1, y1, x2, y2 }]
create table if not exists app_requisitos_seal.boards (
  doc_id    text primary key,             -- FLX-SL-01
  system_id text not null references app_requisitos_seal.systems (id),
  module_id text,
  title     text not null,
  scope     text,
  hus       jsonb not null default '[]'::jsonb,
  mermaid   text,
  nodes     jsonb not null default '[]'::jsonb,
  edges     jsonb not null default '[]'::jsonb,
  groups    jsonb not null default '[]'::jsonb,
  sort      integer not null default 0
);

-- Para bases criadas antes da prancha desenhada existir.
alter table app_requisitos_seal.boards
  add column if not exists nodes  jsonb not null default '[]'::jsonb,
  add column if not exists edges  jsonb not null default '[]'::jsonb,
  add column if not exists groups jsonb not null default '[]'::jsonb;

create index if not exists boards_system_idx
  on app_requisitos_seal.boards (system_id, sort);

-- ---------------------------------------------------------
-- Telas e campos — dicionário de dados por tela
--
-- groups: [{ label, fields: [{ field, label, control, type, size,
--            required, mask, validations: [], dbSource, notes }] }]
-- ---------------------------------------------------------
create table if not exists app_requisitos_seal.screens (
  doc_id       text primary key,          -- TL-SL-001
  system_id    text not null references app_requisitos_seal.systems (id),
  name         text not null,
  legacy_route text,
  target_route text,
  profiles     text,
  hus          jsonb not null default '[]'::jsonb,
  groups       jsonb not null default '[]'::jsonb,
  sort         integer not null default 0
);

-- ---------------------------------------------------------
-- Integrações externas — catálogo global INT-*, já sem colisão de IDs
-- entre sistemas (ver docs/00-visao-geral/integracoes-externas.md §1).
-- ---------------------------------------------------------
create table if not exists app_requisitos_seal.integrations (
  id        text primary key,             -- INT-001
  name      text,
  direction text,
  nature    text,
  sort      integer not null default 0
);

-- Para bases criadas antes da leitura integral e da amarração com a implementação.
alter table app_requisitos_seal.hus
  add column if not exists implementation text;

alter table app_requisitos_seal.screens
  add column if not exists implementation text,
  add column if not exists actions  jsonb not null default '[]'::jsonb,
  add column if not exists markdown text;

-- ---------------------------------------------------------
-- Leitura integral — os dez arquivos de cada sistema e a visão geral,
-- seção por seção (títulos ## e ###). system_id é texto livre: a visão
-- geral transversal entra como "geral", que não é sistema.
--
-- sections: [{ anchor, level, title, body, ids: [] }]
-- ---------------------------------------------------------
create table if not exists app_requisitos_seal.documents (
  system_id text not null,
  file      text not null,                -- 02-regras-de-negocio
  title     text not null,
  intro     text,
  sections  jsonb not null default '[]'::jsonb,
  sort      integer not null default 0,
  primary key (system_id, file)
);

-- ---------------------------------------------------------
-- Índice por id — RN, ENT, INT, MSG, DIV, Q —, com a seção ou a linha de
-- tabela que define cada um. O id é global (traz o sistema no nome).
-- ---------------------------------------------------------
create table if not exists app_requisitos_seal.artifacts (
  id          text primary key,           -- RN-SL-012
  kind        text not null,              -- RN | ENT | INT | MSG | DIV | Q
  system_id   text not null,
  file        text not null,
  anchor      text not null,
  title       text not null,
  text        text,
  via         text not null,              -- secao | tabela
  severity    text,
  has_outcome boolean,
  cites       jsonb not null default '[]'::jsonb,
  -- DEC, RF, RNF, BL: as colunas da linha (ou a tabela **Campo** | valor da
  -- seção), pelo cabeçalho. As páginas de decisões, requisitos e backlog
  -- filtram e agrupam por elas.
  fields      jsonb not null default '{}'::jsonb,
  sort        integer not null default 0
);

-- Para bases criadas antes de `fields`.
alter table app_requisitos_seal.artifacts
  add column if not exists fields jsonb not null default '{}'::jsonb;

create index if not exists artifacts_system_kind_idx
  on app_requisitos_seal.artifacts (system_id, kind, sort);

-- ---------------------------------------------------------
-- Endpoints da reconstrução — as tabelas "Método e rota" do 07.
-- key: a rota normalizada com que a implementação é casada.
-- ---------------------------------------------------------
create table if not exists app_requisitos_seal.endpoints (
  system_id      text not null,
  method         text not null,
  key            text not null,
  route          text not null,
  int_id         text,
  purpose        text,
  input          text,
  output         text,
  tables         text,
  hus            jsonb not null default '[]'::jsonb,
  implementation text,
  notes          text,
  section        text,
  sort           integer not null default 0,
  primary key (system_id, method, key)
);

-- ---------------------------------------------------------
-- Contratos — os DTOs de entrada e saída dos endpoints. O mesmo DTO pode
-- estar descrito em mais de uma integração (`ValidationProblemDetails` em
-- INT-011 e INT-014), daí a integração na chave; '' quando não há.
-- fields: [{ field, type, required, notes }]
-- ---------------------------------------------------------
create table if not exists app_requisitos_seal.contracts (
  system_id text not null,
  int_id    text not null default '',
  name      text not null,
  section   text,
  fields    jsonb not null default '[]'::jsonb,
  sort      integer not null default 0,
  primary key (system_id, int_id, name)
);

-- Para bases criadas com a chave antiga, (system_id, name).
update app_requisitos_seal.contracts set int_id = '' where int_id is null;
alter table app_requisitos_seal.contracts
  alter column int_id set default '',
  alter column int_id set not null;
alter table app_requisitos_seal.contracts drop constraint if exists contracts_pkey;
alter table app_requisitos_seal.contracts add primary key (system_id, int_id, name);

-- ---------------------------------------------------------
-- Permissões e RLS
--
-- Leitura pública: o app não tem login, então o role "anon" também lê.
-- Quem tiver a URL vê os requisitos — decisão consciente, diferente do
-- app de referência SIAL, que exige autenticação.
--
-- A escrita continua exclusiva do service_role / conexão direta: o app é
-- somente leitura e a carga vem do Markdown, via scripts/carregar-banco.mjs.
-- ---------------------------------------------------------
grant usage on schema app_requisitos_seal to anon, authenticated, service_role;
grant select on all tables in schema app_requisitos_seal to anon, authenticated;
grant all on all tables in schema app_requisitos_seal to service_role;
alter default privileges in schema app_requisitos_seal
  grant select on tables to anon, authenticated;

alter table app_requisitos_seal.systems      enable row level security;
alter table app_requisitos_seal.modules      enable row level security;
alter table app_requisitos_seal.hus          enable row level security;
alter table app_requisitos_seal.boards       enable row level security;
alter table app_requisitos_seal.screens      enable row level security;
alter table app_requisitos_seal.integrations enable row level security;
alter table app_requisitos_seal.documents    enable row level security;
alter table app_requisitos_seal.artifacts    enable row level security;
alter table app_requisitos_seal.endpoints    enable row level security;
alter table app_requisitos_seal.contracts    enable row level security;

drop policy if exists "Leitura publica" on app_requisitos_seal.systems;
create policy "Leitura publica" on app_requisitos_seal.systems
  for select to anon, authenticated using (true);

drop policy if exists "Leitura publica" on app_requisitos_seal.modules;
create policy "Leitura publica" on app_requisitos_seal.modules
  for select to anon, authenticated using (true);

drop policy if exists "Leitura publica" on app_requisitos_seal.hus;
create policy "Leitura publica" on app_requisitos_seal.hus
  for select to anon, authenticated using (true);

drop policy if exists "Leitura publica" on app_requisitos_seal.boards;
create policy "Leitura publica" on app_requisitos_seal.boards
  for select to anon, authenticated using (true);

drop policy if exists "Leitura publica" on app_requisitos_seal.screens;
create policy "Leitura publica" on app_requisitos_seal.screens
  for select to anon, authenticated using (true);

drop policy if exists "Leitura publica" on app_requisitos_seal.integrations;
create policy "Leitura publica" on app_requisitos_seal.integrations
  for select to anon, authenticated using (true);

drop policy if exists "Leitura publica" on app_requisitos_seal.documents;
create policy "Leitura publica" on app_requisitos_seal.documents
  for select to anon, authenticated using (true);

drop policy if exists "Leitura publica" on app_requisitos_seal.artifacts;
create policy "Leitura publica" on app_requisitos_seal.artifacts
  for select to anon, authenticated using (true);

drop policy if exists "Leitura publica" on app_requisitos_seal.endpoints;
create policy "Leitura publica" on app_requisitos_seal.endpoints
  for select to anon, authenticated using (true);

drop policy if exists "Leitura publica" on app_requisitos_seal.contracts;
create policy "Leitura publica" on app_requisitos_seal.contracts
  for select to anon, authenticated using (true);

-- ---------------------------------------------------------
-- Exposição do schema na API REST
--
-- Sem isto o PostgREST responde PGRST106 ("Only the following schemas are
-- exposed"). O reload do schema cache é necessário à parte: sem ele a API
-- responde PGRST205 ("Could not find the table") mesmo com o schema exposto,
-- porque o cache foi montado antes das tabelas existirem.
--
-- Confirme também em Project Settings → Data API → Exposed schemas: salvar
-- aquela tela reescreve este parâmetro.
-- ---------------------------------------------------------
alter role authenticator
  set pgrst.db_schemas = 'public, graphql_public, app_requisitos_seal';

notify pgrst, 'reload config';
notify pgrst, 'reload schema';
