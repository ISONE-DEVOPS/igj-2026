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
      <div style="width: 100%; height: 100%; zoom: ${Env.get('ZOOM_PDF', '')};">
        <div style="margin-bottom: 30px;">
          <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="IGJ" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 20px;">
        </div>

        <div style="padding: 0 40px; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.6;">
          <h1 style="font-family: 'Times New Roman', serif; font-size: 16pt; text-align: center; margin-bottom: 20px;">HANDPAY</h1>

          <div style="margin-bottom: 15px; margin-top: 0px;">
            <p style="font-size: 12pt; font-family: 'Times New Roman', serif; font-weight: bold; margin-bottom: 10px;">FREQUENTADOR</p>
            <table style="width: 100%;">
              <tr>
                <td>
                  <div style="max-height: 150px; width: 150px;">
                    <div style="width: 150px; height: 150px; border: 2px solid #ccc; border-radius: 10px;
                    background-image: url('${datas.FOTO + "?alt=media&token=0"}');
                    background-size: contain; background-repeat: no-repeat; background-position: center;"></div>
                  </div>
                </td>
                <td style="width: 65%; vertical-align: top; padding: 2px; margin-left: 20px;">
                  <div style="padding-left: 20px;">
                    <p style="margin: 0; margin-bottom: 5px; font-family: 'Times New Roman', serif;">
                      <b><span style="font-size: 10pt; color: black;">Nome: </span></b><br>
                      <span style="font-size: 10pt; color: black; font-family: 'Times New Roman', serif;"> ${datas.sgigjpessoa.NOME}</span>
                    </p>
                    <p style="margin: 0; margin-bottom: 5px; font-family: 'Times New Roman', serif;">
                      <b><span style="font-family: 'Times New Roman', serif; font-size: 10pt; color: black;">Nacionalidade: </span></b><br>
                      <span style="font-size: 10pt; font-family: 'Times New Roman', serif; color: black;"> ${datas.sgigjpessoa.nacionalidade.NACIONALIDADE.charAt(0).toUpperCase() + datas.sgigjpessoa.nacionalidade.NACIONALIDADE.slice(1).toLowerCase()}</span>
                    </p>
                    <p style="font-family: 'Times New Roman', serif; margin: 0; margin-bottom: 5px;">
                      <b><span style="font-family: 'Times New Roman', serif; font-size: 10pt; color: black;">Valor Prémio: </span></b><br>
                      <span style="color: black; font-family: 'Times New Roman', serif; font-size: 10pt;"> ${datas.VALOR2}</span>
                    </p>
                    <p style="margin: 0; font-family: 'Times New Roman', serif;">
                      <b><span style="font-size: 10pt; color: black; font-family: 'Times New Roman', serif;">Data do Prémio: </span></b><br>
                      <span style="font-size: 10pt; color: black; font-family: 'Times New Roman', serif;"> ${dataNAC[2]}/${dataNAC[1]}/${dataNAC[0]} </span>
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <p style="font-weight: bold; margin: 0 0 5px; line-height: 1.6; font-size: 10pt; font-family: 'Times New Roman', serif;">Entidade</p>
          <p style="margin: 0 0 11px; line-height: 1.6; font-size: 10pt; font-family: 'Times New Roman', serif;">${datas.sgigjentidade.DESIG}</p>
          <p style="font-weight: bold; margin: 0 0 5px; line-height: 1.6; font-size: 10pt; font-family: 'Times New Roman', serif;">Descrição</p>
          <p style="margin: 0 0 11px; line-height: 1.6; font-size: 10pt; font-family: 'Times New Roman', serif;">${datas.DESCR}</p>
          <p style="font-weight: bold; margin: 0 0 5px; line-height: 1.6; font-size: 10pt; font-family: 'Times New Roman', serif;">Observação</p>

          ${datas.OBS_INTERNA != null ? `
          <p style="margin: 0 0 11px; line-height: 1.6; font-size: 10pt; font-family: 'Times New Roman', serif;">${datas.OBS_INTERNA}</p>
          `: ''}

          <p style="margin: 50px 0 0; font-size: 10pt; font-family: 'Times New Roman', serif;">
            Praia, IGJ,
            ${functionsDatabase.convertDateToPT(dataPrint)?.dia}
            de ${functionsDatabase.convertDateToPT(dataPrint)?.mes}
            de ${functionsDatabase.convertDateToPT(dataPrint)?.ano}
          </p>
        </div>

        <div>
          <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-1015068714108032-cverde.PNG?alt=media&token=0" alt=""
          style="width: 70%; padding-left: 15%; padding-right: 15%; opacity: 0.1; position: fixed; top: 20%;">
        </div>

        <div style="margin-top: 30px; text-align: center; border-top: 1px solid #999; padding-top: 8px;">
          <p style="margin: 0; font-size: 9pt; font-family: 'Times New Roman', serif; color: #555;">
            Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A - Telf: 2601877 Achada de Santo António – Praia www.igj.cv
          </p>
        </div>
        <img src="${bandeira}" style="position: absolute;top: 0;right: 0;width: 10px;height: 100%;">
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
