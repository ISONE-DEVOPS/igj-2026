'use strict'


const GenericController = require("./GenericController")
const Model = use('App/Models/ModalidadePagamento');

class ModalidadePagamentoController extends GenericController{

    table = "modalidadepagamento";
    Model = Model
}

module.exports = ModalidadePagamentoController


