import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, ListGroup } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";

import useAuth from '../../../../hooks/useAuth';

import { saveAs } from 'file-saver';


import api from '../../../../services/api';


import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle, setParams } from '../../../../functions';


const pageAcess = "/entidades/entidades/grupo"

function Table({ uploadList, columns, data, modalOpen }) {

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
            const response = await api.get(`/export-pdf/sgigjentidadegrupo`, { responseType: "blob" })
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


    function reloadList() {

        uploadList()

    }
    async function exportExel() {
        try {

            const response = await api.get(`/export-csv/sgigjentidadegrupo`)

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



const Grupo = () => {


    const { permissoes } = useAuth();

    const history = useHistory();

    const { id } = useParams();

    const [id_params, setid_params] = useState("0");


    const { popUp_removerItem, popUp_alertaOK } = useAuth();


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
                Header: 'Designação',
                accessor: 'DESIG',
                centered: true
            },

            {
                Header: 'Tipo',
                accessor: 'TIPO',
                centered: true
            },

            {
                Header: 'Descrição',
                accessor: 'DESCR',
                centered: true
            },

            {
                Header: 'Data',
                accessor: 'DATA',
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


    const [ID_C, setID_C] = useState("");
    const [DESIG_C, setDESIG_C] = useState("");
    const [DESCR_C, setDESCR_C] = useState("");
    const [ESTADO_C, setESTADO_C] = useState("");
    const [ENTIDADE_ID_C, setENTIDADE_ID_C] = useState("");
    const [TIPO_C, setTIPO_C] = useState("");


    const [itemSelected, setitemSelected] = useState({ sgigjentidade: {} });



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    async function uploadlist() {



        setid_params(id)



        try {

            const response = await api.get('/sgigjentidadegrupo?ENTIDADE_ID=' + id);

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID


                    response.data[i].id = response.data[i].ID

                    response.data[i].ENTIDADE = response.data[i].sgigjentidade.DESIG

                    response.data[i].DATA = createDate1(response.data[i].DT_REGISTO)


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

        return res.replace('/', '-') + " " + data.substring(11, 16)

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

        setID_C(idx.ID)
        setDESIG_C(idx.DESIG)
        setDESCR_C(idx.DESCR)
        setENTIDADE_ID_C(idx.ENTIDADE_ID)
        setTIPO_C(idx.TIPO)
        //setESTADO_C(idx.ID)
    };







    async function editarItemGO(event) {

        event.preventDefault();
        setIsLoading(true)

        const upload = {

            DESIG: DESIG_C,
            TIPO: TIPO_C,
            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID_C : id_params,
            DESCR: DESCR_C,


        }

        console.log(upload)


        try {

            const response = await api.put('/sgigjentidadegrupo/' + itemSelected.ID, upload);

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
        setDESCR_C("")
        setESTADO_C("")
        setTIPO_C("")
        setENTIDADE_ID_C("")
    };





    async function criarItemGO(event) {

        event.preventDefault();
        setIsLoading(true)

        const upload = {

            DESIG: DESIG_C,
            TIPO: TIPO_C,
            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID_C : id_params,
            DESCR: DESCR_C,


        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjentidadegrupo', upload);

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

            const response = await api.delete('/sgigjentidadegrupo/' + idx);


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
            uploadentidadelist()

        }



    }, [])





    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isNewentidade, setisNewentidade] = useState(false);



    function doNada() {

    }


    return (<>

        {/* <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <div className="page-header-title">
                            <h5 className="m-b-10">Grupos</h5>
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
                                <Link to='#'>Grupos</Link>
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
                                                    e.ID == id_params ? e.DESIG : ""
                                                )).join('')

                                            } required />


                                        </div>
                                    </Col>


                                    <Col sm={8}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="text" onChange={event => { setDESIG_C(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>

                                    </Col>

                                    <Col sm={4}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tipo <span style={{ color: "red" }} >*</span></label>
                                            <select onChange={event => { setTIPO_C(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">Selecione</option>
                                                <option value="Tipo 1">Tipo 1</option>
                                                <option value="Tipo 2">Tipo 2</option>
                                                <option value="Tipo 3">Tipo 3</option>
                                                <option value="Tipo 4">Tipo 4</option>
                                                <option value="Tipo 5">Tipo 5</option>


                                            </select>
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setDESCR_C(event.target.value) }} defaultValue={""} rows="3" placeholder='Descrição...' />
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
                                            <label disabled className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" disabled onChange={() => doNada()} value={itemSelected.CODIGO} className="form-control" id="Name" placeholder="code" required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Entidade <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" disabled onChange={() => doNada()} value={itemSelected.ENTIDADE} className="form-control" id="Name" placeholder="code" required />
                                        </div>
                                    </Col>


                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" maxLength="128" onChange={event => { setDESIG_C(event.target.value) }} defaultValue={itemSelected.DESIG} className="form-control" id="Utilizador" placeholder="Designação..." required />
                                        </div>
                                    </Col>


                                    <Col sm={4}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tipo <span style={{ color: "red" }} >*</span></label>
                                            <select onChange={event => { setTIPO_C(event.target.value) }} defaultValue={itemSelected.TIPO} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">Selecione</option>
                                                <option value="Tipo 1">Tipo 1</option>
                                                <option value="Tipo 2">Tipo 2</option>
                                                <option value="Tipo 3">Tipo 3</option>
                                                <option value="Tipo 4">Tipo 4</option>
                                                <option value="Tipo 5">Tipo 5</option>


                                            </select>
                                        </div>
                                    </Col>



                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setDESCR_C(event.target.value) }} defaultValue={itemSelected.DESCR} id="Address" rows="3" placeholder='Descrição...' />
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
                            <Modal.Title as="h5">Grupo</Modal.Title>
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
                                        <label className="floating-label" htmlFor="Name">Entidade</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.ENTIDADE}</span>
                                    </div>
                                </Col>

                                <Col sm={8}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Designação</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.DESIG}</span>
                                    </div>
                                </Col>

                                <Col sm={4}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Tipo</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.TIPO}</span>
                                    </div>
                                </Col>


                                <div className="col-sm-12">
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Address">Descrição</label>
                                        <label style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.DESCR}</label>

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
    </>
    );












};
export default Grupo;