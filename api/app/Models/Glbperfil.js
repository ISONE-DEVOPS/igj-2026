'use strict'


const Model = use('Model')

class Glbperfil extends Model {

  static get table() {
    return 'glbperfil'
  }

  glbmenu() {
    return this.belongsToMany('App/Models/Glbmenu', 'PERFIL_ID', 'MENUS_ID', 'ID', 'ID').pivotTable('glbperfilmenu')
  }


  glbuser() {
    return this.hasMany('App/Models/Glbuser', 'ID', 'PERFIL_ID')
  }

  criadoPor() {
    return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
  }

  deletadoPor() {
    return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
  }
}

module.exports = Glbperfil
