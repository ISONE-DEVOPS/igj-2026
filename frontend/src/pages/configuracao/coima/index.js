import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import toast from 'react-hot-toast';


import { Link } from 'react-router-dom';





import api from '../../../services/api';

import useAuth from '../../../hooks/useAuth';

import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle, createDateToInput, createDateToUser } from '../../../functions';

import Table from '../../../components/Custom/Table';

const pageAcess = "/configuracao/coima"


const Customers = () => {


    const { permissoes } = useAuth();

    const history = useHistory();


    const { popUp_removerItem, popUp_alertaOK } = useAuth();



    const [infracaolist, setinfracaolist] = useState([]);

    async function uploadinfracao() {

        try {

            const response = await api.get('/sgigjprinfracaotp');

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
                Header: 'Infração',
                accessor: 'INFRACAO',
                centered: true
            },
            {
                Header: 'Valor Mínimo',
                accessor: 'VALOR_MINIMO',
                centered: false
            },

            {
                Header: 'Valor Máximo',
                accessor: 'VALOR_MAXIMO',
                centered: false
            },
            {
                Header: 'Data Início',
                accessor: 'DT_INICIO',
                centered: true
            },

            {
                Header: 'Data Fim',
                accessor: 'DT_FIM',
                centered: true
            },


            {
                Header: 'Observação',
                accessor: 'OBS',
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
    const [PR_INFRACAO_TP_ID, setPR_INFRACAO_TP_ID] = useState("");
    const [VALOR_MINIMO, setVALOR_MINIMO] = useState("");
    const [VALOR_MAXIMO, setVALOR_MAXIMO] = useState("");
    const [DT_INICIO, setDT_INICIO] = useState("");
    const [DT_FIM, setDT_FIM] = useState("");
    const [OBS, setOBS] = useState("");


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

            const response = await api.get('/sgigjinfracaocoima');

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID


                    response.data[i].id = response.data[i].ID
                    response.data[i].INFRACAO = response.data[i].sgigjprinfracaotp?.DESIG
                    response.data[i].DT_INICIO = formatDate(response.data[i].DT_INICIO)
                    if (response.data[i].DT_FIM) {
                        response.data[i].DT_FIM = formatDate(response.data[i].DT_FIM)
                    }
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



        setCODIGO(idx.CODIGO)
        setPR_INFRACAO_TP_ID(idx.PR_INFRACAO_TP_ID)
        setVALOR_MINIMO(idx.VALOR_MINIMO)
        setVALOR_MAXIMO(idx.VALOR_MAXIMO)
        setDT_INICIO(createDateToInput(idx.DT_INICIO))
        setDT_FIM(createDateToInput(idx.DT_FIM))
        setOBS(idx.OBS)

    };







    async function editarItemGO(event) {

        event.preventDefault();


        const upload = {

            PR_INFRACAO_TP_ID,
            VALOR_MINIMO,
            VALOR_MAXIMO,
            DT_INICIO,
            DT_FIM,
            OBS,
        }

        console.log(upload)


        try {

            const response = await api.put('/sgigjinfracaocoima/' + itemSelected.ID, upload);

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
        setPR_INFRACAO_TP_ID("")
        setVALOR_MINIMO("")
        setVALOR_MAXIMO("")
        setDT_INICIO("")
        setDT_FIM("")
        setOBS("")

    };





    async function criarItemGO(event) {
        event.preventDefault();

        const upload = {

            PR_INFRACAO_TP_ID,
            VALOR_MINIMO,
            VALOR_MAXIMO,
            DT_INICIO,
            DT_FIM,
            OBS,
            ESTADO: "1",

        }

        console.log(upload)
        try {
            const response = await api.post('/sgigjinfracaocoima', upload);
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

            const response = await api.delete('/sgigjinfracaocoima/' + idx);


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
                            <Table columns={columns} data={newdata} modalOpen={openHandler} permissoes={permissoes} pageAcess={pageAcess} />
                        </Card.Body>
                    </Card>

                    {/* --------------------Criar Item------------------- */}


                    <Modal size='x' show={isOpen} onHide={() => setIsOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarItem" onSubmit={criarItemGO} >

                                <Row>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value={CODIGO} required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">{"Infração"}<span style={{ color: "red" }} >*</span></label>
                                            <select onChange={event => { setPR_INFRACAO_TP_ID(event.target.value) }} className="form-control" id="perfil" defaultValue={PR_INFRACAO_TP_ID} required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>


                                                {infracaolist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}



                                            </select>
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Valor Mínimo <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="number" onChange={event => { setVALOR_MINIMO(event.target.value) }} defaultValue={VALOR_MINIMO} className="form-control" placeholder="Valor..." required />
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Valor Máximo <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="number" onChange={event => { setVALOR_MAXIMO(event.target.value) }} defaultValue={VALOR_MAXIMO} className="form-control" placeholder="Valor..." required />
                                        </div>
                                    </Col>



                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Início <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="date" onChange={event => { setDT_INICIO(event.target.value) }} defaultValue={DT_INICIO} className="form-control" required />
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Fim</label>
                                            <input maxLength="128" type="date" onChange={event => { setDT_FIM(event.target.value) }} defaultValue={DT_FIM} className="form-control" />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Observação</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setOBS(event.target.value) }} defaultValue={OBS} rows="3" placeholder='Observação...' />
                                        </div>
                                    </div>


                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsOpen(false)}>Fechar</Button>
                            <Button type="submit" form="criarItem" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>


                    {/* --------------------Editar Item------------------- */}


                    <Modal size='x' show={isEditarOpen} onHide={() => setIsEditarOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Editar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="editarItem" onSubmit={editarItemGO} >


                                <Row>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label disabled className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" disabled onChange={() => doNada()} value={CODIGO} className="form-control" id="Name" placeholder="code" required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">{"Infração"}<span style={{ color: "red" }} >*</span></label>
                                            <select onChange={event => { setPR_INFRACAO_TP_ID(event.target.value) }} className="form-control" id="perfil" defaultValue={PR_INFRACAO_TP_ID} required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>


                                                {infracaolist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}



                                            </select>
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Valor Mínimo <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="number" onChange={event => { setVALOR_MINIMO(event.target.value) }} defaultValue={VALOR_MINIMO} className="form-control" placeholder="Valor..." required />
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Valor Máximo <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="number" onChange={event => { setVALOR_MAXIMO(event.target.value) }} defaultValue={VALOR_MAXIMO} className="form-control" placeholder="Valor..." required />
                                        </div>
                                    </Col>



                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Início <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="date" onChange={event => { setDT_INICIO(event.target.value) }} defaultValue={DT_INICIO} className="form-control" required />
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Fim</label>
                                            <input maxLength="128" type="date" onChange={event => { setDT_FIM(event.target.value) }} defaultValue={DT_FIM} className="form-control" />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Observação</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setOBS(event.target.value) }} defaultValue={OBS} rows="3" placeholder='Observação...' />
                                        </div>
                                    </div>




                                </Row>

                            </form>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsEditarOpen(false)}>Fechar</Button>
                            <Button type="submit" form="editarItem" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* --------------------Ver Item------------------- */}

                    <Modal size='x' show={isVerOpen} onHide={() => setVerOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Coima</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <Row style={{ width: "100%", overflow: "auto" }}>
                                <Col sm={4}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Código</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.CODIGO}</span>
                                    </div>
                                </Col>

                                <Col sm={8}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Designação</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{


                                            infracaolist.filter(e => (e.ID == itemSelected.PR_INFRACAO_TP_ID)).map(e => (e.DESIG))

                                        }</span>
                                    </div>
                                </Col>


                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Valor Mínimo</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.VALOR_MINIMO}</span>
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Valor Mínimo</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.VALOR_MAXIMO}</span>
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Data Início</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{createDateToUser(itemSelected.DT_INICIO)}</span>
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Data Fim</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{createDateToUser(itemSelected.DT_FIM)}</span>
                                    </div>
                                </Col>


                                <div className="col-sm-12">
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Address">Observação</label>
                                        <label style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.OBS}</label>

                                    </div>
                                </div>




                            </Row>
                        </Modal.Body>
                    </Modal>



                    <Modal size="lg" show={isNewentidade} onHide={() => setisNewentidade(false)}>


                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setisNewentidade(false)}>Fechar</Button>
                            <Button variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>

                </Col>
            </Row>
        </React.Fragment>
    );












};
export default Customers;