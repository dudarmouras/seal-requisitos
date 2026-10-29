import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useMatch } from "react-router-dom";
import { porExtenso, useData } from "../lib/data";
import { useAuth } from "../lib/auth";
import { PAGINAS_PRODUTO } from "../lib/produto";

const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Chave de um módulo na árvore — o id do módulo só é único dentro do sistema. */
const moduleKey = (system: string, module: string) => `${system}:${module}`;

export default function Sidebar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { systems, modules, hus, huById } = useData();
  const { usuario, sair } = useAuth();
  const location = useLocation();
  const huMatch = useMatch("/hu/:huId");
  const systemMatch = useMatch("/sistema/:systemId/*");

  const activeHu = huMatch?.params.huId ? huById.get(huMatch.params.huId) : undefined;
  const activeSystemId = activeHu?.system ?? systemMatch?.params.systemId ?? null;

  const [openSystems, setOpenSystems] = useState<Set<string>>(new Set());
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  // Abre o caminho do que está na tela: sistema da HU ativa e, dentro dele,
  // o módulo dela.
  useEffect(() => {
    if (activeSystemId) {
      setOpenSystems((prev) =>
        prev.has(activeSystemId) ? prev : new Set(prev).add(activeSystemId)
      );
    }
  }, [activeSystemId]);

  useEffect(() => {
    if (activeHu?.module) {
      const key = moduleKey(activeHu.system, activeHu.module);
      setOpenModules((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
    }
  }, [activeHu]);

  const husByModule = useMemo(() => {
    const map = new Map<string, typeof hus>();
    for (const hu of hus) {
      if (!hu.module) continue;
      const key = moduleKey(hu.system, hu.module);
      const list = map.get(key);
      if (list) list.push(hu);
      else map.set(key, [hu]);
    }
    return map;
  }, [hus]);

  function toggle(
    set: Set<string>,
    setter: (v: Set<string>) => void,
    id: string
  ) {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  }

  return (
    <aside className="sidebar">
      <Link to="/" className="brand-row">
        <div className="brand-mark">SEAL</div>
        <div className="brand-text">
          <strong>Requisitos &amp; Fluxogramas</strong>
          <span>
            {systems.length === 1
              ? "SEALog — operação de entregas"
              : `${maiuscula(porExtenso(systems.length))} sistemas do projeto SEAL`}
          </span>
        </div>
      </Link>

      <div className="search-trigger-wrap">
        <button type="button" className="search-trigger" onClick={onOpenSearch}>
          <span>Buscar HU, regra, critério…</span>
          <kbd>⌘K</kbd>
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navegação</div>
        <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Visão geral
        </NavLink>
        <NavLink
          to="/fluxos"
          className={() =>
            "nav-link" + (location.pathname.startsWith("/fluxos") ? " active" : "")
          }
        >
          Fluxogramas
        </NavLink>

        <div className="nav-section-label">Produto</div>
        {PAGINAS_PRODUTO.map((p) => (
          <NavLink key={p.path} to={p.path} className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            {p.label}
          </NavLink>
        ))}

        <div className="nav-section-label">Sistemas</div>
        {systems.map((sys) => {
          const sysModules = modules.filter((m) => m.system === sys.id);
          const sysHuCount = hus.filter((h) => h.system === sys.id).length;
          const open = openSystems.has(sys.id);
          return (
            <div key={sys.id} className="nav-system">
              <button
                type="button"
                className={"nav-system-toggle" + (activeSystemId === sys.id ? " current" : "")}
                onClick={() => toggle(openSystems, setOpenSystems, sys.id)}
              >
                <span className={"chev" + (open ? " open" : "")}>▶</span>
                <span className="sys-short">{sys.short}</span>
                <span className="sys-label">{sys.label}</span>
                <span className="count">{sysHuCount}</span>
              </button>

              {open && (
                <div className="nav-system-body">
                  <Link to={`/sistema/${sys.id}`} className="nav-system-overview">
                    Visão do sistema →
                  </Link>
                  {sysModules.map((mod) => {
                    const key = moduleKey(sys.id, mod.id);
                    const modHus = husByModule.get(key) ?? [];
                    const modOpen = openModules.has(key);
                    return (
                      <div key={key}>
                        <button
                          type="button"
                          className="nav-module-toggle"
                          onClick={() => toggle(openModules, setOpenModules, key)}
                        >
                          <span className={"chev" + (modOpen ? " open" : "")}>▶</span>
                          <span className="mod-label">{mod.label}</span>
                          <span className="count">{modHus.length}</span>
                        </button>
                        {modOpen &&
                          modHus.map((hu) => (
                            <NavLink
                              key={hu.docId}
                              to={`/hu/${hu.docId}`}
                              className={({ isActive }) =>
                                "nav-hu-link" + (isActive ? " active" : "")
                              }
                              title={`${hu.docId} — ${hu.title}`}
                            >
                              <span className="code">{hu.docId}</span>
                              <span>{hu.title}</span>
                            </NavLink>
                          ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-foot">
        <span title={usuario ?? undefined}>{usuario}</span>
        <button type="button" className="btn-ghost" onClick={sair}>
          Sair
        </button>
      </div>
    </aside>
  );
}
