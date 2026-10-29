# SEALog — Backlog e priorização

O backlog do SEALog, em ordem de entrega. Cada item tem um id `BL-SL-NN` e aponta a história de
usuário que entrega; os itens sem história são habilitadores — trabalho que nenhuma história
descreve, mas sem o qual uma delas não funciona — ou itens deixados de fora de propósito.

## 1. Como se prioriza

A priorização combina quatro critérios, nesta ordem (`DEC-SL-11`):

| Critério | Pergunta | Valores |
|---|---|---|
| **MoSCoW** | O produto funciona sem isto? | **Must** — sem ele a release não resolve o caso a que se propõe · **Should** — importante, mas há contorno · **Could** — desejável se sobrar tempo · **Won't** — fora desta versão, de propósito |
| **Valor** | Quanto do gargalo isto resolve? | **Alto** — resolve um dos quatro casos do enunciado ou a causa comum · **Médio** — reduz trabalho manual · **Baixo** — conforto |
| **Esforço** | Quanto custa construir? | **P** — dias · **M** — uma a duas semanas · **G** — mais de duas semanas, ou depende de terceiro |
| **Dependência** | O que precisa existir antes? | Os itens da coluna `Depende de` |

A **prioridade da HU** (Alta, Média), escrita em cada história, mede o valor para quem usa. A
**ordem do backlog** soma a ela o esforço e a dependência, e por isso as duas podem divergir: o
recebimento no galpão (`HU-SL-007`) tem prioridade Média, mas sem ele nenhuma entrega entra em
rota (`RN-SL-017`), e ele vai para a R1. O fechamento da cobrança (`HU-SL-022`) também é Média na história, mas é Must na R3: é o item que dá razão de ser à release, e até lá o financeiro fecha pela exportação.

## 2. Releases

Cada release resolve casos inteiros do enunciado, para que a equipe sinta a diferença no dia a
dia, e cada uma corresponde a uma fase da adoção gradual.

| Release | Objetivo | Casos que resolve | Fase da adoção |
|---|---|---|---|
| **R1 — Operação de ponta a ponta** | Do pedido validado ao comprovante, num registro único, com o rastreio enviado à mão na conversa | "Pedido incompleto", "Registro incorreto" | Piloto e virada da equipe |
| **R2 — Exceções e comunicação** | Nenhuma exceção perdida, e o cliente avisado sem depender do atendimento | "Buquê de sábado", "Segunda-feira de chuva" | Abertura para o cliente |
| **R3 — Financeiro e entrada em escala** | A cobrança sai do registro, e o cliente grande manda planilha no modelo | — (Gargalos §6) | Financeiro |
| **Fora desta versão** | O que foi deixado de fora de propósito, e por quê | — | — |

## 3. Backlog

### R1 — Operação de ponta a ponta

| ID | Item | HUs | MoSCoW | Release | Valor | Esforço | Depende de | Por quê |
|---|---|---|---|---|---|---|---|---|
| `BL-SL-01` | Acesso por perfil e cadastro da equipe | `HU-SL-024` | Must | R1 | Alto | M | — | Todo registro precisa de autor, e cada perfil vê só a sua parte |
| `BL-SL-02` | Registro do pedido com validação | `HU-SL-001` | Must | R1 | Alto | M | `BL-SL-01` | Resolve o caso "Pedido incompleto" na entrada |
| `BL-SL-03` | Lista única de entregas com histórico | `HU-SL-005` | Must | R1 | Alto | M | `BL-SL-02` | É a fonte da verdade (`DEC-SL-01`); resolve o caso "Registro incorreto" |
| `BL-SL-04` | Fila de pendências de dados | `HU-SL-004` | Must | R1 | Alto | P | `BL-SL-02` | Nenhum pedido incompleto esquecido |
| `BL-SL-05` | Formulário do cliente pelo link: pedido e complemento | `HU-SL-002` | Must | R1 | Alto | M | `BL-SL-02` | É o mesmo formulário que completa a pendência; tira o atendente do meio |
| `BL-SL-06` | Etiqueta por volume | `HU-SL-006` | Must | R1 | Alto | P | `BL-SL-03` | Sem etiqueta não há leitura pela câmera, e a entrega não entra em rota (`RN-SL-015`) |
| `BL-SL-07` | Coleta e recebimento no galpão | `HU-SL-007` | Must | R1 | Médio | M | `BL-SL-06` | Só entrega com todos os volumes no galpão entra em rota (`RN-SL-017`) |
| `BL-SL-08` | Montagem das rotas do dia | `HU-SL-008` | Must | R1 | Alto | M | `BL-SL-07` | Substitui a rota de cabeça por uma rota registrada (`DEC-SL-04`) |
| `BL-SL-09` | Publicação do roteiro | `HU-SL-009` | Must | R1 | Alto | P | `BL-SL-08` | Acaba com o roteiro mandado por WhatsApp, motorista por motorista |
| `BL-SL-10` | Roteiro do dia no celular | `HU-SL-011` | Must | R1 | Alto | M | `BL-SL-09` | Primeiro contato do motorista com o sistema |
| `BL-SL-11` | Registro da parada pela leitura da etiqueta | `HU-SL-012` | Must | R1 | Alto | M | `BL-SL-10` | Status na hora do fato, e pacote errado recusado |
| `BL-SL-12` | Comprovante com foto e nome | `HU-SL-013` | Must | R1 | Alto | P | `BL-SL-11` | Resolve a foto solta do caso "Registro incorreto" (`DEC-SL-05`) |
| `BL-SL-13` | Registro sem sinal | `HU-SL-015` | Must | R1 | Alto | G | `BL-SL-11` | Sem ele o motorista volta ao grupo quando o sinal cai; é o item mais arriscado (`DEC-SL-13`) |
| `BL-SL-14` | Ocorrência de entrega não realizada | `HU-SL-014` | Must | R1 | Alto | P | `BL-SL-11` | O motorista precisa registrar o "não entregue" desde o primeiro dia |
| `BL-SL-15` | Busca da entrega pela equipe | `HU-SL-017` | Must | R1 | Alto | P | `BL-SL-03` | Responde "cadê minha entrega?" sem perguntar ao motorista |
| `BL-SL-16` | Link de rastreio | `HU-SL-016` | Must | R1 | Alto | M | `BL-SL-11` | Na R1 o atendente cola o link na conversa; na R2 ele sai sozinho |
| `BL-SL-17` | Habilitador: conta do WhatsApp Business e modelos de mensagem aprovados | — | Must | R1 | Alto | G | — | Prazo de aprovação é da Meta; começar cedo destrava a R2 (`DEC-SL-14`) |
| `BL-SL-18` | Exportação para planilha | `HU-SL-023` | Should | R1 | Médio | P | `BL-SL-03` | Reduz a resistência à adoção (`DEC-SL-08`); o financeiro fecha por ela até a R3 |

### R2 — Exceções e comunicação

| ID | Item | HUs | MoSCoW | Release | Valor | Esforço | Depende de | Por quê |
|---|---|---|---|---|---|---|---|---|
| `BL-SL-19` | Painel de exceções | `HU-SL-018` | Must | R2 | Alto | M | `BL-SL-14` | Nenhuma exceção tratada fora do painel; resolve o caso "Buquê de sábado" |
| `BL-SL-20` | Decisão sobre a entrega não realizada | `HU-SL-019` | Must | R2 | Alto | M | `BL-SL-19` | Os quatro destinos registrados (`DEC-SL-06`) |
| `BL-SL-21` | Aviso automático ao cliente | `HU-SL-020` | Must | R2 | Alto | M | `BL-SL-17`, `BL-SL-19` | O cliente sabe do problema sem o atendimento (`DEC-SL-07`) |
| `BL-SL-22` | Consulta de afetados por cliente e aviso em lote | `HU-SL-021` | Must | R2 | Alto | M | `BL-SL-21` | Resolve o caso "Segunda-feira de chuva": um aviso por cliente em vez de 120 mensagens |
| `BL-SL-23` | Andamento das rotas | `HU-SL-010` | Should | R2 | Médio | P | `BL-SL-11` | Rota parada percebida cedo; até lá, a busca mostra a hora do último registro |
| `BL-SL-24` | Importação da planilha do cliente | `HU-SL-003` | Should | R2 | Médio | M | `BL-SL-04` | Clientes com planilha própria; até lá o atendente digita no formulário |
| `BL-SL-25` | Habilitador: painel de adoção | — | Should | R2 | Médio | P | `BL-SL-03` | Mede os critérios de avanço de cada fase da adoção (`DEC-SL-16`) |

### R3 — Financeiro e entrada em escala

| ID | Item | HUs | MoSCoW | Release | Valor | Esforço | Depende de | Por quê |
|---|---|---|---|---|---|---|---|---|
| `BL-SL-26` | Fechamento da cobrança por cliente | `HU-SL-022` | Must | R3 | Alto | G | `BL-SL-20` | A cobrança sai do registro (`DEC-SL-09`); depende das regras de cobrança da SEALog (`DEC-SL-18`) |

### Fora desta versão

| ID | Item | HUs | MoSCoW | Release | Valor | Esforço | Depende de | Por quê |
|---|---|---|---|---|---|---|---|---|
| `BL-SL-27` | Otimização automática de rotas | — | Won't | — | Baixo | G | — | A origem não aponta rota ruim, e a decisão fica com o coordenador (`DEC-SL-04`, `DIV-SL-01`) |
| `BL-SL-28` | Rastreamento do veículo por GPS em tempo real | — | Won't | — | Baixo | G | — | Não citado na origem; o status vem do registro de cada parada |
| `BL-SL-29` | Emissão de nota fiscal e cobrança bancária | — | Won't | — | Médio | G | — | A origem só cita o cálculo da cobrança |
| `BL-SL-30` | Atendimento automatizado por robô de conversa | — | Won't | — | Baixo | G | — | Não citado na origem; o link resolve a coleta de dados (`DEC-SL-03`) |

## 4. Cobertura

As 24 histórias estão no backlog, cada uma em um item. A página do backlog no aplicativo confere
isso a cada carga e mostra a história que ficar de fora, e mostra também onde a ordem diverge da
prioridade da história.
