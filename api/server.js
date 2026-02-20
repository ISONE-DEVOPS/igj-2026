'use strict'

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstraps Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass a relative path from the project root.
*/

const { Ignitor } = require('@adonisjs/ignitor')


new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .then(() => {

const Model = use("App/Models/Sgigjprocessoautoexclusao");
const ModelNotificacao = use("App/Models/Glbnotificacao");
const ModelPessoa = use("App/Models/Sgigjpessoa");
const GlbnotificacaoFunctions = use('App/Controllers/Http/GlbnotificacaoFunctions');
const Database = use("Database");
const ModelDespacho = use('App/Models/Sgigjprocessodespacho');
const Env = use("Env");

const controller = "Sgigjprocessoexclusao";

const table = controller.toLowerCase();
const Sgigjprocessoexclusao = use("App/Models/Sgigjprocessoexclusao");

const functionsDatabase = require("./app/Controllers/functionsDatabase");

const moment = require("moment-timezone");

// Sgigjprocessoexclusao

setInterval(async () => {
  // setTimeout(async () => {
  let period = await Model.query().where('NUM_DIAS', '>', -1).orWhereNull('NUM_DIAS').where('DT_INICIO', '<=', moment().format("YYYY-MM-DD")).fetch()
  if (period) {
    period.rows.map(async (element) => {
      let dateFim = moment(element.DT_FIM);
      let dateNow = moment()
      let numberDay = dateFim.diff(dateNow, 'days')
      numberDay = numberDay > -1 ? numberDay : -1;

      let dataUpdate = {
        NUM_DIAS: numberDay
      }

      if ([90, 30, 5, 0].includes(numberDay)) {
        let pessoa = await ModelPessoa.query().where("ID", element.PESSOA_ID).first()
        let msg = `A autoexclusão de ${pessoa.NOME} com o código ${pessoa.CODIGO} expira em ${numberDay} dias.`
        let title = `Autoexclusão com ${numberDay} dias.`
        let ENTIDADEID = element.ENTIDADE_ID
        let notificacao = await ModelNotificacao.query().where("MSG", msg).first()
        if (notificacao == null) {
          GlbnotificacaoFunctions.storeToPerfil({
            request: null,
            PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
            MSG: msg,
            TITULO: title,
            PESSOA_ID: pessoa.$attributes.ID,
            URL: "/processos/autoexclusao"
          })

          GlbnotificacaoFunctions.storeToPerfil({
            request: null,
            PERFIL_ID: "f8382845e6dad3fb2d2e14aa45b14f0f85de",//id de Inspectores
            MSG: msg,
            TITULO: title,
            PESSOA_ID: pessoa.$attributes.ID,
            URL: "/processos/autoexclusao"
          })


          GlbnotificacaoFunctions.storeToEntidade({
            request: null,
            ENTIDADE_ID: ENTIDADEID,//id de Inspectores
            MSG: msg,
            TITULO: title,
            PESSOA_ID: pessoa.$attributes.ID,
            URL: "/processos/autoexclusao"
          })
        }


      }

      await Database.table(Model.table)
        .where("ID", "" + element.ID)
        .update(dataUpdate);
    });

  }



  let periodProcesso = await ModelDespacho.query().where('TIPO', 'CONCLUIR')
    .whereNotNull('PRAZO')
    .whereRaw('DATE_ADD(DATA, INTERVAL 10 DAY) > ?', moment().format("YYYY-MM-DD")).fetch()
  if (periodProcesso) {

    periodProcesso.rows.map(async (element) => {
      try {
        const processInterropido = await Database
          .table("sgigjdespachointerrompido")
          .where('REL_PROCESSO_INSTRUCAO_ID', element.REL_PROCESSO_INSTRUCAO_ID)
          .limit(1)
        if (processInterropido.length == 0) {
          let dateFim = moment(element.DATA);
          dateFim = dateFim.add(element.PRAZO, 'days')
          let dateNow = moment()
          let numberDay = dateFim.diff(dateNow, 'days')
          numberDay = numberDay > -1 ? numberDay : -1;
          if (numberDay >= 0 && numberDay % 2 === 0) {
            let msg = numberDay > 0
              ? `O processo com o código ${element.CODIGO} resta apenas ${numberDay} dias para o prazo.`
              : `O processo com o código ${element.CODIGO} atingiu o prazo limite.`
            let title = numberDay > 0
              ? `Processo - Prazo: ${numberDay} dias restantes`
              : `Processo - Prazo Expirado`
            let notificacao = await ModelNotificacao.query().where("MSG", msg).first()
            if (notificacao == null) {

              GlbnotificacaoFunctions.storeToPerfil({
                request: null,
                PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
                MSG: msg,
                TITULO: title,
                PESSOA_ID: null,
                URL: "/processos/exclusaointerdicao"
              })

              GlbnotificacaoFunctions.storeToPerfil({
                request: null,
                PERFIL_ID: "f8382845e6dad3fb2d2e14aa45b14f0f85de",//id de Inspectores
                MSG: msg,
                TITULO: title,
                PESSOA_ID: null,
                URL: "/processos/exclusaointerdicao"
              })

            }
          }
        }
      } catch (err) {
        console.error("Erro ao verificar prazo de processo:", err)
      }
    });

    let dataagora = moment()
      .tz(Env.get("GMT", ""))

    if (!dataagora) {
      return
    }

    dataagora = dataagora.subtract(10, "days")
      .format("YYYY-MM-DD");

    const prazolimite = await Sgigjprocessoexclusao.query()
      .with('criadoPor.sgigjrelpessoaentidade.sgigjpessoa')
      .whereHas("sgigjprocessodespacho", (builder) => {
        builder.where("DATA", ">", dataagora);
      })
      .whereHas(
        "sgigjprocessodespacho.sgigjrelprocessoinstrutor.sgigjrelprocessoinstrucao",
        (builder) => {
          builder.whereNull("RELATORIO_FINAL");
        }
      )
      .where('ESTADO', 1)
      .with("sgigjprocessodespacho")
      .with("sgigjpessoa")
      .orderBy("DT_REGISTO", "desc")
      .fetch();
      
    prazolimite.rows.map(async (element) => {
      try {
        let dateFim = moment(element.DATA);
        dateFim = dateFim.add(10, 'days')
        let dateNow = moment()
        let numberDay = dateFim.diff(dateNow, 'days')
        numberDay = numberDay > -1 ? numberDay : -1;
        if (numberDay > 0 && numberDay % 2 === 0) {
          let msg = `O processo com o REF ${element.REF} resta apenas ${numberDay} dias para fim de instrução.`
          let title = `Instrução - ${numberDay} dias restantes`
          let notificacao = await ModelNotificacao.query().where("MSG", msg).first()
          if (notificacao == null) {

            GlbnotificacaoFunctions.storeToPerfil({
              request: null,
              PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
              MSG: msg,
              TITULO: title,
              PESSOA_ID: null,
              URL: "/processos/exclusaointerdicao"
            })

            GlbnotificacaoFunctions.storeToPerfil({
              request: null,
              PERFIL_ID: "f8382845e6dad3fb2d2e14aa45b14f0f85de",//id de Inspectores
              MSG: msg,
              TITULO: title,
              PESSOA_ID: null,
              URL: "/processos/exclusaointerdicao"
            })

          }
        }else if(numberDay == 0){
          let msg = `O processo com o REF ${element.REF} terminou o período de instrução.`
          let title = `Instrução - Prazo Expirado`
          let notificacao = await ModelNotificacao.query().where("MSG", msg).first()
          if (notificacao == null) {

            GlbnotificacaoFunctions.storeToPerfil({
              request: null,
              PERFIL_ID: "85c24ffab0137705617aa94b250866471dc2",//id de Inspector Geral
              MSG: msg,
              TITULO: title,
              PESSOA_ID: null,
              URL: "/processos/exclusaointerdicao"
            })

            GlbnotificacaoFunctions.storeToPerfil({
              request: null,
              PERFIL_ID: "f8382845e6dad3fb2d2e14aa45b14f0f85de",//id de Inspectores
              MSG: msg,
              TITULO: title,
              PESSOA_ID: null,
              URL: "/processos/exclusaointerdicao"
            })

          }
        }
      } catch (err) {
        console.error("Erro ao verificar prazo de instrução:", err)
      }
    })
  }
// }, 1000)
}, 1000 * 60 * 60); // cada 1h

  })
  .catch(console.error)