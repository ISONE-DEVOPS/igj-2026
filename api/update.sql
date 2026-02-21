ALTER TABLE sgigjreldocumento ADD DESPACHO_INTERROMPIDO_ID varchar(100) NULL;
ALTER TABLE sgigjreldocumento CHANGE DESPACHO_INTERROMPIDO_ID DESPACHO_INTERROMPIDO_ID varchar(100) NULL AFTER NOTIFICACAO_PROCESSO_ID;

ALTER TABLE glbuser MODIFY COLUMN FLAG_NOTIFICACAO varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL;

-- Migration 1740000000001: Tipo de notificacao (Pessoal/Postal/Publicacao)
ALTER TABLE notificacao_processos ADD COLUMN TIPO_NOTIFICACAO varchar(20) NULL AFTER DATA;

-- Migration 1740000000002: Termo de Encerramento nos processos de exclusao
ALTER TABLE sgigjprocessoexclusao ADD COLUMN ESTADO_ENCERRAMENTO varchar(20) NULL;
ALTER TABLE sgigjprocessoexclusao ADD COLUMN DATA_ENCERRAMENTO date NULL;
ALTER TABLE sgigjprocessoexclusao ADD COLUMN URL_TERMO_ENCERRAMENTO varchar(500) NULL;

-- ============================================================
-- Menus: Contra-Ordenação e Reclamações (sidebar independente)
-- Ficam directamente no grupo Gestão, abaixo de Autoexclusão
-- (Executar em cada ambiente: sandbox, production)
-- ============================================================

SET @gestao_id = (SELECT ID FROM glbmenu WHERE TIPO='group' AND DS_MENU LIKE 'Gest%' LIMIT 1);

-- Contra-Ordenação (item directo no sidebar)
SET @contra_id = MD5(CONCAT('contraordenacao_menu'));
INSERT IGNORE INTO glbmenu (ID, DS_MENU, URL, SELF_ID, ORDEM, ESTADO, TIPO)
VALUES (@contra_id, 'Contra-Ordenação', '/processos/contraordenacao', @gestao_id, 6, '1', 'item');

INSERT IGNORE INTO glbmenu (ID, DS_MENU, URL, SELF_ID, ORDEM, ESTADO, TIPO) VALUES
(MD5('contraordenacao_ler'), 'Ler', '/contraordenacao/Ler', @contra_id, 0, '1', 'task'),
(MD5('contraordenacao_criar'), 'Criar', '/contraordenacao/Criar', @contra_id, 0, '1', 'task'),
(MD5('contraordenacao_editar'), 'Editar', '/contraordenacao/Editar', @contra_id, 0, '1', 'task'),
(MD5('contraordenacao_eliminar'), 'Eliminar', '/contraordenacao/Eliminar', @contra_id, 0, '1', 'task');

-- Reclamações (item directo no sidebar)
SET @reclam_id = MD5(CONCAT('reclamacao_menu'));
INSERT IGNORE INTO glbmenu (ID, DS_MENU, URL, SELF_ID, ORDEM, ESTADO, TIPO)
VALUES (@reclam_id, 'Reclamações', '/processos/reclamacao', @gestao_id, 7, '1', 'item');

INSERT IGNORE INTO glbmenu (ID, DS_MENU, URL, SELF_ID, ORDEM, ESTADO, TIPO) VALUES
(MD5('reclamacao_ler'), 'Ler', '/reclamacao/Ler', @reclam_id, 0, '1', 'task'),
(MD5('reclamacao_criar'), 'Criar', '/reclamacao/Criar', @reclam_id, 0, '1', 'task'),
(MD5('reclamacao_editar'), 'Editar', '/reclamacao/Editar', @reclam_id, 0, '1', 'task'),
(MD5('reclamacao_eliminar'), 'Eliminar', '/reclamacao/Eliminar', @reclam_id, 0, '1', 'task');

-- Fix para entradas existentes: mover para Gestão e corrigir TIPO/URLs
UPDATE glbmenu SET SELF_ID = @gestao_id, TIPO = 'item', ORDEM = 6 WHERE URL = '/processos/contraordenacao' AND TIPO != 'item';
UPDATE glbmenu SET SELF_ID = @gestao_id, TIPO = 'item', ORDEM = 7 WHERE URL = '/processos/reclamacao' AND TIPO != 'item';

-- Permissões: Administrador de Sistema (acesso total)
SET @perfil_admin = (SELECT ID FROM glbperfil WHERE DESIG='Administrador de Sistema' AND ESTADO='1' LIMIT 1);
INSERT IGNORE INTO glbperfilmenu (ID, PERFIL_ID, MENUS_ID, ESTADO) VALUES
(MD5(CONCAT('pm_admin_contra')), @perfil_admin, @contra_id, '1'),
(MD5(CONCAT('pm_admin_contra_ler')), @perfil_admin, MD5('contraordenacao_ler'), '1'),
(MD5(CONCAT('pm_admin_contra_criar')), @perfil_admin, MD5('contraordenacao_criar'), '1'),
(MD5(CONCAT('pm_admin_contra_editar')), @perfil_admin, MD5('contraordenacao_editar'), '1'),
(MD5(CONCAT('pm_admin_contra_elim')), @perfil_admin, MD5('contraordenacao_eliminar'), '1'),
(MD5(CONCAT('pm_admin_reclam')), @perfil_admin, @reclam_id, '1'),
(MD5(CONCAT('pm_admin_reclam_ler')), @perfil_admin, MD5('reclamacao_ler'), '1'),
(MD5(CONCAT('pm_admin_reclam_criar')), @perfil_admin, MD5('reclamacao_criar'), '1'),
(MD5(CONCAT('pm_admin_reclam_editar')), @perfil_admin, MD5('reclamacao_editar'), '1'),
(MD5(CONCAT('pm_admin_reclam_elim')), @perfil_admin, MD5('reclamacao_eliminar'), '1');

-- Permissões: Inspetor Geral (acesso total)
SET @perfil_ig = (SELECT ID FROM glbperfil WHERE DESIG='Inspetor Geral' AND ESTADO='1' LIMIT 1);
INSERT IGNORE INTO glbperfilmenu (ID, PERFIL_ID, MENUS_ID, ESTADO) VALUES
(MD5(CONCAT('pm_ig_contra')), @perfil_ig, @contra_id, '1'),
(MD5(CONCAT('pm_ig_contra_ler')), @perfil_ig, MD5('contraordenacao_ler'), '1'),
(MD5(CONCAT('pm_ig_contra_criar')), @perfil_ig, MD5('contraordenacao_criar'), '1'),
(MD5(CONCAT('pm_ig_contra_editar')), @perfil_ig, MD5('contraordenacao_editar'), '1'),
(MD5(CONCAT('pm_ig_contra_elim')), @perfil_ig, MD5('contraordenacao_eliminar'), '1'),
(MD5(CONCAT('pm_ig_reclam')), @perfil_ig, @reclam_id, '1'),
(MD5(CONCAT('pm_ig_reclam_ler')), @perfil_ig, MD5('reclamacao_ler'), '1'),
(MD5(CONCAT('pm_ig_reclam_criar')), @perfil_ig, MD5('reclamacao_criar'), '1'),
(MD5(CONCAT('pm_ig_reclam_editar')), @perfil_ig, MD5('reclamacao_editar'), '1'),
(MD5(CONCAT('pm_ig_reclam_elim')), @perfil_ig, MD5('reclamacao_eliminar'), '1');

-- Permissões: Inspetor(a) (Ler + Criar + Editar)
SET @perfil_insp = (SELECT ID FROM glbperfil WHERE DESIG='Inspetor(a)' AND ESTADO='1' LIMIT 1);
INSERT IGNORE INTO glbperfilmenu (ID, PERFIL_ID, MENUS_ID, ESTADO) VALUES
(MD5(CONCAT('pm_insp_contra')), @perfil_insp, @contra_id, '1'),
(MD5(CONCAT('pm_insp_contra_ler')), @perfil_insp, MD5('contraordenacao_ler'), '1'),
(MD5(CONCAT('pm_insp_contra_criar')), @perfil_insp, MD5('contraordenacao_criar'), '1'),
(MD5(CONCAT('pm_insp_contra_editar')), @perfil_insp, MD5('contraordenacao_editar'), '1'),
(MD5(CONCAT('pm_insp_reclam')), @perfil_insp, @reclam_id, '1'),
(MD5(CONCAT('pm_insp_reclam_ler')), @perfil_insp, MD5('reclamacao_ler'), '1'),
(MD5(CONCAT('pm_insp_reclam_criar')), @perfil_insp, MD5('reclamacao_criar'), '1'),
(MD5(CONCAT('pm_insp_reclam_editar')), @perfil_insp, MD5('reclamacao_editar'), '1');

-- Nota: Atribuir permissões adicionais a outros perfis via UI /administracao/permissoes
