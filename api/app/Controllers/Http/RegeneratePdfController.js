'use strict';

const DatabaseDB = use('Database');
const pdfCreater = require('./pdfCreater');
const { buildOfficialTemplate, buildOfficialTemplatePeca } = require('./pdfTemplate');

class RegeneratePdfController {

  // POST /regenerate-pdfs?type=processos&limit=20&offset=0
  async regenerateAll({ request, response }) {
    const tipo = request.input('type', 'processos');
    const limit = parseInt(request.input('limit', '20'));
    const offset = parseInt(request.input('offset', '0'));

    const results = { type: tipo, limit, offset, total: 0, success: 0, errors: [] };

    if (tipo === 'processos') {
      const records = await DatabaseDB
        .table('sgigjprocessoexclusao')
        .whereNotNull('URL_DOC_GERADO')
        .where('ESTADO', '1')
        .select('ID', 'OBS', 'URL_DOC_GERADO')
        .limit(limit)
        .offset(offset);

      results.total = records.length;
      for (const rec of records) {
        try {
          if (!rec.OBS) { results.success++; continue; }
          const pdftxt = { content: buildOfficialTemplate(rec.OBS), tipo: 'processoexclusao.pdf' };
          const pdfcreated = await pdfCreater(pdftxt);
          if (pdfcreated?.status) {
            await DatabaseDB.table('sgigjprocessoexclusao').where('ID', rec.ID).update({ URL_DOC_GERADO: pdfcreated.url });
            results.success++;
          }
        } catch (err) {
          results.errors.push({ id: rec.ID, error: err.message });
        }
      }
    }

    else if (tipo === 'despachos') {
      const records = await DatabaseDB
        .table('sgigjprocessodespacho')
        .whereNotNull('URL_DOC_GERADO')
        .select('ID', 'DESPACHO', 'URL_DOC_GERADO')
        .limit(limit)
        .offset(offset);

      results.total = records.length;
      for (const rec of records) {
        try {
          if (!rec.DESPACHO) { results.success++; continue; }
          const pdftxt = { content: buildOfficialTemplate(rec.DESPACHO), tipo: 'despacho.pdf' };
          const pdfcreated = await pdfCreater(pdftxt);
          if (pdfcreated?.status) {
            await DatabaseDB.table('sgigjprocessodespacho').where('ID', rec.ID).update({ URL_DOC_GERADO: pdfcreated.url });
            results.success++;
          }
        } catch (err) {
          results.errors.push({ id: rec.ID, error: err.message });
        }
      }
    }

    else if (tipo === 'despachofinal') {
      const records = await DatabaseDB
        .table('sgigjdespachofinal')
        .whereNotNull('URL_DOC_GERADO')
        .where('ESTADO', '1')
        .select('ID', 'DESPACHO', 'URL_DOC_GERADO')
        .limit(limit)
        .offset(offset);

      results.total = records.length;
      for (const rec of records) {
        try {
          if (!rec.DESPACHO) { results.success++; continue; }
          const pdftxt = { content: buildOfficialTemplate(rec.DESPACHO), tipo: 'despacho_despachofinal.pdf' };
          const pdfcreated = await pdfCreater(pdftxt);
          if (pdfcreated?.status) {
            await DatabaseDB.table('sgigjdespachofinal').where('ID', rec.ID).update({ URL_DOC_GERADO: pdfcreated.url });
            results.success++;
          }
        } catch (err) {
          results.errors.push({ id: rec.ID, error: err.message });
        }
      }
    }

    else if (tipo === 'pecas') {
      const records = await DatabaseDB
        .table('sgigjrelinstrutorpeca')
        .whereNotNull('URL_DOC')
        .where('ESTADO', '1')
        .select('ID', 'OBS', 'URL_DOC', 'CRIADO_POR')
        .limit(limit)
        .offset(offset);

      results.total = records.length;
      for (const rec of records) {
        try {
          if (!rec.OBS) { results.success++; continue; }
          let userName = '';
          let assinaturaUrl = null;
          if (rec.CRIADO_POR) {
            const user = await DatabaseDB.table('glbuser').where('ID', rec.CRIADO_POR).first();
            if (user) {
              assinaturaUrl = user.ASSINATURA_URL || null;
              const pessoa = await DatabaseDB.table('sgigjrelpessoaentidade')
                .join('sgigjpessoa', 'sgigjrelpessoaentidade.PESSOA_ID', 'sgigjpessoa.ID')
                .where('sgigjrelpessoaentidade.ID', user.REL_PESSOA_ENTIDADE_ID)
                .select('sgigjpessoa.NOME').first();
              if (pessoa) userName = pessoa.NOME;
            }
          }
          const pdftxt = { content: buildOfficialTemplatePeca(rec.OBS, userName, assinaturaUrl), tipo: 'pecasinstrucao.pdf' };
          const pdfcreated = await pdfCreater(pdftxt);
          if (pdfcreated?.status) {
            await DatabaseDB.table('sgigjrelinstrutorpeca').where('ID', rec.ID).update({ URL_DOC: pdfcreated.url });
            results.success++;
          }
        } catch (err) {
          results.errors.push({ id: rec.ID, error: err.message });
        }
      }
    }

    else if (tipo === 'count') {
      const processos = await DatabaseDB.table('sgigjprocessoexclusao').whereNotNull('URL_DOC_GERADO').where('ESTADO', '1').count('* as total');
      const despachos = await DatabaseDB.table('sgigjprocessodespacho').whereNotNull('URL_DOC_GERADO').count('* as total');
      const despFinal = await DatabaseDB.table('sgigjdespachofinal').whereNotNull('URL_DOC_GERADO').where('ESTADO', '1').count('* as total');
      const pecas = await DatabaseDB.table('sgigjrelinstrutorpeca').whereNotNull('URL_DOC').where('ESTADO', '1').count('* as total');

      return response.json({
        processos: processos[0].total,
        despachos: despachos[0].total,
        despachofinal: despFinal[0].total,
        pecas: pecas[0].total,
        total: processos[0].total + despachos[0].total + despFinal[0].total + pecas[0].total,
      });
    }

    return response.json({
      status: 'completed',
      ...results,
      next_offset: offset + limit,
      has_more: results.total === limit,
    });
  }
}

module.exports = RegeneratePdfController;
