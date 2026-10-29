# SEALog — Infraestrutura e custos

Quanto custa rodar o SEALog na arquitetura proposta em [`arquitetura.md`](arquitetura.md), com a
stack escolhida em `DEC-SL-21`. A SEALog é uma empresa pequena em expansão, não deu um número de
orçamento e pediu custo controlado (Encontro 1 [29:03]); foi o custo da frota própria que a levou a
terceirizar (Encontro 1 [30:33]). A meta do mês que vem é de cerca de 400 entregas por dia
(Encontro 1 [23:40]): numa operação de segunda a sábado, são perto de **10.400 entregas por mês**,
o número usado aqui para o custo por entrega.

> **Sobre os valores.** As faixas de WhatsApp, automação e modelo de linguagem vêm do plano do agente
> de ocorrências (29/10/2026). As de servidor, banco, arquivos e painel foram levantadas em
> 29/10/2026 nos planos de entrada de cada fornecedor, em dólar, e convertidas a **R$ 5,50 por
> dólar**: uma margem sobre os R$ 5,22 da última cotação que conferimos (28/09/2026). Fornecedores
> mudam preço e o dólar oscila: **confira antes de contratar.** Imposto sobre compra em dólar não
> está incluído.

---

## 1. A stack e onde cada parte roda

| Parte | Tecnologia | Onde roda | Por quê |
|---|---|---|---|
| Back end e WhatsApp | Python com FastAPI: APIs REST, webhook da Meta e leitura da planilha modelo da terceirizada | Render, serviço web | O Python lê planilha com bibliotecas maduras; um serviço só atende as quatro portas (`DEC-SL-12`, `DEC-SL-21`) |
| Banco | PostgreSQL gerenciado | Supabase | O dado é relacional; backup diário e janela de recuperação já vêm no plano |
| Fotos e planilhas | Armazenamento de arquivos | Supabase | Mesma conta do banco; endereço temporário para o painel ver a foto |
| Painel e portal | React (ou Next.js), um código para os dois, que chama só o FastAPI | Render, site estático; ou Vercel | `DEC-SL-13`; painel interno, sem necessidade de página montada no servidor |
| Tempo real do painel | WebSocket ou eventos enviados pelo FastAPI, numa instância no patamar 1 | Mesmo serviço do back end | `RNF-SL-09` |
| Tarefas em segundo plano | Fila numa tabela do banco, lida por um laço do próprio serviço; processo próprio só no patamar 2 | Mesmo serviço do back end | Avisos com nova tentativa e despacho sem pagar fila à parte (`DEC-SL-17`) |
| Agente de ocorrências | n8n Cloud com GPT-4o; chama a rota de chamados do FastAPI com chave fixa | n8n Cloud | `DEC-SL-14` |
| Canal da loja | Plataforma oficial da Meta; o webhook chega ao FastAPI | Meta | `DEC-SL-15` |
| Publicação | GitHub com testes automáticos e publicação por gatilho | GitHub Actions | `RNF-SL-19` |

**Duas regras que protegem os requisitos.**

1. **A chave de serviço do Supabase existe só no back end.** O painel nunca fala direto com o banco:
   toda ação passa pelo FastAPI, que confere o perfil (`RNF-SL-11`) e grava o histórico
   (`RNF-SL-14`). A conexão do back end usa o pooler de conexões do Supabase.
2. **Cada ambiente tem o seu banco.** Homologação e produção não compartilham dados nem chaves;
   dados reais não vão para a homologação.

**Região dos dados (a decidir).** O Render não tem região no Brasil (Oregon, Ohio, Virgínia,
Frankfurt e Singapura); o Supabase tem São Paulo.

| Opção | Ganho | Custo |
|---|---|---|
| A. Back end e banco na Virgínia | Menor latência entre os dois; cada tela faz várias consultas | Dados pessoais fora do Brasil: pede base legal e cláusulas de transferência internacional (LGPD, `RNF-SL-13`) |
| B. Banco em São Paulo e back end nos EUA | Dados no Brasil | Cada consulta cruza o continente; telas mais lentas (`RNF-SL-08`) |
| C. Back end em provedor com região no Brasil | Dados no Brasil e baixa latência | Provedor mais complexo, sem cotação aqui |

A proposta é começar pela **A**, registrar a transferência na política de privacidade e migrar se a
SEALog exigir dados no Brasil: o banco não muda de região no mesmo lugar, a migração é por cópia e
restauração. A escolha fica com a equipe e com a SEALog.

---

## 2. Custos

Patamar 1 (até cerca de 400 entregas por dia e duas terceirizadas), sem o agente de consulta de
status, que ficou fora por enquanto (`DEC-SL-10`).

| Item | Fornecedor e plano | O que inclui | Custo estimado | Quando muda |
|---|---|---|---|---|
| WhatsApp | Plataforma oficial da Meta | Menu, formulário, acompanhamento, avisos e a conversa do agente | **R$ 150 a R$ 450 por mês**, pela estimativa de 3.000 conversas a R$ 0,05 a R$ 0,15 cada | A Meta cobra por mensagem de modelo enviada pela empresa — os avisos — e não cobra a resposta dentro da janela de atendimento aberta pela loja; a conferir na tabela vigente. Quem paga: a SEALog (`Q-SL-12`) |
| Automação do agente | n8n Cloud | Assinatura da plataforma, sem servidor para manter | **R$ 120 a R$ 250 por mês** (20 a 40 euros) | Varia com o euro e com o limite de execuções do plano |
| Modelo de linguagem do agente | OpenAI, GPT-4o | Cerca de 1.000 atendimentos de ocorrência por mês, cerca de 4.000 trocas de mensagem | **R$ 90 a R$ 120 por mês** (16 a 22 dólares) | Cresce com o número de ocorrências, não de entregas |
| **Subtotal dos serviços** | | | **R$ 360 a R$ 820 por mês** | |
| Banco, arquivos e backup | Supabase Pro | Banco de 8 GB, 100 GB de arquivos, 250 GB de tráfego, backup diário guardado por 7 dias, tempo real | **R$ 140 a R$ 165 por mês** (25 a 30 dólares) | Banco acima de 8 GB (0,125 dólar por GB), arquivos acima de 100 GB (0,021 dólar por GB), computação maior |
| Servidor do back end | Render, serviço web Standard (1 CPU, 2 GB) | O FastAPI, o webhook, as tarefas e o tempo real | **R$ 140 por mês** (25 dólares) | Gatilhos de `escalabilidade`. O plano Starter (512 MB, 7 dólares) existe, mas a leitura de planilha pede memória: não serve para produção |
| Homologação | Render, serviço web Starter | Cópia do back end para testar versões antes da produção | **R$ 40 por mês** (7 dólares) | Pode ser desligada fora dos ciclos de teste |
| Painel e portal | Render, site estático, ou Vercel Pro | O código React, servido por CDN | **R$ 0** no site estático do Render; **R$ 110 por mês** (20 dólares) na Vercel | O plano gratuito da Vercel não permite uso comercial; o site estático dispensa o plano pago |
| **Subtotal de infraestrutura** | | | **R$ 315 a R$ 450 por mês** | |
| **Total mensal** | | | **R$ 675 a R$ 1.270** | Cerca de **R$ 0,06 a R$ 0,12 por entrega**, a 10.400 entregas por mês |
| Monitoramento externo, domínio e cópia das fotos em segundo fornecedor | — | — | **Não estimado** | Planos gratuitos costumam bastar para o monitor; confirmar o uso comercial. A cópia custa centavos por GB |
| Desenvolvimento | — | Agente de ocorrências: 10 a 14 dias úteis, com o mapeamento do protocolo | **Não estimado em reais** | O esforço relativo de cada item está no backlog |

**As fotos não pesam no custo.** São cerca de 10.400 por mês. Comprimidas no envio para perto de
500 KB, dão cerca de 5 GB por mês e levam uns 20 meses para encher os 100 GB do plano; sem
compressão, perto de 15 GB por mês e uns 7 meses. Depois disso, 100 GB a mais custam cerca de
2 dólares por mês. O que decide a guarda é a LGPD (`Q-SL-16`), não o preço.

**O que pesa.** Com cerca de 10.400 entregas por mês, a infraestrutura é quase **custo fixo**:
quanto mais entregas, menor o custo por entrega. O WhatsApp continua sendo a maior parcela e a única
que cresce com as entregas. A faixa dele parte de 3.000 conversas por mês; se cada entrega gerar um
aviso à loja, são cerca de 10.400 mensagens, mais de três vezes esse volume. A forma mais simples de
segurar a conta é avisar por loja, não por entrega, nos dias de muitas ocorrências (`RN-SL-044`). O
modelo de linguagem cresce com as ocorrências: quanto melhor o pedido na entrada e o padrão de
comprovante, menos ocorrência e menos custo.

## 3. Se passar do patamar 1

Cada subida de custo tem o gatilho de [`escalabilidade.md`](escalabilidade.md): só se paga o patamar
seguinte quando o indicador cruza o limite.

| Gatilho | Mudança | Custo indicativo |
|---|---|---|
| Processamento do banco acima de 70% por 3 dias | Supabase com computação Medium no lugar da Small | Cerca de **+R$ 250 por mês** (60 dólares contra 15) |
| Fila de avisos atrasada | Processo próprio para as tarefas, no Render | **R$ 40** (Starter) a **R$ 140** (Standard) por mês |
| Back end sem folga de processamento ou memória | Render Pro (2 CPU, 4 GB) | Cerca de **+R$ 330 por mês** (85 dólares contra 25) |
| Fotos acima de 100 GB | Mover as antigas; aplicar o prazo de guarda | 0,021 dólar por GB por mês |
| Buscas lentas depois de rever índices | Cópia só de leitura do banco | Não cotado |

## 4. Operação

| Rotina | Como | Atende |
|---|---|---|
| Cópia de segurança | Banco: backup diário automático do Supabase, guardado por 7 dias; a recuperação a qualquer instante é opcional e paga, e não é exigida. Fotos: o backup do banco não leva os arquivos, então uma tarefa agendada copia as fotos para um segundo armazenamento. Restauração testada antes da virada | `RNF-SL-06` |
| Publicação de versão | A cada versão aprovada, a pipeline roda os testes e publica na homologação. A produção só recebe a versão por gatilho manual, nunca entre 7h e 19h de segunda a sábado | `RNF-SL-04`, `RNF-SL-19` |
| Mudanças no banco | Migrações versionadas, aplicadas antes da versão do back end e sempre testadas na homologação | `RNF-SL-14`, `RNF-SL-17` |
| Monitoramento | Monitor externo na rota de saúde do back end e no webhook; estado do número de WhatsApp na Meta; registro de erros das integrações; avisos que falharam e entregas sem retorno no painel | `RNF-SL-04`, `RNF-SL-20` |
| Segredos e chaves | Chaves em variáveis de ambiente do Render, nunca no código. O coordenador troca a chave de uma terceirizada sem afetar a outra; a chave do agente e a de serviço do Supabase são trocadas a cada saída de quem as conhecia | `RNF-SL-12` |
| Contas dos fornecedores | Meta, n8n, OpenAI, Supabase e Render ficam em nome da SEALog, com dois responsáveis; a equipe de software entra como acesso, não como dona | `Q-SL-12` |
| Teto de gasto | Alerta de orçamento ou limite de gasto ligado onde o fornecedor oferece (Supabase, Vercel, OpenAI), para um pico de uso não virar fatura | `RNF-SL-18` |
| Revisão de custo | Mensal: fatura de cada serviço dividida pelas entregas do mês | `RNF-SL-18` |

## 5. A confirmar

| Item | Proposta | Quem decide |
|---|---|---|
| Região dos dados | Opção A da seção 1 | Equipe e SEALog |
| Hospedagem do painel | Site estático no Render, a não ser que o Next.js precise de página montada no servidor | Equipe de front end |
| Login do painel e do portal | Módulo de acesso do back end (`RNF-SL-10`, `RNF-SL-11`); o Supabase Auth é uma opção | Equipe de back end |
| Cópia das fotos | Segundo armazenamento de outro fornecedor, por tarefa agendada | Equipe de infraestrutura |
| Prazo de guarda das fotos | `Q-SL-16` | SEALog |
