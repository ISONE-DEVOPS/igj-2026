"use strict";

const Database = use("Database");
const crpyto = require("../../functions/crpyto");
const glob = require("glob");
const fs = require("fs");
const readline = require("readline");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/jwt");

const Glbuser = use("App/Models/Glbuser");
const Glbperfil = use("App/Models/Glbperfil");
const Sgigjrelcontacto = use("App/Models/Sgigjrelcontacto");
const Sgigjprcontactotp = use("App/Models/Sgigjprcontactotp");
const Sgigjprocessoexclusao = use("App/Models/Sgigjprocessoexclusao");
const sgigjentidade = use("App/Models/Sgigjentidade");
const Sgigjrelpessoaentidade = use("App/Models/Sgigjrelpessoaentidade");
const Sgigjpessoa = use("App/Models/Sgigjpessoa");

const Env = use("Env");

const moment = require("moment-timezone");

const crypt = require("crypto");
const bcrypt = require("bcryptjs");
const { array } = require("../../config/uploadimg");

const createID = async (table) => {
  var ready = false;

  var rad = "";

  while (ready === false) {
    rad = crpyto.encrypt(
      "" + Math.random() * (9999999999999 - -9999999999999) + -9999999999999
    );

    while (rad.length < 36) {
      rad = crpyto.encrypt(
        "" + Math.random() * (9999999999999 - -9999999999999) + -9999999999999
      );
    }

    if (rad.length > 36) rad = rad.substring(0, 36);

    const findOne = await Database.table(table).where("ID", rad).limit(1);

    if (findOne.length === 0) ready = true;
  }

  return rad;

  /*const lastelement = await Database
    .table(table)
    .orderBy('DT_REGISTO', 'desc')
    .limit(1)

    var ID = 0


    if(lastelement.length>0){

      const ID_decrypted = crpyto.decrypt(lastelement[0].ID)
      
      var cont = 1
      var over = false

      

      while (over === false) {
       
        const findOne = await Database
          .table(table)
          .where('ID', crpyto.encrypt((parseInt(ID_decrypted)+cont).toString()))
          .limit(1)

          if(findOne.length>0) cont++
          else over = true


       


      }

      const newid = (parseInt(ID_decrypted)+cont)

      ID = crpyto.encrypt((newid).toString())


    }

    else
      ID = crpyto.encrypt('1')
  
    return(ID)*/
};

const getPadLength = ({ length }) => {
  
  return 5-length+length
  if (length < 8) return 7
  // if an odd number in length return the length + 1
  return (length % 2 === 0) ? length : length + 1
}

const padZeros = (num) => {
  // num == 0 || num == 1 ? num = num + 1 : num
  const numStrg = num.toString()
  const padding = getPadLength(numStrg)

  return numStrg.padStart(padding, '0')
}
const createCODIGO = async (table) => {
  let count = await Database.from(table)
    .count()

  let total = count[0]['count(*)']
  total = total + 1

  if (table == "sgigjprocessoautoexclusao") {

    return total
  } else {
    return padZeros(total);
  }
};

const createDateNow = () => {
  return moment().tz(Env.get("GMT", "Atlantic/Cape_Verde")).format("YYYY-MM-DD HH:mm:ss");
};
const createDate = () => {
  return moment().tz(Env.get("GMT", "Atlantic/Cape_Verde")).format("YYYY-MM-DD");
};

const DBMaker = async (table) => {
  var list = {
    data: [],
    key: [],
    other: [],
  };

  const files = glob.sync("*", { cwd: "./database/migrations" });

  var re = RegExp(table);

  for (let i = 0; i < files.length; i++) {
    const reg = files[i].match(re);

    if (reg !== null) {
      if (reg[0] === table) {
        const fileStream = fs.createReadStream(
          "./database/migrations/" + files[i]
        );

        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity,
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.

        for await (const line of rl) {
          var reData = RegExp("data-schema");
          const regData = line.match(reData);

          if (regData !== null) {
            const nameC = line.split("/*Name*/");
            const SizeC = line.split("/*Size*/");
            const TypeC = line.split("[T]");

            var reNull = RegExp("notNullable");
            const regNull = line.match(reNull);
            var notNullable = false;

            if (regNull !== null) notNullable = true;

            var sizeVar = Number.MAX_VALUE;

            if (SizeC.length > 2) sizeVar = SizeC[1];

            list.data.push({
              name: nameC[1].slice(1, -1),
              size: sizeVar,
              type: TypeC[1],
              notNullable,
            });
          }

          var reCODIGO = RegExp("CODIGO-schema");
          const regCODIGO = line.match(reCODIGO);

          if (regCODIGO !== null) {
            list.other.push("CODIGO");
          }

          var reKey = RegExp("key-schema");
          const regKey = line.match(reKey);

          if (regKey !== null) {
            const nameC = line.split("/*Name*/");
            const tableC = line.split("/*Table*/");

            var reNull = RegExp("notNullable");
            const regNull = line.match(reNull);
            var notNullable = false;

            if (regNull !== null) notNullable = true;

            list.key.push({
              name: nameC[1].slice(1, -1),
              table: tableC[1].slice(1, -1),
              notNullable,
            });
          }
        }

        return list;
      }
    }
  }
};

const extractRequest = (list, exception) => {
  var listData = [];

  list.data.forEach((d) => {
    if (exception.includes(d.name) == false) listData.push(d.name);
  });

  list.key.forEach((d) => {
    if (exception.includes(d.name) == false) listData.push(d.name);
  });

  return listData;
};

const validation = async (list, data, extractRequest, table) => {
  var result = { status: "ok", entity: "", message: "", code: "" };

  var keyval = [];

  extractRequest.forEach((e) => {
    list.data.find((o) => {
      if (o.name === e) {
        if (o.notNullable === true) {
          if (data.hasOwnProperty(e) === false)
            result = {
              status: "erro",
              entity: e,
              message: "is required",
              code: 1000,
            };
          else if (data[e] === null || data[e] === "")
            result = {
              status: "erro",
              entity: e,
              message: "is required",
              code: 1000,
            };
        }

        if (
          data.hasOwnProperty(e) === true &&
          data[e] !== null &&
          data[e] !== ""
        ) {
          if (data[e].length > o.size)
            result = {
              status: "erro",
              entity: e,
              message: "maximum size extrapolated",
              e,
              code: 2000,
            };

          if (o.type == "number") {
            if (isNaN(data[e]) === true)
              result = {
                status: "erro",
                entity: e,
                message: "type should be number",
                code: 3001,
              };
          }
        }
      }
    });

    list.key.find((o) => {
      if (o.name === e) {
        if (o.notNullable === true) {
          if (data.hasOwnProperty(e) === false)
            result = {
              status: "erro",
              entity: e,
              message: "is required",
              code: 1000,
            };
          else {
            if (data[e] === null || data[e] === "")
              result = {
                status: "erro",
                entity: e,
                message: "is required",
                code: 1000,
              };

            if (data[e] !== null && data[e] !== "") {
              keyval.push({
                id: data[e],
                table: o.table,
                name: o.name,
              });
            }
          }
        } else {
          if (data.hasOwnProperty(e) === true) {
            if (data[e] !== null) {
              if (data[e] === "") {
                data[e] = null;
              } else {
                // goooooooooo
                keyval.push({
                  id: data[e],
                  table: o.table,
                  name: o.name,
                });
              }
            }
          }
        }

        if (
          data.hasOwnProperty(e) === true &&
          data[e] !== null &&
          data[e] !== ""
        ) {
          if (data[e] && data[e].length > o.size)
            result = {
              status: "erro",
              entity: e,
              message: "maximum size extrapolated",
              e,
              code: 2000,
            };

          if (o.type == "number") {
            if (isNaN(data[e]) === true)
              result = {
                status: "erro",
                entity: e,
                message: "type should be number",
                code: 3001,
              };
          }
        }
      }
    });
  });

  if (result.status === "ok") {
    for (var i = 0; i < keyval.length; i++) {
      const sdc = await existelement(keyval[i].table, keyval[i].id);

      if (!sdc) {
        result = {
          status: "error",
          entity: keyval[i].name + "." + keyval[i].table + "." + keyval[i].id,
          message: "doesnt exist",
          code: "565",
        };
      }
    }
  }

  return result;
};

const existelement = async (table, id) => {
  const lastelement = await Database.table(table).where("ID", id).where('ESTADO', '<>', '0').limit(1);

  if (lastelement.length > 0) return true;
  else return false;
};

const allowed = async (table, method, iduser, idelement) => {
  let res = false;

  if (method == "create") method = "Criar";
  if (method == "update") method = "Editar";
  if (method == "delete") method = "Eliminar";
  if (method == "index") method = "Ler";
  if (method == "show") method = "Ler";

  const menuURL = "/" + table + "/" + method;

  //console.log(menuURL)

  const user = await Glbuser.query()
    .with("glbperfil", (builder) => {
      builder.with("glbmenu", (menuBuilder) => {
        menuBuilder.where("glbmenu.ESTADO", 1);
      });
    })
    .where("ID", "" + iduser)
    .where("ESTADO", "<>", "0")
    .fetch();

  if (user?.rows?.length > 0) {
    const perfil = user.rows[0].$relations.glbperfil;
    if (perfil && perfil.$relations.glbmenu && perfil.$relations.glbmenu.rows.length > 0) {
      const newmenu = perfil.$relations.glbmenu.rows;

      for (let index = 0; index < newmenu.length; index++) {
        const element = newmenu[index].$attributes;

        if (element.URL == menuURL) res = true;
      }
    }
  }

  // Apenas leitura de geografia é pública (dados de referência)
  if (table == "glbgeografia" && (method == "Ler" || method == "show"))
    res = true;

  return res;
};

const indexconfig = (params, extractRequest, list) => {
  extractRequest = extractRequest.concat(list);

  return params.only(extractRequest);
};

const login = async (USERNAME, PASSWORD) => {
  // Buscar utilizador pelo USERNAME
  const lastelement = await Database.table("glbuser")
    .where({ USERNAME })
    .limit(1);

  if (lastelement.length < 1) return { status: "242" };

  if (lastelement[0].ESTADO == 0) return { status: "250" };

  // Verificar password - suporta migração gradual de SHA1 para bcrypt
  const storedPassword = lastelement[0].PASSWORD;
  let passwordValid = false;

  if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")) {
    // Password já está em bcrypt
    passwordValid = await bcrypt.compare(PASSWORD, storedPassword);
  } else {
    // Password ainda em SHA1 - verificar e migrar para bcrypt
    const sha1Hash = crypt.createHash("sha1").update(PASSWORD).digest("hex");
    if (sha1Hash === storedPassword) {
      passwordValid = true;
      // Migrar para bcrypt automaticamente
      const bcryptHash = await bcrypt.hash(PASSWORD, 10);
      await Database.table("glbuser")
        .where("ID", lastelement[0].ID)
        .update({ PASSWORD: bcryptHash });
    }
  }

  if (!passwordValid) return { status: "242" };

  const perfil = await Database.table("glbperfil")
    .where("ID", lastelement[0].PERFIL_ID)
    .limit(1);

  if (perfil.length < 1) return { status: "fail" };

  await Database.table("auditoria").insert({
    ID: await createID("auditoria"),
    Accao: "Login",
    Model: "glbuser",
    Mode_ID: lastelement[0].ID,
    User_ID: lastelement[0].ID,
    Text_Accao: "Login no Sistema",
    Text_Modulo: "Modulo de Autenticação",
    Original: null,
    Alterado: null,
    Text_Detalhe: "Sucesso",
    Created_At: createDateNow(),
  })

  const tokenMessage = {
    id: lastelement[0].ID,
    perfil: lastelement[0].PERFIL_ID,
  };

  const userelement = {
    ID: lastelement[0].ID,
    PERFIL_ID: lastelement[0].PERFIL_ID,
    PERFIL: perfil[0].DESIG,
    REL_PESSOA_ENTIDADE_ID: lastelement[0].REL_PESSOA_ENTIDADE_ID,
    CODIGO: lastelement[0].CODIGO,
    USERNAME: lastelement[0].USERNAME,
    URL_FOTO: lastelement[0].URL_FOTO,
    ESTADO: lastelement[0].ESTADO,
  };

  return {
    status: "0",
    serviceToken: await jwt.sign(tokenMessage, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    }),
    user: userelement,
  };
};

const convertDateToPT = (date) => {
  if (date == "" || date == null) return { dia: "...", mes: "...", ano: "..." };
  else {
    let data345 = date.substring(0, 10).split("-");

    switch (data345[1]) {
      case "01":
        data345[1] = "Janeiro";
        break;
      case "02":
        data345[1] = "Fevereiro";
        break;
      case "03":
        data345[1] = "Março";
        break;
      case "04":
        data345[1] = "Abril";
        break;
      case "05":
        data345[1] = "Maio";
        break;
      case "06":
        data345[1] = "Junho";
        break;
      case "07":
        data345[1] = "Julho";
        break;
      case "08":
        data345[1] = "Agosto";
        break;
      case "09":
        data345[1] = "Setembro";
        break;
      case "10":
        data345[1] = "Outubro";
        break;
      case "11":
        data345[1] = "Novembro";
        break;
      case "12":
        data345[1] = "Dezembro";
        break;
    }

    return { dia: data345[2], mes: data345[1], ano: data345[0] };
  }
};

async function processoStatus(processo_ID) {
  let promise = new Promise(async function (resolve, reject) {
    try {
      let res = {
        ID: null,
        DESPACHOFINAL: null,
        DESPACHOINICIAL: null,
        INSTRUTOR: null,
        INSTRUCAO: null,
        DESPACHOINSTRUCAO: null,
        INTERROMPIDO: null,
      };

      const processo = await Sgigjprocessoexclusao.query()
        .with("sgigjdespachofinal")
        .with(
          "sgigjprocessodespacho.sgigjrelprocessoinstrutor.sgigjrelprocessoinstrucao",
          (builder) => {
            builder
              .with("sgigjdespachointerrompido")
              .with("sgigjprocessodespacho");
          }
        )
        .where("ID", "" + processo_ID)
        .fetch();

      if (processo.rows.length > 0) {
        res.ID = processo.rows[0].$attributes.ID;

        if (processo.rows[0].$relations.sgigjprocessodespacho.rows.length > 0) {
          res.DESPACHOINICIAL =
            processo.rows[0].$relations.sgigjprocessodespacho.rows[0].$attributes.ID;

          if (
            processo.rows[0].$relations.sgigjprocessodespacho.rows[0].$relations
              .sgigjrelprocessoinstrutor.rows.length > 0
          ) {
            res.INSTRUTOR =
              processo.rows[0].$relations.sgigjprocessodespacho.rows[0].$relations.sgigjrelprocessoinstrutor.rows[0].$attributes.ID;

            if (
              processo.rows[0].$relations.sgigjprocessodespacho.rows[0]
                .$relations.sgigjrelprocessoinstrutor.rows[0].$relations
                .sgigjrelprocessoinstrucao.rows.length > 0
            ) {
              res.INSTRUCAO =
                processo.rows[0].$relations.sgigjprocessodespacho.rows[0].$relations.sgigjrelprocessoinstrutor.rows[0].$relations.sgigjrelprocessoinstrucao.rows[0].$attributes.ID;

              if (
                processo.rows[0].$relations.sgigjprocessodespacho.rows[0]
                  .$relations.sgigjrelprocessoinstrutor.rows[0].$relations
                  .sgigjrelprocessoinstrucao.rows[0].$relations
                  .sgigjprocessodespacho.rows.length > 0
              ) {
                res.DESPACHOINSTRUCAO =
                  processo.rows[0].$relations.sgigjprocessodespacho.rows[0].$relations.sgigjrelprocessoinstrutor.rows[0].$relations.sgigjrelprocessoinstrucao.rows[0].$relations.sgigjprocessodespacho.rows[0].$attributes.ID;
              }

              if (
                processo.rows[0].$relations.sgigjprocessodespacho.rows[0]
                  .$relations.sgigjrelprocessoinstrutor.rows[0].$relations
                  .sgigjrelprocessoinstrucao.rows[0].$relations
                  .sgigjdespachointerrompido.rows.length > 0
              ) {
                res.INTERROMPIDO =
                  processo.rows[0].$relations.sgigjprocessodespacho.rows[0].$relations.sgigjrelprocessoinstrutor.rows[0].$relations.sgigjrelprocessoinstrucao.rows[0].$relations.sgigjdespachointerrompido.rows[0].$attributes.ID;
              }
            }
          }
        }

        if (processo.rows[0].$relations.sgigjdespachofinal.rows.length > 0) {
          res.DESPACHOINICIAL =
            processo.rows[0].$relations.sgigjdespachofinal.rows[0].$attributes.ID;
        }
      }

      resolve(res);
    } catch (e) {
      reject(e);
    }
  });

  return promise;
}

const userInfo = async (ID) => {
  const user = await Glbuser.query()
    .with("sgigjrelpessoaentidade.sgigjentidade")
    .with("glbperfil")
    .where("ID", "" + ID)
    .fetch();

  if (user.rows.length > 0) {
    return {
      ENTIDADE_ID:
        user.rows[0].$relations.sgigjrelpessoaentidade.$relations.sgigjentidade
          .$attributes.ID,
      PERFIL_ID: user.rows[0].$relations.glbperfil.$attributes.ID,
    };
  } else
    return {
      ENTIDADE_ID: "",
      PERFIL_ID: "",
    };
};

const userIDToPessoaID = async (ID) => {
  const user = await Glbuser.query()
    .with("sgigjrelpessoaentidade.sgigjpessoa")
    .where("ID", "" + ID)
    .fetch();

  if (user.rows.length > 0) {
    const PESSOA_ID =
      user.rows[0].$relations.sgigjrelpessoaentidade.$relations.sgigjpessoa
        .$attributes.ID;

    return PESSOA_ID;
  } else return "";
};

const userIDToNome = async (ID) => {
  const user = await Glbuser.query()
    .with("sgigjrelpessoaentidade.sgigjpessoa")
    .where("ID", "" + ID)
    .fetch();

  if (user.rows.length > 0) {
    try {
      return user.rows[0].$relations.sgigjrelpessoaentidade.$relations.sgigjpessoa.$attributes.NOME || "Utilizador";
    } catch (e) {
      return "Utilizador";
    }
  }
  return "Utilizador";
};

const pessoaentidadeIDToPessoaID = async (ID) => {
  const pessoaentidade = await Sgigjrelpessoaentidade.query()
    .with("sgigjpessoa")
    .where("ID", "" + ID)
    .fetch();

  if (pessoaentidade.rows.length > 0) {
    const PESSOA_ID =
      pessoaentidade.rows[0].$relations.sgigjpessoa.$attributes.ID;

    return PESSOA_ID;
  } else return "";
};

const pessoaentidadeIDToUserID = async (ID) => {
  const pessoaentidade = await Sgigjrelpessoaentidade.query()
    .with("glbuser")
    .where("ID", "" + ID)
    .fetch();

  if (pessoaentidade.rows.length > 0) {
    if (pessoaentidade.rows[0].$relations.glbuser.rows.length > 0) {
      const PESSOA_ID =
        pessoaentidade.rows[0].$relations.glbuser.rows[0].$attributes.ID;

      return PESSOA_ID;
    } else return "";
  } else return "";
};

const pessoaIDToUserID = async (ID) => {
  const pessoa = await Sgigjpessoa.query()
    .with("sgigjrelpessoaentidade.glbuser")
    .where("ID", "" + ID)
    .fetch();

  if (pessoa.rows.length > 0) {
    if (pessoa.rows[0].$relations.sgigjrelpessoaentidade.rows.length > 0) {
      if (
        pessoa.rows[0].$relations.sgigjrelpessoaentidade.rows[0].$relations
          .glbuser.rows.length > 0
      ) {
        const PESSOA_ID =
          pessoa.rows[0].$relations.sgigjrelpessoaentidade.rows[0].$relations
            .glbuser.rows[0].$attributes.ID;

        return PESSOA_ID;
      } else return "";
    } else return "";
  } else return "";
};

const findEmail = async (TYPE, ID) => {
  let PR_CONTACTO_TP_ID = "";

  const contacto_pr = await Sgigjprcontactotp.query()
    .where("DESIG", "Email")
    .fetch();

  if (contacto_pr.rows.length > 0)
    PR_CONTACTO_TP_ID = contacto_pr.rows[0].$attributes.ID;
  else return [];

  if (TYPE == "USER") {
    const user = await Glbuser.query()
      .with("sgigjrelpessoaentidade.sgigjpessoa")
      .where("ID", "" + ID)
      .fetch();

    if (user.rows.length > 0) {
      const PESSOA_ID =
        user.rows[0].$relations.sgigjrelpessoaentidade.$relations.sgigjpessoa
          .$attributes.ID;


      const contacto = await Sgigjrelcontacto.query()
        .where({ PESSOA_ID, PR_CONTACTO_TP_ID })
        .fetch();
      if (contacto.rows.length > 0)
        return [contacto.rows[0].$attributes.CONTACTO];
      else {
        return [];
      }
    } else return [];
  }

  if (TYPE == "PERFIL") {
    const perfil = await Glbperfil.query()
      .with("glbuser.sgigjrelpessoaentidade.sgigjpessoa")
      .where("ID", "" + ID)
      .fetch();

    if (perfil.rows.length > 0) {
      // const PESSOA_ID =  perfil.rows[0].$relations.sgigjrelpessoaentidade.$relations.sgigjpessoa.$attributes.ID

      if (perfil.rows[0].$relations.glbuser.rows.length > 0) {
        const perfil_list_user = perfil.rows[0].$relations.glbuser.rows;

        let list_user = [];

        for (let index = 0; index < perfil_list_user.length; index++) {
          list_user.push(
            perfil.rows[0].$relations.glbuser.rows[index].$relations
              .sgigjrelpessoaentidade.$relations.sgigjpessoa.$attributes.ID
          );
        }

        const contacto = await Database.from("sgigjrelcontacto")
          .where("PR_CONTACTO_TP_ID", PR_CONTACTO_TP_ID)
          .whereIn("PESSOA_ID", list_user);

        if (contacto.length > 0) {
          let list = [];

          for (let index2 = 0; index2 < contacto.length; index2++) {
            list.push(contacto[index2].CONTACTO);
          }

          return list;
        } else return [];
      } else return [];
    } else return [];
  }

  if (TYPE == "ENTIDADE") {
    const entidade = await sgigjentidade
      .query()
      .with("sgigjrelpessoaentidade.glbuser.sgigjrelpessoaentidade.sgigjpessoa")
      .where("ID", "" + ID)
      .fetch();

    if (entidade.rows.length) {
      if (entidade.rows[0].$relations.sgigjrelpessoaentidade.rows.length > 0) {
        const entidade_list_user =
          entidade.rows[0].$relations.sgigjrelpessoaentidade.rows;

        let list_user = [];

        for (let index = 0; index < entidade_list_user.length; index++) {
          list_user.push(
            entidade.rows[0].$relations.sgigjrelpessoaentidade.rows[index]
              .$relations.glbuser.rows[0].$relations.sgigjrelpessoaentidade
              .$relations.sgigjpessoa.$attributes.ID
          );
        }

        console.log(entidade.rows[0].$relations.sgigjrelpessoaentidade.rows);

        const contacto = await Database.from("sgigjrelcontacto")
          .where("PR_CONTACTO_TP_ID", PR_CONTACTO_TP_ID)
          .whereIn("PESSOA_ID", list_user);

        if (contacto.length > 0) {
          let list = [];

          for (let index2 = 0; index2 < contacto.length; index2++) {
            list.push(contacto[index2].CONTACTO);
          }

          return list;
        } else return [];
      }
    }
  }

  return [];
};

const createREF = async (table) => {

  const year = new Date().getFullYear();
  let lastRecord = await Database.from(table)
  .whereRaw('YEAR(DT_REGISTO) = ?', [year])
  .orderBy('DT_REGISTO', 'desc')
  .first()

  let increment = 0;

  if (lastRecord && lastRecord.REF) {
    try {
      increment = parseInt(lastRecord.REF.split('.')[1], 10)
    } catch (error) {
      
    }
  }

  increment = increment + 1
  
  const formattedIncrement = String(increment).padStart(4, '0'); // Format to 4 digits
  return `${year}.${formattedIncrement}`;
};

module.exports = {
  createID,
  createCODIGO,
  createDateNow,
  DBMaker,
  extractRequest,
  validation,
  existelement,
  allowed,
  indexconfig,
  login,
  convertDateToPT,
  processoStatus,
  userInfo,
  userIDToPessoaID,
  userIDToNome,
  pessoaentidadeIDToUserID,
  pessoaentidadeIDToPessoaID,
  pessoaIDToUserID,
  findEmail,
  createREF,
  createDate
};
