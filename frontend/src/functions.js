import api from './services/api';


export const pageEnable = (page, permissoes) => {

    var res = false

    for (var i = 0; i < permissoes.length; i++) {

        if ((permissoes[i].TIPO == "item" || permissoes[i].TIPO == "subitem") && permissoes[i].URL == page) res = true


    }

    return res

}
export async function onFormSubmitImage(thumnail) {
    var res = {
        status: false,
        file: null,
    };

    try {
        const formData = new FormData();

        formData.append("file", thumnail);

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        const uploadResponse = await api.post("/upload", formData, config);

        res = {
            status: true,
            file: uploadResponse,
        };
    } catch (err) {
        console.error(err.response);

        res = {
            status: false,
            file: null,
        };
    }

    return res;
}


export const taskEnable = (page, permissoes, task) => {

    var res = false



    for (var i = 0; i < permissoes.length; i++) {


        if (permissoes[i].TIPO == "task") {

            var S2 = permissoes[i].URL.split("/")

            if (permissoes[i].SELF_ID != null) {

                if (permissoes[i].glbmenu_self.URL == page) {

                    if (S2[2] == task) {

                        res = true

                    }

                }

            }

        }


    }

    return res

}

export const pageEnableIcon = (page, permissoes) => {

    var res = ""



    for (var i = 0; i < permissoes.length; i++) {


        if ((permissoes[i].TIPO == "item" || permissoes[i].TIPO == "subitem") && permissoes[i].URL == page)

            if (permissoes[i].URL_ICON != null)

                res = permissoes[i].URL_ICON


    }

    return res

}

export const pageEnableTitle = (page, permissoes) => {

    var res = ""



    for (var i = 0; i < permissoes.length; i++) {


        if ((permissoes[i].TIPO == "item" || permissoes[i].TIPO == "subitem") && permissoes[i].URL == page)

            if (permissoes[i].URL_ICON != null)

                res = permissoes[i].DS_MENU


    }

    return res

}

export const taskEnableIcon = (page, permissoes, task) => {

    var res = ""



    for (var i = 0; i < permissoes.length; i++) {


        if (permissoes[i].TIPO == "task") {

            var S2 = permissoes[i].URL.split("/")

            if (permissoes[i].SELF_ID != null) {

                if (permissoes[i].glbmenu_self.URL == page) {

                    if (S2[2] == task) {

                        res = permissoes[i].URL_ICON

                    }

                }

            }

        }


    }

    return res

}

export const taskEnableTitle = (page, permissoes, task) => {

    var res = ""



    for (var i = 0; i < permissoes.length; i++) {


        if (permissoes[i].TIPO == "task") {

            var S2 = permissoes[i].URL.split("/")

            if (permissoes[i].SELF_ID != null) {

                if (permissoes[i].glbmenu_self.URL == page) {

                    if (S2[2] == task) {

                        res = permissoes[i].DS_MENU

                    }

                }

            }

        }


    }

    return res

}
export function makedate(date) {
    if (date == null) {
        return ""
    }
    let stringDate = date.substring(0, 10);
    const parts = stringDate.split("-");
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate
}
export function formatDate(date) {
    if (date == null) return
    var d = new Date(date),
        month = '' + (d.getUTCMonth() + 1),
        day = '' + (d.getUTCDate() + 1),
        year = d.getUTCFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
}
export function createDate1(data) {

    if (data == null) return


    let res = new Date(data).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }).split(' ').join('-');

    res = res.replace('/', '-')

    return res.replace('/', '-')

}
export const convertToPrice = (number) => {

    // const s = (""+number).slice("")
    // let cont = 0
    // let res = ""

    // for (let i = s.length -1; i >=0 ; i--) {

    //     res=res+s[i]
    //     cont++

    //     if(cont==3&&i!=0) {
    //         res=res+"."
    //         cont=0
    //     }
    // }

    // return res.split("").reverse().join("")
    const numberFormatter = Intl.NumberFormat('pt-PT');
    const formatted = numberFormatter.format(number);

    return formatted

}


export const convertDateToPT = (date) => {



    if (date == "" || date == null) return ({ dia: "...", mes: "...", ano: "..." })


    else {

        let data345 = date.split("-")

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

        const diaX = ("" + data345[2]).substring(0, 2)

        return ({ dia: diaX, mes: data345[1], ano: data345[0] })


    }


}



export const convertDateToNormal = (date) => {



    if (date == "" || date == null) return ({ dia: "...", mes: "...", ano: "..." })


    else {

        let data345 = date.slice(0, 10).split("-")

        return ({ dia: data345[2], mes: data345[1], ano: data345[0] })


    }


}


export const createDateToUser = (data) => {

    if (data == null) return

    const temp = data.split('-')
    return [temp[2], temp[1], temp[0]].join('-');
    let res = new Date(data).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }).split(' ').join('-');

    res = res.replace('/', '-')

    return res.replace('/', '-')

}


export const createDateToInput = (date) => {

    if (date == null) return ""


    return new Date(date).toISOString().slice(0, 10)

}



export const timerMaker2 = (itemDate, currentTime) => {



    const yearItem = parseInt(itemDate.substring(0, 4));
    const mouthItem = parseInt(itemDate.substring(5, 7));
    const dayItem = parseInt(itemDate.substring(8, 10));

    const yearCurrent = parseInt(currentTime.substring(0, 4));
    const mouthCurrent = parseInt(currentTime.substring(5, 7));
    const currentDay = parseInt(currentTime.substring(8, 10));


    const hourItem = parseInt(itemDate.substring(11, 13));
    const minItem = parseInt(itemDate.substring(14, 16));

    const hourCurrent = parseInt(currentTime.substring(11, 13));
    const minCurrent = parseInt(currentTime.substring(14, 16));



    const timelast = ((yearCurrent * 518400 + mouthCurrent * 43200 + currentDay * 1440 + hourCurrent * 60 + minCurrent) -
        (yearItem * 518400 + mouthItem * 43200 + dayItem * 1440 + hourItem * 60 + minItem))




    if (timelast < 59) {

        if (timelast < 0) return ("algum tempo")

        if (timelast == 0) return ("menos de 1 min")

        if (timelast > 0) return (timelast + " min")

    }

    if (timelast > 59 && timelast < 1440) {


        return ((parseInt(timelast / 60)) + " hr")
        //return (timelast)

    }

    if (timelast > 1440 && timelast < 43200) {

        if ((parseInt(timelast / 1440) == 1)) return ("1 dia")

        else return ((parseInt(timelast / 1440)) + " dias")
        //return (timelast)

    }

    if (timelast > 43200 && timelast < 518400) {

        if ((parseInt(timelast / 43200) == 1)) return ("1 mês")

        else return ((parseInt(timelast / 43200)) + " meses")
        //return (timelast)

    }

    if (timelast > 518400) {

        if ((parseInt(timelast / 518400) == 1)) return ("1 ano")

        else return ((parseInt(timelast / 518400)) + " anos")
        //return (timelast)

    }

    return timelast

    //}


}
// export function formatCurrency(number) {

//     if (typeof number !== 'number') {
//         return '0 CVE';
//     }
//     const roundedValue = Math.round(number);

//     return roundedValue.toLocaleString('pt-PT', { style: 'currency', currency: "CVE", minimumFractionDigits: 0 });
// }
export function formatCurrency(value) {
    if (typeof value !== 'number') {
        return '0 CVE';
    }

    // Round the value to 2 decimal places, rounding half up
    const roundedValue = Math.round(value);

    // Split the number into integer and fractional parts
    const parts = roundedValue.toString().split('.');

    // Format the integer part with thousands separator
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    // Ensure there is a fractional part with two decimal places
    const fractionalPart = parts.length > 1 ? parts[1].padEnd(2, '0') : '00';

    // Combine the formatted parts with the currency symbol
    const formattedNumber = `${integerPart},${fractionalPart} CVE`;

    return formattedNumber;
}
export function parseCurrency(currencyString) {

    if (typeof currencyString === 'number') {
        return 0
    }
    const formatter = new Intl.NumberFormat('pt-CV', {
        style: 'currency',
        currency: 'CVE',
    });

    const parts = formatter.formatToParts(0);
    const regex = new RegExp(
        `\\${parts[0].value.replace(/\./g, '\\.')}`,
        'g'
    );

    const numericString = currencyString.replace(regex, '')
        .replace(/\s/g, '')
        .replace(/,/g, '.');

    return parseFloat(numericString);
}
export function roundToTwoDecimalPlaces(value) {
    // Check if the value is an integer
    if (Math.floor(value) === value) {
        return value.toString(); // If it's an integer, return it as a string
    } else {
        // Otherwise, round it to two decimal places
        return value.toFixed(2).replace(/\.?0+$/, ''); // Remove trailing zeroes
    }
}
export function sumValues(list) {
    const total = list.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);
    return total

}
export function setParams(filterParams) {
    let total = '&'
    filterParams.forEach(params => {
        if (params[1] != undefined) {
            total += params[0] + "=" + params[1] + "&"
        }
    })
    return total.slice(0, -1)
}

export const moduleList = [
    { key: "bancos", value: "banco" },
    { key: "cabimentacaos", value: "cabimentacao" },
    { key: "casosuspeito", value: "caso suspeito" },
    { key: "contrapartidaentidade", value: "contrapartida de entidade" },
    { key: "contrapartidapagamentos", value: "pagamentos de contrapartida" },
    { key: "contrapartidaparamentizados", value: "paramentizado de contrapartida" },
    { key: "contrapartidas", value: "contrapartida" },
    { key: "contribuicoes", value: "contribuições" },
    { key: "divisa", value: "divisa" },
    { key: "glbgeografia", value: "geografia" },
    { key: "glbmenu", value: "menu" },
    { key: "glbnotificacao", value: "notificacao" },
    { key: "glbperfil", value: "perfil" },
    { key: "glbperfilmenu", value: "menu de perfil" },
    { key: "glbpredefinicao", value: "predefinicao" },
    { key: "glbuser", value: "utilizador" },
    { key: "impostoparametrizados", value: "parametrizações de imposto" },
    { key: "impostos", value: "impostos" },
    { key: "interveniente", value: "interveniente" },
    { key: "meiopagamentos", value: "meio de pagamentos" },
    { key: "modalidadepagamento", value: "modalidade de pagamento" },
    { key: "orcamentos", value: "orcamentos" },
    { key: "pagamentoscontribuicoes", value: "pagamento de scontribuicoes" },
    { key: "pagamentosimpostos", value: "pagamentos de impostos" },
    { key: "premios", value: "premios" },
    { key: "projetos", value: "projetos" },
    { key: "rubricas", value: "rubricas" },
    { key: "sgigjdespachofinal", value: "despacho final" },
    { key: "sgigjdespachointerrompido", value: "despacho interrompido" },
    { key: "sgigjentidade", value: "entidade" },
    { key: "sgigjentidadebanca", value: "banca da entidade" },
    { key: "sgigjentidadeequipamento", value: "equipamento da entidade" },
    { key: "sgigjentidadeevento", value: "evento da entidade" },
    { key: "sgigjentidadegrupo", value: "grupo de entidade" },
    { key: "sgigjentidademaquina", value: "maquina da entidade" },
    { key: "sgigjexclusaoreclamacao", value: "reclamacao da exclusao" },
    { key: "sgigjhandpay", value: "handpay" },
    { key: "sgigjinfracaocoima", value: "coima da infracao" },
    { key: "sgigjpessoa", value: "pessoa" },
    { key: "sgigjprbancatp", value: "tipo de banca" },
    { key: "sgigjprcategoriaprofissional", value: "profissional de categoria" },
    { key: "sgigjprcontactotp", value: "tipo de contacto" },
    { key: "sgigjprdecisaotp", value: "tipo de decisao" },
    { key: "sgigjprdocumentotp", value: "tipo de documento" },
    { key: "sgigjprentidadetp", value: "tipo de entidade" },
    { key: "sgigjprequipamentoclassificacao", value: "classificacao de equipamento" },
    { key: "sgigjprequipamentotp", value: "tipo de equipamento" },
    { key: "sgigjprestadocivil", value: "estado civil" },
    { key: "sgigjpreventotp", value: "tipo de evento" },
    { key: "sgigjprexclusaoperiodo", value: "periodo de exclusao" },
    { key: "sgigjprgenero", value: "genero" },
    { key: "sgigjprinfracaotp", value: "tipo de infracao" },
    { key: "sgigjprlingua", value: "tipo de lingua" },
    { key: "sgigjprmaquinatp", value: "tipo de maquina" },
    { key: "sgigjprmotivoesclusaotp", value: "tipo de motivo de esclusao" },
    { key: "sgigjprnivelescolaridade", value: "nivel de escolaridade" },
    { key: "sgigjprnivellinguistico", value: "nivel de linguistico" },
    { key: "sgigjprocessoautoexclusao", value: "processo da autoexclusao" },
    { key: "sgigjprocessodespacho", value: "processo de despacho" },
    { key: "sgigjprocessodespachofinal", value: "processo de despacho final" },
    { key: "sgigjprocessoexclusao", value: "processo de exclusao" },
    { key: "sgigjprorigemtp", value: "tipo de origem" },
    { key: "sgigjprpecasprocessual", value: "pecas processual" },
    { key: "sgigjprprofissao", value: "profissao" },
    { key: "sgigjprstatus", value: "estado" },
    { key: "sgigjprtipologia", value: "tipologia" },
    { key: "sgigjrelcontacto", value: "contacto" },
    { key: "sgigjrelcontraordenacaoinfracao", value: "contra ordenacao infracao" },
    { key: "sgigjreldocumento", value: "documento" },
    { key: "sgigjrelenteventodecisao", value: "evento de decisao" },
    { key: "sgigjreleventodespacho", value: "evento de despacho" },
]
