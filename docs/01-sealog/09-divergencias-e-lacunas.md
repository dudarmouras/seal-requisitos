# SEALog — Divergências e lacunas

Registro das decisões que contrariam ou interpretam a origem, dos riscos da solução e das
perguntas que só a SEALog pode responder. Divergências e riscos recebem `DIV-SL-NN`; perguntas,
`Q-SL-NN`. Uma entrada tem desfecho quando traz a linha `**Desfecho**`.

Como não há sistema legado, a divergência aqui não é entre legado e pedido. Ela pode ser entre
fontes (o enunciado descreve a operação antes da terceirização, e a reunião, depois), entre a lista
da equipe e o que a terceirização pede, ou entre a solução e as restrições do cliente. Quando as
fontes discordam, a reunião de 28/10/2026 manda sobre o enunciado (`fontes/README.md`).

---

## 1. Decisões que interpretam a origem

### `DIV-SL-01` — A terceirização tira o motorista, a rota e a etiqueta do escopo

> **Divergência `DIV-SL-01`:** o enunciado descreve motoristas próprios, rotas montadas pelo
> coordenador e etiquetas escritas à mão (Enunciado §2). No Encontro 1, o cliente contou que
> terceirizou as entregas para duas empresas, uma por região, e que o motorista e a comunicação com
> ele ficam com a terceirizada (Encontro 1 [13:15], [17:36]).

**Desfecho** — vale a reunião. O SEALog não tem aplicativo do motorista, montagem de rotas nem
etiqueta. No lugar entram o despacho pelas regiões das terceirizadas (`RN-SL-023`), o padrão único de
retorno e comprovante (`RN-SL-019`, `RN-SL-030`) e o código SEALog como identificação do pacote
(`RN-SL-027`). A coleta na loja passa a ser da terceirizada (`RN-SL-025`). O prazo de entrega ao
cliente também é responsabilidade da terceirizada, pela resposta da SEALog a `Q-SL-12`.

### `DIV-SL-02` — Itens da lista da equipe que mudaram

> **Divergência `DIV-SL-02`:** a lista RF-01 a RF-20 do planejamento da equipe foi escrita antes da
> terceirização. Parte dela pressupõe motorista próprio e conta com senha para a loja.

**Desfecho** — a lista é a base, com estas mudanças, detalhadas em
[`requisitos`](../00-visao-geral/requisitos.md):

| Item da equipe | O que mudou |
|---|---|
| RF-02 Autenticação de clientes | A loja não tem senha nem cadastro; o primeiro pedido de um número é confirmado pela equipe (`RN-SL-014`) |
| RF-01, RF-03, RF-04 Cadastro da loja e dados comerciais | Saíram: a loja não tem cadastro (`DIV-SL-10`) |
| RF-05, RF-06 Cadastro e análise de motoristas | Substituídos pelo cadastro de terceirizadas (`HU-SL-007`) |
| RF-09 Notificação por e-mail | O aviso vai pelo WhatsApp, onde a loja já está (`RN-SL-043`) |
| RF-10 Forma de coleta | A coleta é só da terceirizada; a loja não leva mais ao galpão (resposta da SEALog a `Q-SL-02`) |
| RF-12 Distribuição por motorista | Vira distribuição por terceirizada, pela região (`HU-SL-010`) |
| RF-13 Visualização pelo motorista | Vira o despacho à terceirizada, pela API ou pelo portal (`HU-SL-011`) |
| RF-14 Ocorrências do motorista | Vira o Não entregue da terceirizada, que abre chamado (`HU-SL-013`) |
| RF-20 Avisar o motorista de alterações | Vira avisar a terceirizada (`HU-SL-012`) |
| Decisão "roteamento a partir de IA" | Substituída pela regra fixa de região; a IA ficou no agente de ocorrências (`DEC-SL-05`, `DEC-SL-10`) |

### `DIV-SL-03` — A planilha continua, mas só como saída e como entrada traduzida

> **Divergência `DIV-SL-03`:** a equipe está acostumada com planilha, algumas lojas mandam planilha
> própria, e hoje as terceirizadas atualizam a planilha da SEALog (Enunciado §2; Encontro 1 [13:15]).
> Ao mesmo tempo, as planilhas divergentes são causa de erro (caso "O registro incorreto").

**Desfecho** — a planilha nunca é fonte. Na entrada, a planilha da loja ou da terceirizada é
traduzida para o padrão, linha a linha validada (`RN-SL-029`); na saída, toda lista exporta, e nada
exportado volta (`RN-SL-050`).

### `DIV-SL-04` — O plano do agente foi adaptado à logística

> **Divergência `DIV-SL-04`:** o plano do agente de ocorrências partiu de um modelo de loja virtual:
> tipos como pedido errado e defeito, políticas como troca em 7 dias e cupom de frete, dados do
> consumidor no conteúdo enviado. A SEALog não vende produto; transporta. O plano também previa um
> agente de consulta de status.

**Desfecho** — os tipos de chamado viraram atraso, não entregue, avaria, entregue no endereço
errado, recebedor não autorizado, sem retorno e outro (`06-modelo-de-dados.md` §3.4). Não há
protocolo escrito por enquanto (`Q-SL-05`): o coordenador trata cada chamado manualmente, com a
sugestão do agente, sem política inventada. O conteúdo enviado ao modelo não leva dados pessoais do
destinatário (`RN-SL-038`). O agente de consulta de status não existe: a loja acompanha pela
terceirizada (`DIV-SL-10`). O mesmo vale para a coleta de CPF que ele faria.

### `DIV-SL-10` — A loja não tem cadastro e não acompanha o pedido pelo SEALog

> **Divergência `DIV-SL-10`:** a primeira versão desta documentação cadastrava a loja, com os
> números de WhatsApp autorizados e os dados comerciais, e deixava a loja consultar o status do
> pedido no menu do WhatsApp. Em 29/10/2026 a equipe decidiu que a loja não se cadastra — quem se
> cadastra são as empresas terceirizadas — e que o acompanhamento do pedido é feito pela
> terceirizada, não pelo SEALog.

**Desfecho** — vale a decisão da equipe. Saíram `RF-SL-02`, `RF-SL-05`, `RF-SL-06` e `RF-SL-08`,
as histórias `HU-SL-002`, `HU-SL-005`, `HU-SL-006` e `HU-SL-008`, as telas `TL-SL-005` e
`TL-SL-007`, a entidade `ENT-SL-001`, as regras `RN-SL-015` e `RN-SL-054` e o item `BL-SL-07`; os
ids não são reaproveitados. A tabela de regiões virou parte do cadastro da terceirizada
(`HU-SL-007`). No lugar do número autorizado entra a confirmação: o primeiro pedido de um número fica
"A confirmar" até a equipe aprovar (`RN-SL-014`, `Q-SL-18`). O que o cadastro dava ao pedido passa
a vir dele: o endereço de coleta (`Q-SL-19`) e o nome da loja, que a cobrança usa (`Q-SL-21`). O
menu do WhatsApp fica com novo pedido e editar ou cancelar, e a entrada do relato de problema está
em `Q-SL-20`.

## 2. Riscos

### `DIV-SL-05` — Conta e custo do WhatsApp

> **Risco:** o pedido, o acompanhamento e todos os avisos dependem da plataforma oficial do
> WhatsApp (`INT-001`), que exige conta comercial, modelos de mensagem aprovados pela Meta e custo
> por mensagem. A conta comercial já existe (`Q-SL-12`). Sem a aprovação dos modelos, o aviso
> proativo — a resposta ao caso "O buquê de sábado" — volta a depender de uma pessoa, e uma pessoa só
> trabalha no horário do atendimento.

Mitigação: confirmar que os modelos de mensagem estão aprovados antes de tudo, como habilitador do
backlog (`BL-SL-05`). Enquanto não sai, o painel de chamados mostra os avisos a enviar, com o texto
pronto.

### `DIV-SL-06` — A terceirizada não adotar a integração

> **Risco:** as terceirizadas "não têm tanta habilidade com tecnologia" (Encontro 1 [23:17]). Se o
> retorno não chegar, o SEALog volta a não saber onde está a entrega.

Mitigação na própria solução: três caminhos com o mesmo padrão — API, portal simples e planilha
traduzida (`RN-SL-029`); entrega sem retorno sinalizada depois do prazo estimado pela terceirizada
(`RN-SL-034`); e o pagamento só pelas entregas com comprovante aceito (`RN-SL-048`), que dá à
terceirizada motivo para informar.

### `DIV-SL-07` — "A parceira diz que entregou e o destinatário diz que não"

> **Risco:** é a preocupação central do cliente depois da terceirização (Encontro 1 [26:53],
> [38:44]). Hoje cada terceirizada tem seu padrão, e a foto, quando vem, é tirada "do jeito que o
> motorista quiser" (Encontro 1 [43:19]).

Mitigação: o comprovante padrão é obrigatório para o Entregue valer (`RN-SL-030`); o recebedor que
não é o destinatário nem pessoa autorizada abre chamado (`RN-SL-031`); a loja relata pelo WhatsApp
e o chamado já traz o comprovante (`HU-SL-017`). Os motivos de não entrega e a exigência de foto
ficam com a terceirizada (resposta da SEALog a `Q-SL-11`).

### `DIV-SL-08` — Dados pessoais no modelo de IA e nas fotos

> **Segurança:** o agente de ocorrências usa um modelo de linguagem de terceiro, e as fotos do
> comprovante podem mostrar rosto, documento ou o interior de uma casa. A equipe decidiu ter
> cuidado com dados sensíveis na IA (Planejamento da equipe).

O modelo recebe só o código, o tipo, o relato e as fotos que a própria loja mandou (`RN-SL-038`).
As fotos ficam no armazenamento do SEALog, com acesso por perfil.

> **Risco aberto:** a SEALog respondeu que as fotos e os dados do destinatário ficam guardados sem
> prazo (`Q-SL-16`). A LGPD (Lei 13.709/2018) pede finalidade e prazo definidos para esses dados.
> A resposta precisa ser revista antes de qualquer uso real.

### `DIV-SL-09` — Adoção e custo

> **Risco:** a empresa é pequena, ainda usa planilha e WhatsApp, e o custo pesou na decisão de
> terceirizar (Encontro 1 [29:03], [30:33]). Ao mesmo tempo, a meta é chegar a cerca de 400
> entregas por dia no mês que vem, o que "do jeito que está não vai ser possível" (Encontro 1
> [23:40]).

A solução usa serviços pagos por uso e não pede nada novo à loja. A entrada é gradual
([`adocao-gradual`](../00-visao-geral/adocao-gradual.md)): a planilha sai aos poucos, à medida que
cada terceirizada é formalizada e passa a enviar os dados direto para o banco e o painel (resposta
da SEALog a `Q-SL-14`). Quanto tempo a planilha convive com o sistema segue em aberto em `Q-SL-14`.

### `DIV-SL-11` — O aviso à loja, essencial, depende do painel de chamados, desejável

> **Risco:** a equipe marcou o aviso automático à loja (`RF-SL-20`, `BL-SL-21`) e as entregas
> afetadas por loja (`RF-SL-21`, `BL-SL-24`) como essenciais, e o painel de chamados (`RF-SL-18`,
> `BL-SL-20`) como desejável. O aviso nasce do chamado, e a consulta de afetados lista as entregas
> "com chamado" (`RN-SL-043`, `RN-SL-044`).

Sem o painel, o aviso e a consulta funcionam só a partir do Não entregue da terceirizada, e o
chamado de recebedor não autorizado ou de relato da loja não existe. A prioridade do painel ou a
dependência precisa ser decidida pela equipe; até lá, a dependência `BL-SL-21` → `BL-SL-20` está
mantida no backlog, com a classe dos dois à vista.

### `DIV-SL-12` — O pagamento, essencial, depende do comprovante padrão, desejável

> **Risco:** a equipe marcou o pagamento das terceirizadas (`RF-SL-23`, `BL-SL-28`) como essencial e
> o comprovante padrão (`RF-SL-16`, `BL-SL-15`) como desejável. O pagamento só vale para entrega
> com comprovante aceito (`RN-SL-048`), e o Entregue só é aceito com o comprovante (`RN-SL-030`).

Se o comprovante for desejável de verdade, `RN-SL-030` e `RN-SL-048` perdem o ponto de apoio: o
pagamento passaria a se basear no "Entregue" informado, sem prova, que é justamente a dúvida "a
parceira diz que entregou" (`DIV-SL-07`). A equipe precisa decidir entre subir o comprovante para
essencial ou mudar a regra do pagamento; até lá, as duas classes estão mantidas como a equipe as
deu.

## 3. Perguntas à SEALog

### 3.1 Em aberto

| ID | Pergunta | Por que importa | Onde afeta |
|---|---|---|---|
| `Q-SL-04` | Pedir a alteração por código do produto ou pela lista de todos os itens editáveis? A lista da proposta é a dos itens que não saíram para entrega. | Define a tela de edição; a opção por código evita listas enormes em lojas grandes | `RN-SL-011` |
| `Q-SL-07` | Por quanto tempo o pacote fica guardado no galpão, e o que acontece depois do prazo? | Sem prazo de guarda, o pacote não tem fim definido no galpão | `RN-SL-042` |
| `Q-SL-08` | Qual é a tabela de preços das lojas? | Fora da apresentação: a SEALog não tem a tabela agora | `RN-SL-047` |
| `Q-SL-09` | Quanto a SEALog paga à terceirizada por entrega? Paga tentativa e devolução? | Fora da apresentação: o valor é por contrato, cadastrado em `HU-SL-007` | `RN-SL-048` |
| `Q-SL-10` | Os perfis atendente e financeiro são confirmados? | Define a matriz de permissões | `RN-SL-051`; `01-atores-e-permissoes.md` |
| `Q-SL-14` | Por quanto tempo planilha e sistema convivem, e com qual terceirizada se começa? | Adoção é risco | `DIV-SL-09` |
| `Q-SL-16` | Por quanto tempo as fotos do comprovante e os dados do destinatário devem ser guardados? A resposta "pra sempre" precisa ser revista pela LGPD. | Exigência da LGPD e custo de armazenamento | `DIV-SL-08` |
| `Q-SL-17` | Quanto tempo a entrada da equipe fica bloqueada depois de cinco tentativas erradas, e quem desbloqueia? A pergunta anterior não ficou clara. | Ponto a detalhar da lista da equipe (RNF-01) | `RN-SL-052` |
| `Q-SL-18` | Quem na equipe confirma o número de uma loja nova, e como sabe que ela é cliente? A proposta é o atendente ou o coordenador, conferindo o nome da loja no primeiro pedido. | Sem cadastro, é a única barreira contra pedido falso (`DEC-SL-03`) | `RN-SL-014` |
| `Q-SL-19` | De onde vem o endereço de coleta, já que a loja não tem cadastro? A proposta é pedi-lo no formulário. | Vai no despacho da terceirizada | `RN-SL-005`, `RN-SL-024` |
| `Q-SL-20` | Como a loja chega ao agente de ocorrências, se o menu só tem novo pedido e editar ou cancelar? | Sem botão no menu, o relato precisa de outra porta de entrada | `RN-SL-004`, `RN-SL-036`; `HU-SL-017` |
| `Q-SL-21` | Como a cobrança identifica a loja, sem cadastro: pelo nome digitado no pedido ou por outro dado? | O nome digitado varia de um pedido para outro | `RN-SL-047`; `HU-SL-022` |

### 3.2 Respondidas em 29/10/2026

| ID | Pergunta | Resposta | Onde afeta |
|---|---|---|---|
| `Q-SL-01` | A partir de que horário o pedido passa para o dia útil seguinte? | Corte às 18h: pedido depois disso conta como do dia útil seguinte | `RN-SL-009` |
| `Q-SL-02` | A coleta entre 14h e 18h vale para a terceirizada? A loja ainda pode levar o volume ao galpão? | Só a terceirizada coleta; a loja não leva ao galpão | `RN-SL-025` |
| `Q-SL-03` | Quando a terceirizada devolve o pacote não entregue ao galpão? | No dia útil seguinte | `RN-SL-041` |
| `Q-SL-05` | Qual é o protocolo de atendimento para cada tipo de ocorrência? | Não há protocolo por enquanto; o coordenador trata cada chamado manualmente, com a sugestão do agente | `RN-SL-037`; `INT-004` |
| `Q-SL-06` | Quem aprova o chamado: o atendente ou o coordenador? | O coordenador, que é o administrador | `RN-SL-040` |
| `Q-SL-11` | Que motivos de não entrega e que foto de comprovante valem como padrão? | Não é da SEALog: fica com a terceirizada | `06-modelo-de-dados.md` §3.3; `RN-SL-030` |
| `Q-SL-12` | A SEALog tem conta comercial na plataforma oficial do WhatsApp? Quem paga as mensagens? | A conta já existe; a SEALog paga as mensagens. O prazo de entrega ao cliente é da terceirizada | `INT-001`; `DIV-SL-05` |
| `Q-SL-13` | Depois de quanto tempo sem retorno a entrega deve ser sinalizada? | Não há alerta enquanto a entrega estiver dentro do prazo estimado pela terceirizada; passou do prazo, fica sinalizada | `RN-SL-034` |
| `Q-SL-15` | O destinatário recebe algum aviso da SEALog, ou só a loja? | Só se algo der errado | `00-visao-geral.md` §3 |

## Cobertura da conferência com a fonte

Uma seção da fonte é **conferida** quando todos os itens dela foram percorridos contra `docs/` e
cada um tem resposta — uma regra, uma história, ou uma entrada neste arquivo. Fontes conferidas em
29/10/2026: o enunciado, o Encontro 1 e o planejamento da equipe. O resumo dos gargalos foi
conferido na primeira versão e continua coberto.

| Seção da fonte | Módulo | Itens conferidos | Data | Achados |
|---|---|---|---|---|
| `Enunciado §2` Solicitação e conferência | `entrada-pedidos` | 4 de 4 | 2026-10-29 | `HU-SL-001`, `HU-SL-004`; `RN-SL-002`, `RN-SL-005`, `RN-SL-009` |
| `Enunciado §2` Registro e planejamento | `despacho` | 4 de 4 | 2026-10-29 | `HU-SL-009`, `HU-SL-010`; `DIV-SL-01`; `Q-SL-02` |
| `Enunciado §2` Execução e atualização | `retorno-terceirizada` | 5 de 5 | 2026-10-29 | `HU-SL-013` a `HU-SL-016`, `HU-SL-019`; `Q-SL-03` |
| `Enunciado §2` "Cadê minha entrega?" | `despacho` | 1 de 1 | 2026-10-29 | `HU-SL-009`; `DIV-SL-10` |
| `Enunciado §8` Os quatro casos | transversal | 4 de 4 | 2026-10-29 | `00-visao-geral.md` §6 |
| `Encontro 1` Terceirização e retorno | `retorno-terceirizada` | 8 de 8 | 2026-10-29 | `RN-SL-019`, `RN-SL-028` a `RN-SL-031`; `DIV-SL-01`, `DIV-SL-06`, `DIV-SL-07` |
| `Encontro 1` WhatsApp e formulário | `entrada-pedidos` | 4 de 4 | 2026-10-29 | `RN-SL-002` a `RN-SL-006`, `RN-SL-014` |
| `Encontro 1` Restrições: custo, volume, mobile | transversal | 4 de 4 | 2026-10-29 | `DIV-SL-09`; `DEC-SL-13`; requisitos não funcionais |
| `Planejamento da equipe` RF-01 a RF-20, RNF, RN | transversal | 24 de 24 | 2026-10-29 | `DIV-SL-02`; [`requisitos`](../00-visao-geral/requisitos.md) |
| `Plano do agente` | `ocorrencias` | 6 de 6 | 2026-10-29 | `HU-SL-017`, `HU-SL-018`; `INT-004`; `DIV-SL-04`, `DIV-SL-08` |
| `Gargalos §1` a `§9` | transversal | 25 de 25 | 2026-10-29 | Coberto pelo enunciado, do qual o resumo deriva |

### Item a item: enunciado e reunião

| Ponto da origem | Resposta |
|---|---|
| Pedidos por um número de WhatsApp, em texto, áudio ou planilha (Enunciado §2) | `RN-SL-002`, `RN-SL-012`; `HU-SL-001`, `HU-SL-004` |
| Dados a conferir: destinatário, endereço completo, tamanho do volume, data (Enunciado §2) | `RN-SL-005`; `HU-SL-001` |
| Cerca de 1 em 5 incompletos; a atendente volta à loja e espera (Enunciado §2) | `RN-SL-006`, `RN-SL-012`; `HU-SL-001`, `HU-SL-004` |
| Prazo padrão: dia útil seguinte ou data agendada (Enunciado §2) | `RN-SL-009`; `Q-SL-01` |
| Analista copia para a planilha do dia; cópias divergem (Enunciado §2) | `RN-SL-001`, `RN-SL-020`; `HU-SL-009` |
| Coleta 14h–18h; loja leva ao galpão até 17h (Enunciado §2) | `RN-SL-025`; `Q-SL-02` |
| Etiquetas escritas à mão (Enunciado §2) | `RN-SL-027` |
| Rotas manuais; roteiro por WhatsApp (Enunciado §2) | Fora do escopo pela terceirização (`DIV-SL-01`) |
| Atualização em lote ou só no problema (Enunciado §2) | `RN-SL-034`, `RN-SL-035`; `HU-SL-013` |
| Volta ao galpão 17h–18h; coordenador decide sem regra (Enunciado §2) | `RN-SL-041`, `RN-SL-042`; `HU-SL-019`; `Q-SL-03`, `Q-SL-07` |
| Planilha fechada às 19h; financeiro calcula a cobrança (Enunciado §2) | `RN-SL-046`, `RN-SL-047`; `HU-SL-022` |
| "Cadê minha entrega?" em 5 saltos, 20 minutos a 2 horas (Enunciado §2) | `RN-SL-022`; `HU-SL-009`; `DIV-SL-10` |
| Terceirização: motorista e comunicação com ele são da terceirizada (Encontro 1 [13:15]) | `DIV-SL-01` |
| Solicitação vai à terceirizada da região (Encontro 1 [15:19]) | `RN-SL-017`, `RN-SL-023`; `HU-SL-010`, `HU-SL-011` |
| Sem fluxo quando dá errado (Encontro 1 [19:03]) | `RN-SL-039` a `RN-SL-042`; `FLX-SL-05`, `FLX-SL-06` |
| Terceirizados com pouca habilidade tecnológica (Encontro 1 [23:17]) | `RN-SL-029`; `HU-SL-014`, `HU-SL-015`; `DIV-SL-06` |
| Cerca de 400 entregas por dia no mês que vem (Encontro 1 [23:40]) | Requisitos não funcionais; `DIV-SL-09` |
| Confirmação com status e horário (Encontro 1 [25:39]) | `RN-SL-028`, `RN-SL-035` |
| Padrão único para as atuais e as futuras (Encontro 1 [27:54]) | `RN-SL-019` |
| Custo controlado (Encontro 1 [29:03], [30:33]) | `DIV-SL-09`; infraestrutura e custos |
| Pagamento às terceirizadas pelas entregas, com prova (Encontro 1 [38:44]) | `RN-SL-048`; `HU-SL-023` |
| Foto como prova padronizada (Encontro 1 [40:16], [42:33]) | `RN-SL-030`; `HU-SL-016`; `DIV-SL-07` |
| Vizinho ou porteiro só com autorização prévia (Encontro 1 [43:19]) | `RN-SL-013`, `RN-SL-031` |
| Painel interno: mobile ou web, a equipe justifica (Encontro 1 [45:49]) | `DEC-SL-13` |
| Pacote não entregue volta à SEALog (Encontro 1 [47:01]) | `RN-SL-041`; `HU-SL-019` |
