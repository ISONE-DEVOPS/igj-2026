# Manual do Utilizador - SGIGJ

## Sistema Integrado de Gestao da Inspeccao Geral de Jogos de Cabo Verde

**Versao:** 2.0
**Data:** Fevereiro de 2026
**Classificacao:** Uso Institucional

---

## Indice

1. [Introducao](#1-introducao)
2. [Acesso ao Sistema](#2-acesso-ao-sistema)
3. [Painel Principal (Dashboard)](#3-painel-principal-dashboard)
4. [Modulo de Administracao](#4-modulo-de-administracao)
5. [Modulo de Configuracao](#5-modulo-de-configuracao)
6. [Modulo de Entidades](#6-modulo-de-entidades)
7. [Modulo de Eventos](#7-modulo-de-eventos)
8. [Modulo de Processos](#8-modulo-de-processos)
9. [Modulo Financeiro](#9-modulo-financeiro)
10. [Casos Suspeitos](#10-casos-suspeitos)
11. [Notificacoes](#11-notificacoes)
12. [Funcionalidades Transversais](#12-funcionalidades-transversais)
13. [Perfis de Utilizador e Permissoes](#13-perfis-de-utilizador-e-permissoes)
14. [Perguntas Frequentes](#14-perguntas-frequentes)
15. [Glossario](#15-glossario)
16. [Contactos e Suporte](#16-contactos-e-suporte)

---

## 1. Introducao

### 1.1 Objectivo do Manual

O presente manual destina-se a orientar os utilizadores do Sistema Integrado de Gestao da Inspeccao Geral de Jogos (SGIGJ) de Cabo Verde na utilizacao correcta e eficiente de todas as funcionalidades disponibilizadas pela plataforma.

### 1.2 Sobre o SGIGJ

O SGIGJ e uma aplicacao web desenvolvida para apoiar as actividades de regulacao e fiscalizacao da Inspeccao Geral de Jogos (IGJ) da Republica de Cabo Verde. O sistema abrange as seguintes areas funcionais:

- **Gestao de Entidades** -- Registo e acompanhamento de casinos, empresas de jogo e respectivos activos (maquinas, bancas, equipamentos).
- **Gestao de Processos** -- Ciclo completo de processos administrativos, incluindo exclusao, interdicao, auto-exclusao, reclamacoes e contra-ordenacoes.
- **Gestao Financeira** -- Controlo de contrapartidas, contribuicoes, impostos, premios e orcamento.
- **Gestao de Eventos** -- Registo e aprovacao de eventos relacionados com entidades de jogo.
- **Casos Suspeitos** -- Identificacao e comunicacao de actividades suspeitas no ambito da prevencao do branqueamento de capitais.
- **Dashboard** -- Visao integrada de indicadores de desempenho (KPIs) e estatisticas.
- **Administracao** -- Gestao de utilizadores, perfis, permissoes e menus do sistema.

### 1.3 Requisitos Tecnicos

Para aceder ao SGIGJ, o utilizador necessita de:

- Navegador web actualizado (Google Chrome, Mozilla Firefox, Microsoft Edge ou Safari)
- Ligacao a Internet estavel
- Credenciais de acesso (nome de utilizador e palavra-passe) fornecidas pelo Administrador do Sistema

### 1.4 Convencoes do Manual

Ao longo deste manual, utilizam-se as seguintes convencoes:

- **Negrito** -- Nomes de botoes, menus e campos de formulario.
- *Italico* -- Termos tecnicos ou nomes de estados/fases.
- `Codigo` -- Caminhos de navegacao no sistema.
- Os passos sao numerados sequencialmente e devem ser seguidos pela ordem indicada.

---

## 2. Acesso ao Sistema

### 2.1 Pagina de Inicio de Sessao (Login)

Ao aceder ao endereco web do SGIGJ, sera apresentada a pagina de inicio de sessao com o logotipo da IGJ e a mensagem "Bem-vindo de volta!".

**Para iniciar sessao:**

1. Introduza o seu **Utilizador** no campo correspondente (representado pelo icone de pessoa).
2. Introduza a sua **Palavra-passe** no campo correspondente (representado pelo icone de cadeado).
3. Caso pretenda visualizar a palavra-passe que introduziu, clique no icone do olho situado a direita do campo.
4. Clique no botao **Entrar**.

**Notas importantes:**

- Se as credenciais estiverem incorrectas, o sistema apresenta a mensagem "Credenciais incorretas".
- Se a sua conta estiver desactivada, o sistema apresenta a mensagem "Conta desativada". Neste caso, contacte o Administrador do Sistema.
- Caso nao possua credenciais de acesso, contacte o Administrador do Sistema conforme indicado na pagina de login.

### 2.2 Bloqueio de Sessao (Lock Screen)

Por motivos de seguranca, o sistema pode bloquear a sua sessao apos um periodo de inactividade. Neste caso, sera apresentado o ecra de bloqueio, onde devera introduzir novamente a sua palavra-passe para retomar a sessao.

### 2.3 Terminar Sessao (Logout)

Para terminar a sessao:

1. Clique no icone do seu perfil, situado no canto superior direito do ecra.
2. Seleccione a opcao **Sair** ou **Logout**.

---

## 3. Painel Principal (Dashboard)

### 3.1 Visao Geral

O Dashboard e a pagina principal do sistema, acessivel apos o inicio de sessao atraves do menu lateral ou pelo caminho `/dashboard`. Apresenta uma visao consolidada das principais metricas e indicadores da IGJ, organizada em seccoes tematicas.

**Nota:** As seccoes visiveis no Dashboard dependem do perfil e das permissoes atribuidas ao utilizador. Nem todos os utilizadores terao acesso a todas as seccoes.

### 3.2 Filtros Globais

No topo do Dashboard, encontram-se os filtros globais que permitem refinar os dados apresentados:

- **Ano** -- Filtrar dados por ano especifico.
- **Entidade** -- Filtrar dados por entidade (casino) especifica.
- **Actualizar** -- Botao para recarregar os dados com os filtros seleccionados.

### 3.3 Indicadores-Chave de Desempenho (KPIs)

A primeira faixa do Dashboard apresenta os cartoes de KPI, cada um com o titulo, o valor actual e um subtitulo descritivo:

| KPI | Descricao |
|-----|-----------|
| **Receita Bruta** | Total de receita bruta acumulada (em CVE) |
| **Impostos** | Total de impostos arrecadados (em CVE) |
| **Processos Ativos** | Numero de processos de exclusao e auto-exclusao em curso |
| **Entidades** | Numero de entidades activas registadas |
| **Eventos** | Numero de eventos registados |
| **Casos Suspeitos** | Numero de casos suspeitos activos |
| **Exec. Orcamental** | Taxa de execucao orcamental (em percentagem) |

### 3.4 Seccoes do Dashboard

O Dashboard esta organizado nas seguintes seccoes:

#### 3.4.1 Visao Financeira

- **Evolucao Financeira Anual** -- Grafico de area que mostra a evolucao de receita, impostos, contrapartidas e contribuicoes ao longo do tempo.
- **Composicao da Receita** -- Grafico circular (donut) com a distribuicao da receita por categoria.

#### 3.4.2 Entidades e Receita por Casino

- **Receita Bruta por Entidade** -- Grafico de barras com os principais casinos por volume de receita.
- **Equipamentos por Entidade** -- Mapa de arvore (treemap) com a distribuicao de maquinas, bancas e equipamentos por entidade.

#### 3.4.3 Processos e Exclusoes

- **Processos por Mes** -- Grafico de barras comparando processos de exclusao com auto-exclusao nos ultimos 12 meses.
- **Status dos Processos** -- Grafico radial com a distribuicao de processos por estado.

#### 3.4.4 Eventos e Actividade

- **Eventos por Status** -- Grafico circular com a distribuicao de eventos por estado (aprovados, pendentes, recusados).
- **Actividade do Sistema** -- Mapa de calor (heatmap) com os registos por modulo nos ultimos 12 meses.

#### 3.4.5 Handpay e Casos Suspeitos

- **Handpay por Entidade** -- Grafico de barras com o valor total e a quantidade de registos de handpay por entidade.
- **Casos Suspeitos - Evolucao** -- Grafico de area com a evolucao mensal e acumulada de casos suspeitos.

#### 3.4.6 Orcamento IGJ

- **Orcamento vs Despesa** -- Grafico de barras comparando orcamento previsto com despesa efectiva, por projecto/rubrica.
- **Taxa de Execucao Orcamental** -- Grafico radial com a percentagem de execucao, acompanhado dos valores totais de orcamento e despesa.

---

## 4. Modulo de Administracao

O modulo de Administracao e acessivel apenas a utilizadores com permissoes administrativas (perfil *Super Admin* ou *Administrador*). Permite gerir utilizadores, perfis, permissoes e a estrutura de menus do sistema.

### 4.1 Gestao de Utilizadores

**Caminho:** `Administracao > Utilizadores` (`/administracao/utilizador`)

Esta pagina apresenta a lista de todos os utilizadores do sistema numa tabela com as colunas: Foto, Nome, Utilizador, Perfil, Estado e Accoes.

#### 4.1.1 Consultar Utilizadores

1. Aceda a pagina de utilizadores atraves do menu lateral.
2. Utilize a **caixa de pesquisa** (canto superior direito) para filtrar utilizadores por nome, utilizador ou perfil.
3. Utilize o selector **Mostrar** (canto superior esquerdo) para definir o numero de entradas por pagina (5, 10, 20, 30, 40 ou 50).
4. Navegue entre paginas utilizando os botoes de paginacao na parte inferior da tabela.
5. Clique nos cabecalhos das colunas para ordenar os dados (ascendente ou descendente).

#### 4.1.2 Criar Utilizador

1. Clique no botao **Adicionar** (icone +) no canto superior direito da tabela.
2. Na janela modal que se abre, preencha os seguintes campos:
   - **Foto Perfil** -- Clique na area de upload e seleccione uma imagem do computador. (Campo obrigatorio.)
   - **Notificacoes** -- Active ou desactive o interruptor para permitir ou bloquear notificacoes para este utilizador.
   - **Nome** -- Seleccione a pessoa associada na lista pendente. Apenas aparecem pessoas registadas no sistema que ainda nao possuam conta de utilizador.
   - **Utilizador** -- Introduza o nome de utilizador para inicio de sessao. (Campo obrigatorio.)
   - **Perfil** -- Seleccione o perfil de permissoes na lista pendente. (Campo obrigatorio.)
   - **Password** -- Introduza a palavra-passe inicial. (Campo obrigatorio.)
3. Clique em **Guardar** para criar o utilizador.
4. Clique em **Fechar** para cancelar e fechar a janela.

#### 4.1.3 Editar Utilizador

1. Na tabela de utilizadores, clique no icone de **edicao** (coluna Accoes) do utilizador pretendido.
2. Na janela modal, altere os campos desejados:
   - Foto de perfil, nome, utilizador, perfil e configuracao de notificacoes.
   - **Nota:** O codigo do utilizador nao pode ser alterado.
3. Clique em **Guardar** para confirmar as alteracoes.

#### 4.1.4 Activar/Desactivar Utilizador

1. Na tabela de utilizadores, utilize o **interruptor** (coluna Estado) para activar ou desactivar a conta do utilizador.
2. Uma conta desactivada impede o utilizador de iniciar sessao no sistema.

#### 4.1.5 Eliminar Utilizador

1. Na tabela de utilizadores, clique no icone de **eliminacao** (icone vermelho na coluna Accoes).
2. Confirme a eliminacao na janela de confirmacao que se apresenta.

#### 4.1.6 Visualizar Utilizador

1. Na tabela de utilizadores, clique no icone de **visualizacao** na coluna Accoes.
2. A janela modal apresenta os dados do utilizador em modo somente leitura: foto, notificacoes, codigo, nome, utilizador e perfil.

### 4.2 Gestao de Perfis

**Caminho:** `Administracao > Perfil` (`/administracao/perfil`)

Os perfis definem os niveis de acesso dos utilizadores. Cada perfil possui um codigo, uma designacao e uma descricao.

#### 4.2.1 Criar Perfil

1. Clique em **Adicionar**.
2. Preencha os campos:
   - **Designacao** -- Nome do perfil (exemplo: "Inspector", "Instrutor"). (Campo obrigatorio, maximo 256 caracteres.)
   - **Descricao** -- Descricao textual do perfil e das suas atribuicoes. (Maximo 64.000 caracteres.)
3. Clique em **Guardar**.

**Nota:** O codigo do perfil e gerado automaticamente pelo sistema.

#### 4.2.2 Editar Perfil

1. Clique no icone de edicao do perfil pretendido.
2. Altere a designacao e/ou a descricao.
3. Clique em **Guardar**.

#### 4.2.3 Eliminar Perfil

1. Clique no icone de eliminacao do perfil pretendido.
2. Confirme a eliminacao.

**Nota:** Perfis que estejam associados a utilizadores nao podem ser eliminados. Nesse caso, o sistema apresenta a mensagem "Esse perfil nao pode ser eliminado".

### 4.3 Gestao de Permissoes

**Caminho:** `Administracao > Permissoes` (`/administracao/permissoes`)

A pagina de permissoes permite atribuir ou remover acessos a menus e funcionalidades do sistema para cada perfil.

**Para configurar permissoes:**

1. Seleccione o **Perfil** na lista pendente apresentada no topo da pagina.
2. Apos seleccionar o perfil, o sistema apresenta a arvore completa de menus do sistema.
3. Cada item da arvore possui uma caixa de seleccao (checkbox):
   - **Marcado** -- O perfil tem acesso a esse menu/funcionalidade.
   - **Desmarcado** -- O perfil nao tem acesso.
4. Clique na caixa de seleccao de um item para conceder ou revogar o acesso. A alteracao e gravada automaticamente.
5. Utilize os icones **+** e **-** para expandir ou recolher os sub-menus da arvore.

### 4.4 Gestao de Menus

**Caminho:** `Administracao > Menu` (`/administracao/menu`)

Permite gerir a estrutura de menus do sistema (destinado a utilizadores tecnicos).

### 4.5 Accoes de Menu

**Caminho:** `Administracao > Accoes Menu` (`/administracao/accoesmenu`)

Permite gerir as accoes disponiveis para cada item de menu (Criar, Ler, Editar, Eliminar, entre outras).

---

## 5. Modulo de Configuracao

O modulo de Configuracao permite gerir as tabelas parametricas do sistema. Estas tabelas definem os valores disponiveis nos campos de seleccao (listas pendentes) utilizados em todo o sistema.

**Caminho geral:** `Configuracao > [Nome da Tabela]` (`/configuracao/[tabela]`)

### 5.1 Funcionamento Geral das Tabelas Parametricas

Todas as tabelas parametricas seguem o mesmo padrao de interface e operacao:

#### 5.1.1 Consultar Registos

1. Aceda a tabela pretendida atraves do menu lateral.
2. A tabela apresenta as colunas especificas de cada parametro (tipicamente: Codigo, Designacao, Descricao e Accoes).
3. Utilize a **caixa de pesquisa** para filtrar registos.
4. Utilize o selector **Mostrar** para definir o numero de entradas por pagina.
5. Clique nos cabecalhos para ordenar.

#### 5.1.2 Criar Registo

1. Clique no botao **Adicionar**.
2. Preencha os campos obrigatorios (assinalados com asterisco vermelho).
3. Clique em **Guardar**.

#### 5.1.3 Editar Registo

1. Clique no icone de edicao na coluna Accoes.
2. Altere os campos pretendidos.
3. Clique em **Guardar**.

#### 5.1.4 Eliminar Registo

1. Clique no icone de eliminacao (vermelho) na coluna Accoes.
2. Confirme a eliminacao.

**Atencao:** Registos que estejam a ser utilizados noutras tabelas do sistema nao podem ser eliminados.

### 5.2 Tabelas Parametricas Disponiveis

| Tabela | Caminho | Descricao |
|--------|---------|-----------|
| **Genero** | `/configuracao/genero` | Generos (Masculino, Feminino, etc.) |
| **Estado Civil** | `/configuracao/estadocivil` | Estados civis (Solteiro, Casado, etc.) |
| **Tipo de Documento** | `/configuracao/tipodocumento` | Tipos de documento de identificacao (BI, Passaporte, etc.) |
| **Tipo de Contacto** | `/configuracao/tipocontacto` | Tipos de contacto (Telefone, Email, etc.) |
| **Tipo de Entidade** | `/configuracao/tipoentidade` | Tipos de entidade (Casino, Empresa de Jogo, etc.) |
| **Tipo de Banca** | `/configuracao/tipobanca` | Tipos de bancas de jogo |
| **Tipo de Maquina** | `/configuracao/tipomaquina` | Tipos de maquinas de jogo |
| **Tipo de Equipamento** | `/configuracao/tipoequipamento` | Tipos de equipamentos |
| **Classificacao de Equipamento** | `/configuracao/classificacaoequipamento` | Classificacoes de equipamentos |
| **Tipo de Evento** | `/configuracao/tipoevento` | Tipos de eventos |
| **Tipo de Decisao** | `/configuracao/tipodecisao` | Tipos de decisao processual (Exclusao, Interdicao, Arquivamento, etc.) |
| **Tipo de Parecer** | `/configuracao/tipoparecer` | Tipos de parecer |
| **Tipo de Origem** | `/configuracao/tipoorigem` | Origens dos processos (Denuncia, Inspeccao, etc.) |
| **Tipologia** | `/configuracao/tipologia` | Tipologias gerais |
| **Tipo de Cargo** | `/configuracao/tipocargo` | Tipos de cargo profissional |
| **Infracao** | `/configuracao/infracao` | Tipos de infracao |
| **Coima** | `/configuracao/coima` | Valores de coima associados a infraccoes |
| **Motivo de Exclusao** | `/configuracao/motivoexclusao` | Motivos para exclusao/interdicao |
| **Periodo de Exclusao** | `/configuracao/exclusaoperiodo` | Periodos de exclusao (com numero de dias) |
| **Pecas Processuais** | `/configuracao/pecasprocessuais` | Tipos de pecas processuais e respectivos campos |
| **Lingua** | `/configuracao/lingua` | Idiomas |
| **Nivel Linguistico** | `/configuracao/nivellinguistico` | Niveis de proficiencia linguistica |
| **Nivel de Escolaridade** | `/configuracao/nivelescolaridade` | Niveis de escolaridade |
| **Categoria Profissional** | `/configuracao/categoriaprofissional` | Categorias profissionais |
| **Profissao** | `/configuracao/profissao` | Profissoes |
| **Status** | `/configuracao/status` | Estados gerais |
| **Campos** | `/configuracao/campos` | Tipos de campos dinamicos para pecas processuais |
| **Divisas** | `/configuracao/divisas` | Moedas/divisas |
| **Banco** | `/configuracao/banco` | Instituicoes bancarias |
| **Meio de Pagamento** | `/configuracao/meiopagamento` | Meios de pagamento (Transferencia, Cheque, etc.) |
| **Modalidade de Pagamento** | `/configuracao/modalidadepagamento` | Modalidades de pagamento |
| **Taxa Casino** | `/configuracao/taxacasino` | Taxas aplicaveis a casinos |
| **Projectos** | `/configuracao/projetos` | Projectos orcamentais |
| **Rubricas** | `/configuracao/rubricas` | Rubricas orcamentais |

### 5.3 Predefinicoes

**Caminho:** `Configuracao > Predefinicoes > Tempo Limite Decisao` (`/configuracao/predefinicoes/tempolimitedecisao`)

Permite definir o tempo limite para decisao em processos administrativos (prazo de prescricao). Este parametro e utilizado pelo sistema para monitorar automaticamente os processos que ultrapassam o prazo estabelecido.

---

## 6. Modulo de Entidades

O modulo de Entidades permite gerir todas as entidades (empresas de jogo, casinos), pessoas singulares e a organizacao interna da IGJ.

### 6.1 Gestao de Entidades

**Caminho:** `Entidades > Entidades` (`/entidades/entidades`)

#### 6.1.1 Lista de Entidades

A pagina principal apresenta a lista de todas as entidades registadas no sistema. Cada linha mostra os dados principais da entidade e as accoes disponiveis.

**Para consultar:**

1. Utilize a caixa de pesquisa para filtrar por nome, codigo ou tipo de entidade.
2. Clique numa entidade para aceder aos seus detalhes.

#### 6.1.2 Criar Entidade

1. Clique no botao **Adicionar**.
2. Preencha os dados da entidade na janela modal:
   - Denominacao/Razao Social
   - Tipo de Entidade
   - Dados adicionais conforme necessario
3. Clique em **Guardar**.

#### 6.1.3 Detalhes da Entidade

Ao aceder aos detalhes de uma entidade (`/entidades/entidades/detalhes/:id`), pode consultar e gerir toda a informacao associada atraves das seguintes sub-paginas:

**a) Bancas** (`/entidades/entidades/banca/:id`)

Gestao das bancas de jogo da entidade (mesas de jogo).

1. Visualize a lista de bancas activas.
2. Adicione novas bancas com o botao **Adicionar**.
3. Edite ou elimine bancas existentes.
4. Exporte a lista em PDF ou CSV atraves do selector de download.

**b) Maquinas** (`/entidades/entidades/maquina/:id`)

Gestao das maquinas de jogo da entidade (slot machines e similares).

1. Visualize a lista de maquinas registadas.
2. Adicione novas maquinas com os respectivos dados tecnicos.
3. Exporte a lista em PDF ou CSV.

**c) Equipamentos** (`/entidades/entidades/equipamento/:id`)

Gestao de outros equipamentos da entidade.

1. Consulte, adicione, edite ou elimine equipamentos.
2. Cada equipamento possui classificacao e tipo.
3. Exporte a lista em PDF ou CSV.

**d) Grupos** (`/entidades/entidades/grupo/:id`)

Gestao dos grupos empresariais a que a entidade pertence.

1. Consulte os grupos associados.
2. Adicione ou remova associacoes a grupos.
3. Exporte a lista em PDF ou CSV.

**e) Colaboradores** (`/entidades/entidades/colaboradores/:id`)

Gestao do pessoal afecto a entidade.

1. Visualize a lista de colaboradores.
2. Adicione novos colaboradores, indicando a pessoa, o cargo e a relacao com a entidade.
3. Exporte a lista em PDF ou CSV.

**f) Contrapartidas**

Gestao das contrapartidas devidas pela entidade (ver seccao 9.1 para detalhes).

**g) Contribuicoes**

Gestao das contribuicoes fiscais da entidade (ver seccao 9.2 para detalhes).

**h) Impostos**

Gestao dos impostos da entidade (ver seccao 9.3 para detalhes).

**i) Premios**

Gestao dos premios pagos pela entidade (ver seccao 9.4 para detalhes).

**j) Casos Suspeitos**

Gestao de casos suspeitos associados a entidade (ver seccao 10 para detalhes).

### 6.2 Gestao de Pessoas

**Caminho:** `Entidades > Pessoas` (`/entidades/pessoas`)

Permite gerir o registo de todas as pessoas singulares referenciadas no sistema (colaboradores, visados de processos, intervenientes).

#### 6.2.1 Consultar Pessoas

1. Utilize a caixa de pesquisa para filtrar por nome, codigo ou documento de identificacao.
2. Ordene a tabela pelos cabecalhos das colunas.

#### 6.2.2 Criar Pessoa

1. Clique no botao **Adicionar**.
2. Preencha os dados pessoais:
   - Nome completo
   - Genero
   - Estado civil
   - Data de nascimento
   - Profissao/Categoria profissional
   - Nivel de escolaridade
   - Documentos de identificacao (tipo, numero, validade)
   - Contactos (tipo, valor)
   - Linguas (idioma e nivel)
3. Clique em **Guardar**.

**Nota:** O componente de criacao de pessoa esta disponivel em diversos pontos do sistema (processos, handpay, etc.), permitindo criar uma nova pessoa directamente no contexto em que e necessaria.

#### 6.2.3 Editar Pessoa

1. Clique no icone de edicao da pessoa pretendida.
2. Altere os dados conforme necessario.
3. Clique em **Guardar**.

### 6.3 Organizacao IGJ

**Caminho:** `Entidades > IGJ` (`/entidades/igj`)

Permite gerir a estrutura organizativa interna da Inspeccao Geral de Jogos, incluindo os seus colaboradores e respectivos cargos.

#### Sub-paginas da IGJ:

- **Orcamento** (`/entidade/orcamento`) -- Gestao orcamental da IGJ (ver seccao 9.5).
- **Auditoria** (`/entidade/auditoria`) -- Consulta do registo de auditoria de todas as operacoes realizadas no sistema.
- **Visao Geral** (`/entidade/visaogeral`) -- Visao consolidada da informacao da IGJ.

---

## 7. Modulo de Eventos

O modulo de Eventos permite gerir pedidos de eventos submetidos pelas entidades de jogo, bem como os respectivos pareceres e decisoes.

### 7.1 Eventos Pedidos (Pendentes)

**Caminho:** `Eventos > Pedidos` (`/eventos/eventospedidos`)

Apresenta a lista de eventos que aguardam apreciacao e decisao.

#### 7.1.1 Registar Evento

1. Clique em **Adicionar**.
2. Preencha os dados do evento:
   - Entidade requerente
   - Tipo de evento
   - Data pretendida
   - Descricao/Observacoes
3. Clique em **Guardar**.

#### 7.1.2 Apreciar Evento (Parecer/Despacho)

1. Clique no icone de edicao do evento pendente.
2. Analise os dados do pedido.
3. Emita o parecer e/ou a decisao:
   - **Aprovar** -- O evento passa para a lista de aprovados.
   - **Recusar** -- O evento passa para a lista de recusados.
4. Clique em **Guardar**.

### 7.2 Eventos Aprovados

**Caminho:** `Eventos > Aprovados` (`/eventos/aprovados`)

Lista de todos os eventos que foram aprovados. Permite consultar, filtrar e exportar a informacao.

**Funcionalidades:**

1. Pesquisa e filtragem por texto livre.
2. Ordenacao por qualquer coluna.
3. Exportacao em PDF ou CSV (ver seccao 12.2).

### 7.3 Eventos Recusados

**Caminho:** `Eventos > Recusados` (`/eventos/recusados`)

Lista de todos os eventos cuja aprovacao foi recusada. Permite consulta e exportacao.

---

## 8. Modulo de Processos

O Modulo de Processos e o nucleo funcional do SGIGJ, abrangendo todos os processos administrativos da IGJ. Compreende os seguintes sub-modulos:

### 8.1 Auto-Exclusao

**Caminho:** `Processos > Auto-Exclusao` (`/processos/autoexclusao`)

Gere os pedidos voluntarios de exclusao de salas de jogo, apresentados pelos proprios jogadores.

#### 8.1.1 Consultar Processos de Auto-Exclusao

A pagina apresenta uma tabela com as seguintes colunas: Referencia, Pessoa, Entidade, Data do Pedido, Motivo, Periodo, Numero de Dias, Data de Inicio e Data de Fim.

**Filtros disponiveis:**

- **Activos/Inactivos** -- Alternar entre processos de auto-exclusao activos e expirados.
- **Despacho** -- Filtrar por estado do despacho (Sim/Nao/Todos).
- **Ano** -- Filtrar por ano.
- **Pesquisa** -- Filtro de texto livre.

#### 8.1.2 Registar Pedido de Auto-Exclusao

1. Clique em **Adicionar**.
2. Preencha os campos do formulario:
   - **Pessoa** -- Seleccione a pessoa na lista ou crie uma nova.
   - **Entidade** -- Seleccione o casino/entidade de jogo.
   - **Motivo de Exclusao** -- Seleccione o motivo.
   - **Periodo de Exclusao** -- Seleccione o periodo (define automaticamente o numero de dias).
   - **Data de Inicio** -- Data de inicio da exclusao.
   - **Observacoes** -- Informacoes adicionais (editor de texto rico).
   - **Documentos** -- Anexe documentos comprovativos.
3. Clique em **Guardar**.

#### 8.1.3 Despacho de Auto-Exclusao

1. Clique no icone de edicao do processo pretendido.
2. Emita o despacho:
   - Seleccione o tipo de decisao.
   - Preencha a referencia do despacho.
   - Indique a data do despacho.
   - Defina o prazo (se aplicavel).
   - Redija o texto do despacho (editor de texto rico com geracao automatica de texto).
3. Clique em **Guardar**.

**Nota:** O sistema suporta geracao automatica do texto do despacho com base nos dados do processo.

#### 8.1.4 Exportacao

- **PDF** -- Seleccione a opcao de exportacao e escolha PDF.
- **Excel** -- Seleccione a opcao de exportacao e escolha Excel.

### 8.2 Handpay

**Caminho:** `Processos > Handpay` (`/processos/handpay`)

Gere os registos de pagamentos manuais (handpay) de valores elevados nas maquinas de jogo.

#### 8.2.1 Consultar Registos de Handpay

A tabela apresenta: Codigo, Pessoa, Entidade, Valor e Data.

**Filtros disponiveis:**

- **Ano** -- Filtrar por ano.
- **Pesquisa** -- Filtro de texto livre.

**Nota:** O sistema calcula e apresenta automaticamente o **Total** dos valores na parte inferior da tabela.

#### 8.2.2 Registar Handpay

1. Clique em **Adicionar**.
2. Preencha os dados:
   - **Pessoa** -- Seleccione o beneficiario ou crie uma nova pessoa.
   - **Entidade** -- Seleccione o casino onde ocorreu o pagamento.
   - **Valor** -- Introduza o valor do handpay (em CVE).
   - **Data** -- Data do pagamento.
   - **Documentos** -- Anexe comprovativos.
3. Clique em **Guardar**.

#### 8.2.3 Exportacao

Utilize o selector de download para exportar a lista em PDF ou Excel.

### 8.3 Processos de Exclusao/Interdicao

**Caminho:** `Processos > Exclusao/Interdicao` (`/processos/exclusaointerdicao`)

Este e o sub-modulo mais complexo do sistema, gerindo o ciclo de vida completo dos processos administrativos de exclusao e interdicao de salas de jogo.

#### 8.3.1 Ciclo de Vida do Processo

O processo de exclusao/interdicao segue o seguinte fluxo:

```
Instauracao --> Despacho Inicial --> Instrucao --> Despacho Final --> Notificacao --> Encerramento
```

**Fases detalhadas:**

1. **Instauracao** -- Criacao do auto de exclusao/noticia que inicia o processo.
2. **Despacho Inicial** -- O Inspector Geral emite despacho de instauracao, nomeia o instrutor e define o prazo.
3. **Instrucao** -- O instrutor conduz a investigacao, recolhendo provas e produzindo pecas processuais.
4. **Despacho Final** -- O Inspector Geral emite a decisao final (exclusao, interdicao, arquivamento ou devolucao para instrucao).
5. **Notificacao da Decisao** -- Notificacao formal ao visado sobre a decisao tomada.
6. **Decisao Tutelar/Tribunal** -- Registo de decisoes de instancias superiores, se aplicavel.
7. **Termo de Encerramento** -- Encerramento formal do processo.

#### 8.3.2 Criar Processo (Instauracao)

1. Na pagina de processos de exclusao/interdicao, clique em **Adicionar**.
2. Preencha o formulario:
   - **Pessoa/Visado** -- Seleccione a pessoa visada (ou crie uma nova).
   - **Entidade** -- Seleccione a entidade de jogo.
   - **Descricao dos Factos** -- Descreva os factos que fundamentam a instauracao.
   - **Tipo de Pedido** -- Seleccione o tipo (exclusao, interdicao, etc.).
   - **Observacoes** -- Informacoes adicionais (editor de texto rico).
   - **Documentos** -- Anexe documentos comprovativos (Auto de Noticia).
3. Clique em **Guardar**.

O processo e criado com uma referencia automatica no formato `AAAA.NNNN` (ano.numero sequencial).

#### 8.3.3 Emitir Despacho Inicial

1. Abra o processo pretendido (clique no icone de edicao).
2. Aceda a seccao de **Despacho Inicial**.
3. Preencha:
   - **Referencia** -- Referencia do despacho.
   - **Data** -- Data de emissao do despacho.
   - **Instrutor** -- Seleccione o instrutor a nomear.
   - **Tipo de Decisao** -- Seleccione o tipo de despacho.
   - **Prazo** -- Defina o prazo para a instrucao.
   - **Texto do Despacho** -- Redija ou gere automaticamente o texto. O sistema disponibiliza um botao **Gerar texto** que preenche o conteudo com base nos dados do processo.
4. Clique em **Guardar**.

**Resultado:** O instrutor nomeado recebe uma notificacao interna e, se configurado, uma notificacao por email. O processo avanca para a fase de instrucao.

#### 8.3.4 Fase de Instrucao

Apos o despacho inicial, o instrutor nomeado conduz a fase de instrucao:

**a) Pecas Processuais**

As pecas processuais sao documentos produzidos durante a instrucao. Para adicionar uma peca:

1. Na seccao de instrucao do processo, clique em **Adicionar Peca**.
2. Seleccione o **Tipo de Peca** na lista pendente. Os tipos disponiveis incluem:
   - Nota de Comunicacao
   - Auto-declaracao
   - Prova
   - Reclamacao do Visado
   - Relatorio Final
   - Juntada
   - Termo de Encerramento
3. Conforme o tipo seleccionado, preencha os campos dinamicos:
   - **Pessoa/Destinatario** -- Seleccione a pessoa envolvida.
   - **Observacoes** -- Redija o conteudo da peca (editor de texto rico).
   - **Documentos** -- Anexe documentos de suporte.
   - **Infracao/Coima** -- Seleccione a infracao e o valor da coima (apenas para pecas que o exijam).
   - **Decisao** -- Seleccione o tipo de decisao (apenas para o Relatorio Final).
4. Clique em **Guardar**.

**b) Nota de Comunicacao**

A nota de comunicacao e um tipo especial de peca processual que gera automaticamente um documento PDF e envia-o por email:

1. Seleccione o tipo **Nota de Comunicacao**.
2. Seleccione o destinatario.
3. O sistema gera automaticamente o texto da comunicacao com base em templates pre-configurados:
   - Template para o **Visado**
   - Template para a **Entidade Decisora**
   - Template para a **Entidade Visada**
4. Revise e ajuste o texto gerado.
5. Clique em **Guardar**.
6. O sistema gera o PDF e envia-o ao destinatario por email.

**c) Interrupcao da Instrucao**

Se necessario suspender temporariamente a instrucao:

1. Aceda a seccao de instrucao do processo.
2. Clique em **Interromper**.
3. Indique o motivo da interrupcao.
4. Clique em **Guardar**.

A instrucao pode ser retomada posteriormente.

#### 8.3.5 Emitir Despacho Final

Apos a conclusao da instrucao (geralmente apos a elaboracao do Relatorio Final):

1. Aceda a seccao de **Despacho Final** do processo.
2. Preencha:
   - **Data** -- Data da decisao.
   - **Tipo de Decisao** -- Seleccione entre:
     - **Exclusao** -- Com indicacao do periodo e datas de inicio/fim.
     - **Interdicao** -- Interdicao permanente ou temporaria.
     - **Arquivamento** -- Encerramento sem penalizacao.
     - **Devolucao para Instrucao** -- O processo regressa a fase de instrucao para complemento.
   - **Periodo de Exclusao** -- Seleccione o periodo aplicavel (se exclusao).
   - **Infracao e Coima** -- Indique a infracao e o valor da coima, se aplicavel.
   - **Texto do Despacho** -- Redija ou revise o texto da decisao.
3. Clique em **Guardar**.

#### 8.3.6 Notificacao da Decisao

Apos o despacho final, procede-se a notificacao formal do visado:

1. Aceda a seccao de **Notificacao** do processo.
2. Preencha o formulario de notificacao:
   - **Corpo** -- Redija o texto da notificacao (editor de texto rico).
   - **Documentos** -- Anexe os documentos relevantes.
   - **Visados** -- Seleccione os intervenientes a notificar.
3. Clique em **Guardar** para gravar o rascunho.
4. Clique em **Concluir** para gerar o PDF, enviar o email e finalizar a notificacao.

#### 8.3.7 Decisao Tutelar e Decisao Tribunal

Caso o visado recorra da decisao, podem ser registadas decisoes de instancias superiores:

1. Aceda a seccao **Decisao Tutelar** ou **Decisao Tribunal** do processo.
2. Preencha os dados da decisao da instancia superior.
3. Clique em **Guardar**.

#### 8.3.8 Juntada de Documentos

A juntada compila todos os documentos do processo num unico ficheiro PDF:

1. Clique no botao **Juntada**.
2. O sistema gera automaticamente um PDF unico com capa de "Termo de Juntada" e todos os documentos do processo.
3. O PDF abre-se numa nova janela do navegador.

#### 8.3.9 Termo de Encerramento

Para encerrar formalmente o processo:

1. Aceda a seccao **Termo de Encerramento**.
2. Redija o texto do termo.
3. Clique em **Guardar**.

#### 8.3.10 Resgatar Processo

Se um processo foi finalizado por engano, pode ser resgatado:

1. Localize o processo na lista de finalizados.
2. Clique no icone/botao **Resgatar**.
3. O processo regressa a lista de processos activos.

### 8.4 Processos Finalizados

**Caminho:** `Processos > Exclusao Finalizado` (`/processos/exclusaofinalizado`)

Lista de todos os processos de exclusao/interdicao que foram concluidos. Permite:

1. Consultar os detalhes de cada processo finalizado.
2. Pesquisar e filtrar.
3. Exportar em PDF ou CSV.

### 8.5 Processos Arquivados

**Caminho:** `Processos > Exclusao Arquivados` (`/processos/exclusao/arquivados`)

Lista de processos que foram arquivados (encerrados sem decisao de exclusao/interdicao). Permite consulta e exportacao.

### 8.6 Processos Prescritos

**Caminho:** `Processos > Exclusao Prescritos` (`/processos/exclusao/prescritos`)

Lista de processos cuja prescricao foi atingida (o prazo maximo de instrucao expirou sem decisao). O sistema monitoriza automaticamente os prazos e move os processos para esta lista quando o tempo limite e ultrapassado.

### 8.7 Reclamacoes

**Caminho:** `Processos > Reclamacoes` (`/processos/reclamacao`)

Gere as reclamacoes apresentadas contra entidades de jogo.

#### 8.7.1 Consultar Reclamacoes

A tabela apresenta a lista de reclamacoes com os dados principais e o estado de cada uma.

#### 8.7.2 Registar Reclamacao

1. Clique em **Adicionar**.
2. Preencha os dados da reclamacao:
   - Reclamante (pessoa)
   - Entidade reclamada
   - Descricao da reclamacao
   - Data da ocorrencia
   - Documentos de suporte
3. Clique em **Guardar**.

#### 8.7.3 Tratar Reclamacao

1. Abra a reclamacao pretendida.
2. Analise os dados e emita o parecer/decisao.
3. Actualize o estado da reclamacao.
4. Clique em **Guardar**.

### 8.8 Contra-Ordenacoes

**Caminho:** `Processos > Contra-Ordenacao` (`/processos/contraordenacao`)

Gere os processos de contra-ordenacao instaurados contra entidades de jogo por infraccoes detectadas.

#### 8.8.1 Consultar Contra-Ordenacoes

A tabela apresenta a lista de processos de contra-ordenacao com filtros por ano e pesquisa textual.

#### 8.8.2 Gerir Contra-Ordenacao

1. Abra o processo de contra-ordenacao.
2. Pode consultar e gerir:
   - Dados do processo
   - Instrucao (similar ao processo de exclusao)
   - Pecas processuais
   - Documentos anexos
   - Despachos
3. Actualize os dados conforme necessario e clique em **Guardar**.

---

## 9. Modulo Financeiro

O Modulo Financeiro gere todos os aspectos financeiros relacionados com as entidades de jogo e o orcamento da IGJ.

### 9.1 Contrapartidas

**Caminho:** Acessivel dentro dos detalhes de cada entidade ou em `Configuracao > Contrapartida Entidade` (`/configuracao/contrapartida-entidade`)

As contrapartidas sao valores devidos pelas entidades de jogo ao Estado, nos termos da legislacao aplicavel.

#### 9.1.1 Consultar Contrapartidas

A tabela apresenta as contrapartidas por entidade, com as seguintes informacoes:
- Valor bruto
- Artigo 48 (percentagem e valor)
- Artigo 49 (percentagem e valor)
- Total a receber

**Filtros disponíveis:**
- **Ano** -- Filtrar por ano fiscal.

**Totais:** O sistema apresenta automaticamente os totais na parte inferior da tabela.

#### 9.1.2 Registar Contrapartida

1. Clique em **Adicionar**.
2. Preencha os dados da contrapartida:
   - Entidade
   - Periodo de referencia
   - Valor bruto
   - Percentagens aplicaveis
3. Clique em **Guardar**.

#### 9.1.3 Registar Pagamento

1. Abra a contrapartida pretendida.
2. Clique em **Pagamento**.
3. Preencha os dados do pagamento:
   - Valor pago
   - Data do pagamento
   - Meio de pagamento
   - Comprovativo
4. Clique em **Guardar**.

#### 9.1.4 Exportacao

Utilize o selector de download para exportar em PDF ou Excel.

### 9.2 Contribuicoes

Gestao das contribuicoes fiscais devidas pelas entidades de jogo.

#### 9.2.1 Consultar Contribuicoes

1. Aceda a seccao de contribuicoes dentro dos detalhes da entidade.
2. Visualize a lista de contribuicoes com valores e datas.
3. Filtre por ano se necessario.

#### 9.2.2 Registar Contribuicao

1. Clique em **Adicionar**.
2. Preencha os dados (entidade, periodo, valor, etc.).
3. Clique em **Guardar**.

#### 9.2.3 Registar Pagamento

1. Abra a contribuicao e registe o pagamento.
2. Indique o valor pago, a data e o meio de pagamento.

#### 9.2.4 Exportacao

Exporte a lista em PDF ou CSV.

### 9.3 Impostos

Gestao dos impostos sobre o jogo devidos pelas entidades.

#### 9.3.1 Consultar Impostos

1. Aceda a seccao de impostos.
2. Visualize a lista com valores por entidade e periodo.

#### 9.3.2 Parametrizacao de Impostos

A parametrizacao permite definir as regras de calculo dos impostos:

1. Aceda a seccao de parametrizacao de impostos.
2. Configure as taxas aplicaveis por tipo de jogo/entidade.

#### 9.3.3 Registar Pagamento

Registe o pagamento do imposto com os mesmos campos das demais obrigacoes financeiras.

#### 9.3.4 Exportacao

Exporte em PDF ou CSV.

### 9.4 Premios

Gestao dos premios pagos pelas entidades de jogo aos jogadores.

#### 9.4.1 Consultar Premios

1. Visualize a lista de premios com valores, datas e beneficiarios.
2. Filtre por ano ou pesquise por texto.

#### 9.4.2 Registar Premio

1. Clique em **Adicionar**.
2. Preencha os dados do premio (entidade, valor, beneficiario, data).
3. Clique em **Guardar**.

#### 9.4.3 Registar Pagamento

Registe o pagamento do premio indicando os detalhes da transaccao.

#### 9.4.4 Exportacao

Exporte em PDF ou CSV.

### 9.5 Orcamento

**Caminho:** `Entidade > Orcamento` (`/entidade/orcamento`)

Gestao do orcamento da IGJ, organizado por projectos e rubricas.

#### 9.5.1 Consultar Orcamento

A tabela apresenta as seguintes colunas por rubrica:
- Orcamento Inicial
- Orcamento Corrigido
- Orcamento Disponivel
- Cabimentado (valor e percentagem)
- Pago (valor e percentagem)
- Saldo Disponivel

**Filtros disponiveis:**
- **Projecto** -- Filtrar por projecto especifico.
- **Ano** -- Filtrar por exercicio orcamental.

**Totais:** Sao apresentados automaticamente na parte inferior da tabela.

#### 9.5.2 Gerir Rubricas Orcamentais

1. Seleccione o projecto e o ano.
2. Adicione ou edite rubricas orcamentais.
3. Defina o valor do orcamento inicial para cada rubrica.

#### 9.5.3 Registar Cabimentacao

1. Abra a rubrica pretendida.
2. Clique em **Cabimentar**.
3. Preencha o valor do cabimento e a descricao.
4. Clique em **Guardar**.

#### 9.5.4 Registar Pagamento de Despesa

1. Abra o cabimento pretendido.
2. Registe o pagamento com data, valor e comprovativo.

#### 9.5.5 Exportacao

Exporte o orcamento em PDF ou CSV.

### 9.6 Visao Geral Financeira

O Dashboard apresenta uma visao consolidada de todas as informacoes financeiras (ver seccao 3.4.1). Adicionalmente, o sistema disponibiliza endpoints dedicados para exportacao da visao financeira global em PDF ou CSV.

---

## 10. Casos Suspeitos

**Caminho:** Acessivel dentro dos detalhes de cada entidade

O modulo de Casos Suspeitos visa apoiar a IGJ no cumprimento das suas obrigacoes no ambito da prevencao e combate ao branqueamento de capitais e financiamento do terrorismo.

### 10.1 Consultar Casos Suspeitos

1. Aceda aos detalhes da entidade.
2. Seleccione a seccao **Casos Suspeitos**.
3. A tabela apresenta a lista de casos com os dados principais.
4. Filtre por data ou pesquise por texto.

### 10.2 Registar Caso Suspeito

1. Clique em **Adicionar**.
2. Preencha os dados do caso:
   - Pessoa envolvida
   - Descricao da actividade suspeita
   - Data da ocorrencia
   - Valor envolvido
   - Documentos de suporte
3. Clique em **Guardar**.

### 10.3 Gerar Comunicado

1. Abra o caso suspeito pretendido.
2. Clique em **Gerar Comunicado**.
3. O sistema gera automaticamente o documento de comunicacao no formato PDF.

### 10.4 Exportacao

Exporte a lista de casos suspeitos em PDF ou CSV.

---

## 11. Notificacoes

**Caminho:** Icone de sino no cabecalho ou pagina dedicada (`/notificacoes`)

O SGIGJ possui um sistema de notificacoes em tempo real que informa os utilizadores sobre eventos e accoes relevantes.

### 11.1 Tipos de Notificacao

- **Notificacoes do Sistema** -- Geradas automaticamente pelo sistema (por exemplo, quando um processo lhe e atribuido, quando um despacho e emitido, quando um prazo esta a expirar).
- **Notificacoes por Email** -- Enviadas automaticamente para o endereco de email do utilizador, incluindo documentos PDF quando aplicavel.

### 11.2 Consultar Notificacoes

1. Clique no **icone de sino** no cabecalho da aplicacao para ver as notificacoes mais recentes.
2. Para ver todas as notificacoes, aceda a pagina de notificacoes (`/notificacoes`).
3. A lista apresenta:
   - Foto do remetente
   - Mensagem da notificacao
   - Data e hora
   - Link para o registo associado
4. Clique numa notificacao para aceder directamente ao registo relacionado (por exemplo, o processo de auto-exclusao que lhe foi atribuido).

### 11.3 Marcar como Lida

As notificacoes sao automaticamente marcadas como lidas quando o utilizador as consulta.

### 11.4 Configurar Notificacoes

Na edicao do seu perfil de utilizador, pode activar ou desactivar a recepcao de notificacoes atraves do interruptor **Notificacoes**.

---

## 12. Funcionalidades Transversais

### 12.1 Pesquisa e Filtragem

Todas as paginas de listagem do SGIGJ disponibilizam:

- **Caixa de pesquisa global** -- Situada no canto superior direito da tabela. Permite pesquisar em todas as colunas visiveis simultaneamente. Basta digitar o texto pretendido e a tabela filtra automaticamente.
- **Filtros especificos** -- Algumas paginas disponibilizam filtros adicionais (por ano, por estado, por data, etc.) situados acima da tabela.

### 12.2 Exportacao de Dados

O sistema permite exportar dados em dois formatos:

#### 12.2.1 Exportar para PDF

1. Localize o selector de download (tipicamente um campo de seleccao com as opcoes de exportacao).
2. Seleccione a opcao **PDF**.
3. O sistema gera o ficheiro PDF e abre-o numa nova janela do navegador.
4. A partir do visualizador de PDF, pode guardar ou imprimir o documento.

#### 12.2.2 Exportar para Excel/CSV

1. Localize o selector de download.
2. Seleccione a opcao **Excel** ou **CSV**.
3. O ficheiro e gerado e descarregado automaticamente para o seu computador.

**Nota:** Os ficheiros exportados reflectem os filtros activos no momento da exportacao. Aplique os filtros desejados antes de exportar.

### 12.3 Ordenacao de Tabelas

1. Clique no cabecalho de qualquer coluna para ordenar os dados.
2. Clique novamente para inverter a ordem (ascendente/descendente).
3. O icone de seta indica a direccao da ordenacao activa.

### 12.4 Paginacao

Todas as tabelas suportam paginacao:

1. Utilize o selector **Mostrar X entradas** para definir o numero de linhas por pagina (5, 10, 20, 30, 40 ou 50).
2. Utilize os botoes de paginacao na parte inferior:
   - **Primeira** -- Ir para a primeira pagina.
   - **Anterior** -- Pagina anterior.
   - **Proxima** -- Pagina seguinte.
   - **Ultima** -- Ir para a ultima pagina.
3. Ou introduza directamente o numero da pagina pretendida no campo **Ir para a pagina**.
4. O indicador de pagina mostra "Pagina X de Y".

### 12.5 Upload de Documentos

Em diversas seccoes do sistema e possivel anexar documentos:

1. Clique no campo ou botao de upload de ficheiros.
2. Seleccione o(s) ficheiro(s) no seu computador.
3. Aguarde o upload (o sistema armazena os ficheiros na nuvem).
4. Os documentos ficam associados ao registo em causa.

**Formatos aceites:** PDF, imagens (JPG, PNG), documentos Office e outros formatos comuns.

### 12.6 Editor de Texto Rico

Varias seccoes do sistema utilizam um editor de texto rico (WYSIWYG) para a redaccao de textos longos (despachos, observacoes, pareceres, etc.). O editor permite:

- Formatacao de texto (negrito, italico, sublinhado)
- Listas numeradas e com marcadores
- Alinhamento de texto
- Insercao de tabelas
- Copiar e colar de outros documentos

### 12.7 Auditoria

**Caminho:** `Entidade > Auditoria` (`/entidade/auditoria`)

O sistema regista automaticamente todas as operacoes realizadas (criacao, edicao, eliminacao de registos), permitindo consultar:

- Quem realizou a accao
- Quando foi realizada
- Que dados foram alterados

Este registo e imutavel e nao pode ser alterado ou eliminado.

---

## 13. Perfis de Utilizador e Permissoes

O SGIGJ utiliza um sistema de permissoes baseado em perfis. Cada utilizador e associado a um perfil que determina os menus e as funcionalidades a que tem acesso.

### 13.1 Perfis Pre-definidos

| Perfil | Descricao | Acessos Principais |
|--------|-----------|-------------------|
| **Super Admin** | Administrador com acesso total ao sistema. Pode gerir utilizadores, perfis, permissoes e todas as configuracoes. | Todos os modulos e funcionalidades |
| **Administrador** | Administrador do sistema com acesso abrangente, incluindo gestao de utilizadores e configuracoes. | Administracao, Configuracao, todos os modulos operacionais |
| **Gabinete** | Utilizador do gabinete da IGJ. Participa na gestao de processos e eventos. | Dashboard, Processos (consulta e edicao), Eventos, Entidades |
| **Inspetor** | Inspector de jogo. Pode instaurar processos e emitir despachos. | Dashboard, Processos (gestao completa), Entidades, Eventos |
| **Instrutor** | Instrutor de processos. Conduz a fase de instrucao dos processos que lhe sao atribuidos. | Processos (instrucao), Pecas processuais |
| **Entidade** | Utilizador externo representante de uma entidade de jogo. Acesso limitado aos dados da sua entidade. | Dashboard (limitado), dados da propria entidade |

### 13.2 Accoes por Pagina

Para cada pagina/funcionalidade, um perfil pode ter as seguintes permissoes:

| Accao | Descricao |
|-------|-----------|
| **Ler** | Visualizar registos |
| **Criar** | Adicionar novos registos |
| **Editar** | Alterar registos existentes |
| **Eliminar** | Remover registos |
| **Atribuir** | Atribuir permissoes (apenas na pagina de Permissoes) |

### 13.3 Comportamento do Sistema

- Se o utilizador nao tem permissao para aceder a uma pagina, e automaticamente redireccionado para a pagina principal.
- Os botoes de accao (Adicionar, Editar, Eliminar) so sao visiveis se o utilizador tiver a permissao correspondente.
- As seccoes do Dashboard sao apresentadas de acordo com as permissoes do perfil.

---

## 14. Perguntas Frequentes

### 14.1 Acesso e Autenticacao

**P: Esqueci a minha palavra-passe. Como posso recupera-la?**
R: O sistema nao dispoe de funcionalidade de recuperacao automatica de palavra-passe. Contacte o Administrador do Sistema para que este proceda a reposicao da sua palavra-passe.

**P: A minha sessao foi bloqueada. O que devo fazer?**
R: Introduza a sua palavra-passe no ecra de bloqueio para retomar a sessao. Se o problema persistir, termine a sessao e inicie uma nova.

**P: Nao consigo aceder a uma pagina especifica. Porque?**
R: O acesso a cada pagina depende do perfil e das permissoes atribuidas ao seu utilizador. Contacte o Administrador do Sistema para solicitar a concessao das permissoes necessarias.

### 14.2 Processos

**P: Como sei o estado actual de um processo?**
R: Na lista de processos, o estado e indicado por cores e/ou etiquetas. Processos activos encontram-se na pagina de Exclusao/Interdicao, finalizados na pagina de Finalizados, arquivados na pagina de Arquivados e prescritos na pagina de Prescritos.

**P: Posso recuperar um processo finalizado por engano?**
R: Sim, atraves da funcionalidade **Resgatar**. Localize o processo na lista de finalizados e clique no botao Resgatar. O processo regressara a lista de processos activos.

**P: Como funciona a prescricao de processos?**
R: O sistema monitoriza automaticamente o prazo de instrucao definido nas Predefinicoes. Quando o prazo e ultrapassado sem decisao, o processo e movido para a lista de Prescritos.

**P: Como gero o PDF de um despacho?**
R: Ao emitir um despacho (inicial ou final), o sistema gera automaticamente o PDF. Pode tambem utilizar o botao **Gerar texto** para pre-preencher o conteudo do despacho antes de o guardar e gerar o PDF.

### 14.3 Entidades e Financeiro

**P: Como registo um pagamento de contrapartida ou imposto?**
R: Aceda aos detalhes da entidade, seleccione a seccao financeira pretendida (Contrapartidas, Contribuicoes, Impostos ou Premios), localize o registo pendente e clique em **Pagamento** para registar os dados da transaccao.

**P: Como exporto um relatorio financeiro?**
R: Em todas as paginas de listagem financeira, utilize o selector de download para exportar os dados em PDF ou Excel.

### 14.4 Notificacoes

**P: Nao estou a receber notificacoes. O que devo verificar?**
R: Verifique se as notificacoes estao activadas no seu perfil de utilizador. Na edicao do utilizador, confirme que o interruptor de Notificacoes esta activo.

---

## 15. Glossario

| Termo | Definicao |
|-------|-----------|
| **Auto de Exclusao** | Documento que inicia formalmente o processo de exclusao/interdicao de uma pessoa das salas de jogo. |
| **Auto-Exclusao** | Pedido voluntario de uma pessoa para ser impedida de aceder a salas de jogo durante um periodo determinado. |
| **Banca** | Mesa de jogo de casino (ex.: roleta, blackjack, poker). |
| **Cabimentacao** | Reserva de dotacao orcamental para uma despesa futura. |
| **Coima** | Sancao pecuniaria aplicada por infraccao administrativa. |
| **Contrapartida** | Valor devido pelas entidades de jogo ao Estado, nos termos dos contratos de concessao. |
| **Contra-Ordenacao** | Procedimento administrativo instaurado contra uma entidade por violacao de normas legais ou regulamentares. |
| **Despacho** | Decisao formal emitida pela autoridade competente no ambito de um processo administrativo. |
| **Entidade** | Empresa ou organizacao que explora actividades de jogo (ex.: casino). |
| **Exclusao** | Impedimento de acesso de uma pessoa as salas de jogo, determinado por decisao administrativa. |
| **Handpay** | Pagamento manual de premios de valor elevado em maquinas de jogo, sujeito a registo obrigatorio. |
| **IGJ** | Inspeccao Geral de Jogos -- orgao de regulacao e fiscalizacao dos jogos em Cabo Verde. |
| **Instrucao** | Fase do processo administrativo em que sao recolhidas provas e produzidas as pecas processuais necessarias para a decisao. |
| **Instrutor** | Funcionario nomeado para conduzir a fase de instrucao de um processo administrativo. |
| **Interdicao** | Proibicao permanente ou temporaria de acesso de uma pessoa as salas de jogo. |
| **Juntada** | Compilacao de todos os documentos de um processo num unico ficheiro. |
| **KPI** | Key Performance Indicator -- Indicador-chave de desempenho. |
| **Peca Processual** | Documento produzido no decurso da instrucao de um processo administrativo (ex.: nota de comunicacao, relatorio, auto-declaracao). |
| **Perfil** | Conjunto de permissoes que define o nivel de acesso de um utilizador ao sistema. |
| **Prescricao** | Extincao do processo por decurso do prazo legal para a sua conclusao. |
| **Rubrica** | Linha do orcamento que especifica a natureza de uma receita ou despesa. |
| **SGIGJ** | Sistema Integrado de Gestao da Inspeccao Geral de Jogos. |
| **Visado** | Pessoa sobre quem recai um processo de exclusao, interdicao ou contra-ordenacao. |

---

## 16. Contactos e Suporte

Para questoes tecnicas ou de utilizacao do sistema, contacte:

**Administracao do Sistema SGIGJ**
Inspeccao Geral de Jogos de Cabo Verde

Em caso de dificuldades de acesso, problemas tecnicos ou sugestoes de melhoria, dirija-se ao Administrador do Sistema ou utilize os canais internos de comunicacao da IGJ.

---

**Pagina de Ajuda no Sistema:** O SGIGJ disponibiliza uma pagina de ajuda integrada, acessivel atraves do menu `Ajuda` (`/ajuda`).

---

*Documento elaborado em Fevereiro de 2026.*
*SGIGJ -- Sistema Integrado de Gestao da Inspeccao Geral de Jogos de Cabo Verde.*
*Versao 2.0*
