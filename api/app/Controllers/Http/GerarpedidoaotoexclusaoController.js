'use strict';

let Database = require('../../utils/DatabaseAuditoria')
Database = new Database()

const Sgigjpessoa = use('App/Models/Sgigjpessoa');

const functionsDatabase = require('../functionsDatabase');


const pdfCreater = require('./pdfCreater');
const moment = require("moment");


const Env = use('Env')




class FileController {

    async post({ request, response }) {

        /* const newdata = {
             PESSOA_ID:"3c7987aeb8e8856c723f49b3eaeb5c74e9d8",
             PR_PROFISSAO_ID:"90b6b6575774ec5ff9d0010664fe95369fe9",
             PR_EXCLUSAO_PERIODO_ID:"cffb153fde64565dd09b982e1bbd41d2b797",
             DATA:"2020-10-10",
             IMG:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWQhlXCNgr1SQ2Z9t-Vj7jPJa7Ib-OazC_rhNtREo-1hJqgiKRmT7IvtfSjzJ5iHzYKWk&usqp=CAU",
         }*/

        let newdata = request.only(['PESSOA_ID', 'PR_PROFISSAO_ID', 'PR_EXCLUSAO_PERIODO_ID', 'DATA', 'IMG','CONCELHO','FREGUESIA','NUMERO','DT_EMISSAO','DT_VALIDADE','PR_DOCUMENTO_TP_ID'])
        const escudo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-8716710763765896-escudo.jpeg?alt=media&token=0"
        const bandeira = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-314288625622128-bandeira.jpeg?alt=media&token=0"
        const assinatura = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4818673256991510-index.png?alt=media&token=0"

        
        var pessoa = await Sgigjpessoa
            .query()
            .with('sgigjprestadocivil')
            .with('sgigjprgenero')
            .with('nacionalidade')
            .with('localidade')
            .with('sgigjrelpessoaentidade.glbuser')
            .where('ID', '' + newdata.PESSOA_ID)
            .fetch()

            if(pessoa.rows.length == 0 ){
                return response.status(404).json({ status: "404NOTFOUND", entity: "Sgigjpessoa", message: newdata.PESSOA_ID+ " not found", code: "404" })
            }
           
        // console.log(newdata)
        // console.log(request)



        let nome = pessoa.rows[0].$attributes.NOME
        let pai = pessoa.rows[0].$attributes.NOME_PAI
        let mae = pessoa.rows[0].$attributes.NOME_MAE
        let estadocivil = pessoa.rows[0].$relations.sgigjprestadocivil.$attributes.DESIG.toUpperCase()
        let residencia = pessoa.rows[0].$relations.localidade.$attributes.NOME
        let dataNAC = pessoa.rows[0].$attributes.DT_NASC.toString().substring(0, 10).split("-")
        // let numDoc = pessoa.rows[0].$relations.sgigjreldocumento.$attributes
        // let tipoDoc = pessoa.rows[0].$relations.sgigjreldocumento.$relations.sgigjprdocumentotp.$attributes

        
        
        // let tipoDocActivo = ""
        // if(tipoDoc.ID === "294a8aa4b44bd81631ceb5058b5719a7ea96"){
        //     //BI
        //     tipoDocActivo = "BI"
        // }else if( tipoDoc.ID  === "a2c9cf61b8f38b16ca0eb4aa239afe68ca7d"){
        //     // CNI
        //     tipoDocActivo = "CNI"
        // }else if( tipoDoc.ID  === "db9a9bf3e0571291adb09128915f4a5243f6"){
        //     //Passaporte
        //     tipoDocActivo = "Passaporte"
        // }

        




        let profissaodata = await Database
            .table("sgigjprprofissao")
            .where('ID', newdata.PR_PROFISSAO_ID)
            .limit(1)

            if(profissaodata.length == 0 ){
                return response.status(404).json({ status: "404NOTFOUND", entity: "sgigjprprofissao", message: newdata.PR_PROFISSAO_ID+ " not found", code: "404" })
            }

        let profissao = profissaodata[0].DESIG.toUpperCase()

        let periododata = await Database
            .table("sgigjprexclusaoperiodo")
            .where('ID', newdata.PR_EXCLUSAO_PERIODO_ID)
            .limit(1)

        let periodo = periododata[0].DESIG.toUpperCase()

        nome = nome ? nome : ""
        pai = pai ? pai : ""
        mae = mae ? mae : ""
        estadocivil = estadocivil ? estadocivil : ""
        residencia = residencia ? residencia : ""
        dataNAC = dataNAC ? dataNAC : ""
        profissao = profissao ? profissao : ""
        periodo = periodo ? periodo : ""



        

        const data = {
            content:
                `<div style="width: 100%; height: 100%; zoom: ${Env.get('ZOOM_PDF', '')};">
                  <div style="margin-bottom: 30px;">
                    <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="IGJ" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 20px;">
                  </div>
                  <div style="padding: 0 40px; font-family: 'Times New Roman', serif; font-size: 10pt; text-align: justify; line-height: 1.6;">
                    <h1 style="font-family: 'Times New Roman', serif; font-size: 16pt; text-align: center; margin-bottom: 30px;">PEDIDO DE AUTO EXCLUSÃO</h1>

                    <div style="margin-bottom: 15px; margin-top: 0px;">
                      <table style="width: 100%;">
                        <tr>
                          <td>
                            <img src="${newdata.IMG}" alt="Foto" width="150"
                              style="width: 150px; height: 150px; border-style: solid; border-radius: 10px; border-width: 1px;">
                          </td>
                          <td style="border-style: solid; width: 65%; vertical-align: top; padding: 5px; border-radius: 10px; border-width: 1px;">
                            <p style="text-align: justify; font-size: 10pt; font-family: 'Times New Roman', serif; line-height: normal;">
                              <b><span style="color: black;">Obs.: </span></b>
                              <span style="color: black;">O requerente assinou presencialmente o pedido de proibição.</span>
                            </p>
                            <p style="text-align: justify; font-size: 10pt; font-family: 'Times New Roman', serif; line-height: normal;">
                              <span style="color: black;">Os documentos constantes do presente requerimento foram conferidos com o BI ou passaporte, cujo original foi apresentado pelo titular.</span>
                            </p>
                            <p style="text-align: justify; font-size: 10pt; font-family: 'Times New Roman', serif; margin: 0; line-height: normal;">
                              <b><span style="color: black;">O (A) Inspetor (a)</span></b>
                            </p>
                            <p style="margin-top: 13px;"><span>------------------------------------</span></p>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <div style="margin-bottom: 10px; margin-top: 20px;">
                      <p style="margin: 0 0 11px; line-height: 1.6; font-size: 10pt; font-family: 'Times New Roman', serif;">Exmo. Senhor</p>
                      <p style="margin: 0 0 11px; line-height: 1.6; font-size: 10pt; font-family: 'Times New Roman', serif;">Inspetor Geral de Jogos</p>
                    </div>

                    <p style="margin: 0 0 11px; line-height: 1.6; font-size: 10pt; font-family: 'Times New Roman', serif; text-align: justify;">
                      ${nome}, Filho(a) de ${pai} e de ${mae}, Nascido(a) ${dataNAC[2]}/${dataNAC[1]}/${dataNAC[0]} na freguesia de ${newdata.FREGUESIA} concelho de ${newdata.CONCELHO}, ${estadocivil}, com a profissão de ${profissao}, residente em ${residencia}, titular do ${newdata.PR_DOCUMENTO_TP_ID} Nº ${newdata.NUMERO} emitido em ${moment(newdata.DT_EMISSAO).format('DD/MM/Y')} válido até ${moment(newdata.DT_VALIDADE).format('DD/MM/Y')}, vem requerer a V. Exª se digne determinar, nos termos do nº 5 do art.º 65 da lei 62/VII/31 de Maio, a proibição de acesso às salas de jogos do casino, pelo período de ${periodo}.
                    </p>

                    <p style="margin: 0 0 11px; line-height: 1.6; font-size: 10pt; font-family: 'Times New Roman', serif; text-align: justify;">
                      Junta-se ao pedido: Cópia do ${newdata.PR_DOCUMENTO_TP_ID} autenticada pelo Inspetor de Jogos.
                    </p>
                    <p style="margin: 0 0 11px; line-height: 1.6; font-size: 10pt; font-family: 'Times New Roman', serif; text-align: justify;">
                      Declara estar ciente, de que na vigência da interdição de entrada nas salas de jogos, não será considerado um eventual pedido de levantamento da mesma e que os efeitos cessam automaticamente decorrido o prazo de proibição solicitado.
                    </p>

                    <div style="text-align: center; margin-top: 40px;">
                      <span>___________________________</span>
                    </div>

                    <p style="margin: 10px 0 0; font-size: 10pt; font-family: 'Times New Roman', serif; text-align: center;">
                      ${functionsDatabase.convertDateToPT(newdata.DATA)?.dia} de
                      ${functionsDatabase.convertDateToPT(newdata.DATA)?.mes} de
                      ${functionsDatabase.convertDateToPT(newdata.DATA)?.ano}
                    </p>
                  </div>

                  <div style="margin-top: 30px; text-align: center; border-top: 1px solid #999; padding-top: 8px;">
                    <p style="margin: 0; font-size: 9pt; font-family: 'Times New Roman', serif; color: #555;">
                      Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A - Telf: 2601877 Achada de Santo António – Praia www.igj.cv
                    </p>
                  </div>
                  <img src="${bandeira}" style="position: absolute;top: 0;right: 0;width: 10px;height: 100%;">
                  <img src="${escudo}" style="position: absolute;top: 20%;left: 10%;height: 50%;opacity: 0.1;width: 80%;z-index: -1;">
                </div>`,
            tipo: "pedidoAutoExclusao.pdf",
        }


        const xx = await pdfCreater(data)



        //console.log(xx)


        //return xx.url+"?alt=media&token=0"
        return xx.url

    }



}

module.exports = FileController;