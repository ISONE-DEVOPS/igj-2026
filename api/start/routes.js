'use strict'
const Env = use('Env')


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

Route.get('/resources/:fileName', async ({ params, response }) => {
  const filePath = `/public/resources/${params.fileName}`;
  return response.download(Env.get('APP_PATH') + filePath);
})

Route.post('/sessions', 'SessionsController.store')

Route.group(() => {

  Route.resource("glbuser", "GlbuserController").apiOnly();
  Route.resource("glbnotificacao", "GlbnotificacaoController").apiOnly();
  Route.get('lido', 'GlbnotificacaoController.lido');

  Route.get("/sgigjprocessoautoexclusao/exportPdf", "SgigjprocessoautoexclusaoController.exportPdf")

  Route.get("/sgigjhandpay/exportPdf", "SgigjhandpayController.exportPdf")

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

  Route.get("export-pdf/sgigjentidadegrupo", "SgigjentidadegrupoController.exportPdf");
  Route.get("export-csv/sgigjentidadegrupo", "SgigjentidadegrupoController.exportCsv");
  Route.get("export-pdf/sgigjentidadeequipamento", "SgigjentidadeequipamentoController.exportPdf");
  Route.get("export-csv/sgigjentidadeequipamento", "SgigjentidadeequipamentoController.exportCsv");
  Route.get("export-pdf/sgigjentidadebanca", "SgigjentidadebancaController.exportPdf");
  Route.get("export-csv/sgigjentidadebanca", "SgigjentidadebancaController.exportCsv");
  Route.get("export-pdf/sgigjentidademaquina", "SgigjentidademaquinaController.exportPdf");
  Route.get("export-csv/sgigjentidademaquina", "SgigjentidademaquinaController.exportCsv");
  Route.get("export-pdf/sgigjrelpessoaentidade", "SgigjrelpessoaentidadeController.exportPdf");
  Route.get("export-csv/sgigjrelpessoaentidade", "SgigjrelpessoaentidadeController.exportCsv");
  Route.get("export-csv/sgigjhandpay", "SgigjhandpayController.exportCsv")
  Route.get("export-csv/sgigjprocessoautoexclusao", "SgigjprocessoautoexclusaoController.exportCsv")

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
  Route.get("export-pdf/sgigjentidadeevento_parecer", "Sgigjentidadeevento_parecerController.exportPdf");
  Route.get("export-csv/sgigjentidadeevento_parecer", "Sgigjentidadeevento_parecerController.exportCsv");
  Route.get("export-pdf/sgigjentidadeevento", "SgigjentidadeeventoController.exportPdf");
  Route.get("export-csv/sgigjentidadeevento", "SgigjentidadeeventoController.exportCsv");

  Route.resource("sgigjprmotivoesclusaotp", "SgigjprmotivoesclusaotpController").apiOnly();
  Route.resource("sgigjprexclusaoperiodo", "SgigjprexclusaoperiodoController").apiOnly();
  Route.resource("sgigjprprofissao", "SgigjprprofissaoController").apiOnly();
  Route.resource("sgigjhandpay", "SgigjhandpayController").apiOnly();

  Route.resource("sgigjprocessoautoexclusao", "SgigjprocessoautoexclusaoController").apiOnly();
  Route.resource("sgigjprocessodespacho", "SgigjprocessodespachoController").apiOnly();
  Route.resource("sgigjprorigemtp", "SgigjprorigemtpController").apiOnly();
  Route.resource("sgigjprpecasprocessual", "SgigjprpecasprocessualController").apiOnly();
  Route.resource("sgigjprocessoexclusao", "SgigjprocessoexclusaoController").apiOnly();

  Route.get("export-pdf/sgigjprocessoexclusao", "SgigjprocessoexclusaoController.exportPdf");
  Route.get("export-csv/sgigjprocessoexclusao", "SgigjprocessoexclusaoController.exportCsv");

  Route.resource("sgigjexclusaoreclamacao", "SgigjexclusaoreclamacaoController").apiOnly();
  Route.resource("sgigjrelprocessoinstrucao", "SgigjrelprocessoinstrucaoController").apiOnly();
  Route.resource("sgigjrelprocessoinstrutor", "SgigjrelprocessoinstrutorController").apiOnly();
  Route.resource("sgigjrelreclamacaopeca", "SgigjrelreclamacaopecaController").apiOnly();

  Route.resource("sgigjrelinstrutorpeca", "SgigjrelinstrutorpecaController").apiOnly();
  Route.resource("sigjprcampo", "SigjprcampoController").apiOnly();

  Route.put('/sgigjrelprocessoinstrucaocontraordenacao/:id/despacho', 'SgigjprocessodespachoController.Instrucaocontraordenacao')
  Route.put('/sgigjprocessoexclusao/:id/despachofinal', 'SgigjprocessodespachoController.Despachofinal')
  Route.put('/sgigjprocessoautoexclusao/:id/despacho', 'SgigjprocessodespachoController.Autoexclusao')
  Route.put('/sgigjrelprocessoinstrucao/:id/despacho', 'SgigjprocessodespachoController.Instrucao')
  Route.put('/sgigjrelprocessoinstrucao/:id/interrompido', 'SgigjprocessodespachoController.Interrompido')
  Route.put('/sgigjrelprocessoinstrucao/:id/interrompidofinal', 'SgigjprocessodespachoController.InterrompidoDecisao')
  Route.get('/sgigjprocessoexclusao/:id/resgatar', 'SgigjprocessodespachoController.Resgatar')
  Route.put('/sgigjprocessoexclusao/:id/despacho', 'SgigjprocessodespachoController.Exclusao')
  Route.put('/sgigjrelinstrutorpeca/:id/despacho', 'SgigjprocessodespachoController.Pecas')

  Route.put('/sgigjprocessoexclusao/:id/termo-encerramento', 'SgigjprocessodespachoController.TermoEncerramento')
  Route.get('/termo-encerramento/texto', 'TermoEncerramentoTexto.index')

  Route.get('/tempolimiteprocessoexclusao', 'Tempolimiteprocessoexclusao.index')



  

  Route.resource("sgigjprinfracaotp", "SgigjprinfracaotpController").apiOnly();
  Route.resource("sgigjinfracaocoima", "SgigjinfracaocoimaController").apiOnly();

  Route.resource("sgigjentidadecasino", "EntidadeCasinoController").apiOnly();
  Route.post('gerarpedidoaotoexclusao', 'GerarpedidoaotoexclusaoController.post');
  Route.post('upload', 'FileController.upload');
  Route.post('gerarhandpay', 'GerarhandpayController.post');


  Route.resource("contrapartida-entidade", "ContrapartidaEntidadeController").apiOnly();
  Route.resource("contrapartida", "ContrapartidaController").apiOnly();
  Route.resource("payment/contrapartida", "ContrapartidaPagamentoController").apiOnly();
  Route.resource("banco", "BancoController").apiOnly();
  Route.resource("meiospagamento", "MeioPagamentoController").apiOnly();
  Route.get("export-csv/contrapartida", "ContrapartidaController.exportCsv");
  Route.get("export-pdf/contrapartida", "ContrapartidaController.exportPdf");


  Route.resource("contribuicoes", "ContribuicoeController").apiOnly();
  Route.resource("payment/contribuicoes", "PagamentosContribuicoeController").apiOnly();
  Route.get("export-csv/contribuicoes", "ContribuicoeController.exportCsv");
  Route.get("export-pdf/contribuicoes", "ContribuicoeController.exportPdf");


  Route.resource("premios", "PremioController").apiOnly();
  Route.post('payment/premios/:id', 'PremioController.payment');
  Route.get("export-csv/premios", "PremioController.exportCsv");
  Route.get("export-pdf/premios", "PremioController.exportPdf");

  Route.resource("imposto", "ImpostoController").apiOnly();
  Route.resource("parametrizacao/imposto", "ImpostoParametrizadoController").apiOnly();
  Route.resource("payment/imposto", "PagamentosImpostoController").apiOnly();
  Route.get("export-csv/imposto", "ImpostoController.exportCsv");
  Route.get("export-pdf/imposto", "ImpostoController.exportPdf");

  Route.resource("projetos", "ProjetoController").apiOnly();
  Route.get("export-csv/projetos", "ProjetoController.exportCsv");
  Route.get("export-pdf/projetos", "ProjetoController.exportPdf");
  Route.resource("rubricas", "RubricaController").apiOnly();
  Route.resource("cabimentos", "CabimentacaoController").apiOnly();
  Route.get("payment/cabimentos/:id", "CabimentacaoController.payment");
  Route.resource("orcamento", "ProjetoRubricaController").apiOnly();
  Route.get("export-csv/orcamento", "ProjetoRubricaController.exportCsv");
  Route.get("export-pdf/orcamento", "ProjetoRubricaController.exportPdf");
  Route.resource("despesa/orcamento", "OrcalmentoDespesaController").apiOnly();

  Route.get("financeiro", "FinaceiroContoller.index");
  Route.get("export-csv/financeiro", "FinaceiroContoller.exportCsv");
  Route.get("export-pdf/financeiro", "FinaceiroContoller.exportPdf");


  Route.resource("divisa", "DivisaController").apiOnly();
  Route.resource("parecerparametrizacao", "ParecerparametrizacaoController").apiOnly();
  Route.resource("modalidadepagamento", "ModalidadePagamentoController").apiOnly();
  Route.resource("casosuspeito", "CasoSuspeitoController").apiOnly();
  Route.get("documento/casosuspeito/:id", "CasoSuspeitoController.documentComunicado");
  Route.get("export-pdf/casosuspeito", "CasoSuspeitoController.exportPdf");
  Route.get("export-csv/casosuspeito", "CasoSuspeitoController.exportCsv");


  Route.get('/me', 'MeController.show')
  Route.put('/me', 'MeController.update')
  Route.resource("auditoria", "AuditoriaController").apiOnly();

  Route.resource("notificacao-processos", "NotificacaoProcessosController").apiOnly();
  Route.resource("decisao-tribunal-processos", "DecisaoTribunalProcessosController").apiOnly();
  Route.resource("decisao-tutelar-processos", "DecisaoTutelarProcessosController").apiOnly();
  Route.get('sgigjprocessoexclusao/get-interveniente/:id','SgigjprocessoexclusaoController.getInterveniente')
  

  Route.get('juntada/:id', 'Juntada.file');

  // Dashboard endpoints
  Route.get('dashboard/kpis', 'DashboardController.kpis');
  Route.get('dashboard/financeiro', 'DashboardController.financeiro');
  Route.get('dashboard/receita-entidade', 'DashboardController.receitaEntidade');
  Route.get('dashboard/processos', 'DashboardController.processos');
  Route.get('dashboard/eventos', 'DashboardController.eventos');
  Route.get('dashboard/entidades', 'DashboardController.entidades');
  Route.get('dashboard/atividade', 'DashboardController.atividade');
  Route.get('dashboard/handpay', 'DashboardController.handpay');
  Route.get('dashboard/casos-suspeitos', 'DashboardController.casosSuspeitos');
  Route.get('dashboard/orcamento', 'DashboardController.orcamento');
  Route.get('dashboard/filtros', 'DashboardController.filtros');

}).middleware(['authentication'])


Route.get('/glbuseronline', 'GlbuseronlineController.index').middleware(['authentication'])
Route.post('/change-password', 'GlbuserController.changePassword').middleware(['authentication'])
Route.post('/update-own', 'GlbuserController.updateOwn').middleware(['authentication'])



Route.get('/seeder', 'ImpostoParametrizadoController.seeder')





Route.get('test', 'Test.post');

const Database = use("Database");
const Model = use("App/Models/Sgigjprocessoautoexclusao");
const Modelsgigjprocessoexclusao = use("App/Models/Sgigjprocessoexclusao");

Route.get("update_ref",async function(){
  let sgigjprocessoautoexclusao = await Model.all()
  sgigjprocessoautoexclusao = sgigjprocessoautoexclusao.toJSON()

  for (let index = 0; index < sgigjprocessoautoexclusao.length; index++) {
    const element = sgigjprocessoautoexclusao[index];

    const formattedIncrement = String((index+1)).padStart(4, '0'); // Format to 4 digits
    element.REF = `${(new Date(element.DATA)).getFullYear()}.${formattedIncrement}`;
    await Database.table("sgigjprocessoautoexclusao")
    .where("ID", "" + element.ID)
    .update(element);
  }
})


Route.get("update_processos",async function(){
  let sgigjprocessoexclusao = await Modelsgigjprocessoexclusao.all()
  sgigjprocessoexclusao = sgigjprocessoexclusao.toJSON()

  for (let index = 0; index < sgigjprocessoexclusao.length; index++) {
    const element = sgigjprocessoexclusao[index];

    const formattedIncrement = String((index+1)).padStart(4, '0'); // Format to 4 digits
    element.REF = `${(new Date(element.DT_REGISTO)).getFullYear()}.${formattedIncrement}`;
    await Database.table("sgigjprocessoexclusao")
    .where("ID", "" + element.ID)
    .update(element);
  }
})
