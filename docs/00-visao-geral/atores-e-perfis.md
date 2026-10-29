# Atores e perfis

Quem participa da operação da SEALog e como entra no sistema. O detalhe por funcionalidade — a
matriz de permissões — está em
[`docs/01-sealog/01-atores-e-permissoes.md`](../01-sealog/01-atores-e-permissoes.md).

---

## 1. Atores

| Ator | Papel na operação | Entra no sistema como | Origem |
|---|---|---|---|
| Loja | Cliente da SEALog; pede pelo WhatsApp | Sem senha: número de WhatsApp autorizado | Enunciado §2; Encontro 1 [08:38] |
| Atendente | Recebe as lojas e responde; trata chamados | Perfil Atendente | Enunciado §2 |
| Coordenador de operação | Mantém lojas, terceirizadas e regiões; decide o que volta ao galpão | Perfil Coordenador | Enunciado §2; Encontro 1 [47:01] |
| Financeiro | Cobra as lojas e paga as terceirizadas | Perfil Financeiro | Enunciado §2; Encontro 1 [38:44] |
| Terceirizada | Coleta na loja e entrega na região dela; cuida do motorista | Perfil Terceirizada no portal; chave na API | Encontro 1 [13:15], [15:19] |
| Agente de ocorrências | Conversa com a loja sobre o problema e sugere a ação | Credencial de sistema, só para abrir chamados | Plano do agente |
| Destinatário | Recebe o pacote; procura a loja quando atrasa | Não entra; aparece como dado da entrega | Enunciado §2 |

O analista, que hoje copia o grupo para a planilha, deixa de ter esse trabalho; a lista final de
perfis está em `Q-SL-10`.

## 2. Modelo de autorização

Perfil único por usuário, que define o menu e as ações, conferido no servidor (`RN-SL-051`). Cinco
tentativas seguidas sem sucesso bloqueiam a entrada por um tempo (`RN-SL-052`). A terceirizada vê
só as entregas despachadas para ela (`RN-SL-053`). A loja é identificada pelo número autorizado e
vê só os próprios pedidos (`RN-SL-054`).

## 3. Horários que limitam os atores

| Quem | Horário | Efeito na solução |
|---|---|---|
| Atendimento | Segunda a sexta, 8h às 18h; sábado, 8h às 12h | Avisos à loja e acompanhamento funcionam sem atendente (`RN-SL-043`) |
| Operação | Segunda a sábado, 7h às 19h | Chamado sem conclusão às 19h fica destacado (`RN-SL-046`) |
| Coleta, antes da terceirização | 14h às 18h; a loja levava ao galpão até 17h | Se vale para a terceirizada: `Q-SL-02` |
| Volta ao galpão, antes da terceirização | 17h às 18h | Se vale para a terceirizada: `Q-SL-03` |

**Referências** — Enunciado §2; Encontro 1; Plano do agente.
