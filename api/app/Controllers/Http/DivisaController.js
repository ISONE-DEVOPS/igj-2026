'use strict'

const GenericController = require("./GenericController")
const Model = use('App/Models/Divisa');

class DivisaController extends GenericController{

    table = "divisa";
    Model = Model
}

module.exports = DivisaController



