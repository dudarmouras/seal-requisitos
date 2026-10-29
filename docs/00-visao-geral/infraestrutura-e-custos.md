# SEALog — Infraestrutura e custos

Onde o SEALog roda e quanto custa por mês, para a stack proposta em
[`arquitetura.md`](arquitetura.md). Como a arquitetura, é **proposta** (`Q-SL-01`).

> **Sobre os valores.** São preços de tabela públicos, consultados em outubro de 2026, em dólar
> convertido a **R$ 5,50**, sem impostos. Os fornecedores mudam preço e limite com frequência:
> **confira na página de cada um antes de contratar.** O volume de entregas por dia não está na
> origem (`Q-SL-02`), e por isso o custo é dado em três cenários, não num número só.

---

## 1. Ambientes

| Ambiente | Para quê | Onde | Custo |
|---|---|---|---|
| **Produção** | A operação real | Supabase no plano Pro e Vercel no plano Pro | Ver §3 |
| **Homologação** | Testar cada versão com dados de exemplo antes de publicar; treinar a equipe | Projeto Supabase no plano gratuito e versão de prévia da Vercel | Zero (o projeto gratuito pausa quando fica parado, o que serve para homologação) |
| **Desenvolvimento** | O computador de quem programa | Banco local | Zero |

## 2. Serviços

| Serviço | Fornecedor proposto | O que entra no plano | Cobrança além do plano |
|---|---|---|---|
| Banco, autenticação e arquivos | Supabase, plano Pro | US$ 25 por mês, com US$ 10 de crédito de processamento que cobre a menor instância; 8 GB de banco; 100 GB de arquivos; cópia de segurança diária guardada por 7 dias | Banco: cerca de US$ 0,125 por GB. Arquivos: cerca de US$ 0,021 por GB. Instância maior: diferença sobre o crédito |
| Hospedagem da aplicação | Vercel, plano Pro | US$ 20 por assento de quem publica, por mês, com crédito de uso incluso | Uso acima do crédito; assento a mais, US$ 20 |
| Avisos ao cliente | WhatsApp Business, plataforma oficial da Meta | Cobrança por modelo de mensagem entregue (quem paga e se a SEALog já tem conta comercial: `Q-SL-12`). A mensagem de utilidade enviada dentro da janela de atendimento aberta pelo cliente não é cobrada | Mensagem de utilidade no Brasil: entre R$ 0,04 e R$ 0,08 nas fontes consultadas; aqui se usa **R$ 0,08**, o teto. A Meta anunciou cobrança em reais no segundo semestre de 2026 |
| Domínio | Registro.br (`.com.br`) | Cerca de R$ 40 por ano | — |
| Monitoramento de erros | Plano gratuito de um serviço de registro de erros | Suficiente para o patamar 1 | Plano pago, cerca de US$ 26 por mês, a partir do patamar 2 |

## 3. Custo mensal por cenário

### 3.1 Premissas

| Premissa | Valor | Por quê |
|---|---|---|
| Dias de operação por mês | 26 | Segunda a sábado |
| Fotos por entrega | 1, de cerca de 250 KB depois de comprimida no celular | `RF-SL-15` exige uma foto; a compressão é decisão de arquitetura |
| Avisos cobrados por entrega | 1,16: o link de rastreio de toda entrega, mais dois avisos para os cerca de 8% com ocorrência | `RN-SL-033`, `RN-SL-040`; a taxa de ocorrência não está na origem e é estimativa |
| Câmbio | R$ 5,50 por dólar | Referência; atualize na hora de contratar |

### 3.2 Três cenários

| Item | Patamar 1 — 100 entregas/dia | Patamar 2 — 400 entregas/dia | Patamar 3 — 1.500 entregas/dia |
|---|---|---|---|
| Entregas no mês | 2.600 | 10.400 | 39.000 |
| Supabase (plano e processamento) | R$ 138 (US$ 25, menor instância) | R$ 165 (US$ 30, instância pequena) | R$ 413 (US$ 75, instância média) |
| Arquivos (fotos) | Incluso (0,7 GB por mês) | Incluso (2,6 GB por mês) | Incluso no primeiro ano (9,8 GB por mês); depois, cerca de R$ 12 por mês a cada 100 GB |
| Vercel | R$ 110 (1 assento) | R$ 110 (1 assento) | R$ 220 (2 assentos) |
| WhatsApp (avisos) | R$ 240 (3.000 mensagens) | R$ 965 (12.100 mensagens) | R$ 3.620 (45.200 mensagens) |
| Monitoramento | R$ 0 | R$ 143 | R$ 143 |
| Domínio | R$ 3 | R$ 3 | R$ 3 |
| **Total por mês** | **cerca de R$ 490** | **cerca de R$ 1.390** | **cerca de R$ 4.400** |
| **Por entrega** | **R$ 0,19** | **R$ 0,13** | **R$ 0,11** |

O custo por entrega cai com o volume, porque a parte fixa se divide por mais entregas. Nos três
cenários o patamar fica abaixo da meta de R$ 0,25 por entrega (`RNF-SL-15`).

### 3.3 Onde está o dinheiro

O **WhatsApp é a maior parcela**: metade do custo no patamar 1 e mais de 80% no patamar 3, e
cresce na mesma proporção das entregas. É também a parcela mais fácil de reduzir:

| Alavanca | Efeito |
|---|---|
| Mandar o link de rastreio na conversa que o cliente acabou de abrir para fazer o pedido | Dentro da janela de atendimento a mensagem de utilidade não é cobrada; na R1 o atendente já cola o link à mão (`BL-SL-16`) |
| Desconto por volume que a Meta aplica às mensagens de utilidade | Reduz o preço unitário no patamar 3 |
| Avisar em lote por cliente, não por entrega | O caso "Segunda-feira de chuva" vira um aviso por cliente, não um por entrega (`RN-SL-041`) |

## 4. Custos únicos

| Item | Estimativa | Observação |
|---|---|---|
| Impressora térmica de etiquetas para o galpão | R$ 700 a R$ 1.200 | Uma por ponto de impressão (`DEC-SL-05`) |
| Rolos de etiqueta adesiva | Cerca de R$ 0,03 a R$ 0,05 por etiqueta | Custo recorrente, proporcional aos volumes |
| Celulares dos motoristas | Não estimado | A origem não diz se os motoristas usam aparelho próprio nem quem paga o plano de dados |
| Desenvolvimento e implantação | Não estimado | Depende do tamanho da equipe que vai construir; o esforço relativo de cada item está no backlog |

## 5. Operação

| Rotina | Como | Atende |
|---|---|---|
| Cópia de segurança | Diária, automática, guardada por 7 dias no plano Pro; restauração testada antes da virada | `RNF-SL-17` (perda máxima de 24 horas) |
| Publicação de versão | Automática a cada versão aprovada, primeiro em homologação; nunca entre 7h e 19h | `RNF-SL-04` |
| Monitoramento | Monitor externo do link de rastreio a cada minuto; erros do aplicativo do motorista registrados | `RNF-SL-04`, `RNF-SL-19` |
| Revisão de custo | Mensal: fatura dividida pelas entregas do mês, conferida contra o patamar | `RNF-SL-15`, [`escalabilidade.md`](escalabilidade.md) |
