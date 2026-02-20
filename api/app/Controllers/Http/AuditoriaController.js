'use strict'

const Model = use('App/Models/Auditoria');
const functionsDatabase = require('../functionsDatabase');
const Database = use('Database');

class AuditoriaController {

    table = "auditoria";
    Model = Model
    async index({ params, request, response }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "index", request.userID, "");
        if (allowedMethod || true) {
            const list = await functionsDatabase.DBMaker(this.table);
            const extractRequest = functionsDatabase.extractRequest(list, [])
            const data = functionsDatabase.indexconfig(request, extractRequest, [])
            let count = (await Model.query().where(data).count("id as total"))

           
            if(count && count[0]["total"]){
                count = count[0]["total"]
            }else{
                count = 0
            }


            let limit = request.input("limit") || 16
            let offset = request.input("offset") || 0
            
            var result = await Model.query()
                .orderBy('Created_At', 'desc')
                .with('user')
                .where(data).limit(limit).offset(offset).fetch()
            return {
                "data": result,
                "totalItems":count
            }
        }

        else return response.status(403).json({ status: "403Error", entity: this.table, message: "index not allwed", code: "4054" })
    }

    async show({ params, response, request }) {
        const allowedMethod = await functionsDatabase.allowed(this.table, "show", request.userID, params.id);
        if (allowedMethod || true) {
            const element = await Database.table(this.table).where("ID", params.id).limit(1);
            if (element === false) return { status: "erro", entity: this.table, message: "doesnt exist", code: 999 }

            else {

                return await Model
                    .query()
                    .with('user')
                    .where('ID', '' + params.id)
                    .fetch()
            }
        }
        else return response.status(403).json({ status: "403Error", entity: this.table, message: "show not allwed", code: "4053" })
    }
}

module.exports = AuditoriaController
