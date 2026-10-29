# SEALog — Backlog e priorização

O backlog do SEALog, em ordem de entrega. Cada item tem um id `BL-SL-NN` e aponta a história de
usuário que entrega; os itens sem história são habilitadores — trabalho que nenhuma história
descreve, mas sem o qual uma delas não funciona — ou itens deixados de fora de propósito.

> **Rascunho.** Esta é a primeira versão do backlog depois da terceirização, montada a partir das
> histórias e das decisões. A equipe ainda vai revisá-la na sessão de priorização: classe MoSCoW,
> esforço e corte das releases podem mudar.

## 1. Como se prioriza

A priorização combina quatro critérios, nesta ordem (`DEC-SL-20`):

| Critério | Pergunta | Valores |
|---|---|---|
| **MoSCoW** | O produto funciona sem isto? | **Must** — sem ele a release não resolve o caso a que se propõe · **Should** — importante, mas há contorno · **Could** — desejável se sobrar tempo · **Won't** — fora desta versão, de propósito |
| **Valor** | Quanto do gargalo isto resolve? | **Alto** — resolve um dos casos do enunciado ou a causa comum · **Médio** — reduz trabalho manual · **Baixo** — conforto |
| **Esforço** | Quanto custa construir? | **P** — dias · **M** — uma a duas semanas · **G** — mais de duas semanas, ou depende de terceiro |
| **Dependência** | O que precisa existir antes? | Os itens da coluna `Depende de` |

A **prioridade da HU** (Alta, Média), escrita em cada história, mede o valor para quem usa. A
**ordem do backlog** soma a ela o esforço e a dependência, e por isso as duas podem divergir. Os
fechamentos (`HU-SL-022`, `HU-SL-023`) são Média na história, mas Must na R3: são a razão de ser da
release, e até lá o financeiro fecha pela exportação da lista. O agente de ocorrências
(`HU-SL-017`) é Alta, mas fica na R2: depende do protocolo de atendimento, que a SEALog ainda vai
escrever (`Q-SL-05`), e o chamado já existe sem ele, aberto pelo Não entregue da terceirizada.

## 2. Releases

Cada release resolve casos inteiros do enunciado, para que a SEALog sinta a diferença no dia a dia,
e cada uma corresponde a uma fase da adoção gradual.

| Release | Objetivo | Casos que resolve | Fase da adoção |
|---|---|---|---|
| **R1 — Pedido, despacho e retorno** | Do pedido completo no WhatsApp ao comprovante padrão da terceirizada, num registro único | "Pedido com informações incompletas", "O registro incorreto" | Cadastros, piloto e segunda terceirizada |
| **R2 — Ocorrências e comunicação** | Nenhuma ocorrência perdida, a loja avisada sem depender do atendimento, e a decisão registrada | "O buquê de sábado", "A segunda-feira de chuva" | Todas as lojas |
| **R3 — Financeiro** | A cobrança das lojas e o pagamento das terceirizadas saem do registro | — (Enunciado §2: o financeiro calcula pelos registros) | Financeiro |
| **Fora desta versão** | O que foi deixado de fora de propósito, e por quê | — | — |

## 3. Backlog

### R1 — Pedido, despacho e retorno

| ID | Item | HUs | MoSCoW | Release | Valor | Esforço | Depende de | Por quê |
|---|---|---|---|---|---|---|---|---|
| `BL-SL-01` | Acesso por perfil da equipe e da terceirizada | `HU-SL-024` | Must | R1 | Alto | M | — | Todo registro precisa de autor, e cada perfil vê só a sua parte |
| `BL-SL-02` | Cadastro da loja e dos números autorizados | `HU-SL-005` | Must | R1 | Alto | P | `BL-SL-01` | Sem número autorizado, ninguém pede pelo WhatsApp (`DEC-SL-03`) |
| `BL-SL-03` | Cadastro da terceirizada | `HU-SL-007` | Must | R1 | Alto | P | `BL-SL-01` | É para quem o pedido vai |
| `BL-SL-04` | Tabela de regiões | `HU-SL-008` | Must | R1 | Alto | P | `BL-SL-03` | Base da distribuição automática (`DEC-SL-05`) |
| `BL-SL-05` | Habilitador: conta do WhatsApp Business, formulário e modelos de mensagem aprovados | — | Must | R1 | Alto | G | — | O prazo de aprovação é da Meta; começar cedo destrava o pedido e os avisos (`DEC-SL-15`) |
| `BL-SL-06` | Pedido pelo WhatsApp com formulário obrigatório | `HU-SL-001` | Must | R1 | Alto | G | `BL-SL-02`, `BL-SL-05` | Resolve o caso "Pedido com informações incompletas" na entrada (`DEC-SL-02`) |
| `BL-SL-07` | Acompanhar o pedido pelo WhatsApp | `HU-SL-002` | Must | R1 | Alto | P | `BL-SL-06` | Responde "cadê minha entrega?" sem passar por ninguém |
| `BL-SL-08` | Registro do pedido pela equipe | `HU-SL-004` | Must | R1 | Alto | M | `BL-SL-09` | Áudio, ligação e planilha da loja continuam chegando |
| `BL-SL-09` | Lista única de entregas com histórico | `HU-SL-009` | Must | R1 | Alto | M | `BL-SL-01` | É a fonte da verdade (`DEC-SL-01`); resolve o caso "O registro incorreto" |
| `BL-SL-10` | Distribuição pela região | `HU-SL-010` | Must | R1 | Alto | P | `BL-SL-04`, `BL-SL-06` | Ninguém distribui à mão |
| `BL-SL-11` | Habilitador: padrão da integração publicado para as terceirizadas | — | Must | R1 | Alto | M | — | As terceirizadas precisam do padrão antes de integrar (`DEC-SL-06`, `RNF-SL-15`) |
| `BL-SL-12` | Envio da solicitação à terceirizada | `HU-SL-011` | Must | R1 | Alto | M | `BL-SL-10`, `BL-SL-11` | Substitui o envio por WhatsApp e planilha |
| `BL-SL-13` | Retorno pela integração | `HU-SL-013` | Must | R1 | Alto | M | `BL-SL-11`, `BL-SL-12` | O caminho preferencial do status |
| `BL-SL-14` | Retorno pelo portal | `HU-SL-014` | Must | R1 | Alto | M | `BL-SL-12` | A terceirizada sem integração precisa de um caminho simples (`RNF-SL-02`) |
| `BL-SL-15` | Comprovante padrão | `HU-SL-016` | Must | R1 | Alto | M | `BL-SL-13`, `BL-SL-14` | Resolve a dúvida "diz que entregou" e a foto sem vínculo (`DEC-SL-07`) |
| `BL-SL-16` | Retorno por planilha traduzida | `HU-SL-015` | Should | R1 | Médio | M | `BL-SL-12` | Deixa a terceirizada começar como já trabalha; até lá, a equipe usa o portal por ela |
| `BL-SL-17` | Editar ou cancelar o pedido pelo WhatsApp | `HU-SL-003` | Should | R1 | Médio | P | `BL-SL-06` | Até lá, a loja pede a mudança ao atendimento |
| `BL-SL-18` | Aviso de alteração à terceirizada | `HU-SL-012` | Should | R1 | Médio | P | `BL-SL-12`, `BL-SL-17` | Sem ele, a alteração depois do despacho volta ao telefone |

### R2 — Ocorrências e comunicação

| ID | Item | HUs | MoSCoW | Release | Valor | Esforço | Depende de | Por quê |
|---|---|---|---|---|---|---|---|---|
| `BL-SL-19` | Habilitador: protocolo de atendimento escrito com a SEALog | — | Must | R2 | Alto | M | — | Sem protocolo, o agente não tem com o que comparar (`Q-SL-05`) |
| `BL-SL-20` | Painel de chamados | `HU-SL-018` | Must | R2 | Alto | M | `BL-SL-13` | Nenhuma ocorrência tratada fora do painel; resolve o caso "O buquê de sábado" |
| `BL-SL-21` | Aviso automático à loja | `HU-SL-020` | Must | R2 | Alto | P | `BL-SL-05`, `BL-SL-20` | A loja sabe do problema antes do consumidor (`DEC-SL-11`) |
| `BL-SL-22` | Devolução no galpão e decisão | `HU-SL-019` | Must | R2 | Alto | M | `BL-SL-20` | Os quatro destinos registrados (`DEC-SL-09`) |
| `BL-SL-23` | Relato de problema com o agente de ocorrências | `HU-SL-017` | Must | R2 | Alto | G | `BL-SL-19`, `BL-SL-20` | A loja relata a qualquer hora e o chamado chega com sugestão (`DEC-SL-10`) |
| `BL-SL-24` | Entregas afetadas por loja e aviso em lote | `HU-SL-021` | Must | R2 | Alto | M | `BL-SL-21` | Resolve o caso "A segunda-feira de chuva": um aviso por loja em vez de 120 mensagens |
| `BL-SL-25` | Manutenção dos dados comerciais da loja | `HU-SL-006` | Could | R2 | Baixo | P | `BL-SL-02` | Até lá, o cadastro inicial basta; a mudança passa pelo coordenador |
| `BL-SL-26` | Habilitador: painel de adoção | — | Should | R2 | Médio | P | `BL-SL-09` | Mede os critérios de avanço de cada fase (`DEC-SL-16`) |

### R3 — Financeiro

| ID | Item | HUs | MoSCoW | Release | Valor | Esforço | Depende de | Por quê |
|---|---|---|---|---|---|---|---|---|
| `BL-SL-27` | Fechamento da cobrança das lojas | `HU-SL-022` | Must | R3 | Alto | G | `BL-SL-09` | A cobrança sai do registro; o valor depende da tabela de preços (`DEC-SL-18`) |
| `BL-SL-28` | Fechamento do pagamento das terceirizadas | `HU-SL-023` | Must | R3 | Alto | M | `BL-SL-15` | Paga só a entrega comprovada (`RN-SL-048`); o valor depende da SEALog (`DEC-SL-18`) |

### Fora desta versão

| ID | Item | HUs | MoSCoW | Release | Valor | Esforço | Depende de | Por quê |
|---|---|---|---|---|---|---|---|---|
| `BL-SL-29` | Aplicativo do motorista | — | Won't | — | Baixo | G | — | O motorista é da terceirizada (`DEC-SL-04`) |
| `BL-SL-30` | Roteirização ou otimização de rotas | — | Won't | — | Baixo | G | — | A rota é da terceirizada; a SEALog só distribui por região (`DEC-SL-05`) |
| `BL-SL-31` | Agente de consulta de status | — | Won't | — | Baixo | M | — | O botão de acompanhar responde do banco, sem custo de modelo (`DEC-SL-10`) |
| `BL-SL-32` | Emissão de nota fiscal e cobrança bancária | — | Won't | — | Médio | G | — | A origem só cita o cálculo da cobrança |

## 4. Cobertura

As 24 histórias estão no backlog, cada uma em um item. A página do backlog no aplicativo confere
isso a cada carga e mostra a história que ficar de fora, e mostra também onde a ordem diverge da
prioridade da história.
