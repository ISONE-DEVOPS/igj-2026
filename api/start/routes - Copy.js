
const uploadimg = require('../config/uploadimg');


'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return "developed by isone.cv"
})

Route.post('/sessions', 'SessionsController.store')

Route.group(() => {

  Route.resource("glbuser", "GlbuserController").apiOnly();
  Route.resource("glbnotificacao", "GlbnotificacaoController").apiOnly();

  Route.resource("glbmenu", "GlbmenuController").apiOnly();
  Route.resource("glbperfil", "GlbperfilController").apiOnly();
  Route.resource("glbperfilmenu", "GlbperfilmenusController").apiOnly();
  Route.resource("glbpredefinicao", "GlbpredefinicaoController").apiOnly();

  Route.resource("sgigjhandpay", "SgigjhandpayController").apiOnly();
  Route.resource("sgigjprgenero", "SgigjprgeneroController").apiOnly();
  Route.resource("sgigjprestadocivil", "SgigjprestadocivilController").apiOnly();
  Route.resource("sgigjprcontactotp", "SgigjprcontactotpController").apiOnly();
  Route.resource("sgigjprdocumentotp", "SgigjprdocumentotpController").apiOnly();
  Route.resource("sgigjprnivelescolaridade", "SgigjprnivelescolaridadeController").apiOnly();
  Route.resource("sgigjprcategoriaprofissional", "SgigjprcategoriaprofissionalController").apiOnly();
  Route.resource("sgigjprnivellinguistico", "SgigjprnivellinguisticoController").apiOnly();
  Route.resource("sgigjprbancatp", "SgigjprbancatpController").apiOnly();
  Route.resource("sgigjprequipamentotp", "SgigjprequipamentotpController").apiOnly();
  Route.resource("sgigjprstatus", "SgigjprstatusController").apiOnly();
  Route.resource("sgigjprmaquinatp", "SgigjprmaquinatpController").apiOnly();
  Route.resource("sgigjprtipologia", "SgigjprtipologiaController").apiOnly();
  //Route.resource("sgigjprtipologia","SgigjprtipologiaController").apiOnly();

  Route.resource("sgigjprequipamentoclassificacao", "SgigjprequipamentoclassificacaoController").apiOnly();
  Route.resource("glbgeografia", "GlbgeografiaController").apiOnly();

  Route.resource("sgigjpessoa", "SgigjpessoaController").apiOnly();
  Route.resource("sgigjprentidadetp", "SgigjprentidadetpController").apiOnly();
  Route.resource("sgigjentidade", "SgigjentidadeController").apiOnly();
  Route.resource("sgigjentidademaquina", "SgigjentidademaquinaController").apiOnly();
  Route.resource("sgigjentidadegrupo", "SgigjentidadegrupoController").apiOnly();
  Route.resource("sgigjentidadebanca", "SgigjentidadebancaController").apiOnly();
  Route.resource("sgigjentidadeequipamento", "SgigjentidadeequipamentoController").apiOnly();
  Route.resource("sgigjrelpessoaentidade", "SgigjrelpessoaentidadeController").apiOnly();

  Route.resource("sgigjprlingua", "SgigjprlinguaController").apiOnly();
  Route.resource("sgigjrelpessoaentidadelingua", "SgigjrelpessoaentidadelinguaController").apiOnly();
  Route.resource("sgigjreldocumento", "SgigjreldocumentoController").apiOnly();
  Route.resource("sgigjrelcontacto", "SgigjrelcontactoController").apiOnly();

  Route.resource("sgigjpreventotp", "SgigjpreventotpController").apiOnly();
  Route.resource("sgigjprdecisaotp", "SgigjprdecisaotpController").apiOnly();
  Route.resource("sgigjentidadeevento", "SgigjentidadeeventoController").apiOnly();
  Route.resource("sgigjrelenteventodecisao", "SgigjrelenteventodecisaoController").apiOnly();

  Route.resource("sgigjentidadeevento_parecer", "Sgigjentidadeevento_parecerController").apiOnly();
  Route.resource("sgigjreleventodespacho", "SgigjreleventodespachoController").apiOnly();
  Route.resource("sgigjreleventoparecer", "SgigjreleventoparecerController").apiOnly();

  Route.resource("sgigjprmotivoesclusaotp", "SgigjprmotivoesclusaotpController").apiOnly();
  Route.resource("sgigjprexclusaoperiodo", "SgigjprexclusaoperiodoController").apiOnly();
  Route.resource("sgigjprprofissao", "SgigjprprofissaoController").apiOnly();
  Route.resource("sgigjhandpay", "SgigjhandpayController").apiOnly();

  Route.resource("sgigjprocessoautoexclusao", "SgigjprocessoautoexclusaoController").apiOnly();
  Route.resource("sgigjprocessodespacho", "SgigjprocessodespachoController").apiOnly();
  Route.resource("sgigjprorigemtp", "SgigjprorigemtpController").apiOnly();
  Route.resource("sgigjprpecasprocessual", "SgigjprpecasprocessualController").apiOnly();
  Route.resource("sgigjprocessoexclusao", "SgigjprocessoexclusaoController").apiOnly();

  Route.resource("sgigjexclusaoreclamacao", "SgigjexclusaoreclamacaoController").apiOnly();
  Route.resource("sgigjrelprocessoinstrucao", "SgigjrelprocessoinstrucaoController").apiOnly();
  Route.resource("sgigjrelprocessoinstrutor", "SgigjrelprocessoinstrutorController").apiOnly();
  Route.resource("sgigjrelreclamacaopeca", "SgigjrelreclamacaopecaController").apiOnly();

  Route.resource("sgigjrelinstrutorpeca", "SgigjrelinstrutorpecaController").apiOnly();
  Route.resource("sigjprcampo", "SigjprcampoController").apiOnly();

  Route.put('/sgigjprocessoautoexclusao/:id/despacho', 'SgigjprocessodespachoController.Autoexclusao')
  Route.put('/sgigjrelprocessoinstrucao/:id/despacho', 'SgigjprocessodespachoController.Instrucao')
  Route.put('/sgigjprocessoexclusao/:id/despacho', 'SgigjprocessodespachoController.Exclusao')
  Route.put('/sgigjrelinstrutorpeca/:id/despacho', 'SgigjprocessodespachoController.Pecas')

  Route.get('/tempolimiteprocessoexclusao', 'Tempolimiteprocessoexclusao.index')


  Route.resource("sgigjprinfracaotp", "SgigjprinfracaotpController").apiOnly();
  Route.resource("sgigjinfracaocoima", "SgigjinfracaocoimaController").apiOnly();


}).middleware(['authentication'])

Route.get('/glbuseronline', 'GlbuseronlineController.index').middleware(['authentication'])



Route.get('/me', 'MeController.show')
Route.put('/me', 'MeController.update')

Route.post('upload', 'FileController.upload');
Route.post('test', 'Test.post');
Route.post('gerarpedidoaotoexclusao', 'GerarpedidoaotoexclusaoController.post');