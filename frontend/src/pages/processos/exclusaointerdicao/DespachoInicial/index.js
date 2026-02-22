import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';




import Select from 'react-select';

import api from '../../../../services/api';

import useAuth from '../../../../hooks/useAuth';



import { createDateToInput, } from '../../../../functions';



import JoditEditor from "jodit-react";
import { geradorTextoDespacho } from '../geradorTexto';








const Customers = ({

    processo_ID,
    setprocesso_ID,

    uploadlist,
    pessoalist,
    decisaolist,

}) => {


    const [isDepachoopen, setisDepachoopen] = useState(false);


    const { user } = useAuth();

    const { popUp_alertaOK } = useAuth();

    let parecerEdit = ""

    const editorREF = useRef(null)


    const [itemSelected, setitemSelected] = useState({});

    const [ID, setID] = useState("");


    const [tipo_pedido, settipo_pedido] = useState("")




    const [PR_DECISAO_TP_ID_D, setPR_DECISAO_TP_ID_D] = useState("");
    const [REFERENCIA_D, setREFERENCIA_D] = useState("");
    const [DATA_D, setDATA_D] = useState("");
    const [PRAZO_D, setPRAZO_D] = useState("");
    const [OBS_D, setOBS_D] = useState("");
    const [INSTRUTOR, setINSTRUTOR] = useState("");
    const [INFRACAO_COIMA_ID, setINFRACAO_COIMA_ID] = useState("");
    const [COIMA, setCOIMA] = useState("");
    const [coimaMin, setCoimaMin] = useState("");
    const [coimaMax, setCoimaMax] = useState("");

    const [CODIGO_D, setCODIGO_D] = useState("");
    const [itemSelectedEdit, setitemSelectedEdit] = useState("");
    const [despachotipo, setdespachotipo] = useState("");

    let dataagora = new Date().toISOString().substring(0, 10)




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









    //-------------- Despacho -------------------------



    const [editorcontent, seteditorcontent] = useState("");



    const updateContent = (value) => {
        //seteditorcontent(value);
        parecerEdit = value

        console.log(parecerEdit)

    };

    const setRef = jodit => {
        // control
    };

    function gerartextodespacho() {





        if (DATA_D == "" || REFERENCIA_D == "") {

            popUp_alertaOK("Preencha todos os campos obrigatórios")

        }


        else {



            console.log(itemSelected)

            parecerEdit = geradorTextoDespacho(user, itemSelected, REFERENCIA_D, dataagora, INSTRUTOR, pessoalist,tipo_pedido)

            seteditorcontent(parecerEdit)

        }

    }







    const openDespacho = async () => {

        settipo_pedido("")

        setPR_DECISAO_TP_ID_D("")
        setREFERENCIA_D("")
        setDATA_D("")
        setPRAZO_D("10")
        setOBS_D("")
        setINFRACAO_COIMA_ID("")

        setCODIGO_D("*")



        dataagora = new Date("2021-01-01")

        console.log(pessoalist)






        parecerEdit = ``


        try {

            const response = await api.get('/sgigjprocessoexclusao/' + processo_ID);


            if (response.status == '200') {

                if (response.data.length > 0) {

                    response.data[0].id = response.data[0].ID

                    setitemSelected(response.data[0])
                    console.log(response.data[0])


                    if (response.data[0].sgigjdespachofinal.length > 0) {

                        settipo_pedido("D")


                        setREFERENCIA_D(response.data[0].sgigjdespachofinal[0].REFERENCIA)
                        setOBS_D(response.data[0].sgigjdespachofinal[0].OBS)
                        setCOIMA(response.data[0].sgigjdespachofinal[0].COIMA)
                        setINFRACAO_COIMA_ID(response.data[0].sgigjdespachofinal[0].INFRACAO_COIMA_ID)
                        setPR_DECISAO_TP_ID_D(response.data[0].sgigjdespachofinal[0].PR_DECISAO_TP_ID)

                        setPRAZO_D(response.data[0].sgigjdespachofinal[0].PRAZO)
                        setDATA_D(createDateToInput(response.data[0].sgigjdespachofinal[0].DATA))


                        setCODIGO_D(response.data[0].sgigjdespachofinal[0].CODIGO)
                        parecerEdit = response.data[0].sgigjdespachofinal[0].DESPACHO




                    } else {


                        if (response.data[0].sgigjprocessodespacho.length > 0) {

                            settipo_pedido(response.data[0].sgigjprocessodespacho[0].TIPO_PROCESSO_EXCLUSAO)


                            setREFERENCIA_D(response.data[0].sgigjprocessodespacho[0].REFERENCIA)
                            setOBS_D(response.data[0].sgigjprocessodespacho[0].OBS)
                            setINSTRUTOR(response.data[0].sgigjprocessodespacho[0].PESSOA_ID_TEMP)
                            setPRAZO_D(response.data[0].sgigjprocessodespacho[0].PRAZO)
                            setDATA_D(createDateToInput(response.data[0].sgigjprocessodespacho[0].DATA))


                            setCODIGO_D(response.data[0].sgigjprocessodespacho[0].CODIGO)
                            parecerEdit = response.data[0].sgigjprocessodespacho[0].DESPACHO


                            if (response.data[0].sgigjrelcontraordenacaoinfracao.length > 0) {

                                setINFRACAO_COIMA_ID(response.data[0].sgigjrelcontraordenacaoinfracao[0].INFRACAO_COIMA_ID)


                            }


                        }


                    }





                }


                setID(processo_ID)
                setprocesso_ID("")

                seteditorcontent(parecerEdit)
                setisDepachoopen(true)

            }



        } catch (err) {

            console.error(err)

        }




    }




    async function criarDespacho(event) {

        event.preventDefault();

        console.log(tipo_pedido)

        if ((tipo_pedido == "C" || tipo_pedido == "I" || tipo_pedido == "A")) {



            const upload = {

                INSTRUTOR,
                REFERENCIA: REFERENCIA_D,
                OBS: OBS_D,
                PRAZO: PRAZO_D,
                DATA: DATA_D,
                DESPACHO: editorREF?.current?.value,
                TIPO_PROCESSO_EXCLUSAO: tipo_pedido,
                TIPO: despachotipo,
                COIMA,
                INFRACAO_COIMA_ID,

                


            }

            if (tipo_pedido == "C") {

                upload.INFRACAO_COIMA_ID = INFRACAO_COIMA_ID

            }

            console.log(parecerEdit)

            console.log(upload)

            console.log(editorREF?.current)
            console.log(editorREF?.current?.value)




            try {

                const response = await api.put(`/sgigjprocessoexclusao/${ID}/despacho`, upload);

                if (response.status == '200') {
                    toast.success('Despacho Criado!', { duration: 4000 })


                    uploadlist()
                    setisDepachoopen(false)

                }

            } catch (err) {

                console.error(err.response)

            }




        }





        if ((tipo_pedido == "D")) {



            const upload = {

                PR_DECISAO_TP_ID: PR_DECISAO_TP_ID_D,
                REFERENCIA: REFERENCIA_D,
                OBS: OBS_D,
                PRAZO: PRAZO_D,
                DATA: DATA_D,
                OBS: OBS_D,
                COIMA,
                INFRACAO_COIMA_ID,
                DESPACHO: editorREF?.current?.value,
                TIPO_PROCESSO_EXCLUSAO: tipo_pedido,
                TIPO: despachotipo,


            }



            console.log(parecerEdit)

            console.log(upload)

            console.log(editorREF?.current)
            console.log(editorREF?.current?.value)




            try {

                const response = await api.put(`/sgigjprocessoexclusao/${ID}/despachofinal`, upload);

                if (response.status == '200') {
                    toast.success('Despacho Criado!', { duration: 4000 })

                    uploadlist()
                    setisDepachoopen(false)

                }

            } catch (err) {

                console.error(err.response)

            }






        }


    }






    useEffect(() => {

        if (processo_ID != "") openDespacho()


    }, [processo_ID])



    useEffect(() => {

        uploadinfracaocoima()


    }, [])





    return (


        <Modal size='xl' show={isDepachoopen} onHide={() => setisDepachoopen(false)} scrollable centered>
            <Modal.Header closeButton>
                <Modal.Title as="h5">Despacho</Modal.Title>
            </Modal.Header>
            <Modal.Body className="newuserbox" >

                <form id="criarDespacho" onSubmit={criarDespacho} >



                    <Row>



                        <Col sm={12}>


                            <Form.Group style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>

                                <Form.Check
                                    inline
                                    custom
                                    required

                                    type="radio"
                                    label="Inquerito"
                                    name="supportedRadio"
                                    id="inquerito"
                                    checked={tipo_pedido == "I" ? true : false}
                                    onChange={() => settipo_pedido("I")}

                                />

                                <Form.Check
                                    inline
                                    custom
                                    required

                                    type="radio"
                                    label="Averiguação Sumário"
                                    name="supportedRadio"
                                    id="averiguacao"
                                    checked={tipo_pedido == "A" ? true : false}
                                    onChange={() => settipo_pedido("A")}

                                />

                                <Form.Check
                                    inline
                                    custom
                                    required

                                    type="radio"
                                    label="Contraordenação"
                                    name="supportedRadio"
                                    id="contraordenacao"
                                    checked={tipo_pedido == "C" ? true : false}
                                    onChange={() => settipo_pedido("C")}

                                />

                                <Form.Check
                                    inline
                                    custom
                                    required

                                    type="radio"
                                    label="Despacho Decisão"
                                    name="supportedRadio"
                                    id="despachofinal"
                                    checked={tipo_pedido == "D" ? true : false}
                                    onChange={() => settipo_pedido("D")}


                                />

                            </Form.Group>



                        </Col>





                        {tipo_pedido == "" ?

                            <Col sm={12}>

                                <div className="form-group fill">

                                    <div style={{ width: "500px", height: "300px", }} ></div>


                                </div>
                            </Col>

                            :

                            <>


                                <Col sm={2}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                        <input disabled type="text" className="form-control" id="Name" value={CODIGO_D} required />
                                    </div>
                                </Col>


                                { tipo_pedido == "D" ?



                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Decisão <span style={{ color: "red" }} >*</span></label>
                                            <select id="perfil" value={PR_DECISAO_TP_ID_D} onChange={event => { setPR_DECISAO_TP_ID_D(event.target.value) }} className="form-control" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {decisaolist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}

                                            </select>
                                        </div>
                                    </Col>


                                    :

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Instrutor <span style={{ color: "red" }} >*</span></label>

                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                onChange={event => setINSTRUTOR(event.value)}
                                                name="pessoa"
                                                options={pessoalist.filter(x => x?.sgigjrelpessoaentidade[0]?.ENTIDADE_ID == "gsmky0e7yakreut8ws32xv0tejykqo7d6jnv")}
                                                defaultValue={

                                                    pessoalist.map(p => (

                                                        p.ID == INSTRUTOR ? p : null

                                                    ))

                                                }
                                                required
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                placeholder="Pessoa..."
                                            />





                                        </div>
                                    </Col>

                                }

                                <Col sm={3}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Referência <span style={{ color: "red" }} >*</span></label>
                                        <input type="number" onChange={event => { setREFERENCIA_D(event.target.value) }} defaultValue={REFERENCIA_D} className="form-control" placeholder="Referência..." required />
                                    </div>
                                </Col>

                                <Col sm={3}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Data <span style={{ color: "red" }} >*</span></label>
                                        <input type="date" onChange={event => { setDATA_D(event.target.value) }} defaultValue={DATA_D} className="form-control" placeholder="Data..." required />
                                    </div>
                                </Col>


                                <Col sm={2}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Prazo (dias)</label>
                                        <input type="number" value={PRAZO_D} min="0" disabled={tipo_pedido == "I"} onChange={event => { setPRAZO_D(event.target.value) }} className="form-control" placeholder="Prazo..." />
                                    </div>
                                </Col>


                                <Col sm={10}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Observação</label>
                                        <input type="text" onChange={event => { setOBS_D(event.target.value) }} defaultValue={OBS_D} className="form-control" placeholder="Observação..." />
                                    </div>
                                </Col>



                                {(tipo_pedido == "C" || tipo_pedido == "D") &&
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
                                }

                                    <>
                                        <Col sm={4}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Coima {coimaMin && coimaMax ? `(${coimaMin}€ - ${coimaMax}€)` : ""}</label>
                                                <input type="number" value={COIMA} min={coimaMin || undefined} max={coimaMax || undefined} onChange={event => { setCOIMA(event.target.value) }} className="form-control" placeholder="Coima..." />
                                            </div>
                                        </Col>
                                    </>




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

                            </>
                        }





                    </Row>

                </form>

            </Modal.Body>

            <Modal.Footer>
                <Button variant="danger" onClick={() => setisDepachoopen(false)}>Fechar</Button>
                <Button onClick={() => gerartextodespacho()} variant="primary">Gerar texto</Button>
                <Button onClick={() => setdespachotipo("SALVAR")} type="submit" form="criarDespacho" variant="primary">Guardar</Button>
                <Button onClick={() => setdespachotipo("CONCLUIR")} type="submit" form="criarDespacho" variant="primary">Concluir</Button>

            </Modal.Footer>

        </Modal>






    );












};
export default Customers;