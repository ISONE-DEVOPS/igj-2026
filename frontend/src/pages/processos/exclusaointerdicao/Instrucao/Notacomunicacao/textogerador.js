

import { convertDateToNormal } from '../../../../../functions';


const dataagora = new Date().toISOString().slice(0, 10);


export function visado( assinante, data, instrucaoitem ){


        

        
    
console.log(instrucaoitem)

    return  `
    <p class="MsoNormal" align="right" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: right; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">Exmo. Senhor</span></p>

    <p class="MsoNormal" align="right" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: right; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">${instrucaoitem?.PESSOA}</span></p>
    
    <p class="MsoNormal" align="right" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: right; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">PRAIA</span></p>
    
    <p class="MsoNormal" align="right" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: right; line-height: 115%;"><span style="font-size: 16px; line-height: 115%; font-family: Cambria, serif;">&nbsp;</span></p>
    
    <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Referência Nº:
            ${instrucaoitem?.sgigjprocessodespacho[0]?.REFERENCIA} Processo Nº ${instrucaoitem?.CODIGO}/${convertDateToNormal(instrucaoitem?.DATA)?.mes}-${convertDateToNormal(instrucaoitem?.DATA)?.ano}</span></p>
    
    <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Data:
    ${convertDateToNormal(data)?.dia}-${convertDateToNormal(data)?.mes}-${convertDateToNormal(data)?.ano}</span></p>
    
    <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
    
    <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">ASSUNTO: Início
            da instrução do processo.</span></p>
    
    <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
    
    <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Para os devidos
            efeitos, levo ao conhecimento de V. Exa. que hoje, dia ${convertDateToNormal(dataagora)?.dia}-${convertDateToNormal(dataagora)?.mes}-${convertDateToNormal(dataagora)?.ano}, dei início a
            instrução do processo Nº ${instrucaoitem?.CODIGO}/${convertDateToNormal(instrucaoitem?.DATA)?.mes}-${convertDateToNormal(instrucaoitem?.DATA)?.ano}, supra indicado, mandado instaurar
            contra si, por despacho de ${convertDateToNormal(instrucaoitem?.sgigjprocessodespacho[0]?.DATA)?.dia}-${convertDateToNormal(instrucaoitem?.sgigjprocessodespacho[0]?.DATA)?.mes}-${convertDateToNormal(instrucaoitem?.sgigjprocessodespacho[0]?.DATA)?.ano}, no qual fui nomeado instrutor,</span></p>
    
    <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
    
    <p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Com os melhores cumprimentos.</span></p>
    
    <p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
    
    <p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">O(a) Inspetor(a)</span></p>
    
    <p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">______________________</span></p>
    
    <p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">${assinante}</span></p>

    `


} 




export function entidadedecisora( assinante, data, instrucaoitem ){


    return  `
        <p class="MsoNormal" align="right" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: right; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">Exmo. Senhor</span></p>

        <p class="MsoNormal" align="right" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: right; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">${instrucaoitem?.sgigjrelpessoaentidade?.sgigjentidade?.DESIG}</span></p>

        <p class="MsoNormal" align="right" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: right; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">PRAIA</span></p>

        <p class="MsoNormal" align="right" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: right; line-height: 115%;"><span style="font-size: 16px; line-height: 115%; font-family: Cambria, serif;">&nbsp;</span></p>

        <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Referência Nº:
                ${instrucaoitem?.sgigjprocessodespacho[0]?.REFERENCIA} Processo Nº ${instrucaoitem?.CODIGO}/${convertDateToNormal(instrucaoitem?.DATA)?.mes}-${convertDateToNormal(instrucaoitem?.DATA)?.ano}</span></p>

        <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Data:
        ${convertDateToNormal(data)?.dia}-${convertDateToNormal(data)?.mes}-${convertDateToNormal(data)?.ano}</span></p>

        <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>

        <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">ASSUNTO: Início
                da instrução do processo.</span></p>

        <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>

        <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Para os devidos
                efeitos, levo ao conhecimento de V. Exa. que hoje, dia ${convertDateToNormal(dataagora)?.dia}-${convertDateToNormal(dataagora)?.mes}-${convertDateToNormal(dataagora)?.ano}, dei início a
                instrução do processo Nº ${instrucaoitem?.CODIGO}/${convertDateToNormal(instrucaoitem?.DATA)?.mes}-${convertDateToNormal(instrucaoitem?.DATA)?.ano}, supra indicado, mandado instaurar
                contra ${instrucaoitem?.PESSOA}, por despacho de ${convertDateToNormal(instrucaoitem?.sgigjprocessodespacho[0]?.DATA)?.dia}-${convertDateToNormal(instrucaoitem?.sgigjprocessodespacho[0]?.DATA)?.mes}-${convertDateToNormal(instrucaoitem?.sgigjprocessodespacho[0]?.DATA)?.ano}, no qual fui nomeado
                instrutor,</span></p>

        <p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>

        <p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Com os melhores cumprimentos.</span></p>

        <p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>

        <p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">O(a) Inspetor(a)</span></p>

        <p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">______________________</span></p>

        <p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">${assinante}</span></p>

    `


} 



export function entidadevisada( assinante, data, instrucaoitem ){


    return  `
      
    <p class="MsoNormal" align="right" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: right; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">Exmo. Senhor</span></p>

<p class="MsoNormal" align="right" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: right; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">Entidade Visada</span></p>

<p class="MsoNormal" align="right" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: right; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">PRAIA</span></p>

<p class="MsoNormal" align="right" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: right; line-height: 115%;"><span style="font-size: 16px; line-height: 115%; font-family: Cambria, serif;">&nbsp;</span></p>

<p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Referência Nº:
        ${instrucaoitem?.sgigjprocessodespacho[0]?.REFERENCIA} Processo Nº ${instrucaoitem?.CODIGO}/${convertDateToNormal(instrucaoitem?.DATA)?.mes}-${convertDateToNormal(instrucaoitem?.DATA)?.ano}</span></p>

<p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Data:
${convertDateToNormal(data)?.dia}-${convertDateToNormal(data)?.mes}-${convertDateToNormal(data)?.ano}</span></p>

<p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>

<p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">ASSUNTO: Início
        da instrução do processo.</span></p>

<p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>

<p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Para os devidos
        efeitos, levo ao conhecimento de V. Exa. que hoje, dia ${convertDateToNormal(dataagora)?.dia}-${convertDateToNormal(dataagora)?.mes}-${convertDateToNormal(dataagora)?.ano}, dei início a
        instrução do processo Nº ${instrucaoitem?.CODIGO}/${convertDateToNormal(instrucaoitem?.DATA)?.mes}-${convertDateToNormal(instrucaoitem?.DATA)?.ano}, supra indicado, mandado instaurar contra
        essa empresa concessionária (ou F.O, quando se tratar de empregado do
        concessionário ou frequentador do casino), por despacho de ${convertDateToNormal(instrucaoitem?.sgigjprocessodespacho[0]?.DATA)?.dia}-${convertDateToNormal(instrucaoitem?.sgigjprocessodespacho[0]?.DATA)?.mes}-${convertDateToNormal(instrucaoitem?.sgigjprocessodespacho[0]?.DATA)?.ano}, no qual
        fui nomeado instrutor,</span></p>

<p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>

<p class="MsoNormal" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Solicita-se a
        V. Exa. se digne mandar notificar o trabalhador juntando-se em anexo e para o
        efeito, duplicado do presente oficio e termo de notificação que deve ser
        devolvido devidamene datado e assinado (parágrafo a acrescentar quando se
        tratar de empregado do concessionário).</span></p>

<p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">Com os melhores cumprimentos.</span></p>

<p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>

<p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">O(a) Inspetor(a)</span></p>

<p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">______________________</span></p>

<p class="MsoNormal" align="center" style="margin: 0in; font-size: 15px; font-family: Calibri, sans-serif; text-align: center; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif;">${assinante}</span></p>

    `


} 