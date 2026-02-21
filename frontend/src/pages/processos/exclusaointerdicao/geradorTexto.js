

import { convertDateToPT } from '../../../functions';



export function geradorTextoDespacho ( user, itemSelected, REFERENCIA_D, dataagora, INSTRUTOR, pessoalist, tipo_pedido) {

             return`


                 <p style="margin: 0; font-family: 'Times New Roman', serif; text-align: center;"><b><span style="font-size: 16pt; font-family: 'Times New Roman', serif;">DESPACHO N.º ${REFERENCIA_D}/${convertDateToPT(dataagora)?.ano}</span></b></p>

                 <p style="margin: 0; font-family: 'Times New Roman', serif; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif;">&nbsp;</span></p>

                 <p style="margin: 0; font-family: 'Times New Roman', serif; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif;">&nbsp;</span></p>

                 <p style="margin: 0; font-family: 'Times New Roman', serif; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif;">&nbsp;</span></p>



                    <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">Tendo a IGJ recebido a ${convertDateToPT(itemSelected?.DATA)?.dia} de ${convertDateToPT(itemSelected?.DATA)?.mes} de ${convertDateToPT(itemSelected?.DATA)?.ano},
                        do concessionário Casino Royal, via correio eletrónico, comunicado, cuja cópia
                        se anexa, </span><span style="font-size: 12pt; font-family: 'Times New Roman', serif;">de
                        que procederam à ………… do frequentador, <b>Sr(a).
                            ${itemSelected?.sgigjpessoa?.NOME}</b>, de nacionalidade
                            ${itemSelected?.sgigjpessoa?.nacionalidade?.NACIONALIDADE?.toLowerCase()}, por alegada má conduta, insulto a uma
                        jogadora, 2 "dealers" e alegada grosseria para com o PCA do casino e seguranças.</span></p>

                    <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">&nbsp;</span></p>

                    <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">Considerando ainda a comunicação, datada
                            do mesmo dia, ou seja, … de …………., via email, da Unidade de Serviço da IGJ no
                            casino, sobre o mesmo assunto, referenciado no parágrafo anterior, cuja cópia
                            se anexa;</span></p>

                    <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">&nbsp;</span></p>

                    <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">No uso da faculdade conferida pelo n.º 9
                            do artigo 63.º da Lei n.º 62/VII/2010, de 31 de maio, que altera a Lei n.º
                            77/VII/2005 de 16 de agosto, que estabelece o Regime Jurídico da Exploração de
                            Jogos de Fortuna ou Azar;</span></p>

                    <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">&nbsp;</span></p>

                    <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">Determino:</span></p>

                    <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">&nbsp;</span></p>

                    <p style="margin: 0 0 8px 0.5in; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; text-indent: -0.25in; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">1.&nbsp;&nbsp;&nbsp; Um(a)
                            ${tipo_pedido == "D"?"Decisão": tipo_pedido == "C"?"Contraordenação": tipo_pedido == "I"?"Inquerito":"Averiguação Sumária"} para apurar a veracidade dos factos apresentados pela
                            comunicação do chefe de sala do Casino Royal;</span></p>

                    <p style="margin: 0 0 8px 0.5in; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">&nbsp;</span></p>

                    <p style="margin: 0 0 8px 0.5in; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; text-indent: -0.25in; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">2.&nbsp;&nbsp;&nbsp; A/o Inspetora/a ${pessoalist.map( p => (

                        p?.ID==INSTRUTOR?p?.NOME:null

                    )).join('')} como
                            instrutora/o do Processo de Averiguação;</span></p>

                    <p style="margin: 0 0 0 0.5in; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">&nbsp;</span></p>

                    <p style="margin: 0 0 8px 0.5in; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; text-indent: -0.25in; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">3.&nbsp;&nbsp;&nbsp; Ouvir ambas as partes;</span></p>

                    <p style="margin: 0 0 0 0.5in; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">&nbsp;</span></p>

                    <p style="margin: 0 0 8px 0.5in; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: justify; text-indent: -0.25in; line-height: 1.6;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif; color: black;">4.&nbsp;&nbsp;&nbsp; Apresentar ao IGJ uma proposta de decisão.</span></p>



                <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">&nbsp;</p>

                <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif;">CUMPRA-SE.</span></p>

                <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">&nbsp;</p>

                 <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif;">Praia, ${convertDateToPT(dataagora)?.dia} de ${convertDateToPT(dataagora)?.mes} de ${convertDateToPT(dataagora)?.ano}</span></p>

                 <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">&nbsp;</p>

                 <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">&nbsp;</p>

                 <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">&nbsp;</p>

                 <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">&nbsp;</p>

                 <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: center;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif;">O(a) Inspetor(a) Geral</span></p>

                 <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: center;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif;">________________________________</span></p>

                 <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">&nbsp;</p>

                 <p style="margin: 0; font-family: 'Times New Roman', serif; font-size: 12pt; text-align: center;"><span style="font-size: 12pt; font-family: 'Times New Roman', serif;">${user?.sgigjrelpessoaentidade?.sgigjpessoa?.NOME}</span></p>


             `




};
