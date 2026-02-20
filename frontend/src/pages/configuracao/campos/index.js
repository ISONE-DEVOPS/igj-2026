import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, Form } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import toast from 'react-hot-toast';


import { Link } from 'react-router-dom';





import api from '../../../services/api';

import useAuth from '../../../hooks/useAuth';

import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle, createDateToInput, createDateToUser } from '../../../functions';

import Table from '../../../components/Custom/Table';

const pageAcess = "/configuracao/campos"


const Campos = () => {


    const { permissoes } = useAuth();

    const history = useHistory();


    const { popUp_removerItem, popUp_alertaOK } = useAuth();



    const [infracaolist, setinfracaolist] = useState([]);
    const [entity, setentity] = useState("campos");

    async function uploadinfracao() {

        try {

            const response = await api.get('/sigjprcampo');

            if (response.status == '200') {

                setinfracaolist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }



    const columns = React.useMemo(
        () => [

            {
                Header: 'Código',
                accessor: 'CODIGO',
                centered: false
            },


            {
                Header: 'Campos',
                accessor: 'DESIG',
                centered: true
            },
            {
                Header: ' PESSOA',
                accessor: 'FLAG_PESSOA',
                centered: true
            },

            {
                Header: 'DECISÃO',
                accessor: 'FLAG_DECISAO',
                centered: true
            },
            {
                Header: 'ANEXAR DOC',
                accessor: 'FLAG_ANEXO_DOC',
                centered: true
            },

            {
                Header: 'OBSERVAÇÃO',
                accessor: 'FLAG_OBS',
                centered: true
            },


            {
                Header: 'DESTINATÁRIO',
                accessor: 'FLAG_DESTINATARIO',
                centered: true
            },
            {
                Header: ' INFRACÃO COIMA',
                accessor: 'FLAG_INFRACAO_COIMA',
                centered: true
            },
            {
                Header: ' PERIÓDO EXCLUSÃO',
                accessor: 'FLAG_PERIODO_EXCLUSAO',
                centered: true
            },
            {
                Header: ' TEXTO',
                accessor: 'FLAG_TEXTO',
                centered: true
            },

            {
                Header: 'Ações',
                accessor: 'action',
                centered: true
            },
        ],
        []
    );



    const [CODIGO, setCODIGO] = useState("");
    const [DESIG, setDESIG] = useState("");
    const [FLAG_PESSOA, setFLAG_PESSOA] = useState("0");
    const [FLAG_DECISAO, setFLAG_DECISAO] = useState("0");
    const [FLAG_ANEXO_DOC, setFLAG_ANEXO_DOC] = useState("0");
    const [FLAG_OBS, setFLAG_OBS] = useState("0");
    const [FLAG_DESTINATARIO, setFLAG_DESTINATARIO] = useState("0");
    const [FLAG_INFRACAO_COIMA, setFLAG_INFRACAO_COIMA] = useState("0");
    const [FLAG_TEXTO, setFLAG_TEXTO] = useState("0");
    const [FLAG_PERIODO_EXCLUSAO, setFLAG_PERIODO_EXCLUSAO] = useState("0");
    const [ESTADO, setESTADO] = useState("");
    const [ID, setID] = useState("");

    const [radioSelected, setRadioSelected] = useState("");


    const [itemSelected, setitemSelected] = useState({});



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    async function uploadlist() {

        try {

            const response = await api.get('/sigjprcampo');

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID


                    response.data[i].id = response.data[i].ID
                    response.data[i].id = response.data[i].ID
                    const itemx = response.data[i]

                    response.data[i].action =
                        <React.Fragment>

                            {taskEnable(pageAcess, permissoes, "Ler") == false ? null :
                                <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Ler")} onClick={() => openVerHandler(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Ler")} /></Link>
                            }

                            {taskEnable(pageAcess, permissoes, "Editar") == false ? null :
                                <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Editar")} onClick={() => openEditHandler(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Editar")} /></Link>
                            }

                            {taskEnable(pageAcess, permissoes, "Eliminar") == false ? null :
                                <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Eliminar")} onClick={() => removeItem(idx)} className="text-danger"><i className={"" + taskEnableIcon(pageAcess, permissoes, "Eliminar")} /></Link>
                            }

                        </React.Fragment>

                }

                console.log(response.data)

                setnewdata(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    //-------------------------------------------






    //-------------- Ver -------------------------



    const openVerHandler = (idx) => {
        setVerOpen(true);
        setIsEditarOpen(false);
        setIsOpen(false);
        setitemSelected(idx)
    };



    //-----------------------------------------------'




    //-------------- EDITAR -------------------------


    const openEditHandler = (idx) => {
        setIsEditarOpen(true);
        setIsOpen(false);
        setVerOpen(false);
        setitemSelected(idx)

        setID(idx.ID)
        setCODIGO(idx.CODIGO)
        setDESIG(idx.DESIG)

        // setPR_INFRACAO_TP_ID(idx.PR_INFRACAO_TP_ID)
        // setVALOR_MINIMO(idx.VALOR_MINIMO)
        // setVALOR_MAXIMO(idx.VALOR_MAXIMO)
        // setDT_INICIO(createDateToInput(idx.DT_INICIO))
        // setDT_FIM(createDateToInput(idx.DT_FIM))
        // setOBS(idx.OBS)

    };







    async function editarItemGO(event) {

        event.preventDefault();

        const upload = {
            DESIG
            // PR_INFRACAO_TP_ID,
            // VALOR_MINIMO,
            // VALOR_MAXIMO,
            // DT_INICIO,
            // DT_FIM,
            // OBS,
        }

        console.log(upload)


        try {

            const response = await api.put('/sigjprcampo/' + itemSelected.ID, upload);

            if (response.status == '200') {

                uploadlist()
                setIsEditarOpen(false)

            }

        } catch (err) {
            if (err.response.status === 400) {
                toast.error(err.response.data.message, { duration: 4000 })
                console.error(err.response)
            }
            console.error(err.response)

        }

    }


    //----------------------------------------------









    //-------------- CRIAR -------------------------


    const openHandler = () => {

        setIsOpen(true);
        setIsEditarOpen(false);
        setVerOpen(false);


        setCODIGO("*")
        setDESIG("")
    };

    function resetRadio() {
        setFLAG_INFRACAO_COIMA("0")
        setFLAG_ANEXO_DOC("0")
        setFLAG_OBS("0")
        setFLAG_DECISAO("0")
        setFLAG_PERIODO_EXCLUSAO("0")
        setFLAG_DESTINATARIO("0")
        setFLAG_TEXTO("0")
        setFLAG_PESSOA("0")
    }
    function handleChange(event) {
        setRadioSelected(event)
        resetRadio()
        switch (event) {
            case "coima":
                setFLAG_INFRACAO_COIMA("1")
                break;
            case "documento":
                setFLAG_ANEXO_DOC("1")
                break;
            case "obs":
                setFLAG_OBS("1")
                break;
            case "desicao":
                setFLAG_DECISAO("1")
                break;
            case "periodo":
                setFLAG_PERIODO_EXCLUSAO("1")
                break;
            case "destinatario":
                setFLAG_DESTINATARIO("1")
                break;
            case "texto":
                setFLAG_TEXTO("1")
                break;
            case "pessoa":
                setFLAG_PESSOA("1")
                break;
            default:
                break;
        }
        // const formState = Object.assign({}, this.state.form)
        // formState[event.target.name] = event.target.value
        // this.setState({form: formState})
    }


    async function criarItemGO(event) {
        event.preventDefault();
        if (radioSelected == null || radioSelected === "") {
            return;
        }
        const upload = {
            DESIG,
            FLAG_PESSOA,
            FLAG_DECISAO,
            FLAG_ANEXO_DOC,
            FLAG_OBS,
            FLAG_DESTINATARIO,
            FLAG_INFRACAO_COIMA,
            FLAG_PERIODO_EXCLUSAO,
            FLAG_TEXTO,
            ESTADO: "1",

        }
        console.log(upload)
        try {
            const response = await api.post('/sigjprcampo', upload);
            if (response.status == '200') {
                uploadlist()
                setIsOpen(false)
            }
        } catch (err) {
            if (err.response.status === 400) {
                toast.error(err.response.data.message, { duration: 4000 })
                console.error(err.response)
            }
        }
    }


    //----------------------------------------------










    //-------------- Remover -------------------------


    const removeItemFunction = async (idx) => {

        let res = true

        try {

            const response = await api.delete('/sigjprcampo/' + idx);


        } catch (err) {

            res = false
            console.error(err.response)
            popUp_alertaOK("Falha. Tente mais tarde")

        }

        uploadlist()

        return res

    };

    const removeItem = async (idx) => {

        popUp_removerItem({
            delete: removeItemFunction,
            id: idx,
        })


    }

    //-----------------------------------------------




    useEffect(() => {


        if (pageEnable(pageAcess, permissoes) == false) history.push('/')

        else {

            uploadlist()
            uploadinfracao()

        }

    }, [])







    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isNewentidade, setisNewentidade] = useState(false);



    function doNada() {

    }


    return (
        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Body>
                            <Table entity={entity} columns={columns} data={newdata} modalOpen={openHandler} permissoes={permissoes} pageAcess={pageAcess} />
                        </Card.Body>
                    </Card>

                    {/* --------------------Criar Item------------------- */}


                    <Modal size='lg' show={isOpen} onHide={() => setIsOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form className="campos w-100" id="criarItem" onSubmit={criarItemGO} >

                                <Row >
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value={CODIGO} />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">{"Designação"}<span style={{ color: "red" }} >*</span></label>
                                            <input type="text" className="form-control" id="Name" onChange={event => { setDESIG(event.target.value) }} defaultValue={DESIG} required />
                                        </div>
                                    </Col>


                                    {/* <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Início <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="date" onChange={event => { setDT_INICIO(event.target.value) }} defaultValue={DT_INICIO} className="form-control" required />
                                        </div>
                                    </Col> */}
                                </Row>
                                <Row className='mb-3'>

                                    <Col sm={3}>

                                        <Form.Check
                                            inline
                                            label="Infração Coima"
                                            name="fields"
                                            type="radio"
                                            id="coima"
                                            value="coima"
                                            onChange={e => handleChange(e.target.value)}

                                        />

                                    </Col>
                                    <Col sm={3}>
                                        <Form.Check
                                            inline
                                            label="Anexar Documentos"
                                            name="fields"
                                            type="radio"
                                            id="documento"
                                            value="documento"
                                            onChange={e => handleChange(e.target.value)}

                                        />
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Check
                                            inline
                                            label="Pessoa"
                                            name="fields"
                                            type="radio"
                                            id="pessoa"
                                            value="pessoa"
                                            onChange={e => handleChange(e.target.value)}

                                        />

                                    </Col>
                                    <Col sm={3}>
                                        <Form.Check
                                            inline
                                            label="Texto"
                                            name="fields"
                                            type="radio"
                                            id="texto"
                                            value="texto"
                                            onChange={e => handleChange(e.target.value)}

                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={3}>
                                        <Form.Check
                                            inline
                                            label="Destinatário"
                                            name="fields"
                                            type="radio"
                                            id="destinatario"
                                            value="destinatario"
                                            onChange={e => handleChange(e.target.value)}

                                        />
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Check
                                            inline
                                            label="Período Exclusão"
                                            name="fields"
                                            type="radio"
                                            id="periodo"
                                            value="periodo"
                                            onChange={e => handleChange(e.target.value)}

                                        />
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Check
                                            inline
                                            label="Decisão"
                                            name="fields"
                                            type="radio"
                                            id="desicao"
                                            value="desicao"
                                            onChange={e => handleChange(e.target.value)}

                                        />
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Check
                                            inline
                                            label="Observação"
                                            name="fields"
                                            type="radio"
                                            id="obs"
                                            value="obs"
                                            onChange={e => handleChange(e.target.value)}
                                        />
                                    </Col>
                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsOpen(false)}>Fechar</Button>
                            <Button type="submit" form="criarItem" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>


                    {/* --------------------Editar Item------------------- */}


                    <Modal size='lg' show={isEditarOpen} onHide={() => setIsEditarOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >
                            <form className="campos w-100" id="criarItem" onSubmit={editarItemGO} >
                                <Row>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value={CODIGO} />
                                        </div>
                                    </Col>
                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">{"Designação"}<span style={{ color: "red" }} >*</span></label>
                                            <input type="text" className="form-control" id="Name" onChange={event => { setDESIG(event.target.value) }} defaultValue={DESIG} required />
                                        </div>
                                    </Col>
                                    {/* <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Início <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="date" onChange={event => { setDT_INICIO(event.target.value) }} defaultValue={DT_INICIO} className="form-control" required />
                                        </div>
                                    </Col> */}
                                </Row>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsEditarOpen(false)}>Fechar</Button>
                            <Button type="submit" form="criarItem" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>
                    {/* --------------------Ver Item------------------- */}
                </Col>
            </Row>
        </React.Fragment>
    );












};
export default Campos;