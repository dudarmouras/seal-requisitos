# SEALog — Escalabilidade adaptativa

Como o SEALog cresce com a operação. A regra é a de `DEC-SL-17`: começar no menor patamar que
atende, medir, e subir quando um indicador cruza o limite combinado — e não antes. O volume de
hoje não é conhecido (`Q-SL-02`); o que se sabe é que são cerca de 18 motoristas, numa operação
das 7h às 19h.

Escalar aqui tem três sentidos, e a página trata dos três:

- **Capacidade** — o sistema aguenta mais entregas, motoristas e consultas sem ficar lento.
- **Custo** — a fatura cresce na mesma proporção da operação, não aos saltos.
- **Funcionalidade** — o produto ganha partes novas sem ser refeito.

---

## 1. Patamares

| | Patamar 1 | Patamar 2 | Patamar 3 |
|---|---|---|---|
| **Operação** | Até cerca de 300 entregas por dia e 25 motoristas — a SEALog de hoje | Até cerca de 2.000 entregas por dia e 100 motoristas | Mais de 2.000 entregas por dia, ou mais de um galpão ou cidade |
| **Aplicação** | Uma aplicação, com os sete módulos por dentro | A mesma, com as tarefas em segundo plano num processo próprio | O envio de avisos e o rastreio público separados em serviços próprios |
| **Banco** | Uma instância, a menor | Instância maior e cópia só de leitura para buscas, rastreio e exportações | Dados separados por galpão; histórico antigo arquivado |
| **Fotos** | Armazenamento padrão | Fotos de mais de 6 meses movidas para armazenamento mais barato | Regra de guarda aplicada automaticamente, conforme o prazo combinado na LGPD (`RNF-SL-10`) |
| **Rastreio público** | Servido pela aplicação | Guardado em cache por alguns segundos na rede de entrega de conteúdo | Serviço próprio, que não disputa recurso com a equipe |
| **Custo de referência** | Cerca de R$ 640 por mês, com 300 entregas por dia | Cerca de R$ 3.600 por mês, com 2.000 entregas por dia | Acima de R$ 3.600 por mês; a maior parte é o WhatsApp |

O preço de cada item está em [`infraestrutura-e-custos.md`](infraestrutura-e-custos.md).
A passagem de um patamar ao outro não exige reescrever o sistema: a arquitetura separa os módulos
por dentro desde o começo (`DEC-SL-12`), e é por essas costuras que ela se divide.

## 2. Gatilhos

Cada gatilho é medido continuamente desde a R1, e cada um tem a sua resposta. A resposta é a
menor que resolve.

| Indicador | Limite | Resposta | Patamar |
|---|---|---|---|
| Uso de processamento do banco | Acima de 70% por 3 dias seguidos no horário da operação | Subir a instância do banco um nível | 1 → 2 |
| Tempo de resposta da busca de entrega | Acima de 2 segundos para 5% das buscas (`RNF-SL-05`) | Rever índices; depois, levar buscas e exportações para a cópia só de leitura | 1 → 2 |
| Atraso na fila de avisos | Aviso saindo mais de 5 minutos depois da ocorrência | Processo próprio para as tarefas em segundo plano | 1 → 2 |
| Tempo de sincronização do motorista | Registro levando mais de 1 minuto para aparecer, com sinal (`RNF-SL-06`) | Rever o tamanho do envio; fotos em paralelo ao registro | 1 → 2 |
| Espaço das fotos | Acima de 80 GB | Mover fotos antigas para armazenamento mais barato; aplicar o prazo de guarda | 2 |
| Acessos ao rastreio | Rastreio respondendo em mais de 1 segundo nos horários de pico | Cache do rastreio; depois, serviço próprio | 2 → 3 |
| Segundo galpão ou cidade | A SEALog abrir outra base | Separar os dados por galpão; rotas, etiquetas e painel por base | 3 |
| Custo por entrega | Acima de R$ 0,25 (`RNF-SL-15`) | Rever as alavancas do WhatsApp antes de mexer na infraestrutura | Qualquer |

## 3. Escalar para baixo

A operação tem horário (7h às 19h) e dias de pico. O que se ajusta sozinho:

| Parte | Comportamento |
|---|---|
| Hospedagem da aplicação | Cobrada pelo uso; fora do horário da operação quase não consome |
| Avisos | Custo por mensagem enviada; sem entrega, sem custo |
| Banco | Instância fixa no patamar; desce um nível se passar um mês abaixo de 30% de uso |
| Cópia só de leitura | Só existe no patamar 2 em diante, e sai se o gatilho que a trouxe deixar de valer |

## 4. Escalar em funcionalidade

O produto cresce por partes que se ligam sem refazer o que existe.

| Quando | O que entra | Por onde entra |
|---|---|---|
| A SEALog quer ativar algo no seu ritmo | Envio automático de rastreio, aviso de ocorrência, importação, link de pedido | Chave de configuração, ligada por cliente ou para todos (`adocao-gradual` §6) |
| Rotas ficam grandes demais para montar à mão | Sugestão de ordem de paradas, com o coordenador decidindo | Novo apoio no módulo de planejamento; revisita `DEC-SL-04` e `BL-SL-27` |
| Clientes maiores querem integrar | Entrada de pedidos pela API em vez de planilha | Nova porta de entrada sobre o mesmo módulo de pedidos, com as mesmas validações |
| Cobrança bancária entra no escopo | Emissão de boleto ou Pix a partir do fechamento | Integração nova no módulo financeiro; hoje fora (`BL-SL-29`) |

## 5. O que não escala sozinho

| Limite | Por quê | O que fazer |
|---|---|---|
| O coordenador montando todas as rotas | É uma pessoa; com muitas rotas vira gargalo humano, não técnico | Patamar 3: sugestão de ordem de paradas, ou um coordenador por galpão |
| O painel de exceções | Com volume alto, o painel cresce mais rápido que a capacidade de decidir | Regras de decisão padrão por motivo, quando a política da SEALog existir (`DEC-SL-18`) |
| O prazo de aprovação de mensagens da Meta | Depende de terceiro | Aprovar os modelos antes de precisar deles (`BL-SL-17`) |
