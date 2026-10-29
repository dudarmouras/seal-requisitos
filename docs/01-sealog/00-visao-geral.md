# SEALog — Visão geral

O SEALog é o sistema proposto para a operação de entregas da SEALog, o caso do Desafio Prático em
Grupo do SEAL 2026.2/2027.1. A SEALog é uma empresa de logística regional que entrega para lojas de
bairro, farmácias, floriculturas, papelarias e pequenos e-commerces. Hoje a operação corre em
WhatsApp e planilhas (Enunciado §2).

No Encontro 1 (28/10/2026), o cliente contou a mudança que reorganiza a solução: **a SEALog
terceirizou as entregas** para duas empresas, uma por região, porque manter frota própria estava
caro (Encontro 1 [30:33]). A terceirizada coleta na loja e entrega; o motorista é dela. A SEALog
continua dona do pedido, do atendimento à loja, do que dá errado e da cobrança — e é aí que o
SEALog atua.

Esta documentação **não é engenharia reversa de um sistema existente**: é a proposta de solução,
e cada história responde a um gargalo da operação ou a uma decisão da reunião.

---

## 1. Propósito do sistema

Ser a **fonte única da verdade sobre o estado de cada entrega**, agora que ela passa por três mãos:
a loja que pede, a SEALog que organiza e a terceirizada que entrega. A informação que hoje nasce no
WhatsApp, passa por pessoas e acaba copiada em planilhas (Gargalos §8) passa a nascer no sistema: a
loja pede por um formulário no próprio WhatsApp, a terceirizada devolve o status num padrão único, e
quem precisa saber onde está uma entrega consulta, em vez de perguntar.

## 2. Públicos atendidos

| Público | Uso típico |
|---|---|
| Lojas (clientes da SEALog) | Fazer, acompanhar e editar pedidos pelo WhatsApp; relatar problema; receber avisos |
| Atendentes | Registrar o pedido que chega fora do formulário, tratar chamados, responder à loja |
| Coordenador de operação | Manter lojas, terceirizadas e regiões; decidir o destino do que volta ao galpão |
| Financeiro | Fechar a cobrança das lojas e o pagamento das terceirizadas |
| Terceirizadas (hoje duas) | Receber os pedidos da região e devolver status e comprovante, pela API, pelo portal ou por planilha |
| Agente de ocorrências | Conversar com a loja sobre o problema e sugerir a ação à equipe, sem decidir |

Perfis, permissões e autenticação estão em [`01-atores-e-permissoes.md`](01-atores-e-permissoes.md).

## 3. Escopo desta documentação

**Dentro:** a entrada do pedido pelo WhatsApp, os cadastros de lojas, terceirizadas e regiões, o
despacho para a terceirizada da região, o retorno de status e comprovante, as ocorrências e
devoluções com o agente de ocorrências, o financeiro dos dois lados e o acesso por perfil.

**Fora:**

| Item | Motivo |
|---|---|
| Aplicativo do motorista, roteiro e montagem de rotas | O motorista e a rota são da terceirizada (Encontro 1 [13:15], [17:36]; `DIV-SL-01`) |
| Etiqueta impressa | O pacote é identificado pelo código SEALog (`RN-SL-027`) |
| Agente de consulta de status por IA | Fora por enquanto; o acompanhamento é um botão do menu, sem IA (`DIV-SL-04`) |
| Emissão de nota fiscal e cobrança bancária | A origem só cita o cálculo da cobrança (Enunciado §2) |
| Rastreamento do veículo por GPS | Não citado na origem; o status vem do retorno da terceirizada |
| Aviso ao destinatário | A SEALog fala com a loja, que fala com o consumidor (Enunciado §2; `Q-SL-15`) |
| Interface visual final | As telas descrevem campos e ações; o desenho é da equipe de UX |

## 4. Stack legada

Não há sistema legado. A "stack" de hoje é a operação manual:

| Etapa | Ferramenta de hoje | Origem |
|---|---|---|
| Entrada de pedidos | Um número de WhatsApp, em texto, áudio ou planilha própria do cliente | Enunciado §2 |
| Registro | Grupo interno de WhatsApp copiado à mão para a planilha online do dia, uma por analista | Enunciado §2 |
| Identificação do pacote | Etiqueta escrita à mão | Enunciado §2 |
| Execução, depois da terceirização | A terceirizada atualiza a planilha da SEALog ou avisa por WhatsApp, cada uma no seu padrão | Encontro 1 [13:15], [26:53] |
| Volta ao galpão | Coordenador avalia caso a caso, sem regra formal | Enunciado §2 |
| Cobrança | Planilha do dia, fechada às 19h | Enunciado §2 |

A arquitetura proposta — baseada em APIs, com banco relacional único — está em
[`arquitetura`](../00-visao-geral/arquitetura.md).

## 5. Inventário de módulos

| # | Módulo | Slug | Escopo | HUs | Telas |
|---|---|---|---|---|---|
| 1 | Entrada de pedidos | `entrada-pedidos` | Menu e formulário no WhatsApp, acompanhar, editar, e o pedido que chega fora do formulário | `HU-SL-001` a `HU-SL-004` | `TL-SL-002` a `TL-SL-004` |
| 2 | Cadastros | `cadastros` | Lojas e números autorizados, dados comerciais, terceirizadas e tabela de regiões | `HU-SL-005` a `HU-SL-008` | `TL-SL-005` a `TL-SL-007` |
| 3 | Despacho | `despacho` | Lista única de entregas, distribuição pela região, envio à terceirizada e alterações | `HU-SL-009` a `HU-SL-012` | `TL-SL-008`, `TL-SL-009` |
| 4 | Retorno da terceirizada | `retorno-terceirizada` | Status pela API, pelo portal ou por planilha, e o comprovante padrão | `HU-SL-013` a `HU-SL-016` | `TL-SL-010`, `TL-SL-011` |
| 5 | Ocorrências e devoluções | `ocorrencias` | Relato pelo WhatsApp com o agente, chamados, devolução no galpão, avisos à loja e afetados por loja | `HU-SL-017` a `HU-SL-021` | `TL-SL-012` a `TL-SL-015` |
| 6 | Financeiro | `financeiro` | Cobrança das lojas, pagamento das terceirizadas e exportação | `HU-SL-022`, `HU-SL-023` | `TL-SL-016`, `TL-SL-017` |
| 7 | Acesso | `acesso` | Entrada da equipe e da terceirizada por perfil | `HU-SL-024` | `TL-SL-001` |

## 6. Os quatro casos do enunciado

O enunciado traz quatro casos (Enunciado §8). A tabela diz que parte do sistema responde a cada um —
é o teste de aceite do conjunto, já com a terceirização.

| Caso | O que aconteceu | Como o SEALog responde | HUs |
|---|---|---|---|
| Pedido com informações incompletas | Sr. Paulo sem número nem telefone; Cond. MarAzul sem rua nem telefone | O formulário do WhatsApp não envia sem os dados obrigatórios; o pedido que chega fora dele fica pendente e a loja completa pelo WhatsApp | `HU-SL-001`, `HU-SL-004` |
| O buquê de sábado | Às 9h40 o motorista avisou no grupo que não achava o endereço; a mensagem foi vista às 11h, a floricultura soube pela consumidora às 11h30 | O Não entregue da terceirizada abre um chamado no painel e manda aviso automático à loja, sem depender do horário do atendimento | `HU-SL-013`, `HU-SL-018`, `HU-SL-020` |
| O registro incorreto | "Ok" na linha errada; três dias depois, um dia para achar a foto; pacote no apartamento errado | Um registro por entrega; o Entregue só vale com foto, hora, nome de quem recebeu e entregador, presos ao código; a loja relata e o chamado já traz o comprovante | `HU-SL-009`, `HU-SL-016`, `HU-SL-017` |
| A segunda-feira de chuva | Cerca de 40 atrasos e mais de 120 mensagens, sem saber que clientes avisar | Consulta de afetados agrupada por loja, com um aviso por loja | `HU-SL-021` |

## 7. Restrições

| Restrição | Efeito nos requisitos |
|---|---|
| As lojas pedem por WhatsApp e não vão mudar de canal (Enunciado §2; Encontro 1 [07:35]) | Pedido, acompanhamento, edição e relato acontecem na conversa do WhatsApp, sem instalar nada (`RN-SL-002`) |
| Atendimento de segunda a sexta, 8h às 18h, e sábado, 8h às 12h; operação de segunda a sábado, 7h às 19h (Enunciado §2) | Avisos à loja e acompanhamento funcionam sem atendente (`RN-SL-043`) |
| Terceirizadas com pouca habilidade com tecnologia; adaptação gradual (Encontro 1 [23:17]) | Três caminhos de retorno — API, portal simples e planilha traduzida — com o mesmo padrão (`RN-SL-029`) |
| Cada terceirizada tem seu padrão, e outras podem entrar (Encontro 1 [26:53], [27:54]) | Padrão único de status e comprovante para todas (`RN-SL-019`) |
| Empresa pequena em expansão; custo controlado (Encontro 1 [29:03], [30:33]) | Serviços pagos por uso; custo estimado em [`infraestrutura-e-custos`](../00-visao-geral/infraestrutura-e-custos.md) |
| Não é obrigatório entregar sistema funcional (Enunciado §5) | A documentação descreve comportamento; o protótipo é da equipe |

## 8. Volumetria

| Medida | Valor | Origem |
|---|---|---|
| Entregas por dia, a partir do mês que vem | Cerca de 400 | Encontro 1 [23:40] |
| Terceirizadas | Duas, uma por região | Encontro 1 [15:19] |
| Pedidos que chegam incompletos hoje | Cerca de 1 em 5 | Enunciado §2 |
| Tempo de resposta a "cadê minha entrega?" hoje | De 20 minutos a mais de 2 horas | Enunciado §2 |
| Motoristas antes da terceirização | Cerca de 18, num grupo só | Enunciado §2 |
| Entregas afetadas no caso "A segunda-feira de chuva" | Cerca de 40, com mais de 120 mensagens | Enunciado §8 |
| Lojas ativas e volumes por pedido | Não informado na documentação de origem | — |

## 9. Documentos de origem

O inventário com `sha256` e a ordem de precedência estão em
[`fontes/README.md`](../../fontes/README.md). Quando as fontes discordam, vale a mais recente: a
reunião de 28/10/2026 manda sobre o enunciado.

| Documento | Como se cita |
|---|---|
| Enunciado do Desafio Prático em Grupo (`Projeto da Dinâmica.pdf`) | `Enunciado §N`, pelas seções 1 a 8 do PDF |
| Material de apoio | `Apoio §N` |
| Resumo dos gargalos (`SEALog gargalos e problemas da operação.pdf`) | `Gargalos §N` |
| Encontro 1 com o cliente, 28/10/2026 | `Encontro 1 [mm:ss]` |
| Planejamento da equipe | `Planejamento da equipe` |
| Plano do agente de ocorrências, 29/10/2026 | `Plano do agente` |

O resumo dos gargalos não numera as seções. A numeração usada nas referências é esta:

| § | Seção do resumo |
|---|---|
| §1 | Entrada de pedidos |
| §2 | Registro e planejamento |
| §3 | Execução e comunicação do motorista |
| §4 | Consulta de status ("cadê minha entrega?") |
| §5 | Exceções e decisões |
| §6 | Financeiro |
| §7 | Os quatro casos do enunciado |
| §8 | Causa comum |
| §9 | Restrições que o enunciado impõe à solução |
