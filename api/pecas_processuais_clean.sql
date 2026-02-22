-- ============================================================
-- PEÇAS PROCESSUAIS - Limpeza e Inserção Completa
-- Baseado nos Modelos 1-41 do documento Peças-Processuais.pdf
-- + 3 peças do sistema (Nota de Comunicação, Prova, Reclamação do Visado)
-- ============================================================

-- 1. Limpar dados de teste
DELETE FROM sgigjrelpecaprocessualcampo;
DELETE FROM sgigjprpecasprocessual;

-- 2. Inserir todas as peças processuais
-- IDs referenciados no .env são preservados (marcados com [ENV])

INSERT INTO sgigjprpecasprocessual (ID, CODIGO, DESIG, OBS, ESTADO, DT_REGISTO) VALUES

-- MODELO 1 (ANEXO 1): Auto de Notícia
(LEFT(SHA1('peca_modelo_01'), 36), '00001', 'Auto de Notícia', NULL, '1', NOW()),

-- MODELO 2 (ANEXO 2): Capa de Processo
(LEFT(SHA1('peca_modelo_02'), 36), '00002', 'Capa de Processo', NULL, '1', NOW()),

-- MODELO 3 (ANEXO 3): Termo de Abertura
(LEFT(SHA1('peca_modelo_03a'), 36), '00003', 'Termo de Abertura', NULL, '1', NOW()),

-- MODELO 3 (ANEXO 3): Termo de Encerramento [ENV: PECAPROCESSUAL_TERMO_ENCERRAMENTO_ID]
('09ed5f3f2a95faa29f371e423754a6f8ba81', '00004', 'Termo de Encerramento', NULL, '1', NOW()),

-- MODELO 4 (ANEXO 4): Comunicação de Início da Instrução à Entidade Decisora
(LEFT(SHA1('peca_modelo_04'), 36), '00005', 'Comunicação de Início da Instrução à Entidade Decisora', NULL, '1', NOW()),

-- MODELO 6: Comunicação de Início da Instrução ao Visado
(LEFT(SHA1('peca_modelo_06'), 36), '00006', 'Comunicação de Início da Instrução ao Visado', NULL, '1', NOW()),

-- MODELO 7: Acusação
(LEFT(SHA1('peca_modelo_07'), 36), '00007', 'Acusação', NULL, '1', NOW()),

-- MODELO 8: Notificação Pessoal da Acusação
(LEFT(SHA1('peca_modelo_08'), 36), '00008', 'Notificação Pessoal da Acusação', NULL, '1', NOW()),

-- Certidão Negativa (sub-parte do MODELO 8)
(LEFT(SHA1('peca_certidao_negativa'), 36), '00009', 'Certidão Negativa', NULL, '1', NOW()),

-- MODELO 9: Notificação Postal da Acusação
(LEFT(SHA1('peca_modelo_09'), 36), '00010', 'Notificação Postal da Acusação', NULL, '1', NOW()),

-- MODELO 10: Notificação da Acusação por Publicação de Aviso
(LEFT(SHA1('peca_modelo_10'), 36), '00011', 'Notificação da Acusação por Publicação de Aviso', NULL, '1', NOW()),

-- MODELO 11: Comunicação da Acusação ao Mandatário
(LEFT(SHA1('peca_modelo_11'), 36), '00012', 'Comunicação da Acusação ao Mandatário', NULL, '1', NOW()),

-- MODELO 12: Auto de Diligências
(LEFT(SHA1('peca_modelo_12'), 36), '00013', 'Auto de Diligências', NULL, '1', NOW()),

-- MODELO 13: Auto de Apreensão
(LEFT(SHA1('peca_modelo_13'), 36), '00014', 'Auto de Apreensão', NULL, '1', NOW()),

-- MODELO 14: Cota
(LEFT(SHA1('peca_modelo_14'), 36), '00015', 'Cota', NULL, '1', NOW()),

-- MODELO 15: Despacho de Apensação de Processo
(LEFT(SHA1('peca_modelo_15'), 36), '00016', 'Despacho de Apensação de Processo', NULL, '1', NOW()),

-- MODELO 16: Convocatória de Participante ou Testemunha
(LEFT(SHA1('peca_modelo_16'), 36), '00017', 'Convocatória de Participante ou Testemunha', NULL, '1', NOW()),

-- MODELO 17: Convocatória do Arguido
(LEFT(SHA1('peca_modelo_17'), 36), '00018', 'Convocatória do Arguido', NULL, '1', NOW()),

-- MODELO 18: Auto de Declarações [ENV: PECAPROCESSUAL_AUTODECLARACAO_ID]
('7cc509e3bd9b1fb1a472726bcdfe93ea91d6', '00019', 'Auto de Declarações', NULL, '1', NOW()),

-- MODELO 19: Auto de Inquirição de Testemunha
(LEFT(SHA1('peca_modelo_19'), 36), '00020', 'Auto de Inquirição de Testemunha', NULL, '1', NOW()),

-- MODELO 20: Auto de Acareação
(LEFT(SHA1('peca_modelo_20'), 36), '00021', 'Auto de Acareação', NULL, '1', NOW()),

-- MODELO 21: Auto de Exame
(LEFT(SHA1('peca_modelo_21'), 36), '00022', 'Auto de Exame', NULL, '1', NOW()),

-- MODELO 22: Termo de Compromisso de Honra
(LEFT(SHA1('peca_modelo_22'), 36), '00023', 'Termo de Compromisso de Honra', NULL, '1', NOW()),

-- MODELO 23: Termo de Juntada [ENV: PECAPROCESSUAL_JUNTADA_ID]
('78b482967ce0b7f85254782a6c61446fbdd0', '00024', 'Termo de Juntada', NULL, '1', NOW()),

-- MODELO 24: Termo de Consulta do Processo
(LEFT(SHA1('peca_modelo_24'), 36), '00025', 'Termo de Consulta do Processo', NULL, '1', NOW()),

-- MODELO 25: Despacho de Conclusão da Instrução
(LEFT(SHA1('peca_modelo_25'), 36), '00026', 'Despacho de Conclusão da Instrução', NULL, '1', NOW()),

-- MODELO 26: Relatório no Termo da Instrução
(LEFT(SHA1('peca_modelo_26'), 36), '00027', 'Relatório no Termo da Instrução', NULL, '1', NOW()),

-- MODELO 27: Convocatória de Testemunha de Defesa
(LEFT(SHA1('peca_modelo_27'), 36), '00028', 'Convocatória de Testemunha de Defesa', NULL, '1', NOW()),

-- MODELO 28: Pedido de Convocatória de Testemunhas
(LEFT(SHA1('peca_modelo_28'), 36), '00029', 'Pedido de Convocatória de Testemunhas', NULL, '1', NOW()),

-- MODELO 29: Notificação da Data da Convocatória de Testemunhas
(LEFT(SHA1('peca_modelo_29'), 36), '00030', 'Notificação da Data da Convocatória de Testemunhas', NULL, '1', NOW()),

-- MODELO 30: Auto de Não Comparência de Testemunha
(LEFT(SHA1('peca_modelo_30'), 36), '00031', 'Auto de Não Comparência de Testemunha', NULL, '1', NOW()),

-- MODELO 31: Relatório Final [ENV: PECAPROCESSUAL_RELATORIOFINAL_ID]
('6b4729e2b01da73d490dc1b04671ea570d49', '00032', 'Relatório Final', NULL, '1', NOW()),

-- MODELO 32: Conclusão do Processo / Despacho
(LEFT(SHA1('peca_modelo_32'), 36), '00033', 'Conclusão do Processo / Despacho', NULL, '1', NOW()),

-- MODELO 33: Notificação Postal da Decisão
(LEFT(SHA1('peca_modelo_33'), 36), '00034', 'Notificação Postal da Decisão', NULL, '1', NOW()),

-- MODELO 34: Notificação Pessoal da Decisão
(LEFT(SHA1('peca_modelo_34'), 36), '00035', 'Notificação Pessoal da Decisão', NULL, '1', NOW()),

-- MODELO 35: Notificação da Decisão por Publicação de Aviso
(LEFT(SHA1('peca_modelo_35'), 36), '00036', 'Notificação da Decisão por Publicação de Aviso', NULL, '1', NOW()),

-- MODELO 36: Anúncio de Sindicância
(LEFT(SHA1('peca_modelo_36'), 36), '00037', 'Anúncio de Sindicância', NULL, '1', NOW()),

-- MODELO 37: Pedido de Anúncio de Sindicância
(LEFT(SHA1('peca_modelo_37'), 36), '00038', 'Pedido de Anúncio de Sindicância', NULL, '1', NOW()),

-- MODELO 38: Edital de Sindicância
(LEFT(SHA1('peca_modelo_38'), 36), '00039', 'Edital de Sindicância', NULL, '1', NOW()),

-- MODELO 39: Pedido de Afixação de Edital de Sindicância
(LEFT(SHA1('peca_modelo_39'), 36), '00040', 'Pedido de Afixação de Edital de Sindicância', NULL, '1', NOW()),

-- MODELO 40: Certidão de Afixação de Edital de Sindicância
(LEFT(SHA1('peca_modelo_40'), 36), '00041', 'Certidão de Afixação de Edital de Sindicância', NULL, '1', NOW()),

-- MODELO 41: Relatório Final de Sindicância ou Inquérito
(LEFT(SHA1('peca_modelo_41'), 36), '00042', 'Relatório Final de Sindicância ou Inquérito', NULL, '1', NOW()),

-- === PEÇAS DO SISTEMA (não constam no PDF) ===

-- Nota de Comunicação [ENV: PECAPROCESSUAL_NOTACOMUNICACAO_ID]
('4ce0c01543457df12a96bc3eac9492e81657', '00043', 'Nota de Comunicação', NULL, '1', NOW()),

-- Prova [ENV: PECAPROCESSUAL_PROVA_ID]
('5dbc3c3c079e3fad6acbbce343ffabf08fc8', '00044', 'Prova', NULL, '1', NOW()),

-- Reclamação do Visado [ENV: PECAPROCESSUAL_RECLAMACAOVISADO_ID]
('0a2557ff1b8e966ae041183b8bbcb4d2ce1d', '00045', 'Reclamação do Visado', NULL, '1', NOW());

-- 3. Configurar campos para Nota de Comunicação (peça mais utilizada pelo sistema)
INSERT INTO sgigjrelpecaprocessualcampo (ID, PR_PECASPROCESSUAL_ID, PR_CAMPOS_ID, ORDEM, FLAG_OBRIGATORIEDADE, ESTADO, DT_REGISTO) VALUES
(LEFT(SHA1('campo_notacom_destinatario'), 36), '4ce0c01543457df12a96bc3eac9492e81657', 'abf3b98a3f83a222c6a1215690102bdc14e2', 1, '1', '1', NOW()),
(LEFT(SHA1('campo_notacom_texto'), 36), '4ce0c01543457df12a96bc3eac9492e81657', 'b311427e3f721571b9a57e33e1a85caca686', 2, '1', '1', NOW()),
(LEFT(SHA1('campo_notacom_anexar'), 36), '4ce0c01543457df12a96bc3eac9492e81657', '38cb47e5b8dd7c451ba94833c26b96d9b72c', 3, '0', '1', NOW());

-- Verificação
SELECT CODIGO, DESIG, ESTADO FROM sgigjprpecasprocessual ORDER BY CODIGO;
