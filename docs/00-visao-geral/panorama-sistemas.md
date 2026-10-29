# Panorama do projeto SEAL

O projeto SEAL documenta a solução da Equipe 11 para a SEALog, o caso do Desafio Prático em Grupo
do SEAL 2026.2/2027.1. Há um sistema documentado, o **SEALog** (sigla `SL`), que cobre o caminho do
pedido de ponta a ponta. Esta página é o ponto de partida: o que a operação é, o que mudou com a
terceirização, onde ela quebra e como a documentação está organizada.

---

## 1. A operação hoje

| Etapa | Quem | Como é hoje | Onde quebra |
|---|---|---|---|
| Entrada de pedidos | Loja, atendente | Um número de WhatsApp, em texto, áudio ou planilha própria | Cerca de 1 em 5 pedidos chega incompleto; nada valida na origem |
| Registro | Analista | Cópia do grupo interno para a planilha online do dia, uma por analista | Planilhas divergentes; etiqueta à mão |
| Execução | Terceirizadas, desde a terceirização | Cada uma atualiza a planilha ou avisa por WhatsApp, no seu padrão | Sem padrão de status nem de comprovante; "diz que entregou" |
| Consulta de status | Loja, atendente, analista | Pergunta em cadeia | Até 5 saltos; de 20 minutos a mais de 2 horas |
| Exceções | Coordenador | Decisão caso a caso quando o pacote volta, entre 17h e 18h | Sem regra; a loja não é avisada; sem visão por cliente |
| Financeiro | Financeiro | Planilha do dia, fechada às 19h | Erro herdado do registro; agora também o pagamento das terceirizadas |

A causa comum é uma só: **não existe fonte única da verdade sobre o estado de cada entrega**. A
informação nasce no WhatsApp, passa por pessoas e acaba copiada em planilhas.

**Referências** — Enunciado §2, §8; Encontro 1 [13:15], [26:53]; Gargalos §1 a §8.

## 2. O que mudou no Encontro 1

Na reunião de 28/10/2026, o cliente contou que **terceirizou as entregas** para duas empresas, uma
por região (Encontro 1 [15:19], [30:33]). A terceirizada coleta na loja, entrega, e cuida do
motorista. A SEALog fica com o pedido, a distribuição, o atendimento à loja, o que dá errado e a
cobrança. Por isso o aplicativo do motorista, as rotas e a etiqueta saíram da solução, e entraram o
despacho por região, o padrão único de retorno e o agente de ocorrências (`DIV-SL-01`).

## 3. Os sistemas

| Sigla | Sistema | Papel | Documentação |
|---|---|---|---|
| `SL` | SEALog | Registro único da entrega, do pedido pelo WhatsApp à cobrança, com despacho para as terceirizadas e chamados com IA | [`docs/01-sealog/`](../01-sealog/00-visao-geral.md) |

O SEALog tem quatro frentes de uso, todas sobre o mesmo registro:

| Frente | Quem usa | Onde |
|---|---|---|
| Conversa no WhatsApp | Lojas | O número que já usam: menu, formulário, acompanhamento, relato |
| Painel da equipe | Atendente, coordenador, financeiro | Navegador, no computador ou no celular |
| Portal e API da terceirizada | Terceirizadas | Portal simples no navegador, ou integração; planilha também aceita |
| Agente de ocorrências | Lojas, pelo WhatsApp; equipe, pelo painel | Conversa com a loja e sugere a ação à equipe |

## 4. Os números do sistema

| Medida | Quantidade |
|---|---|
| Módulos | 7 |
| Histórias de usuário | 24 |
| Regras de negócio | 54 |
| Fluxogramas | 6 |
| Telas | 17 |
| Entidades | 14 |
| Integrações | 4 |

## 5. O que a documentação é, e o que não é

A documentação de requisitos do FDE, de onde este repositório herdou o formato, é engenharia
reversa de sistemas em produção. Aqui não há sistema a reverter: **a origem é o enunciado, a
reunião com o cliente e o planejamento da equipe, e os requisitos são a proposta de solução**. Por
isso cada regra diz se é fato da origem ou proposta (`docs/01-sealog/02-regras-de-negocio.md`), e o
campo **Origem legada** de cada história descreve como a operação faz aquilo hoje.

As restrições valem para tudo: a loja continua no WhatsApp; o atendimento vai de segunda a sexta,
das 8h às 18h, e no sábado até 12h, e a operação, de segunda a sábado, das 7h às 19h; as
terceirizadas têm pouca familiaridade com tecnologia; a empresa é pequena e o custo precisa ser
controlado; a meta é chegar a cerca de 400 entregas por dia no mês que vem (Enunciado §2; Encontro
1 [23:17], [23:40], [29:03]).

## 6. Por onde ler

1. [`docs/01-sealog/00-visao-geral.md`](../01-sealog/00-visao-geral.md) — escopo, módulos e os
   quatro casos do enunciado.
2. [`decisoes.md`](decisoes.md) e [`requisitos.md`](requisitos.md) — o que foi decidido e a lista de
   requisitos, com a ligação à lista da equipe.
3. [`divergencias-e-riscos.md`](divergencias-e-riscos.md) — o que está em aberto no projeto.
4. [`atores-e-perfis.md`](atores-e-perfis.md), [`integracoes-externas.md`](integracoes-externas.md)
   e [`glossario.md`](glossario.md).
5. Os demais arquivos de `docs/01-sealog/`, na ordem.
