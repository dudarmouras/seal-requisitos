#!/usr/bin/env node
/**
 * Confere se o JSON — e portanto a página — tem tudo o que o Markdown tem.
 *
 * O caminho `docs/*.md` → `data/requisitos.json` → página é um parser, e parser
 * perde coisa em silêncio: renomeie um rótulo e a seção inteira vira `null` com
 * build verde (é o caso de `**Integrações e APIs**`, ver CLAUDE.md). Este script
 * conta no Markdown e compara com o JSON, HU por HU, e falha alto na diferença.
 *
 *   node scripts/conferir-md-vs-json.mjs              todos os sistemas
 *   node scripts/conferir-md-vs-json.mjs --sistema=in  um sistema
 *   node scripts/conferir-md-vs-json.mjs --sistema=in --modulo=home
 *
 * Exit 1 se houver divergência — serve em aceite e em hook de pré-commit.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { HUS_OCULTAS, TELAS_OCULTAS, semMarcasDeOculto } from './lib/ocultos.mjs'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')

// Os mesmos sistemas de `SYSTEMS` em `scripts/gerar-requisitos-json.mjs`: sistema
// que está aqui e não lá acusaria toda HU como "existe no Markdown e NÃO existe no JSON".
const PASTAS = {
  sl: '01-sealog',
}

/** Extrai, do bloco de uma HU no Markdown, o que a página deveria mostrar. */
function lerBloco(bloco) {
  const linhas = bloco.split('\n')
  const secao = (rotulo) => {
    const i = linhas.findIndex((l) => l.trim() === `**${rotulo}**`)
    if (i < 0) return []
    const fim = linhas.findIndex((l, j) => j > i && /^\*\*[A-ZÀ-Ú]/.test(l.trim()))
    return linhas.slice(i + 1, fim < 0 ? undefined : fim)
  }
  const linhasDeTabela = (ls, prefixo) =>
    ls.filter((l) => new RegExp(`^\\| ${prefixo}\\d+ \\|`).test(l.trim())).length

  return {
    regras: linhasDeTabela(secao('Regras de negócio'), 'RN'),
    criterios: linhasDeTabela(secao('Critérios de aceitação'), 'CA'),
    temDescricao: secao('Descrição').some((l) => l.trim().length > 0),
    temHistoria: linhas.some((l) => l.startsWith('**Como**')),
    temIntegracoes: linhas.some((l) => l.startsWith('**Integrações e APIs**')),
    telas: (() => {
      const l = linhas.find((x) => x.startsWith('| **Telas** |'))
      if (!l) return 0
      // As telas ocultas (`scripts/lib/ocultos.mjs`) saem do JSON, e portanto da conta.
      return (l.match(/`TL-[A-Z]{2}-\d+`/g) ?? []).filter((t) => !TELAS_OCULTAS.has(t.replace(/`/g, ''))).length
    })(),
  }
}

const ler = (sig, arquivo) => semMarcasDeOculto(readFileSync(join(RAIZ, 'docs', PASTAS[sig], arquivo), 'utf8').replace(/\r\n/g, '\n'))

/** Linhas fora de bloco de código. */
function foraDeCodigo(texto) {
  let cerca = false
  return texto.split('\n').filter((l) => {
    if (/^\s*(```|~~~)/.test(l)) {
      cerca = !cerca
      return false
    }
    return !cerca
  })
}

/** Linhas de dados das tabelas cujo cabeçalho satisfaz `teste`, num bloco. */
function linhasDeTabelas(bloco, teste) {
  const ls = foraDeCodigo(bloco)
  let n = 0
  for (let i = 0; i < ls.length; i++) {
    const cab = ls[i].trim()
    if (!cab.startsWith('|') || !/^\|[\s:|-]+\|?$/.test((ls[i + 1] ?? '').trim())) continue
    const celulas = cab.split('|').map((c) => c.trim()).filter(Boolean)
    let j = i + 2
    for (; j < ls.length && ls[j].trim().startsWith('|'); j++) {
      if (teste(celulas)) {
        const primeira = ls[j].split('|')[1]?.trim()
        if (primeira && !/^(—|-)$/.test(primeira)) n++
      }
    }
    i = j - 1
  }
  return n
}

function conferirAlemDasHus(d, siglas, problemas) {
  const conta = { telas: 0, campos: 0, acoes: 0, ids: 0, endpoints: 0, arquivos: 0 }

  for (const sig of siglas) {
    // Telas: campos e ações, tela a tela.
    const md05 = ler(sig, '05-telas-e-campos.md')
    const partes = md05.split(/^(?=#{2,4}\s+`?TL-[A-Z]{2}-\d+`?\s+—)/m).slice(1)
    for (const bloco of partes) {
      const id = bloco.match(/(TL-[A-Z]{2}-\d+)/)[1]
      if (TELAS_OCULTAS.has(id)) continue
      const tela = d.screens.find((s) => s.docId === id)
      if (!tela) {
        problemas.push(`${id}: existe no Markdown e NÃO existe no JSON`)
        continue
      }
      conta.telas++
      const campos = linhasDeTabelas(bloco, (c) => c.length >= 9 && /^(campo|elemento|coluna)$/i.test(c[0]) && /^rótulo/i.test(c[1] ?? ''))
      const acoes = linhasDeTabelas(bloco, (c) => /^ação$/i.test(c[0]))
      const noJson = tela.groups.reduce((a, g) => a + g.fields.length, 0)
      if (campos !== noJson) problemas.push(`${id}: campos — Markdown ${campos}, JSON ${noJson}`)
      if (acoes !== (tela.actions ?? []).length) problemas.push(`${id}: ações — Markdown ${acoes}, JSON ${(tela.actions ?? []).length}`)
      conta.campos += noJson
      conta.acoes += acoes
    }

    // Índice: todo id definido no arquivo dele — por título ou primeira célula — está no JSON.
    const casa = { RN: '02-regras-de-negocio.md', ENT: '06-modelo-de-dados.md', INT: '07-integracoes.md', MSG: '08-mensagens-e-erros.md', DIV: '09-divergencias-e-lacunas.md', Q: '09-divergencias-e-lacunas.md' }
    const noIndice = new Set(d.artifacts.filter((a) => a.system === sig).map((a) => a.id))
    for (const [tipo, arquivo] of Object.entries(casa)) {
      const re = tipo === 'INT' ? 'INT-\\d{3}' : `${tipo}-${sig.toUpperCase()}-\\d+`
      const definidos = new Set()
      for (const l of foraDeCodigo(ler(sig, arquivo))) {
        const m =
          l.match(new RegExp(`^#{2,3}\\s+(?:[\\d.]+\\s+)?\`?(${re})\`?\\s*[—-]`)) ??
          l.match(new RegExp(`^\\|\\s*\`?(${re})\`?\\s*\\|`))
        if (m) definidos.add(m[1])
      }
      for (const id of definidos) {
        if (!noIndice.has(id) && !(tipo === 'INT' && d.artifacts.some((a) => a.id === id))) {
          problemas.push(`${id}: definido em ${arquivo} e ausente do índice`)
        }
      }
      conta.ids += definidos.size
    }

    // Endpoints: cada `MÉTODO /rota` na primeira célula de uma tabela "Método e rota".
    const md07 = ler(sig, '07-integracoes.md')
    let declarados = 0
    {
      const ls = foraDeCodigo(md07)
      for (let i = 0; i < ls.length; i++) {
        if (!/^\|\s*M[ée]todo/i.test(ls[i].trim())) continue
        for (let j = i + 2; j < ls.length && ls[j].trim().startsWith('|'); j++) {
          const primeira = ls[j].split('|')[1] ?? ''
          const base = /\bem\s+`\//.test(primeira)
          const metodos = primeira.match(/`(GET|POST|PUT|PATCH|DELETE)(\s+\/[^`]*)?`/g) ?? []
          declarados += base ? metodos.length : metodos.filter((m) => /\s\//.test(m)).length
        }
      }
    }
    const noJson = d.endpoints.filter((e) => e.system === sig).length
    if (declarados !== noJson) problemas.push(`${sig}: endpoints — Markdown ${declarados}, JSON ${noJson}`)
    conta.endpoints += noJson

    // Leitura integral: toda linha não vazia de cada arquivo está no documento do JSON.
    for (const nome of readdirSync(join(RAIZ, 'docs', PASTAS[sig])).filter((n) => n.endsWith('.md'))) {
      const doc = d.documents?.find((x) => x.system === sig && x.file === nome.replace(/\.md$/, ''))
      if (!doc) {
        problemas.push(`${sig}/${nome}: arquivo fora da leitura integral`)
        continue
      }
      conta.arquivos++
      const presentes = new Set(
        [doc.title, doc.intro, ...doc.sections.flatMap((s) => [s.title, s.body])]
          .join('\n')
          .split('\n')
          .map((l) => l.trim())
      )
      const faltam = ler(sig, nome)
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !presentes.has(l) && !presentes.has(l.replace(/^#{1,3}\s+/, '')))
      if (faltam.length) problemas.push(`${sig}/${nome}: ${faltam.length} linha(s) fora da leitura integral — "${faltam[0].slice(0, 60)}"`)
    }
  }
  return conta
}

function main() {
  const args = process.argv.slice(2)
  const opt = (n) => args.find((a) => a.startsWith(`--${n}=`))?.split('=')[1]
  const sistema = opt('sistema')?.toLowerCase()
  const modulo = opt('modulo')

  const d = JSON.parse(readFileSync(join(RAIZ, 'data', 'requisitos.json'), 'utf8'))
  const siglas = sistema ? [sistema] : Object.keys(PASTAS)

  let conferidas = 0
  const problemas = []

  for (const sig of siglas) {
    const caminho = join(RAIZ, 'docs', PASTAS[sig], '03-historias-de-usuario.md')
    const md = semMarcasDeOculto(readFileSync(caminho, 'utf8'))
    // Split, não regex com lookahead: `\Z` não existe em JavaScript — ali é o
    // caractere literal `Z`, e o bloco seria cortado no primeiro `Z` do texto.
    const blocos = md
      .split(/^### /m)
      .slice(1)
      .map((b) => '### ' + b)
      .filter((b) => /^### HU-[A-Z]{2}-\d+/.test(b))

    for (const bloco of blocos) {
      const docId = bloco.match(/^### (HU-[A-Z]{2}-\d+)/)[1]
      // Oculta do deploy de propósito — ver `scripts/lib/ocultos.mjs`.
      if (HUS_OCULTAS.has(docId)) continue
      const hu = d.hus.find((h) => h.docId === docId)
      if (!hu) {
        problemas.push(`${docId}: existe no Markdown e NÃO existe no JSON`)
        continue
      }
      if (modulo && hu.module !== modulo) continue
      conferidas += 1

      const md_ = lerBloco(bloco)
      const cmp = [
        ['regras', md_.regras, hu.rules.length],
        ['critérios', md_.criterios, hu.criteria.length],
        ['telas', md_.telas, hu.screensRefs.length],
      ]
      for (const [nome, noMd, noJson] of cmp) {
        if (noMd !== noJson) {
          problemas.push(`${docId}: ${nome} — Markdown ${noMd}, JSON ${noJson}`)
        }
      }
      if (md_.temDescricao && !hu.description) {
        problemas.push(`${docId}: descrição no Markdown e vazia no JSON`)
      }
      if (md_.temHistoria && !(hu.como || hu.gostaria || hu.para)) {
        problemas.push(`${docId}: história no Markdown e vazia no JSON`)
      }
      if (md_.temIntegracoes && !hu.integrationsNote) {
        problemas.push(
          `${docId}: seção "Integrações e APIs" no Markdown e integrationsNote nulo no JSON`
        )
      }
    }
  }

  // Telas, índice por id, endpoints e leitura integral — só na conferência do
  // sistema inteiro: nenhum deles se recorta por módulo.
  const extras = modulo ? null : conferirAlemDasHus(d, siglas, problemas)

  const alvo = [sistema && `sistema=${sistema}`, modulo && `módulo=${modulo}`]
    .filter(Boolean)
    .join(' · ')
  console.log(`\nMarkdown → JSON → página  (${alvo || 'todos os sistemas'})`)
  console.log(`  ${conferidas} HUs conferidas`)
  if (extras) {
    console.log(
      `  ${extras.telas} telas (${extras.campos} campos, ${extras.acoes} ações), ` +
        `${extras.ids} ids do índice, ${extras.endpoints} endpoints, ` +
        `${extras.arquivos} arquivos na leitura integral`
    )
  }

  if (problemas.length) {
    console.log(`\n  ${problemas.length} DIVERGÊNCIAS:\n`)
    problemas.forEach((p) => console.log('    ' + p))
    console.log()
    process.exit(1)
  }
  console.log('  nenhuma divergência: a página mostra tudo o que o Markdown declara\n')
}

main()
