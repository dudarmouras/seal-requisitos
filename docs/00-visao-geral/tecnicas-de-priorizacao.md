# SEALog — Técnicas de priorização

Como a equipe decide o que entra primeiro no backlog (`DEC-SL-20`), e por quê. Cada técnica
responde a uma pergunta diferente; nenhuma decide sozinha. O resultado está em
[`backlog.md`](backlog.md).

---

## 1. As técnicas em uso

| Técnica | Pergunta que responde | Onde aparece no backlog |
|---|---|---|
| **MoSCoW** | A release funciona sem este item? | Coluna `MoSCoW` |
| **Valor para o cliente** | Quanto isto muda a vida da loja, da terceirizada e do consumidor? | Coluna `Valor` |
| **Esforço** | Quanto custa construir? | Coluna `Esforço` |
| **Matriz valor × esforço** | O que dá mais retorno por dia de trabalho? | Quadro no alto da página do backlog |
| **Dependência** | O que precisa existir antes? | Coluna `Depende de` |
| **Release por caso do enunciado** | Que caso inteiro a SEALog passa a ter resolvido? | Seção Releases |
| **Prioridade da história** | Quanto esta história pesa para quem a usa? | Selo Alta ou Média na linha do item |

## 2. MoSCoW

Quatro classes, aplicadas a cada release e não ao produto inteiro: um item pode ser Must na R1 e
Should na R2.

| Classe | Regra de uso | Exemplo no backlog |
|---|---|---|
| **Must** | Sem ele a release não resolve o caso a que se propõe | Pedido pelo WhatsApp com formulário obrigatório (`BL-SL-06`) |
| **Should** | Importante, mas há contorno enquanto não sai | Exportação dos pedidos da terceirizada em PDF ou planilha (`BL-SL-44`): até lá, a terceirizada usa o portal |
| **Could** | Entra se sobrar tempo, sem prejudicar a release | Painel de chamados em tempo real (`BL-SL-42`): até lá, a equipe recarrega a tela |
| **Won't** | Fora desta versão, de propósito, com o motivo escrito | Aplicativo do motorista (`BL-SL-29`): o motorista é da terceirizada (`DEC-SL-04`) |

**Como evitar o erro comum.** Se tudo é Must, a classe não prioriza nada. Por isso todo Must tem de
apontar o caso do enunciado que ele resolve, ou o item de que outro Must depende. Um item que
ninguém consegue justificar assim cai para Should.

## 3. Valor e esforço

**Valor** mede o efeito para o cliente, em três níveis.

| Nível | Critério |
|---|---|
| **Alto** | Resolve um dos casos do enunciado ou a causa comum a vários |
| **Médio** | Tira trabalho manual da equipe ou da terceirizada |
| **Baixo** | Conforto: melhora, mas ninguém para sem ele |

**Esforço** é uma estimativa por tamanho, não por hora, porque ainda não há equipe de construção
definida: **P** são dias, **M** uma a duas semanas, **G** mais de duas semanas ou dependente de
terceiro.

A **matriz valor × esforço** cruza os dois. O canto de muito valor e pouco esforço entra primeiro;
muito valor e muito esforço pede começar cedo; pouco valor e muito esforço fica para depois ou fora.

| | Esforço P | Esforço M | Esforço G |
|---|---|---|---|
| **Valor alto** | Faça já | Faça na ordem das dependências | Comece cedo, porque leva tempo |
| **Valor médio** | Faça se couber | Pergunte se há contorno | Adie |
| **Valor baixo** | Faça se sobrar | Adie | Deixe fora |

## 4. Dependência e ordem de entrega

A ordem final não é a do valor puro: um item não pode ser construído antes do que ele usa. A coluna
`Depende de` forma uma sequência, e a coluna `Ordem` é o resultado de combinar as duas coisas.

Dois casos mostram por que a ordem muda:

- **Prazo de terceiro.** A conta do WhatsApp Business e os modelos de mensagem (`BL-SL-05`) são
  aprovados pela Meta, com prazo que a equipe não controla. O item é G e vem primeiro: quanto antes
  começa, menos tempo a R1 espera.
- **Fundação sem valor visível.** A base técnica (`BL-SL-33`) não resolve caso nenhum, mas nenhuma
  tela ou canal roda sem ela. Entra em segundo, porque quase tudo depende dela.

## 5. Releases por caso do enunciado

Em vez de entregar "todas as telas de um módulo", cada release resolve casos inteiros, para que a
SEALog sinta a diferença no dia a dia.

| Release | Casos que resolve |
|---|---|
| **R1** | "Pedido com informações incompletas" e "O registro incorreto" |
| **R2** | "O buquê de sábado" e "A segunda-feira de chuva" |
| **R3** | A cobrança e o pagamento saindo do registro |

Cada release corresponde a uma fase da [adoção gradual](adocao-gradual.md): só se avança quando o
critério de saída da fase é cumprido.

## 6. Quando a ordem diverge da prioridade da história

Cada história de usuário tem uma prioridade (Alta ou Média) escrita por quem a descreveu. A
**ordem do backlog** soma a ela o esforço e a dependência, e por isso as duas podem divergir. A
página do backlog marca cada divergência com o selo "≠ ordem".

| História | Prioridade | Ordem no backlog | Por quê |
|---|---|---|---|
| `HU-SL-022`, `HU-SL-023` (fechamentos) | Média | Must na R3 | São a razão de ser da release financeira |
| `HU-SL-017` (agente de ocorrências) | Alta | R2 | Não depende de protocolo escrito: a SEALog não tem um por enquanto (`Q-SL-05`) |

## 7. Técnicas consideradas e não usadas

| Técnica | Por que não |
|---|---|
| **RICE e ICE** (alcance, impacto, confiança, esforço) | Pedem dados de alcance e de confiança que a SEALog ainda não tem; com poucas lojas e duas terceirizadas, o alcance é quase igual para todos os itens |
| **Kano** (o que encanta e o que é obrigação) | Exige pesquisa com os clientes; pode entrar depois do piloto, para escolher o que vem na R4 |
| **Custo do atraso (WSJF)** | Precisa de valor em reais por item; a SEALog não deu orçamento nem número de custo do problema atual |
| **Ordem só pela prioridade da história** | Ignora dependência e esforço (`DEC-SL-20`) |

Quando a SEALog passar os números que faltam (volume por dia), RICE e custo do atraso
ficam viáveis, e esta página passa a registrar a mudança.

## 8. Quando a equipe revisa

O backlog é revisado a cada fim de release e quando uma decisão muda o escopo. Em cada revisão:

1. Confere se os Must de cada release ainda resolvem o caso a que se propõem.
2. Rebaixa para Should o Must que ninguém consegue justificar.
3. Refaz a matriz valor × esforço com o esforço real medido na release anterior.
4. Registra a mudança de ordem e o motivo, em vez de só reordenar a lista.
