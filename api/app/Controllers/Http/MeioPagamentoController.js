'use strict'

const GenericController = require("./GenericController")
const Model = use('App/Models/Meiopagamento');

class MeioPagamentoController extends GenericController{

    table = "meiopagamentos";
    Model = Model
}

module.exports = MeioPagamentoController
