# SEALog — Visão geral

O SEALog é o sistema proposto para a operação de entregas da SEALog, o caso do Desafio Prático em
Grupo do SEAL 2026.2. Hoje a operação inteira corre em grupos de WhatsApp e em planilhas: o pedido
chega por mensagem, o analista o copia para a planilha, o coordenador monta as rotas de cabeça, o
motorista recebe o roteiro e devolve as notícias pelo grupo, e a cobrança sai da planilha.

Esta documentação descreve o que o sistema precisa fazer para tirar a operação desse caminho. Ela
**não é engenharia reversa de um sistema existente**: a origem é o resumo dos gargalos da
operação, e cada história de usuário responde a um ou mais desses gargalos.

---

## 1. Propósito do sistema

Ser a **fonte única da verdade sobre o estado de cada entrega**. O resumo dos gargalos aponta essa
ausência como a causa comum de quase todos os problemas: a informação nasce no WhatsApp, passa por
pessoas e acaba copiada em planilhas (Gargalos §8). Com um registro único, alimentado na origem —
pelo cliente ao pedir, pelo motorista na parada —, quem precisa saber onde está uma entrega
consulta, em vez de perguntar.

## 2. Públicos atendidos

| Público | Uso típico |
|---|---|
| Clientes (remetentes) | Fazer o pedido, completar dados, acompanhar a entrega, receber aviso de problema |
| Atendentes | Registrar pedidos recebidos pelos canais, resolver pendências, responder "cadê minha entrega?" |
| Analistas | Manter a lista de entregas, gerar etiquetas, acompanhar o andamento do dia |
| Coordenador de operação | Montar e publicar as rotas, decidir as exceções |
| Motoristas (cerca de 18) | Ver o roteiro, registrar cada parada, o comprovante e as ocorrências |
| Financeiro | Fechar a cobrança de cada cliente a partir das entregas registradas |

Perfis, permissões e autenticação estão em [`01-atores-e-permissoes.md`](01-atores-e-permissoes.md).

## 3. Escopo desta documentação

**Dentro:** as seis etapas da operação que o resumo dos gargalos percorre — entrada de pedidos,
registro e planejamento, execução e comunicação do motorista, consulta de status, exceções e
decisões, e financeiro — e o acesso por perfil que elas pressupõem.

**Fora:**

| Item | Motivo |
|---|---|
| Emissão de nota fiscal e cobrança bancária (boleto, Pix) | A origem só cita o cálculo da cobrança (Gargalos §6); o pagamento não é mencionado |
| Otimização automática de rotas | A origem aponta a falta de ferramenta para montar rotas, não a falta de otimização; a decisão de rota continua com o coordenador (`DIV-SL-01`) |
| Rastreamento do veículo por GPS em tempo real | Não citado na origem; o status vem do registro de cada parada |
| Atendimento automatizado (robô de conversa) | Não citado na origem |
| Gestão de frota, de jornada e de pagamento dos motoristas | Não citado na origem |
| Interface visual final | O desafio não exige sistema funcional (Gargalos §9); as telas descrevem campos e ações, não o desenho |

## 4. Stack legada

Não há sistema legado. A "stack" de hoje é a operação manual:

| Etapa | Ferramenta de hoje | Origem |
|---|---|---|
| Entrada de pedidos | WhatsApp e Instagram (texto, áudio) e planilhas próprias dos clientes | Gargalos §1, §9 |
| Registro | Grupo de WhatsApp copiado à mão para planilha, com cópias por analista | Gargalos §2 |
| Identificação do pacote | Etiqueta escrita à mão | Gargalos §2 |
| Rotas | Experiência do coordenador, sem ferramenta | Gargalos §2 |
| Roteiro e comunicação com motorista | WhatsApp, motorista por motorista, e um grupo com cerca de 18 motoristas | Gargalos §2, §3 |
| Comprovante de entrega | Foto enviada solta no grupo | Gargalos §3 |
| Cobrança | Planilhas manuais | Gargalos §6 |

A stack do sistema novo não foi definida (`Q-SL-01`).

## 5. Inventário de módulos

| # | Módulo | Slug | Escopo | HUs | Telas |
|---|---|---|---|---|---|
| 1 | Entrada de pedidos | `entrada-pedidos` | Pedido com validação na origem, pelo atendente, pelo próprio cliente ou por planilha; pendência de dados | `HU-SL-001` a `HU-SL-004` | `TL-SL-002` a `TL-SL-005` |
| 2 | Registro e planejamento | `registro-planejamento` | Lista única de entregas, etiqueta, coleta e recebimento no galpão, rotas e roteiro | `HU-SL-005` a `HU-SL-010` | `TL-SL-006` a `TL-SL-010` |
| 3 | Execução do motorista | `execucao-motorista` | Roteiro no celular, registro de cada parada, comprovante, ocorrência e uso sem sinal | `HU-SL-011` a `HU-SL-015` | `TL-SL-011`, `TL-SL-012` |
| 4 | Consulta de status | `consulta-status` | Rastreio pelo próprio cliente e consulta pela equipe | `HU-SL-016`, `HU-SL-017` | `TL-SL-007`, `TL-SL-013` |
| 5 | Exceções e decisões | `excecoes` | Painel de exceções, decisão formal sobre o que não foi entregue, aviso proativo e consulta de afetados por cliente | `HU-SL-018` a `HU-SL-021` | `TL-SL-014`, `TL-SL-015` |
| 6 | Financeiro | `financeiro` | Fechamento da cobrança por cliente e exportação para planilha | `HU-SL-022`, `HU-SL-023` | `TL-SL-016`, `TL-SL-017` |
| 7 | Acesso | `acesso` | Entrada no sistema por perfil | `HU-SL-024` | `TL-SL-001` |

## 6. Os quatro casos do enunciado

O resumo traz quatro casos do enunciado, cada um com a causa raiz. A tabela diz que parte do
sistema responde a cada um — é o teste de aceite do conjunto.

| Caso | Causa raiz (Gargalos §7) | Como o SEALog responde | HUs |
|---|---|---|---|
| Buquê de sábado | Aviso de exceção perdido no grupo e cliente não avisado | A ocorrência é registrada na entrega, não no grupo; entra no painel de exceções e dispara o aviso ao cliente sem depender do horário do atendimento | `HU-SL-014`, `HU-SL-018`, `HU-SL-020` |
| Registro incorreto | Linha errada na planilha e foto sem vínculo com a entrega | Um registro por entrega, sem cópias; a foto do comprovante só existe presa à entrega, lida pela etiqueta | `HU-SL-005`, `HU-SL-006`, `HU-SL-013` |
| Segunda-feira de chuva | Sem consulta estruturada de atrasos por cliente (40 entregas, mais de 120 mensagens) | Consulta de entregas afetadas agrupada por cliente, com aviso em lote | `HU-SL-021`, `HU-SL-020` |
| Pedido incompleto | Sem validação na entrada | O pedido não é aceito sem os dados obrigatórios; o que fica faltando vira pendência com o cliente | `HU-SL-001`, `HU-SL-002`, `HU-SL-004` |

## 7. Restrições

As restrições que o enunciado impõe à solução (Gargalos §9) valem para todo o documento:

| Restrição | Efeito nos requisitos |
|---|---|
| Clientes pequenos pedem por WhatsApp e Instagram | O pedido não pode exigir que o cliente instale nada nem crie conta: o formulário abre por link enviado na conversa (`RN-SL-004`) |
| Equipe acostumada com planilha; o risco principal é adoção | Toda lista pode ser exportada para planilha (`HU-SL-023`), e a lista de entregas se comporta como uma planilha filtrável (`HU-SL-005`) |
| Atendimento com horário limitado (sábado só até 12h); Operação das 7h às 19h | Avisos ao cliente e rastreio funcionam sem atendente (`RN-SL-032`) |
| Prazo curto; não é obrigatório entregar sistema funcional | A documentação descreve o comportamento, sem fixar stack nem desenho de tela |

## 8. Volumetria

| Medida | Valor | Origem |
|---|---|---|
| Motoristas | Cerca de 18 | Gargalos §3 |
| Pedidos que chegam incompletos | Cerca de 1 em 5 | Gargalos §1 |
| Tempo de resposta a "cadê minha entrega?" hoje | De 20 minutos a mais de 2 horas | Gargalos §4 |
| Entregas afetadas no caso "segunda-feira de chuva" | 40, com mais de 120 mensagens | Gargalos §7 |
| Entregas por dia, clientes ativos, pacotes por pedido | Não informado na documentação de origem (`Q-SL-02`) | — |

## 9. Documentos de origem

| Documento | O que é | Como se cita |
|---|---|---|
| `SEALog gargalos e problemas da operação.pdf`, 2 páginas, recebido em 27/10/2026 | Resumo dos gargalos identificados no enunciado do Desafio Prático em Grupo (SEAL 2026.2), agrupados por etapa da operação | "Gargalos §N" |

O resumo não numera as seções. A numeração usada nas referências é esta:

| § | Seção do resumo |
|---|---|
| §1 | Entrada de pedidos |
| §2 | Registro e planejamento |
| §3 | Execução e comunicação do motorista |
| §4 | Consulta de status ("cadê minha entrega?") |
| §5 | Exceções e decisões |
| §6 | Financeiro |
| §7 | Os quatro casos do enunciado |
| §8 | Causa comum |
| §9 | Restrições que o enunciado impõe à solução |

O enunciado completo do desafio não está entre as fontes (`Q-GERAL-01`). O inventário com
`sha256` está em [`fontes/README.md`](../../fontes/README.md).
