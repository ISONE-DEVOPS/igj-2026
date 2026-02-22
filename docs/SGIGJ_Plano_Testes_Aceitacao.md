# SGIGJ - Plano de Testes de Aceitação do Utilizador (UAT)

**Sistema**: Sistema de Gestão Integrada de Jogo (SGIGJ)
**Versão**: 1.0
**Data**: 22 de fevereiro de 2026
**Objetivo**: Validação funcional de todos os módulos do sistema para efeitos de aceitação e entrega formal do projeto

---

## 1. Introdução

O presente documento descreve o **Plano de Testes de Aceitação do Utilizador (UAT - User Acceptance Testing)** para o sistema SGIGJ. Os testes aqui definidos devem ser executados pelo cliente com o objetivo de verificar que todas as funcionalidades entregues cumprem os requisitos acordados e estão em condições de operação em ambiente de produção.

### 1.1 Âmbito

Os testes abrangem a totalidade dos módulos do sistema:

- Autenticação e Controlo de Acessos
- Dashboard
- Administração
- Configuração
- Entidades
- Eventos
- Processos
- Funcionalidades Transversais (notificações, exportações, ficheiros)

### 1.2 Pré-requisitos

| # | Pré-requisito | Responsável |
|---|--------------|-------------|
| 1 | Acesso ao ambiente de produção/testes com credenciais válidas | Equipa de desenvolvimento |
| 2 | Pelo menos 2 perfis de utilizador configurados (administrador e utilizador normal) | Equipa de desenvolvimento |
| 3 | Dados de teste carregados no sistema (entidades, pessoas, processos) | Cliente / Equipa de desenvolvimento |
| 4 | Navegador compatível (Google Chrome, Mozilla Firefox - versões recentes) | Cliente |
| 5 | Acesso à internet estável | Cliente |

### 1.3 Classificação de Resultados

Para cada caso de teste, registar o resultado utilizando a seguinte classificação:

| Resultado | Descrição |
|-----------|-----------|
| **OK** | Funcionalidade opera conforme esperado |
| **NOK** | Funcionalidade não opera conforme esperado (registar observação) |
| **N/A** | Não aplicável ou não testado |

### 1.4 Informações de Registo

Para cada teste, preencher:

- **Testado por**: Nome do utilizador que executou o teste
- **Data**: Data de execução
- **Resultado**: OK / NOK / N/A
- **Observações**: Comentários, erros encontrados ou sugestões

---

## 2. Autenticação e Controlo de Acessos

### 2.1 Login

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 2.1.1 | Login com credenciais válidas | 1. Aceder ao URL do sistema 2. Inserir utilizador e palavra-passe válidos 3. Clicar em "Entrar" | O utilizador é autenticado e redirecionado para o Dashboard | | |
| 2.1.2 | Login com credenciais inválidas | 1. Inserir utilizador ou palavra-passe incorretos 2. Clicar em "Entrar" | Mensagem de erro apresentada; acesso negado | | |
| 2.1.3 | Sessão expirada | 1. Efetuar login 2. Aguardar expiração da sessão ou simular expiração | O utilizador é redirecionado para a página de login | | |

### 2.2 Controlo de Acessos

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 2.2.1 | Menus conforme perfil | 1. Fazer login com perfil de administrador 2. Verificar menus visíveis 3. Repetir com perfil de utilizador normal | Cada perfil vê apenas os menus a que tem acesso | | |
| 2.2.2 | Acesso direto a URL restrito | 1. Fazer login com perfil sem acesso a um módulo 2. Tentar aceder ao URL do módulo diretamente | Acesso negado ou redirecionamento | | |
| 2.2.3 | Permissões de ações (criar, editar, eliminar) | 1. Verificar se as ações disponíveis correspondem às permissões do perfil | Botões de ações visíveis apenas conforme permissões | | |

---

## 3. Dashboard

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 3.1 | Carregamento do Dashboard | 1. Fazer login 2. Navegar para o Dashboard | Dashboard carrega sem erros; KPIs e gráficos são apresentados | | |
| 3.2 | Filtro por ano | 1. No Dashboard, alterar o filtro de ano | Dados e gráficos atualizam conforme o ano selecionado | | |
| 3.3 | Filtro por entidade | 1. No Dashboard, alterar o filtro de entidade | Dados filtrados pela entidade selecionada | | |
| 3.4 | Indicadores (KPIs) | 1. Verificar se os KPIs apresentam valores coerentes | Valores numéricos apresentados corretamente | | |
| 3.5 | Gráfico tendência financeira | 1. Verificar o gráfico de tendência financeira | Gráfico renderizado com dados corretos | | |
| 3.6 | Gráfico composição de receitas | 1. Verificar o gráfico de receitas | Dados de receita apresentados por categoria | | |
| 3.7 | Gráfico receita por entidade | 1. Verificar a distribuição de receitas por entidade | Valores coerentes por entidade | | |
| 3.8 | Mapa de equipamentos (treemap) | 1. Verificar a visualização treemap de equipamentos | Equipamentos agrupados corretamente | | |
| 3.9 | Gráfico tendência de processos | 1. Verificar o gráfico de processos | Evolução dos processos apresentada | | |
| 3.10 | Gráfico status de processos | 1. Verificar os estados dos processos | Estados corretos e proporcionais | | |
| 3.11 | Gráfico status de eventos | 1. Verificar o gráfico de eventos | Eventos categorizados por estado | | |
| 3.12 | Mapa de calor de atividade | 1. Verificar o heatmap de atividade | Atividade apresentada por período | | |
| 3.13 | Análise de handpay | 1. Verificar dados de handpay no dashboard | Valores de handpay corretos | | |
| 3.14 | Casos suspeitos | 1. Verificar a secção de casos suspeitos | Casos apresentados corretamente | | |
| 3.15 | Visualização de orçamento | 1. Verificar dados de orçamento | Valores orçamentais corretos | | |
| 3.16 | Execução orçamental | 1. Verificar dados de execução | Percentagens de execução corretas | | |
| 3.17 | Exportação PDF do Dashboard | 1. Clicar no botão de exportação PDF | PDF gerado com os dados e gráficos do dashboard | | |

---

## 4. Administração

### 4.1 Gestão de Menus

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 4.1.1 | Listar menus | 1. Navegar para Administração > Menu | Lista de menus apresentada com filtros disponíveis | | |
| 4.1.2 | Criar menu | 1. Clicar em "Novo" 2. Preencher dados do menu 3. Guardar | Menu criado com sucesso | | |
| 4.1.3 | Editar menu | 1. Selecionar um menu existente 2. Alterar dados 3. Guardar | Menu atualizado com sucesso | | |
| 4.1.4 | Eliminar menu | 1. Selecionar um menu 2. Clicar em "Eliminar" 3. Confirmar | Menu eliminado com sucesso | | |
| 4.1.5 | Pesquisar menus | 1. Utilizar o campo de pesquisa/filtro | Resultados filtrados corretamente | | |

### 4.2 Gestão de Perfis

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 4.2.1 | Listar perfis | 1. Navegar para Administração > Perfil | Lista de perfis apresentada | | |
| 4.2.2 | Criar perfil | 1. Clicar em "Novo" 2. Preencher nome e descrição 3. Guardar | Perfil criado com sucesso | | |
| 4.2.3 | Editar perfil | 1. Selecionar perfil 2. Alterar dados 3. Guardar | Perfil atualizado com sucesso | | |
| 4.2.4 | Eliminar perfil | 1. Selecionar perfil 2. Clicar em "Eliminar" 3. Confirmar | Perfil eliminado com sucesso | | |

### 4.3 Ações de Menu (Permissões)

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 4.3.1 | Listar ações de menu | 1. Navegar para Administração > Ações de Menu | Lista de ações de menu apresentada | | |
| 4.3.2 | Associar ação a menu | 1. Selecionar menu 2. Adicionar ação 3. Guardar | Ação associada corretamente | | |
| 4.3.3 | Remover ação de menu | 1. Selecionar ação associada 2. Remover | Ação removida com sucesso | | |

### 4.4 Gestão de Utilizadores

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 4.4.1 | Listar utilizadores | 1. Navegar para Administração > Utilizador | Lista de utilizadores apresentada | | |
| 4.4.2 | Criar utilizador | 1. Clicar em "Novo" 2. Preencher dados 3. Atribuir perfil 4. Guardar | Utilizador criado com sucesso | | |
| 4.4.3 | Editar utilizador | 1. Selecionar utilizador 2. Alterar dados 3. Guardar | Utilizador atualizado | | |
| 4.4.4 | Eliminar utilizador | 1. Selecionar utilizador 2. Eliminar | Utilizador eliminado | | |
| 4.4.5 | Alterar palavra-passe | 1. Aceder ao perfil próprio 2. Alterar palavra-passe 3. Guardar | Palavra-passe alterada com sucesso; login funcional com nova palavra-passe | | |
| 4.4.6 | Pesquisar utilizadores | 1. Utilizar filtros de pesquisa | Resultados filtrados corretamente | | |

### 4.5 Gestão de Permissões

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 4.5.1 | Atribuir permissões a perfil | 1. Navegar para Administração > Permissões 2. Selecionar perfil 3. Marcar/desmarcar menus e ações 4. Guardar | Permissões atualizadas; utilizadores do perfil veem apenas o autorizado | | |
| 4.5.2 | Verificar efeito das permissões | 1. Fazer login com utilizador do perfil alterado 2. Verificar menus e ações disponíveis | Menus e ações correspondem às permissões definidas | | |

---

## 5. Configuração

> **Nota**: Os módulos de configuração seguem o mesmo padrão CRUD (Criar, Ler, Atualizar, Eliminar). Para cada subgrupo, validar as operações básicas.

### 5.1 Subgrupo: Pessoas

| # | Módulo | Criar | Editar | Eliminar | Listar/Pesquisar | Resultado | Observações |
|---|--------|-------|--------|----------|-----------------|-----------|-------------|
| 5.1.1 | Estado Civil | | | | | | |
| 5.1.2 | Género | | | | | | |
| 5.1.3 | Língua | | | | | | |
| 5.1.4 | Nível Linguístico | | | | | | |
| 5.1.5 | Nível de Escolaridade | | | | | | |
| 5.1.6 | Profissão | | | | | | |
| 5.1.7 | Categoria Profissional | | | | | | |
| 5.1.8 | Tipo de Cargo | | | | | | |
| 5.1.9 | Tipo de Contacto | | | | | | |

### 5.2 Subgrupo: Entidades

| # | Módulo | Criar | Editar | Eliminar | Listar/Pesquisar | Resultado | Observações |
|---|--------|-------|--------|----------|-----------------|-----------|-------------|
| 5.2.1 | Tipo de Entidade | | | | | | |
| 5.2.2 | Tipologia | | | | | | |
| 5.2.3 | Tipo de Banca | | | | | | |
| 5.2.4 | Classificação de Equipamento | | | | | | |
| 5.2.5 | Tipo de Equipamento | | | | | | |
| 5.2.6 | Tipo de Máquina | | | | | | |

### 5.3 Subgrupo: Financeiro

| # | Módulo | Criar | Editar | Eliminar | Listar/Pesquisar | Resultado | Observações |
|---|--------|-------|--------|----------|-----------------|-----------|-------------|
| 5.3.1 | Meio de Pagamento | | | | | | |
| 5.3.2 | Modalidade de Pagamento | | | | | | |
| 5.3.3 | Divisas (Moedas) | | | | | | |
| 5.3.4 | Banco | | | | | | |
| 5.3.5 | Taxa Casino | | | | | | |

### 5.4 Subgrupo: Processos

| # | Módulo | Criar | Editar | Eliminar | Listar/Pesquisar | Resultado | Observações |
|---|--------|-------|--------|----------|-----------------|-----------|-------------|
| 5.4.1 | Peças Processuais | | | | | | |
| 5.4.2 | Campos | | | | | | |
| 5.4.3 | Infração | | | | | | |
| 5.4.4 | Coima | | | | | | |
| 5.4.5 | Período de Exclusão | | | | | | |
| 5.4.6 | Motivo de Exclusão | | | | | | |
| 5.4.7 | Tipo de Decisão | | | | | | |
| 5.4.8 | Tipo de Parecer | | | | | | |
| 5.4.9 | Tipo de Origem | | | | | | |
| 5.4.10 | Tipo de Evento | | | | | | |
| 5.4.11 | Status | | | | | | |

### 5.5 Subgrupo: Geral

| # | Módulo | Criar | Editar | Eliminar | Listar/Pesquisar | Resultado | Observações |
|---|--------|-------|--------|----------|-----------------|-----------|-------------|
| 5.5.1 | Tipo de Documento | | | | | | |
| 5.5.2 | Projetos | | | | | | |
| 5.5.3 | Rubricas | | | | | | |
| 5.5.4 | Tempo Limite de Decisão | | | | | | |

---

## 6. Entidades

### 6.1 Gestão de Entidades

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.1.1 | Listar entidades | 1. Navegar para Entidades > Entidades | Lista de entidades apresentada com filtros | | |
| 6.1.2 | Criar entidade | 1. Clicar em "Novo" 2. Preencher dados (nome, tipo, tipologia, etc.) 3. Guardar | Entidade criada com sucesso | | |
| 6.1.3 | Editar entidade | 1. Selecionar entidade 2. Alterar dados 3. Guardar | Entidade atualizada | | |
| 6.1.4 | Eliminar entidade | 1. Selecionar entidade 2. Eliminar 3. Confirmar | Entidade eliminada | | |
| 6.1.5 | Pesquisar entidades | 1. Utilizar filtros de pesquisa | Resultados filtrados corretamente | | |
| 6.1.6 | Ver detalhes da entidade | 1. Clicar numa entidade para abrir os detalhes | Página de detalhes apresentada com todas as informações | | |

### 6.2 Banca (Informação Bancária)

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.2.1 | Listar contas bancárias | 1. Na entidade, aceder à secção Banca | Lista de contas bancárias da entidade | | |
| 6.2.2 | Adicionar conta bancária | 1. Clicar em "Novo" 2. Preencher IBAN e dados bancários 3. Guardar | Conta adicionada | | |
| 6.2.3 | Editar conta bancária | 1. Selecionar conta 2. Alterar dados 3. Guardar | Conta atualizada | | |
| 6.2.4 | Eliminar conta bancária | 1. Selecionar conta 2. Eliminar | Conta eliminada | | |
| 6.2.5 | Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado com dados corretos | | |

### 6.3 Colaboradores

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.3.1 | Listar colaboradores | 1. Na entidade, aceder à secção Colaboradores | Lista de colaboradores da entidade | | |
| 6.3.2 | Adicionar colaborador | 1. Clicar em "Novo" 2. Selecionar pessoa 3. Atribuir cargo 4. Guardar | Colaborador associado | | |
| 6.3.3 | Editar colaborador | 1. Selecionar colaborador 2. Alterar dados 3. Guardar | Dados atualizados | | |
| 6.3.4 | Remover colaborador | 1. Selecionar colaborador 2. Remover | Associação removida | | |
| 6.3.5 | Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado corretamente | | |

### 6.4 Equipamentos

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.4.1 | Listar equipamentos | 1. Na entidade, aceder à secção Equipamento | Lista de equipamentos da entidade | | |
| 6.4.2 | Adicionar equipamento | 1. Clicar em "Novo" 2. Preencher tipo, classificação, número de série 3. Guardar | Equipamento adicionado | | |
| 6.4.3 | Editar equipamento | 1. Selecionar equipamento 2. Alterar dados 3. Guardar | Equipamento atualizado | | |
| 6.4.4 | Eliminar equipamento | 1. Selecionar equipamento 2. Eliminar | Equipamento eliminado | | |
| 6.4.5 | Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado corretamente | | |

### 6.5 Grupos de Equipamentos

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.5.1 | Listar grupos | 1. Na entidade, aceder à secção Grupos | Lista de grupos apresentada | | |
| 6.5.2 | Criar grupo | 1. Clicar em "Novo" 2. Preencher dados 3. Guardar | Grupo criado | | |
| 6.5.3 | Editar grupo | 1. Selecionar grupo 2. Alterar dados 3. Guardar | Grupo atualizado | | |
| 6.5.4 | Eliminar grupo | 1. Selecionar grupo 2. Eliminar | Grupo eliminado | | |

### 6.6 Máquinas

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.6.1 | Listar máquinas | 1. Na entidade, aceder à secção Máquinas | Lista de máquinas da entidade | | |
| 6.6.2 | Adicionar máquina | 1. Clicar em "Novo" 2. Preencher tipo, estado 3. Guardar | Máquina adicionada | | |
| 6.6.3 | Editar máquina | 1. Selecionar máquina 2. Alterar dados 3. Guardar | Máquina atualizada | | |
| 6.6.4 | Eliminar máquina | 1. Selecionar máquina 2. Eliminar | Máquina eliminada | | |
| 6.6.5 | Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado corretamente | | |

### 6.7 Casos Suspeitos

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.7.1 | Listar casos suspeitos | 1. Na entidade, aceder à secção Casos Suspeitos | Lista de casos apresentada | | |
| 6.7.2 | Criar caso suspeito | 1. Clicar em "Novo" 2. Preencher dados do caso 3. Guardar | Caso registado | | |
| 6.7.3 | Editar caso suspeito | 1. Selecionar caso 2. Alterar dados 3. Guardar | Caso atualizado | | |
| 6.7.4 | Eliminar caso suspeito | 1. Selecionar caso 2. Eliminar | Caso eliminado | | |
| 6.7.5 | Gerar documento PDF | 1. Clicar na opção de gerar documento | Documento PDF gerado com os dados do caso | | |
| 6.7.6 | Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado corretamente | | |

### 6.8 Contrapartidas

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.8.1 | Listar contrapartidas | 1. Na entidade, aceder à secção Contrapartidas | Lista de contrapartidas apresentada | | |
| 6.8.2 | Criar contrapartida | 1. Clicar em "Novo" 2. Preencher dados 3. Guardar | Contrapartida criada | | |
| 6.8.3 | Editar contrapartida | 1. Selecionar contrapartida 2. Alterar dados 3. Guardar | Contrapartida atualizada | | |
| 6.8.4 | Eliminar contrapartida | 1. Selecionar contrapartida 2. Eliminar | Contrapartida eliminada | | |
| 6.8.5 | Registar pagamento | 1. Na contrapartida, adicionar pagamento 2. Guardar | Pagamento registado | | |
| 6.8.6 | Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado corretamente | | |

### 6.9 Contribuições

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.9.1 | Listar contribuições | 1. Na entidade, aceder à secção Contribuições | Lista de contribuições apresentada | | |
| 6.9.2 | Criar contribuição | 1. Clicar em "Novo" 2. Preencher dados 3. Guardar | Contribuição criada | | |
| 6.9.3 | Editar contribuição | 1. Selecionar contribuição 2. Alterar dados 3. Guardar | Contribuição atualizada | | |
| 6.9.4 | Eliminar contribuição | 1. Selecionar contribuição 2. Eliminar | Contribuição eliminada | | |
| 6.9.5 | Registar pagamento | 1. Na contribuição, adicionar pagamento 2. Guardar | Pagamento registado | | |
| 6.9.6 | Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado corretamente | | |

### 6.10 Impostos

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.10.1 | Listar impostos | 1. Na entidade, aceder à secção Impostos | Lista de impostos apresentada | | |
| 6.10.2 | Criar imposto | 1. Clicar em "Novo" 2. Preencher dados 3. Guardar | Imposto criado | | |
| 6.10.3 | Editar imposto | 1. Selecionar imposto 2. Alterar dados 3. Guardar | Imposto atualizado | | |
| 6.10.4 | Eliminar imposto | 1. Selecionar imposto 2. Eliminar | Imposto eliminado | | |
| 6.10.5 | Parametrizar imposto | 1. Configurar parâmetros do imposto 2. Guardar | Parametrização guardada | | |
| 6.10.6 | Registar pagamento | 1. No imposto, adicionar pagamento 2. Guardar | Pagamento registado | | |
| 6.10.7 | Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado corretamente | | |

### 6.11 Prémios

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.11.1 | Listar prémios | 1. Na entidade, aceder à secção Prémios | Lista de prémios apresentada | | |
| 6.11.2 | Criar prémio | 1. Clicar em "Novo" 2. Preencher dados 3. Guardar | Prémio criado | | |
| 6.11.3 | Editar prémio | 1. Selecionar prémio 2. Alterar dados 3. Guardar | Prémio atualizado | | |
| 6.11.4 | Eliminar prémio | 1. Selecionar prémio 2. Eliminar | Prémio eliminado | | |
| 6.11.5 | Registar pagamento de prémio | 1. No prémio, registar pagamento 2. Guardar | Pagamento registado | | |
| 6.11.6 | Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado corretamente | | |

### 6.12 Gestão de Pessoas

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.12.1 | Listar pessoas | 1. Navegar para Entidades > Pessoas | Lista de pessoas apresentada | | |
| 6.12.2 | Criar pessoa | 1. Clicar em "Novo" 2. Preencher dados pessoais (nome, género, estado civil, etc.) 3. Guardar | Pessoa criada com sucesso | | |
| 6.12.3 | Editar pessoa | 1. Selecionar pessoa 2. Alterar dados 3. Guardar | Pessoa atualizada | | |
| 6.12.4 | Eliminar pessoa | 1. Selecionar pessoa 2. Eliminar | Pessoa eliminada | | |
| 6.12.5 | Adicionar contacto | 1. Na pessoa, adicionar contacto (telefone, email) 2. Guardar | Contacto adicionado | | |
| 6.12.6 | Adicionar documento | 1. Na pessoa, adicionar documento de identificação 2. Guardar | Documento adicionado | | |
| 6.12.7 | Pesquisar pessoas | 1. Utilizar filtros de pesquisa | Resultados filtrados corretamente | | |

### 6.13 IGJ (Entidade Reguladora)

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 6.13.1 | Visão geral | 1. Navegar para Entidades > IGJ > Visão Geral | Página de visão geral com resumos e estatísticas | | |
| 6.13.2 | Orçamento - Listar | 1. Navegar para Orçamento | Lista de orçamentos apresentada | | |
| 6.13.3 | Orçamento - Criar | 1. Clicar em "Novo" 2. Preencher dados orçamentais 3. Guardar | Orçamento criado | | |
| 6.13.4 | Orçamento - Registar despesa | 1. No orçamento, adicionar despesa 2. Guardar | Despesa registada | | |
| 6.13.5 | Orçamento - Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado corretamente | | |
| 6.13.6 | Resumo financeiro | 1. Aceder ao resumo financeiro | Dados financeiros consolidados | | |
| 6.13.7 | Auditoria | 1. Navegar para Auditoria | Registos de auditoria apresentados (ações dos utilizadores) | | |

---

## 7. Eventos

### 7.1 Eventos - Pedidos

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 7.1.1 | Listar eventos pedidos | 1. Navegar para Eventos > Pedidos | Lista de eventos pendentes apresentada | | |
| 7.1.2 | Criar pedido de evento | 1. Clicar em "Novo" 2. Preencher dados do evento (entidade, tipo, datas, etc.) 3. Guardar | Pedido de evento criado | | |
| 7.1.3 | Editar pedido de evento | 1. Selecionar evento 2. Alterar dados 3. Guardar | Evento atualizado | | |
| 7.1.4 | Aprovar evento | 1. Selecionar evento pendente 2. Registar decisão de aprovação 3. Guardar | Evento aprovado; aparece na lista de aprovados | | |
| 7.1.5 | Recusar evento | 1. Selecionar evento pendente 2. Registar decisão de recusa 3. Guardar | Evento recusado; aparece na lista de recusados | | |
| 7.1.6 | Registar parecer | 1. No evento, adicionar parecer/opinião 2. Guardar | Parecer registado | | |
| 7.1.7 | Registar despacho | 1. No evento, adicionar despacho 2. Guardar | Despacho registado | | |
| 7.1.8 | Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado corretamente | | |

### 7.2 Eventos - Aprovados

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 7.2.1 | Listar eventos aprovados | 1. Navegar para Eventos > Aprovados | Lista de eventos aprovados apresentada | | |
| 7.2.2 | Consultar detalhes | 1. Selecionar evento aprovado | Detalhes do evento apresentados com decisão e parecer | | |
| 7.2.3 | Pesquisar eventos | 1. Utilizar filtros de pesquisa | Resultados filtrados corretamente | | |

### 7.3 Eventos - Recusados

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 7.3.1 | Listar eventos recusados | 1. Navegar para Eventos > Recusados | Lista de eventos recusados apresentada | | |
| 7.3.2 | Consultar detalhes | 1. Selecionar evento recusado | Detalhes do evento com motivo de recusa | | |

---

## 8. Processos

### 8.1 Autoexclusão

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 8.1.1 | Listar pedidos de autoexclusão | 1. Navegar para Processos > Autoexclusão | Lista de pedidos apresentada | | |
| 8.1.2 | Criar pedido de autoexclusão | 1. Clicar em "Novo" 2. Preencher dados (pessoa, motivo, período) 3. Guardar | Pedido criado com REF gerada automaticamente | | |
| 8.1.3 | Editar pedido | 1. Selecionar pedido 2. Alterar dados 3. Guardar | Pedido atualizado | | |
| 8.1.4 | Registar despacho | 1. Selecionar pedido 2. Registar despacho/decisão 3. Guardar | Despacho registado | | |
| 8.1.5 | Exportar CSV | 1. Clicar no botão de exportação CSV | Ficheiro CSV gerado | | |
| 8.1.6 | Exportar PDF | 1. Clicar no botão de exportação PDF | Ficheiro PDF gerado | | |

### 8.2 Handpay

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 8.2.1 | Listar registos de handpay | 1. Navegar para Processos > Handpay | Lista de registos apresentada | | |
| 8.2.2 | Gerar handpay | 1. Clicar em "Gerar" 2. Selecionar parâmetros 3. Confirmar | Registos de handpay gerados com REF | | |
| 8.2.3 | Editar registo | 1. Selecionar registo 2. Alterar dados 3. Guardar | Registo atualizado | | |
| 8.2.4 | Regenerar referências | 1. Utilizar a opção de regenerar REFs | Referências recalculadas corretamente | | |
| 8.2.5 | Pesquisar handpay | 1. Utilizar filtros de pesquisa | Resultados filtrados corretamente | | |
| 8.2.6 | Exportar CSV | 1. Clicar no botão de exportação | Ficheiro gerado | | |
| 8.2.7 | Exportar PDF | 1. Clicar no botão de exportação | Ficheiro gerado | | |

### 8.3 Exclusão - Interdição (Fluxo Completo)

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 8.3.1 | Listar processos de exclusão | 1. Navegar para Processos > Exclusão - Interdição | Lista de processos apresentada | | |
| 8.3.2 | Criar processo de exclusão | 1. Clicar em "Novo" 2. Preencher dados (pessoa, motivo, período de exclusão) 3. Guardar | Processo criado com REF gerada | | |
| 8.3.3 | Despacho Inicial | 1. Selecionar processo 2. Registar despacho inicial 3. Guardar | Despacho inicial registado; processo avança para fase de instrução | | |
| 8.3.4 | Instrução - Adicionar peça processual | 1. Na fase de instrução, adicionar peça processual 2. Preencher campos configurados 3. Guardar | Peça processual adicionada ao processo | | |
| 8.3.5 | Instrução - Registar notificação | 1. Na instrução, registar notificação 2. Guardar | Notificação registada | | |
| 8.3.6 | Instrução - Nota de comunicação | 1. Adicionar nota de comunicação 2. Guardar | Nota registada | | |
| 8.3.7 | Instrução - Interromper processo | 1. Marcar processo como interrompido 2. Indicar motivo 3. Guardar | Processo marcado como interrompido | | |
| 8.3.8 | Despacho Final | 1. Registar despacho final 2. Indicar decisão 3. Guardar | Despacho final registado; processo avança | | |
| 8.3.9 | Termo de Encerramento | 1. Gerar termo de encerramento 2. Verificar conteúdo 3. Confirmar | Termo gerado com dados do processo | | |
| 8.3.10 | Tempo limite | 1. Verificar o indicador de tempo limite do processo | Tempo limite apresentado conforme configuração | | |
| 8.3.11 | Anexar documentos | 1. No processo, anexar ficheiro 2. Guardar | Ficheiro anexado com sucesso | | |
| 8.3.12 | Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado corretamente | | |

### 8.4 Exclusão - Finalizados

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 8.4.1 | Listar processos finalizados | 1. Navegar para Processos > Exclusão - Finalizado | Lista de processos finalizados | | |
| 8.4.2 | Consultar detalhes | 1. Selecionar processo finalizado | Todos os detalhes do processo (despachos, instrução, termo) apresentados | | |
| 8.4.3 | Pesquisar processos | 1. Utilizar filtros de pesquisa | Resultados filtrados corretamente | | |

### 8.5 Exclusão - Prescritos

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 8.5.1 | Listar processos prescritos | 1. Navegar para Processos > Exclusão - Prescritos | Lista de processos prescritos/expirados | | |
| 8.5.2 | Consultar detalhes | 1. Selecionar processo prescrito | Detalhes apresentados com datas de prescrição | | |

### 8.6 Exclusão - Arquivados

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 8.6.1 | Listar processos arquivados | 1. Navegar para Processos > Exclusão - Arquivados | Lista de processos arquivados | | |
| 8.6.2 | Consultar detalhes | 1. Selecionar processo arquivado | Detalhes completos apresentados | | |
| 8.6.3 | Resgatar processo | 1. Selecionar processo 2. Utilizar opção de resgate | Processo resgatado e disponível para continuação | | |

### 8.7 Reclamações

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 8.7.1 | Listar reclamações | 1. Navegar para Processos > Reclamação | Lista de reclamações apresentada | | |
| 8.7.2 | Criar reclamação | 1. Clicar em "Novo" 2. Preencher dados da reclamação 3. Guardar | Reclamação criada com REF | | |
| 8.7.3 | Editar reclamação | 1. Selecionar reclamação 2. Alterar dados 3. Guardar | Reclamação atualizada | | |
| 8.7.4 | Eliminar reclamação | 1. Selecionar reclamação 2. Eliminar | Reclamação eliminada | | |
| 8.7.5 | Adicionar peça processual | 1. Na reclamação, adicionar peça 2. Guardar | Peça adicionada | | |
| 8.7.6 | Estatísticas de reclamações | 1. Navegar para Reclamação > Estatísticas | Gráficos estatísticos apresentados (tendência anual, distribuição mensal, reclamações por entidade) | | |
| 8.7.7 | Exportar CSV/PDF | 1. Clicar no botão de exportação | Ficheiro gerado corretamente | | |

### 8.8 Contra-Ordenação

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 8.8.1 | Listar contra-ordenações | 1. Navegar para Processos > Contra-Ordenação | Lista de processos de contra-ordenação | | |
| 8.8.2 | Criar contra-ordenação | 1. Clicar em "Novo" 2. Preencher dados (infração, coima) 3. Guardar | Processo criado | | |
| 8.8.3 | Editar contra-ordenação | 1. Selecionar processo 2. Alterar dados 3. Guardar | Processo atualizado | | |
| 8.8.4 | Registar despacho | 1. No processo, registar despacho/decisão 2. Guardar | Despacho registado | | |
| 8.8.5 | Exportar CSV | 1. Clicar no botão de exportação | Ficheiro gerado | | |

---

## 9. Notificações

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 9.1 | Receber notificação | 1. Executar uma ação que gera notificação (ex.: despacho) 2. Verificar se a notificação aparece em tempo real | Notificação recebida no ícone de notificações | | |
| 9.2 | Listar notificações | 1. Navegar para a página de notificações | Lista de notificações apresentada | | |
| 9.3 | Marcar como lida | 1. Selecionar uma notificação 2. Marcar como lida | Notificação marcada como lida; contador atualizado | | |
| 9.4 | Ver detalhes da notificação | 1. Clicar numa notificação | Detalhes da notificação apresentados | | |

---

## 10. Funcionalidades Transversais

### 10.1 Gestão de Ficheiros

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 10.1.1 | Upload de ficheiro | 1. Em qualquer módulo com anexos, clicar em "Anexar" 2. Selecionar ficheiro 3. Confirmar | Ficheiro carregado com sucesso | | |
| 10.1.2 | Download de ficheiro | 1. Clicar num ficheiro anexado | Ficheiro descarregado corretamente | | |
| 10.1.3 | Tipos de ficheiro suportados | 1. Testar upload de PDF, imagem, documento Office | Todos os tipos suportados são aceites | | |

### 10.2 Exportações

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 10.2.1 | Exportação CSV | 1. Em qualquer módulo com exportação, clicar em "CSV" | Ficheiro CSV gerado com dados corretos e formatação adequada | | |
| 10.2.2 | Exportação PDF | 1. Em qualquer módulo com exportação, clicar em "PDF" | Ficheiro PDF gerado com layout legível e dados corretos | | |

### 10.3 Pesquisa e Filtros

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 10.3.1 | Pesquisa global por texto | 1. Em qualquer listagem, utilizar o campo de pesquisa 2. Inserir texto | Resultados filtrados conforme o texto inserido | | |
| 10.3.2 | Filtros combinados | 1. Aplicar múltiplos filtros simultaneamente | Resultados refletem todos os filtros aplicados | | |
| 10.3.3 | Limpar filtros | 1. Após aplicar filtros, clicar em "Limpar" ou remover filtros | Lista retorna ao estado completo | | |

### 10.4 Geração de Referências

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 10.4.1 | Geração automática de REF | 1. Criar um novo registo que gere REF (processo, handpay) | REF gerada no formato AAAA.NNNN (ex.: 2026.0001) | | |
| 10.4.2 | Sequência de REFs | 1. Criar vários registos consecutivos | REFs incrementadas sequencialmente | | |

### 10.5 Responsividade e Usabilidade

| # | Caso de Teste | Passos | Resultado Esperado | Resultado | Observações |
|---|--------------|--------|-------------------|-----------|-------------|
| 10.5.1 | Navegação por menus | 1. Navegar por todos os menus e submenus | Todos os menus funcionam e direcionam para as páginas corretas | | |
| 10.5.2 | Mensagens de feedback | 1. Executar operações (criar, editar, eliminar) | Mensagens de sucesso/erro apresentadas ao utilizador | | |
| 10.5.3 | Validação de formulários | 1. Tentar guardar formulários com campos obrigatórios vazios | Mensagens de validação apresentadas; formulário não submetido | | |
| 10.5.4 | Carregamento de páginas | 1. Navegar entre diferentes módulos | Páginas carregam sem erros no console do navegador | | |

---

## 11. Resumo de Execução

### 11.1 Resultados Globais

| Módulo | Total de Testes | OK | NOK | N/A |
|--------|:-:|:-:|:-:|:-:|
| Autenticação e Acessos | 6 | | | |
| Dashboard | 17 | | | |
| Administração | 15 | | | |
| Configuração - Pessoas | 9 | | | |
| Configuração - Entidades | 6 | | | |
| Configuração - Financeiro | 5 | | | |
| Configuração - Processos | 11 | | | |
| Configuração - Geral | 4 | | | |
| Entidades | 42 | | | |
| Eventos | 11 | | | |
| Processos | 32 | | | |
| Notificações | 4 | | | |
| Funcionalidades Transversais | 10 | | | |
| **TOTAL** | **172** | | | |

### 11.2 Registo de Anomalias

| # | Módulo | Teste # | Descrição da Anomalia | Severidade (Alta/Média/Baixa) | Data | Estado |
|---|--------|---------|-----------------------|------------------------------|------|--------|
| | | | | | | |
| | | | | | | |
| | | | | | | |

### 11.3 Classificação de Severidade

| Severidade | Descrição |
|------------|-----------|
| **Alta** | Funcionalidade crítica não funciona; impede a utilização do sistema |
| **Média** | Funcionalidade apresenta comportamento incorreto, mas existe alternativa |
| **Baixa** | Problema cosmético ou de usabilidade que não impede a utilização |

---

## 12. Critérios de Aceitação

O sistema será considerado **aceite** quando:

1. **100% dos testes de severidade alta** apresentem resultado **OK**
2. **95% dos testes totais** apresentem resultado **OK** ou **N/A**
3. Todas as anomalias de **severidade alta** estejam resolvidas
4. Todas as anomalias de **severidade média** tenham um plano de resolução acordado
5. O cliente assine o **Termo de Aceitação** (secção 13)

---

## 13. Termo de Aceitação

Declaro que os testes de aceitação do sistema SGIGJ foram realizados conforme o plano descrito neste documento e que:

- [ ] Todos os módulos foram testados e funcionam conforme especificado
- [ ] As anomalias identificadas foram registadas e classificadas
- [ ] O sistema cumpre os requisitos acordados para entrada em produção
- [ ] Aceito formalmente a entrega do sistema SGIGJ

| | Representante do Cliente | Representante do Fornecedor |
|---|---|---|
| **Nome** | _________________________ | _________________________ |
| **Cargo** | _________________________ | _________________________ |
| **Data** | ____/____/________ | ____/____/________ |
| **Assinatura** | _________________________ | _________________________ |

---

*Documento gerado em 22 de fevereiro de 2026*
*SGIGJ - Sistema de Gestão Integrada de Jogo*
