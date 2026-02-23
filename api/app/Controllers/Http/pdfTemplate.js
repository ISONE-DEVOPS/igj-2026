'use strict';

const Env = use('Env');
const { IGJ_LOGO_DATA_URI, MINISTERIO_LOGO_DATA_URI } = require('./pdfLogo');

const ZOOM = Env.get('ZOOM_PDF', '');

// Header HTML reutilizado por todos os templates
const HEADER_HTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 0;">
      <div style="flex: 0 0 45%;">
        <img src="${MINISTERIO_LOGO_DATA_URI}" alt="Ministério do Turismo e Transportes" style="height: 40px;">
      </div>
      <div style="flex: 0 0 25%; text-align: right;">
        <img src="${IGJ_LOGO_DATA_URI}" alt="Inspecção Geral de Jogos" style="height: 40px;">
      </div>
    </div>
    <div style="text-align: right; font-size: 7.5pt; color: #444; padding: 3px 0 20px 0; line-height: 1.3;">
      Rua Largo da Europa, ASA<br>
      2º Andar Prédio BCA,<br>
      CP nº 57-A, Achada Sto. António<br>
      Praia República de Cabo Verde<br>
      Telf: (+238) 260 48 43/1877 www.igj.cv
    </div>`;

/**
 * Template oficial IGJ - baseado no modelo-docs.pdf
 * Layout: Logo Ministério (esquerda) + Logo IGJ (direita) + Endereço (direita)
 * Sem footer. Margens no Puppeteer: top=6mm, right=15mm, bottom=15mm, left=15mm
 */
function buildOfficialTemplate(content) {
  return `<div style="width: 100%; font-family: 'Times New Roman', serif; ${ZOOM ? `zoom: ${ZOOM};` : ''}">
    ${HEADER_HTML}
    <div style="font-size: 12pt; text-align: justify; line-height: 1.6;">
      ${content || ''}
    </div>
  </div>`;
}

/**
 * Template oficial com assinatura do Inspetor (para peças processuais)
 */
function buildOfficialTemplatePeca(content, userName, assinaturaUrl) {
  return `<div style="width: 100%; font-family: 'Times New Roman', serif; ${ZOOM ? `zoom: ${ZOOM};` : ''}">
    ${HEADER_HTML}
    <div style="font-size: 12pt; text-align: justify; line-height: 1.6;">
      ${content || ''}
    </div>
    <div style="font-size: 12pt; text-align: center; margin-top: 40px; position: relative;">
      <p>Inspetor</p>
      ${assinaturaUrl ? `<img src="${assinaturaUrl}?alt=media&token=0" width="250" height="100" style="position: absolute; top: -30px; left: 35%;">` : ''}
      <p>_________________________________</p>
      <p>${userName || ''}</p>
    </div>
  </div>`;
}

/**
 * Template oficial para relatórios/listagens (tabelas)
 */
function buildOfficialTemplateRelatorio(title, tableHtml) {
  return `<div style="width: 100%; font-family: 'Times New Roman', serif; ${ZOOM ? `zoom: ${ZOOM};` : ''}">
    ${HEADER_HTML}
    <h2 style="font-family: 'Times New Roman', serif; font-size: 16pt; text-align: center; margin-bottom: 15px;">${title || ''}</h2>
    <div style="font-size: 8pt;">
      ${tableHtml || ''}
    </div>
  </div>`;
}

module.exports = {
  buildOfficialTemplate,
  buildOfficialTemplatePeca,
  buildOfficialTemplateRelatorio,
};
