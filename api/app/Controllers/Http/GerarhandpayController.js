"use strict";
const Database = use("Database");
const Sgigjpessoa = use("App/Models/Sgigjpessoa");
const functionsDatabase = require("../functionsDatabase");
const pdfCreater = require("./pdfCreater");
const Env = use("Env");

class FileController {
  async post({ request, response }) {
    let datas = request.body
    let dataPrint = new Date().toISOString();
    const dataNAC = datas.DATA.substring(0, 10).split("-");
    // const periodo = periododata[0].DESIG.toUpperCase();
    const bandeira = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-314288625622128-bandeira.jpeg?alt=media&token=0"

    const data = {
      content: `
      <div >
      <div style="width: 98%; height: 100%; float: left; ">
        <div style="margin-bottom: 56px; ">
          <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="Paris" style="width: 70%; padding-left: 96px; padding-right: 15%; padding-top: 40px;">
        </div>
        
        <div style="padding-right: 96px; padding-left: 96px;"> 
        <p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 2px; font-family: Calibri, sans-serif; text-align: center;"><b style="mso-bidi-font-weight:normal"><span style="font-size: 15px; font-family: Times New Roman, serif;">HANDPAY</span></b></p>
        <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: Calibri, sans-serif;">&nbsp;</span></p>
        <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: Calibri, sans-serif;">&nbsp;</span></p>
       
        <div style="margin-bottom: 15px;margin-top: 0px;">
            <table style="width:100%;">
                <tr>
                    <p style="font-size: 15px;font-family: Calibri, sans-serif;">FREQUENTADOR</p>
                    <td>
                      <div style="max-height:150px; width:150px;">
                        <div style="width:150px; height: 150px; border: 2px solid #ccc; border-radius: 10px; 
                        background-image: url('${datas.FOTO + "?alt=media&token=0"}'); 
                        background-size: contain; background-repeat: no-repeat; background-position: center;"></div>
                      </div>
                    </td>

                    <td style="width: 65%; vertical-align: top; padding:2px; margin-left: 20px">
                 <div style="padding-left: 20px" >
                   <p style="margin: 0in;margin-bottom:5px; font-family: Calibri, sans-serif;">
                        <b style="mso-bidi-font-weight:normal"><span style=" font-size: 9pt; color: black;">Nome: </span> 
                        </b>
                        <br>
                        <span style="font-size: 9pt;color: black;font-family: Calibri, sans-serif;"> ${datas.sgigjpessoa.NOME}</span>
                    </p>

                    <p style="margin: 0in;margin-bottom:5px;font-family: Calibri, sans-serif;">
                                <b style="mso-bidi-font-weight:normal"><span style="font-family: Calibri, sans-serif; font-size: 9pt; color: black;">Nacionalidade: </span> 
                                </b>
                                <br>
                                <span style="font-size: 9pt;font-family: Calibri, sans-serif;color: black;"> ${datas.sgigjpessoa.nacionalidade.NACIONALIDADE.charAt(0).toUpperCase() + datas.sgigjpessoa.nacionalidade.NACIONALIDADE.slice(1).toLowerCase()}</span>
                    </p>

                    <p style="font-family: Calibri, sans-serif;margin: 0in;margin-bottom:5px; font-family: Calibri, sans-serif;">
                                <b style="mso-bidi-font-weight:normal"><span style="font-family: Calibri, sans-serif; font-size: 9pt; color: black;">Valor Prémio: </span> 
                                </b>
                                <br>
                                <span style="color: black;font-family: Calibri, sans-serif;font-size: 9pt;"> ${datas.VALOR2}</span>
                    </p>
                    <p style="margin: 0in;font-family: Calibri, sans-serif;">
                                <b style="mso-bidi-font-weight:normal"><span style="font-size: 9pt;color: black;font-family: Calibri, sans-serif;">Data do Prémio: </span> </b>
                                <br>
                                <span style="font-size: 9pt; color: black;font-family: Calibri, sans-serif;"> ${dataNAC[2]}/${dataNAC[1]}/${dataNAC[0]} </span>
                    </p>
                          </div>
                    </td>
                </tr>                
              </table>        
        </div>


        <p class="MsoNormal" style="font-weight: bold; margin: 0in 0in 5px; line-height: 107%;  font-size: 9pt; font-family: Calibri, sans-serif;"><span style="font-size: 9pt; line-height: 107%; font-family: Calibri, sans-serif;">Entidade</span></p>
        <p class="MsoNormal" style="margin: 0in 0in 11px; line-height: 107%;  font-size: 9pt; font-family: Calibri, sans-serif;">
            <span style="font-size: 9pt; line-height: 107%; font-family: Calibri, sans-serif;">
            ${datas.sgigjentidade.DESIG}
            </span>
        </p>
        <p class="MsoNormal" style="font-weight: bold; margin: 0in 0in 5px; line-height: 107%;  font-size: 9pt; font-family: Calibri, sans-serif;"><span style="font-size: 9pt; line-height: 107%; font-family: Calibri, sans-serif;">Descrição</span></p>
        <p class="MsoNormal" style="margin: 0in 0in 11px; line-height: 107%;  font-size: 9pt; font-family: Calibri, sans-serif;">
            <span style="font-size: 9pt; line-height: 107%; font-family: Calibri, sans-serif;">
            ${datas.DESCR}
            </span>
        </p>
        <p class="MsoNormal" style="font-weight: bold; margin: 0in 0in 5px; line-height: 107%;  font-size: 9pt; font-family: Calibri, sans-serif;"><span style="font-size: 9pt; line-height: 107%; font-family: Calibri, sans-serif;">Observação</span></p>

        ${datas.OBS_INTERNA != null ? `
        <p class="MsoNormal" style="margin: 0in 0in 11px; line-height: 107%;  font-size: 9pt; font-family: Calibri, sans-serif;">
            <span style="font-size: 9pt; line-height: 107%;  font-family: Calibri, sans-serif;">
            ${datas.OBS_INTERNA}
            </span>
        </p>   
           `: ''} 
       
        <p class="MsoNormal" style="margin: 50px 0px 0px; line-height: 107%;font-size: 9pt;  font-family: Calibri, sans-serif;">
            <span style="font-size: 9pt; line-height: 107%;  font-family: Calibri, sans-serif;">
                Praia, IGJ, 
                ${functionsDatabase.convertDateToPT(dataPrint)?.dia} 
                de ${functionsDatabase.convertDateToPT(dataPrint)?.mes} 
                de ${functionsDatabase.convertDateToPT(dataPrint)?.ano}
            </span>
        </p>

        </div>

        <div>
          <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-1015068714108032-cverde.PNG?alt=media&token=0" alt="" 
          style="width: 70%; padding-left: 15%; padding-right: 15%; opacity: 0.1; position: fixed; top: 20%">
        </div>

       <div style="position: absolute;left: 28px;width: 90%;bottom: 0px;">
        
                        <p class="MsoNormal" align="center"
                            style="font-size: 7px;  font-family: Calibri, sans-serif; text-align: center;background-color: #5B9BD5;padding: 4px 5px;color: white;font-style: italic;">
                            <span>Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A
                                - Telf: 2601877 Achada de Santo António – Praia www.igj.cv</span>
                        </p>
        
                    </div>
      </div>
      <img src="${bandeira}" style="position: absolute;top: 0;right: 0;width: 10px;height: 100%">

      </div>
      `,
      tipo: "handpay.pdf",
    };

    const xx = await pdfCreater(data);

    //console.log(xx)

    //return xx.url+"?alt=media&token=0"
    return xx.url;
  }
}

module.exports = FileController;
