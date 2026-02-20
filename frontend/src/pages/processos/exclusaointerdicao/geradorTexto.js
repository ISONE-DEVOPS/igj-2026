

import { convertDateToPT } from '../../../functions';



export function geradorTextoDespacho ( user, itemSelected, REFERENCIA_D, dataagora, INSTRUTOR, pessoalist, tipo_pedido) {

debugger

             return`
             

                 <p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;"><b style="mso-bidi-font-weight:normal"><span style="font-size: 32px; font-family: &quot;Times New Roman&quot;, serif;">DESPACHO N.º ${REFERENCIA_D}/${convertDateToPT(dataagora)?.ano}</span></b></p>

                 <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                 
                 <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                 
                 <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                 
                 <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 14px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                 

                    
                    <p class="MsoNormal" style="margin: 0in; font-size: 16px; font-family: Cambria, serif; text-align: justify; line-height: 24px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;">Tendo a IGJ recebido a ${convertDateToPT(itemSelected?.DATA)?.dia} de ${convertDateToPT(itemSelected?.DATA)?.mes} de ${convertDateToPT(itemSelected?.DATA)?.ano},
                        do concessionário Casino Royal, via correio eletrónico, comunicado, cuja cópia
                        se anexa, </span><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">de
                        que procederam à ………… do frequentador, <b>Sr(a).
                            ${itemSelected?.sgigjpessoa?.NOME}</b>, de nacionalidade
                            ${itemSelected?.sgigjpessoa?.nacionalidade?.NACIONALIDADE?.toLowerCase()}, por alegada má conduta, insulto a uma
                        jogadora, 2 “dealers” e alegada grosseria para com o PCA do casino e seguranças.</span></p>

                    <p class="MsoNormal" style="margin: 0in; font-size: 16px; font-family: Cambria, serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">&nbsp;</span></p>

                    <p class="MsoNormal" style="margin: 0in; font-size: 16px; font-family: Cambria, serif; text-align: justify; line-height: 24px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;">Considerando ainda a comunicação, datada
                            do mesmo dia, ou seja, … de …………., via email, da Unidade de Serviço da IGJ no
                            casino, sobre o mesmo assunto, referenciado no parágrafo anterior, cuja cópia
                            se anexa;</span></p>

                    <p class="MsoNormal" style="margin: 0in; font-size: 16px; font-family: Cambria, serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">&nbsp;</span></p>

                    <p class="MsoNormal" style="margin: 0in; font-size: 16px; font-family: Cambria, serif; text-align: justify; line-height: 24px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;">No uso da faculdade conferida pelo n.º 9
                            do artigo 63.º da Lei n.º 62/VII/2010, de 31 de maio, que altera a Lei n.º
                            77/VII/2005 de 16 de agosto, que estabelece o Regime Jurídico da Exploração de
                            Jogos de Fortuna ou Azar;</span></p>

                    <p class="MsoNormal" style="margin: 0in; font-size: 16px; font-family: Cambria, serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">&nbsp;</span></p>

                    <p class="MsoNormal" style="margin: 0in; font-size: 16px; font-family: Cambria, serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">Determino:</span></p>

                    <p class="MsoNormal" style="margin: 0in; font-size: 16px; font-family: Cambria, serif; text-align: justify; line-height: 115%;"><span style="font-size: 21px; line-height: 115%; font-family: &quot;Times New Roman&quot;, serif; color: black;">&nbsp;</span></p>

                    <p class="MsoListParagraphCxSpFirst" style="margin: 0in 0in 8px 0.5in; font-size: 16px; font-family: Cambria, serif; text-align: justify; text-indent: -0.25in; line-height: 24px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;"><span style="mso-list:Ignore">1.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;
                                </span></span></span><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;"> Um(a)
                            ${tipo_pedido == "D"?"Decisão": tipo_pedido == "C"?"Contraordenação": tipo_pedido == "I"?"Inquerito":"Averiguação Sumária"} para apurar a veracidade dos factos apresentados pela
                            comunicação do chefe de sala do Casino Royal;</span></p>

                    <p class="MsoListParagraphCxSpMiddle" style="margin: 0in 0in 8px 0.5in; font-size: 16px; font-family: Cambria, serif; text-align: justify; line-height: 24px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;">&nbsp;</span></p>

                    <p class="MsoListParagraphCxSpMiddle" style="margin: 0in 0in 8px 0.5in; font-size: 16px; font-family: Cambria, serif; text-align: justify; text-indent: -0.25in;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;"><span style="mso-list:Ignore">2.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp; </span></span></span><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;">A/o Inspetora/a ${pessoalist.map( p => (

                        p?.ID==INSTRUTOR?p?.NOME:null

                    )).join('')} como
                            instrutora/o do Processo de Averiguação;</span></p>

                    <p class="MsoListParagraphCxSpMiddle" style="margin: 0in 0in 0in 0.5in; font-size: 16px; font-family: Cambria, serif; text-align: justify;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;">&nbsp;</span></p>

                    <p class="MsoListParagraphCxSpMiddle" style="margin: 0in 0in 8px 0.5in; font-size: 16px; font-family: Cambria, serif; text-align: justify; text-indent: -0.25in;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;"><span style="mso-list:Ignore">3.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp; </span></span></span><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;">Ouvir ambas as partes;</span></p>

                    <p class="MsoListParagraphCxSpMiddle" style="margin: 0in 0in 0in 0.5in; font-size: 16px; font-family: Cambria, serif; text-align: justify;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;">&nbsp;</span><br></p>

                    <p class="MsoListParagraphCxSpLast" style="margin: 0in 0in 8px 0.5in; font-size: 16px; font-family: Cambria, serif; text-align: justify; text-indent: -0.25in;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;"><span style="mso-list:Ignore">4.<span style="font: 9px &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp; </span></span></span><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif; color: black;">Apresentar ao IGJ uma proposta de decisão.</span></p>



                <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 19px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                
                <p class="MsoNormal" style="margin: 0in 0in 0in 17px; font-size: 13px; font-family: Calibri, sans-serif;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">CUMPRA-SE.</span></p>
                
                <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 12px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                 
                 <p class="MsoNormal" style="margin: 0in 0in 0in 17px; font-size: 13px; font-family: Calibri, sans-serif;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">Praia, ${convertDateToPT(dataagora)?.dia} de ${convertDateToPT(dataagora)?.mes} de ${convertDateToPT(dataagora)?.ano}</span></p>
                 
                 <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                 
                 <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                 
                 <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                 
                 <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 13px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                 
                 <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 20px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                 
                 <p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">O(a) Inspetor(a) Geral</span></p>
                 
                 <p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">________________________________</span></p>
                 
                 <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 12px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                 
                 <p class="MsoNormal" style="margin: 0in; font-size: 13px; font-family: Calibri, sans-serif; line-height: 12px;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">&nbsp;</span></p>
                 
                 <p class="MsoNormal" align="center" style="margin: 0in 0px 0in 0in; font-size: 13px; font-family: Calibri, sans-serif; text-align: center;"><span style="font-size: 21px; font-family: &quot;Times New Roman&quot;, serif;">${user?.sgigjrelpessoaentidade?.sgigjpessoa?.NOME}</span></p>
                 
             
             `


        
    
};
 