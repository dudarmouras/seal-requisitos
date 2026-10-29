import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../lib/data";
import { stripInline } from "../lib/md";
import type { Hu } from "../lib/types";

function normalize(s: string): string {
  return stripInline(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

interface SearchHit {
  hu: Hu;
  /** trecho onde o termo apareceu (regra/critério), quando fora do título */
  snippet: string | null;
  rank: number;
}

function findHits(hus: Hu[], query: string): SearchHit[] {
  const nq = normalize(query);
  const hits: SearchHit[] = [];

  for (const hu of hus) {
    if (normalize(hu.docId).includes(nq)) {
      hits.push({ hu, snippet: null, rank: 0 });
      continue;
    }
    if (normalize(hu.title).includes(nq)) {
      hits.push({ hu, snippet: null, rank: 1 });
      continue;
    }
    const story = [hu.description, hu.como, hu.gostaria, hu.para, hu.legacySource]
      .filter(Boolean)
      .join(" ");
    if (normalize(story).includes(nq)) {
      hits.push({ hu, snippet: null, rank: 2 });
      continue;
    }
    let snippet: string | null = null;
    for (const rule of hu.rules) {
      if (normalize(rule.text).includes(nq)) {
        snippet = `${rule.num}: ${stripInline(rule.text)}`;
        break;
      }
    }
    if (!snippet) {
      for (const c of hu.criteria) {
        const full = `${c.scenario} Dado ${c.given} Quando ${c.when} Então ${c.then}`;
        if (normalize(full).includes(nq)) {
          snippet = stripInline(full);
          break;
        }
      }
    }
    if (snippet) hits.push({ hu, snippet, rank: 3 });
  }

  hits.sort((a, b) => a.rank - b.rank || a.hu.docId.localeCompare(b.hu.docId));
  return hits.slice(0, 15);
}

function Snippet({ text, query }: { text: string; query: string }) {
  const nText = normalize(text);
  const nq = normalize(query);
  const idx = nText.indexOf(nq);
  if (idx < 0) return <span className="snippet">{text.slice(0, 130)}…</span>;
  const start = Math.max(0, idx - 45);
  const end = Math.min(text.length, idx + nq.length + 85);
  return (
    <span className="snippet">
      {start > 0 && "…"}
      {text.slice(start, idx)}
      <mark>{text.slice(idx, idx + nq.length)}</mark>
      {text.slice(idx + nq.length, end)}
      {end < text.length && "…"}
    </span>
  );
}

export default function SearchCommand({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { hus, systemById } = useData();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const hits = useMemo(
    () => (query.trim().length >= 2 ? findHits(hus, query.trim()) : []),
    [hus, query]
  );

  useEffect(() => setSel(0), [hits.length]);

  if (!open) return null;

  function pick(huId: string) {
    onClose();
    navigate(`/hu/${huId}`);
  }

  function onKeyDown(ev: React.KeyboardEvent) {
    if (ev.key === "Escape") onClose();
    else if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setSel((s) => Math.min(s + 1, hits.length - 1));
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (ev.key === "Enter" && hits[sel]) {
      pick(hits[sel].hu.docId);
    }
  }

  return (
    <div className="cmdk-overlay" onMouseDown={(ev) => ev.target === ev.currentTarget && onClose()}>
      <div className="cmdk" role="dialog" aria-label="Busca global">
        <input
          ref={inputRef}
          className="cmdk-input"
          placeholder="Buscar por código, título, regra, critério… (ex.: HU-OF-012, protocolo, revogar)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="cmdk-results">
          {query.trim().length >= 2 && hits.length === 0 && (
            <div className="cmdk-empty">Nenhuma história de usuário encontrada para “{query}”.</div>
          )}
          {hits.map((hit, i) => (
            <button
              key={hit.hu.docId}
              type="button"
              className={"cmdk-item" + (i === sel ? " sel" : "")}
              onMouseEnter={() => setSel(i)}
              onClick={() => pick(hit.hu.docId)}
            >
              <span className="row1">
                <span className="code">{hit.hu.docId}</span>
                <span className="t">{hit.hu.title}</span>
              </span>
              <span className="m">
                {systemById.get(hit.hu.system)?.label ?? hit.hu.system}
                {hit.hu.moduleLabel ? ` · ${hit.hu.moduleLabel}` : ""}
              </span>
              {hit.snippet && <Snippet text={hit.snippet} query={query.trim()} />}
            </button>
          ))}
        </div>
        <div className="cmdk-hint">
          <span>↑↓ navegar</span>
          <span>Enter abrir</span>
          <span>Esc fechar</span>
        </div>
      </div>
    </div>
  );
}
