'use strict'

const controller = "Sgigjprocessoexclusao";
const table = controller.toLowerCase();
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const DB = use('Database')
const Model = use('App/Models/' + controller);
const functionsDatabase = require('../functionsDatabase');
const Env = use('Env')
const PDFMerger = require('pdf-merger-js');
const fetch = require('node-fetch');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const Sgigjrelinstrutorpeca = use('App/Models/Sgigjrelinstrutorpeca');
moment.locale('pt');
var admin = require("firebase-admin");

// A4: 595.28 x 841.89 pts
const PAGE_MARGIN = { top: 60, bottom: 90, left: 60, right: 60 }
const FOOTER_Y = 841.89 - 55  // posição fixa do rodapé
const CONTENT_BOTTOM = FOOTER_Y - 15  // limite inferior do conteúdo (acima do rodapé)


class entity {

    async file({ params, response, request }) {
        try {
            // 1. Fetch process info via SQL join (efficient single query)
            const processoRows = await DB.raw(`
                SELECT pe.REF, pe.DATA, pe.DESCR, pe.TIPO, pe.CODIGO as PROC_CODIGO,
                       p.NOME as PESSOA_NOME,
                       e.DESIG as ENTIDADE_DESIG,
                       pi.NOME as INSTRUTOR_NOME,
                       ot.DESIG as ORIGEM_TIPO
                FROM sgigjrelprocessoinstrucao ri
                INNER JOIN sgigjrelprocessoinstrutor rt ON ri.REL_PROCESSO_INSTRUTOR_ID = rt.ID
                INNER JOIN sgigjprocessodespacho pd ON rt.PROCESSO_DESPACHO_ID = pd.ID
                INNER JOIN sgigjprocessoexclusao pe ON pd.PROCESSO_EXCLUSAO_ID = pe.ID
                LEFT JOIN sgigjpessoa p ON pe.PESSOA_ID = p.ID
                LEFT JOIN sgigjentidade e ON pe.ENTIDADE_ID = e.ID
                LEFT JOIN sgigjrelpessoaentidade rpe ON rt.REL_PESSOA_ENTIDADE_ID = rpe.ID
                LEFT JOIN sgigjpessoa pi ON rpe.PESSOA_ID = pi.ID
                LEFT JOIN sgigjprorigemtp ot ON pe.PR_ORIGEM_TP_ID = ot.ID
                WHERE ri.ID = ?
                LIMIT 1
            `, [params.id])

            const processo = processoRows[0] && processoRows[0][0] ? processoRows[0][0] : {}

            // 2. Fetch peças processuais
            let pecas = (await Sgigjrelinstrutorpeca.query()
                .with('sgigjprpecasprocessual')
                .where('REL_PROCESSO_INSTRUCAO_ID', params.id)
                .fetch()).toJSON()

            // Build list of peças
            let data = []
            for (const element of pecas) {
                data.push({
                    name: element.sgigjprpecasprocessual?.DESIG || '',
                    doc: element.URL_DOC,
                    data: element.DATA
                })
            }

            // Filter only PDF documents for merging
            const docs = data.filter(e =>
                e.doc && e.doc.toLowerCase().endsWith('.pdf')
            )

            // 3. Generate pages and fetch documents in parallel
            const capaPromise = this.capaProcesso(processo)
            const juntadaPromise = this.termoJuntada(data, processo.REF, processo.INSTRUTOR_NOME)
            const docPromises = docs.map(async (d) => {
                const url = d.doc + "?alt=media&token=0"
                const res = await fetch(url)
                const arrayBuffer = await res.arrayBuffer()
                return Buffer.from(arrayBuffer)
            })

            const [capaBuffer, juntadaBuffer, ...docBuffers] = await Promise.all([
                capaPromise, juntadaPromise, ...docPromises
            ])

            // 4. Merge: Capa do Processo + Termo de Juntada + Documentos
            var merger = new PDFMerger();
            merger.add(capaBuffer);
            merger.add(juntadaBuffer);
            for (const buf of docBuffers) {
                try {
                    merger.add(buf);
                } catch (e) {
                    console.warn('Skipping invalid PDF document:', e.message)
                }
            }
            const file2 = await merger.saveAsBuffer();

            // 5. Upload to Firebase Storage
            const bucket = admin.storage().bucket();
            const blob = bucket.file("juntada-" + Date.now() + "-" + Math.floor(Math.random() * 1000000))
            const blobStream = blob.createWriteStream();
            blobStream.end(file2)

            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/${encodeURIComponent(blob.name)}`;

            // 6. Create record
            let dataInstrucao = {
                ID: await functionsDatabase.createID("sgigjrelinstrutorpeca"),
                CODIGO: await functionsDatabase.createCODIGO("sgigjrelinstrutorpeca"),
                REL_PROCESSO_INSTRUCAO_ID: params.id,
                ESTADO: "1",
                CRIADO_POR: request.userID,
                DT_REGISTO: functionsDatabase.createDateNow(),
                PR_PECAS_PROCESSUAIS_ID: Env.get('PECAPROCESSUAL_JUNTADA_ID', ""),
                PESSOA_TESTEMUNHA_ID: null,
                PR_DECISAO_TP_ID: null,
                INFRACAO_COIMA_ID: null,
                COIMA: null,
                OBS: "",
                DATA: functionsDatabase.createDate(),
                URL_DOC: publicUrl
            }
            const newE = await Database
              .table("sgigjrelinstrutorpeca")
              .insert(dataInstrucao)

            return {
                buffer: file2,
                data: dataInstrucao
            }
        } catch (err) {
            console.error('Juntada error:', err)
            return response.status(500).json({ error: err.message || 'Erro ao gerar juntada' })
        }
    }

    /**
     * 1\u00aa P\u00e1gina - CAPA DO PROCESSO (MODELO 2)
     * Usa bufferPages para adicionar rodap\u00e9 a todas as p\u00e1ginas
     */
    async capaProcesso(processo) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: 'A4',
                margins: PAGE_MARGIN,
                bufferPages: true
            })

            const chunks = []
            doc.on('data', chunk => chunks.push(chunk))
            doc.on('end', () => resolve(Buffer.concat(chunks)))
            doc.on('error', reject)

            // T\u00edtulo principal
            doc.moveDown(3)
            doc.font('Times-Bold')
               .fontSize(18)
               .fillColor('#000000')
               .text('CAPA DE PROCESSO', { align: 'center' })

            doc.moveDown(1)

            // Linha decorativa
            doc.moveTo(60, doc.y)
               .lineTo(doc.page.width - 60, doc.y)
               .strokeColor('#333333')
               .lineWidth(1.5)
               .stroke()

            doc.moveDown(2)

            // N\u00famero do processo
            doc.font('Times-Bold')
               .fontSize(14)
               .fillColor('#000000')
               .text(`Processo n.\u00ba ${processo.REF || '____/______-____'}`, { align: 'center' })

            doc.moveDown(2)

            // Tipo de processo
            doc.font('Times-Bold')
               .fontSize(12)
               .text('PROCESSO DE INTERDI\u00c7\u00c3O')

            doc.moveDown(2)

            // Campos do processo
            this.campoProcesso(doc, 'Trabalhador/a:', processo.PESSOA_NOME)
            this.campoProcesso(doc, 'Entidade/Servi\u00e7o:', processo.ENTIDADE_DESIG)
            this.campoProcesso(doc, 'Objeto:', processo.DESCR ? this.stripHTML(processo.DESCR).substring(0, 200) : null)
            this.campoProcesso(doc, 'Instrutor/a:', processo.INSTRUTOR_NOME)

            doc.moveDown(1)

            // Datas
            const dataInstauracao = processo.DATA ? moment(processo.DATA).format('DD/MM/YYYY') : '.../.../...'
            doc.font('Times-Roman')
               .fontSize(12)
               .fillColor('#000000')
               .text(`Data da instaura\u00e7\u00e3o: ${dataInstauracao}`)

            doc.moveDown(2)

            // Observa\u00e7\u00f5es
            doc.font('Times-Bold').text('Observa\u00e7\u00f5es:')
            doc.font('Times-Roman').text('_____________________________________________________________________________')

            // Adicionar rodap\u00e9 a todas as p\u00e1ginas
            this.adicionarRodapeTodasPaginas(doc)

            doc.end()
        })
    }

    /**
     * 2\u00aa P\u00e1gina - TERMO DE JUNTADA (MODELO 23)
     * Usa bufferPages para adicionar rodap\u00e9 a todas as p\u00e1ginas
     */
    async termoJuntada(pecas, referencia, instrutorNome) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: 'A4',
                margins: PAGE_MARGIN,
                bufferPages: true
            })

            const chunks = []
            doc.on('data', chunk => chunks.push(chunk))
            doc.on('end', () => resolve(Buffer.concat(chunks)))
            doc.on('error', reject)

            const dia = moment().date()
            const ano = moment().year()
            const diaPorExtenso = this.numeroPorExtenso(dia)
            const anoPorExtenso = this.numeroPorExtenso(ano)
            const mes = moment().format('MMMM')

            // T\u00edtulo
            doc.moveDown(4)
            doc.font('Times-Bold')
               .fontSize(16)
               .fillColor('#000000')
               .text('TERMO DE JUNTADA', { align: 'center' })

            doc.moveDown(2)

            // N\u00famero do processo
            doc.font('Times-Roman')
               .fontSize(12)
               .text(`Proc. n\u00ba ${referencia || '____/______-____'}`)

            doc.moveDown(2)

            // Texto com data por extenso
            doc.text(
                `Aos ${diaPorExtenso} dias do m\u00eas de ${mes} do ano de dois mil e ${anoPorExtenso}, juntam-se ao processo os seguintes documentos:`,
                { align: 'justify', lineGap: 4 }
            )

            doc.moveDown(1)

            // Lista de pe\u00e7as processuais (sem duplicados)
            const seen = new Set()
            for (const peca of pecas) {
                if (peca.name && !seen.has(peca.name)) {
                    // Verificar se precisa de nova p\u00e1gina (25pt por item)
                    if (doc.y + 25 > CONTENT_BOTTOM) {
                        doc.addPage()
                    }
                    doc.font('Times-Roman')
                       .fontSize(12)
                       .fillColor('#000000')
                       .text(`  \u2022  ${peca.name}`, { indent: 20 })
                    doc.moveDown(0.3)
                    seen.add(peca.name)
                }
            }

            // Verificar espa\u00e7o para assinatura do instrutor (precisa ~80pt)
            if (doc.y + 80 > CONTENT_BOTTOM) {
                doc.addPage()
            }

            doc.moveDown(4)

            // Linha do instrutor
            doc.font('Times-Roman')
               .fontSize(12)
               .fillColor('#000000')
            if (instrutorNome) {
                doc.text(`O/A ${instrutorNome}, Instrutor/a.`)
            } else {
                doc.text('O/A _____________________________________________________ Instrutor/a.')
            }

            // Adicionar rodap\u00e9 a todas as p\u00e1ginas
            this.adicionarRodapeTodasPaginas(doc)

            doc.end()
        })
    }

    /**
     * Helper: Adiciona rodap\u00e9 IGJ a TODAS as p\u00e1ginas do documento
     * Usa bufferPages para iterar sobre cada p\u00e1gina
     */
    adicionarRodapeTodasPaginas(doc) {
        const range = doc.bufferedPageRange()
        for (let i = 0; i < range.count; i++) {
            doc.switchToPage(i)

            // Linha separadora
            doc.save()
            doc.moveTo(60, FOOTER_Y - 10)
               .lineTo(doc.page.width - 60, FOOTER_Y - 10)
               .strokeColor('#999999')
               .lineWidth(0.5)
               .stroke()

            // Texto do rodap\u00e9
            doc.fontSize(8)
               .font('Times-Roman')
               .fillColor('#555555')
               .text(
                   'Rua Largo da Europa, Pr\u00e9dio BCA 2\u00ba Andar C.P. 57 A - Telf: 2601877 Achada de Santo Ant\u00f3nio \u2013 Praia www.igj.cv',
                   60, FOOTER_Y - 5,
                   { align: 'center', width: doc.page.width - 120 }
               )
            doc.restore()
        }
    }

    /**
     * Helper: Campo do processo (label + valor)
     */
    campoProcesso(doc, label, valor) {
        // Verificar se precisa de nova p\u00e1gina
        if (doc.y + 30 > CONTENT_BOTTOM) {
            doc.addPage()
        }
        doc.font('Times-Bold')
           .fontSize(12)
           .fillColor('#000000')
           .text(label, { continued: true })
        doc.font('Times-Roman')
           .text(' ' + (valor || '_______________________________________________________________'))
        doc.moveDown(0.8)
    }

    /**
     * Helper: Remove HTML tags de texto
     */
    stripHTML(html) {
        if (!html) return ''
        return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
    }

    numeroPorExtenso(n) {
        const unidades = ['zero', 'um', 'dois', 'tr\u00eas', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
        const dezenas = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
        const centenas = ['', 'cem', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
        const especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];

        if (n < 10) {
            return unidades[n];
        }

        if (n < 20) {
            return especiais[n - 10];
        }

        if (n < 100) {
            return dezenas[Math.floor(n / 10)] + (n % 10 ? ' e ' + unidades[n % 10] : '');
        }

        if (n < 1000) {
            return centenas[Math.floor(n / 100)] + (n % 100 ? ' e ' + this.numeroPorExtenso(n % 100) : '');
        }

        // Para milhar (1000 a 9999)
        if (n < 10000) {
            return (Math.floor(n / 1000) === 1 ? 'mil' : this.numeroPorExtenso(Math.floor(n / 1000)) + ' mil') + (n % 1000 ? ' e ' + this.numeroPorExtenso(n % 1000) : '');
        }

        return n;
    }

}

module.exports = entity;
