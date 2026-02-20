import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, ListGroup } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
import { saveAs } from 'file-saver';

import api from '../../../../services/api';

import useAuth from '../../../../hooks/useAuth';


import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle } from '../../../../functions';


const pageAcess = "/entidades/entidades/banca"


function Table({ columns, data, modalOpen }) {


    const { permissoes } = useAuth();

    const [values, setValues] = useState()
    const params = useParams();


    function optionDownload(value) {
        if (value === "1") {
            exportPDF();
        } else if (value === "2") {
            exportExel()
        }
    }
    async function exportPDF() {
        try {
            const response = await api.get(`/export-pdf/sgigjentidadebanca`, { responseType: "blob" })
            if (response.status == '200') {
                const file = new Blob([response.data], { type: "application/pdf" });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                const pdfWindow = window.open();
                pdfWindow.location.href = fileURL;
            }

            console.log(response)

        } catch (err) {

            console.error(err.response)
        }

    }

    async function exportExel() {
        try {

            const response = await api.get(`/export-csv/sgigjentidadebanca`, { responseType: "blob" })

            if (response.status == '200') {
                const file = new Blob([response.data], { type: "api/csv" });
                //Build a URL from the file
                const blob = new Blob([response.data], { type: 'text/csv' });
                saveAs(blob, 'data.csv');

            }

            console.log(response)

        } catch (err) {

            console.error(err.response)
        }


    }
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,

        globalFilter,
        setGlobalFilter,

        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 }
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    return (
        <>
            <Row className='mb-3'>
                <Col md={3} className="d-flex align-items-center">
                    Mostrar
                    <select
                        className='form-control w-auto mx-2'
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[5, 10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    entradas
                </Col>
                <Col md={9} className='d-flex justify-content-end'>
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    {taskEnable(pageAcess, permissoes, "Criar") == false ? null :
                        <Button variant="primary" className="btn-sm btn-round has-ripple ml-2" onClick={modalOpen} ><i className="feather icon-plus" /> Adicionar</Button>
                    }
                    <select
                        style={{ marginLeft: "10px" }}
                        value={values}
                        onChange={(e) => { optionDownload(e.target.value) }}
                    >
                        <option value=""> Download </option>
                        <option value="1"> PDF </option>
                        <option value="2"> EXCEL </option>
                    </select>
                </Col>
            </Row>
            <BTable striped bordered hover responsive {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <span className='feather icon-arrow-down text-muted float-right' />
                                                : <span className='feather icon-arrow-up text-muted float-right' />
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        const isCentered = cell.column.centered;
                                        return (
                                            <td  {...cell.getCellProps()} className={isCentered ? 'text-center' : 'text-right'}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                </tbody>
            </BTable>
            <Row className='justify-content-between'>
                <Col>
                    <span className="d-flex align-items-center">
                        Página{' '} <strong> {pageIndex + 1} de {pageOptions.length} </strong>{' '}
                        | Ir para a página:{' '}
                        <input
                            type="number"
                            className='form-control ml-2'
                            defaultValue={pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                            }}
                            style={{ width: '100px' }}
                        />
                    </span>
                </Col>
                <Col>
                    <Pagination className='justify-content-end'>
                        <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
                        <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
                        <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
                        <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
                    </Pagination>
                </Col>
            </Row>
        </>
    )
}



const Banca = () => {

    const { id } = useParams();

    const [id_params, setid_params] = useState("0");

    const { popUp_removerItem, popUp_alertaOK } = useAuth();


    const { permissoes } = useAuth();

    const history = useHistory();


    const columns = React.useMemo(
        () => [

            {
                Header: 'Código',
                accessor: 'CODIGO',
                centered: false
            },



            {
                Header: 'Entidade',
                accessor: 'ENTIDADE',
                centered: true
            },

            {
                Header: 'Tipo de Banca',
                accessor: 'TIPOBANCA',
                centered: true
            },

            {
                Header: 'Banca',
                accessor: 'BANCA',
                centered: true
            },


            {
                Header: 'Status',
                accessor: 'STATUS',
                centered: true
            },

            {
                Header: 'Data',
                accessor: 'DATA',
                centered: true
            },

            {
                Header: 'NUM_SERIE',
                accessor: 'NUM_SERIE',
                centered: false
            },


            {
                Header: 'Ações',
                accessor: 'action',
                centered: true
            },
        ],
        []
    );


    const [PR_BANCA_TP_ID, setPR_BANCA_TP_ID] = useState("");
    const [ENTIDADE_ID, setENTIDADE_ID] = useState("");
    const [PR_STATUS_ID, setPR_STATUS_ID] = useState("");
    const [BANCA, setBANCA] = useState("");
    const [NUM_SERIE, setNUM_SERIE] = useState("");
    const [DT_AQUISICAO, setDT_AQUISICAO] = useState("");
    const [OBS, setOBS] = useState("");


    const [ID_C, setID_C] = useState("");
    const [DESIG_C, setDESIG_C] = useState("");
    const [ENTIDADE_ID_C, setENTIDADE_ID_C] = useState("");
    const [OBS_C, setOBS_C] = useState("");
    const [ESTADO_C, setESTADO_C] = useState("");



    const [itemSelected, setitemSelected] = useState({
        sgigjentidade: {},
        sgigjprbancatp: {},
        sgigjprstatus: {},
    });



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    async function uploadlist() {


        setid_params(id)



        try {

            const response = await api.get('/sgigjentidadebanca?ENTIDADE_ID=' + id);

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID


                    response.data[i].id = response.data[i].ID

                    response.data[i].DATA = createDate1(response.data[i].DT_AQUISICAO)
                    response.data[i].DATA2 = createDate2(response.data[i].DT_AQUISICAO)

                    response.data[i].ENTIDADE = response.data[i].sgigjentidade.DESIG
                    response.data[i].STATUS = response.data[i].sgigjprstatus.DESIG
                    response.data[i].TIPOBANCA = response.data[i].sgigjprbancatp.DESIG


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

                setnewdata(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    function createDate1(data) {

        if (data == null) return


        let res = new Date(data).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }).split(' ').join('-');

        res = res.replace('/', '-')

        return res.replace('/', '-')

    }


    function createDate2(data) {

        if (data == null) return


        return data.slice(0, 10)


    }



    const [entidadelist, setentidadelist] = useState([]);

    async function uploadentidadelist() {

        try {

            const response = await api.get('/sgigjentidade');

            if (response.status == '200') {

                setentidadelist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }




    const [prbancatp, setprbancatp] = useState([]);

    async function uploadeprbancatp() {

        try {

            const response = await api.get('/sgigjprbancatp');

            if (response.status == '200') {

                setprbancatp(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }





    const [prstatus, setprstatus] = useState([]);

    async function uploadesetprstatus() {

        try {

            const response = await api.get('/sgigjprstatus');

            if (response.status == '200') {

                setprstatus(response.data)

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

        setENTIDADE_ID(idx.ENTIDADE_ID)
        setPR_BANCA_TP_ID(idx.PR_BANCA_TP_ID)
        setPR_STATUS_ID(idx.PR_STATUS_ID)
        setBANCA(idx.BANCA)
        setNUM_SERIE(idx.NUM_SERIE)
        setDT_AQUISICAO(idx.DT_AQUISICAO)
        setOBS(idx.OBS)
        //setESTADO_C(idx.ID)
    };







    async function editarItemGO(event) {

        event.preventDefault();
        setIsLoading(true)


        const upload = {

            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,
            PR_BANCA_TP_ID,
            ENTIDADE_ID_C,
            PR_STATUS_ID,
            BANCA,
            NUM_SERIE,
            DT_AQUISICAO,
            OBS,
            ESTADO: "0"

        }

        console.log(upload)


        try {

            const response = await api.put('/sgigjentidadebanca/' + itemSelected.ID, upload);

            if (response.status == '200') {

                uploadlist()
                setIsLoading(false)

                setIsEditarOpen(false)

            }

        } catch (err) {
            setIsLoading(false)

            console.error(err.response)

        }

    }


    //----------------------------------------------









    //-------------- CRIAR -------------------------


    const openHandler = () => {
        setIsOpen(true);
        setIsEditarOpen(false);
        setVerOpen(false);


        setID_C("")
        setDESIG_C("")
        setOBS_C("")
        setESTADO_C("")
    };





    async function criarItemGO(event) {

        event.preventDefault();
        setIsLoading(true)

        const upload = {

            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,
            PR_BANCA_TP_ID,
            ENTIDADE_ID_C,
            PR_STATUS_ID,
            BANCA,
            NUM_SERIE,
            DT_AQUISICAO,
            OBS,
            ESTADO: "0"

        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjentidadebanca', upload);

            if (response.status == '200') {

                uploadlist()
                setIsLoading(false)

                setIsOpen(false)

            }

        } catch (err) {
            setIsLoading(false)

            console.error(err.response)

        }

    }


    //----------------------------------------------










    //-------------- Remover -------------------------



    const removeItemFunction = async (idx) => {

        let res = true

        try {

            const response = await api.delete('/sgigjentidadebanca/' + idx);


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
            uploadeprbancatp()
            uploadesetprstatus()
            uploadentidadelist()

        }

    }, [])





    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isNewentidade, setisNewentidade] = useState(false);



    function doNada() {

    }


    //--------------- Criar Status ----------------

    function openstatus() {

        //setIsOpen(false)
        setisstatusopen(true)

        setOBS_S("")
        setDESIG_S("")

    }

    const [isstatusopen, setisstatusopen] = useState(false);

    const [DESIG_S, setDESIG_S] = useState("");
    const [OBS_S, setOBS_S] = useState("");


    async function criarStatusGO(event) {

        event.preventDefault();


        const upload = {

            DESIG: DESIG_S,
            OBS: OBS_S,


        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjprstatus', upload);

            if (response.status == '200') {

                uploadesetprstatus()
                setisstatusopen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }






    //--------------- Criar Banca ----------------

    function openbanca() {

        //setIsOpen(false)
        setisbancaopen(true)

        setOBS_B("")
        setDESIG_B("")

    }

    const [isbancaopen, setisbancaopen] = useState(false);

    const [DESIG_B, setDESIG_B] = useState("");
    const [OBS_B, setOBS_B] = useState("");


    async function criarBancaGO(event) {

        event.preventDefault();


        const upload = {

            DESIG: DESIG_B,
            OBS: OBS_B,


        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjprbancatp', upload);

            if (response.status == '200') {

                uploadeprbancatp()
                setisbancaopen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }





    return (<>

        {/* <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <div className="page-header-title">
                            <h5 className="m-b-10">Bancas</h5>
                        </div>
                        <ListGroup as='ul' bsPrefix=' ' className="breadcrumb">
                            <ListGroup.Item as='li' bsPrefix=' ' className="breadcrumb-item">
                                <Link to="/"><i className="feather icon-grid" /></Link>
                            </ListGroup.Item>
                            <ListGroup.Item as='li' bsPrefix=' ' className="breadcrumb-item">
                                <Link to='#'>Entidades</Link>
                            </ListGroup.Item>
                            <ListGroup.Item as='li' bsPrefix=' ' className="breadcrumb-item">
                                <Link to='/entidades/entidades'>Entidades</Link>
                            </ListGroup.Item>
                            <ListGroup.Item as='li' bsPrefix=' ' className="breadcrumb-item">
                                <Link to='#'>Bancas</Link>
                            </ListGroup.Item>

                        </ListGroup>
                    </div>
                </div>
            </div>
        </div> */}
        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Body>
                            <Table columns={columns} data={newdata} modalOpen={openHandler} />
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
                                            <input disabled type="text" className="form-control" id="Name" value="*" required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Entidade <span style={{ color: "red" }} >*</span></label>

                                            <input disabled type="text" className="form-control" id="Name" value={

                                                entidadelist.map(e => (
                                                    e.ID == id_params ? e.DESIG : null
                                                )).join('')

                                            } required />

                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Banca <span style={{ color: "red" }} >*</span></label>

                                            <input maxLength="128" type="text" onChange={event => { setBANCA(event.target.value) }} defaultValue={""} className="form-control" placeholder="Banca..." required />

                                        </div>
                                    </Col>



                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tipo de Banca <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setPR_BANCA_TP_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {prbancatp.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/tipobanca", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => openbanca()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }
                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Status <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setPR_STATUS_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">Selecione</option>

                                                    {prstatus.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/status", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => openstatus()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }
                                            </span>

                                        </div>
                                    </Col>




                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Aquisição <span style={{ color: "red" }} >*</span></label>

                                            <input type="date" onChange={event => { setDT_AQUISICAO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />

                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Número de Serie <span style={{ color: "red" }} >*</span></label>

                                            <input maxLength="25" type="text" onChange={event => { setNUM_SERIE(event.target.value) }} defaultValue={""} className="form-control" placeholder="Número..." required />

                                        </div>
                                    </Col>



                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Observação</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setOBS(event.target.value) }} defaultValue={""} rows="3" placeholder='Observação...' />
                                        </div>
                                    </div>


                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsOpen(false)}>Fechar</Button>

                            {!isLoading ? <Button type="submit" form="criarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

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
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value="*" required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label disabled className="floating-label" htmlFor="Name">Entidade <span style={{ color: "red" }} >*</span></label>



                                            <input disabled type="text" className="form-control" id="Name" value={

                                                entidadelist.map(e => (
                                                    e.ID == itemSelected.ENTIDADE_ID ? e.DESIG : null
                                                )).join('')

                                            } required />



                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Banca <span style={{ color: "red" }} >*</span></label>

                                            <input maxLength="128" defaultValue={itemSelected.BANCA} type="text" onChange={event => { setBANCA(event.target.value) }} className="form-control" placeholder="Banca..." required />

                                        </div>
                                    </Col>




                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tipo de Banca <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={itemSelected.PR_BANCA_TP_ID} onChange={event => { setPR_BANCA_TP_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {prbancatp.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>


                                                {taskEnable("/configuracao/tipobanca", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => openbanca()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }

                                            </span>

                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Status <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={itemSelected.PR_STATUS_ID} onChange={event => { setPR_STATUS_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">Selecione</option>

                                                    {prstatus.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>


                                                {taskEnable("/configuracao/status", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => openstatus()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }

                                            </span>

                                        </div>
                                    </Col>



                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Aquisição <span style={{ color: "red" }} >*</span></label>

                                            <input type="date" onChange={event => { setDT_AQUISICAO(event.target.value) }} defaultValue={itemSelected.DATA2} className="form-control" placeholder="Data..." required />

                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Número de Serie <span style={{ color: "red" }} >*</span></label>

                                            <input maxLength="25" defaultValue={itemSelected.NUM_SERIE} type="text" onChange={event => { setNUM_SERIE(event.target.value) }} className="form-control" placeholder="Número..." required />

                                        </div>
                                    </Col>



                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Observação</label>
                                            <textarea maxLength="64000" defaultValue={itemSelected.OBS} className="form-control" onChange={event => { setOBS(event.target.value) }} defaultValue={""} rows="3" placeholder='Observação...' />
                                        </div>
                                    </div>




                                </Row>

                            </form>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsEditarOpen(false)}>Fechar</Button>
                            {!isLoading ? <Button type="submit" form="editarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

                        </Modal.Footer>
                    </Modal>

                    {/* --------------------Ver Item------------------- */}

                    <Modal size='x' show={isVerOpen} onHide={() => setVerOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Banca</Modal.Title>
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
                                        <label disabled className="floating-label" htmlFor="Name">Entidade</label>



                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.ENTIDADE}</span>

                                    </div>
                                </Col>

                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Banca</label>


                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.BANCA}</span>

                                    </div>
                                </Col>



                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Tipo de Banca</label>


                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.TIPOBANCA}</span>

                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Status</label>


                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.STATUS}</span>

                                    </div>
                                </Col>




                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Data Aquisição</label>

                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.DATA2}</span>

                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Número de Serie</label>


                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.NUM_SERIE}</span>

                                    </div>
                                </Col>



                                <div className="col-sm-12">
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Address">Observação</label>

                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.OBS}</span>
                                    </div>
                                </div>


                            </Row>


                        </Modal.Body>



                    </Modal>


                    {/* --------------------Criar Status------------------- */}

                    <Modal size='x' show={isstatusopen} onHide={() => setisstatusopen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar Status</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarStatus" onSubmit={criarStatusGO} >

                                <Row>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value="*" required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="text" onChange={event => { setDESIG_S(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setOBS_S(event.target.value) }} defaultValue={""} rows="3" placeholder='Descrição...' />
                                        </div>
                                    </div>


                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setisstatusopen(false)}>Fechar</Button>
                            <Button type="submit" form="criarStatus" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>



                    {/* --------------------Criar Tipo Banca------------------- */}

                    <Modal size='x' show={isbancaopen} onHide={() => setisbancaopen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar Tipo de Banca</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarTipoBanca" onSubmit={criarBancaGO} >

                                <Row>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value="*" required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="text" onChange={event => { setDESIG_B(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setOBS_B(event.target.value) }} defaultValue={""} rows="3" placeholder='Descrição...' />
                                        </div>
                                    </div>


                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setisbancaopen(false)}>Fechar</Button>
                            <Button type="submit" form="criarTipoBanca" variant="primary">Guardar</Button>
                        </Modal.Footer>
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
    </>
    );












};
export default Banca;