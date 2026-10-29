# SEALog — Telas e campos

Dezessete telas: a entrada no painel, três da entrada de pedidos (duas delas na conversa do
WhatsApp), três de cadastros, duas do despacho, duas do retorno da terceirizada, quatro de
ocorrências e devoluções e duas do financeiro. As telas descrevem campos, ações e colunas, não o
desenho: o desenho das telas é da equipe de UX e não está fixado aqui.

Não há rota legada — hoje tudo acontece no WhatsApp e na planilha online do dia —, e a linha
**Rota legada** diz onde aquilo é feito hoje. A **Rota proposta** é sugestão de endereço; nas telas
do WhatsApp, diz que a interação acontece na própria conversa. A coluna **Origem no banco** aponta o
atributo da entidade em [`06-modelo-de-dados.md`](06-modelo-de-dados.md). Tamanhos e máscaras são
proposta desta documentação; os dados obrigatórios do pedido vêm do enunciado (`RN-SL-005`).

O motorista é da terceirizada, e o SEALog não tem tela para ele (`DIV-SL-01`). A terceirizada usa
a API padrão (`INT-002`), o portal (`TL-SL-010`) ou a planilha (`TL-SL-011`).

---

## Acesso

### TL-SL-001 — Entrada no painel

| | |
|---|---|
| **Rota legada** | — (não há sistema hoje) |
| **Rota proposta** | `/entrar` |
| **Perfis** | Público; leva ao menu do perfil (Atendente, Coordenador, Financeiro, Terceirizada) |
| **HUs** | `HU-SL-024` |

A mesma entrada serve à equipe da SEALog e às pessoas da terceirizada que usam o portal. O perfil
decide para onde a pessoa vai depois de entrar.

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `usuario` | Usuário | text | texto | 60 | Sim | — | — | `Usuario.usuario` | — |
| `senha` | Senha | password | texto | 64 | Sim | — | — | `Usuario.senha_hash` | Nunca exibida; guardada só como hash |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Entrar | botão | Equipe e terceirizada | Erro sem dizer qual campo errou (`MSG-SL-029`); na quinta tentativa seguida sem sucesso, bloqueia (`MSG-SL-030`, `RN-SL-052`, `Q-SL-17`); certo leva ao menu do perfil, e a terceirizada ao portal (`TL-SL-010`) |

**Referências** — `RN-SL-051` a `RN-SL-053`; Planejamento da equipe (RNF-01).

---

## Entrada de pedidos

### TL-SL-002 — Conversa do WhatsApp: menu, acompanhar e relato

| | |
|---|---|
| **Rota legada** | Hoje: conversa livre com o número do atendimento, em texto, áudio ou planilha |
| **Rota proposta** | — (conversa no WhatsApp) |
| **Perfis** | Loja, pelo número autorizado |
| **HUs** | `HU-SL-001`, `HU-SL-002`, `HU-SL-003`, `HU-SL-017` |

A loja manda qualquer mensagem ao número da SEALog. Se o número for autorizado, recebe o menu de
três botões; se não for, recebe a orientação do atendimento e nada é registrado (`RN-SL-003`). O
relato de problema não é um quarto botão: ele sai do resultado do acompanhamento (`RN-SL-004`), e a
conversa passa ao agente de ocorrências.

#### Menu

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `numero_origem` | — | identificação automática | texto | 13 | Sim | — | número autorizado de loja ativa (`RN-SL-003`) | `NumeroAutorizado.telefone_whatsapp` | Não aparece à loja; fora do cadastro, `MSG-SL-002` |
| `opcao_menu` | O que você quer fazer? | botão de resposta | texto | — | Sim | — | Novo pedido, Acompanhar pedido ou Editar pedido | — | `MSG-SL-001` |

#### Acompanhar e editar

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `codigo` | Código do pedido | lista ou campo de texto do formulário | texto | 12 | Sim | — | pedido da mesma loja (`RN-SL-054`) | `Entrega.codigo` | A lista traz os pedidos abertos da loja; código de outra loja ou inexistente, `MSG-SL-009` |

#### Relato de problema

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `tipo` | O que aconteceu? | conversa com o agente | texto | — | Sim | — | um dos valores de `06` §3.4 | `Chamado.tipo` | O agente classifica pelo relato e confirma com a loja |
| `descricao` | Conte o que aconteceu | conversa com o agente | texto | 1000 | Sim | — | não vazio | `Chamado.descricao` | Texto ou áudio; o agente transcreve e resume |
| `fotos` | Foto | anexo de imagem | lista de texto | — | Sim, em avaria | — | imagem | `Chamado.fotos` | O agente pede a foto quando o tipo é Avaria (`RN-SL-036`) |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Novo pedido | botão de resposta | Loja | Abre o formulário de `TL-SL-003` |
| Acompanhar pedido | botão de resposta | Loja | Mostra status, data e hora do último registro (`MSG-SL-008`) |
| Editar pedido | botão de resposta | Loja | Abre `TL-SL-003` com os dados do pedido; depois da coleta, `MSG-SL-010` (`RN-SL-011`, `Q-SL-04`) |
| Cancelar pedido | botão de resposta, dentro de Editar | Loja | Só até a coleta; confirma com `MSG-SL-011` |
| Relatar problema | botão de resposta, no resultado do acompanhamento | Loja | Passa a conversa ao agente de ocorrências; termina com `MSG-SL-025` e abre o chamado (`RN-SL-039`) |

**Referências** — Encontro 1 [07:35], [08:38], [14:33]; Plano do agente; `RN-SL-002` a `RN-SL-004`,
`RN-SL-011`, `RN-SL-036` a `RN-SL-038`, `RN-SL-054`.

---

### TL-SL-003 — Formulário de pedido no WhatsApp

| | |
|---|---|
| **Rota legada** | Hoje: mensagem livre no WhatsApp, conferida à mão pela atendente |
| **Rota proposta** | — (formulário do WhatsApp, dentro da conversa) |
| **Perfis** | Loja, pelo número autorizado |
| **HUs** | `HU-SL-001`, `HU-SL-003`, `HU-SL-004` |

O formulário abre dentro da conversa, sem aplicativo e sem conta. Não envia sem os dados
obrigatórios (`RN-SL-006`). O mesmo formulário serve à edição, com os dados do pedido preenchidos,
e ao complemento do pedido pendente registrado pela equipe, pedindo só o que falta.

#### Destinatário

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `nome_destinatario` | Nome de quem recebe | campo de texto do formulário | texto | 120 | Sim | — | não vazio (`MSG-SL-005`) | `Entrega.nome_destinatario` | — |
| `telefone_destinatario` | Telefone de quem recebe | campo de texto do formulário | texto | 11 | Sim | `(00) 00000-0000` | DDD e 10 ou 11 dígitos (`RN-SL-007`, `MSG-SL-004`) | `Entrega.telefone_destinatario` | Guardado só com dígitos |

#### Endereço

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `rua` | Rua | campo de texto do formulário | texto | 150 | Sim | — | não vazio (`MSG-SL-005`) | `Entrega.rua` | — |
| `numero` | Número | campo de texto do formulário | texto | 10 | Sim, salvo "Sem número" | — | obrigatório sem a marca (`RN-SL-008`, `MSG-SL-003`) | `Entrega.numero` | Texto, para aceitar "120A" |
| `sem_numero` | Sem número | caixa de marcação | booleano | — | Não | — | marcada torna o ponto de referência obrigatório | `Entrega.sem_numero` | Caso do Sr. Paulo (Enunciado §8) |
| `complemento` | Complemento | campo de texto do formulário | texto | 80 | Sim, salvo "Sem complemento" | — | obrigatório sem a marca (`MSG-SL-005`) | `Entrega.complemento` | Apartamento, bloco, sala |
| `sem_complemento` | Sem complemento | caixa de marcação | booleano | — | Não | — | — | `Entrega.sem_complemento` | — |
| `bairro` | Bairro | campo de texto do formulário | texto | 80 | Sim | — | não vazio | `Entrega.bairro` | Define a terceirizada pela tabela de regiões (`RN-SL-023`) |
| `cidade` | Cidade | lista | texto | 80 | Sim | — | não vazio | `Entrega.cidade` | Abre com a cidade da loja |
| `ponto_referencia` | Ponto de referência | campo de texto do formulário | texto | 150 | Sim, com "Sem número" | — | obrigatório quando `sem_numero` (`MSG-SL-005`) | `Entrega.ponto_referencia` | — |

#### Entrega

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `tamanho_volume` | Tamanho do volume | lista | texto | — | Sim | — | um dos valores de `06` §3.5 | `Entrega.tamanho_volume` | Pequeno, Médio, Grande |
| `qtd_volumes` | Quantos volumes | campo numérico do formulário | inteiro | — | Sim | — | 1 ou mais | `Entrega.qtd_volumes` | Abre em 1 |
| `data_desejada` | Data de entrega | seletor de data | data | — | Não | `dd/mm/aaaa` | dia útil seguinte ou depois | `Entrega.data_desejada` | Vazio vale o prazo padrão, o dia útil seguinte (`RN-SL-009`); horário de corte em `Q-SL-01` |
| `autorizados_receber` | Quem mais pode receber | campo de texto do formulário | texto | 200 | Não | — | — | `Entrega.autorizados_receber` | Vizinho, porteiro ou outra pessoa, com o nome (`RN-SL-013`); caso "deixar com Dona Lúcia" |
| `observacoes` | Observações | campo de texto longo do formulário | texto | 500 | Não | — | — | `Entrega.observacoes` | Vão à terceirizada |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Enviar pedido | botão do formulário | Loja | Só com todos os obrigatórios; pedido igual pede confirmação (`MSG-SL-006`, `RN-SL-010`); recebido, `MSG-SL-007` |
| Salvar alteração | botão do formulário | Loja | Só na edição, até a coleta; confirma com `MSG-SL-011` e avisa a terceirizada se já despachado (`RN-SL-026`) |
| Completar pedido | botão do formulário | Loja | Só no pedido pendente; pede só os campos de `Entrega.campos_pendentes` (`MSG-SL-013`) |

**Referências** — Enunciado §2, §8; Encontro 1 [07:35], [35:39], [43:19]; `RN-SL-005` a
`RN-SL-011`, `RN-SL-013`.

---

### TL-SL-004 — Novo pedido pela equipe

| | |
|---|---|
| **Rota legada** | Hoje: conversa de WhatsApp copiada pelo analista para a planilha online do dia |
| **Rota proposta** | `/pedidos/novo` e `/pedidos/{codigo}` (edição) |
| **Perfis** | Atendente, Coordenador |
| **HUs** | `HU-SL-004` |

Para o pedido que chega fora do formulário: áudio, mensagem livre ou ligação. Tem os mesmos campos
e validações de `TL-SL-003`, mais a loja e o canal. "Gravar como pendente" aceita o pedido
incompleto e manda à loja o formulário para completar. A planilha da loja entra por `TL-SL-011`.

#### Loja e canal

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `loja_id` | Loja | lista com busca | inteiro | — | Sim | — | loja cadastrada e ativa (`RN-SL-014`) | `Entrega.loja_id` | Busca por nome, documento ou número autorizado |
| `canal_origem` | Canal | lista | texto | — | Sim | — | Equipe ou Planilha (`06` §3.2) | `Entrega.canal_origem` | Abre em Equipe |

#### Destinatário e endereço

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `nome_destinatario` | Nome do destinatário | text | texto | 120 | Para confirmar | — | não vazio | `Entrega.nome_destinatario` | — |
| `telefone_destinatario` | Telefone do destinatário | text | texto | 11 | Para confirmar | `(00) 00000-0000` | DDD e 10 ou 11 dígitos (`MSG-SL-004`) | `Entrega.telefone_destinatario` | — |
| `rua` | Rua | text | texto | 150 | Para confirmar | — | não vazio | `Entrega.rua` | — |
| `numero` | Número | text | texto | 10 | Para confirmar, salvo "Sem número" | — | `MSG-SL-003` | `Entrega.numero` | — |
| `sem_numero` | Sem número | caixa de marcação | booleano | — | Não | — | torna o ponto de referência obrigatório | `Entrega.sem_numero` | — |
| `complemento` | Complemento | text | texto | 80 | Para confirmar, salvo "Sem complemento" | — | — | `Entrega.complemento` | — |
| `sem_complemento` | Sem complemento | caixa de marcação | booleano | — | Não | — | — | `Entrega.sem_complemento` | — |
| `bairro` | Bairro | text | texto | 80 | Para confirmar | — | não vazio | `Entrega.bairro` | — |
| `cidade` | Cidade | text | texto | 80 | Para confirmar | — | não vazio | `Entrega.cidade` | — |
| `ponto_referencia` | Ponto de referência | text | texto | 150 | Com "Sem número" | — | — | `Entrega.ponto_referencia` | — |

#### Entrega

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `tamanho_volume` | Tamanho do volume | lista | texto | — | Para confirmar | — | `06` §3.5 | `Entrega.tamanho_volume` | — |
| `qtd_volumes` | Volumes | number | inteiro | — | Sim | — | 1 ou mais | `Entrega.qtd_volumes` | — |
| `data_desejada` | Data desejada | date | data | — | Não | `dd/mm/aaaa` | dia útil seguinte ou depois | `Entrega.data_desejada` | Vazio vale o prazo padrão (`RN-SL-009`) |
| `autorizados_receber` | Quem mais pode receber | text | texto | 200 | Não | — | — | `Entrega.autorizados_receber` | Só com autorização da loja (`RN-SL-013`) |
| `observacoes` | Observações | textarea | texto | 500 | Não | — | — | `Entrega.observacoes` | — |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Confirmar pedido | botão | Atendente, Coordenador | Só com todos os obrigatórios; gera o código e avisa a loja (`MSG-SL-007`); pedido igual pede confirmação (`MSG-SL-006`) |
| Gravar como pendente | botão | Atendente, Coordenador | Grava "Pendente de dados" (`MSG-SL-012`) e envia à loja o formulário para completar (`MSG-SL-013`) |
| Reenviar pedido para completar | botão | Atendente, Coordenador | Só em pedido pendente |
| Importar planilha da loja | link | Atendente, Coordenador | Abre `TL-SL-011` |
| Cancelar | link | Atendente, Coordenador | Volta sem gravar |

**Referências** — Enunciado §2; `RN-SL-005`, `RN-SL-007`, `RN-SL-008`, `RN-SL-010`, `RN-SL-012`.

---

## Cadastros

### TL-SL-005 — Lojas e números autorizados

| | |
|---|---|
| **Rota legada** | Hoje: contatos salvos no celular do atendimento e dados soltos nas planilhas |
| **Rota proposta** | `/lojas` e `/lojas/{id}` |
| **Perfis** | Coordenador; Atendente edita só os dados comerciais |
| **HUs** | `HU-SL-005`, `HU-SL-006` |

A lista de lojas leva ao cadastro de cada uma, com os dados comerciais e os números de WhatsApp que
podem pedir em nome dela.

#### Dados da loja

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `nome` | Nome da loja | text | texto | 120 | Sim | — | não vazio | `Loja.nome` | — |
| `documento` | CNPJ ou CPF | text | texto | 14 | Sim | `00.000.000/0000-00` ou `000.000.000-00` | dígito verificador | `Loja.documento` | Guardado só com dígitos |
| `endereco_coleta` | Endereço de coleta | text | texto | 250 | Sim | — | não vazio | `Loja.endereco_coleta` | Vai no despacho (`RN-SL-024`) |
| `bairro_coleta` | Bairro de coleta | text | texto | 80 | Sim | — | — | `Loja.bairro_coleta` | — |
| `cidade_coleta` | Cidade de coleta | text | texto | 80 | Sim | — | — | `Loja.cidade_coleta` | — |
| `contato_nome` | Responsável | text | texto | 120 | Sim | — | — | `Loja.contato_nome` | — |
| `condicao_cobranca` | Condição de cobrança | text | texto | 200 | Não | — | — | `Loja.condicao_cobranca` | Tabela de preços em `Q-SL-08` |
| `ativa` | Ativa | caixa de marcação | booleano | — | Sim | — | — | `Loja.ativa` | Inativa não faz pedido novo (`RN-SL-014`) |

#### Números autorizados

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `telefone_whatsapp` | Número de WhatsApp | text, uma linha por número | texto | 13 | Sim, ao menos um | `+55 (00) 00000-0000` | único entre lojas ativas | `NumeroAutorizado.telefone_whatsapp` | — |
| `nome_pessoa` | Quem usa | text | texto | 120 | Não | — | — | `NumeroAutorizado.nome_pessoa` | — |
| `ativo` | Ativo | caixa de marcação | booleano | — | Sim | — | — | `NumeroAutorizado.ativo` | Inativo recebe `MSG-SL-002` |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Nova loja | botão | Coordenador | — |
| Salvar dados comerciais | botão | Coordenador, Atendente | Vale do pedido seguinte em diante; vai ao histórico (`RN-SL-015`) |
| Incluir ou tirar número | botão por linha | Coordenador | Grava quem autorizou e quando (`RN-SL-014`) |
| Ativar ou inativar loja | botão | Coordenador | — |

**Referências** — Planejamento da equipe (RF-01 a RF-04); Encontro 1 [08:38]; `RN-SL-014`,
`RN-SL-015`, `RN-SL-054`.

---

### TL-SL-006 — Terceirizadas

| | |
|---|---|
| **Rota legada** | Hoje: contato das empresas no WhatsApp; cada uma manda o retorno do seu jeito |
| **Rota proposta** | `/terceirizadas` e `/terceirizadas/{id}` |
| **Perfis** | Coordenador |
| **HUs** | `HU-SL-007` |

Cadastro das empresas que coletam e entregam. O padrão de retorno e de comprovação é o mesmo para
todas (`RN-SL-019`); o que muda é o caminho que cada uma usa.

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `nome` | Nome | text | texto | 120 | Sim | — | não vazio | `Terceirizada.nome` | — |
| `documento` | CNPJ | text | texto | 14 | Sim | `00.000.000/0000-00` | dígito verificador | `Terceirizada.documento` | — |
| `forma_retorno` | Como devolve o status | lista | texto | — | Sim | — | um dos valores de `06` §3.6 | `Terceirizada.forma_retorno` | API, Portal ou Planilha |
| `endereco_retorno_api` | Endereço para o despacho | text | texto | 250 | Com forma API | — | endereço seguro | `Terceirizada.endereco_retorno_api` | Para onde o SEALog envia a solicitação |
| `contato_nome` | Contato | text | texto | 120 | Sim | — | — | `Terceirizada.contato_nome` | — |
| `contato_telefone` | Telefone do contato | text | texto | 13 | Sim | `(00) 00000-0000` | — | `Terceirizada.contato_telefone` | — |
| `ativa` | Ativa | caixa de marcação | booleano | — | Sim | — | — | `Terceirizada.ativa` | Inativa não recebe despacho |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Nova terceirizada | botão | Coordenador | — |
| Gerar chave de acesso | botão | Coordenador | Mostrada uma vez só; guardada como hash (`Terceirizada.chave_api`, `RN-SL-053`) |
| Trocar chave | botão | Coordenador | A chave anterior deixa de valer |
| Criar usuário do portal | botão | Coordenador | Cria usuário de perfil Terceirizada (`TL-SL-010`) |
| Ver regiões | link | Coordenador | Abre `TL-SL-007` filtrada pela terceirizada |

**Referências** — Encontro 1 [15:19], [23:17], [27:54]; `RN-SL-016`, `RN-SL-019`, `RN-SL-053`.

---

### TL-SL-007 — Tabela de regiões

| | |
|---|---|
| **Rota legada** | Hoje: o conhecimento das regiões fica com o coordenador e os analistas |
| **Rota proposta** | `/regioes` |
| **Perfis** | Coordenador |
| **HUs** | `HU-SL-008`, `HU-SL-010` |

Cada linha liga um bairro e uma cidade a uma terceirizada. Em cima, os pedidos "Aguardando região"
pedem ao coordenador a escolha da terceirizada (`RN-SL-018`).

#### Filtros

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `busca` | Bairro ou cidade | text | texto | 80 | Não | — | — | `Regiao.bairro`, `Regiao.cidade` | Sem acento e sem diferença de maiúsculas |
| `terceirizada_id` | Terceirizada | lista | inteiro | — | Não | — | — | `Regiao.terceirizada_id` | — |

#### Região

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `bairro` | Bairro | text | texto | 80 | Sim | — | — | `Regiao.bairro` | — |
| `cidade` | Cidade | text | texto | 80 | Sim | — | — | `Regiao.cidade` | — |
| `terceirizada_id` | Terceirizada | lista | inteiro | — | Sim | — | terceirizada ativa; um só vínculo ativo por bairro (`RN-SL-017`, `MSG-SL-015`) | `Regiao.terceirizada_id` | — |

#### Pedidos aguardando região

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Código | Código | `Entrega.codigo` | Abre `TL-SL-009` |
| Loja | Loja | `Loja.nome` | — |
| Bairro e cidade | Bairro e cidade | `Entrega.bairro`, `Entrega.cidade` | `MSG-SL-014` |
| Data prevista | Data prevista | `Entrega.data_prevista` | Mais próxima primeiro |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Incluir região | botão | Coordenador | Vai ao histórico, com quem alterou |
| Trocar terceirizada do bairro | botão por linha | Coordenador | Vale para os pedidos seguintes; os já despachados não mudam |
| Escolher terceirizada do pedido | botão por linha, em Aguardando região | Coordenador | Despacha na hora; caixa "Incluir este bairro na tabela" (`RN-SL-018`) |
| Exportar | botão | Coordenador | — |

**Referências** — Encontro 1 [15:19]; `RN-SL-017`, `RN-SL-018`, `RN-SL-023`.

---

## Despacho

### TL-SL-008 — Lista de entregas

| | |
|---|---|
| **Rota legada** | Hoje: planilha online do dia, com cópias por analista |
| **Rota proposta** | `/entregas` |
| **Perfis** | Atendente, Coordenador, Financeiro |
| **HUs** | `HU-SL-009` |

A lista única, organizada pela data prevista. É onde a equipe responde "cadê minha entrega?" sem
perguntar a ninguém.

#### Filtros

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `busca` | Buscar | text | texto | 120 | Não | — | — | `Entrega.codigo`, `Loja.nome`, `Entrega.nome_destinatario`, `Entrega.telefone_destinatario`, `Entrega.bairro` | Acha por qualquer um dos cinco |
| `status` | Status | lista, vários | texto | — | Não | — | valores de `06` §3.1 | `Entrega.status` | Vazio é todos |
| `data_prevista` | Data prevista | intervalo de datas | data | — | Não | `dd/mm/aaaa` | início antes do fim | `Entrega.data_prevista` | Abre em hoje (`RN-SL-022`) |
| `loja_id` | Loja | lista com busca | inteiro | — | Não | — | — | `Entrega.loja_id` | — |
| `terceirizada_id` | Terceirizada | lista | inteiro | — | Não | — | — | `Entrega.terceirizada_id` | — |
| `sem_retorno` | Só sem retorno | caixa de marcação | booleano | — | Não | — | — | `Entrega.ultimo_retorno_em` | Despachadas sem retorno há mais que o limite (`RN-SL-034`, `Q-SL-13`) |

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Código | Código | `Entrega.codigo` | Abre `TL-SL-009` |
| Loja | Loja | `Loja.nome` | — |
| Destinatário | Destinatário | `Entrega.nome_destinatario` | — |
| Bairro | Bairro | `Entrega.bairro` | — |
| Data prevista | Data prevista | `Entrega.data_prevista` | Ordem padrão |
| Status | Status | `Entrega.status` | — |
| Terceirizada | Terceirizada | `Terceirizada.nome` | Vazio antes do despacho |
| Último registro | Último registro | `Entrega.atualizado_em` | Data e hora (`RN-SL-022`); sinalizado quando passa do limite (`RN-SL-034`) |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Filtrar e ordenar | filtros e cabeçalho das colunas | Atendente, Coordenador, Financeiro | Sem resultado, `MSG-SL-033` |
| Abrir entrega | clique na linha | Atendente, Coordenador, Financeiro | Abre `TL-SL-009` |
| Novo pedido | botão | Atendente, Coordenador | Abre `TL-SL-004` |
| Exportar | botão | Atendente, Coordenador, Financeiro | Abre `TL-SL-017` com os filtros da tela |

**Referências** — Enunciado §2 ("cadê minha entrega?"); Planejamento da equipe (RF-08);
`RN-SL-020` a `RN-SL-022`, `RN-SL-034`, `RN-SL-050`.

---

### TL-SL-009 — Detalhe da entrega

| | |
|---|---|
| **Rota legada** | Hoje: linha da planilha, mensagens no grupo interno e foto solta |
| **Rota proposta** | `/entregas/{codigo}` |
| **Perfis** | Atendente, Coordenador; Financeiro só leitura |
| **HUs** | `HU-SL-009`, `HU-SL-010`, `HU-SL-012`, `HU-SL-016` |

Tudo sobre uma entrega, numa página. Os dados do pedido são os de `TL-SL-004`, editáveis por quem
pode corrigir; os blocos abaixo são só leitura.

#### Blocos da página

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Situação | Status atual e último registro | `Entrega.status`, `Entrega.atualizado_em` | — |
| Despacho | Terceirizada e hora do despacho | `Entrega.terceirizada_id`, `Entrega.despachado_em` | Em Aguardando região, `MSG-SL-014` |
| Retornos | Retornos da terceirizada | `RetornoTerceirizada` | Situação, hora do fato, hora de chegada, canal e resultado (`RN-SL-035`) |
| Comprovante | Comprovante | `Comprovante` | Foto, data e hora, quem recebeu, entregador; marca de recebedor não autorizado (`RN-SL-031`) |
| Chamados | Chamados | `Chamado` | Tipo, sugestão, ação final, quem decidiu |
| Avisos | Avisos | `Aviso` | À loja e à terceirizada, com o resultado do envio |
| Histórico | Histórico | `EventoEntrega` | Toda mudança, com autor, hora do fato e valor anterior |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Corrigir dados | botão | Atendente, Coordenador | Vai ao histórico (`RN-SL-020`); depois do despacho, avisa a terceirizada (`RN-SL-026`, `MSG-SL-011`) |
| Cancelar a pedido da loja | botão | Atendente, Coordenador | Pede o motivo; avisa a terceirizada se já despachado |
| Escolher terceirizada | botão | Coordenador | Só em Aguardando região (`RN-SL-018`) |
| Abrir chamado | botão | Atendente, Coordenador | Ex.: comprovante que não convence; abre `TL-SL-013` |
| Ver foto do comprovante | link | Atendente, Coordenador, Financeiro | Abre a foto guardada pelo SEALog |

**Referências** — Enunciado §8 ("O registro incorreto"); `RN-SL-020`, `RN-SL-026`, `RN-SL-030`,
`RN-SL-031`, `RN-SL-035`.

---

## Retorno da terceirizada

### TL-SL-010 — Portal da terceirizada

| | |
|---|---|
| **Rota legada** | Hoje: a terceirizada manda o status por WhatsApp, por telefone ou pela planilha |
| **Rota proposta** | `/portal` e `/portal/{codigo}` |
| **Perfis** | Terceirizada |
| **HUs** | `HU-SL-011`, `HU-SL-012`, `HU-SL-014` |

Para a terceirizada sem integração. A tela é simples de propósito: a lista das entregas
despachadas para ela, com as alterações em destaque, e um registro por entrega com o comprovante
padrão (`RN-SL-030`). Ela vê só as próprias entregas (`RN-SL-053`).

#### Entregas do dia

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Código | Código | `Entrega.codigo` | O mesmo código que vai em todo retorno (`RN-SL-027`) |
| Coleta | Loja e endereço de coleta | `Loja.nome`, `Loja.endereco_coleta` | — |
| Destinatário | Destinatário e telefone | `Entrega.nome_destinatario`, `Entrega.telefone_destinatario` | — |
| Endereço | Endereço completo | `Entrega.rua`, `Entrega.numero`, `Entrega.complemento`, `Entrega.bairro`, `Entrega.ponto_referencia` | — |
| Volume | Tamanho e volumes | `Entrega.tamanho_volume`, `Entrega.qtd_volumes` | — |
| Pode receber | Quem mais pode receber | `Entrega.autorizados_receber` | — |
| Situação | Situação | `Entrega.status` | Alteração recente em destaque (`RN-SL-026`) |

#### Registrar situação

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `situacao` | Situação | botões | texto | — | Sim | — | um dos valores de `06` §3.7, dentro do ciclo (`MSG-SL-018`) | `RetornoTerceirizada.situacao` | Coletado, Em rota, Entregue, Não entregue, Devolvido ao galpão |
| `ocorrido_em` | Quando aconteceu | data e hora | data e hora | — | Sim | `dd/mm/aaaa hh:mm` | não no futuro | `RetornoTerceirizada.ocorrido_em` | Abre na hora atual (`RN-SL-035`) |
| `foto` | Foto da entrega | câmera ou arquivo | imagem | — | Sim, em Entregue | — | imagem (`MSG-SL-017`) | `Comprovante.foto_url` | — |
| `nome_recebedor` | Quem recebeu | text | texto | 120 | Sim, em Entregue | — | não vazio (`MSG-SL-017`) | `Comprovante.nome_recebedor` | Fora do destinatário e dos autorizados, abre chamado (`RN-SL-031`) |
| `entregador_identificacao` | Entregador | text | texto | 120 | Sim, em Entregue | — | não vazio (`MSG-SL-017`) | `Comprovante.entregador_identificacao` | Nome ou código do entregador na terceirizada |
| `motivo_nao_entrega` | Motivo | lista | texto | — | Sim, em Não entregue | — | um dos valores de `06` §3.3 (`MSG-SL-019`) | `RetornoTerceirizada.motivo_nao_entrega` | "Outro" exige observação |
| `observacao` | Observação | textarea | texto | 300 | Com motivo "Outro" | — | — | `EventoEntrega.valor_novo` | — |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Registrar | botão | Terceirizada | Grava o retorno com canal Portal; código de outra terceirizada, `MSG-SL-016` |
| Confirmar alteração recebida | botão por linha | Terceirizada | Só em entrega alterada depois do despacho (`RN-SL-026`) |
| Enviar planilha | link | Terceirizada | Abre `TL-SL-011` |

**Referências** — Encontro 1 [13:15], [23:17], [25:39], [40:16], [43:19]; Planejamento da equipe
(RF-14, RNF-02); `RN-SL-024`, `RN-SL-026` a `RN-SL-033`, `RN-SL-053`.

---

### TL-SL-011 — Importação de planilha

| | |
|---|---|
| **Rota legada** | Hoje: planilha própria de cada loja e de cada terceirizada, copiada à mão |
| **Rota proposta** | `/importar` (equipe) e `/portal/importar` (terceirizada) |
| **Perfis** | Atendente, Coordenador, Terceirizada |
| **HUs** | `HU-SL-004`, `HU-SL-015` |

A mesma tela recebe dois tipos de planilha: pedidos de uma loja, importados pela equipe, e
retornos de uma terceirizada. A planilha não precisa seguir um modelo: no segundo passo, cada coluna
é associada a um campo do padrão, e a associação fica guardada para a próxima vez. Cada linha passa
pelas mesmas validações do formulário ou da API; a que não passa é recusada com o motivo, e as
outras entram (`RN-SL-029`).

#### Arquivo

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `origem` | O que é a planilha | lista | texto | — | Sim | — | Pedidos de loja ou Retorno de terceirizada | `Importacao.origem` | A terceirizada só vê Retorno |
| `origem_id` | Loja ou terceirizada | lista com busca | inteiro | — | Sim | — | ativa | `Importacao.origem_id` | Na terceirizada, preenchido pelo usuário |
| `arquivo` | Planilha | arquivo | arquivo | — | Sim | — | XLSX ou CSV | `Importacao.arquivo_url` | O original fica guardado |

#### Associação de colunas

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `mapa_colunas` | Coluna da planilha → campo do padrão | lista por coluna | texto | — | Sim | — | todo campo obrigatório associado (`MSG-SL-021`) | `Importacao.mapa_colunas` | Vem preenchido com a associação anterior da mesma origem |

#### Resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Linha | Linha | número da linha na planilha | — |
| Código | Código | `Entrega.codigo` ou `RetornoTerceirizada.codigo_entrega` | — |
| Resultado | Resultado | `RetornoTerceirizada.resultado` | Aceita, Recusada ou Repetida (`RN-SL-033`) |
| Motivo | Motivo | `RetornoTerceirizada.motivo_recusa` | `MSG-SL-016` a `MSG-SL-019` |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Ler planilha | botão | Atendente, Coordenador, Terceirizada | Mostra as colunas para associar |
| Importar | botão | Atendente, Coordenador, Terceirizada | Grava as linhas válidas; resume com `MSG-SL-020` |
| Baixar recusadas | botão | Atendente, Coordenador, Terceirizada | Planilha só com as linhas recusadas e o motivo, para corrigir e reenviar |

**Referências** — Enunciado §2 (planilhas próprias dos clientes); Encontro 1 [13:15];
`RN-SL-012`, `RN-SL-029`, `RN-SL-033`.

---

## Ocorrências e devoluções

### TL-SL-012 — Painel de chamados

| | |
|---|---|
| **Rota legada** | Hoje: mensagens no grupo interno e no WhatsApp do atendimento, que se perdem |
| **Rota proposta** | `/chamados` |
| **Perfis** | Atendente, Coordenador |
| **HUs** | `HU-SL-018`, `HU-SL-020` |

Todo chamado aberto, de qualquer origem, até ser concluído (`RN-SL-039`). O painel se atualiza
sozinho quando chega um chamado novo, sem recarregar a página, e mostra o aviso `MSG-SL-026`. Os
avisos que falharam aparecem no mesmo painel (`RN-SL-045`).

#### Filtros

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `status` | Status | lista, vários | texto | — | Não | — | `06` §3.8 | `Chamado.status` | Abre em Pendente e Em atendimento |
| `tipo` | Tipo | lista, vários | texto | — | Não | — | `06` §3.4 | `Chamado.tipo` | — |
| `origem` | Origem | lista | texto | — | Não | — | Loja, Retorno da terceirizada, Sistema | `Chamado.origem` | — |

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Aberto em | Aberto em | `Chamado.criado_em` | Mais antigo primeiro |
| Pedido | Código | `Entrega.codigo` | Abre `TL-SL-009` |
| Loja | Loja | `Loja.nome` | — |
| Tipo | Tipo | `Chamado.tipo` | — |
| Sugestão | Ação sugerida | `Chamado.acao_sugerida` | Resumo |
| Status | Status | `Chamado.status` | — |
| Prazo | Prazo | `Chamado.criado_em` | Destaque se não concluído até 19h (`RN-SL-046`) |
| Aviso | Aviso à loja | `Aviso.resultado` | Enviado ou Falhou (`MSG-SL-027`) |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Abrir chamado | clique na linha | Atendente, Coordenador | Abre `TL-SL-013` e passa o chamado a Em atendimento |
| Reenviar aviso | botão por linha | Atendente, Coordenador | Só em aviso que falhou |
| Ver afetados por loja | link | Atendente, Coordenador | Abre `TL-SL-015` |

**Referências** — Enunciado §8 ("O buquê de sábado"); Plano do agente (painel com alerta em tempo
real); `RN-SL-039`, `RN-SL-043`, `RN-SL-045`, `RN-SL-046`.

---

### TL-SL-013 — Detalhe do chamado

| | |
|---|---|
| **Rota legada** | Hoje: o coordenador decide caso a caso, sem regra e sem registro |
| **Rota proposta** | `/chamados/{id}` |
| **Perfis** | Atendente, Coordenador |
| **HUs** | `HU-SL-018` |

Mostra o que o agente colheu e o que ele sugere pelo protocolo de atendimento, para a pessoa
aprovar, mudar ou recusar. O agente nunca decide (`RN-SL-037`). Quem aprova — atendente ou
coordenador — está em `Q-SL-06`; o protocolo, em `Q-SL-05`.

#### Blocos da página

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Pedido | Pedido e loja | `Entrega.codigo`, `Loja.nome` | Com o status e a terceirizada |
| Relato | O que aconteceu | `Chamado.descricao` | — |
| Conversa | Resumo da conversa | `Chamado.resumo_conversa` | Só na origem Loja |
| Fotos | Fotos | `Chamado.fotos` | — |
| Sugestão | Ação sugerida pelo agente | `Chamado.acao_sugerida` | Com a regra do protocolo que a justifica |
| Contato | Contato da loja | `Chamado.telefone_loja` | Juntado pelo sistema; não vai ao agente (`RN-SL-038`) |

#### Decisão

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `acao_final` | Ação | text, preenchido com a sugestão | texto | 500 | Sim | — | não vazio | `Chamado.acao_final` | Aprovar mantém o texto do agente |
| `motivo_decisao` | Motivo | text | texto | 300 | Sim, ao mudar ou recusar | — | não vazio | `Chamado.motivo_decisao` | — |
| `resposta_loja` | Resposta à loja | textarea | texto | 500 | Sim | — | não vazio | `Aviso.texto` | Vai pelo WhatsApp (`MSG-SL-023`) |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Aprovar | botão | Atendente, Coordenador | Grava a sugestão como ação final, conclui o chamado e avisa a loja (`RN-SL-040`) |
| Mudar a ação | botão | Atendente, Coordenador | Exige o motivo; conclui e avisa a loja |
| Recusar | botão | Atendente, Coordenador | Exige o motivo; conclui sem ação e avisa a loja |
| Mandar para o galpão | link | Atendente, Coordenador | Em Não entregue, abre `TL-SL-014` para a decisão do coordenador |

**Referências** — Plano do agente; `RN-SL-036` a `RN-SL-040`; `Q-SL-05`, `Q-SL-06`.

---

### TL-SL-014 — Devoluções no galpão

| | |
|---|---|
| **Rota legada** | Hoje: o coordenador avalia no galpão, entre 17h e 18h, cada pacote que voltou |
| **Rota proposta** | `/galpao` |
| **Perfis** | Coordenador; Atendente registra a chegada |
| **HUs** | `HU-SL-019` |

Duas listas: os pacotes que a terceirizada diz ter devolvido e ainda não chegaram (Em devolução), e
os que já estão no galpão aguardando decisão (No galpão).

#### Chegada

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `codigo` | Código do pacote | text | texto | 12 | Sim | — | entrega Em devolução ou Não entregue | `Entrega.codigo` | Digitado ou lido do pacote (`RN-SL-041`); confirma com `MSG-SL-028` |

#### Decisão

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `decisao` | Destino | botões | texto | — | Sim | — | Nova tentativa, Devolver à loja, Guardar aguardando instrução, Cancelar a pedido da loja | `EventoEntrega.valor_novo` | Os quatro destinos de `RN-SL-042` |
| `data_nova_tentativa` | Nova data | date | data | — | Sim, em nova tentativa | `dd/mm/aaaa` | depois de hoje | `Entrega.data_prevista` | Despacha de novo; limite de tentativas em `Q-SL-07` |
| `motivo` | Motivo | text | texto | 200 | Sim | — | não vazio | `EventoEntrega.valor_novo` | — |

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Código | Código | `Entrega.codigo` | Abre `TL-SL-009` |
| Loja | Loja | `Loja.nome` | — |
| Motivo | Motivo da não entrega | `RetornoTerceirizada.motivo_nao_entrega` | — |
| Terceirizada | Terceirizada | `Terceirizada.nome` | — |
| Chamado | Sugestão do chamado | `Chamado.acao_sugerida` | Ajuda a decidir |
| No galpão desde | No galpão desde | `EventoEntrega.ocorrido_em` | Prazo de guarda em `Q-SL-07` |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Registrar chegada | botão | Coordenador, Atendente | Leva a entrega a No galpão |
| Decidir | botão por linha | Coordenador | Grava quem, quando e o motivo, e avisa a loja (`MSG-SL-023`) |

**Referências** — Enunciado §2; Encontro 1 [47:01]; Planejamento da equipe (RF-16, RF-17, RN-02);
`RN-SL-041`, `RN-SL-042`; `Q-SL-03`, `Q-SL-07`.

---

### TL-SL-015 — Entregas afetadas por loja

| | |
|---|---|
| **Rota legada** | Hoje: não existe; dezenas de mensagens respondidas uma a uma |
| **Rota proposta** | `/afetados` |
| **Perfis** | Atendente, Coordenador; Financeiro só leitura |
| **HUs** | `HU-SL-021` |

As entregas atrasadas ou com chamado num período, agrupadas por loja, com a contagem de cada uma
(`RN-SL-044`). Daí sai o aviso em lote: uma mensagem por loja, com a lista das entregas dela.

#### Filtros

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `periodo` | Período | intervalo de datas | data | — | Sim | `dd/mm/aaaa` | início antes do fim | `Entrega.data_prevista` | Abre em hoje |
| `motivo` | Motivo | lista, vários | texto | — | Não | — | valores de `06` §3.3 e §3.4 | `Chamado.tipo` | Inclui "Atrasada sem chamado" |
| `bairro` | Bairro | lista com busca | texto | — | Não | — | — | `Entrega.bairro` | — |
| `terceirizada_id` | Terceirizada | lista | inteiro | — | Não | — | — | `Entrega.terceirizada_id` | — |

#### Aviso em lote

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `motivo_aviso` | Motivo do aviso | text | texto | 120 | Sim | — | não vazio | `Aviso.texto` | Ex.: "chuva forte"; entra em `MSG-SL-024` |
| `lojas` | Lojas | caixa por linha | lista de inteiros | — | Sim | — | ao menos uma | `Aviso.destino_id` | Abre com todas marcadas |

#### Colunas do resultado

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Loja | Loja | `Loja.nome` | Agrupa |
| Afetadas | Entregas afetadas | contagem | Maior primeiro |
| Entregas | Código, destinatário e situação | `Entrega.codigo`, `Entrega.nome_destinatario`, `Entrega.status` | — |
| Último aviso | Último aviso | `Aviso.enviado_em` | Para não repetir |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Avisar as lojas marcadas | botão | Atendente, Coordenador | Uma mensagem por loja (`MSG-SL-024`); cada envio fica registrado (`RN-SL-045`) |
| Exportar | botão | Atendente, Coordenador, Financeiro | Abre `TL-SL-017`; sem linhas, `MSG-SL-033` |

**Referências** — Enunciado §8 ("A segunda-feira de chuva"); `RN-SL-044`, `RN-SL-045`, `RN-SL-050`.

---

## Financeiro

### TL-SL-016 — Fechamentos

| | |
|---|---|
| **Rota legada** | Hoje: o financeiro calcula a cobrança sobre a planilha fechada às 19h |
| **Rota proposta** | `/fechamentos` e `/fechamentos/{id}` |
| **Perfis** | Financeiro |
| **HUs** | `HU-SL-022`, `HU-SL-023` |

A mesma tela faz os dois fechamentos: a cobrança de cada loja e o pagamento de cada terceirizada.
O valor vem da tabela de preços (`Q-SL-08`) ou da tabela de pagamento (`Q-SL-09`), que só a SEALog
define. Na terceirizada, entra só a entrega com comprovante aceito (`RN-SL-048`).

#### Geração

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `tipo` | Tipo | botões | texto | — | Sim | — | Cobrança de loja ou Pagamento de terceirizada | `Fechamento.tipo` | — |
| `loja_id` | Loja | lista com busca | inteiro | — | Em cobrança | — | — | `Fechamento.loja_id` | Vazio gera um por loja |
| `terceirizada_id` | Terceirizada | lista | inteiro | — | Em pagamento | — | — | `Fechamento.terceirizada_id` | Vazio gera um por terceirizada |
| `periodo` | Período | intervalo de datas | data | — | Sim | `dd/mm/aaaa` | início antes do fim; sem sobrepor fechamento fechado | `Fechamento.periodo_inicio`, `Fechamento.periodo_fim` | — |

#### Ajuste

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `valor` | Valor | number | decimal | 10,2 | Sim | `R$ 0,00` | diferente de zero | `ItemFechamento.valor` | Negativo para desconto |
| `motivo_ajuste` | Motivo | text | texto | 200 | Sim | — | não vazio | `ItemFechamento.motivo_ajuste` | — |

#### Colunas do extrato

| Coluna | Rótulo | Origem | Observações |
|---|---|---|---|
| Código | Código | `Entrega.codigo` | — |
| Data | Data do status final | `EventoEntrega.ocorrido_em` | — |
| Destinatário | Destinatário | `Entrega.nome_destinatario` | — |
| Bairro | Bairro | `Entrega.bairro` | — |
| Status final | Status final | `Entrega.status` | — |
| Comprovante | Comprovante aceito | `Comprovante.id` | Só no pagamento |
| Valor | Valor | `ItemFechamento.valor` | — |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Gerar | botão | Financeiro | Cria em Rascunho |
| Enviar para conferência | botão | Financeiro | Rascunho → Em conferência |
| Lançar ajuste | botão | Financeiro | Em Rascunho ou Em conferência; fechado, `MSG-SL-032` |
| Fechar | botão | Financeiro | Em conferência → Fechado; não muda mais (`RN-SL-049`) |
| Exportar | botão | Financeiro | Abre `TL-SL-017` |

**Referências** — Enunciado §2; Encontro 1 [38:44]; `RN-SL-047` a `RN-SL-050`; `Q-SL-08`,
`Q-SL-09`.

---

### TL-SL-017 — Exportação para planilha

| | |
|---|---|
| **Rota legada** | Hoje: a própria planilha online |
| **Rota proposta** | Ação nas telas `TL-SL-008`, `TL-SL-015` e `TL-SL-016` |
| **Perfis** | Atendente, Coordenador, Financeiro |
| **HUs** | `HU-SL-009`, `HU-SL-021`, `HU-SL-022`, `HU-SL-023` |

Leva para planilha o que está na tela, com as mesmas colunas e os mesmos filtros. A planilha
exportada não volta ao sistema (`RN-SL-050`).

| Campo | Rótulo | Controle | Tipo | Tam. | Obrig. | Máscara | Validações | Origem no banco | Observações |
|---|---|---|---|---|---|---|---|---|---|
| `formato` | Formato | botões | texto | — | Sim | — | XLSX ou CSV | — | Abre em XLSX |
| `colunas` | Colunas | caixa por coluna | lista de texto | — | Sim | — | ao menos uma | — | Abre com as colunas visíveis na tela |

#### Ações da tela

| Ação | Controle | Quem pode | Observações |
|---|---|---|---|
| Baixar | botão | Atendente, Coordenador, Financeiro | Sem linhas, não exporta (`MSG-SL-033`) |

**Referências** — Gargalos §9; `RN-SL-050`.
