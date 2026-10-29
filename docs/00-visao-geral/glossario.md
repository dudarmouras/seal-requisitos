# Glossário

Termos da operação da SEALog e desta documentação, com o sentido em que são usados aqui.

---

## 1. Termos da operação

| Termo | Significado |
|---|---|
| Pedido | O que o cliente pede: levar um ou mais pacotes a um destinatário. No sistema, um pedido é uma entrega (`RN-SL-012`) |
| Entrega | O registro único de um pedido, do registro ao status final. É a "fonte única da verdade" que falta hoje |
| Código de entrega | Identificador gerado no registro; vai na etiqueta e no rastreio |
| Volume | Cada pacote de uma entrega, com etiqueta própria ("2/3") |
| Etiqueta | Impressa pelo sistema, com o código em texto e em código lido pela câmera; substitui a etiqueta à mão |
| Pendente de dados | Pedido registrado sem algum dado obrigatório; não entra em rota |
| Galpão | Onde os pacotes chegam, por coleta ou trazidos pelo cliente até 17h, e de onde saem as rotas |
| Coleta | Busca do pacote na casa do cliente, entre 14h e 18h |
| Rota | O conjunto de paradas de um motorista num dia |
| Roteiro | A rota como o motorista a vê no celular |
| Parada | Uma entrega dentro de uma rota |
| Comprovante | Foto tirada pelo aplicativo na entrega, presa a ela, com o nome de quem recebeu |
| Ocorrência | Registro de entrega não realizada, com o motivo |
| Exceção | Ocorrência ainda sem decisão; aparece no painel de exceções |
| Decisão | O que se faz com a entrega não realizada: nova tentativa, devolver, guardar ou cancelar |
| Retorno ao galpão | Volta do pacote não entregue; hoje sem regra formal |
| Aviso proativo | Mensagem ao cliente enviada pelo sistema, sem que ele pergunte |
| Aviso em lote | Uma mensagem por cliente com todas as entregas dele afetadas |
| Rastreio | Página aberta pelo link que o cliente recebe, com o status da entrega |
| Afetados | Entregas atrasadas ou com ocorrência num período, agrupadas por cliente |
| Atrasada | Entrega não concluída até o fim da data prevista |
| Fechamento | Cobrança de um cliente num período, calculada das entregas registradas |
| Ajuste | Correção lançada num fechamento por erro descoberto depois de um fechamento já fechado |
| Cadeia de 5 saltos | Hoje, o caminho da pergunta "cadê minha entrega?": cliente, atendente, analista, motorista e volta |

## 2. Os quatro casos do enunciado

| Caso | Em uma linha |
|---|---|
| Buquê de sábado | Aviso de exceção perdido no grupo; o cliente não foi avisado |
| Registro incorreto | Linha errada na planilha e foto sem vínculo com a entrega |
| Segunda-feira de chuva | 40 entregas afetadas, mais de 120 mensagens, sem consulta por cliente |
| Pedido incompleto | Pedido sem dados, sem validação na entrada |

## 3. Termos desta documentação

| Termo | Significado |
|---|---|
| Gargalos §N | Seção N do resumo `SEALog gargalos e problemas da operação.pdf`; a numeração está em `docs/01-sealog/00-visao-geral.md` §9 |
| Origem legada | Campo de rastreio da HU. No SEALog descreve como a operação faz aquilo hoje, já que não há sistema legado |
| Proposta | Regra que esta documentação propõe para resolver um gargalo, em oposição a fato da origem |
| `SL` | Sigla do sistema SEALog nos identificadores (`HU-SL-001`, `RN-SL-001`) |

## 4. Siglas

| Sigla | Significado |
|---|---|
| SEAL | O programa do Desafio Prático em Grupo (edição 2026.2) |
| SEALog | A empresa de entregas do caso, e o sistema proposto para ela |
| HU | História de usuário |
| RN | Regra de negócio |
| CA | Critério de aceitação |
| FLX | Fluxograma |
| TL | Tela |
| ENT | Entidade de dados |
| INT | Integração externa |
| MSG | Mensagem do sistema |
| DIV | Divergência ou risco |
| Q | Pergunta ao cliente |
