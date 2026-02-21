'use strict'

const GenericController = require("./GenericController")
const Model = use('App/Models/Parecerparametrizacao');
var pdf = require('html-pdf');
const functionsDatabase = require("../functionsDatabase");
const Env = use('Env')
const pdfCreater = require('./pdfCreater');

class ParecerparametrizacaoController extends GenericController {

    table = "parecerparametrizacao";
    Model = Model

    async doc1() {
        const assinatura = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-5196577213986346-AssinaturaInspetorGeral1removebgpreview.png?alt=media&token=0"
        const bandeira = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-314288625622128-bandeira.jpeg?alt=media&token=0"
        const escudo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-8716710763765896-escudo.jpeg?alt=media&token=0"

        let nameUser = "Roberto Centeio"
        let nomeCasino = "Royal"
        let motivo = "Roleta Lotaria"
        let dataPrint = new Date().toISOString();
        // const assinaturaIGJ = Env.get("APP_URL") + "/resources/assinaturaIGJ.png"

        // const request_TIPO = request.only(['TIPO']).TIPO

        // if (request_TIPO == "CONCLUIR") {
        //     let despacho = data?.DESPACHO
        //     if (despacho) {
        //         despacho = despacho.replace(/font-size: 21px;/gm, "font-size: 9pt;")
        //         despacho = despacho.replace(/font-size: 13px;/gm, "font-size: 5pt;")
        //         despacho = despacho.replace(/font-size: 32px;/gm, "font-size: 15px;")
        //     }


        const pdftxt =
            `<div style="width: 100%; height: 100%; zoom: ${Env.get('ZOOM_PDF', '')};">
              <div style="margin-bottom: 30px;">
                <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="IGJ" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 20px;">
              </div>
              <div style="padding: 0 40px; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;">
                <h1 style="font-family: 'Times New Roman', serif; font-size: 16pt; text-align: center;">AUTORIZAÇÃO N.º…../2024</h1>
                <p style="font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6; margin-top: 30px;">Nos termos do artigo 8º da Lei 77/VI/2005 de 16 de agosto, fica o casino ${nomeCasino} autorizado a realizar o evento de comemoração do 6º aniversário denominado ${motivo}.
                Da presente Autorização consta a Aprovação do Regulamento por esta Instituição que se junta.</p>
                <p style="margin-top: 30px; font-family: 'Times New Roman', serif; font-size: 12pt;">
                  Praia, IGJ,
                  ${functionsDatabase.convertDateToPT(dataPrint)?.dia}
                  de ${functionsDatabase.convertDateToPT(dataPrint)?.mes}
                  de ${functionsDatabase.convertDateToPT(dataPrint)?.ano}
                </p>
              </div>
              <div style="font-family: 'Times New Roman', serif; font-size: 12pt; text-align: center; margin-top: 40px; position: relative;">
                <p>Inspetor Geral</p>
                <img src="${assinatura}" width="250" height="100" style="position: absolute;top: -30px;left: 35%;">
                <p>_________________________________</p>
                <p>${nameUser}</p>
              </div>
              <div style="margin-top: 30px; text-align: center; border-top: 1px solid #999; padding-top: 8px;">
                <p style="margin: 0; font-size: 9pt; font-family: 'Times New Roman', serif; color: #555;">
                  Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A - Telf: 2601877 Achada de Santo António – Praia www.igj.cv
                </p>
              </div>
              <img src="${bandeira}" style="position: absolute;top: 0;right: 0;width: 10px;height:100%">
              <img src="${escudo}" style="position: absolute;top: 20%;left: 10%;height: 50%;opacity: 0.1;width: 80%;z-index: -1;">
            </div>`

        return pdftxt
    }

    async doc2() {
        let dataPrint = new Date().toISOString();
        const assinatura = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-5196577213986346-AssinaturaInspetorGeral1removebgpreview.png?alt=media&token=0"
        const bandeira = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-314288625622128-bandeira.jpeg?alt=media&token=0"
        const escudo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-8716710763765896-escudo.jpeg?alt=media&token=0"

        let nameUser = "Roberto Centeio"
        let nomePessoa = "Roberto Carlos Barros Centeio"
        let meses = 10;
        let dataExclussao = new Date().toISOString()
        // const assinaturaIGJ = Env.get("APP_URL") + "/resources/assinaturaIGJ.png"

        // const request_TIPO = request.only(['TIPO']).TIPO

        // if (request_TIPO == "CONCLUIR") {
        //     let despacho = data?.DESPACHO
        //     if (despacho) {
        //         despacho = despacho.replace(/font-size: 21px;/gm, "font-size: 9pt;")
        //         despacho = despacho.replace(/font-size: 13px;/gm, "font-size: 5pt;")
        //         despacho = despacho.replace(/font-size: 32px;/gm, "font-size: 15px;")
        //     }


        const pdftxt =
            `<div style="width: 100%; height: 100%; zoom: ${Env.get('ZOOM_PDF', '')};">
              <div style="margin-bottom: 30px;">
                <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="IGJ" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 20px;">
              </div>
              <div style="padding: 0 40px; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;">
                <h1 style="font-family: 'Times New Roman', serif; font-size: 16pt; text-align: center;">AUTO-EXCLUSÃO N.º…../2024</h1>
                <p style="font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6; margin-top: 30px;">Ao abrigo da faculdade conferida pelo n.º 5 do artigo 65º da Lei 62/VII/2010 de 31 de maio, que altera a Lei n.º 77/VII/2005 de 16 de agosto, que estabelece o Regime Jurídico da Exploração de Jogos de Fortuna ou Azar, suportada pelo pedido, por escrito, datado de 25 de dezembro de 2023, de auto proibição, apresentado pelo Sr. ${nomePessoa} alegando motivos de perda no casino, determino:</p>
                <ol style="font-family: 'Times New Roman', serif; font-size: 12pt; font-weight: 600; line-height: 1.6; text-align: justify; margin-top: 30px;">
                  <li style="margin-bottom: 20px;">Fica o Sr. ${nomePessoa}. proibido do acesso à sala de jogos de fortuna ou azar no país, pelo período solicitado de ${meses} meses, a partir da data da decisão de autoexclusão, ou seja, ${functionsDatabase.convertDateToPT(dataPrint)?.dia} de ${functionsDatabase.convertDateToPT(dataPrint)?.mes} de ${functionsDatabase.convertDateToPT(dataPrint)?.ano}.;</li>
                  <li style="margin-bottom: 20px;">Notifique-se a Direção do Casino;</li>
                  <li style="margin-bottom: 20px;">Deve a Direção do casino dar de imediato conhecimento à receção do mesmo, devendo esta, bem como a Diretora Geral do casino estarem cientes das suas responsabilidades se permitirem o acesso do referido frequentador ao espaço confinado ao jogo;</li>
                  <li style="margin-bottom: 20px;">Dar conhecimento ao visado;</li>
                  <li style="margin-bottom: 20px;">CUMPRA-SE.</li>
                </ol>
                <p style="margin-top: 30px; font-family: 'Times New Roman', serif; font-size: 12pt;">
                  Praia, IGJ,
                  ${functionsDatabase.convertDateToPT(dataPrint)?.dia}
                  de ${functionsDatabase.convertDateToPT(dataPrint)?.mes}
                  de ${functionsDatabase.convertDateToPT(dataPrint)?.ano}
                </p>
              </div>
              <div style="font-family: 'Times New Roman', serif; font-size: 12pt; text-align: center; margin-top: 40px; position: relative;">
                <p>Inspetor Geral</p>
                <img src="${assinatura}" width="250" height="100" style="position: absolute;top: -30px;left: 35%;">
                <p>_________________________________</p>
                <p>${nameUser}</p>
              </div>
              <div style="margin-top: 30px; text-align: center; border-top: 1px solid #999; padding-top: 8px;">
                <p style="margin: 0; font-size: 9pt; font-family: 'Times New Roman', serif; color: #555;">
                  Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A - Telf: 2601877 Achada de Santo António – Praia www.igj.cv
                </p>
              </div>
              <img src="${bandeira}" style="position: absolute;top: 0;right: 0;width: 10px;height:100%">
              <img src="${escudo}" style="position: absolute;top: 20%;left: 10%;height: 50%;opacity: 0.1;width: 80%;z-index: -1;">
            </div>`

        return pdftxt
    }

    async doc3({ params, request, response, auth }) {
        let dataPrint = new Date().toISOString();
        const assinatura = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-5196577213986346-AssinaturaInspetorGeral1removebgpreview.png?alt=media&token=0"
        const bandeira = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-314288625622128-bandeira.jpeg?alt=media&token=0"
        const escudo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-8716710763765896-escudo.jpeg?alt=media&token=0"
        const assinaturaIGJ = Env.get("APP_URL") + "/resources/assinaturaIGJ.png"

        let nameUser = "Roberto Centeio"
        let nomePessoa = "Roberto Carlos Barros Centeio"
        let meses = 10;
        let dataExclussao = new Date().toISOString()


        let despacho = request.input('despacho')
        // console.log("okok", despacho)
        // const assinaturaIGJ = Env.get("APP_URL") + "/resources/assinaturaIGJ.png"

        // const request_TIPO = request.only(['TIPO']).TIPO

        // if (request_TIPO == "CONCLUIR") {
        //     let despacho = data?.DESPACHO
        //     if (despacho) {
        //         despacho = despacho.replace(/font-size: 21px;/gm, "font-size: 9pt;")
        //         despacho = despacho.replace(/font-size: 13px;/gm, "font-size: 5pt;")
        //         despacho = despacho.replace(/font-size: 32px;/gm, "font-size: 15px;")
        //     }


        const pdftxt =
        {
            content:
                `<div style="width: 100%; height: 100%; zoom: ${Env.get('ZOOM_PDF', '')};">
                  <div style="margin-bottom: 30px;">
                    <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="IGJ" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 20px;">
                  </div>
                  <div style="padding: 0 40px; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;">
                    <h1 style="font-family: 'Times New Roman', serif; font-size: 16pt; text-align: center;">PARECER</h1>
                    <p style="font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6; margin-top: 30px;">${despacho}</p>
                    <p style="margin-top: 30px; font-family: 'Times New Roman', serif; font-size: 12pt;">
                      Praia, IGJ,
                      ${functionsDatabase.convertDateToPT(dataPrint)?.dia}
                      de ${functionsDatabase.convertDateToPT(dataPrint)?.mes}
                      de ${functionsDatabase.convertDateToPT(dataPrint)?.ano}
                    </p>
                  </div>
                  <div style="font-family: 'Times New Roman', serif; font-size: 12pt; text-align: center; margin-top: 40px; position: relative;">
                    <p>Inspetor</p>
                    <p>_________________________________</p>
                    <p>${nomePessoa}</p>
                  </div>
                  <div style="margin-top: 30px; text-align: center; border-top: 1px solid #999; padding-top: 8px;">
                    <p style="margin: 0; font-size: 9pt; font-family: 'Times New Roman', serif; color: #555;">
                      Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A - Telf: 2601877 Achada de Santo António – Praia www.igj.cv
                    </p>
                  </div>
                  <img src="${bandeira}" style="position: absolute;top: 0;right: 0;width: 10px;height:100%">
                  <img src="${escudo}" style="position: absolute;top: 20%;left: 10%;height: 50%;opacity: 0.1;width: 80%;z-index: -1;">
                </div>`
            , tipo: "despachoAutoExclusao.pdf",
        }

        const pdfcreated = await pdfCreater(pdftxt)
        // }

        if (pdfcreated?.status == true)
            return pdfcreated?.url
        else return "Errror"
    }

    async teste({ params, request, response, auth }) {
        let despacho = request.input('despacho')
        // if (despacho) {
            despacho = despacho.replace(/font-size: \d*\w*;/gm, "font-size: 12pt;")
            despacho = despacho.replace(/font-family:.*?sans-serif;/gm, "font-family: 'Times New Roman';")
            
            
            // despacho = despacho.replace(/font: 9px &quot;Times New Roman&quot;;/gm, "margin-left:10px;font: 9px &quot;Times New Roman&quot;;")
        //   }
          console.log(despacho)
        return despacho
    }

    async ok (){
        let o = "<p style='text-align: center; font-family: Times New Roman, serif;'><strong><span style='font-size: 16pt;'>AUTO-EXCLUSÃO N.º 6788/2024</span></strong></p><p style='margin: 0; font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.6;'>&nbsp;</p><p style='margin: 0; font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.6;'>&nbsp;</p><p style='margin: 0; font-family: Times New Roman, serif; font-size: 12pt; text-align: justify; line-height: 1.6;'>Ao abrigo da faculdade conferida pelo n.º 5 do artigo 65º da Lei 62/VII/2010 de 31 de maio, que altera a Lei n.º 77/VII/2005 de 16 de agosto, que estabelece o Regime Jurídico da Exploração de Jogos de Fortuna ou Azar, suportada pelo pedido, por escrito, datado de 15 de Fevereiro de 2024, de auto proibição, apresentado pelo Sr. ebrailson gabriel alegando motivos de perda no casino, determino:</p><p style='margin: 0; font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.6;'>&nbsp;</p><p style='margin: 0 0 0 65px; font-family: Times New Roman, serif; font-size: 12pt; text-indent: -20px; line-height: 1.6;'><strong>1.&nbsp;&nbsp;&nbsp;</strong><span style='font-weight: 600;'>Fica o Sr. ebrailson gabriel, proibido do acesso à sala de jogos de fortuna ou azar no país, pelo período de 1 ano, a partir da data da comunicação de auto proibição, ou seja, ... de ... de ...;</span></p><p style='margin: 0; font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.6;'>&nbsp;</p><p style='margin: 0 0 0 65px; font-family: Times New Roman, serif; font-size: 12pt; text-indent: -24px; line-height: 1.6;'><strong>2.&nbsp;&nbsp;&nbsp;</strong><strong>Notifique-se a Direção do(a) Casino Royal;</strong></p><p style='margin: 0; font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.6;'>&nbsp;</p><p style='margin: 0 0 0 65px; font-family: Times New Roman, serif; font-size: 12pt; text-indent: -24px; line-height: 1.6;'><strong>3.&nbsp;&nbsp;&nbsp;</strong><strong>Deve a Direção do Casino dar de imediato conhecimento à receção do mesmo, devendo esta, bem como o Diretor Geral do casino estarem cientes das suas responsabilidades se permitirem o acesso do referido frequentador ao espaço confinado ao jogo.</strong></p><p style='margin: 0; font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.6;'>&nbsp;</p><p style='margin: 0 0 0 65px; font-family: Times New Roman, serif; font-size: 12pt; text-indent: -24px; line-height: 1.6;'><strong>4.&nbsp;&nbsp;&nbsp;</strong><strong>Dar conhecimento ao visado.</strong></p><p style='margin: 0; font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.6;'>&nbsp;</p><p style='margin: 0 0 0 65px; font-family: Times New Roman, serif; font-size: 12pt; text-indent: -24px; line-height: 1.6;'><strong>5.&nbsp;&nbsp;&nbsp;</strong><strong>CUMPRA-SE.</strong></p><p style='margin: 0; font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.6;'>&nbsp;</p><p style='margin: 0 0 0 17px; font-family: Times New Roman, serif; font-size: 12pt;'>Praia, 15 de Fevereiro de 2024</p>"
        return o
    }
}
module.exports = ParecerparametrizacaoController



