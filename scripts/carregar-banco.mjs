#!/usr/bin/env node
// Carrega data/requisitos.json no Postgres do Supabase.
//
// O Markdown em docs/ é a fonte da verdade; requisitos.json é o modelo
// canônico gerado dele (scripts/gerar-requisitos-json.mjs) e o banco é uma
// projeção do JSON. A carga é idempotente: cada tabela é truncada e
// reescrita por inteiro, na ordem que respeita as chaves estrangeiras.
//
// Uso:
//   node scripts/gerar-requisitos-json.mjs     # docs/ → data/requisitos.json
//   node scripts/carregar-banco.mjs            # data/requisitos.json → banco
//
// Conexão: DATABASE_URL no ambiente ou em .env.local (nunca versionado).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "data", "requisitos.json");

/** Lê DATABASE_URL do ambiente ou do .env.local, sem depender de dotenv. */
function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envFile = path.join(ROOT, ".env.local");
  if (fs.existsSync(envFile)) {
    const match = fs
      .readFileSync(envFile, "utf8")
      .match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m);
    if (match) return match[1].replace(/^["']|["']$/g, "");
  }
  console.error(
    "DATABASE_URL não definida. Coloque-a em .env.local (ver .env.example) " +
      "ou exporte no ambiente."
  );
  process.exit(1);
}

/**
 * Insere `rows` em `table` num único INSERT multi-linha por lote.
 * Lotes de 200 linhas mantêm a contagem de parâmetros longe do teto do
 * protocolo (65.535) mesmo nas tabelas mais largas.
 */
async function insertAll(client, table, columns, rows, batchSize = 200) {
  if (!rows.length) return 0;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const values = [];
    const tuples = batch.map((row, r) => {
      const placeholders = columns.map((_, c) => `$${r * columns.length + c + 1}`);
      values.push(...columns.map((col) => row[col]));
      return `(${placeholders.join(", ")})`;
    });
    await client.query(
      `insert into ${table} (${columns.join(", ")}) values ${tuples.join(", ")}`,
      values
    );
    inserted += batch.length;
  }
  return inserted;
}

const json = (value) => JSON.stringify(value ?? []);

async function main() {
  if (!fs.existsSync(DATA)) {
    console.error(
      `${path.relative(ROOT, DATA)} não existe — rode antes: ` +
        "node scripts/gerar-requisitos-json.mjs"
    );
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
  const client = new pg.Client({ connectionString: databaseUrl() });
  await client.connect();

  try {
    await client.query("begin");
    await client.query("set search_path to app_requisitos_seal");

    // Ordem inversa das FKs; restart identity não se aplica (sem sequences).
    await client.query(
      "truncate screens, boards, hus, modules, systems, integrations, " +
        "documents, artifacts, endpoints, contracts cascade"
    );

    const counts = {};

    counts.systems = await insertAll(
      client,
      "systems",
      ["id", "label", "short", "legacy_stack", "sort"],
      data.systems.map((s, i) => ({
        id: s.id,
        label: s.label,
        short: s.short,
        legacy_stack: s.legacyStack ?? null,
        sort: i,
      }))
    );

    counts.modules = await insertAll(
      client,
      "modules",
      ["id", "system_id", "label", "sort"],
      data.modules.map((m, i) => ({
        id: m.id,
        system_id: m.system,
        label: m.label,
        sort: i,
      }))
    );

    counts.hus = await insertAll(
      client,
      "hus",
      [
        "doc_id", "system_id", "module_id", "module_label", "title", "actors",
        "legacy_source", "priority", "como", "gostaria", "para", "description",
        "rules", "criteria", "refs", "screens_refs", "integrations",
        "integrations_note", "implementation", "sort",
      ],
      data.hus.map((h, i) => ({
        doc_id: h.docId,
        system_id: h.system,
        module_id: h.module,
        module_label: h.moduleLabel,
        title: h.title,
        actors: h.actors,
        legacy_source: h.legacySource,
        priority: h.priority,
        como: h.como,
        gostaria: h.gostaria,
        para: h.para,
        description: h.description,
        rules: json(h.rules),
        criteria: json(h.criteria),
        refs: json(h.refs),
        screens_refs: json(h.screensRefs),
        integrations: json(h.integrations),
        integrations_note: h.integrationsNote,
        implementation: h.implementation ?? null,
        sort: i,
      }))
    );

    counts.boards = await insertAll(
      client,
      "boards",
      [
        "doc_id", "system_id", "module_id", "title", "scope", "hus", "mermaid",
        "nodes", "edges", "groups", "sort",
      ],
      data.boards.map((b, i) => ({
        doc_id: b.docId,
        system_id: b.system,
        module_id: b.module,
        title: b.title,
        scope: b.scope,
        hus: json(b.hus),
        mermaid: b.mermaid,
        nodes: json(b.nodes ?? []),
        edges: json(b.edges ?? []),
        groups: json(b.groups ?? []),
        sort: i,
      }))
    );

    counts.screens = await insertAll(
      client,
      "screens",
      [
        "doc_id", "system_id", "name", "legacy_route", "target_route",
        "profiles", "implementation", "hus", "groups", "actions", "markdown", "sort",
      ],
      data.screens.map((s, i) => ({
        doc_id: s.docId,
        system_id: s.system,
        name: s.name,
        legacy_route: s.legacyRoute,
        target_route: s.targetRoute,
        profiles: s.profiles,
        implementation: s.implementation ?? null,
        hus: json(s.hus),
        groups: json(s.groups),
        actions: json(s.actions),
        markdown: s.markdown ?? null,
        sort: i,
      }))
    );

    // Leitura integral: poucas linhas, cada uma grande — lote pequeno.
    counts.documents = await insertAll(
      client,
      "documents",
      ["system_id", "file", "title", "intro", "sections", "sort"],
      (data.documents ?? []).map((d, i) => ({
        system_id: d.system,
        file: d.file,
        title: d.title,
        intro: d.intro || null,
        sections: json(d.sections),
        sort: i,
      })),
      5
    );

    counts.artifacts = await insertAll(
      client,
      "artifacts",
      ["id", "kind", "system_id", "file", "anchor", "title", "text", "via", "severity", "has_outcome", "cites", "fields", "sort"],
      (data.artifacts ?? []).map((a, i) => ({
        id: a.id,
        kind: a.kind,
        system_id: a.system,
        file: a.file,
        anchor: a.anchor,
        title: a.title,
        text: a.text,
        via: a.via,
        severity: a.severity,
        has_outcome: a.hasOutcome,
        cites: json(a.cites),
        fields: json(a.fields ?? {}),
        sort: i,
      })),
      50
    );

    counts.endpoints = await insertAll(
      client,
      "endpoints",
      ["system_id", "method", "key", "route", "int_id", "purpose", "input", "output", "tables", "hus", "implementation", "notes", "section", "sort"],
      (data.endpoints ?? []).map((e, i) => ({
        system_id: e.system,
        method: e.method,
        key: e.key,
        route: e.route,
        int_id: e.int,
        purpose: e.purpose,
        input: e.input,
        output: e.output,
        tables: e.tables,
        hus: json(e.hus),
        implementation: e.implementation,
        notes: e.notes,
        section: e.section,
        sort: i,
      }))
    );

    counts.contracts = await insertAll(
      client,
      "contracts",
      ["system_id", "name", "int_id", "section", "fields", "sort"],
      (data.contracts ?? []).map((c, i) => ({
        system_id: c.system,
        name: c.name,
        int_id: c.int ?? "",
        section: c.section,
        fields: json(c.fields),
        sort: i,
      }))
    );

    counts.integrations = await insertAll(
      client,
      "integrations",
      ["id", "name", "direction", "nature", "sort"],
      data.integrations.map((it, i) => ({
        id: it.id,
        name: it.name,
        direction: it.direction,
        nature: it.nature,
        sort: i,
      }))
    );

    await client.query("commit");

    for (const [table, n] of Object.entries(counts)) {
      console.log(`${table.padEnd(13)} ${String(n).padStart(4)} linhas`);
    }
    console.log("\nCarga concluída.");
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
