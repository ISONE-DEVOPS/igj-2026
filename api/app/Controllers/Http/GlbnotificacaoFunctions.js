'use strict'

const controller = "Glbnotificacao";



let Database = use("Database")
const table = controller.toLowerCase();
const Model = use('App/Models/' + controller);

const nodemailer = require("nodemailer");

const functionsDatabase = require('../functionsDatabase');

const Env = use('Env')


const transport = nodemailer.createTransport({
  host: Env.get('MAILER_HOST', ""),
  port: Env.get('MAILER_PORT', ""),
  auth: {
    user: Env.get('MAILER_USER', ""),
    pass: Env.get('MAILER_PASSWORD', ""),
  }
});


const sendToEmail = async ({ MSG, PESSOA_ID, TITULO, EMAIL, ATTACHMENTS }) => {

  if (EMAIL.length == 0 || !EMAIL) {
    return
  }

  if (TITULO != "" && TITULO != null) TITULO = TITULO + ". "
  else TITULO = ""

  let NOME = ""

  if (PESSOA_ID) {
    const pessoa = await Database
      .from('sgigjrelcontacto')
      .where('ID', PESSOA_ID)
    if (pessoa.length > 0) {
      NOME = pessoa.NOME + " "
    }
    else {
      NOME = "Um utilizador "
    }
  }
  else {
    NOME = "Um utilizador "
  }



  // await transport.sendMail({
  //   from: Env.get('EMAIL_SENDER', ""),
  //   to: EMAIL,
  //   subject: "Inspecção Geral de Jogos",
  //   html: `<p>${TITULO + NOME + MSG}<p>`
  // })

  let content = {
    from: Env.get('EMAIL_SENDER', ""),
    to: EMAIL,
    subject: TITULO,
    html: `<p>${MSG}<p>`
  }

  if (ATTACHMENTS) {
    content.attachments = ATTACHMENTS
  }

  try {
    let response = await transport.sendMail(content)


    await Database
      .table("statusSendEmail")
      .insert({
        email: JSON.stringify(EMAIL),
        msg: MSG,
        url: NOME + ": " + TITULO,
        id_object: PESSOA_ID,
        sended_at: functionsDatabase.createDateNow("statusSendEmail"),
        response: JSON.stringify(response)
      })
  } catch (error) {

    await Database
      .table("statusSendEmail")
      .insert({
        email: JSON.stringify(EMAIL),
        msg: MSG,
        url: NOME + ": " + TITULO,
        id_object: PESSOA_ID,
        sended_at: functionsDatabase.createDateNow("statusSendEmail"),
        response: "Error: " + JSON.stringify(error)
      })
  }


}



const storeToUser = async ({ request, USER_ID, MSG, TITULO, PESSOA_ID, URL, EXTRA, ATTACHMENTS }) => {


  let data = {
    USER_ID,
    MSG,
    TITULO,
    PESSOA_ID,
    URL,
    EXTRA,
  }

  data.ID = await functionsDatabase.createID(table)
  data.DT_REGISTO = functionsDatabase.createDateNow(table)
  data.ESTADO = "1"

  const newE = await Database
    .table(table)
    .insert(data)



  if (newE[0] === 0) {


    const EMAIL = await functionsDatabase.findEmail("USER", USER_ID)
    sendToEmail({ MSG, PESSOA_ID, TITULO, EMAIL, ATTACHMENTS })
    if (request)
      request.io.to('' + USER_ID + "*_USER").emit('standard', 'Notificacao');

  }


}



const storeToEntidade = async ({ request, ENTIDADE_ID, MSG, TITULO, PESSOA_ID, URL, EXTRA, ATTACHMENTS }) => {


  let data = {
    ENTIDADE_ID,
    MSG,
    TITULO,
    PESSOA_ID,
    URL,
    EXTRA
  }

  data.ID = await functionsDatabase.createID(table)
  data.DT_REGISTO = functionsDatabase.createDateNow(table)
  data.ESTADO = "1"


  const newE = await Database
    .table(table)
    .insert(data)



  if (newE[0] === 0) {


    const EMAIL = await functionsDatabase.findEmail("ENTIDADE", ENTIDADE_ID)
    sendToEmail({ MSG, PESSOA_ID, TITULO, EMAIL, ATTACHMENTS })
    if (request)
      request.io.to('' + ENTIDADE_ID + "*_ENTIDADE").emit('standard', 'Notificacao');

  }

}




const storeToPerfil = async ({ request, PERFIL_ID, MSG, TITULO, PESSOA_ID, URL, EXTRA }) => {


  let data = {
    PERFIL_ID,
    MSG,
    TITULO,
    PESSOA_ID,
    URL,
    EXTRA
  }

  data.ID = await functionsDatabase.createID(table)
  data.DT_REGISTO = functionsDatabase.createDateNow(table)
  data.ESTADO = "1"


  const newE = await Database
    .table(table)
    .insert(data)



  if (newE[0] === 0) {


    const EMAIL = await functionsDatabase.findEmail("PERFIL", PERFIL_ID)
    sendToEmail({ MSG, PESSOA_ID, TITULO, EMAIL, ATTACHMENTS: null })
    if (request)
      request.io.to('' + PERFIL_ID + "*_PERFIL").emit('standard', 'Notificacao');
  }

}
















module.exports = {
  storeToUser,
  storeToEntidade,
  storeToPerfil,
}



