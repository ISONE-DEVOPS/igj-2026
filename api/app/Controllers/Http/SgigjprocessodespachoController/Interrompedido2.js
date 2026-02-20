'use strict'

const controller = "Sgigjdespachointerrompido";



let Database = require('../../../utils/DatabaseAuditoria')
Database = new Database()
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);




const functionsDatabase = require('../../functionsDatabase');


const Env = use('Env')


const newlist = {

  data: [


    {
      name: 'OBS',
      size: '64000',
      type: 'Text',
      notNullable: false
    },

    {
      name: 'TIPO',
      size: '1',
      type: 'Text',
      notNullable: true
    },


  ],

  key: [],

  other: ['CODIGO']

}








const store = async ({ params, request, response }) => {

  const allowedMethod = await functionsDatabase.allowed("sgigjprocessoexclusao", "Instrucao", request.userID, "");

  if (allowedMethod) {

    const list = await functionsDatabase.DBMaker(table);

    const extractRequest = functionsDatabase.extractRequest(newlist, [])

    let data = request.only(extractRequest)
    data.ESTADO = "1"
    data.CRIADO_POR = request.userID





    const existelement = await functionsDatabase.existelement("sgigjprocessoexclusao", params.id)

    if (!existelement) return response.status(400).json({ status: "error", entity: "sgigjprocessoexclusao", message: "doesnt exist." + params.id, code: 6756 })

    const validation = await functionsDatabase.validation(newlist, data, extractRequest, table);






    if (validation.status === 'ok') {







      data.ESTADO = "0"
      data.PROCESSO_EXCLUSAO_ID = params.id





      const newuser = await Database
        .table("glbuser")
        .where('ID', request.userID)
        .limit(1)

      data.REL_PESSOA_ENTIDADE_REGISTO_ID = newuser[0].REL_PESSOA_ENTIDADE_ID


      const newitem = await Database
        .table("sgigjdespachointerrompido.sgigjreldocumento")
        .where('PROCESSO_EXCLUSAO_ID', data.PROCESSO_EXCLUSAO_ID)
        .limit(1)


      if (newitem.length > 0) {

        delete data.PROCESSO_EXCLUSAO_ID


        const newE = await Database
          .table("sgigjdespachofinal")
          .where('ID', '' + newitem[0].ID)
          .userID(request.userID)
          .update(data)



        if (newE === 1) {

          return (data)

        }

        else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

      }




      data.ID = await functionsDatabase.createID(table)
      data.DT_REGISTO = functionsDatabase.createDateNow(table)

      if (list.other.includes('CODIGO') === true) data.CODIGO = await functionsDatabase.createCODIGO(table)


      const newE = await Database
        .table(table)
        .insert(data)



      if (newE[0] === 0) {
        return (data)
      }

      else return response.status(400).json({ status: "fail", entity: "", message: "", code: "" })

    } else return response.status(400).json(validation)


  }

  else return response.status(400).json({ status: "405Error", entity: table, message: "create not allwed", code: "4051" })

}






module.exports = store
