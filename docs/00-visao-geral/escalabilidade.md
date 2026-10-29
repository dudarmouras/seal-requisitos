# SEALog — Escalabilidade adaptativa

Como o SEALog cresce com a operação. A regra é a de `DEC-SL-17`: começar no menor patamar que
atende, medir, e subir quando um indicador cruza o limite combinado — e não antes. A meta conhecida
é chegar a cerca de **400 entregas por dia** no mês que vem (Encontro 1 [23:40]), com duas
terceirizadas, numa operação de segunda a sábado, das 7h às 19h.

Escalar aqui tem três sentidos:

- **Capacidade** — o sistema aguenta mais entregas, lojas, terceirizadas e chamados sem ficar lento.
- **Custo** — a fatura cresce na mesma proporção da operação, não aos saltos.
- **Funcionalidade** — o produto ganha partes novas sem ser refeito.

---

## 1. Patamares

| | Patamar 1 | Patamar 2 | Patamar 3 |
|---|---|---|---|
| **Operação** | Até cerca de 400 entregas por dia e duas terceirizadas — a meta do mês que vem | Até alguns milhares de entregas por dia, com mais terceirizadas e regiões | Mais de uma cidade ou de um galpão |
| **Back end** | Um serviço, com os sete módulos por dentro | O mesmo, com as tarefas em segundo plano num processo próprio | Integração das terceirizadas e envio de avisos separados em serviços próprios |
| **Banco** | Uma instância, a menor que atende | Instância maior e cópia só de leitura para buscas, afetados e exportações | Dados separados por galpão; histórico antigo arquivado |
| **Fotos** | Armazenamento padrão | Fotos antigas movidas para armazenamento mais barato | Regra de guarda aplicada sozinha, pelo prazo combinado (`Q-SL-16`) |
| **Agente** | Plano de entrada do n8n | Plano maior, pelo número de execuções | Mesmo agente; o protocolo ganha regras por região |
| **Custo de referência** | R$ 360 a R$ 820 por mês em serviços, mais R$ 315 a R$ 450 de servidor, banco e painel | Cresce sobretudo no WhatsApp | Idem |

O preço de cada item está em [`infraestrutura-e-custos.md`](infraestrutura-e-custos.md). A
passagem de um patamar ao outro não exige reescrever o sistema: os módulos são separados por dentro
desde o começo (`DEC-SL-12`), e é por essas costuras que ele se divide.

## 2. Gatilhos

Cada gatilho é medido desde a R1, e cada um tem a sua resposta. A resposta é a menor que resolve.

| Indicador | Limite | Resposta | Patamar |
|---|---|---|---|
| Uso de processamento do banco | Acima de 70% por 3 dias seguidos no horário da operação | Subir a instância do banco um nível | 1 → 2 |
| Tempo de resposta da busca | Acima de 2 segundos para 5% das buscas (`RNF-SL-08`) | Rever índices; depois, cópia só de leitura | 1 → 2 |
| Atraso na fila de avisos | Aviso saindo mais de 5 minutos depois do fato | Processo próprio para as tarefas em segundo plano | 1 → 2 |
| Chamado chegando ao painel | Mais de 5 segundos (`RNF-SL-09`) | Rever a atualização em tempo real | 1 → 2 |
| Retornos recebidos por minuto | Integração recusando por limite de chamadas em horário normal | Subir o limite por terceirizada; depois, separar a integração | 2 → 3 |
| Espaço das fotos | Acima do plano contratado | Mover fotos antigas; aplicar o prazo de guarda | 2 |
| Nova terceirizada ou região | A SEALog contratar outra empresa | Cadastro com as regiões dela, sem mudança no sistema (`RNF-SL-15`) | Qualquer |
| Custo por entrega | Subindo mês a mês | Rever os avisos por mensagem antes de mexer na infraestrutura | Qualquer |

## 3. Escalar para baixo

| Parte | Comportamento |
|---|---|
| WhatsApp | Custo por mensagem enviada; sem entrega, sem aviso |
| Modelo de linguagem | Custo por atendimento; sem ocorrência, sem custo |
| Banco | Instância fixa no patamar; desce um nível se passar um mês abaixo de 30% de uso |
| Cópia só de leitura | Só existe do patamar 2 em diante, e sai se o gatilho que a trouxe deixar de valer |

## 4. Escalar em funcionalidade

| Quando | O que entra | Por onde entra |
|---|---|---|
| A SEALog quer ativar algo no seu ritmo | Menu por loja, aviso automático, agente, aviso em lote | Chave de configuração (`adocao-gradual` §6) |
| Muitas perguntas de status no WhatsApp | Agente de consulta de status | Novo agente sobre o mesmo canal; revisita `DEC-SL-10` e `BL-SL-31` |
| Lojas maiores querem integrar | Entrada de pedidos por integração, além do WhatsApp | Nova porta sobre o mesmo módulo de pedidos, com as mesmas validações |
| Cobrança bancária entra no escopo | Boleto ou Pix a partir do fechamento | Integração nova no módulo financeiro; hoje fora (`BL-SL-32`) |

## 5. O que não escala sozinho

| Limite | Por quê | O que fazer |
|---|---|---|
| O coordenador decidindo toda devolução | É uma pessoa; com volume alto vira gargalo humano | Regras padrão por motivo, quando a política da SEALog existir (`DEC-SL-18`) |
| A equipe aprovando todo chamado | Com volume alto, os chamados crescem mais rápido que a capacidade de decidir | Aprovação automática das sugestões de baixo risco, se o protocolo permitir (`Q-SL-05`) |
| A qualidade do retorno da terceirizada | Depende de outra empresa | Padrão único, recusa do retorno incompleto e pagamento só pela entrega comprovada |
| O prazo de aprovação de mensagens da Meta | Depende de terceiro | Aprovar os modelos antes de precisar deles (`BL-SL-05`) |
