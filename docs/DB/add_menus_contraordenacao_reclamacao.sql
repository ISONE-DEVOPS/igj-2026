-- =============================================
-- ADICIONAR MENUS: Contraordenação e Reclamação
-- Grupo pai: Gestão (0ab0e8dd8d3782b0af2be3a1cfa9174fd04b)
-- =============================================

-- 1. Menu items
INSERT INTO glbmenu (ID, DT_REGISTO, SELF_ID, DS_MENU, URL, URL_ICON, TIPO, ESTADO, ORDEM) VALUES
('a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', NOW(), '0ab0e8dd8d3782b0af2be3a1cfa9174fd04b', 'Contraordenação', '/processos/contraordenacao', 'feather icon-alert-octagon', 'item', '1', 7),
('b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', NOW(), '0ab0e8dd8d3782b0af2be3a1cfa9174fd04b', 'Reclamação', '/processos/reclamacao', 'feather icon-alert-circle', 'item', '1', 8);

-- 2. Sub-tarefas (Ler) - URL DEVE usar o nome da tabela da API (functionsDatabase.allowed() usa /{table}/{method})
INSERT INTO glbmenu (ID, DT_REGISTO, SELF_ID, DS_MENU, URL, URL_ICON, TIPO, ESTADO, ORDEM) VALUES
('c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', NOW(), 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', 'Ler', '/sgigjprocessoexclusao/Ler', 'feather icon-eye', 'task', '1', 0),
('d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', NOW(), 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', 'Ler', '/sgigjexclusaoreclamacao/Ler', 'feather icon-eye', 'task', '1', 0);

-- 3. Associar aos perfis
-- Admin Sistema
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2', NOW(), 'c55fc99dc15b5f5e22abb36d3eb393db4082', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', '1'),
('f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3', NOW(), 'c55fc99dc15b5f5e22abb36d3eb393db4082', 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', '1'),
('a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4', NOW(), 'c55fc99dc15b5f5e22abb36d3eb393db4082', 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', '1'),
('b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5', NOW(), 'c55fc99dc15b5f5e22abb36d3eb393db4082', 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', '1');

-- Inspetor Geral
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6', NOW(), '85c24ffab0137705617aa94b250866471dc2', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', '1'),
('d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7', NOW(), '85c24ffab0137705617aa94b250866471dc2', 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', '1'),
('e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8', NOW(), '85c24ffab0137705617aa94b250866471dc2', 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', '1'),
('f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9', NOW(), '85c24ffab0137705617aa94b250866471dc2', 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', '1');

-- Inspetor(a)
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0', NOW(), 'f8382845e6dad3fb2d2e14aa45b14f0f85de', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', '1'),
('b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1', NOW(), 'f8382845e6dad3fb2d2e14aa45b14f0f85de', 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', '1'),
('c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', NOW(), 'f8382845e6dad3fb2d2e14aa45b14f0f85de', 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', '1'),
('d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', NOW(), 'f8382845e6dad3fb2d2e14aa45b14f0f85de', 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', '1');

-- Administrador de Casino
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', NOW(), '668229b0122fda948b8c887b433aa2a907cf', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', '1'),
('f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', NOW(), '668229b0122fda948b8c887b433aa2a907cf', 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', '1'),
('a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', NOW(), '668229b0122fda948b8c887b433aa2a907cf', 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', '1'),
('b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', NOW(), '668229b0122fda948b8c887b433aa2a907cf', 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', '1');

-- Concessionário
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', NOW(), '6bfa0a42d20f272c4b1e5388b352efcb25ba', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', '1'),
('d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9', NOW(), '6bfa0a42d20f272c4b1e5388b352efcb25ba', 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', '1'),
('e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0', NOW(), '6bfa0a42d20f272c4b1e5388b352efcb25ba', 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', '1'),
('f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1', NOW(), '6bfa0a42d20f272c4b1e5388b352efcb25ba', 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', '1');

-- Director Casino
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', NOW(), 'f97fd62bda7d24f2edff087d0fb702e36eca', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', '1'),
('b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3', NOW(), 'f97fd62bda7d24f2edff087d0fb702e36eca', 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', '1'),
('c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4', NOW(), 'f97fd62bda7d24f2edff087d0fb702e36eca', 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', '1'),
('d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5', NOW(), 'f97fd62bda7d24f2edff087d0fb702e36eca', 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', '1');

-- Jurista IGJ
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6', NOW(), 'ca235e0c1a398a3eac0014b86bc194ca386d', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', '1'),
('f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7', NOW(), 'ca235e0c1a398a3eac0014b86bc194ca386d', 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', '1'),
('a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f0', NOW(), 'ca235e0c1a398a3eac0014b86bc194ca386d', 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', '1'),
('b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f0a1', NOW(), 'ca235e0c1a398a3eac0014b86bc194ca386d', 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', '1');

-- Diretor IGJ
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f0a1b2', NOW(), 'e37e701a2cec64a2c8d010a721a9978c36c0', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', '1'),
('d4e5f6a7b8c9d0e1f2a3b4c5d6e7f0a1b2c3', NOW(), 'e37e701a2cec64a2c8d010a721a9978c36c0', 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', '1'),
('e5f6a7b8c9d0e1f2a3b4c5d6e7f0a1b2c3d4', NOW(), 'e37e701a2cec64a2c8d010a721a9978c36c0', 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', '1'),
('f6a7b8c9d0e1f2a3b4c5d6e7f0a1b2c3d4e5', NOW(), 'e37e701a2cec64a2c8d010a721a9978c36c0', 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', '1');

-- Secretária de IGJ
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('a7b8c9d0e1f2a3b4c5d6e7f0a1b2c3d4e5f6', NOW(), '1967cac71eb855fe92b81efc3a47c4babe1b', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', '1'),
('b8c9d0e1f2a3b4c5d6e7f0a1b2c3d4e5f6a7', NOW(), '1967cac71eb855fe92b81efc3a47c4babe1b', 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', '1'),
('c9d0e1f2a3b4c5d6e7f0a1b2c3d4e5f6a7b8', NOW(), '1967cac71eb855fe92b81efc3a47c4babe1b', 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', '1'),
('d0e1f2a3b4c5d6e7f0a1b2c3d4e5f6a7b8c9', NOW(), '1967cac71eb855fe92b81efc3a47c4babe1b', 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', '1');

-- Assistente Administrativa IGJ
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('e1f2a3b4c5d6e7f0a1b2c3d4e5f6a7b8c9d0', NOW(), 'f5d39f67f77eaf6f853e676a2846e72eaa41', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8', '1'),
('f2a3b4c5d6e7f0a1b2c3d4e5f6a7b8c9d0e1', NOW(), 'f5d39f67f77eaf6f853e676a2846e72eaa41', 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', '1'),
('a3b4c5d6e7f0a1b2c3d4e5f6a7b8c9d0e1f2', NOW(), 'f5d39f67f77eaf6f853e676a2846e72eaa41', 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9', '1'),
('b4c5d6e7f0a1b2c3d4e5f6a7b8c9d0e1f2a3', NOW(), 'f5d39f67f77eaf6f853e676a2846e72eaa41', 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', '1');
