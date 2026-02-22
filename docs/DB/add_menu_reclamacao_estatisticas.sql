-- =============================================
-- ADICIONAR MENU: Estatisticas de Reclamacoes
-- Menu independente dentro do grupo Gestao (0ab0e8dd8d3782b0af2be3a1cfa9174fd04b)
-- Logo a seguir ao menu Reclamacao (ORDEM 8) -> ORDEM 9
-- =============================================

-- 1. Menu item - Estatisticas (mesmo nivel que Reclamacao, dentro de Gestao)
INSERT INTO glbmenu (ID, DT_REGISTO, SELF_ID, DS_MENU, URL, URL_ICON, TIPO, ESTADO, ORDEM) VALUES
('e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', NOW(), '0ab0e8dd8d3782b0af2be3a1cfa9174fd04b', 'Estatisticas', '/processos/reclamacao/estatisticas', 'feather icon-bar-chart-2', 'item', '1', 9);

-- 2. Sub-tarefa (Ler) para permissoes
INSERT INTO glbmenu (ID, DT_REGISTO, SELF_ID, DS_MENU, URL, URL_ICON, TIPO, ESTADO, ORDEM) VALUES
('f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', NOW(), 'e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', 'Ler', '/sgigjexclusaoreclamacao/Ler', 'feather icon-eye', 'task', '1', 0);

-- 3. Associar aos perfis (mesmos que ja tem acesso a Reclamacao)

-- Admin Sistema (c55fc99dc15b5f5e22abb36d3eb393db4082)
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('a1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8', NOW(), 'c55fc99dc15b5f5e22abb36d3eb393db4082', 'e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', '1'),
('b2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9', NOW(), 'c55fc99dc15b5f5e22abb36d3eb393db4082', 'f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', '1');

-- Inspetor Geral (85c24ffab0137705617aa94b250866471dc2)
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('c3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0', NOW(), '85c24ffab0137705617aa94b250866471dc2', 'e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', '1'),
('d4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1', NOW(), '85c24ffab0137705617aa94b250866471dc2', 'f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', '1');

-- Inspetor(a) (f8382845e6dad3fb2d2e14aa45b14f0f85de)
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('e5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2', NOW(), 'f8382845e6dad3fb2d2e14aa45b14f0f85de', 'e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', '1'),
('f6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3', NOW(), 'f8382845e6dad3fb2d2e14aa45b14f0f85de', 'f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', '1');

-- Administrador de Casino (668229b0122fda948b8c887b433aa2a907cf)
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('a7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4', NOW(), '668229b0122fda948b8c887b433aa2a907cf', 'e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', '1'),
('b8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5', NOW(), '668229b0122fda948b8c887b433aa2a907cf', 'f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', '1');

-- Concessionario (6bfa0a42d20f272c4b1e5388b352efcb25ba)
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('c9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6', NOW(), '6bfa0a42d20f272c4b1e5388b352efcb25ba', 'e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', '1'),
('d0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7', NOW(), '6bfa0a42d20f272c4b1e5388b352efcb25ba', 'f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', '1');

-- Director Casino (f97fd62bda7d24f2edff087d0fb702e36eca)
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('e1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8', NOW(), 'f97fd62bda7d24f2edff087d0fb702e36eca', 'e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', '1'),
('f2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9', NOW(), 'f97fd62bda7d24f2edff087d0fb702e36eca', 'f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', '1');

-- Jurista IGJ (ca235e0c1a398a3eac0014b86bc194ca386d)
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('a3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0', NOW(), 'ca235e0c1a398a3eac0014b86bc194ca386d', 'e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', '1'),
('b4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1', NOW(), 'ca235e0c1a398a3eac0014b86bc194ca386d', 'f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', '1');

-- Diretor IGJ (e37e701a2cec64a2c8d010a721a9978c36c0)
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('c5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2', NOW(), 'e37e701a2cec64a2c8d010a721a9978c36c0', 'e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', '1'),
('d6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3', NOW(), 'e37e701a2cec64a2c8d010a721a9978c36c0', 'f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', '1');

-- Secretaria de IGJ (1967cac71eb855fe92b81efc3a47c4babe1b)
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('e7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4', NOW(), '1967cac71eb855fe92b81efc3a47c4babe1b', 'e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', '1'),
('f8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5', NOW(), '1967cac71eb855fe92b81efc3a47c4babe1b', 'f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', '1');

-- Assistente Administrativa IGJ (f5d39f67f77eaf6f853e676a2846e72eaa41)
INSERT INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('a9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6', NOW(), 'f5d39f67f77eaf6f853e676a2846e72eaa41', 'e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', '1'),
('b0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7', NOW(), 'f5d39f67f77eaf6f853e676a2846e72eaa41', 'f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', '1');
