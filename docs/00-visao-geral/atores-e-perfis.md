# Atores e perfis

Quem participa da operação da SEALog e como entra no sistema. O detalhe por funcionalidade — a
matriz de permissões — está em
[`docs/01-sealog/01-atores-e-permissoes.md`](../01-sealog/01-atores-e-permissoes.md).

---

## 1. Atores

| Ator | Papel na operação hoje | Entra no sistema como | Origem |
|---|---|---|---|
| Cliente | Pede a entrega por WhatsApp, Instagram ou planilha | Sem login: link de pedido e link de rastreio | Gargalos §1, §9 |
| Atendente | Recebe pedidos e responde clientes; horário limitado, sábado até 12h | Perfil Atendente | Gargalos §1, §4, §9 |
| Analista | Copia os pedidos para a planilha; é um dos saltos da consulta | Perfil Analista | Gargalos §2, §4 |
| Coordenador de operação | Monta as rotas e decide as exceções | Perfil Coordenador | Gargalos §2, §5 |
| Motorista | Executa as rotas; cerca de 18 | Perfil Motorista, no celular | Gargalos §3 |
| Financeiro | Calcula a cobrança | Perfil Financeiro | Gargalos §6 |
| Destinatário | Recebe o pacote | Não entra; aparece como dado da entrega | Implícito na operação |

## 2. Modelo de autorização

Perfil único por usuário, que define o menu e as ações (`RN-SL-049`, `RN-SL-051`). O cliente nunca
tem conta: os links dão acesso só à entrega ou aos pedidos a que pertencem (`RN-SL-050`). Se uma
pessoa acumula papéis e quem administra os usuários está em `Q-SL-10`.

## 3. Horários que limitam os atores

| Quem | Horário | Efeito na solução |
|---|---|---|
| Atendimento | Limitado; sábado só até 12h | Avisos e rastreio funcionam sem atendente (`RN-SL-032`) |
| Operação | 7h às 19h | Rotas do dia; ocorrência sem decisão às 19h fica destacada (`RN-SL-023`, `RN-SL-038`) |
| Coleta | 14h às 18h; cliente leva ao galpão até 17h | `RN-SL-016`, `RN-SL-017` |

**Referências** — Gargalos §1 a §6, §9.
