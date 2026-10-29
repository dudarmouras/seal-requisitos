# Divergências e riscos

Visão consolidada do que está em aberto no projeto SEAL. O detalhe de cada sistema está no `09`
dele; aqui ficam o que é do projeto inteiro (`*-GERAL-*`) e o resumo dos riscos do SEALog.

---

## 1. Do projeto

### `DIV-GERAL-01` — Fonte única e secundária

> **Risco:** toda a documentação sai de um resumo de duas páginas dos gargalos, não do enunciado do
> desafio. Nenhum número, caso ou restrição foi conferido no texto original.

> **Pergunta `Q-GERAL-01`:** obter o enunciado do Desafio Prático em Grupo (SEAL 2026.2) e
> conferi-lo contra esta documentação com `/conferir-origem`. Até lá, `fontes/README.md` registra
> só o resumo.

### `DIV-GERAL-02` — Requisito sem sistema por trás

> **Divergência `DIV-GERAL-02`:** o formato desta documentação veio do projeto FDE, em que a
> origem é engenharia reversa e a regra é "não inventar". Aqui a solução **é** a proposta: não há
> o que reverter.

**Desfecho** — a regra continua, adaptada: toda regra diz se é fato da origem ou proposta
(`docs/01-sealog/02-regras-de-negocio.md`), e o que só o cliente pode decidir — preço, prazo,
política de tentativas — fica como `Q-SL-*`, nunca como número inventado.

## 2. Riscos do SEALog

| ID | Risco | Mitigação |
|---|---|---|
| `DIV-SL-03` | Aviso automático por WhatsApp pode não ser viável no início | Painel mostra os avisos a enviar, com texto pronto |
| `DIV-SL-04` | Motorista não registrar na hora | Registro sem digitar, sem sinal, e comprovante obrigatório |
| `DIV-SL-05` | Adoção pela equipe acostumada com planilha | Exportação, lista com cara de planilha; transição em `Q-SL-14` |
| `DIV-SL-06` | Dados pessoais no rastreio e no comprovante | Link com chave impossível de adivinhar, sem rua e telefone; `Q-SL-05` |
| `DIV-SL-07` | A origem é um resumo | Conferir com o enunciado (`Q-GERAL-01`) |

## 3. Perguntas que bloqueiam

As perguntas sem as quais uma parte do sistema não fecha:

| Pergunta | O que bloqueia |
|---|---|
| `Q-SL-03` | A validação de entrada — o coração do caso "Pedido incompleto" |
| `Q-SL-04` | A data prevista e, com ela, o conceito de atraso |
| `Q-SL-07` | A regra formal de retorno ao galpão |
| `Q-SL-09` | O valor de qualquer fechamento de cobrança |
| `Q-SL-12` | O aviso proativo automático |

A lista completa está em
[`docs/01-sealog/09-divergencias-e-lacunas.md`](../01-sealog/09-divergencias-e-lacunas.md) §3.
