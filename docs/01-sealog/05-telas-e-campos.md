# SEALog — Telas e campos

Dezessete telas: a entrada no sistema, quatro da entrada de pedidos, cinco do registro e
planejamento, duas do aplicativo do motorista, o rastreio público, duas de exceções, a de
cobrança e a de exportação. As telas descrevem campos, ações e colunas, não o desenho: a interface
visual está fora do escopo (`00-visao-geral.md` §3).

Não há rota legada — hoje tudo acontece no WhatsApp e em planilhas —, e a linha **Rota legada**
diz onde aquilo é feito hoje. A **Rota proposta** é sugestão de endereço. A coluna **Origem no
banco** aponta o atributo da entidade em [`06-modelo-de-dados.md`](06-modelo-de-dados.md). Tamanhos
e máscaras são proposta desta documentação; os dados obrigatórios do pedido estão para confirmação
(`Q-SL-03`).

---

## Acesso

### TL-SL-001 — Entrada no sistema

| | |
|---|---|
| **Rota legada** | — (não há sistema hoje) |
| **Rota proposta** | `/entrar` |
| **Perfis** | Público; leva ao menu do perfil |
| **HUs** | `HU-SL-024` |

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `usuario` | Usuário | text | texto | 60 | Sim | — | — | `Usuario.usuario` | — |
| `senha` | Senha | password | texto | 64 | Sim | — | — | `Usuario.senha_hash` | Nunca exibida; guardada só como hash |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Entrar | botão | Toda a equipe | Erro sem dizer qual campo errou (`MSG-SL-024`); certo leva ao menu do perfil |

**Referências** — `RN-SL-049`, `RN-SL-051`.

---

## Entrada de pedidos

### TL-SL-002 — Novo pedido

| | |
|---|---|
| **Rota legada** | Hoje: conversa de WhatsApp ou Instagram copiada para a planilha |
| **Rota proposta** | `/pedidos/novo` e `/pedidos/{codigo}` (edição) |
| **Perfis** | Atendente, Analista, Coordenador |
| **HUs** | `HU-SL-001`, `HU-SL-004` |

Formulário único para qualquer pedido que chegue por mensagem, áudio ou planilha fora do modelo. Os
campos obrigatórios em falta são apontados um a um; "Gravar como pendente" aceita o pedido
incompleto.

#### Cliente e canal

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `cliente_id` | Cliente | lista com busca | inteiro | — | Sim | — | cliente cadastrado e ativo | `Entrega.cliente_id` | Busca por nome ou telefone; "Novo cliente" cadastra na hora |
| `canal_origem` | Canal | lista | texto | — | Sim | — | um dos valores de `06` §3.2 | `Entrega.canal_origem` | Abre em WhatsApp |

#### Destinatário e endereço

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `nome_destinatario` | Nome do destinatário | text | texto | 120 | Sim | — | não vazio | `Entrega.nome_destinatario` | — |
| `telefone_destinatario` | Telefone do destinatário | text | texto | 11 | Sim | `(00) 00000-0000` | DDD e 10 ou 11 dígitos (`RN-SL-006`) | `Entrega.telefone_destinatario` | Guardado só com dígitos |
| `rua` | Rua | text | texto | 150 | Sim | — | não vazio | `Entrega.rua` | — |
| `numero` | Número | text | texto | 10 | Sim, salvo "Sem número" | — | obrigatório sem a marca `sem_numero` (`RN-SL-007`) | `Entrega.numero` | Texto, para aceitar "120A" |
| `sem_numero` | Sem número | checkbox | booleano | — | Não | — | marcado torna `ponto_referencia` obrigatório | `Entrega.sem_numero` | Desabilita `numero` |
| `complemento` | Complemento | text | texto | 80 | Não | — | — | `Entrega.complemento` | Apartamento, bloco, sala |
| `bairro` | Bairro | text | texto | 80 | Sim | — | não vazio | `Entrega.bairro` | Usado no agrupamento das rotas |
| `cidade` | Cidade | text | texto | 80 | Sim | — | não vazio | `Entrega.cidade` | Abre com a cidade mais usada pelo cliente |
| `ponto_referencia` | Ponto de referência | text | texto | 150 | Sim, com "Sem número" | — | obrigatório quando `sem_numero` | `Entrega.ponto_referencia` | — |

#### Entrega

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `data_desejada` | Data desejada | date | data | — | Sim | `dd/mm/aaaa` | hoje ou depois | `Entrega.data_desejada` | Depois do horário de corte, hoje não entra em rota (`RN-SL-010`) |
| `qtd_volumes` | Volumes | number | inteiro | — | Sim | — | 1 ou mais | `Entrega.qtd_volumes` | Abre em 1; define as etiquetas (`RN-SL-012`) |
| `observacoes` | Observações | textarea | texto | 500 | Não | — | — | `Entrega.observacoes` | Aparecem ao motorista |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Confirmar pedido | botão | Atendente, Analista, Coordenador | Só com todos os obrigatórios; confirma, gera o código e envia o link de rastreio (`MSG-SL-022`) |
| Gravar como pendente | botão | Atendente, Analista, Coordenador | Grava "Pendente de dados" com a lista do que falta (`MSG-SL-005`) |
| Enviar link de complemento | botão | Atendente, Analista, Coordenador | Só em pedido pendente; envia pelo WhatsApp |
| Enviar link de pedido ao cliente | botão | Atendente, Analista, Coordenador | Envia ao cliente o link de `TL-SL-003` |
| Cancelar | link | Atendente, Analista, Coordenador | Volta sem gravar |

**Referências** — Gargalos §1; `RN-SL-001` a `RN-SL-012`.

---

### TL-SL-003 — Pedido pelo link

| | |
|---|---|
| **Rota legada** | Hoje: mensagem livre no WhatsApp ou no Instagram |
| **Rota proposta** | `/p/{token_pedido}` (pedido novo) e `/p/{token_pedido}/{codigo}` (complemento) |
| **Perfis** | Cliente, sem login |
| **HUs** | `HU-SL-002`, `HU-SL-004` |

Abre no navegador do celular. Mostra o nome do cliente, já identificado pelo link. No complemento,
traz preenchido o que já foi informado e pede só o que falta.

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `nome_destinatario` | Para quem é a entrega? | text | texto | 120 | Sim | — | não vazio | `Entrega.nome_destinatario` | — |
| `telefone_destinatario` | Telefone de quem recebe | tel | texto | 11 | Sim | `(00) 00000-0000` | DDD e 10 ou 11 dígitos | `Entrega.telefone_destinatario` | Teclado numérico |
| `rua` | Rua | text | texto | 150 | Sim | — | não vazio | `Entrega.rua` | — |
| `numero` | Número | text | texto | 10 | Sim, salvo "Sem número" | — | como em `TL-SL-002` | `Entrega.numero` | — |
| `sem_numero` | O endereço não tem número | checkbox | booleano | — | Não | — | torna `ponto_referencia` obrigatório | `Entrega.sem_numero` | — |
| `complemento` | Complemento | text | texto | 80 | Não | — | — | `Entrega.complemento` | — |
| `bairro` | Bairro | text | texto | 80 | Sim | — | não vazio | `Entrega.bairro` | — |
| `cidade` | Cidade | text | texto | 80 | Sim | — | não vazio | `Entrega.cidade` | — |
| `ponto_referencia` | Ponto de referência | text | texto | 150 | Sim, com "Sem número" | — | — | `Entrega.ponto_referencia` | — |
| `data_desejada` | Para quando? | date | data | — | Sim | `dd/mm/aaaa` | hoje ou depois | `Entrega.data_desejada` | — |
| `qtd_volumes` | Quantos pacotes? | number | inteiro | — | Sim | — | 1 ou mais | `Entrega.qtd_volumes` | — |
| `observacoes` | Alguma observação? | textarea | texto | 500 | Não | — | — | `Entrega.observacoes` | — |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Enviar pedido | botão | Cliente | Só com todos os obrigatórios; confirma e envia código e rastreio pelo WhatsApp (`MSG-SL-022`) |
| Fazer outro pedido | link | Cliente | Depois do envio; abre o formulário vazio |

**Referências** — Gargalos §1, §9; `RN-SL-004`, `RN-SL-009`, `RN-SL-050`.

---

### TL-SL-004 — Importação de planilha

| | |
|---|---|
| **Rota legada** | Hoje: planilha própria do cliente, digitada à mão pelo analista |
| **Rota proposta** | `/pedidos/importar` |
| **Perfis** | Atendente, Analista, Coordenador |
| **HUs** | `HU-SL-003` |

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `cliente_id` | Cliente | lista com busca | inteiro | — | Sim | — | cliente cadastrado e ativo | `Importacao.cliente_id` | Todos os pedidos da planilha são deste cliente |
| `arquivo` | Planilha | arquivo | arquivo | Não informado na documentação de origem | Sim | — | `.xlsx` ou `.csv` no modelo do SEALog (`RN-SL-008`) | `Importacao.arquivo_nome` | Tamanho máximo a definir |

#### Colunas da planilha modelo

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| 1 | Destinatário | `Entrega.nome_destinatario` | Obrigatória |
| 2 | Telefone | `Entrega.telefone_destinatario` | Obrigatória |
| 3 | Rua | `Entrega.rua` | Obrigatória |
| 4 | Número | `Entrega.numero` | Obrigatória; "S/N" equivale a "Sem número" |
| 5 | Complemento | `Entrega.complemento` | — |
| 6 | Bairro | `Entrega.bairro` | Obrigatória |
| 7 | Cidade | `Entrega.cidade` | Obrigatória |
| 8 | Ponto de referência | `Entrega.ponto_referencia` | Obrigatória com "S/N" |
| 9 | Data desejada | `Entrega.data_desejada` | Obrigatória, `dd/mm/aaaa` |
| 10 | Volumes | `Entrega.qtd_volumes` | Obrigatória, 1 ou mais |
| 11 | Observações | `Entrega.observacoes` | — |

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Linha | Linha | número da linha na planilha | — |
| Destinatário | Destinatário | coluna 1 | — |
| Situação | Situação | resultado da validação | Confirmado, Pendente ou Possível repetição |
| O que falta | O que falta | validação | Lista dos campos em falta |
| Código | Código | `Entrega.codigo` | Só dos confirmados |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Baixar modelo | link | Atendente, Analista, Coordenador | Planilha vazia com as 11 colunas, para enviar ao cliente |
| Ver prévia | botão | Atendente, Analista, Coordenador | Valida sem gravar; arquivo fora do modelo dá `MSG-SL-008` |
| Importar | botão | Atendente, Analista, Coordenador | Grava todos; resumo em `MSG-SL-007` |

**Referências** — Gargalos §1; `RN-SL-008`.

---

### TL-SL-005 — Pendências de dados

| | |
|---|---|
| **Rota legada** | Hoje: conversa esperando a resposta do cliente, sem registro |
| **Rota proposta** | `/pedidos/pendentes` |
| **Perfis** | Atendente, Analista, Coordenador |
| **HUs** | `HU-SL-004` |

Lista dos pedidos "Pendente de dados", do mais antigo para o mais recente.

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Código | Código | `Entrega.codigo` | Abre `TL-SL-002` em edição |
| Cliente | Cliente | `Cliente.nome` | — |
| Destinatário | Destinatário | `Entrega.nome_destinatario` | Vazio se for o que falta |
| O que falta | O que falta | `Entrega.campos_pendentes` | — |
| Esperando há | Esperando há | `Entrega.criado_em` | Em horas e minutos |
| Último envio do link | Último envio do link | `Aviso.enviado_em` | — |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Reenviar link de complemento | botão por linha | Atendente, Analista, Coordenador | Envia pelo WhatsApp; fica no histórico |
| Completar | link por linha | Atendente, Analista, Coordenador | Abre `TL-SL-002` |
| Cancelar pedido | botão por linha | Analista, Coordenador | Pede motivo |

**Referências** — Gargalos §1; `RN-SL-003`, `RN-SL-009`.

---

## Registro e planejamento

### TL-SL-006 — Lista de entregas

| | |
|---|---|
| **Rota legada** | Hoje: planilha da operação, com cópias por analista |
| **Rota proposta** | `/entregas` |
| **Perfis** | Atendente, Analista, Coordenador, Financeiro |
| **HUs** | `HU-SL-005`, `HU-SL-017`, `HU-SL-023` |

#### Filtros

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `busca` | Buscar | text | texto | 120 | Não | — | — | `Entrega.codigo`, `Cliente.nome`, `Entrega.nome_destinatario`, `Entrega.telefone_destinatario`, `Entrega.bairro` | Acha por qualquer um dos cinco (`RN-SL-034`) |
| `status` | Status | lista, vários | texto | — | Não | — | valores de `06` §3.1 | `Entrega.status` | Vazio é todos |
| `data_prevista` | Data prevista | intervalo de datas | data | — | Não | `dd/mm/aaaa` | início antes do fim | `Entrega.data_prevista` | Abre em hoje |
| `cliente_id` | Cliente | lista com busca | inteiro | — | Não | — | — | `Entrega.cliente_id` | — |
| `bairro` | Bairro | lista com busca | texto | — | Não | — | — | `Entrega.bairro` | — |
| `motorista_id` | Motorista | lista | inteiro | — | Não | — | — | `Rota.motorista_id` | — |

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Código | Código | `Entrega.codigo` | Abre `TL-SL-007` |
| Cliente | Cliente | `Cliente.nome` | — |
| Destinatário | Destinatário | `Entrega.nome_destinatario` | — |
| Bairro | Bairro | `Entrega.bairro` | — |
| Data prevista | Data prevista | `Entrega.data_prevista` | — |
| Status | Status | `Entrega.status` | — |
| Motorista | Motorista | `Usuario.nome` da rota | Vazio fora de rota |
| Último registro | Último registro | `Entrega.atualizado_em` | Data e hora (`RN-SL-035`) |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Filtrar e ordenar | filtros e cabeçalho das colunas | Atendente, Analista, Coordenador, Financeiro | Sem resultado, `MSG-SL-027` |
| Abrir entrega | clique na linha | Atendente, Analista, Coordenador, Financeiro | Abre `TL-SL-007` |
| Novo pedido | botão | Atendente, Analista, Coordenador | Abre `TL-SL-002` |
| Imprimir etiquetas das selecionadas | botão | Analista, Coordenador | Abre `TL-SL-008` |
| Exportar | botão | Atendente, Analista, Coordenador, Financeiro | Abre `TL-SL-017` com os filtros da tela |

**Referências** — Gargalos §2, §4; `RN-SL-013`, `RN-SL-034`, `RN-SL-035`, `RN-SL-048`.

---

### TL-SL-007 — Detalhe da entrega

| | |
|---|---|
| **Rota legada** | Hoje: linha da planilha, mensagens no grupo e foto solta |
| **Rota proposta** | `/entregas/{codigo}` |
| **Perfis** | Atendente, Analista, Coordenador, Financeiro |
| **HUs** | `HU-SL-005`, `HU-SL-006`, `HU-SL-017`, `HU-SL-019` |

Tudo sobre uma entrega, numa página. Os dados do pedido são os de `TL-SL-002`, editáveis por quem
pode corrigir; os blocos abaixo são só leitura.

#### Blocos da página

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Situação | Status atual e último registro | `Entrega.status`, `Entrega.atualizado_em` | — |
| Rota | Motorista, rota e posição | `Rota`, `Parada.ordem_planejada` | Só quando em rota |
| Volumes | Volumes | `Volume` | Etiqueta impressa e recebimento no galpão, por volume |
| Comprovante | Comprovante | `Comprovante.foto`, `Comprovante.recebedor_nome` | Só depois de entregue |
| Ocorrências | Ocorrências | `Ocorrencia` | Motivo, foto, decisão, quem decidiu |
| Avisos | Avisos ao cliente | `Aviso` | Texto, hora, canal e resultado |
| Histórico | Histórico | `EventoEntrega` | Toda mudança, com autor, hora do fato e valor anterior |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Corrigir dados | botão | Analista, Coordenador; Atendente só antes de confirmada | A correção vai ao histórico (`RN-SL-013`) |
| Imprimir etiquetas | botão | Analista, Coordenador | Abre `TL-SL-008` |
| Reenviar link de rastreio | botão | Atendente, Analista, Coordenador | Envia pelo WhatsApp |
| Decidir ocorrência | botão | Coordenador | Só com ocorrência aberta; mesmo diálogo de `TL-SL-014` |

**Referências** — Gargalos §2, §3, §4; `RN-SL-013`, `RN-SL-034`.

---

### TL-SL-008 — Etiqueta do pacote

| | |
|---|---|
| **Rota legada** | Hoje: etiqueta escrita à mão |
| **Rota proposta** | `/etiquetas?entregas={codigos}` |
| **Perfis** | Analista, Coordenador |
| **HUs** | `HU-SL-006` |

Uma etiqueta por volume, pronta para impressão.

#### Conteúdo

| Bloco | Texto | Links e contatos |
|---|---|---|
| Código | Código da entrega em texto grande e em código lido pela câmera | — |
| Destinatário | Nome do destinatário | — |
| Bairro | Bairro e cidade | — |
| Volume | "Volume N de M" | — |
| Remetente | Nome do cliente | — |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Imprimir | botão | Analista, Coordenador | Registra a impressão de cada volume no histórico |
| Imprimir prontas do dia | botão | Analista, Coordenador | Todas as entregas do dia ainda sem etiqueta |

**Referências** — Gargalos §2; `RN-SL-012`, `RN-SL-015`.

---

### TL-SL-009 — Coletas e recebimento no galpão

| | |
|---|---|
| **Rota legada** | Hoje: combinado por mensagem; chegada ao galpão sem registro |
| **Rota proposta** | `/galpao` |
| **Perfis** | Analista, Coordenador |
| **HUs** | `HU-SL-007` |

Duas partes: as coletas do dia, por horário, e o recebimento de pacotes.

#### Agendar coleta

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `entrega_id` | Pedido | lista com busca | inteiro | — | Sim | — | pedido confirmado sem coleta | `Coleta.entrega_id` | — |
| `data` | Data da coleta | date | data | — | Sim | `dd/mm/aaaa` | hoje ou depois | `Coleta.data` | — |
| `horario` | Horário | time | hora | — | Sim | `hh:mm` | entre 14:00 e 18:00 (`RN-SL-016`) | `Coleta.horario` | Fora da janela, `MSG-SL-009` |

#### Receber no galpão

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `codigo_lido` | Etiqueta ou código | leitura de câmera ou text | texto | 20 | Sim | — | código de entrega existente | `Volume.entrega_id` | Depois das 17h, `MSG-SL-010` |
| `volume` | Volume | lista | inteiro | — | Sim, se mais de um | — | volume ainda não recebido | `Volume.numero` | Preenchido pela leitura da etiqueta |

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Horário | Horário | `Coleta.horario` | Coletas do dia |
| Cliente | Cliente | `Cliente.nome` | — |
| Código | Código | `Entrega.codigo` | — |
| Volumes recebidos | Volumes recebidos | `Volume.recebido_galpao_em` | "1 de 2" |
| Situação | Situação | `Coleta.situacao` | Agendada, Realizada |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Agendar coleta | botão | Analista, Coordenador | — |
| Registrar recebimento | botão ou leitura | Analista, Coordenador | Muda a entrega para "No galpão" quando todos os volumes chegam |

**Referências** — Gargalos §2; `RN-SL-016`, `RN-SL-017`.

---

### TL-SL-010 — Rotas do dia

| | |
|---|---|
| **Rota legada** | Hoje: rota na cabeça do coordenador, roteiro mandado por WhatsApp |
| **Rota proposta** | `/rotas?data={data}` |
| **Perfis** | Coordenador; Analista só leitura |
| **HUs** | `HU-SL-008`, `HU-SL-009`, `HU-SL-010` |

À esquerda, as entregas prontas agrupadas por bairro; à direita, as rotas do dia, uma por
motorista. Durante o dia, cada rota mostra o andamento.

#### Montagem

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `data` | Data | date | data | — | Sim | `dd/mm/aaaa` | — | `Rota.data` | Abre em hoje |
| `motorista_id` | Motorista | lista | inteiro | — | Sim | — | motorista ativo, sem outra rota no dia | `Rota.motorista_id` | — |
| `entregas` | Entregas | seleção múltipla | lista | — | Sim | — | só prontas: etiquetadas e no galpão; em no máximo uma rota (`RN-SL-019`) | `Parada.entrega_id` | — |
| `ordem_planejada` | Ordem | arrastar | inteiro | — | Sim | — | sequencial a partir de 1 | `Parada.ordem_planejada` | — |
| `motivo` | Motivo | text | texto | 200 | Sim, ao alterar rota publicada | — | não vazio | `EventoEntrega.motivo` | — |

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Motorista | Motorista | `Usuario.nome` | — |
| Paradas | Paradas | `Parada` | Total |
| Entregues | Entregues | `Parada.situacao` | — |
| Não entregues | Não entregues | `Parada.situacao` | Em destaque |
| Pendentes | Pendentes | `Parada.situacao` | — |
| Último registro | Último registro | `EventoEntrega.ocorrido_em` | Sinalizada além do limite de `Q-SL-06` |
| Situação | Situação | `Rota.situacao` | Rascunho, Publicada, Concluída |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Criar rota | botão | Coordenador | — |
| Incluir e ordenar entregas | arrastar | Coordenador | Entrega não pronta, `MSG-SL-012` ou `MSG-SL-013` |
| Publicar rota | botão | Coordenador | Envia o roteiro ao celular |
| Publicar todas | botão | Coordenador | — |
| Remanejar entrega | arrastar entre rotas | Coordenador | Exige motivo; os dois motoristas recebem `MSG-SL-017` |
| Abrir rota | clique | Coordenador, Analista | Paradas, status e hora de cada registro |

**Referências** — Gargalos §2, §3; `RN-SL-018` a `RN-SL-024`.

---

## Execução do motorista

### TL-SL-011 — Roteiro do motorista

| | |
|---|---|
| **Rota legada** | Hoje: mensagem de WhatsApp do coordenador |
| **Rota proposta** | `/motorista` (aplicativo no celular) |
| **Perfis** | Motorista |
| **HUs** | `HU-SL-009`, `HU-SL-011`, `HU-SL-015` |

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Ordem | Ordem | `Parada.ordem_planejada` | — |
| Destinatário | Destinatário | `Entrega.nome_destinatario` | — |
| Endereço | Endereço | `Entrega.rua`, `numero`, `complemento`, `bairro`, `cidade` | Toque abre o aplicativo de mapas |
| Referência | Ponto de referência | `Entrega.ponto_referencia` | — |
| Telefone | Telefone | `Entrega.telefone_destinatario` | Toque abre a discagem |
| Volumes | Volumes | `Entrega.qtd_volumes` | — |
| Observações | Observações | `Entrega.observacoes` | — |
| Situação | Situação | `Parada.situacao` | Pendente, Entregue, Não entregue |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Abrir parada | toque ou leitura da etiqueta | Motorista | Abre `TL-SL-012`; etiqueta de outra rota, `MSG-SL-011` |
| Ver atualização | aviso no topo | Motorista | `MSG-SL-017`, com o que mudou em destaque |
| Envios pendentes | contador | Motorista | Sem sinal, `MSG-SL-016` |

**Referências** — Gargalos §2, §3; `RN-SL-020`, `RN-SL-025`, `RN-SL-030`.

---

### TL-SL-012 — Registro da parada

| | |
|---|---|
| **Rota legada** | Hoje: mensagem e foto soltas no grupo de WhatsApp |
| **Rota proposta** | `/motorista/parada/{codigo}` |
| **Perfis** | Motorista |
| **HUs** | `HU-SL-012`, `HU-SL-013`, `HU-SL-014`, `HU-SL-015` |

Dois caminhos a partir de dois botões grandes: Entregue e Não entregue. Nenhum texto obrigatório,
exceto o motivo "Outro".

#### Entregue

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `foto` | Foto do comprovante | câmera | imagem | Não informado na documentação de origem | Sim | — | tirada na hora; sem galeria (`RN-SL-028`) | `Comprovante.foto` | Sem foto, `MSG-SL-014` |
| `recebedor_e_destinatario` | Quem recebeu | botão "o próprio destinatário" | booleano | — | Sim | — | — | `Comprovante.recebedor_e_destinatario` | — |
| `recebedor_nome` | Nome de quem recebeu | text | texto | 120 | Sim, se não for o destinatário | — | não vazio | `Comprovante.recebedor_nome` | Porteiro, vizinho |

#### Não entregue

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `motivo` | Motivo | botões | texto | — | Sim | — | um dos valores de `06` §3.3 | `Ocorrencia.motivo` | Sem motivo, `MSG-SL-015` |
| `foto` | Foto | câmera | imagem | Não informado na documentação de origem | Não | — | — | `Ocorrencia.foto` | — |
| `observacao` | Observação | textarea | texto | 300 | Sim, com "Outro" | — | — | `Ocorrencia.observacao` | — |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Entregue | botão | Motorista | Abre a câmera |
| Não entregue | botão | Motorista | Abre os motivos |
| Concluir | botão | Motorista | Grava com a hora do fato; sem sinal, guarda no celular (`RN-SL-030`) |

**Referências** — Gargalos §3; `RN-SL-026` a `RN-SL-031`.

---

## Consulta de status

### TL-SL-013 — Rastreio da entrega

| | |
|---|---|
| **Rota legada** | Hoje: pergunta à atendente, cadeia de 5 saltos |
| **Rota proposta** | `/r/{token_rastreio}` |
| **Perfis** | Cliente, sem login |
| **HUs** | `HU-SL-016` |

Só leitura. Link inválido mostra `MSG-SL-021`, sem nenhum dado.

#### Conteúdo

| Bloco | Texto | Links e contatos |
|---|---|---|
| Situação | Status atual, com a data e a hora do último registro | — |
| Entrega | Código, destinatário, bairro e data prevista | — |
| Histórico | Cada mudança de status, com data e hora | — |
| Comprovante | Foto e nome de quem recebeu, depois da entrega | — |
| Ocorrência | Motivo e decisão, quando houver | — |
| Contato | Horário do atendimento | WhatsApp da SEALog |

**Referências** — Gargalos §4, §9; `RN-SL-032`, `RN-SL-033`, `RN-SL-035`.

---

## Exceções e decisões

### TL-SL-014 — Painel de exceções

| | |
|---|---|
| **Rota legada** | Hoje: mensagens no grupo dos motoristas |
| **Rota proposta** | `/excecoes` |
| **Perfis** | Coordenador; Atendente e Analista só leitura |
| **HUs** | `HU-SL-018`, `HU-SL-019`, `HU-SL-020` |

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Hora | Registrada em | `Ocorrencia.ocorrido_em` | Mais antiga primeiro |
| Entrega | Código | `Entrega.codigo` | Abre `TL-SL-007` |
| Cliente | Cliente | `Cliente.nome` | — |
| Motivo | Motivo | `Ocorrencia.motivo` | — |
| Motorista | Motorista | `Usuario.nome` | — |
| Aviso | Aviso ao cliente | `Aviso.resultado` | Enviado ou Falhou |
| Prazo | Prazo | `Ocorrencia.ocorrido_em` | Destaque depois das 19h (`RN-SL-038`) |

#### Decisão

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `decisao` | Decisão | botões | texto | — | Sim | — | um dos valores de `06` §3.4 | `Ocorrencia.decisao` | — |
| `data_nova_tentativa` | Nova data | date | data | — | Sim, em nova tentativa | `dd/mm/aaaa` | depois de hoje | `Ocorrencia.data_nova_tentativa` | Limite de tentativas em `Q-SL-07` |
| `decisao_motivo` | Motivo | text | texto | 200 | Sim | — | não vazio | `Ocorrencia.decisao_motivo` | — |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Decidir | botão por linha | Coordenador | Grava e envia o aviso da decisão (`MSG-SL-019`) |
| Reenviar aviso | botão por linha | Coordenador, Atendente, Analista | Só em aviso que falhou (`MSG-SL-023`) |
| Ver afetados por cliente | link | Coordenador, Atendente, Analista | Abre `TL-SL-015` |

**Referências** — Gargalos §5, §7; `RN-SL-036` a `RN-SL-040`, `RN-SL-043`.

---

### TL-SL-015 — Entregas afetadas por cliente

| | |
|---|---|
| **Rota legada** | Hoje: não existe; dezenas de mensagens respondidas uma a uma |
| **Rota proposta** | `/excecoes/afetados` |
| **Perfis** | Coordenador, Atendente, Analista, Financeiro |
| **HUs** | `HU-SL-020`, `HU-SL-021`, `HU-SL-023` |

#### Filtros

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `periodo` | Período | intervalo de datas | data | — | Sim | `dd/mm/aaaa` | início antes do fim | `Entrega.data_prevista` | Abre em hoje |
| `motivo` | Motivo | lista, vários | texto | — | Não | — | valores de `06` §3.3 | `Ocorrencia.motivo` | Inclui "Atrasada sem ocorrência" |
| `bairro` | Bairro | lista com busca | texto | — | Não | — | — | `Entrega.bairro` | — |
| `motorista_id` | Motorista | lista | inteiro | — | Não | — | — | `Rota.motorista_id` | — |

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Cliente | Cliente | `Cliente.nome` | Uma linha por cliente, expansível |
| Afetadas | Entregas afetadas | contagem | — |
| Entregas | Entregas | `Entrega.codigo`, `nome_destinatario`, `status` | Ao expandir |
| Último aviso | Último aviso | `Aviso.enviado_em` | — |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Selecionar clientes | checkbox por linha | Coordenador, Atendente, Analista | — |
| Avisar selecionados | botão | Coordenador, Atendente, Analista | Uma mensagem por cliente (`MSG-SL-020`) |
| Exportar | botão | Coordenador, Atendente, Analista, Financeiro | Abre `TL-SL-017` |

**Referências** — Gargalos §5, §7; `RN-SL-041`, `RN-SL-042`.

---

## Financeiro

### TL-SL-016 — Fechamento de cobrança

| | |
|---|---|
| **Rota legada** | Hoje: planilhas manuais do financeiro |
| **Rota proposta** | `/financeiro/fechamentos` e `/financeiro/fechamentos/{id}` |
| **Perfis** | Financeiro |
| **HUs** | `HU-SL-022`, `HU-SL-023` |

#### Gerar

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `periodo_inicio` | De | date | data | — | Sim | `dd/mm/aaaa` | — | `Fechamento.periodo_inicio` | — |
| `periodo_fim` | Até | date | data | — | Sim | `dd/mm/aaaa` | depois do início | `Fechamento.periodo_fim` | — |
| `cliente_id` | Cliente | lista com busca | inteiro | — | Não | — | — | `Fechamento.cliente_id` | Vazio gera para todos |

#### Ajuste

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `valor` | Valor | number | decimal | 10,2 | Sim | `R$ 0,00` | diferente de zero | `ItemFechamento.valor` | Negativo é desconto |
| `motivo_ajuste` | Motivo | text | texto | 200 | Sim | — | não vazio | `ItemFechamento.motivo_ajuste` | — |

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Código | Código | `Entrega.codigo` | — |
| Data | Data | data do status final | — |
| Destinatário | Destinatário | `Entrega.nome_destinatario` | — |
| Bairro | Bairro | `Entrega.bairro` | — |
| Status final | Status final | `Entrega.status` | — |
| Valor | Valor | `ItemFechamento.valor` | Tabela de preços em `Q-SL-09` |
| Total | Total | `Fechamento.total` | Linhas mais ajustes |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Gerar fechamentos | botão | Financeiro | Um por cliente |
| Enviar para conferência | botão | Financeiro | — |
| Fechar | botão | Financeiro | Depois de fechado, não muda (`MSG-SL-026`) |
| Lançar ajuste | botão | Financeiro | Entra no fechamento seguinte do cliente |
| Exportar | botão | Financeiro | Abre `TL-SL-017` |

**Referências** — Gargalos §6; `RN-SL-044` a `RN-SL-047`.

---

### TL-SL-017 — Exportação para planilha

| | |
|---|---|
| **Rota legada** | Hoje: a própria planilha |
| **Rota proposta** | Diálogo aberto nas telas `TL-SL-006`, `TL-SL-015` e `TL-SL-016` |
| **Perfis** | Atendente, Analista, Coordenador, Financeiro |
| **HUs** | `HU-SL-023` |

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `formato` | Formato | opções | texto | — | Sim | — | `.xlsx` ou `.csv` | — | Abre em `.xlsx` |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Exportar | botão | Quem vê a tela de origem | Mesmas colunas e filtros; data e hora no nome do arquivo; lista vazia não exporta (`MSG-SL-027`) |

**Referências** — Gargalos §9; `RN-SL-048`.
