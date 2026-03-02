-- =============================================
-- FIX: Permissões de Eventos para Sandbox
-- NOK 7.1.4, 7.1.5, 7.1.7 do Plano de Testes UAT
--
-- Garante que os registos glbmenu de eventos existem
-- e estão associados aos perfis corretos.
-- =============================================

-- 1. Verificar/Inserir os menus de permissão de eventos (se não existirem)

INSERT IGNORE INTO glbmenu (ID, DT_REGISTO, SELF_ID, DS_MENU, URL, URL_ICON, TIPO, ESTADO, ORDEM) VALUES
('8921c5793bf92f5e16c61e0ca883666b8374', NOW(), 'f9db922d917cc57c9dab6b76c5105bda4a5e', 'Atribuir Inspector', '/sgigjreleventoparecer/Atriubuirparecer', 'feather icon-flag', 'task', '1', 0),
('ee121dff73a37972f2082bf97e2a729ce3fd', NOW(), 'f9db922d917cc57c9dab6b76c5105bda4a5e', 'Parecer', '/sgigjreleventoparecer/Parecer', 'feather icon-globe', 'task', '1', 0),
('9cc7cd7184aa805172e54bd17722fb140f80', NOW(), 'f9db922d917cc57c9dab6b76c5105bda4a5e', 'Aceitar Pedido', '/sgigjreleventoparecer/Aceitar', 'feather icon-chevrons-down', 'task', '1', 0),
('55d9d681eef48453823d54e0a721ee7de73b', NOW(), 'f9db922d917cc57c9dab6b76c5105bda4a5e', 'Ver inspetor atribuido', '/sgigjreleventoparecer/Inspectorparecer', 'feather icon-flag', 'task', '1', 0);

-- 2. Associar aos perfis que precisam destas permissões

-- Admin Sistema (c55fc99dc15b5f5e22abb36d3eb393db4082)
INSERT IGNORE INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('b7c17f3bf682267539b988620469993e2630', NOW(), 'c55fc99dc15b5f5e22abb36d3eb393db4082', '8921c5793bf92f5e16c61e0ca883666b8374', '1'),
('862766c89a31426b29002c887a2c5adaa69e', NOW(), 'c55fc99dc15b5f5e22abb36d3eb393db4082', 'ee121dff73a37972f2082bf97e2a729ce3fd', '1'),
('f82324428a5b4369b034e43b69337c2efcba', NOW(), 'c55fc99dc15b5f5e22abb36d3eb393db4082', '9cc7cd7184aa805172e54bd17722fb140f80', '1'),
('b737fcd653dcc8309a2ed4ac4369e9cf164e', NOW(), 'c55fc99dc15b5f5e22abb36d3eb393db4082', '55d9d681eef48453823d54e0a721ee7de73b', '1');

-- Inspetor Geral (85c24ffab0137705617aa94b250866471dc2)
INSERT IGNORE INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('196613d20f51971f7bea64f0caa3f61989e2', NOW(), '85c24ffab0137705617aa94b250866471dc2', '8921c5793bf92f5e16c61e0ca883666b8374', '1'),
('e4e59373992fd87891ab51a02caee0ab8714', NOW(), '85c24ffab0137705617aa94b250866471dc2', 'ee121dff73a37972f2082bf97e2a729ce3fd', '1'),
('270f595950a3202985e129f15e1af85ca647', NOW(), '85c24ffab0137705617aa94b250866471dc2', '9cc7cd7184aa805172e54bd17722fb140f80', '1'),
('602bf25070999ea2eee3733a0124b7cec38f', NOW(), '85c24ffab0137705617aa94b250866471dc2', '55d9d681eef48453823d54e0a721ee7de73b', '1');

-- Inspetor(a) (f8382845e6dad3fb2d2e14aa45b14f0f85de)
INSERT IGNORE INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('0bbe0538fdfbab562b878d84ab11eed56c99', NOW(), 'f8382845e6dad3fb2d2e14aa45b14f0f85de', '8921c5793bf92f5e16c61e0ca883666b8374', '1'),
('a337a5d78a6c97e4cd4b52709999fbe693a2', NOW(), 'f8382845e6dad3fb2d2e14aa45b14f0f85de', 'ee121dff73a37972f2082bf97e2a729ce3fd', '1'),
('5aa91b41d2d130314e2e5e1fa0e8968c5cd4', NOW(), 'f8382845e6dad3fb2d2e14aa45b14f0f85de', '9cc7cd7184aa805172e54bd17722fb140f80', '1'),
('78a1d86078b366f805ee680f84013ac1c4a7', NOW(), 'f8382845e6dad3fb2d2e14aa45b14f0f85de', '55d9d681eef48453823d54e0a721ee7de73b', '1');

-- Secretaria de IGJ (1967cac71eb855fe92b81efc3a47c4babe1b)
INSERT IGNORE INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('2728b6f6a97341a2aafde1d6d74623d11c92', NOW(), '1967cac71eb855fe92b81efc3a47c4babe1b', '8921c5793bf92f5e16c61e0ca883666b8374', '1'),
('37308c96ab232dc62029e3b4a71a7583f023', NOW(), '1967cac71eb855fe92b81efc3a47c4babe1b', 'ee121dff73a37972f2082bf97e2a729ce3fd', '1'),
('af95b36afe6ee6acd85c1d119dbf81534b23', NOW(), '1967cac71eb855fe92b81efc3a47c4babe1b', '9cc7cd7184aa805172e54bd17722fb140f80', '1'),
('1b2aaf957b293d6f2c5a000e75e8ab3a438c', NOW(), '1967cac71eb855fe92b81efc3a47c4babe1b', '55d9d681eef48453823d54e0a721ee7de73b', '1');

-- Diretor IGJ (e37e701a2cec64a2c8d010a721a9978c36c0)
INSERT IGNORE INTO glbperfilmenu (ID, DT_REGISTO, PERFIL_ID, MENUS_ID, ESTADO) VALUES
('cdf048cdb1e3acd510f8893b3a949729a261', NOW(), 'e37e701a2cec64a2c8d010a721a9978c36c0', '8921c5793bf92f5e16c61e0ca883666b8374', '1'),
('bb0e4f73fb68b9780f09a020a08560de88ea', NOW(), 'e37e701a2cec64a2c8d010a721a9978c36c0', 'ee121dff73a37972f2082bf97e2a729ce3fd', '1'),
('f26fda5fd80b80167e24634e71835a0ceefa', NOW(), 'e37e701a2cec64a2c8d010a721a9978c36c0', '9cc7cd7184aa805172e54bd17722fb140f80', '1'),
('87fe5e7205ab865a5866ce667035c18729cc', NOW(), 'e37e701a2cec64a2c8d010a721a9978c36c0', '55d9d681eef48453823d54e0a721ee7de73b', '1');
