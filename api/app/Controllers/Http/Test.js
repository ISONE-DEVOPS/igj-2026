'use strict'

const controller = "Sgigjprocessoexclusao";
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);
const Glbuser = use('App/Models/Glbuser');
const functionsDatabase = require('../functionsDatabase');
// const moment = require('moment-timezone');
const PDFMerger = require('pdf-merger-js');
const fetch = require('node-fetch');
const Sgigjprocessoexclusao = use('App/Models/Sgigjprocessoexclusao');
const GlbnotificacaoFunctions = require('../Http/GlbnotificacaoFunctions');
var pdf = require('html-pdf');
const moment = require('moment');
moment.locale('pt');
const User = use('App/Models/Glbuser');
const Sgigjrelpessoaentidade = use('App/Models/Sgigjrelpessoaentidade');
const pdfCreater = require('./pdfCreater');

class FileController {

  async post({ request, response }) {

    let despacho = "oko"
    const bandeira = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-314288625622128-bandeira.jpeg?alt=media&token=45ef8643-34b1-4c29-a068-b8d24a16c508"
    const escudo = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-8716710763765896-escudo.jpeg?alt=media&token=45ef8643-34b1-4c29-a068-b8d24a16c508"
    const assinaturaIGJ = "https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/594080509403780-assinaturaIGJ1.png?alt=media&token=45ef8643-34b1-4c29-a068-b8d24a16c508"

    console.log(request.userID)
    let user = await User.query().where("glbuser.ID","cc60a51c9c87b258e922c7cad6a5d0fe40b3").first()
    let nameUser = ""
    if (user) {
      let Pessoa = await Sgigjrelpessoaentidade.query().with("sgigjpessoa").where("sgigjrelpessoaentidade.ID", user.REL_PESSOA_ENTIDADE_ID).first()
      nameUser = Pessoa ? Pessoa.$relations.sgigjpessoa.$attributes.NOME : ""
    }
    let content =
      `<div style="width: 100%; height: 100%; zoom: 0.55;">
    
                <div style=" margin-bottom: 96px; ">
        
                    <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=45ef8643-34b1-4c29-a068-b8d24a16c508" alt="Paris" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 40px;">

                </div>    
                ${user.ASSINATURA_URL}

                <img src="https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/nabd3lsoifdkrmfifqrn.jpg" style="width: 250px; padding-left: 15%; padding-right: 15%; padding-top: 40px;">

                <div style=" min-height: 1190px; padding-right: 96px; padding-left: 96px;">  
                </div>

              <div style="font-size: 9pt; line-height: 106%; font-family: 'Times New Roman';text-align: center;margin-top: 60px;position: relative;">
                  <span>
                      <p>Inspetor</p>
      
                      ${(function () {
                        if(user.ASSINATURA_URL){
                          return `<img src="${user.ASSINATURA_URL}?alt=media&token=45ef8643-34b1-4c29-a068-b8d24a16c508" width="250" height="100" style="position: absolute;top: -30px;left: 41%;">`
                        }
                        return ''
                      })()}
                      <p>_________________________________</p>
                      <p>${nameUser}</p>
                      
                  </span>
              </div>

              <div >

                  <p class="MsoNormal" align="center" style=" margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;">_______________________________________________________________________________________</p><p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;"><span style="font-size: 12px;">Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A
                  - Telf: 2601877 Achada de Santo António – Praia www.igj.cv</span></p>
                  
              </div>
          
          </div>`
      // return content
    const xx = await pdfCreater({content, tipo: "aaaaaaaaaaaa.pdf",})



        //console.log(xx)


        //return xx.url+"?alt=media&token=45ef8643-34b1-4c29-a068-b8d24a16c508"
        return xx.url

  }



}





module.exports = FileController;



