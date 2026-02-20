'use strict'

const dataBase = use('Database')
const functionsDatabase = require('../Controllers/functionsDatabase');

class DatabaseAuditoria {
    whereCondiction = {}
    tableAuditoria = "auditoria"
    userId = null

    table(tableName) {
        this.tableName = tableName
        this.whereCondiction = {}
        return this
    }

    where(key, value) {

        if (typeof key === 'object' && !Array.isArray(key) && key !== null) {
            Object.keys(key).forEach((k) => {
                this.whereCondiction[k] = key[k]
            })
        } else {
            this.whereCondiction[key] = value
        }
        return this
    }

    userID(ID) {
        this.userId = ID
        return this
    }

    async insert(data, isAuditoria = true) {

        if (isAuditoria) {
            let newE = await dataBase.table(this.tableName).insert(data)
            if (newE[0] === 0) {
                await dataBase.table(this.tableAuditoria).insert({
                    ID: await functionsDatabase.createID(this.tableAuditoria),
                    Model: this.tableName,
                    Accao: "inserção",
                    Mode_ID: data.ID,
                    User_ID: data.CRIADO_POR,
                    Text_Accao: "Criação de " + this.getNickName(),
                    Text_Modulo: "Modulo de " + this.getNameModule(),
                    Text_Detalhe: "Novo " + this.getNickName() + " " + " Criado",
                    Created_At: data.DT_REGISTO,
                    Alterado: JSON.stringify(data)
                })
            }
            return newE
        }

        return dataBase.table(this.tableName).insert(data)

    }

    async update(data, isAuditoria = true) {

        if (isAuditoria) {
            let model = await dataBase.query().from(this.tableName).select(Object.keys(data)).where(this.whereCondiction)
            let newE = await dataBase.table(this.tableName).where(this.whereCondiction).update(data)
            if (newE === 1) {
                if (data["ESTADO"] == 0) {
                    await this.deleteWithoutExecute()
                } else {
                    await dataBase.table(this.tableAuditoria).insert({
                        ID: await functionsDatabase.createID(this.tableAuditoria),
                        Model: this.tableName,
                        Accao: "Actualização",
                        Mode_ID: this.whereCondiction["ID"],
                        User_ID: this.userId,
                        Text_Accao: "Actualização de " + this.getNickName(),
                        Text_Modulo: "Modulo de " + this.getNameModule(),
                        Text_Detalhe: this.getNickName() + " foi actualizado",
                        Created_At: await functionsDatabase.createDateNow(this.tableAuditoria),
                        Alterado: JSON.stringify(data),
                        Original: JSON.stringify(model[0])
                    })
                }
            }
            return newE
        }
        return await dataBase.table(this.tableName).where(this.whereCondiction).update(data)
    }

    async delete(isAuditoria = true) {
        if (isAuditoria) {
            let newE = await dataBase.table(this.tableName).where(this.whereCondiction).delete()
            if (newE === 1) {
                await dataBase.table(this.tableAuditoria).insert({
                    ID: await functionsDatabase.createID(this.tableAuditoria),
                    Model: this.tableName,
                    Accao: "Exclusão",
                    Mode_ID: this.whereCondiction["ID"],
                    User_ID: this.userId,
                    Text_Accao: "Exclusão de " + this.getNickName(),
                    Text_Modulo: "Modulo de " + this.getNameModule(),
                    Text_Detalhe: this.getNickName() + " " + " foi removido",
                    Created_At: await functionsDatabase.createDateNow(this.tableAuditoria),
                    Alterado: null,
                    Original: null
                })
            }
            return newE
        }
        return await dataBase.table(this.tableName).where(this.whereCondiction).delete()
    }

    async deleteWithoutExecute() {

        await dataBase.table(this.tableAuditoria).insert({
            ID: await functionsDatabase.createID(this.tableAuditoria),
            Model: this.tableName,
            Accao: "Exclusão",
            Mode_ID: this.whereCondiction["ID"],
            User_ID: this.userId,
            Text_Accao: "Exclusão de " + this.getNickName(),
            Text_Modulo: "Modulo de " + this.getNameModule(),
            Text_Detalhe: this.getNickName() + " " + " foi removido",
            Created_At: await functionsDatabase.createDateNow(this.tableAuditoria),
            Alterado: null,
            Original: null
        })

    }

    async registerExport(type) {

        await dataBase.table(this.tableAuditoria).insert({
            ID: await functionsDatabase.createID(this.tableAuditoria),
            Model: this.tableName,
            Accao: "Download de Relatorio",
            Mode_ID: null,
            User_ID: this.userId,
            Text_Accao: "Download de " + type + " " + this.getNickName(),
            Text_Modulo: "Modulo de Relatorios",
            Text_Detalhe: "Relatorio  de " + this.getNickName(),
            Created_At: await functionsDatabase.createDateNow(this.tableAuditoria),
            Alterado: null,
            Original: null
        })

    }

    async limit(number) {
        return await dataBase.table(this.tableName).where(this.whereCondiction).limit(number)
    }

    getNickName() {
        return {
            "bancos": "banco",
            "cabimentacaos": "cabimentacao",
            "casosuspeito": "caso suspeito",
            "contrapartidaentidade": "contrapartida de entidade",
            "contrapartidapagamentos": "pagamentos de contrapartida",
            "contrapartidaparamentizados": "paramentizado de contrapartida",
            "contrapartidas": "contrapartida",
            "contribuicoes": "contribuições",
            "divisa": "divisa",
            "glbgeografia": "geografia",
            "glbmenu": "menu",
            "glbnotificacao": "notificacao",
            "glbperfil": "perfil",
            "glbperfilmenu": "menu de perfil",
            "glbpredefinicao": "predefinicao",
            "glbuser": "utilizador",
            "impostoparametrizados": "parametrizações de imposto",
            "impostos": "impostos",
            "interveniente": "interveniente",
            "meiopagamentos": "meio de pagamentos",
            "modalidadepagamento": "modalidade de pagamento",
            "orcamentos": "orcamentos",
            "pagamentoscontribuicoes": "pagamento de scontribuicoes",
            "pagamentosimpostos": "pagamentos de impostos",
            "premios": "premios",
            "projetos": "projetos",
            "rubricas": "rubricas",
            "sgigjdespachofinal": "despacho final",
            "sgigjdespachointerrompido": "despacho interrompido",
            "sgigjentidade": "entidade",
            "sgigjentidadebanca": "banca da entidade",
            "sgigjentidadeequipamento": "equipamento da entidade",
            "sgigjentidadeevento": "evento da entidade",
            "sgigjentidadegrupo": "grupo de entidade",
            "sgigjentidademaquina": "maquina da entidade",
            "sgigjexclusaoreclamacao": "reclamacao da exclusao",
            "sgigjhandpay": "handpay",
            "sgigjinfracaocoima": "coima da infracao",
            "sgigjpessoa": "pessoa",
            "sgigjprbancatp": "tipo de banca",
            "sgigjprcategoriaprofissional": "profissional de categoria",
            "sgigjprcontactotp": "tipo de contacto",
            "sgigjprdecisaotp": "tipo de decisao",
            "sgigjprdocumentotp": "tipo de documento",
            "sgigjprentidadetp": "tipo de entidade",
            "sgigjprequipamentoclassificacao": "classificacao de equipamento",
            "sgigjprequipamentotp": "tipo de equipamento",
            "sgigjprestadocivil": "estado civil",
            "sgigjpreventotp": "tipo de evento",
            "sgigjprexclusaoperiodo": "periodo de exclusao",
            "sgigjprgenero": "genero",
            "sgigjprinfracaotp": "tipo de infracao",
            "sgigjprlingua": "tipo de lingua",
            "sgigjprmaquinatp": "tipo de maquina",
            "sgigjprmotivoesclusaotp": "tipo de motivo de esclusao",
            "sgigjprnivelescolaridade": "nivel de escolaridade",
            "sgigjprnivellinguistico": "nivel de linguistico",
            "sgigjprocessoautoexclusao": "processo da autoexclusao",
            "sgigjprocessodespacho": "processo de despacho",
            "sgigjprocessodespachofinal": "processo de despacho final",
            "sgigjprocessoexclusao": "processo de exclusao",
            "sgigjprorigemtp": "tipo de origem",
            "sgigjprpecasprocessual": "pecas processual",
            "sgigjprprofissao": "profissao",
            "sgigjprstatus": "estado",
            "sgigjprtipologia": "tipologia",
            "sgigjrelcontacto": "contacto",
            "sgigjrelcontraordenacaoinfracao": "contra ordenacao infracao",
            "sgigjreldocumento": "documento",
            "sgigjrelenteventodecisao": "evento de decisao",
            "sgigjreleventodespacho": "evento de despacho",
            "sgigjreleventoparecer": "evento de parecer",
            "sgigjrelinstrutorpeca": "instrutor peca",
            "sgigjrelinterveniente": "interveniente",
            "sgigjrelnotificacaovizualizado": "notificacao vizualizado",
            "sgigjrelpecaprocessualcampo": "peca processual campo",
            "sgigjrelpessoaentidade": "pessoa da entidade",
            "sgigjrelpessoaentidadelingua": "pessoa da entidade lingua",
            "sgigjrelprocessoinstrucao": "processo do instrucao",
            "sgigjrelprocessoinstrutor": "processo de instrutor",
            "sgigjrelreclamacaopeca": "peca reclamacao",
            "sigjprcampo": "campo",
            "statusSendEmail": "envio de email",
        }[this.tableName]
    }

    getNameModule() {
        return {
            "bancos": "Gestão",
            "cabimentacaos": "Financeiro",
            "casosuspeito": "Financeiro",
            "contrapartidaentidade": "Financeiro",
            "contrapartidapagamentos": "Financeiro",
            "contrapartidaparamentizados": "Gestão",
            "contrapartidas": "Financeiro",
            "contribuicoes": "Financeiro",
            "divisa": "Gestão",
            "glbgeografia": "Gestão",
            "glbmenu": "Gestão",
            "glbnotificacao": "Gestão",
            "glbperfil": "Gestão",
            "glbperfilmenu": "Gestão",
            "glbpredefinicao": "Gestão",
            "glbuser": "Gestão",
            "impostoparametrizados": "Financeiro",
            "impostos": "Financeiro",
            "interveniente": "Financeiro",
            "meiopagamentos": "Gestão",
            "modalidadepagamento": "Gestão",
            "orcamentos": "Financeiro",
            "pagamentoscontribuicoes": "Financeiro",
            "pagamentosimpostos": "Financeiro",
            "premios": "Financeiro",
            "projetos": "Financeiro",
            "rubricas": "Financeiro",
            "sgigjdespachofinal": "Processos",
            "sgigjdespachointerrompido": "Processos",
            "sgigjentidade": "Gestão",
            "sgigjentidadebanca": "Gestão",
            "sgigjentidadeequipamento": "Gestão",
            "sgigjentidadeevento": "Evento",
            "sgigjentidadegrupo": "Gestão Entidade",
            "sgigjentidademaquina": "Gestão Entidade",
            "sgigjexclusaoreclamacao": "Exclusão",
            "sgigjhandpay": "Handpay",
            "sgigjinfracaocoima": "Infração",
            "sgigjpessoa": "Gestão",
            "sgigjprbancatp": "Gestão",
            "sgigjprcategoriaprofissional": "Gestão",
            "sgigjprcontactotp": "Gestão",
            "sgigjprdecisaotp": "Gestão",
            "sgigjprdocumentotp": "Gestão",
            "sgigjprentidadetp": "Gestão",
            "sgigjprequipamentoclassificacao": "Gestão",
            "sgigjprequipamentotp": "Gestão",
            "sgigjprestadocivil": "Gestão",
            "sgigjpreventotp": "Gestão",
            "sgigjprexclusaoperiodo": "Exclusão",
            "sgigjprgenero": "genero",
            "sgigjprinfracaotp": "Gestão",
            "sgigjprlingua": "Gestão",
            "sgigjprmaquinatp": "Gestão",
            "sgigjprmotivoesclusaotp": "Gestão",
            "sgigjprnivelescolaridade": "Gestão",
            "sgigjprnivellinguistico": "Gestão",
            "sgigjprocessoautoexclusao": "Processo",
            "sgigjprocessodespacho": "Processo",
            "sgigjprocessodespachofinal": "Processo",
            "sgigjprocessoexclusao": "Processo",
            "sgigjprorigemtp": "Gestão",
            "sgigjprpecasprocessual": "Gestão",
            "sgigjprprofissao": "Gestão",
            "sgigjprstatus": "Gestão",
            "sgigjprtipologia": "Gestão",
            "sgigjrelcontacto": "Gestão",
            "sgigjrelcontraordenacaoinfracao": "Infracao",
            "sgigjreldocumento": "Documento",
            "sgigjrelenteventodecisao": "Evento",
            "sgigjreleventodespacho": "Evento",
            "sgigjreleventoparecer": "Evento",
            "sgigjrelinstrutorpeca": "Gestão",
            "sgigjrelinterveniente": "Evento",
            "sgigjrelnotificacaovizualizado": "Gestão",
            "sgigjrelpecaprocessualcampo": "Gestão",
            "sgigjrelpessoaentidade": "Gestão Entidade",
            "sgigjrelpessoaentidadelingua": "Gestão Entidade",
            "sgigjrelprocessoinstrucao": "Processo",
            "sgigjrelprocessoinstrutor": "Processo",
            "sgigjrelreclamacaopeca": "Gestão",
            "sigjprcampo": "Gestão",
            "statusSendEmail": "Gestão",
        }[this.tableName]
    }


}

module.exports = DatabaseAuditoria