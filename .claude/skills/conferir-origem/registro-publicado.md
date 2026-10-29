# Registro publicado — calibração

O alvo de linguagem dos campos publicados, com a página inteira no padrão, o antes/depois
real deste repositório e as traduções que reaparecem toda vez. Regra normativa em
[`docs/_convencoes/CONVENCOES.md`](../../../docs/_convencoes/CONVENCOES.md) §9; aqui é a
calibração de quem vai escrever.

---

## 1. A página no padrão

Referência: `HU-CH-009` do repositório VRE/Chassi, a página que o cliente aprovou como
formato. Reproduzida abreviada, para mostrar o **nível de linguagem de cada campo**:

> **Título** — Recuperação de acesso sem lembrar o e-mail ou telefone
>
> **Descrição** — Permitir que o usuário recupere o acesso à conta quando não se recordar ou
> não possuir acesso aos dados de contato cadastrados (e-mail e/ou telefone), realizando a
> identificação por meio do Gov.br ou certificado digital.
>
> **História** — Como usuário que possui cadastro e não se recorda ou não possui acesso aos
> contatos cadastrados · Gostaria de recuperar o acesso autenticando pelo Gov.br ou
> certificado digital · Para atualizar meus dados de contato e voltar a acessar minha conta.
>
> **Regra `RN2`** — Após a autenticação via Gov.br ou certificado digital, o sistema
> identifica o usuário pelo CPF retornado pelo provedor de autenticação.
>
> **Critério `CA1` — Acesso via Gov.br** — Dado que não me recordo ou não possuo acesso ao
> e-mail e/ou telefone cadastrados · Quando autenticar utilizando o Gov.br com sucesso ·
> Então minha conta é identificada pelo CPF e o acesso à conta existente é liberado.
>
> **Integrações e APIs** — `gov.br`: autenticação única do cidadão (OIDC), com nível de
> confiança da conta. Permite recuperar o acesso quando o usuário não lembra e-mail ou
> telefone cadastrados.

O que ler dessa página, campo por campo:

| Campo | O padrão |
|---|---|
| Título | Ação de negócio. Nenhum nome de artefato |
| Descrição | Uma ideia por parágrafo: o que o sistema faz, para quem, e o porquê quando não é óbvio |
| História | O papel descrito pela função — "usuário que possui cadastro", não `P_ADMINISTRADOR` |
| Regra | Uma afirmação por regra, verificável, em vocabulário de negócio |
| Critério | Cenário nomeado em linguagem de negócio; `Dado`/`Quando`/`Então` na voz do usuário |
| Integrações e APIs | O parceiro pelo nome, o que ele faz, e por que **esta** HU depende dele |

**Uma diferença que não se copia: o tempo verbal.** O VRE especifica sistema a construir e
escreve "o sistema deverá". O FDE documenta sistema legado em produção e escreve no
**presente do indicativo** — "o sistema identifica", "o item é gravado". `CONVENCOES.md` §1.4
separa o que **é** do que **deveria ser**: recomendação para o sistema novo só existe em bloco
`> **Decisão de modernização:**`. Trocar presente por "deverá" no texto do legado apaga essa
separação. Copie o nível de linguagem, não o tempo verbal.

**O que é vocabulário de negócio e fica:** `CPF`, `CNPJ`, `Gov.br`, `SMS`, `OIDC`,
`ICP-Brasil`, `e-CPF`, `DARE`, nome de órgão, nome de canal, nome de perfil descrito pela
função. O que sai é identificador de **código**.

### A regra explica, não apenas afirma

Segundo exemplo do padrão, `HU-CH-021` — "Geração e Pagamento de DARE". O que ele mostra e o
primeiro não mostrava é o **tamanho** da regra: cada uma carrega a condição, o que acontece, e
o efeito no fluxo. Regra curta demais devolve a pergunta ao leitor.

> `RN3` — O requerimento com DARE gerado permanece pendente de pagamento até que o pagamento
> seja identificado e confirmado pelo sistema.
>
> `RN6` — Enquanto o pagamento não for confirmado, o requerimento não avança para a etapa de
> protocolo.
>
> `RN8` — Não é permitido gerar mais de um DARE para o mesmo requerimento enquanto existir um
> DARE válido, pendente ou pago.

Repare no que cada uma tem: o estado em que o requerimento fica, por quanto tempo, e o que
fica bloqueado enquanto isso. Compare com o padrão cru — "As contagens vêm da SP
`pr_sel_new_GetDataDashBoard`", como `HU-GC-010/RN2` estava escrita —, que não diz nem o que é
contado nem quando.

O mesmo vale para o critério: o modelo escreve `Dado` composto ("concluí todas as assinaturas
obrigatórias **E** o serviço possui cobrança") e `Então` composto ("gerar o DARE **E**
disponibilizar as informações para pagamento"). Cenário com duas condições é escrito com as
duas, não simplificado até caber numa linha.

### A tela também é o padrão

Na página do modelo **não há rastreio no caminho de leitura**: nem nome de arquivo, nem de
rotina, nem de tabela entre o título e os critérios. O que é técnico está lá, mas **dobrado** —
o modelo mostra `▾ Telas e campos 1 … ocultar`, e só quem abre vê a tabela com o nome do campo
no banco.

No app do FDE isso é layout, e [`src/pages/HuPage.tsx`](../../../src/pages/HuPage.tsx)
reproduz a página da SIAL na ordem exata dela, sem seção a mais:

```
identificador → título → descrição → História de usuário → Onde entra no fluxo
  → Regras de negócio → Critérios de aceitação → ▸ Telas e campos → Integrações e APIs
```

Duas consequências que não são detalhe:

- **A página não mostra `**Origem legada**`, `**Referências**` nem `**Atores**`.** A SIAL não
  tem essas seções, e o FDE deixou de ter. Os campos continuam existindo no Markdown e no
  JSON — são rastreio, e é ali que se consultam. A tela é só registro publicado.
- **`Telas e campos` é recolhido**, num botão com chevron e "mostrar"/"ocultar"
  (`.section-toggle`). Aberto, traz uma tabela por tela com **seis colunas**, as da SIAL:
  campo, tipo, obrigatório, máscara, validações e origem no banco. O controle de tela do
  legado não é coluna — `TextBox` e `DropDownList` não dizem nada a quem lê requisito.

O rastreio sair da tela **não afrouxa a invariante da documentação**: o identificador retirado
de campo publicado continua tendo de estar em campo de rastreio da mesma HU. A diferença é que
ele é lido em `docs/`, não na página.

---

## 2. Antes e depois, deste repositório

`HU-GC-071`, "Atribuir tipos de conteúdo a um perfil". O módulo `gerenciamento-perfis` da Gestão
de Conteúdo (`HU-GC-070` a `HU-GC-073`) é a referência viva: está inteiro no registro publicado,
mede zero jargão no placar e foi conferido com a implementação — leia
[`docs/01-gestao-conteudo/03-historias-de-usuario.md`](../../../docs/01-gestao-conteudo/03-historias-de-usuario.md)
no bloco desse módulo.

O antes é o texto real do repositório até `b069d2c` — o mesmo desde a primeira versão, `b22e412` —,
e a reescrita para o registro publicado entrou em `bb47e23`. Para conferir:
`git show b069d2c:docs/01-gestao-conteudo/03-historias-de-usuario.md`. O depois é o texto atual,
que, além da reescrita, passou pela conferência com a implementação (`e3a5213`).

**Descrição — antes**

> Recebe uma lista de atribuições e as grava em `TipoConteudoPerfil`, verificando antes se cada
> relação já existe. Erro na atribuição retorna `400 BadRequest` com mensagem específica.

**Descrição — depois**

> Define quais tipos de documento um perfil pode ver e cadastrar. É o controle que separa as
> áreas: quem cuida de portarias não precisa alcançar organogramas, e vice-versa.
>
> Vários tipos podem ser atribuídos de uma vez, e as atribuições que já existem não são
> recriadas. O efeito aparece na primeira tela que o usuário daquele perfil abrir: o tipo
> atribuído passa a constar nas listas de escolha dele.

O antes descreve a rotina: o que ela recebe, onde grava, o que devolve. O depois descreve a
decisão de negócio que a rotina sustenta, e dá o porquê que o antes deixava implícito — as
portarias e os organogramas.

**Regras — antes e depois, mesma numeração, mesmo `Catálogo`**

| | Antes | Depois |
|---|---|---|
| `RN1` | Acesso exclusivo de `P_ADMINISTRADOR`. | A atribuição é exclusiva do perfil de administrador. |
| `RN2` | A relação tipo + perfil é única e é verificada antes da criação. | Cada tipo entra uma única vez por perfil, e a repetição é conferida antes de gravar. |
| `RN3` | A atribuição determina quais tipos aparecem nos combos do usuário. | A atribuição determina quais tipos aparecem nas listas de escolha do usuário. |
| `RN4` | Erro na atribuição retorna `400 BadRequest`. | Falha na atribuição é devolvida como erro ao usuário. |

`RN5` e `RN6` não têm antes. Entraram na conferência com a implementação, que achou na tela o que
nenhuma regra descrevia: quais tipos são oferecidos, e a lista de novos tipos que a janela monta
antes de gravar. Reescrita de linguagem não cria regra (etapa 4 do [`SKILL.md`](SKILL.md)); a
conferência cria.

**Critérios — antes e depois**

| | Antes | Depois |
|---|---|---|
| `CA3` Cenário | Efeito no combo | Efeito nas listas |
| `CA3` Então | o combo passa a exibir "Portaria". | "Portaria" passa a aparecer nas opções de tipo. |
| `CA4` Então | recebo `400` com a mensagem `MSG-GC-002`. | vejo, no lugar da tela, o aviso de que ela não pôde ser carregada (`MSG-GC-002`). |
| `CA5` Dado | que estou autenticado como `P_CONSULTA` | que estou autenticado com perfil de consulta |

Em `CA4`, a reescrita de `bb47e23` parou em "recebo a mensagem de erro correspondente
(`MSG-GC-002`)": sem o código de status, mas ainda sem dizer o que o usuário vê. Só a conferência
com a tela trouxe o efeito. Tirar o jargão é metade do trabalho; a outra metade é afirmar o que
acontece.

**E o rastreio, intacto, na mesma HU:**

> **Origem legada** — `POST /Perfil/AtribuirTiposPerfil` (recebe `List<TipoConteudoPerfilDto>`) ·
> SP `pr_ins_TipoConteudoPerfilCreate` · gravação em `TipoConteudoPerfil` · erro devolve
> `400 BadRequest` · perfil exclusivo `P_ADMINISTRADOR`; `P_CONSULTA` recusado

É essa linha que autoriza a limpeza acima. Antes da reescrita ela trazia só a rota e a stored
procedure; na mesma passada, cresceu com cada identificador que saiu dos campos publicados —
`TipoConteudoPerfil`, `400 BadRequest`, `P_ADMINISTRADOR`, `P_CONSULTA`. Sem esse acréscimo, eles
teriam sido **perdidos**, e aí a reescrita seria destruição de rastreabilidade, não padronização.

---

## 3. Traduções recorrentes

Aparecem em quase todo módulo. Não são substituições mecânicas — confira que a afirmação
continua verdadeira no contexto antes de aplicar.

| Registro cru | Registro publicado |
|---|---|
| A validação é delegada a `pr_Login` | As credenciais são validadas pela própria base de usuários |
| Os dados vêm de `pr_ExibirOcorrencia`, que devolve múltiplos conjuntos | Os dados da ocorrência são carregados de uma vez, com o histórico e os anexos |
| A identidade é guardada em `Session["cod_usuarioadmin"]` | A identidade do administrador fica guardada na sessão enquanto ele estiver conectado |
| O destino é `denuncia.aspx`, e não `Examples.aspx` | Após entrar, o usuário vai direto para o registro de denúncia, e não para a página inicial padrão |
| O grau é registrado em `Cad_Manifestacao.ID_IDENTIFICACAO` | O grau de identificação escolhido é gravado junto com a manifestação |
| A lista é carregada por `pr_lstCriticaTipos(@cod_usuario=0, @parametro=0)` | A lista de tipos é carregada completa, sem filtro por usuário |
| `GETDATE()` grava a data | A data e a hora do registro são as do próprio servidor, não informadas pelo usuário |
| Ações sem `[Authorize]` | Ações que não verificam quem as chama: nem se está autenticado, nem qual é o perfil |
| O login vem de `User.Claims.ElementAt(5)` | O login de rede do usuário é lido da identidade montada na entrada, pela posição em que o dado chega |
| `P_ADMINISTRADOR` pode excluir | O administrador de conteúdo pode excluir |
| A relação `ID_TIPOCONTEUDO` + `USUARIO_AD_CAD` é única | Cada tipo entra uma única vez por perfil |
| Os tipos aparecem nos combos do usuário | Os tipos aparecem nas listas de escolha do usuário |
| Redireciona para `/AtenaAccess/AcessoNegado` | O acesso é recusado e o usuário vê a página de acesso negado |
| banco `GestaoSistema` em `vermelho-sql` | O cadastro corporativo, em base externa |
| Gravação em `TipoConteudoPerfil` | A atribuição de tipos a cada perfil é mantida no próprio sistema |
| `BadRequest(...)` é devolvido | A requisição é recusada, com a indicação do que faltou |

**Três armadilhas**

1. **Nome de rotina ou de componente que era a regra inteira.**
   `RN3: "A leitura da planilha usa ClosedXML"`, como `HU-GC-067` estava escrita, não afirma
   nada de negócio. Ou você tem na origem o efeito observável — e escreve o efeito, como a
   regra de hoje: "O arquivo enviado precisa ser uma planilha do Excel, no formato .xlsx" — ou
   marca `Não informado na documentação de origem` e abre `Q-*`. Não escreva "a planilha é
   lida corretamente": isso não é regra, é ruído.
2. **Valor interno sem significado.** "Área de gestão 2" só pôde ser traduzido porque a origem
   diz o que o 2 quer dizer — a tabela de domínio de `AreaGestao`, no `06`, traz 1 = Normativo
   e 2 = Comunicação. `HU-GC-083/RN1` passou a falar da "área de gestão de comunicação,
   distinta da normativa", e o número ficou na `**Origem legada**`. Se a origem não disser, a
   regra fala da classificação sem afirmar qual, e o valor fica na `**Origem legada**` do
   mesmo jeito.
3. **Mensagem de erro literal.** O texto exato da mensagem é rastreio e mora em
   `08-mensagens-e-erros.md`. No critério, descreva o efeito — "a inclusão é recusada com o
   aviso de que o tipo já está atribuído" (`HU-GC-071/CA2`) — e não o texto de `MSG-GC-089`.
