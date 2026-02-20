'use strict'

const Model = use('Model')

class Glbmenu extends Model {

    static get table () {
        return 'glbmenu'
    }

    glbmenu_self() {
        return this.belongsTo('App/Models/Glbmenu', 'SELF_ID', 'ID')
    }

    glbperfil() {
        return this.belongsToMany('App/Models/Glbperfil', 'MENUS_ID', 'PERFIL_ID', 'ID', 'ID').pivotTable('glbperfilmenu')
    }

    criadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'CRIADO_POR', 'ID')
    }

    deletadoPor() {
        return this.belongsTo('App/Models/Glbuser', 'DELETADO_POR', 'ID')
    }

}

module.exports = Glbmenu
