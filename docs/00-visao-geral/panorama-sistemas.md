# Panorama do projeto SEAL

O projeto SEAL documenta a solução para a SEALog, a operação de entregas do Desafio Prático em
Grupo do SEAL 2026.2. Hoje há um sistema documentado, o **SEALog** (sigla `SL`), que cobre a
operação de ponta a ponta. Esta página é o ponto de partida: o que a operação é, onde ela quebra e
como a documentação está organizada.

---

## 1. A operação hoje

| Etapa | Quem | Como é hoje | Onde quebra |
|---|---|---|---|
| Entrada de pedidos | Cliente, atendente | WhatsApp e Instagram, em texto, áudio ou planilha própria | Cerca de 1 em 5 pedidos chega incompleto; nada valida na origem |
| Registro e planejamento | Analista, coordenador | Cópia manual para planilhas; etiqueta à mão; rota de cabeça; roteiro por WhatsApp | Planilhas divergentes; coleta em janela apertada |
| Execução | Motoristas (cerca de 18) | Grupo de WhatsApp | Atualização em lote ou só no problema; foto solta; sem sinal |
| Consulta de status | Cliente, atendente, analista, motorista | Pergunta em cadeia | 5 saltos; de 20 min a mais de 2 h |
| Exceções | Coordenador | Decisão caso a caso | Sem regra; cliente não é avisado; sem visão por cliente |
| Financeiro | Financeiro | Planilhas manuais | Erro herdado do registro |

A causa comum é uma só: **não existe fonte única da verdade sobre o estado de cada entrega**. A
informação nasce no WhatsApp, passa por pessoas e acaba copiada em planilhas.

**Referências** — Gargalos §1 a §8.

## 2. Os sistemas

| Sigla | Sistema | Papel | Documentação |
|---|---|---|---|
| `SL` | SEALog | Registro único da entrega, do pedido à cobrança, com aplicativo do motorista e rastreio para o cliente | [`docs/01-sealog/`](../01-sealog/00-visao-geral.md) |

O SEALog tem três frentes de uso, todas sobre o mesmo registro:

| Frente | Quem usa | Onde |
|---|---|---|
| Painel da equipe | Atendente, analista, coordenador, financeiro | Navegador |
| Aplicativo do motorista | Motoristas | Celular, funciona sem sinal |
| Links do cliente | Clientes | Celular, sem login: link de pedido e link de rastreio |

## 3. Os números do sistema

| Medida | Quantidade |
|---|---|
| Módulos | 7 |
| Histórias de usuário | 24 |
| Regras de negócio | 51 |
| Fluxogramas | 6 |
| Telas | 17 |
| Entidades | 14 |
| Integrações | 3 |

## 4. O que a documentação é, e o que não é

A documentação de requisitos do FDE, de onde este repositório herdou o formato, é engenharia
reversa de sistemas em produção. Aqui não há sistema a reverter: **a origem é o resumo dos
gargalos, e os requisitos são a proposta de solução**. Por isso cada regra diz se é fato da origem
ou proposta (`docs/01-sealog/02-regras-de-negocio.md`), e o campo **Origem legada** de cada
história descreve como a operação faz aquilo hoje.

As restrições do enunciado valem para tudo: clientes pequenos pedem por WhatsApp e Instagram; a
equipe está acostumada com planilha e a adoção é o risco principal; o atendimento tem horário
limitado (sábado até 12h) e a Operação vai das 7h às 19h; o prazo é curto e não é obrigatório
entregar sistema funcional (Gargalos §9).

## 5. Por onde ler

1. [`docs/01-sealog/00-visao-geral.md`](../01-sealog/00-visao-geral.md) — escopo, módulos e os
   quatro casos do enunciado.
2. [`divergencias-e-riscos.md`](divergencias-e-riscos.md) — o que está em aberto no projeto.
3. [`atores-e-perfis.md`](atores-e-perfis.md), [`integracoes-externas.md`](integracoes-externas.md)
   e [`glossario.md`](glossario.md).
4. Os demais arquivos de `docs/01-sealog/`, na ordem.
