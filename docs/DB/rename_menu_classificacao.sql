-- =============================================
-- RENOMEAR MENU: "Classificação de Equipamentos" → "Classificação"
-- No menu Configurações, dentro do subgrupo Entidades/Equipamentos
-- =============================================

-- O menu tem ID = '9c61e6c0c94d74e37de31f1e920fcff9bd2f'
-- DS_MENU atual: 'Classificação de Equipamentos'
-- DS_MENU novo: 'Classificação'

UPDATE glbmenu
SET DS_MENU = 'Classificação'
WHERE ID = '9c61e6c0c94d74e37de31f1e920fcff9bd2f';
