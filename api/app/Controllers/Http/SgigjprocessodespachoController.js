"use strict";

const Instrucaocontraordenacao = require("../Http/SgigjprocessodespachoController/Instrucaocontraordenacao");
const Despachofinal = require("../Http/SgigjprocessodespachoController/Despachofinal");
const Autoexclusao = require("../Http/SgigjprocessodespachoController/Autoexclusao");
const Instrucao = require("../Http/SgigjprocessodespachoController/Instrucao");
const Exclusao = require("../Http/SgigjprocessodespachoController/Exclusao");
const Pecas = require("../Http/SgigjprocessodespachoController/Pecas");

const Interrompido = require("../Http/SgigjprocessodespachoController/Interrompido");
const InterrompidoDecisao = require("../Http/SgigjprocessodespachoController/InterrompidoDecisao");
const Resgatar = require("../Http/SgigjprocessodespachoController/Resgatar");
const TermoEncerramento = require("../Http/SgigjprocessodespachoController/TermoEncerramento");

const entity = {
  Interrompido,
  InterrompidoDecisao,

  Instrucaocontraordenacao,
  Despachofinal,
  Autoexclusao,
  Instrucao,
  Exclusao,
  Pecas,
  Resgatar,
  TermoEncerramento

};

module.exports = entity;
