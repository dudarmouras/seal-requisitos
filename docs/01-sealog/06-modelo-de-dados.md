# SEALog — Modelo de dados

Modelo lógico proposto: quatorze entidades e os domínios fechados que elas usam. Não há banco
legado — hoje os dados estão em planilhas e no WhatsApp —, e por isso as entidades saem das
histórias e das telas, não de um DDL. Tipos são lógicos (texto, inteiro, data); o banco é
relacional (`DEC-SL-12`).

A entidade central é a **Entrega**: o registro único que falta hoje (Gargalos §8). Um pedido é uma
entrega; tudo o mais — histórico, retornos da terceirizada, comprovante, chamados, avisos — pendura
nela. A loja e a terceirizada são os dois cadastros que a cercam, ligados pela tabela de regiões.

---

## 1. Catálogo de entidades

| ID | Entidade | Natureza | Observação |
|---|---|---|---|
| `ENT-SL-001` | Loja | Cadastro | Cliente da SEALog; faz pedidos pelo WhatsApp |
| `ENT-SL-002` | Número autorizado | Cadastro | Número de WhatsApp que pode pedir em nome de uma loja |
| `ENT-SL-003` | Terceirizada | Cadastro | Empresa que coleta e entrega numa região |
| `ENT-SL-004` | Região | Cadastro | Par bairro e cidade, com a terceirizada que o atende |
| `ENT-SL-005` | Entrega | Movimento | O pedido; uma por pedido |
| `ENT-SL-006` | Evento da entrega | Histórico | Toda mudança de status e de dado, com autor e hora |
| `ENT-SL-007` | Comprovante | Movimento | Foto, recebedor e entregador da entrega concluída |
| `ENT-SL-008` | Retorno da terceirizada | Histórico | Cada status recebido, pela API, pelo portal ou por planilha |
| `ENT-SL-009` | Chamado | Movimento | Ocorrência com a sugestão do agente e a decisão da equipe |
| `ENT-SL-010` | Aviso | Histórico | Mensagem enviada à loja ou à terceirizada |
| `ENT-SL-011` | Importação | Histórico | Planilha recebida, de loja ou de terceirizada, e o resultado |
| `ENT-SL-012` | Usuário | Cadastro | Pessoa da equipe ou da terceirizada, com o perfil |
| `ENT-SL-013` | Fechamento | Movimento | Cobrança de uma loja ou pagamento de uma terceirizada num período |
| `ENT-SL-014` | Item do fechamento | Movimento | Entrega cobrada ou paga, ou ajuste |

## 2. Dicionário de dados

### `ENT-SL-001` — Loja

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | Identificador |
| `nome` | texto (120) | Sim | Nome do estabelecimento |
| `documento` | texto (14) | Sim | CNPJ ou CPF, só dígitos |
| `endereco_coleta` | texto (250) | Sim | Onde a terceirizada coleta; vai no despacho (`RN-SL-024`) |
| `bairro_coleta` / `cidade_coleta` | texto (80) | Sim | — |
| `contato_nome` | texto (120) | Sim | Responsável pela conta |
| `condicao_cobranca` | texto (200) | Não | Referência à tabela de preços (`Q-SL-08`) |
| `ativa` | booleano | Sim | Loja inativa não faz pedido novo (`RN-SL-014`) |
| `criado_em` / `atualizado_em` | data e hora | Sim | — |

### `ENT-SL-002` — Número autorizado

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `loja_id` | inteiro | Sim | Liga a `ENT-SL-001` |
| `telefone_whatsapp` | texto (13) | Sim | Com DDI e DDD, só dígitos; único entre lojas ativas |
| `nome_pessoa` | texto (120) | Não | Quem usa o número na loja |
| `ativo` | booleano | Sim | — |
| `autorizado_por` / `autorizado_em` | inteiro / data e hora | Sim | Usuário da equipe |

### `ENT-SL-003` — Terceirizada

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `nome` | texto (120) | Sim | — |
| `documento` | texto (14) | Sim | CNPJ |
| `forma_retorno` | texto | Sim | Domínio §3.6 |
| `endereco_retorno_api` | texto (250) | Com forma API | Para onde o SEALog envia o despacho |
| `chave_api` | texto | Com forma API | Guardada só como hash; trocável pelo coordenador |
| `contato_nome` / `contato_telefone` | texto | Sim | Para o despacho e as alterações |
| `ativa` | booleano | Sim | Terceirizada inativa não recebe despacho |

### `ENT-SL-004` — Região

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `bairro` / `cidade` | texto (80) | Sim | Comparados sem acento e sem diferença de maiúsculas |
| `terceirizada_id` | inteiro | Sim | Liga a `ENT-SL-003` |
| `ativa` | booleano | Sim | Um par bairro e cidade tem uma só região ativa (`RN-SL-017`) |
| `alterado_por` / `alterado_em` | inteiro / data e hora | Sim | — |

### `ENT-SL-005` — Entrega

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | Identificador |
| `codigo` | texto (12) | Sim | Código SEALog, gerado no registro; único; identifica o pacote (`RN-SL-027`) |
| `loja_id` | inteiro | Sim | Liga a `ENT-SL-001` |
| `numero_origem` | texto (13) | Não | Número autorizado que fez o pedido; vazio quando a equipe registrou |
| `canal_origem` | texto | Sim | Domínio §3.2 |
| `status` | texto | Sim | Domínio §3.1 |
| `nome_destinatario` | texto (120) | Para confirmar | — |
| `telefone_destinatario` | texto (11) | Para confirmar | Só dígitos, com DDD |
| `rua` | texto (150) | Para confirmar | — |
| `numero` | texto (10) | Para confirmar, salvo `sem_numero` | — |
| `sem_numero` | booleano | Sim | Torna `ponto_referencia` obrigatório |
| `complemento` | texto (80) | Para confirmar, salvo `sem_complemento` | Apartamento, bloco, sala |
| `sem_complemento` | booleano | Sim | Marca de que o endereço não tem complemento |
| `bairro` / `cidade` | texto (80) | Para confirmar | Definem a região (`RN-SL-023`) |
| `ponto_referencia` | texto (150) | Com `sem_numero` | — |
| `tamanho_volume` | texto | Para confirmar | Domínio §3.5 |
| `qtd_volumes` | inteiro | Sim | 1 ou mais |
| `data_desejada` | data | Não | Vazia quando vale o prazo padrão |
| `data_prevista` | data | Ao receber | Dia útil seguinte ou a data desejada (`RN-SL-009`); base do atraso (`RN-SL-044`) |
| `autorizados_receber` | texto (200) | Não | Quem pode receber além do destinatário (`RN-SL-013`) |
| `observacoes` | texto (500) | Não | Vão à terceirizada |
| `campos_pendentes` | lista de texto | Não | O que falta, enquanto "Pendente de dados" |
| `terceirizada_id` | inteiro | Ao despachar | Liga a `ENT-SL-003` |
| `despachado_em` | data e hora | Não | — |
| `ultimo_retorno_em` | data e hora | Não | Hora do último retorno recebido; base de `RN-SL-034` |
| `criado_por` | inteiro | Não | Usuário; vazio quando veio pelo WhatsApp |
| `criado_em` / `atualizado_em` | data e hora | Sim | `atualizado_em` é a hora do último registro (`RN-SL-022`) |

"Para confirmar" quer dizer: pode estar vazio enquanto a entrega está "Pendente de dados", e é
obrigatório para sair desse status (`RN-SL-012`). O formulário do WhatsApp não deixa enviar vazio
(`RN-SL-006`).

### `ENT-SL-006` — Evento da entrega

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `entrega_id` | inteiro | Sim | — |
| `tipo` | texto | Sim | Status, Dado alterado, Despacho, Retorno, Chamado, Aviso |
| `campo` / `valor_anterior` / `valor_novo` | texto | Em Dado alterado e Status | — |
| `autor` | texto | Sim | Usuário, loja (pelo número), terceirizada ou sistema |
| `ocorrido_em` | data e hora | Sim | Hora do fato |
| `registrado_em` | data e hora | Sim | Hora em que o sistema gravou (`RN-SL-035`) |

O histórico não se edita nem se apaga (`RN-SL-020`).

### `ENT-SL-007` — Comprovante

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `entrega_id` | inteiro | Sim | Um por entrega concluída |
| `foto_url` | texto | Sim | Endereço da foto guardada pelo SEALog, não o da terceirizada |
| `entregue_em` | data e hora | Sim | Hora do fato |
| `nome_recebedor` | texto (120) | Sim | — |
| `recebedor_e_destinatario` | booleano | Sim | — |
| `recebedor_autorizado` | booleano | Sim | Calculado contra `autorizados_receber` (`RN-SL-031`) |
| `entregador_identificacao` | texto (120) | Sim | Nome ou código do entregador na terceirizada |
| `retorno_id` | inteiro | Sim | Liga ao retorno que trouxe o comprovante |

### `ENT-SL-008` — Retorno da terceirizada

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `terceirizada_id` | inteiro | Sim | — |
| `codigo_entrega` | texto (12) | Sim | Como veio; ligado à entrega quando existe |
| `entrega_id` | inteiro | Se aceito | — |
| `situacao` | texto | Sim | Domínio §3.7 |
| `motivo_nao_entrega` | texto | Em Não entregue | Domínio §3.3 |
| `ocorrido_em` | data e hora | Sim | Hora do fato |
| `recebido_em` | data e hora | Sim | Hora de chegada |
| `canal` | texto | Sim | API, Portal ou Planilha |
| `importacao_id` | inteiro | Em Planilha | Liga a `ENT-SL-011` |
| `resultado` | texto | Sim | Aceito, Recusado ou Repetido (`RN-SL-033`) |
| `motivo_recusa` | texto (200) | Em Recusado | — |

### `ENT-SL-009` — Chamado

Corresponde à tabela `incidents` do plano do agente de ocorrências, com os tipos adaptados à
logística (`DIV-SL-04`).

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `entrega_id` | inteiro | Sim | Liga a `ENT-SL-005` |
| `origem` | texto | Sim | Loja pelo WhatsApp, Retorno da terceirizada ou Sistema |
| `telefone_loja` | texto (13) | Na origem Loja | Número que relatou |
| `tipo` | texto | Sim | Domínio §3.4 |
| `descricao` | texto | Sim | Relato colhido pelo agente, ou o motivo do retorno |
| `resumo_conversa` | texto | Na origem Loja | Resumo da conversa, feito pelo agente |
| `acao_sugerida` | texto | Sim | Sugestão do agente, pelo protocolo (`RN-SL-037`) |
| `fotos` | lista de texto | Não | Endereços das fotos enviadas pela loja |
| `status` | texto | Sim | Domínio §3.8 |
| `acao_final` | texto | Ao concluir | O que a equipe decidiu |
| `motivo_decisao` | texto (300) | Quando a ação final difere da sugerida | — |
| `decidido_por` / `decidido_em` | inteiro / data e hora | Ao concluir | — |
| `criado_em` | data e hora | Sim | — |

### `ENT-SL-010` — Aviso

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `entrega_id` | inteiro | Não | Vazio no aviso em lote, que lista várias |
| `destino` | texto | Sim | Loja ou Terceirizada |
| `destino_id` | inteiro | Sim | — |
| `tipo` | texto | Sim | Domínio §3.9 |
| `texto` | texto | Sim | Texto enviado |
| `enviado_em` | data e hora | Sim | — |
| `resultado` | texto | Sim | Enviado, Entregue, Lido ou Falhou (`RN-SL-045`) |
| `motivo_falha` | texto (200) | Em Falhou | — |

### `ENT-SL-011` — Importação

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `origem` | texto | Sim | Pedidos de loja ou Retorno de terceirizada |
| `origem_id` | inteiro | Sim | A loja ou a terceirizada |
| `arquivo_url` | texto | Sim | A planilha original, guardada |
| `mapa_colunas` | texto | Sim | Que coluna da planilha virou que campo do padrão |
| `linhas_total` / `linhas_aceitas` / `linhas_recusadas` | inteiro | Sim | — |
| `importado_por` / `importado_em` | inteiro / data e hora | Sim | — |

### `ENT-SL-012` — Usuário

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `nome` | texto (120) | Sim | — |
| `usuario` | texto (60) | Sim | Único |
| `senha_hash` | texto | Sim | Nunca a senha |
| `perfil` | texto | Sim | Domínio §3.10 |
| `terceirizada_id` | inteiro | No perfil Terceirizada | — |
| `tentativas_falhas` | inteiro | Sim | Zera a cada entrada certa (`RN-SL-052`) |
| `bloqueado_ate` | data e hora | Não | — |
| `ativo` | booleano | Sim | — |

### `ENT-SL-013` — Fechamento

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `tipo` | texto | Sim | Cobrança de loja ou Pagamento de terceirizada |
| `loja_id` / `terceirizada_id` | inteiro | Um dos dois, conforme o tipo | — |
| `periodo_inicio` / `periodo_fim` | data | Sim | — |
| `situacao` | texto | Sim | Domínio §3.11 |
| `total` | decimal (10,2) | Sim | Soma dos itens |
| `gerado_por` / `fechado_por` / `fechado_em` | inteiro / inteiro / data e hora | Conforme a situação | — |

### `ENT-SL-014` — Item do fechamento

| Atributo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| `id` | inteiro | Sim | — |
| `fechamento_id` | inteiro | Sim | — |
| `tipo` | texto | Sim | Entrega ou Ajuste |
| `entrega_id` | inteiro | Em tipo Entrega | Cada entrega entra em um só fechamento de cada tipo |
| `valor` | decimal (10,2) | Sim | Pela tabela de preços (`Q-SL-08`) ou de pagamento (`Q-SL-09`) |
| `motivo_ajuste` | texto (200) | Em tipo Ajuste | — |

## 3. Domínios

### 3.1 Status da entrega

| Valor | Quando | Próximos |
|---|---|---|
| Pendente de dados | Registrada pela equipe sem algum dado obrigatório | Recebido, Cancelado |
| Recebido | Todos os dados obrigatórios; código gerado e loja avisada | Despachado, Aguardando região, Cancelado |
| Aguardando região | Bairro fora da tabela de regiões (`RN-SL-018`) | Despachado, Cancelado |
| Despachado | Enviado à terceirizada da região | Coletado, Cancelado |
| Coletado | A terceirizada informou a coleta na loja | Em rota, Não entregue |
| Em rota | A terceirizada informou a saída para entrega | Entregue, Não entregue |
| Entregue | Retorno com comprovante aceito | — (final) |
| Não entregue | Retorno com motivo; chamado aberto | Em devolução |
| Em devolução | A terceirizada informou que devolveu ao galpão | No galpão |
| No galpão | Chegada registrada pela equipe (`RN-SL-041`) | Despachado (nova tentativa), Devolvido à loja, Cancelado |
| Devolvido à loja | Pacote devolvido | — (final) |
| Cancelado | A pedido da loja | — (final) |

O ciclo está desenhado em `FLX-SL-01`. "Status final" (`RN-SL-047`, `RN-SL-048`) é Entregue,
Devolvido à loja ou Cancelado. A decisão de guardar o pacote mantém a entrega No galpão.

### 3.2 Canal de origem

| Valor | Origem |
|---|---|
| WhatsApp | Formulário do menu (`RN-SL-002`) |
| Equipe | Registro pela equipe de áudio, mensagem livre ou ligação (`RN-SL-012`) |
| Planilha | Planilha da loja importada pela equipe (`RN-SL-012`) |

### 3.3 Motivo de não entrega

| Valor | Observação |
|---|---|
| Destinatário ausente | Enunciado §2 |
| Endereço não encontrado | Enunciado §2; caso "O buquê de sábado" |
| Endereço incompleto | Liga ao gargalo de pedido incompleto (Gargalos §1) |
| Recusado pelo destinatário | Enunciado §2 |
| Acesso impedido | Portaria, condomínio, rua fechada |
| Pacote avariado | — |
| Condição climática | Caso "A segunda-feira de chuva" |
| Outro | Exige observação |

A lista é proposta e vale igual para toda terceirizada (`RN-SL-019`). Os motivos que as
terceirizadas já usam estão em `Q-SL-11`.

### 3.4 Tipo de chamado

| Valor | Origem típica |
|---|---|
| Atraso | Loja |
| Não entregue | Retorno da terceirizada, ou loja |
| Avaria | Loja, com foto |
| Entregue no endereço errado | Loja; o caso "O registro incorreto" |
| Recebedor não autorizado | Sistema (`RN-SL-031`) |
| Sem retorno da terceirizada | Sistema (`RN-SL-034`) |
| Outro | Loja |

O plano do agente usava os tipos de uma loja virtual (pedido errado, defeito); a lista foi adaptada
ao que a SEALog faz, que é transportar (`DIV-SL-04`).

### 3.5 Tamanho do volume

Pequeno (cabe numa sacola), Médio (uma caixa de sapato), Grande (uma caixa que se carrega com as
duas mãos). As faixas são proposta; o enunciado pede só o "tamanho aproximado" (Enunciado §2).

### 3.6 Forma de retorno da terceirizada

| Valor | Uso |
|---|---|
| API | A terceirizada recebe o despacho e devolve o status por integração (`INT-002`) |
| Portal | A terceirizada usa a tela do portal (`TL-SL-010`) |
| Planilha | A terceirizada manda planilha, traduzida para o padrão (`INT-003`) |

### 3.7 Situação informada pela terceirizada

Coletado, Em rota, Entregue, Não entregue, Devolvido ao galpão (`RN-SL-028`). Devolvido ao galpão
leva a entrega a "Em devolução"; quem a leva a "No galpão" é a equipe, ao receber o pacote.

### 3.8 Status do chamado

Pendente, Em atendimento, Concluído (`RN-SL-039`).

### 3.9 Tipo de aviso

| Valor | Destino | Quando |
|---|---|---|
| Pedido recebido | Loja | Pedido confirmado |
| Completar pedido | Loja | Pedido pendente de dados |
| Pedido alterado | Loja | Edição ou cancelamento |
| Problema na entrega | Loja | Não entregue ou chamado aberto (`RN-SL-043`) |
| Decisão | Loja | Chamado concluído ou decisão no galpão |
| Lote | Loja | Pela consulta de afetados (`RN-SL-044`) |
| Despacho | Terceirizada | Entrega despachada |
| Alteração | Terceirizada | Mudança depois do despacho (`RN-SL-026`) |

### 3.10 Perfil

Atendente, Coordenador e Financeiro, da equipe da SEALog (`RN-SL-051`; `Q-SL-10`), e Terceirizada,
do portal (`RN-SL-053`). A loja não tem perfil: entra pelo número autorizado (`RN-SL-054`).

### 3.11 Situação do fechamento

Rascunho, Em conferência, Fechado (`RN-SL-049`).

**Referências** — Enunciado §2, §8; Encontro 1; Plano do agente; `RN-SL-001` a `RN-SL-054`.
