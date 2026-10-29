# SEALog — Backlog e priorização

O backlog do SEALog, em ordem de entrega. Cada item tem um id `BL-SL-NN` e uma camada: **Canal**
(WhatsApp), **Front** (telas), **Back** (API, regras e dados), **Integração** (terceirizadas),
**Agente** (agente de ocorrências), **Infra** (publicação, cópia de segurança, monitoramento) e
**Negócio** (protocolo, cadastros e treinamento que a SEALog faz). Itens sem história são
habilitadores: trabalho que nenhuma história descreve, mas sem o qual uma delas não funciona.

> **Rascunho.** Esta é a segunda versão do backlog, reorganizada por entrega ao cliente e por camada
> técnica. A equipe ainda vai revisá-la na sessão de priorização: classe MoSCoW, esforço e corte das
> releases podem mudar.

## 1. Como se prioriza

Um item sobe na ordem quando entrega valor ao cliente com pouco esforço e sem esperar outro. O
cliente aqui são três: a loja que pede, a terceirizada que entrega e o consumidor que acompanha. A
ordem combina quatro critérios (`DEC-SL-20`):

| Critério | Pergunta | Valores |
|---|---|---|
| **MoSCoW** | A release funciona sem isto? | **Must (essencial)** — sem ele a release não resolve o caso a que se propõe · **Should (importante)** — há contorno, mas a equipe sente falta · **Could (desejável)** — entra se sobrar tempo · **Won't (fora)** — fora desta versão, de propósito |
| **Valor** | Quanto isto muda a vida do cliente? | **Alto** — resolve um dos casos do enunciado ou a causa comum · **Médio** — tira trabalho manual · **Baixo** — conforto |
| **Esforço** | Quanto custa construir? | **P** — dias · **M** — uma a duas semanas · **G** — mais de duas semanas, ou depende de terceiro |
| **Dependência** | O que precisa existir antes? | Os itens da coluna `Depende de` |

A **prioridade da HU** (Alta, Média), escrita em cada história, mede o valor para quem usa. A
**ordem do backlog** soma a ela o esforço e a dependência, e por isso as duas podem divergir. Os
fechamentos (`HU-SL-022`, `HU-SL-023`) são Média na história, mas Must na R3: são a razão de ser da
release. O agente de ocorrências (`HU-SL-017`) é Alta, mas fica na R2: a entrega depende do
mapeamento do modelo, e não de um protocolo escrito, que a SEALog não tem por enquanto (`Q-SL-05`).

As camadas sozinhas não definem a ordem. Antes de começar a tela de uma release, a API e o banco
dela precisam existir; por isso a base técnica (`BL-SL-33`) e o canal do WhatsApp (`BL-SL-05`)
aparecem primeiro, mesmo sem valor visível para o cliente: um deles tem prazo da Meta, e o outro
é a fundação de tudo.

## 2. Releases

Cada release entrega uma experiência inteira ao cliente, para que a SEALog sinta a diferença no
dia a dia. Cada uma corresponde a uma fase da adoção gradual.

| Release | Entrega ao cliente | Casos que resolve | Fase da adoção |
|---|---|---|---|
| **R1 — Pedido, despacho e retorno** | A loja pede pelo WhatsApp e acompanha sozinha; a terceirizada recebe o pedido e devolve o comprovante padrão; a equipe enxerga tudo numa lista só | "Pedido com informações incompletas", "O registro incorreto" | Cadastros, piloto e segunda terceirizada |
| **R2 — Ocorrências e comunicação** | Nenhuma ocorrência perdida, a loja avisada sem depender do atendimento, e a decisão registrada | "O buquê de sábado", "A segunda-feira de chuva" | Todas as lojas |
| **R3 — Financeiro** | A cobrança das lojas e o pagamento das terceirizadas saem do registro | — (Enunciado §2: o financeiro calcula pelos registros) | Financeiro |
| **Fora desta versão** | O que foi deixado de fora de propósito, e por quê | — | — |

## 3. Backlog

### R1 — Pedido, despacho e retorno

| ID | Ordem | Camada | Item | HUs | MoSCoW | Release | Valor | Esforço | Depende de | Por quê |
|---|---|---|---|---|---|---|---|---|---|---|
| `BL-SL-05` | 1 | Canal | Conta do WhatsApp Business, formulário e modelos de mensagem aprovados | — | Must | R1 | Alto | G | — | O prazo de aprovação é da Meta; começar cedo destrava o pedido e os avisos (`DEC-SL-15`) |
| `BL-SL-33` | 2 | Infra | Base técnica: API em FastAPI, banco no Supabase e ambiente de homologação | — | Must | R1 | Alto | M | — | Sem ela nenhuma tela ou canal roda; a escolha da stack está em `DEC-SL-21` |
| `BL-SL-01` | 3 | Back | Acesso por perfil da equipe e da terceirizada | `HU-SL-024` | Must | R1 | Alto | M | `BL-SL-33` | Todo registro precisa de autor, e cada perfil vê só a sua parte |
| `BL-SL-34` | 4 | Back | Recebimento das mensagens do WhatsApp e controle dos status do pedido | — | Must | R1 | Alto | M | `BL-SL-05`, `BL-SL-33` | O canal da loja chega por aqui; o status só muda por regra, nunca à mão no texto |
| `BL-SL-35` | 5 | Front | Painel da equipe: entrada, navegação e listas | — | Must | R1 | Alto | M | `BL-SL-01`, `BL-SL-33` | É a tela em que a equipe trabalha; sem ela, cada cadastro vira planilha |
| `BL-SL-02` | 6 | Front | Cadastro da loja e dos números autorizados | `HU-SL-005` | Must | R1 | Alto | P | `BL-SL-35` | Sem número autorizado, ninguém pede pelo WhatsApp (`DEC-SL-03`) |
| `BL-SL-03` | 7 | Front | Cadastro da terceirizada | `HU-SL-007` | Must | R1 | Alto | P | `BL-SL-35` | É para quem o pedido vai |
| `BL-SL-04` | 8 | Back | Tabela de regiões | `HU-SL-007` | Must | R1 | Alto | P | `BL-SL-03` | Base da distribuição automática (`DEC-SL-05`) |
| `BL-SL-06` | 9 | Canal | Pedido pelo WhatsApp com formulário obrigatório | `HU-SL-001` | Must | R1 | Alto | G | `BL-SL-02`, `BL-SL-34` | Resolve o caso "Pedido com informações incompletas" na entrada (`DEC-SL-02`) |
| `BL-SL-07` | 10 | Canal | Acompanhar o pedido pelo WhatsApp | `HU-SL-002` | Must | R1 | Alto | P | `BL-SL-06` | Responde "cadê minha entrega?" sem passar por ninguém |
| `BL-SL-09` | 11 | Back | Lista única de entregas com histórico | `HU-SL-009` | Must | R1 | Alto | M | `BL-SL-01` | É a fonte da verdade (`DEC-SL-01`); resolve o caso "O registro incorreto" |
| `BL-SL-08` | 12 | Front | Registro do pedido pela equipe | `HU-SL-004` | Must | R1 | Alto | M | `BL-SL-09` | Áudio, ligação e planilha da loja continuam chegando |
| `BL-SL-10` | 13 | Back | Distribuição pela região | `HU-SL-010` | Must | R1 | Alto | P | `BL-SL-04`, `BL-SL-06` | Ninguém distribui à mão |
| `BL-SL-11` | 14 | Integração | Padrão de integração publicado para as terceirizadas | — | Must | R1 | Alto | M | — | As terceirizadas precisam do padrão antes de integrar (`DEC-SL-06`, `RNF-SL-15`) |
| `BL-SL-12` | 15 | Back | Envio da solicitação à terceirizada | `HU-SL-011` | Must | R1 | Alto | M | `BL-SL-10`, `BL-SL-11` | Substitui o envio por WhatsApp e planilha |
| `BL-SL-13` | 16 | Integração | Retorno pela integração | `HU-SL-013` | Must | R1 | Alto | M | `BL-SL-11`, `BL-SL-12` | O caminho preferencial do status |
| `BL-SL-14` | 17 | Front | Retorno pelo portal da terceirizada | `HU-SL-014` | Must | R1 | Alto | M | `BL-SL-12` | A terceirizada sem integração precisa de um caminho simples (`RNF-SL-02`) |
| `BL-SL-15` | 18 | Back | Comprovante padrão | `HU-SL-016` | Must | R1 | Alto | M | `BL-SL-13`, `BL-SL-14` | Resolve a dúvida "diz que entregou" e a foto sem vínculo (`DEC-SL-07`) |
| `BL-SL-36` | 19 | Integração | Leitura da planilha modelo pela API | — | Should | R1 | Médio | M | `BL-SL-33` | Deixa a terceirizada devolver a planilha que já usa, sem portal |
| `BL-SL-16` | 20 | Integração | Retorno por planilha traduzida | `HU-SL-015` | Should | R1 | Médio | M | `BL-SL-12`, `BL-SL-36` | Até lá, a equipe usa o portal pela terceirizada |
| `BL-SL-17` | 21 | Canal | Editar ou cancelar o pedido pelo WhatsApp | `HU-SL-003` | Should | R1 | Médio | P | `BL-SL-06` | Até lá, a loja pede a mudança ao atendimento |
| `BL-SL-18` | 22 | Integração | Aviso de alteração à terceirizada | `HU-SL-012` | Should | R1 | Médio | P | `BL-SL-12`, `BL-SL-17` | Sem ele, a alteração depois do despacho volta ao telefone |
| `BL-SL-37` | 23 | Infra | Cópia de segurança diária e restauração testada | — | Must | R1 | Alto | P | `BL-SL-33` | Perda máxima de 24 horas (`RNF-SL-17`); sem teste de restauração, a cópia não conta |
| `BL-SL-38` | 24 | Infra | Monitoramento do link de rastreio e dos erros | — | Should | R1 | Médio | P | `BL-SL-33` | Falha percebida pela equipe antes da reclamação da loja (`RNF-SL-19`) |
| `BL-SL-44` | 25 | Front | Exportação dos pedidos da terceirizada em PDF ou planilha | — | Should | R1 | Médio | P | `BL-SL-12` | Dá à terceirizada que não usa o portal um caminho que a equipe já sabe fazer: baixar e mandar pelo WhatsApp (`RF-SL-25`) |

### R2 — Ocorrências e comunicação

| ID | Ordem | Camada | Item | HUs | MoSCoW | Release | Valor | Esforço | Depende de | Por quê |
|---|---|---|---|---|---|---|---|---|---|---|
| `BL-SL-19` | 26 | Negócio | Protocolo de atendimento escrito com a SEALog, se a SEALog quiser escrevê-lo | — | Could | R2 | Alto | M | — | Sem protocolo escrito, o agente se apoia nos dados do pedido e do relato (`Q-SL-05`) |
| `BL-SL-20` | 27 | Front | Painel de chamados | `HU-SL-018` | Must | R2 | Alto | M | `BL-SL-13` | Nenhuma ocorrência tratada fora do painel; resolve o caso "O buquê de sábado" |
| `BL-SL-40` | 28 | Agente | Chamado aberto pela API para o agente de ocorrências, com chave própria | — | Must | R2 | Alto | M | `BL-SL-20`, `BL-SL-34` | O agente abre e lê chamados só pela API, nunca direto no banco (`RNF-SL-11`) |
| `BL-SL-23` | 29 | Agente | Relato de problema com o agente de ocorrências | `HU-SL-017` | Could | R2 | Alto | G | `BL-SL-40` | A loja relata a qualquer hora e o chamado é registrado; a sugestão de protocolo vem pelo `BL-SL-19`, de prioridade baixa (`DEC-SL-10`) |
| `BL-SL-22` | 30 | Back | Devolução no galpão e decisão | `HU-SL-019` | Must | R2 | Alto | M | `BL-SL-20` | Os quatro destinos registrados (`DEC-SL-09`) |
| `BL-SL-21` | 31 | Canal | Aviso automático à loja | `HU-SL-020` | Must | R2 | Alto | P | `BL-SL-05`, `BL-SL-20` | A loja sabe do problema antes do consumidor (`DEC-SL-11`) |
| `BL-SL-24` | 32 | Back | Entregas afetadas por loja e aviso em lote | `HU-SL-021` | Must | R2 | Alto | M | `BL-SL-21` | Resolve o caso "A segunda-feira de chuva": um aviso por loja em vez de 120 mensagens |
| `BL-SL-43` | 33 | Front | Exportação da lista de entregas para o financeiro | — | Must | R2 | Alto | P | `BL-SL-09` | Até o fechamento, o financeiro confere pela lista exportada |
| `BL-SL-42` | 34 | Front | Painel de chamados em tempo real | — | Should | R2 | Médio | M | `BL-SL-20` | A equipe vê o chamado novo sem recarregar a tela (`RNF-SL-09`) |
| `BL-SL-25` | 35 | Front | Manutenção dos dados comerciais da loja | `HU-SL-006` | Could | R2 | Baixo | P | `BL-SL-02` | Até lá, o cadastro inicial basta; a mudança passa pelo coordenador |
| `BL-SL-26` | 36 | Front | Painel de adoção | — | Should | R2 | Médio | P | `BL-SL-09` | Mede os critérios de avanço de cada fase (`DEC-SL-16`) |

### R3 — Financeiro

| ID | Ordem | Camada | Item | HUs | MoSCoW | Release | Valor | Esforço | Depende de | Por quê |
|---|---|---|---|---|---|---|---|---|---|---|
| `BL-SL-27` | 37 | Back | Fechamento da cobrança das lojas | `HU-SL-022` | Must | R3 | Alto | G | `BL-SL-09` | A cobrança sai do registro; o valor depende da tabela de preços (`DEC-SL-18`) |
| `BL-SL-28` | 38 | Back | Fechamento do pagamento das terceirizadas | `HU-SL-023` | Must | R3 | Alto | M | `BL-SL-15` | Paga só a entrega comprovada (`RN-SL-048`); o valor depende da SEALog (`DEC-SL-18`) |

### Fora desta versão

| ID | Ordem | Camada | Item | HUs | MoSCoW | Release | Valor | Esforço | Depende de | Por quê |
|---|---|---|---|---|---|---|---|---|---|---|
| `BL-SL-29` | 39 | — | Aplicativo do motorista | — | Won't | — | Baixo | G | — | O motorista é da terceirizada (`DEC-SL-04`) |
| `BL-SL-30` | 40 | — | Roteirização ou otimização de rotas | — | Won't | — | Baixo | G | — | A rota é da terceirizada; a SEALog só distribui por região (`DEC-SL-05`) |
| `BL-SL-31` | 41 | — | Agente de consulta de status | — | Won't | — | Baixo | M | — | O botão de acompanhar responde do banco, sem custo de modelo (`DEC-SL-10`) |
| `BL-SL-32` | 42 | — | Emissão de nota fiscal e cobrança bancária | — | Won't | — | Médio | G | — | A origem só cita o cálculo da cobrança |

## 4. Processo de desenvolvimento

Todo item percorre as mesmas etapas, da fila ao uso real. A ordem de entrada na fila é a do backlog:
primeiro os essenciais da release, depois os importantes e, por último, os desejáveis. Um item só
entra em desenvolvimento quando o que ele depende já está pronto. A duração de cada etapa e o ritmo
das entregas ficam com a equipe (proposta, ainda sem número).

| Etapa | O que acontece | Quem | Sai quando |
|---|---|---|---|
| **1. No backlog** | O item tem id, camada, classe, valor, esforço e dependências | Equipe de requisitos | A equipe o confirma na sessão de priorização |
| **2. Pronto para começar** | As dependências estão prontas, os critérios de aceitação da história estão claros e as perguntas à SEALog que o bloqueiam foram respondidas | Equipe de requisitos e desenvolvimento | Nenhum `Q-SL-*` aberto bloqueia o item |
| **3. Em desenvolvimento** | Construção do item, com as regras do catálogo e os fluxos desenhados | Desenvolvimento | O item cumpre os critérios de aceitação da história |
| **4. Em revisão** | Outra pessoa da equipe confere o item contra a história, as regras e os critérios | Equipe | Revisão sem pendência |
| **5. Em homologação** | A SEALog experimenta o item num ambiente de teste, sem pedido real | SEALog e equipe | A SEALog aprova |
| **6. No piloto** | O item roda com poucas lojas e uma terceirizada, conforme a fase da adoção | SEALog | Os critérios de avanço da fase são atingidos (`DEC-SL-16`) |
| **7. Entregue** | O item está em uso por todas as lojas da release | SEALog | — |

Um item que volta de uma etapa para a anterior (por exemplo, reprovado na homologação) mantém a
posição que tinha no backlog. Os habilitadores, sem história, passam pelas mesmas etapas; a
revisão deles confere a dependência que destravam.

## 5. Cobertura

As 24 histórias estão no backlog, cada uma em um item. A página do backlog no aplicativo confere
isso a cada carga e mostra a história que ficar de fora, e mostra também onde a ordem diverge da
prioridade da história.
