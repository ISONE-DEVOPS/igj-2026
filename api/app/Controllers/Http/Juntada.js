'use strict'

const controller = "Sgigjprocessoexclusao";
const table = controller.toLowerCase();
let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()
const Model = use('App/Models/' + controller);
const functionsDatabase = require('../functionsDatabase');
const Env = use('Env')
const PDFMerger = require('pdf-merger-js');
const fetch = require('node-fetch');
var pdf = require('html-pdf');
const moment = require('moment');
const Sgigjrelinstrutorpeca = use('App/Models/Sgigjrelinstrutorpeca');
moment.locale('pt');
var admin = require("firebase-admin");




class entity {

    async file({ params, response, request }) {
        let data = []
        let pecas = (await Sgigjrelinstrutorpeca.query()
            .with('sgigjprpecasprocessual')
            .with('sgigjrelprocessoinstrucao.sgigjrelprocessoinstrutor.sgigjrelpessoaentidade.sgigjpessoa')
            .where('REL_PROCESSO_INSTRUCAO_ID', params.id)
            .fetch()).toJSON()


        if (pecas.length > 0) {
            for (let index = 0; index < pecas.length; index++) {
                const element = pecas[index];
                data.push({
                    name: element.sgigjprpecasprocessual.DESIG,
                    doc: element.URL_DOC,
                    instrutor:element.sgigjrelprocessoinstrucao.sgigjrelprocessoinstrutor.sgigjrelpessoaentidade.sgigjpessoa.NOME
                })

            }
        }


        var docs = data.filter(function (e) {
            if (e.doc.slice(e.doc.length - 4, e.doc.length) == ".pdf") return true
            else return false

        })

        var merger = new PDFMerger();
        merger.add(await this.capa(data));

        for (let index4 = 0; index4 < docs.length; index4++) {

            const element5 = docs[index4].doc + "?alt=media&token=0";
            let blob = await fetch(element5).then(r => r.blob());

            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            console.log(buffer)
            merger.add(buffer);

        }
        const file2 = await merger.saveAsBuffer();;

        const bucket = admin.storage().bucket();
        const blob = bucket.file("pdf-generator"+(Math.random() * (9999999999999999 + 9999999999999999) - 9999999999999999)+"-juntada")
        const blobStream = blob.createWriteStream();
        blobStream.end(file2)

        const publicUrl = format(`https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/${blob.name}`);

        let dataInstrucao = {
            ID:await functionsDatabase.createID("sgigjrelinstrutorpeca"),
            REL_PROCESSO_INSTRUCAO_ID:params.id,
            ESTADO: "1",
            CRIADO_POR: request.userID,
            DT_REGISTO:functionsDatabase.createDateNow(),
            PR_PECAS_PROCESSUAIS_ID: Env.get('PECAPROCESSUAL_JUNTADA_ID', ""),
            PESSOA_TESTEMUNHA_ID:null,
            DESTINATARIO_ID:null,
            PR_DECISAO_TP_ID:null,
            INFRACAO_COIMA_ID:null,
            COIMA:null,
            OBS:"",
            DATA:functionsDatabase.createDate(),
            publicUrl:publicUrl

        }
        const newE = await Database
          .table("sgigjrelinstrutorpeca")
          .insert(dataInstrucao)

        //   const file= await merger.save('merged.pdf');
        return {
            buffer: file2,
            data:dataInstrucao
        }

    }

    async capa(pecas) {

        const dia = moment().date();  // Ex: 20
        const ano = moment().year();  // Ex: 2023

        // Converte o dia e o ano por extenso
        const diaPorExtenso = this.numeroPorExtenso(dia);
        const anoPorExtenso = this.numeroPorExtenso(ano);
        let pecasImp = []
        let content = `
            <div style="text-align: justify;margin:50px;font-size:10pt !important;">
                <h2 style="text-align:center;font-weight:700;margin-top:100px;text-transform: uppercase;">Termo de Juntada</h2>
                <p style="margin-top:50px">Proc. nº ____/______

                <p style="margin-top:50px">Aos ${diaPorExtenso + ' de ' + moment().format('MMMM') + ' de ' + anoPorExtenso}, juntam-se ao processo os documentos: </p>
                <ul>
                ${(() => {
                let li = ""
                for (let index = 0; index < pecas.length; index++) {
                    const element = pecas[index];
                    if (!pecasImp.includes(pecas)) { 
                        li = li + `<li>${element.name}</li>` 
                    }
                    pecasImp.push(pecas)
                }
                return li
            })()}
                </ul>
                <p style="margin-top:50px">O/A ------------------------------------------------------------- Instrutor/a.</p>
            </div>
        `

        const pdfCreater = async (data) => {
            let promise = new Promise((resolve, reject) => {
                pdf.create(data, { "format": "A4", "border": "0", "type": "pdf" }).toBuffer(function (err, buffer) {
                    if (err) {
                        reject(err)
                    }
                    resolve(buffer)

                })
            })
            return promise
        }

        return await pdfCreater(content)

    }


    numeroPorExtenso(n) {
        const unidades = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
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

        return n; // Caso seja um número maior ou fora da faixa tratada
    }

}





module.exports = entity;