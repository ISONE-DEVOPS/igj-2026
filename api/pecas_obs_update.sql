-- ============================================================
-- PEÇAS PROCESSUAIS - Atualizar OBS com templates dos documentos
-- Baseado no PDF Peças-Processuais.pdf (Modelos 1-41)
-- ============================================================

SET NAMES utf8mb4;

-- Adicionar MODELO 5 (ANEXO 5) que faltava: Notificação Pessoal de Início da Instrução
INSERT IGNORE INTO sgigjprpecasprocessual (ID, CODIGO, DESIG, OBS, ESTADO, DT_REGISTO)
VALUES (LEFT(SHA1('peca_modelo_05'), 36), '00046', 'Notificação Pessoal de Início da Instrução', NULL, '1', NOW());

-- MODELO 1: Auto de Notícia
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>AUTO DE NOTÍCIA</strong></p>
<p>Aos ________ dias do mês de ______ do ano de dois mil e ______, no _______ (identificação do serviço ou entidade)_________, sito em __________(localidade)_______, no seguimento de ____________(diligência, circunstância ocasional ou denúncia)_________, tomei conhecimento e por esta via dou notícia do seguinte:</p>
<p>____________________(descrição detalhada dos factos com menção dos fatores tempo, modo e lugar das ocorrências)_______________________________________________________________________________</p>
<p>Com os ditos procedimentos os __________(autores)_________________ incorrem em infração por violação do ___________(enquadramento legal)____________________.</p>
<p>É quanto me cumpre dar notícia e para os devidos e lagais efeitos se lavrou o presente auto.</p>
<p>A Testemunha: (nome legível/n.º do documento de identificação) _____________________________</p>
<p>A Testemunha: (nome legível/n.º do documento de identificação) _____________________________</p>
<p>O ______(denunciante)______ :________________________________________________________________________</p>' WHERE CODIGO = '00001';

-- MODELO 2: Capa de Processo
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>CAPA DE PROCESSO</strong></p>
<p>Processo n.º ___________/______ -_____</p>
<p><strong>PROCESSO</strong> (identificar o tipo de processo)</p>
<p>Trabalhador/a: (nome e categoria profissional)_____________________________________________________________</p>
<p>Entidade/Serviço: _____________________________________________________________________________________________</p>
<p>Objeto: ___________________________________________________________________________________________________________</p>
<p>Mandatário do/a trabalhador/a: ____________________________________________________________________________</p>
<p>Instrutor/a: _________________________________________________________</p>
<p>Secretário/a: ________________________________________________________</p>
<p>Data da instauração/avocação: …./… /... &nbsp;&nbsp;&nbsp; Data da decisão: …./… /…</p>
<p>Observações: (designadamente n.º de volumes/processos apensos)</p>' WHERE CODIGO = '00002';

-- MODELO 3a: Termo de Abertura
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>TERMO DE ABERTURA</strong></p>
<p>Proc. nº _____/____-____</p>
<p>Aos _______ dias do mês de __________ do ano de dois mil e ________ procede-se à abertura do volume ___________ do processo, com fls. __________.</p>
<p>O/A Instrutor/a: ____________________________________________________________________________________</p>' WHERE CODIGO = '00003';

-- MODELO 3b: Termo de Encerramento
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>TERMO DE ENCERRAMENTO</strong></p>
<p>Proc. nº _____/____-____</p>
<p>Aos ________ dias do mês de ___________ do ano de dois mil e ______________ procede-se ao encerramento do volume do processo, de fls. _______ a _______ e segue volume que se inicia a fls. ______ .</p>
<p>O/A Instrutor/a: ______________________________________________________________________________________</p>' WHERE CODIGO = '00004';

-- MODELO 4: Comunicação de Início da Instrução à Entidade Decisora
UPDATE sgigjprpecasprocessual SET OBS = '<p>Exmo. Senhor</p>
<p>(Comunicação de início da instrução à entidade que nomeou o instrutor)</p>
<p>S/ Referência: ______________ &nbsp; Processo Nº _____/____-_____ &nbsp; N/ Referência: _______________</p>
<p>Data: ____/_____/_______ &nbsp; Data: ____/_____/______</p>
<p><strong>ASSUNTO:</strong> Início da instrução do processo.</p>
<p>Para os devidos efeitos, levo ao conhecimento de V. Exa. que hoje, dia ____________, dei início a instrução do processo nº _____/____-____, supra indicado, mandado instaurar contra ___________________________, por despacho de ____/_____/_______, no qual fui nomeado instrutor.</p>
<p>Com os melhores cumprimentos.</p>
<p>O Instrutor</p>
<p>___________________________________</p>' WHERE CODIGO = '00005';

-- MODELO 5: Notificação Pessoal de Início da Instrução
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>TERMO DE NOTIFICAÇÃO</strong></p>
<p>Aos _______ dias do mês de __________ do ano de dois mil e ________ entreguei a _(nome e categoria profissional do visado)_________ o termo de notificação do inicio da instrução do processo nº _____/____-____ contra si instaurado.</p>
<p>Disse que de tudo ficou ciente e comigo vai assinar.</p>
<p>O notificado: ____________________________________________________________________________________</p>
<p>O notificante: ___________________________________________________________________________________</p>
<hr/>
<p style="text-align: center;"><strong>CERTIDÃO NEGATIVA</strong></p>
<p>Aos ________ dias do mês de ___________ do ano de dois mil e ______________, certifico que _(nome e categoria profissional do visado)_________ se recusou a receber a notificação de inicio do processo nº _____/____-____, contra si instaurado.</p>
<p>Por ser verdade vai a presente certidão ser assinada por ______________________________ e por mim, notificante.</p>
<p>A testemunha: _(nome e número do doc. de identificação)_______________________________</p>
<p>O notificante: ________________________________________________________________________________</p>' WHERE CODIGO = '00046';

-- MODELO 6: Comunicação de Início da Instrução ao Visado
UPDATE sgigjprpecasprocessual SET OBS = '<p>Exmo. Senhor</p>
<p>(Comunicação de início da instrução à entidade visada)</p>
<p>S/ Referência: ______________ &nbsp; Processo Nº _____/____-_____ &nbsp; N/ Referência: _______________</p>
<p>Data: ____/_____/_______ &nbsp; Data: ____/_____/______</p>
<p><strong>ASSUNTO:</strong> Início da instrução do processo.</p>
<p>Para os devidos efeitos, levo ao conhecimento de V. Exa. que hoje, dia ____________, dei início a instrução do processo nº _____/____-____, supra indicado, mandado instaurar contra essa empresa concessionária (ou F. ___________________________, quando se tratar de empregado do concessionário ou frequentador do casino), por despacho de ____/_____/_______, no qual fui nomeado instrutor.</p>
<p>Solicita-se a V. Exa. se digne mandar notificar o trabalhador juntando-se em anexo e para o efeito, duplicado do presente oficio e termo de notificação que deve ser devolvido devidamente datado e assinado (parágrafo a acrescentar quando se tratar de empregado do concessionário).</p>
<p>Com os melhores cumprimentos.</p>
<p>O Instrutor</p>
<p>___________________________________</p>' WHERE CODIGO = '00006';

-- MODELO 7: Acusação
UPDATE sgigjprpecasprocessual SET OBS = '<p>Processo n.º ___________/______ -_____</p>
<p>Empresa/Trabalhador/frequentador: (nome, categoria, etc)</p>
<p style="text-align: center;"><strong>TERMO DE ACUSAÇÃO</strong></p>
<p>Nos termos do Artigo ______º, da Lei n.º _______________, de ____________________, no Processo n.º _______/____-_____, instaurado por despacho de _____(data e entidade que instaurou o processo)______________, deduz-se acusação/nota de culpa/nota de responsabilização contra:</p>
<p>_____(nome e demais elementos de identificação da pessoa ou entidade visada)__________________________, nos termos e com os seguintes fundamentos:</p>
<p><strong>1º</strong><br/>Descrição articulada dos factos, quanto ao modo, lugar, tempo e circunstâncias em que os mesmos foram praticados.</p>
<p><strong>2º</strong><br/>Descrição de condutas/procedimentos, se agiu livre, deliberada e conscientemente, bem sabendo que os atos voluntária e conscientemente praticados são passíveis de censura.</p>
<p><strong>3º</strong><br/>Identificação de todas as circunstâncias atenuantes e agravantes apuradas.</p>
<p><strong>4º</strong><br/>Identificação da infração/infrações praticadas e da sanção/sanções correspondente(s).</p>
<p>Mais se notifica, pelo presente termo, que:</p>
<p>Nos termos do Artigo _____º, da Lei n.º _______________, de ____________________, fixo o prazo de ______ dias, contados a partir do dia seguinte ao da notificação do presente despacho de acusação, para, querendo, apresentar defesa escrita e articulada.</p>
<p>____________________, ___ de ___________ de 20___</p>
<p>O Instrutor: ___________________________________________________</p>' WHERE CODIGO = '00007';

-- MODELO 8: Notificação Pessoal da Acusação
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>TERMO DE NOTIFICAÇÃO</strong></p>
<p>Aos _______ dias do mês de __________ do ano de dois mil e ________ entreguei a ____(nome e cargo de representação se o visado for concessionário, nome e categoria profissional se for empregado do casino, identificação civil se for frequentador do casino)_________ fotocópia certificada do despacho de acusação deduzido contra ____(concessionário)_______ (ou contra si - se for trabalhador ou frequentador do casino), no processo nº _____/______-_____.</p>
<p>Do mesmo tomou conhecimento e comigo, notificante, vai assinar.</p>
<p>O notificado: ____________________________________________________________________________________</p>
<p>O notificante: ___________________________________________________________________________________</p>
<hr/>
<p style="text-align: center;"><strong>CERTIDÃO NEGATIVA</strong></p>
<p>Aos ________ dias do mês de ___________ do ano de dois mil e ______________, certifico que não pude levar a efeito a notificação de ______(identificar o visado) _________, do despacho de acusação deduzida contra si no processo nº _____/____-____, em virtude de o mesmo se haver recusado a receber a presente notificação.</p>
<p>Por ser verdade, vai a presente certidão ser assinada pelas testemunhas e por mim, notificante.</p>
<p>A testemunha: _(nome e número do doc. de identificação)_______________________________</p>
<p>A testemunha: _(nome e número do doc. de identificação)_______________________________</p>
<p>O notificante: ________________________________________________________________________________</p>' WHERE CODIGO = '00008';

-- Certidão Negativa (genérica)
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>CERTIDÃO NEGATIVA</strong></p>
<p>Aos ________ dias do mês de ___________ do ano de dois mil e ______________, certifico que não pude levar a efeito a notificação de ______(identificar o visado) _________, em virtude de o mesmo se haver recusado a receber a presente notificação.</p>
<p>Por ser verdade, vai a presente certidão ser assinada pelas testemunhas e por mim, notificante.</p>
<p>A testemunha: _(nome e número do doc. de identificação)_______________________________</p>
<p>A testemunha: _(nome e número do doc. de identificação)_______________________________</p>
<p>O notificante: ________________________________________________________________________________</p>' WHERE CODIGO = '00009';

-- MODELO 9: Notificação Postal da Acusação
UPDATE sgigjprpecasprocessual SET OBS = '<p><em>Confidencial</em><br/><em>Correio registado c/ aviso de recepção</em></p>
<p>Exmo. Senhor<br/>(Notificação ao visado do teor do despacho de acusação)</p>
<p>S/ Referência: ______________ &nbsp; Processo Nº _____/____-_____ &nbsp; N/ Referência: _______________</p>
<p>Data: ____/_____/_______ &nbsp; Data: ____/_____/______</p>
<p><strong>ASSUNTO:</strong> Notificação - Acusação.</p>
<p>Para os devidos efeitos, notifico V. Exa. do teor da acusação deduzida contra a ___(se o visado for concessionária)____ (ou - deduzida contra si - se se tratar de empregado da concessionária ou de frequentador do casino) no âmbito do processo supra-indicado, da qual se anexa cópia, podendo, se for do seu interesse, apresentar defesa escrita, por si ou por advogado legalmente constituído, no prazo de _______ dias úteis, a contar da presente notificação.</p>
<p>Deve, para tanto, ter em conta que:</p>
<ul>
<li>À contagem os prazos é aplicável o Artigo ____º da Lei nº _____/_______, de _________________.</li>
<li>O documento de defesa deverá ser enviado para ___(lugar onde foi instaurado o processo)____;</li>
<li>Com o documento de defesa pode indicar rol de testemunhas, não podendo ser ouvidas mais do que três por cada facto;</li>
<li>Pode juntar documentos ou requerer a realização das diligências que achar convenientes para a descoberta da verdade material;</li>
<li>Durante o prazo para a apresentação da defesa, o processo pode ser consultado;</li>
<li>Pode ainda requerer a confiança do processo;</li>
<li>A não apresentação da defesa ou a sua apresentação fora do prazo valem como efectiva audiência para os legais efeitos.</li>
</ul>
<p>Com os melhores cumprimentos.</p>
<p>O Instrutor</p>
<p>___________________________________</p>' WHERE CODIGO = '00010';

-- MODELO 10: Notificação da Acusação por Publicação de Aviso
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>AVISO</strong></p>
<p>____(nome da entidade se o visado for concessionário, nome e categoria profissional se for empregado do casino, identificação civil se for frequentador do casino), com última morada conhecida ___________________________________________________________, fica desta forma notificado, de que se encontra pendente neste ____(local)____, o processo nº _____/____-____, no âmbito do qual lhe foi deduzido acusação, sendo-lhe concedido o prazo de ______ dias, a contar da data da publicação do presente aviso, para, querendo, apresentar defesa escrita, conforme previsto no Artigo ____º, da Lei nº __________/_____, de _______________________.</p>
<p>Data: _________________</p>
<p>Nome: _____________________________________________________________</p>
<p>Cargo: _____________________________________________________________</p>' WHERE CODIGO = '00011';

-- MODELO 11: Comunicação da Acusação ao Mandatário
UPDATE sgigjprpecasprocessual SET OBS = '<p><em>Confidencial</em><br/><em>Correio registado c/ aviso de recepção</em></p>
<p>Exmo. Senhor<br/>(Comunicação ao mandatário do visado do teor da acusação)</p>
<p>S/ Referência: ______________ &nbsp; Processo Nº _____/____-_____ &nbsp; N/ Referência: _______________</p>
<p>Data: ____/_____/_______ &nbsp; Data: ____/_____/______</p>
<p><strong>ASSUNTO:</strong> Comunicação do teor da acusação.</p>
<p>Para os devidos efeitos, junto remeto a V. Exa. fotocópia da acusação deduzida no âmbito do processo supra indicado contra a ___(se o visado for concessionária)____ (ou - deduzida contra F______- se se tratar de empregado da concessionária ou de frequentador do casino), bem como do ofício que lhe foi endereçado (ou, se for caso, do documento de notificação pessoal).</p>
<p>Com os melhores cumprimentos.</p>
<p>O Instrutor</p>
<p>___________________________________</p>' WHERE CODIGO = '00012';

-- MODELO 12: Auto de Diligências
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>AUTO DE DILIGÊNCIAS</strong></p>
<p>Aos ________ dias do mês de ______ do ano de dois mil e _______, pelas ____(horas)___, no ____________(identificação do serviço ou entidade)_________, sito em ___(localidade)________, no âmbito do processo n.º ______-_____, procede-se à realização das seguintes diligências:</p>
<p>_______(descrever as diligências de prova efetuadas)______________________________________________.</p>
<p>Verifica-se que ______(descrever toda a factualidade que tenha relevância para o processo, juntando toda a prova recolhida e considerada pertinente para a descoberta dos factos suscetíveis de integrarem a prática de infração)_________________________________________________.</p>
<p>O Instrutor: _______________________________________________</p>' WHERE CODIGO = '00013';

-- MODELO 13: Auto de Apreensão
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>AUTO DE APREENSÃO</strong></p>
<p>Aos ________ dias do mês de ______ do ano de dois mil e ___, no(a) (identificação do serviço ou entidade), sito (localidade), no âmbito do processo n.º ___/___-__, procede-se à apreensão de (identificar o objeto apreendido e quais circunstâncias consideradas pertinentes para a apreciação/valoração da prova).</p>
<p>A Testemunha: (nome legível/n.º do documento de identificação) _____________</p>
<p>A Testemunha: (nome legível/n.º do documento de identificação) _____________</p>
<p>O Instrutor: ______________________________________________________</p>' WHERE CODIGO = '00014';

-- MODELO 14: Cota
UPDATE sgigjprpecasprocessual SET OBS = '<p>Processo n.º ___________/______ -_____</p>
<p style="text-align: center;"><strong>COTA</strong></p>
<p>Aos ____ dias, do mês de ______ do ano de dois mil e _____, faço constar que: ____(descrever as informações/diligências e demais atos realizados, considerados relevantes para o processo e que não se encontram documentados)______________________________________________.</p>
<p>O/A Instrutor _______________________________________________</p>' WHERE CODIGO = '00015';

-- MODELO 15: Despacho de Apensação de Processo
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>DESPACHO DE APENSAÇÃO DE PROCESSO</strong></p>
<p>Proc. nº _____/____-____</p>
<p>Aos _______ dias do mês de __________ do ano de dois mil e ________ apensou-se aos presentes autos processo nº _____/____-____, constituído por ______ volumes e fls. __________.</p>
<p>O/A Instrutor/a: ____________________________________________________________________________________</p>
<p><em>(Nota: Na capa dos processos devem ser indicado os que se encontram apensos)</em></p>
<hr/>
<p style="text-align: center;"><strong>TERMO DE APENSAÇÃO</strong></p>
<p>Proc. nº _____/____-____</p>
<p>Aos ________ dias do mês de ___________ do ano de dois mil e ______________, em cumprimento do Despacho que antecede, apenso aos presentes autos o processo nº _____/____-____, constituído por fls. _______ e _______ volume(s).</p>
<p>O/A Instrutor/a: ______________________________________________________________________________________</p>' WHERE CODIGO = '00016';

-- MODELO 16: Convocatória de Participante ou Testemunha
UPDATE sgigjprpecasprocessual SET OBS = '<p>Exmo. Senhor<br/>(Convocatória de testemunha/participante de ocorrência)</p>
<p>S/ Referência: ______________ &nbsp; Processo Nº _____/____-_____ &nbsp; N/ Referência: _______________</p>
<p>Data: ____/_____/_______ &nbsp; Data: ____/_____/______</p>
<p><strong>ASSUNTO:</strong> Convocatória.</p>
<p>Para os devidos efeitos, fica V. Exa. convocado para comparecer no dia ____________, pelas ______ (horas) no __(local e endereço)_________________ a fim de prestar depoimento na condição de __(testemunha/participante)__________ no âmbito do processo nº _____/____-____, supra indicado.</p>
<p>Com os melhores cumprimentos.</p>
<p>O Instrutor</p>
<p>___________________________________</p>' WHERE CODIGO = '00017';

-- MODELO 17: Convocatória do Arguido
UPDATE sgigjprpecasprocessual SET OBS = '<p>Exmo. Senhor<br/>(Convocatória de arguído)</p>
<p>S/ Referência: ______________ &nbsp; Processo Nº _____/____-_____ &nbsp; N/ Referência: _______________</p>
<p>Data: ____/_____/_______ &nbsp; Data: ____/_____/______</p>
<p><strong>ASSUNTO:</strong> Convocatória.</p>
<p>Para os devidos efeitos, fica V. Exa. convocado para comparecer no dia ____________, pelas ______ (horas) no __(local e endereço)_________________ a fim de prestar depoimento na condição de __(arguído)__________ no âmbito do processo nº _____/____-____, supra indicado.</p>
<p>Fica, igualmente, notificado de que poderá, querendo, faze-se acompanhar de advogado legalmente constituído para o efeito.</p>
<p>Com os melhores cumprimentos.</p>
<p>O Instrutor</p>
<p>___________________________________</p>' WHERE CODIGO = '00018';

-- MODELO 18: Auto de Declarações
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>AUTO DE DECLARAÇÕES</strong></p>
<p>Aos ______ dias do mês de ______ do ano de dois mil e _______, pelas ___ (horas) no gabinete do(a) __(local e endereço)_________________, no âmbito do processo nº _____/_____-____, perante mim __(identificação do instrutor, nome e categoria profissional) _______________________________, compareceu _____(nome, idade, estado civil, documento de identificação e validade, profissão, local onde exerce funções e residência do declarante)____________________________________________ a fim de ser ouvido em declarações.</p>
<p>Ao ___(se o declarante for o arguído)_____ foi dado conhecimento prévio do objeto do processo, foi-lhe dado conhecimento sobre os direitos de defesa que lhe assistem, designadamente de constituir advogado em qualquer fase do processo, de requerer a realização de diligências instrutórias e da faculdade de, querendo, não responder à matéria dos autos.</p>
<p>(O declarante esclareceu que pretende prestar declarações, e sobre a matéria dos autos disse: ___________________________________________________________________________________________________)</p>
<p>(O declarante esclareceu que não pretende prestar declarações, pelo que se declara encerrado o presente auto.)</p>
<p>E mais não disse. Lido o seu depoimento, ratifica e vai pelos intervenientes ser assinado.</p>
<p>O Declarante: _________ &nbsp; O Advogado: ____________ &nbsp; O Instrutor: ____________</p>' WHERE CODIGO = '00019';

-- MODELO 19: Auto de Inquirição de Testemunha
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>AUTO DE INQUIRIÇÃO DE TESTEMUNHA</strong></p>
<p>Aos ______ dias do mês de ______ do ano de dois mil e _______, pelas ___ (horas) no gabinete do(a) __(local e endereço)_________________, no âmbito do processo nº _____/_____-____, perante mim __(identificação do instrutor, nome e categoria profissional) _______________________________, compareceu _____(nome, idade, estado civil, documento de identificação e validade, profissão, local onde exerce funções e residência do declarante)____________________________________________ a fim de ser ouvido como testemunha.</p>
<p>A testemunha foi alertada de que deve falar verdade e que não deve omitir factos de que tenha conhecimento que sejam relevantes para o processo e aos costumes disse ___(nada ou que é colega, amigo ou familiar mas que isso não impede de falar com verdade)____.</p>
<p>Questionada sobre ______________________________, a testemunha disse ____________________________.</p>
<p>E mais não disse. Lido o seu depoimento, o considerou, ratifica e vai pelos intervenientes ser assinado.</p>
<p>A Testemunha: _________ &nbsp; O Instrutor: ____________</p>' WHERE CODIGO = '00020';

-- MODELO 20: Auto de Acareação
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>AUTO DE ACAREAÇÃO</strong></p>
<p>Aos ______ dias do mês de ______ do ano de dois mil e _______, pelas ___ (horas) no gabinete do(a) __(local e endereço)_________________, no âmbito do processo nº _____/_____-____, perante mim __(identificação do instrutor, nome e categoria profissional) _______________________________, compareceram ___(nomes dos acareados)_____ e _______________________________, já identificados nos autos, a fim de se proceder à sua acareação por se considerar contraditórios os depoimentos prestados.</p>
<p>Questionados sobre ____ (aspetos pertinentes dos depoimentos)__________________________, ambos mantiveram os seus depoimentos __(ou descrever a alteração dos depoimentos______ .</p>
<p>Para constar se lavrou o presente auto, que depois de lido e considerado conforme, vai pelos intervenientes ser assinado.</p>
<p>O Acareado: __________ &nbsp; O Acareado: ____________ &nbsp; O Instrutor: ____________</p>' WHERE CODIGO = '00021';

-- MODELO 21: Auto de Exame
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>AUTO DE EXAME</strong></p>
<p>Aos ______ dias do mês de ______ do ano de dois mil e _______, no gabinete do __(serviço, local e endereço)_________________, no âmbito do processo nº _____/_____-____, perante mim __(identificação do instrutor, nome e serviço a que pertence) _______________________________, compareceu _____(nome do perito, categoria profissional e serviço/entidade a que pertence)_________________________, designado por despacho de ____(data e entidade que o nomeou)_______________ para a emissão de parecer na qualidade de perito em ____(identificar a área técnica)___________________ no processo acima identificado.</p>
<p>Ciente da missão que lhe é cometida, disse que se compromete, por sua honra, a emitir parecer fundamentado e a responder com verdade e de modo expresso e claro a todas as questões que lhe forem formuladas.</p>
<p>Assim e questionado sobre:</p>
<p>Quesito I: _____(teor do quesito)___________________________________________________________________ .</p>
<p>Respondeu que: _______(resposta ao quesito)_____________________________________________________ .</p>
<p>Quesito II: _______(teor do quesito)________________________________________________________________ .</p>
<p>Respondeu que: _______(resposta ao quesito)_____________________________________________________ .</p>
<p>Para que conste se lavrou o presente auto que, depois de lido e considerado conforme, vai pelos intervenientes ser assinado.</p>
<p>O Perito: ________________________ &nbsp; O Instrutor: __________________________</p>' WHERE CODIGO = '00022';

-- MODELO 22: Termo de Compromisso de Honra
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>TERMO DE COMPROMISSO DE HONRA</strong></p>
<p>Aos ______ dias do mês de ______ do ano de dois mil e _______, no gabinete do __(serviço, local e endereço)_________________, no âmbito do processo nº _____/_____-____, perante mim __(identificação do instrutor, nome e serviço a que pertence) _______________________________, compareceu _____(nome do perito, categoria profissional e serviço/entidade a que pertence)_________________________, designado por despacho de ____(data e entidade que o nomeou)_______________ para a emissão de parecer na qualidade de perito em ____(identificar a área técnica)___________________ no processo acima identificado.</p>
<p>Ciente da missão que lhe é cometida, disse que se compromete, por sua honra, a emitir parecer fundamentado e a responder com verdade e de modo expresso e claro a todas as questões que lhe forem formuladas, para cujo efeito lhe foi disponibilizada toda a documentação pertinente com ________fls. extraídas do respetivo processo e acompanhadas dos respetivos quesitos.</p>
<p>Mais declara que procederá à entrega do parecer, acompanhado da documentação de suporte no prazo de __________ dias, a contar da presente data.</p>
<p>Lido e considerado conforme, vai o presente auto ser assinado pelos intervenientes.</p>
<p>O Perito: ________________________ &nbsp; O Instrutor: __________________________</p>' WHERE CODIGO = '00023';

-- MODELO 23: Termo de Juntada
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>TERMO DE JUNTADA</strong></p>
<p>Proc. nº _____/____-____</p>
<p>Aos _______ dias do mês de __________ do ano de dois mil e ___________, juntam-se ao processo os documentos de fls. _______ a fls. _______.</p>
<p>O/A Instrutor/a: ____________________________________________________________________________________</p>' WHERE CODIGO = '00024';

-- MODELO 24: Termo de Consulta do Processo
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>TERMO DE CONSULTA DO PROCESSO</strong></p>
<p>Aos _______ dias do mês de __________ do ano de dois mil e ________, em ____(local onde o acto tem lugar)______, em conformidade com o meu despacho de _____(data)_____ entreguei a ____(nome e cargo de representação)______, para consulta, o processo nº _____/______-_____, composto por _____ volumes e um total de ____ folhas, devidamente numeradas e rubricadas.</p>
<p>_____(assinatura legível de quem faculta a consulta) _______________________________________</p>
<p>Certifico que consultei o processo.</p>
<p>O visado (ou seu mandatário): ________________________________________________________________</p>
<hr/>
<p style="text-align: center;"><strong>TERMO DE CONFIANÇA DO PROCESSO</strong></p>
<p>Aos _______ dias do mês de __________ do ano de dois mil e ________, em ____(local onde o acto tem lugar)______, em conformidade com o meu despacho de _____(data)_____ entreguei a ____(advogado mandatário do visado – nº licença profissional)______, o processo nº _____/______-_____, composto por _____ volumes e um total de ____ folhas, devidamente numeradas e rubricadas, o qual será devolvido no prazo de ___ dias, nos termos legalmente previstos.</p>
<p>_____(assinatura legível de quem faculta a consulta) _______________________________________</p>
<p>Certifico que recebi o processo.</p>
<p>O advogado (mandatário do visado): _________________________________________________________</p>' WHERE CODIGO = '00025';

-- MODELO 25: Despacho de Conclusão da Instrução
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>DESPACHO DE CONCLUSÃO DE INSTRUÇÃO</strong></p>
<p>Proc. nº _____/____-____</p>
<p>Nos termos e para os efeitos previstos no ______(mencionar a lei de suporte consoante o tipo de processo)___________, aos _______ dias do mês de __________ do ano de dois mil e ___________, declaro encerrada a instrução.</p>
<p>O Instrutor: ____________________________________________________________________________________</p>' WHERE CODIGO = '00026';

-- MODELO 26: Relatório no Termo da Instrução
UPDATE sgigjprpecasprocessual SET OBS = '<p>Proc. nº ___________/_______-______</p>
<p>Tipo: _____________________________</p>
<p>Entidade/pessoa visada: _______</p>
<p style="text-align: center;"><strong>RELATÓRIO NO TERMO DA INSTRUÇÃO</strong></p>
<p><strong>I – INTRODUÇÃO</strong><br/>Identificar, de forma sucinta, os despachos de instauração do processo e de nomeação do instrutor e descrever sumariamente o objeto do processo.</p>
<p><strong>II – ENQUADRAMENTO LEGAL</strong><br/>Identificar sumariamente as normas legais que suportam o procedimento.</p>
<p><strong>III – DILIGÊNCIAS INSTRUTÓRIAS</strong><br/>Indicar a data do inicio e termo da instrução e descrever as diligências efetuadas, distinguindo os diferentes tipos de prova produzida (prova testemunhal, prova documental, prova pericial).</p>
<p><strong>IV – APRECIAÇÃO JURÍDICA</strong><br/>Descrever os factos provados e não provados, proceder à sua qualificação jurídica, esclarecer as razões por que considera que os mesmos constituem ou não cometimento infratório, qualificar o tipo de responsabilidade e dizer se há prescrição.</p>
<p><strong>V – CONCLUSÕES</strong></p>
<p><strong>VI – PROPOSTA DE ARQUIVAMENTO OU DE PROSSEGUIMENTO DO PROCESSO</strong></p>
<p>Local e data</p>
<p>O Instrutor: ____________________________________________________________________________________</p>' WHERE CODIGO = '00027';

-- MODELO 27: Convocatória de Testemunha de Defesa
UPDATE sgigjprpecasprocessual SET OBS = '<p><em>Confidencial</em><br/><em>Correio registado c/ aviso de recepção</em></p>
<p>Exmo. Senhor<br/>(Nome e endereço da testemunha)</p>
<p>S/ Referência: ______________ &nbsp; Processo Nº _____/____-_____ &nbsp; N/ Referência: _______________</p>
<p>Data: ____/_____/_______ &nbsp; Data: ____/_____/______</p>
<p><strong>ASSUNTO:</strong> Convocatória – Testemunha de defesa.</p>
<p>Para os devidos efeitos, fica V. Exa. notificado para comparecer no dia _______________, pelas __________ horas, no ____(local)_________, sito na ______(morada)____, a fim de ser inquirido na condição de testemunha no âmbito do processo supra indicado.</p>
<p>Com os melhores cumprimentos.</p>
<p>O Instrutor</p>
<p>___________________________________</p>' WHERE CODIGO = '00028';

-- MODELO 28: Pedido de Convocatória de Testemunhas
UPDATE sgigjprpecasprocessual SET OBS = '<p><em>Confidencial</em><br/><em>Correio registado c/ aviso de recepção</em></p>
<p>Exmo. Senhor<br/>(Nome e endereço da entidade patronal da testemunha)</p>
<p>S/ Referência: ______________ &nbsp; Processo Nº _____/____-_____ &nbsp; N/ Referência: _______________</p>
<p>Data: ____/_____/_______ &nbsp; Data: ____/_____/______</p>
<p><strong>ASSUNTO:</strong> Convocatória – Testemunha de defesa.</p>
<p>Para os devidos efeitos, solicita-se a V. Exa. se digne ordenar a notificação dos profissionais abaixo identificados para que compareçam perante o signatário no _______(local e morada onde terão lugar as inquirições)_________, no dia _______________, nas horas indicadas, a fim de serem inquiridos na condição de testemunhas arroladas pela defesa no âmbito do processo supra indicado.</p>
<ul>
<li>_______(nome, categoria profissional)_____________, às _______ horas;</li>
<li>_______(nome, categoria profissional)_____________, às _______ horas;</li>
<li>_______(nome, categoria profissional)_____________, às _______ horas.</li>
</ul>
<p>Com os melhores cumprimentos.</p>
<p>O Instrutor</p>
<p>___________________________________</p>' WHERE CODIGO = '00029';

-- MODELO 29: Notificação da Data da Convocatória de Testemunhas
UPDATE sgigjprpecasprocessual SET OBS = '<p><em>Confidencial</em><br/><em>Correio registado c/ aviso de recepção</em></p>
<p>Exmo. Senhor</p>
<p>S/ Referência: ______________ &nbsp; Processo Nº _____/____-_____ &nbsp; N/ Referência: _______________</p>
<p>Data: ____/_____/_______ &nbsp; Data: ____/_____/______</p>
<p><strong>ASSUNTO:</strong> Notificação – Inquirição de testemunhas arroladas na defesa.</p>
<p>Para os devidos efeitos, informa-se a V. Exa. de que a inquirição das testemunhas por si arroladas no âmbito da defesa no processo supra indicado, terá lugar no dia ______, pelas ___________ horas, no __________(indicar local)______________.</p>
<p>Com os melhores cumprimentos.</p>
<p>O Instrutor</p>
<p>___________________________________</p>
<p><em>Nota: Se o visado constituiu mandatário, notificar também o mandatário.</em></p>' WHERE CODIGO = '00030';

-- MODELO 30: Auto de Não Comparência de Testemunha
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>AUTO DE NÃO COMPARÊNCIA DE TESTEMUNHA</strong></p>
<p>Aos _______ dias do mês de __________ do ano de dois mil e ________, no âmbito do processo nº _____/____-____, consigna-se que ____(nome da testemunha)_________ devidamente notificado para inquirição como testemunha através do Ofício nº ___, de ________________, não compareceu na data, hora e local fixados para o efeito.</p>
<p>E para que conste, se lavrou o presente auto de não comparência.</p>
<p>O Instrutor ____________________________________________________________________________________</p>' WHERE CODIGO = '00031';

-- MODELO 31: Relatório Final
UPDATE sgigjprpecasprocessual SET OBS = '<p>Proc. nº ___________/_______-______</p>
<p>Tipo: _____________________________</p>
<p>Entidade/pessoa visada: _______</p>
<p style="text-align: center;"><strong>RELATÓRIO FINAL</strong></p>
<p><strong>I – INTRODUÇÃO</strong><br/>Identificar, de forma sucinta, os despachos de instauração do processo e de nomeação do instrutor e descrever sumariamente o objeto do processo.</p>
<p><strong>II – ENQUADRAMENTO LEGAL E DILIGÊNCIAS INSTRUTÓRIAS</strong><br/>Identificar sumariamente as normas legais que suportam o procedimento e descrever nos mesmos termos diligências, factos ou ocorrências com relevo no decurso da instrução.</p>
<p><strong>III – ACUSAÇÃO</strong><br/>Transcrever a matéria acusatória.</p>
<p><strong>IV – DEFESA</strong><br/>Descrever a defesa apresentada, a prova produzida, evidenciar o cumprimento de todas as formalidades essenciais e o respeito pelo princípio da audiência e defesa.</p>
<p><strong>V – DILIGÊNCIAS COMPLEMENTARES</strong><br/>Se houverem ocorrido.</p>
<p><strong>VI – APRECIAÇÃO CRÍTICA</strong><br/>Analisar a prova produzida, ponderar os termos da defesa apresentada, enunciar os factos provados e os não provados e proceder ao respetivo enquadramento legal e à sua qualificação jurídica.</p>
<p><strong>VII – CONCLUSÕES</strong><br/>Indicar as infrações consideradas provadas, identificando as normas violadas, a sua qualificação e enquadramento jurídico, as respetivas circunstâncias atenuantes e/ou agravantes e determinar a medida concreta da pena a aplicar.</p>
<p><strong>VIII – PROPOSTA DE ARQUIVAMENTO OU DE PROSSEGUIMENTO DO PROCESSO</strong><br/>Propor a sanção a aplicar ou o arquivamento do processo e as comunicações e notificações devidas.</p>
<p>Local e data</p>
<p>O Instrutor: __________________________________________________________________________________________</p>' WHERE CODIGO = '00032';

-- MODELO 32: Conclusão do Processo / Despacho
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>DESPACHO</strong></p>
<p>Aos _______ dias do mês de __________ do ano de dois mil e ________, dou por concluso o processo nº _____/____-____, composto por _____ volumes e ______ folhas, devidamente ordenadas, numeradas e rubricadas que, nesta data, submeto a ____(entidade que determinou a instauração do processo)__________________________, para decisão.</p>
<p>O Instrutor ____________________________________________________________________________________</p>' WHERE CODIGO = '00033';

-- MODELO 33: Notificação Postal da Decisão
UPDATE sgigjprpecasprocessual SET OBS = '<p><em>Confidencial</em><br/><em>Correio registado c/ aviso de recepção</em></p>
<p>Exmo. Senhor<br/>(Nome e endereço da pessoa ou entidade visada)</p>
<p>S/ Referência: ______________ &nbsp; Processo Nº _____/____-_____ &nbsp; N/ Referência: _______________</p>
<p>Data: ____/_____/_______ &nbsp; Data: ____/_____/______</p>
<p><strong>ASSUNTO:</strong> Notificação da decisão final.</p>
<p>Para os devidos efeitos, notifica-se V. Exa. de que, por despacho de ____(data do despacho e identificação da entidade decisora)_____________, foi-lhe aplicada a pena de _______, fixada em __ _____ euros/tempo (consoante seja multa, suspensão da prestação de serviço ou impedimento de acesso) (ou que foi arquivado o processo supra identificado), juntando-se fotocópia certificada da decisão e seus fundamentos.</p>
<p>Mais se informa V. Exa. de que pode interpor recurso para o membro competente do Governo, no prazo de 15 dias úteis contados a partir da data da receção da presente notificação.</p>
<p>Com os melhores cumprimentos.</p>
<p>O Instrutor</p>
<p>___________________________________</p>' WHERE CODIGO = '00034';

-- MODELO 34: Notificação Pessoal da Decisão
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>TERMO DE NOTIFICAÇÃO</strong></p>
<p>Aos _______ dias do mês de __________ do ano de dois mil e ________, no processo nº _____/______-_____, o _______(entidade ou pessoa visada)____________________ foi notificado de que por despacho de decisão de ____(data do despacho e identificação da entidade decisora)_____________, foi-lhe aplicada a pena de _______, prevista no Artigo ___º da Lei nº __________________, fixada em __ _____ euros/tempo (consoante seja multa, suspensão da prestação de serviço ou impedimento de acesso) (ou que foi arquivado o processo supra identificado), juntando-se fotocópia certificada da decisão e seus fundamentos.</p>
<p>O _______(entidade ou pessoa visada)____________________ foi ainda informado de que pode interpor recurso para o membro competente do Governo, no prazo de 15 dias úteis contados a partir da data da receção da presente notificação.</p>
<p>O Notificado: _____(assinatura com o nome completo)______________________________________</p>
<p>O Instrutor: ______(ou mandatário para o acto)______________________________________________</p>' WHERE CODIGO = '00035';

-- MODELO 35: Notificação da Decisão por Publicação de Aviso
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>AVISO</strong></p>
<p>____(nome da entidade se o visado for concessionário, nome e categoria profissional se for empregado do casino, identificação civil se for frequentador do casino), com última morada conhecida em __________________________________________________________________, fica desta forma notificado de que, por decisão de ____(data do despacho e identificação da entidade decisora)_____________, proferida no processo nº _____/______-_____, foi-lhe aplicada a pena de _______, fixada em __ _____ euros/tempo (consoante seja multa, suspensão da prestação de serviço ou impedimento de acesso), que produzirá efeitos nos termos legalmente previstos.</p>
<p>Fica ainda notificado de que pode interpor recurso para o membro competente do Governo, no prazo de 20 dias úteis contados a partir da data da publicação do presente aviso.</p>
<p>Data: _________________</p>
<p>Nome: _____________________________________________________________</p>
<p>Cargo: _____________________________________________________________</p>' WHERE CODIGO = '00036';

-- MODELO 36: Anúncio de Sindicância
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>ANÚNCIO</strong></p>
<p>____(nome e categoria do sindicante)________________________, na qualidade de sindicante, nomeado por despacho de __ (data do despacho e identificação da entidade decisora)_____________, que corre termos sob o nº _______/_____-____, faz público que iniciou hoje, dia ___________, pelas _______ horas, a sindicância ordenada.</p>
<p>Toda a pessoa que tenha razão de queixa ou de agravo contra o regular funcionamento do ___________________ (identificar órgão/serviço ou unidade orgânica) __________, pode apresentar-se ao sindicante, ou apresentar queixa por escrito, através de documento onde conste a sua identificação completa e assinatura legível, no ________(identificação do local)____________, sito em ______________(morada)_________, até às _________ horas, do dia ______________.</p>
<p>Em cumprimento do que determina o Artigo _______º da Lei nº _______________, publica-se o presente anúncio nos jornais.</p>
<p>Data: _________________</p>
<p>O Sindicante: _____________________________________________________________</p>' WHERE CODIGO = '00037';

-- MODELO 37: Pedido de Anúncio de Sindicância
UPDATE sgigjprpecasprocessual SET OBS = '<p><em>Confidencial</em><br/><em>Correio registado c/ aviso de recepção</em></p>
<p>Exmo. Senhor<br/>(Nome e endereço do jornal)</p>
<p>S/ Referência: ______________ &nbsp; Processo Nº _____/____-_____ &nbsp; N/ Referência: _______________</p>
<p>Data: ____/_____/_______ &nbsp; Data: ____/_____/______</p>
<p><strong>ASSUNTO:</strong> Publicação de anúncio de sindicância.</p>
<p>Para os devidos efeitos e na condição de instrutor nomeado para proceder à sindicância do ______(órgão, serviço ou unidade orgânica)_________________, solicito a V. Exa. se digne determinar a publicação no jornal que dirige do anúncio anexo, em conformidade com o que determina o Artigo ___º da Lei nº ________________.</p>
<p>Mais se solicita a remessa da correspondente fatura a fim de que se proceda ao pagamento da despesa, bem como um exemplar do jornal em que o anúncio for publicado.</p>
<p>Com os melhores cumprimentos.</p>
<p>O Sindicante</p>
<p>___________________________________</p>
<p><em>Em anexo: O anúncio indicado.</em></p>' WHERE CODIGO = '00038';

-- MODELO 38: Edital de Sindicância
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>EDITAL</strong></p>
<p>____(nome e categoria do sindicante)________________________, na qualidade de sindicante, nomeado por despacho de __ (data do despacho e identificação da entidade decisora)_____________, que corre termos sob o nº _______/_____-____, faz público que iniciou hoje, dia ___________, pelas _______ horas, a sindicância ordenada.</p>
<p>Toda a pessoa que tenha razão de queixa ou de agravo contra o regular funcionamento do ___________________ (identificar órgão/serviço ou unidade orgânica) __________, pode apresentar-se ao sindicante, ou apresentar queixa por escrito, através de documento onde conste a sua identificação completa e assinatura legível, no ________(identificação do local)____________, sito em ______________(morada)_________, até às _________ horas, do dia ______________.</p>
<p>E para que conste se publica o presente Edital que vai ser afixado na entrada do serviço _______________, onde corre o processo e nas autoridades policiais e/ou administrativas da área geográfica jurisdicionalmente abrangida.</p>
<p>Data: _________________</p>
<p>O Sindicante: _____________________________________________________________</p>' WHERE CODIGO = '00039';

-- MODELO 39: Pedido de Afixação de Edital de Sindicância
UPDATE sgigjprpecasprocessual SET OBS = '<p><em>Confidencial</em><br/><em>Correio registado c/ aviso de recepção</em></p>
<p>Exmo. Senhor<br/>(Identificação e endereço do comando da Esquadra da Polícia Nacional ou sede da autarquia)</p>
<p>S/ Referência: ______________ &nbsp; Processo Nº _____/____-_____ &nbsp; N/ Referência: _______________</p>
<p>Data: ____/_____/_______ &nbsp; Data: ____/_____/______</p>
<p><strong>ASSUNTO:</strong> Publicação de anúncio de sindicância.</p>
<p>Para os devidos efeitos e na condição de instrutor nomeado para proceder à sindicância do ______(órgão, serviço ou unidade orgânica)_________________, solicito a V. Exa. se digne determinar a afixação do Edital anexo, em conformidade com o que determina o Artigo ___º da Lei nº ________________.</p>
<p>Mais se solicita a remessa da correspondente certidão de afixação, conforme modelo igualmente em anexo, após a respetiva afixação.</p>
<p>Com os melhores cumprimentos.</p>
<p>O Sindicante</p>
<p>___________________________________</p>
<p><em>Em anexo: Os documentos indicados.</em></p>' WHERE CODIGO = '00040';

-- MODELO 40: Certidão de Afixação de Edital de Sindicância
UPDATE sgigjprpecasprocessual SET OBS = '<p style="text-align: center;"><strong>CERTIDÃO DE AFIXAÇÃO</strong></p>
<p>Certifico que hoje, dia _______________, pelas ______ horas __________ e na presença das testemunhas _______(nomes)______________________ e __________________________, afixei _______ exemplares do edital do processo de sindicância nº _________/______-___, nos lugares públicos ________(identificar a localidade)_______________.</p>
<p>Por ser verdade e para que conste, lavrei a presente certidão que assino juntamente com as duas testemunhas identificadas.</p>
<p>O/A Afixante: _____(nome completo) ______________________________</p>
<p>A Testemunha: ______(nome legível/n.º do documento de identificação)____</p>
<p>A Testemunha: ______(nome legível/n.º do documento de identificação)____</p>' WHERE CODIGO = '00041';

-- MODELO 41: Relatório Final de Sindicância ou Inquérito
UPDATE sgigjprpecasprocessual SET OBS = '<p>Proc. nº ___________/_______-______</p>
<p>Tipo: _____________________________</p>
<p style="text-align: center;"><strong>RELATÓRIO FINAL</strong></p>
<p><strong>I – INTRODUÇÃO</strong><br/>Identificar, de forma sucinta, os despachos de instauração do processo e de nomeação do instrutor e descrever sumariamente o objeto do processo.</p>
<p><strong>II – ENQUADRAMENTO LEGAL E DILIGÊNCIAS INSTRUTÓRIAS</strong><br/>Identificar sumariamente as normas legais que suportam o procedimento, descrever nos mesmos termos o objecto do processo e o prazo fixado para a respetiva instrução.</p>
<p><strong>III – MATÉRIA DE FACTO</strong><br/>Elencar os factos e as circunstâncias em que os mesmos ocorreram que indiciam a eventual pratica infratória e os factos que não indiciam a prática de qualquer tipo de infração.</p>
<p><strong>IV – APRECIAÇÃO JURÍDICA</strong><br/>Proceder ao enquadramento jurídico da matéria de facto apurada, certificar da existência/inexistência de causas de exclusão de responsabilidade - circunstâncias dirimentes, prescrição, etc - identificar as infrações indiciadas, se as houver e os possíveis responsáveis pelas mesmas, caso existam.</p>
<p><strong>V – CONCLUSÕES</strong><br/>Fundamentar sumariamente o arquivamento do processo ou a instauração de processo disciplinar, administrativo ou contraordenacional e identificando o/s visados.</p>
<p><strong>VI – PROPOSTA DE ARQUIVAMENTO OU DE PROSSEGUIMENTO DO PROCESSO</strong><br/>Propor o arquivamento do processo ou a instauração de processo disciplinar, administrativo ou contraordenacional e identificando o/s visados e, neste caso, a extração de certidão da prova indiciária produzida para integrar o processo a instaurar.</p>
<p>Local e data</p>
<p>O Instrutor: __________________________________________________________________________________________</p>' WHERE CODIGO = '00042';

-- Peças do sistema (sem template do PDF)
UPDATE sgigjprpecasprocessual SET OBS = '<p>Nota de comunicação do processo.</p>' WHERE CODIGO = '00043';
UPDATE sgigjprpecasprocessual SET OBS = '<p>Documento de prova a anexar ao processo.</p>' WHERE CODIGO = '00044';
UPDATE sgigjprpecasprocessual SET OBS = '<p>Reclamação apresentada pelo visado no âmbito do processo.</p>' WHERE CODIGO = '00045';

-- Verificação
SELECT CODIGO, DESIG, LENGTH(OBS) as OBS_LEN FROM sgigjprpecasprocessual ORDER BY CODIGO;
