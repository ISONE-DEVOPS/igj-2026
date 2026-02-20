
'use strict'

const controller = "Sgigjrelinstrutorpeca";



let Database = require('../../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/'+controller);


const functionsDatabase = require('../../functionsDatabase');
const pdfCreater = require('../pdfCreater');


const Sgigjrelinstrutorpeca = use('App/Models/Sgigjrelinstrutorpeca');




 
  const store = async ({ params, request, response }) => {

    const allowedMethod = await functionsDatabase.allowed(table,"update",request.userID,params.id);

    if(allowedMethod){

      const element =  await functionsDatabase.existelement(table,params.id)

      if(element===false) return {status:"erro",entity:table,message:"doesnt exist",code:999}
      
      else{
      

        
        var find_instrucaopecas = await Sgigjrelinstrutorpeca
          .query()
          .with("sgigjrelprocessoinstrucao")
          .where({
            ID:""+params.id
          })
          .fetch()


          const instrucaopecas = find_instrucaopecas.rows[0].$attributes
          const instrucao = find_instrucaopecas.rows[0].$relations.sgigjrelprocessoinstrucao.$attributes



          if(instrucao.RELATORIO_FINAL!=null) {
            
              return response.status(400).json({status:"error",entity:"Sgigjrelinstrutorpeca",message:"this instrucao is closed",code:"43534534901211"})
 
           }




           
          let data  = {}



           const pdftxt = {
            content:
            `
            <div style="width: 100%; height: 100%; zoom: 0.55;">
    
                <div style=" margin-bottom: 96px; ">
        
                    <img src="https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/-4034664764483451-sdfsdf.png?alt=media&token=0" alt="Paris" style="width: 70%; padding-left: 15%; padding-right: 15%; padding-top: 40px;">

                </div>    


                <div style=" min-height: 1190px; padding-right: 96px; padding-left: 96px;">              
                  ${instrucaopecas?.OBS}  
                </div>


              <div >

                  <p class="MsoNormal" align="center" style=" margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;">_______________________________________________________________________________________</p><p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;"><span style="font-size: 12px;">Rua Largo da Europa, Prédio BCA 2º Andar C.P. 57 A
                  - Telf: 2601877 Achada de Santo António – Praia www.igj.cv</span></p>
                  
              </div>
          
          </div>
              
            `,
            tipo:"pecasinstrucao.pdf",
        }

        const pdfcreated = await pdfCreater(pdftxt)

        if(pdfcreated?.status==true) data.URL_DOC = pdfcreated?.url
        else {

          response.status(400).json({status:"fail",entity:"",message:"creating pdf",code:""})

        }












          const newE = await Database
          .table(table)
          .where('ID', ''+params.id)
          .userID(request.userID)
                       .update(data)
        

          if(newE===1){
            data.ID=params.id
            return (data)
          }

          else return  response.status(400).json({status:"fail",entity:"",message:"",code:""})


  
      }
  
    }

    else return response.status(405).json({status:"405 error",entity:table,message:"update not allowed",code:"4052"})

  }

  




module.exports = store
