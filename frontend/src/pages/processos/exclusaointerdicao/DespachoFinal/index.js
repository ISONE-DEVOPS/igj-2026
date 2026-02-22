import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Pagination, Button, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';


import api from '../../../../services/api';



import JoditEditor from 'jodit-react';
import { createDateToInput } from '../../../../functions';

import EscrevaUmTexo from '../../../../Text/EscrevaUmTexo';


export default function ({

    processo,
    isdepachofinal,
    setisdepachofinal,
    decisaolist,
    uploadlist


}) {

    const [despacho_tipo, setdespacho_tipo] = useState("");

    const [dais_exclusao, setdais_exclusao] = useState(0);


    const [ID, setID] = useState("");
    const [CODIGO, setCODIGO] = useState("*");
    const [DATA, setDATA] = useState("");
    const [DATA_INICIO, setDATA_INICIO] = useState("");
    const [DATA_FIM, setDATA_FIM] = useState("");
    const [PR_DECISAO_TP_ID, setPR_DECISAO_TP_ID] = useState("");
    const [PR_EXCLUSAO_PERIODO_ID, setPR_EXCLUSAO_PERIODO_ID] = useState("");
    const [COIMA, setCOIMA] = useState("");
    const [INFRACAO_COIMA_ID, setINFRACAO_COIMA_ID] = useState("");
    const [coimaMin, setCoimaMin] = useState("");
    const [coimaMax, setCoimaMax] = useState("");


    const [periodolist, setperiodolist] = useState([]);

    async function uploadperiodolist() {

        try {

            const response = await api.get('/sgigjprexclusaoperiodo');

            if (response.status == '200') {

                setperiodolist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }



    const [infracaocoimalist, setinfracaocoimalist] = useState([]);

    async function uploadinfracaocoima() {

        try {

            const response = await api.get('/sgigjinfracaocoima');

            if (response.status == '200') {


                setinfracaocoimalist(response.data)

            }


        } catch (err) {

            console.error(err.response)


        }



    }




    let parecerEdit = ""

    useEffect( () => {
 
        console.log(processo)

        if (Object.keys(processo).length !== 0) {

            if (processo.sgigjprocessodespacho.length > 0) {

                if (processo.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor.length > 0) {

                    if (processo.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao.length > 0) {

                        setID(processo.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0].ID)

                        if (processo.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0]?.sgigjprocessodespacho.length > 0) {

                            const newitem = processo.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0]?.sgigjprocessodespacho[0]

                            parecerEdit = (newitem.DESPACHO)
                            setDATA(createDateToInput(newitem.DATA))
                            setDATA_FIM(createDateToInput(newitem.DATA_FIM))
                            setDATA_INICIO(createDateToInput(newitem.DATA_INICIO))
                            setPR_EXCLUSAO_PERIODO_ID((newitem.PR_EXCLUSAO_PERIODO_ID))
                            setPR_DECISAO_TP_ID(newitem.PR_DECISAO_TP_ID)
                            setCODIGO(newitem.CODIGO)
                            setINFRACAO_COIMA_ID(newitem.INFRACAO_COIMA_ID)
                            setCOIMA(newitem.COIMA)
                            setdais_exclusao(newitem.sgigjprexclusaoperiodo?.NUM_DIAS)

                        } else {

                            parecerEdit = editorcontent

                            console.log(processo.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0].PR_DECISAO_TP_ID)

                            setPR_DECISAO_TP_ID(processo.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0].PR_DECISAO_TP_ID)

                        }

                    }

                }



            }

        }

        


        // if (parecerEdit == "") parecerEdit = EscrevaUmTexo

        // seteditorcontent(parecerEdit)




    }, [processo])





    const [editorcontent, seteditorcontent] = useState();



    const editorREF = useRef(null)

    const setRef = jodit => {
        // control
    };

    const updateContent = async (value) => {
        //seteditorcontent(value);
        try {
            const response = await api.get(`/despacho-desicao/referencia`);
            if (response.status == '200') {
                

            seteditorcontent(`
            <h4 style="font-weight: 700;text-align: center;margin-top: 10px;margin-bottom: 35px;">DESPACHO/DECISÃO N.º ${response.data.message}<h4>
                                        
               
    <p style="text-align: justify;line-height: 1.5;">Considerando o Relatório Final do Processo de Averiguação Sumária, para o apuramento da veracidade dos factos apresentados pela direção do casino;</p>
    
    <p style="text-align: justify;line-height: 1.5;">Atendendo que o averiguado reagiu/não em sua defesa, durante o prazo legal atribuído, para indicar os motivos justificativos da sua reclamação, bem como as testemunhas que pudessem ser ouvidas;</p>
    
    <p style="text-align: justify;line-height: 1.5;">Tendo em conta que a acusação apontada pela concessionária de que o comportamento do Sr. ..................................................... se revelou inconveniente, inapropriado e enquadrável dentro dos atos ilícitos administrativos de clientes das concessionárias, ter sido provada;</p>
    
    <p style="text-align: justify;line-height: 1.5;">No uso da faculdade conferida pelos n.ºs 10 e 13 do artigo 63.º da Lei 77/VI/2005 de 16 de agosto, valido a decisão tomada pela concessionária de interdição provisória e perante os factos apurados, constantes do Processo folhas 0 a folhas 22, para o qual se remete para todos os efeitos legais, determino a interdição de acesso ao Casino Royal do Sr. ............................ por um período de … meses/anos, a contar da data da ocorrência do facto (.../.../20...);</p>
    
    
    <p style="text-align: justify;line-height: 1.5;">Determino ainda:
    
        1. A prestação de informações pela concessionária ao Serviço de Inspeção de Jogos do desfecho da investigação referenciada, relativa a possíveis fraudes ao Grupo de Máquinas em causa. 
    
        2. Notifique-se a Direção do Casino Royal e o averiguado do Despacho da Decisão Final
    
        3. Deve a Direção do Casino dar de imediato conhecimento à receção do mesmo, devendo esta, bem como o Diretor Geral do casino estarem cientes das suas responsabilidades se permitirem o acesso do referido frequentador ao espaço confinado ao jogo;
    
        4. CUMPRA-SE
    </p>
    
    <p style="text-align: justify;line-height: 1.5;">Praia, ......... de .......... de 20.....</p>
    `)
                parecerEdit = value

            }
        } catch (error) {
            
        }

    };







    async function onSubmit(event) {

        event.preventDefault();


        if (processo?.sgigjprocessodespacho?.length > 0) {




            if (processo?.sgigjprocessodespacho[0]?.TIPO_PROCESSO_EXCLUSAO == "C") {


                const upload = {
                    PR_EXCLUSAO_PERIODO_ID,
                    PR_DECISAO_TP_ID,
                    DATA,
                    COIMA,
                    INFRACAO_COIMA_ID,
                    DESPACHO: editorREF?.current?.value,
                    DATA_INICIO:  DATA_INICIO,
                    DATA_FIM:  DATA_FIM,
                    TIPO: despacho_tipo ==  "CONCLUIR" ?  "CONCLUIR" : processo?.sgigjprocessodespacho[0]?.TIPO_PROCESSO_EXCLUSAO,

                }

                try {

                    const response = await api.put(`/sgigjrelprocessoinstrucaocontraordenacao/${ID}/despacho`, upload);

                    if (response.status == '200') {
                        toast.success('Documento Guardado!', { duration: 4000 })


                        uploadlist()
                        setisdepachofinal(false)

                    }




                } catch (err) {

                    console.error(err.response)

                }

            }





            if (processo?.sgigjprocessodespacho[0]?.TIPO_PROCESSO_EXCLUSAO == "A" || processo?.sgigjprocessodespacho[0]?.TIPO_PROCESSO_EXCLUSAO == "I") {


                const upload = {
                    PR_EXCLUSAO_PERIODO_ID,
                    PR_DECISAO_TP_ID,
                    DATA,
                    COIMA,
                    INFRACAO_COIMA_ID,
                    DESPACHO: editorREF?.current?.value,
                    DATA_INICIO: DATA_INICIO,
                    DATA_FIM:  DATA_FIM,
                    TIPO: despacho_tipo ==  "CONCLUIR" ?  "CONCLUIR" :  processo?.sgigjprocessodespacho[0]?.TIPO_PROCESSO_EXCLUSAO,

                }


                try {

                    const response = await api.put(`/sgigjrelprocessoinstrucao/${ID}/despacho`, upload);

                    if (response.status == '200') {


                        uploadlist()
                        setisdepachofinal(false)

                    }




                } catch (err) {

                    console.error(err.response)

                }


            }








        }





    }



    useEffect(() => {

        let newdatefim = new Date(DATA_INICIO);
        newdatefim.setDate(newdatefim.getDate() + dais_exclusao);


        if (newdatefim != 'Invalid Date') {

            // setDATA_FIM(createDateToInput(newdatefim))

        }




    }, [DATA_INICIO, dais_exclusao])





    useEffect(() => {

        uploadperiodolist()
        uploadinfracaocoima()


    }, [])



    function dais_exclusaoMaker(e) {

        let newfilter = e.split(";:;")

        setdais_exclusao(parseInt(newfilter[1]))
        setPR_EXCLUSAO_PERIODO_ID(newfilter[0])
        console.log(PR_EXCLUSAO_PERIODO_ID)


    }


    const [mergedPdfUrl, setMergedPdfUrl] = useState();
    const [isjuntadaopen, setisjuntadaopen] = useState(false);



    async function juntada(newid) {


        let instrucao = []

        console.log(newid)

        try {

            const response = await api.get('/sgigjprocessoexclusao/' + processo.ID);


            if (response.status == '200') {

                if (response.data.length > 0) {

                    response.data[0].id = response.data[0].ID

                    if (response.data[0].sgigjprocessodespacho.length > 0) {

                        if (response.data[0].sgigjprocessodespacho[0].sgigjrelprocessoinstrutor.length > 0) {

                            if (response.data[0].sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao.length > 0) {


                                instrucao = response.data[0].sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao[0].sgigjrelinstrutorpeca



                            }

                        }

                    }

                }

            }





            var list = []


            if (instrucao.length > 0) {


                for (let index3 = 0; index3 < instrucao.length; index3++) {

                    const element = instrucao[index3];


                    for (let index2 = 0; index2 < element.sgigjreldocumento.length; index2++) {

                        const element2 = element.sgigjreldocumento[index2];


                        list.push(element2.DOC_URL)

                    }




                    if (element.URL_DOC != null) {

                        list.push(element.URL_DOC)


                    }



                }



            }

            console.log("GO_ER");

            const responsePDF = await api.get('/juntada/'+ newid/*, { list }*/);

            if (responsePDF.status == '200') {



                const array = responsePDF.data.buffer.data

                const arraybuffer = new Uint8Array(array).buffer

                var blob = new Blob([arraybuffer], { type: "application/pdf" });

                const url = URL.createObjectURL(blob);


                console.log(blob)

                setMergedPdfUrl(url)

                setisjuntadaopen(true)




            }


        } catch (err) {

            console.error(err)

        }



    }




    return (

        <>

            <Modal size='xl' show={isdepachofinal} onHide={() => setisdepachofinal(false)} scrollable centered>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Despacho Decisão</Modal.Title>
                </Modal.Header>
                <Modal.Body className="newuserbox" >

                    <form id="onSubmit" onSubmit={onSubmit} >

                        <Row>
                            <Col sm={2}>
                                <div className="form-group fill">
                                    <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                    <input disabled type="text" className="form-control" id="Name" value={CODIGO} required />
                                </div>
                            </Col>



                            <Col sm={6}>
                                <div className="form-group fill">
                                    <label className="floating-label" htmlFor="Name">Decisão{/* <span style={{ color: "red" }} >*</span>*/}</label>
                                    <select id="perfil" value={PR_DECISAO_TP_ID} onChange={event => { setPR_DECISAO_TP_ID(event.target.value) }} className="form-control" aria-required="true">

                                        <option hidden value="">--- Selecione ---</option>

                                        {decisaolist.map(e => (

                                            <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                        ))}

                                    </select>
                                </div>
                            </Col>

                            <Col sm={4}>
                                <div className="form-group fill">
                                    <label className="floating-label" htmlFor="Name">Data <span style={{ color: "red" }} >*</span></label>
                                    <input type="date" value={DATA} onChange={event => { setDATA(event.target.value) }} className="form-control" id="Name" required />
                                </div>
                            </Col>





                            {


                                processo?.sgigjprocessodespacho?.length > 0 &&

                                    processo?.sgigjprocessodespacho[0]?.TIPO_PROCESSO_EXCLUSAO == "C" ?
                                    <>

                                        <Col sm={8}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Infração</label>
                                                <select id="perfil" value={INFRACAO_COIMA_ID} onChange={event => {
                                                    setINFRACAO_COIMA_ID(event.target.value);
                                                    const selected = infracaocoimalist.find(e => e.ID == event.target.value);
                                                    if (selected) {
                                                        setCoimaMin(selected.VALOR_MINIMO || "");
                                                        setCoimaMax(selected.VALOR_MAXIMO || "");
                                                    } else {
                                                        setCoimaMin("");
                                                        setCoimaMax("");
                                                    }
                                                }} className="form-control">
                                                    <option hidden value="">--- Selecione ---</option>
                                                    {infracaocoimalist.map(e => (
                                                        <option key={e.ID} value={e.ID}>{e?.sgigjprinfracaotp?.DESIG}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </Col>

                                        <Col sm={4}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Coima {coimaMin && coimaMax ? `(${coimaMin}€ - ${coimaMax}€)` : ""}</label>
                                                <input type="number" min={coimaMin || undefined} max={coimaMax || undefined} onChange={event => { setCOIMA(event.target.value) }} defaultValue={COIMA} className="form-control" placeholder="Valor..." />
                                            </div>
                                        </Col>

                                    </>
                                    :
                                    <>


                                        <Col sm={4}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Período Exclusão {/* <span style={{ color: "red" }} >*</span>*/}</label>

                                                <select onChange={event => {dais_exclusaoMaker(event.target.value); }} value={PR_EXCLUSAO_PERIODO_ID + ";:;" + dais_exclusao} className="form-control" id="pessoa"  aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>


                                                    {periodolist.map(e => (

                                                        <option key={e.ID} title={e.CODIGO} value={e.ID + ";:;" + e.NUM_DIAS}>{e.DESIG}</option>



                                                    ))
                                                    }

                                                </select>


                                            </div>
                                        </Col>


                                        <Col sm={4}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Data Início {/* <span style={{ color: "red" }} >*</span>*/}</label>
                                                <input type="date" onChange={event => { 
                                                     const date = new Date(event.target.value);
                                                     if(dais_exclusao && date){
                                                         date.setDate(date.getDate() + dais_exclusao);
                                                         const endDateStr = date.toISOString().split('T')[0];
                                                         setDATA_FIM(endDateStr)
                                                     }
                                                    setDATA_INICIO(event.target.value) }} value={DATA_INICIO} className="form-control" placeholder="Data..." />
                                            </div>
                                        </Col>


                                        <Col sm={4}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Data Fim </label>
                                                <input type="date" value={DATA_FIM} onChange={event => { setDATA_FIM(event.target.value) }} className="form-control" placeholder="Data..." />
                                            </div>
                                        </Col>


                                    </>
                            }


                            <Col sm={12}>

                                <div className="form-group fill">
                                    <label className="floating-label" htmlFor="Name">Despacho</label>

                                    <JoditEditor
                                        editorRef={setRef}
                                        value={editorcontent}
                                        config={{
                                            readonly: false
                                        }}
                                        ref={editorREF}
                                        onChange={event => updateContent(event)}
                                    />


                                </div>
                            </Col>


                        </Row>

                    </form>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={() => setisdepachofinal(false)}>Fechar</Button>
                    <Button variant="primary" onClick={() => juntada(ID)} >Ver Juntada</Button>
                    <Button type="submit" form="onSubmit" variant="primary" onClick={() => setdespacho_tipo("SALVAR")}>Guardar</Button>
                    <Button type="submit" form="onSubmit" variant="primary" onClick={() => setdespacho_tipo("CONCLUIR")}>Concluir</Button>
                </Modal.Footer>
            </Modal>

            <Modal size='xl' show={isjuntadaopen} onHide={() => setisjuntadaopen(false)}>

                <iframe
                    height={1000}
                    src={`${mergedPdfUrl}`}
                    title='pdf-viewer'
                    width='100%'
                ></iframe>


            </Modal>

        </>

    )
}



