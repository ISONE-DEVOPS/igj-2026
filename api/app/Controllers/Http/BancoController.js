'use strict'

const GenericController = require("./GenericController")
const Model = use('App/Models/Banco');

class BancoController extends GenericController{

    table = "bancos";
    Model = Model
}

module.exports = BancoController
