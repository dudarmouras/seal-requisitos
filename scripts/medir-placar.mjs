#!/usr/bin/env node
/**
 * Placar do repositório: contagem de estrutura + medição de jargão técnico nos
 * campos publicados. Lê `data/requisitos.json` — rode `npm run data:gerar` antes,
 * senão você mede o JSON velho.
 *
 *   node scripts/medir-placar.mjs                      placar completo, os sistemas do gerador
 *   node scripts/medir-placar.mjs --sistema=gc         recorta um sistema
 *   node scripts/medir-placar.mjs --sistema=gc --modulo=gerenciamento-perfis
 *   node scripts/medir-placar.mjs --detalhe            lista ocorrência por ocorrência
 *   node scripts/medir-placar.mjs --sistema=gc --falhar-se-jargao   exit 1 se houver jargão
 *
 * Os campos **publicados** são os que o leitor de negócio lê no app: título,
 * descrição, as três linhas da história, o texto das regras e os quatro campos de
 * cada critério. Campo de **rastreio** (`legacySource`, `integrationsNote`, `refs`,
 * coluna `Catálogo`) não é medido — ali a grafia legada é obrigatória.
 * Ver `docs/_convencoes/CONVENCOES.md` §9.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Padrões de identificador de código. Cada um tem nome, para que a saída de
 * `--detalhe` diga *por que* a linha foi marcada e o falso positivo fique visível
 * em vez de virar reescrita cega.
 */
/**
 * A regra forte, e a que de fato define o registro publicado: **campo publicado não
 * tem fonte monoespaçada**. Em vez de listar o que é proibido — lista que sempre
 * deixa passar algo —, permite-se só o identificador da própria documentação, que é
 * a navegação dela e a UI resolve como link.
 */
const REF_DOC = /^(?:HU|RN|CA|TL|FLX|INT|MSG|DIV|Q)-[A-Z]{2}-\d+$|^(?:RN|CA)\d+$/

/**
 * Termo técnico em inglês que não é identificador e por isso não vira `code span`,
 * mas também não é palavra que o leitor de negócio use. "O endpoint não valida o
 * papel do chamador" é tão ilegível quanto `pr_sel_Usuario`.
 */
const TERMOS_TECNICOS =
  /\b(?:endpoint|middleware|controller|payload|combo|checkbox|postback|deploy|hardcoded|runtime|wrapper|bind|parse|split|commit|catch|thread|cache|querystring|query string|impersonation|worker|pipeline|build|placeholder|timeout|POST|GET|HTTP \d{3}|HTTP)\b/gi

const PADROES = [
  ['code span', /`([^`\n]+)`/g],
  ['termo técnico', TERMOS_TECNICOS],
  ['arquivo/rota', /\b[\w-]+\.(?:aspx|ascx|Master|asmx|ashx|cs|vb|svc)\b/g],
  ['camada', /\b\w*(?:DAO|Bal|Bll|Dal)\b/g],
  ['stored procedure', /\b(?:pr|PR|sp|SP)_[A-Za-z0-9_]+/g],
  ['controle de tela', /\b(?:txt|lbl|ddl|chk|rdb|grd|btn|rpt|dgv|pnl|img|hdn|check|cmb)[A-Z]\w*/g],
  ['método', /\b[A-Za-z]\w*\.[A-Z]\w*\s*\(/g],
  ['chamada de rotina', /\b[A-Z]\w+\([\w, "'.]*\)/g],
  ['propriedade', /\b[A-Za-z]\w*\.[A-Z]\w+\b/g],
  // `@cod_usuario` sim; `@see.sp.gov.br` não — domínio de e-mail é vocabulário de negócio.
  ['parâmetro sql', /@[a-zA-Z]\w*(?![\w.])/g],
  ['estado/sessão', /\b(?:ViewState|Session|Request|Response|Server)\s*(?:\[|\.)/g],
  ['constante legada', /\b[A-Z][A-Z0-9]*_[A-Z0-9_]{2,}\b/g],
  ['coluna de banco', /\b(?:CD|NR|DT|DS|TP|SG|FL|QT|VL|IN)_[A-Z0-9_]+\b/g],
  ['identificador cru', /\bCODUSUARIO\b|\bCODIGO[A-Z]*\b/g],
  // `dt_inicial`, `st_destaque`, `nm_userdominio` — coluna e parâmetro em minúscula.
  // Português corrente não usa sublinhado, então o sinal é limpo.
  ['snake_case', /\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g],
  // `GestaoConteudo`, `AcessoNaoPermitido`, `BancoIndisponivel`, `RhOnline` — nome
  // de sistema, view ou rota escrito colado. A forma com espaço e acento
  // ("Gestão de Conteúdo") é vocabulário de negócio e não casa este padrão.
  ['PascalCase', /\b[A-Z][a-z]+(?:[A-Z][a-z]+)+\b/g],
  // `_Layout`, `_BaseController` — convenção de arquivo parcial do framework.
  ['identificador com _', /\b_[A-Za-z]\w*/g],
  // Rota dentro de code span, com ou sem extensão: `/`, `/error/AcessoNaoPermitido`.
  ['rota', /`\/[^`\n]*`/g],
  // `comDataInicioFim`, `marcarExcluirRegistro`, `carregarPrimeraVez` — camelCase
  // sem ponto nem parêntese, que nenhum outro padrão pega.
  ['camelCase', /\b[a-z]+[A-Z][A-Za-z0-9]*\b/g],
  ['valor interno', /\b(?:Tipo|Status|Situacao|Nivel|Flag)\s*=\s*-?\d+/g],
]

/**
 * Termos que casam um padrão mas são vocabulário de negócio legítimo. Nome de
 * plataforma externa e formato de link dela são fato de negócio, não artefato do
 * sistema: quem lê o requisito precisa saber que `/shorts/` não é reconhecido.
 */
const PERDOADOS = new Set([
  'E_MAIL', 'CPF_CNPJ', 'CEP', 'SEAL', 'SEALog', 'WhatsApp', 'UAT', 'SSO', 'AD', 'API', 'APIs',
  'URL', 'PDF', 'MB', 'KB', 'YouTube', 'PostgreSQL', 'SharePoint', 'PowerPoint',
  '`/embed/`', '`/shorts/`', '`watch?v=`', '`youtu.be/`',
])

/** Campos publicados de uma HU, achatados em pares [rótulo, texto]. */
function camposPublicados(hu) {
  const campos = [
    ['título', hu.title],
    ['descrição', hu.description],
    ['história/como', hu.como],
    ['história/gostaria', hu.gostaria],
    ['história/para', hu.para],
  ]
  for (const r of hu.rules ?? []) campos.push([`regra ${r.num}`, r.text])
  for (const c of hu.criteria ?? []) {
    for (const k of ['scenario', 'given', 'when', 'then']) {
      campos.push([`critério ${c.id}/${k}`, c[k]])
    }
  }
  return campos.filter(([, texto]) => typeof texto === 'string' && texto.length > 0)
}

function achados(texto) {
  const res = []
  for (const [nome, re] of PADROES) {
    for (const m of texto.matchAll(re)) {
      const t = m[0].trim()
      if (PERDOADOS.has(t.replace(/[[(.]$/, ''))) continue
      // Referência à própria documentação é navegação, não jargão de código.
      if (nome === 'code span' && REF_DOC.test(m[1].trim())) continue
      res.push({ padrao: nome, trecho: t })
    }
  }
  // Um mesmo trecho casado por dois padrões conta uma vez.
  const vistos = new Set()
  return res.filter((a) => !vistos.has(a.trecho) && vistos.add(a.trecho))
}

function classe(rotulo) {
  if (rotulo.startsWith('regra')) return 'regras'
  if (rotulo.startsWith('critério')) return 'critérios'
  if (rotulo.startsWith('história')) return 'história'
  if (rotulo === 'descrição') return 'descrições'
  return 'títulos'
}

const CLASSES = ['títulos', 'descrições', 'história', 'regras', 'critérios']

function main() {
  const args = process.argv.slice(2)
  const opt = (n) => args.find((a) => a.startsWith(`--${n}=`))?.split('=').slice(1).join('=')
  const flag = (n) => args.includes(`--${n}`)

  const sistema = opt('sistema')?.toLowerCase()
  const modulo = opt('modulo')
  const detalhe = flag('detalhe')
  const falhar = flag('falhar-se-jargao')
  const jsonOut = flag('json')

  const d = JSON.parse(readFileSync(join(RAIZ, 'data', 'requisitos.json'), 'utf8'))

  // ---------- Placar de estrutura: sempre o repositório inteiro ----------
  const estrutura = {
    sistemas: d.systems.length,
    módulos: d.modules.length,
    hus: d.hus.length,
    pranchas: d.boards.length,
    telas: d.screens.length,
    integrações: d.integrations.length,
    'hus com nota de integração': d.hus.filter((h) => h.integrationsNote).length,
    'hus citando INT-*': d.hus.filter((h) => h.integrations?.length).length,
  }

  // ---------- Jargão: no recorte pedido ----------
  const recorte = d.hus.filter(
    (h) => (!sistema || h.system === sistema) && (!modulo || h.module === modulo)
  )

  const porSistema = new Map()
  const ocorrencias = []

  for (const hu of recorte) {
    const s = porSistema.get(hu.system) ?? {
      sistema: hu.system.toUpperCase(),
      hus: 0,
      husComJargao: new Set(),
      modulosComJargao: new Set(),
      total: Object.fromEntries(CLASSES.map((c) => [c, 0])),
      comJargao: Object.fromEntries(CLASSES.map((c) => [c, 0])),
    }
    porSistema.set(hu.system, s)
    s.hus += 1

    for (const [rotulo, texto] of camposPublicados(hu)) {
      const cls = classe(rotulo)
      s.total[cls] += 1
      const as = achados(texto)
      if (!as.length) continue
      s.comJargao[cls] += 1
      s.husComJargao.add(hu.docId)
      s.modulosComJargao.add(hu.module)
      ocorrencias.push({
        hu: hu.docId,
        sistema: hu.system.toUpperCase(),
        modulo: hu.module,
        campo: rotulo,
        trechos: as,
        texto,
      })
    }
  }

  const linhas = [...porSistema.values()].sort((a, b) => a.sistema.localeCompare(b.sistema))
  const somaJargao = linhas.reduce(
    (acc, l) => acc + CLASSES.reduce((a, c) => a + l.comJargao[c], 0),
    0
  )

  if (jsonOut) {
    console.log(
      JSON.stringify(
        {
          estrutura,
          recorte: { sistema: sistema ?? null, modulo: modulo ?? null, hus: recorte.length },
          jargao: linhas.map((l) => ({
            ...l,
            husComJargao: [...l.husComJargao],
            modulosComJargao: [...l.modulosComJargao],
          })),
          totalCamposComJargao: somaJargao,
        },
        null,
        2
      )
    )
  } else {
    console.log('\nPLACAR DE ESTRUTURA  (repositório inteiro)\n')
    for (const [k, v] of Object.entries(estrutura)) {
      console.log(`  ${String(v).padStart(5)}  ${k}`)
    }

    const alvo = [sistema && `sistema=${sistema}`, modulo && `módulo=${modulo}`]
      .filter(Boolean)
      .join(' · ')
    console.log(`\nJARGÃO EM CAMPO PUBLICADO  (${alvo || 'todos os sistemas'} · ${recorte.length} HUs)\n`)
    const cab = ['Sis', ...CLASSES, 'HUs', 'Mód'].map((c) => c.padEnd(11))
    console.log('  ' + cab.join(''))
    for (const l of linhas) {
      const cels = [
        l.sistema.padEnd(11),
        ...CLASSES.map((c) => `${l.comJargao[c]}/${l.total[c]}`.padEnd(11)),
        `${l.husComJargao.size}/${l.hus}`.padEnd(11),
        String(l.modulosComJargao.size).padEnd(11),
      ]
      console.log('  ' + cels.join(''))
    }
    console.log(`\n  Total de campos publicados com jargão: ${somaJargao}`)

    if (detalhe) {
      console.log('\nOCORRÊNCIAS\n')
      for (const o of ocorrencias) {
        const trechos = o.trechos.map((t) => `${t.trecho} [${t.padrao}]`).join(', ')
        console.log(`  ${o.hu}  ${o.modulo}  ${o.campo}`)
        console.log(`    → ${trechos}`)
        console.log(`    ${o.texto.length > 160 ? o.texto.slice(0, 157) + '…' : o.texto}`)
      }
    } else if (somaJargao) {
      console.log('  (rode com --detalhe para ver ocorrência por ocorrência)')
    }
    console.log()
  }

  if (falhar && somaJargao) process.exit(1)
}

main()
