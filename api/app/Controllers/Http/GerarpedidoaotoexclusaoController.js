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
                `<div >
                <div
                    style="margin:20px 20px 20px 40px;width: 90%;z-index: 2;">
        
                    <div style=" margin-bottom: 40px; margin-left: -20px;">
        
                        <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0"
                            alt="Paris" style="width: 100%;">
                    </div>
                    <div>
                        <p class="MsoNormal" align="center"
                            style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;">
                            <b style="mso-bidi-font-weight:normal"><span
                                    style="font-size: 15px; font-family: Times New Roman, serif;">PEDIDO DE AUTO
                                    EXCLUSÃO</span></b>
                        </p>
        
                        <p class="MsoNormal"
                            style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span
                                style="font-size: 21px; font-family: Times New Roman, serif;">&nbsp;</span></p>
        
                        <p class="MsoNormal"
                            style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span
                                style="font-size: 21px; font-family: Times New Roman, serif;">&nbsp;</span></p>
        
                        <p class="MsoNormal"
                            style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span
                                style="font-size: 21px; font-family: Times New Roman, serif;">&nbsp;</span></p>
        
                        <p class="MsoNormal"
                            style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span
                                style="font-size: 21px; font-family: Times New Roman, serif;">&nbsp;</span></p>
        
                        <div style="margin-bottom: 15px;margin-top: 0px;">
        
                            <table style="width:100%;  ">
                                <tr>
                                    <td>
                                        <img src="${newdata.IMG}" alt="Paris" width="150"
                                            style="width: 150px; height: 150px; border-style: solid; border-radius: 10px;border-width: 1px;">
                                    </td>
        
                                    <td
                                        style="border-style: solid; width: 65%; vertical-align: top; padding:5px 5px 5px 5px;border-radius: 10px;border-width: 1px;">
        
        
                                        <p class="MsoNormal"
                                            style="text-align: justify; font-size: 9pt; font-family: Calibri, sans-serif; line-height: normal;">
                                            <b style="mso-bidi-font-weight:
                                            normal"><span style="color: black;">Obs.: </span></b><span
                                                style="color: black;">O requerente assinou presencialmente o
                                                pedido
                                                de
                                                proibição.</span>
                                        </p>
        
                                        <p class="MsoNormal"
                                            style="text-align: justify; font-size: 9pt; font-family: Calibri, sans-serif; line-height: normal;">
                                            <span style="color: black;">Os documentos constantes do presente
                                                requerimento
                                                foram conferidos com o BI ou passaporte, cujo original foi apresentado pelo
                                                titular.</span>
                                        </p>
        
                                        <p class="MsoNormal"
                                            style="text-align: justify; font-size: 9pt; font-family: Calibri, sans-serif; margin: 0in; line-height: normal;">
                                            <b style="mso-bidi-font-weight:
                                            normal"><span style="color: black;">O (A) Inspetor (a)</span></b>
        
                                        </p>
                                        <p style="margin-top: 13px;"><span>------------------------------------</span>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </div>
        
                        <div style="margin-bottom: 10px;margin-top: 20px;">
                            <p class="MsoNormal"
                                style="margin: 0in 0in 11px; line-height: 107%; font-size: 11pt; font-family: Calibri, sans-serif;">
                                <span
                                    style="font-size: 13px; line-height: 107%; font-family: &quot;Arial Narrow&quot;, sans-serif;">Exmo.
                                    Senhor</span>
                            </p>
        
                            <p class="MsoNormal"
                                style="margin: 0in 0in 11px; line-height: 107%; font-size: 11pt; font-family: Calibri, sans-serif;">
                                <span
                                    style="font-size: 13px; line-height: 107%; font-family: &quot;Arial Narrow&quot;, sans-serif;">Inspetor
                                    Geral de Jogos</span>
                            </p>
                        </div>

                        
        
                        <p class="MsoNormal" align="justify"
                            style="margin: 0in 0in 11px; line-height: 107%; font-size: 9pt; font-family: Calibri, sans-serif;">
                            <span style="line-height: 20px; font-family: &quot;Arial Narrow&quot;, sans-serif;">${nome},
                                Filho(a) de ${pai} e de ${mae}, Nascido(a) ${dataNAC[2]}/${dataNAC[1]}/${dataNAC[0]} na
                                freguesia
                                de ${newdata.FREGUESIA}
                                concelho de  ${newdata.CONCELHO},<span style="mso-spacerun:yes">&nbsp;
                                </span>${estadocivil}, com
                                a profissão de ${profissao},<span style="mso-spacerun:yes">&nbsp; </span>residente em
                                ${residencia},
                                titular do ${newdata.PR_DOCUMENTO_TP_ID} Nº ${newdata.NUMERO} emitido em ${moment(newdata.DT_EMISSAO).format('DD/MM/Y')} válido
                                até ${moment(newdata.DT_VALIDADE).format('DD/MM/Y')}, vem requerer a V. Exª se digne determinar, nos termos do nº 5
                                do art.º 65 da lei 62/VII/31 de Maio, a proibição de acesso às salas de jogos do casino, pelo
                                período de ${periodo}.</span>
                        </p>
        
                        <div style="">
                            <p class="MsoNormal"  align="justify"
                                style="margin: 0in 0in 11px; line-height: 107%; font-size: 9pt; font-family: Calibri, sans-serif;">
                                <span
                                    style="font-size: 9pt; line-height: 20px; font-family: &quot;Arial Narrow&quot;, sans-serif;">Junta-se
                                    ao pedido: Cópia do ${newdata.PR_DOCUMENTO_TP_ID}
                                    autenticada pelo Inspetor de Jogos.
                                </span>
                            </p>
        
                            <p class="MsoNormal" align="justify"
                                style="margin: 0in 0in 11px; line-height: 107%; font-size: 9pt; font-family: Calibri, sans-serif;">
                                <span
                                    style="font-size: 9pt; line-height:20px; font-family: &quot;Arial Narrow&quot;, sans-serif;">
                                    Declara estar ciente, de que na vigência da interdição de entrada nas salas de jogos, não será
                                    considerado um eventual pedido de levantamento da mesma e que os efeitos cessam
                                    automaticamente
                                    decorrido o prazo de proibição solicitado.
                                </span>
                            </p>

                            <div style="text-align: center; margin-top: 40px;">
                                <span>___________________________</span>
                            </div>
                        </div>
        
                        <p class="MsoNormal"
                            style="margin: 10px 0px 0px 0px; line-height: 107%; font-size: 9pt; font-family: Calibri, sans-serif; text-align: center;">
                            <span
                                style="font-size: 9pt; line-height: 107%; font-family: &quot;Arial Narrow&quot;, sans-serif;">
                                ${functionsDatabase.convertDateToPT(newdata.DATA)?.dia} de
                                ${functionsDatabase.convertDateToPT(newdata.DATA)?.mes} de
                                ${functionsDatabase.convertDateToPT(newdata.DATA)?.ano}</span>
                        </p>
        
        
        
                    </div>
        
                    <div style="position: absolute;left: 28px;width: 90%;bottom: 0px;">
        
                        <p class="MsoNormal" align="center"
                            style="font-size: 7px; font-family: Calibri, sans-serif; text-align: center;background-color: #5B9BD5;padding: 4px 5px;color: white;font-style: italic;">
                            <span>Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A
                                - Telf: 2601877 Achada de Santo António – Praia www.igj.cv</span>
                        </p>
        
                    </div>
                </div>
        
                <img src="${bandeira}" style="position: absolute;top: 0;right: 0;width: 10px;height: 100%">
                <img src="${escudo}" style="position: absolute;top: 20%;left: 10%;height: 50%;opacity: 0.1;width: 80%;z-index: -1;">
            </div>`,
            tipo: "aaaaaaaaaaaa.pdf",
        }


        const xx = await pdfCreater(data)



        //console.log(xx)


        //return xx.url+"?alt=media&token=0"
        return xx.url

    }



}

module.exports = FileController;