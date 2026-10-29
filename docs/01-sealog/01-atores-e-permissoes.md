# SEALog — Atores e permissões

Sete atores: a loja, que usa só o WhatsApp; três perfis da equipe da SEALog; a terceirizada, com
portal e API; o agente de ocorrências, que conversa mas não decide; e o destinatário, que não
entra. Os papéis vêm do enunciado e do Encontro 1; o que cada perfil pode fazer é proposta, e a
lista de perfis está para confirmação (`Q-SL-10`).

---

## 1. Atores

### 1.1 Loja

| | |
|---|---|
| **Descrição** | Cliente da SEALog: lojas de bairro, farmácias, floriculturas, papelarias, pequenos e-commerces. Os exemplos da origem são a floricultura do buquê e as lojas do pedido com informações incompletas |
| **Como é identificado** | Pelo número de WhatsApp autorizado no cadastro. Não tem senha (`RN-SL-054`) |
| **Pode fazer** | Fazer, acompanhar, editar e cancelar os próprios pedidos pelo WhatsApp; autorizar quem pode receber além do destinatário; relatar problema; receber avisos |
| **Não pode fazer** | Ver pedidos de outra loja; editar depois da coleta (`RN-SL-011`); escolher a terceirizada |
| **Origem** | Enunciado §2; Encontro 1 [08:38] |

### 1.2 Atendente

| | |
|---|---|
| **Descrição** | Recebe as lojas no WhatsApp e responde a elas. Trabalha de segunda a sexta, das 8h às 18h, e no sábado até 12h. Absorve o trabalho de registro que hoje é do analista (`Q-SL-10`) |
| **Como é identificado** | Usuário e senha, perfil Atendente |
| **Pode fazer** | Registrar pedido fora do formulário e importar planilha de loja; consultar qualquer entrega; alterar dados da entrega; tratar chamados; enviar aviso em lote; registrar a chegada de pacote ao galpão; manter os dados comerciais da loja |
| **Não pode fazer** | Autorizar números, cadastrar terceirizadas e regiões, decidir o destino no galpão, fechar cobrança ou pagamento |
| **Origem** | Enunciado §2; Planejamento da equipe (RF-18, RF-19) |

### 1.3 Coordenador de operação

| | |
|---|---|
| **Descrição** | Hoje distribui os pedidos e decide, sem regra formal, o que fazer com o que voltou ao galpão. No SEALog, mantém os cadastros que fazem o despacho andar sozinho e decide o destino do que volta |
| **Como é identificado** | Usuário e senha, perfil Coordenador |
| **Pode fazer** | Tudo o que o atendente faz; cadastrar lojas e autorizar números; cadastrar terceirizadas; manter a tabela de regiões; escolher a terceirizada de pedido "Aguardando região"; decidir o destino no galpão; cadastrar usuários e desbloquear acesso |
| **Não pode fazer** | Fechar cobrança ou pagamento |
| **Origem** | Enunciado §2; Encontro 1 [47:01]; Planejamento da equipe (RF-17) |

### 1.4 Financeiro

| | |
|---|---|
| **Descrição** | Calcula a cobrança das lojas e, desde a terceirização, o pagamento das terceirizadas pelas entregas realizadas |
| **Como é identificado** | Usuário e senha, perfil Financeiro |
| **Pode fazer** | Consultar entregas e afetados; gerar, conferir e fechar os dois tipos de fechamento; exportar |
| **Não pode fazer** | Registrar ou alterar pedidos, tratar chamados, mexer em cadastros |
| **Origem** | Enunciado §2; Encontro 1 [38:44] |

### 1.5 Terceirizada

| | |
|---|---|
| **Descrição** | Empresa que coleta na loja e entrega na região dela. Hoje são duas. O motorista é dela, e a comunicação com ele também (Encontro 1 [13:15]) |
| **Como é identificado** | Usuário e senha no portal, perfil Terceirizada; chave própria na API (`RN-SL-053`) |
| **Pode fazer** | Ver as entregas despachadas para ela; informar coleta, saída, entrega com comprovante, não entrega com motivo e devolução ao galpão; enviar planilha de retorno |
| **Não pode fazer** | Ver entregas de outra terceirizada; alterar dados do pedido; decidir o destino da devolução |
| **Origem** | Encontro 1 [15:19], [17:36], [23:17] |

### 1.6 Agente de ocorrências

| | |
|---|---|
| **Descrição** | Assistente de IA que conversa com a loja no WhatsApp quando ela relata um problema. Classifica, colhe descrição e foto, consulta o protocolo de atendimento e escreve uma ação sugerida |
| **Como é identificado** | Credencial de sistema, com token, só para abrir chamados (`INT-004`) |
| **Pode fazer** | Ler o status do pedido pelo código; abrir chamado com a sugestão |
| **Não pode fazer** | Decidir, responder a decisão à loja, ver nome, telefone e endereço do destinatário (`RN-SL-038`) |
| **Origem** | Plano do agente |

### 1.7 Destinatário

| | |
|---|---|
| **Descrição** | O consumidor que recebe o pacote. Quando a entrega atrasa, procura a loja, e não a SEALog (Enunciado §2) |
| **Como é identificado** | Não entra no sistema; aparece como dado da entrega |
| **Pode fazer** | — |
| **Não pode fazer** | — |
| **Origem** | Enunciado §2; `Q-SL-15` |

## 2. Matriz de permissões

| Funcionalidade | Loja | Atendente | Coordenador | Financeiro | Terceirizada | HUs |
|---|---|---|---|---|---|---|
| Fazer, acompanhar, editar e cancelar pedido pelo WhatsApp | Sim, os próprios | — | — | — | — | `HU-SL-001` a `HU-SL-003` |
| Registrar pedido fora do formulário e importar planilha de loja | — | Sim | Sim | — | — | `HU-SL-004` |
| Cadastrar loja e autorizar números | — | — | Sim | — | — | `HU-SL-005` |
| Manter dados comerciais da loja | — | Sim | Sim | — | — | `HU-SL-006` |
| Cadastrar terceirizada | — | — | Sim | — | — | `HU-SL-007` |
| Manter a tabela de regiões e resolver "Aguardando região" | — | — | Sim | — | — | `HU-SL-007`, `HU-SL-010` |
| Consultar a lista de entregas | — | Sim | Sim | Sim, só leitura | — | `HU-SL-009` |
| Alterar dados da entrega | — | Sim | Sim | — | — | `HU-SL-012` |
| Ver as entregas despachadas para si | — | — | — | — | Sim | `HU-SL-011` |
| Informar status e comprovante | — | — | — | — | Sim | `HU-SL-013` a `HU-SL-015` |
| Conferir comprovante | — | Sim | Sim | Sim, só leitura | — | `HU-SL-016` |
| Relatar problema | Sim, pelo agente | — | — | — | — | `HU-SL-017` |
| Tratar chamado | — | Sim | Sim | — | — | `HU-SL-018` |
| Registrar chegada no galpão | — | Sim | Sim | — | — | `HU-SL-019` |
| Decidir o destino no galpão | — | — | Sim | — | — | `HU-SL-019` |
| Consultar afetados e avisar em lote | — | Sim | Sim | Só consulta | — | `HU-SL-021` |
| Fechar cobrança e pagamento | — | — | — | Sim | — | `HU-SL-022`, `HU-SL-023` |
| Exportar para planilha | — | Sim | Sim | Sim | — | `HU-SL-009`, `HU-SL-021` a `HU-SL-023` |
| Cadastrar usuários e desbloquear acesso | — | — | Sim | — | — | `HU-SL-024` |

## 3. Autenticação

A equipe entra no painel com usuário e senha, e o perfil define o menu e as ações; a permissão é
conferida no servidor (`RN-SL-051`). Cinco tentativas seguidas sem sucesso bloqueiam a entrada por
um tempo (`RN-SL-052`; `Q-SL-17`). A terceirizada entra no portal da mesma forma, e na API usa uma
chave própria; pelos dois caminhos vê só o que foi despachado para ela (`RN-SL-053`). A loja não tem
senha: o número de WhatsApp autorizado é a identificação (`RN-SL-054`). O agente de ocorrências usa
um token de sistema, que só abre chamados.

> **Pergunta `Q-SL-10`:** confirmar os perfis. O enunciado nomeia atendentes, analistas, o
> coordenador e o financeiro; com o pedido entrando pelo formulário, o trabalho do analista de
> copiar o grupo para a planilha deixa de existir. Quem era analista entra como atendente?

**Referências** — Enunciado §2; Encontro 1 [08:38], [13:15], [38:44]; Planejamento da equipe;
Plano do agente.
