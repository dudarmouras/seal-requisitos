import { Link } from "react-router-dom";
import { porExtenso, useData } from "../lib/data";
import { PAGINAS_PRODUTO, paginaDoArquivo } from "../lib/produto";

export default function HomePage() {
  const { systems, modules, hus, boards, screens, documents, artifacts } = useData();
  // Os arquivos da visão de produto têm rota própria e aparecem na seção "Produto".
  const geral = documents.filter((d) => d.system === "geral" && !paginaDoArquivo(d.file));
  const contagem: Record<string, string> = {
    decisoes: `${artifacts.filter((a) => a.kind === "DEC").length} decisões`,
    requisitos: `${artifacts.filter((a) => a.kind === "RF").length} funcionais · ${artifacts.filter((a) => a.kind === "RNF").length} não funcionais`,
    backlog: `${artifacts.filter((a) => a.kind === "BL").length} itens em releases`,
  };

  const totalRules = hus.reduce((acc, h) => acc + h.rules.length, 0);
  const totalCriteria = hus.reduce((acc, h) => acc + h.criteria.length, 0);

  return (
    <div className="page">
      <div className="home-hero">
        <h1>Requisitos SEAL</h1>
        <p>
          {systems.length === 1
            ? "O SEALog, sistema proposto para a operação de entregas do desafio SEAL 2026.2"
            : `Os ${porExtenso(systems.length)} sistemas do projeto SEAL`}
          , já com as entregas terceirizadas, documentado a partir do enunciado e da reunião com
          o cliente e navegável aqui: cada
          história de usuário com descrição, regras de negócio e critérios de aceitação, ligada
          aos fluxogramas e às telas em que aparece.
        </p>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="n">{systems.length}</div>
          <div className="l">Sistemas</div>
        </div>
        <div className="stat-card">
          <div className="n">{hus.length}</div>
          <div className="l">Histórias de usuário</div>
        </div>
        <div className="stat-card">
          <div className="n">{totalRules}</div>
          <div className="l">Regras de negócio</div>
        </div>
        <div className="stat-card">
          <div className="n">{totalCriteria}</div>
          <div className="l">Critérios de aceitação</div>
        </div>
        <div className="stat-card">
          <div className="n">{boards.length}</div>
          <div className="l">Fluxogramas</div>
        </div>
        <div className="stat-card">
          <div className="n">{screens.length}</div>
          <div className="l">Telas</div>
        </div>
      </div>

      <div className="section-heading">Sistemas</div>
      <div className="module-grid">
        {systems.map((sys) => {
          const sysModules = modules.filter((m) => m.system === sys.id).length;
          const sysHus = hus.filter((h) => h.system === sys.id).length;
          const sysBoards = boards.filter((b) => b.system === sys.id).length;
          return (
            <Link key={sys.id} to={`/sistema/${sys.id}`} className="module-card system-card">
              <strong>
                <span className="sys-badge">{sys.short}</span>
                {sys.label}
              </strong>
              <span>
                {sysHus} histórias · {sysModules} módulos · {sysBoards} fluxogramas
              </span>
              {sys.legacyStack && <span className="stack">{sys.legacyStack}</span>}
            </Link>
          );
        })}
      </div>

      <div className="section-heading">Produto</div>
      <div className="module-grid">
        {PAGINAS_PRODUTO.filter((p) => documents.some((d) => d.system === "geral" && d.file === p.file)).map((p) => {
          const doc = documents.find((d) => d.system === "geral" && d.file === p.file)!;
          return (
            <Link key={p.path} to={p.path} className="module-card">
              <strong>{p.label}</strong>
              <span>{contagem[p.file] ?? `${doc.sections.length} seções`}</span>
            </Link>
          );
        })}
      </div>

      <div className="section-heading">Atalhos</div>
      <div className="module-grid">
        <Link to="/fluxos" className="module-card">
          <strong>Fluxogramas</strong>
          <span>{boards.length} diagramas — os processos ponta a ponta</span>
        </Link>
        <Link to="/telas" className="module-card">
          <strong>Telas e campos</strong>
          <span>{screens.length} telas com dicionário de dados</span>
        </Link>
      </div>

      {geral.length > 0 && (
        <>
          <div className="section-heading">Visão geral do projeto</div>
          <div className="doc-grid">
            {geral.map((d) => (
              <Link key={d.file} to={`/doc/geral/${d.file}`} className="module-card">
                <strong>{d.title}</strong>
                <span>{d.sections.length} seções</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
