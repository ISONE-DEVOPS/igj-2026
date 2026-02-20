import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, Form } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';


import { Link } from 'react-router-dom';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";



import api from '../../../services/api';

import iconlist from '../../../data/iconlist';
import acaolist from '../../../data/acaolist';
import tabelalist from '../../../data/tabelalist';


import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle } from '../../../functions';

import useAuth from '../../../hooks/useAuth';



const pageAcess = "/administracao/accoesmenu"



function Table({ columns, data, modalOpen }) {

    const { permissoes } = useAuth();

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
                <Col className="d-flex align-items-center">
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
                <Col className='d-flex justify-content-end'>
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

                    {taskEnable(pageAcess, permissoes, "Criar") == false ? null :
                        <Button variant="primary" className="btn-sm btn-round has-ripple ml-2" onClick={modalOpen} ><i className="feather icon-plus" /> Adicionar</Button>
                    }
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
                                            <td className={isCentered ? 'text-center' : 'text-right'} {...cell.getCellProps({
                                                style: {
                                                    minWidth: cell.column.minWidth,
                                                    width: cell.column.width,
                                                    maxWidth: cell.column.maxWidth,
                                                    textAlign: cell.column.textAlign,
                                                },
                                            })}>{cell.render('Cell')}</td>
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



const Customers = () => {



    const { permissoes } = useAuth();

    const history = useHistory();


    const { popUp_removerItem, popUp_alertaOK } = useAuth();


    const columns = React.useMemo(
        () => [

            {
                Header: '',
                accessor: 'ICON2',
                maxWidth: 30,
                minWidth: 30,
                width: 30,
                textAlign: "center",
                centered: true
            },
            {
                Header: 'Designação',
                accessor: 'DS_MENU',
                centered: true
            },
            {
                Header: 'Página',
                accessor: 'ITEM',
                centered: true
            },
            {
                Header: 'URL da Página',
                accessor: 'ITEMURL',
                centered: true
            },
            {
                Header: 'Icon',
                accessor: 'URL_ICON',
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

    const [isLoading, setIsLoading] = useState(false)

    const [ID_C, setID_C] = useState("");
    const [SELF_ID, setSELF_ID] = useState("");
    const [DS_MENU, setDS_MENU] = useState("");
    const [URL_ICON, setURL_ICON] = useState("");
    const [ACAO, setACAO] = useState("");
    const [TABELA, setTABELA] = useState("");


    const [itemSelected, setitemSelected] = useState({});



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);

    async function uploadlist() {

        try {

            const response = await api.get('/glbmenu?TIPO=task');

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID


                    response.data[i].id = response.data[i].ID

                    if (response.data[i].SELF_ID != null) response.data[i].ITEM = response.data[i].glbmenu_self.DS_MENU
                    if (response.data[i].SELF_ID != null) response.data[i].ITEMURL = response.data[i].glbmenu_self.URL


                    response.data[i].URL2 = response.data[i].URL.split("/")


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

                    if (response.data[i].URL_ICON != null) response.data[i].ICON2 = <i className={response.data[i].URL_ICON} />


                }

                setnewdata(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    const [glbmenulist, setglbmenulist] = useState([]);

    async function uploadglbmenulist() {

        try {

            const response = await api.get('/glbmenu?');

            if (response.status == '200') {

                setglbmenulist(response.data)

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

        setSELF_ID(idx.SELF_ID);
        setDS_MENU(idx.DS_MENU);
        setURL_ICON(idx.URL_ICON);

        if (typeof (idx.URL2) != "undefined") {

            setACAO(idx.URL2[2])
            setTABELA(idx.URL2[1])

        } else {

            setACAO("")
            setTABELA("")

        }

    };







    async function editarItemGO(event) {

        event.preventDefault();


        const upload = {

            SELF_ID,
            DS_MENU,
            URL_ICON,
            URL: "/" + TABELA + "/" + ACAO,
            TIPO: "task",
            ORDEM: "0",
            ESTADO: "1"


        }

        console.log(upload)


        try {

            const response = await api.put('/glbmenu/' + itemSelected.ID, upload);

            if (response.status == '200') {

                uploadlist()
                setIsEditarOpen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }


    //----------------------------------------------









    //-------------- CRIAR -------------------------


    const openHandler = () => {
        setIsOpen(true);
        setIsEditarOpen(false);
        setVerOpen(false);


        setSELF_ID("");
        setDS_MENU("");
        setURL_ICON("");
        setACAO("")
        setTABELA("")
        setURL_ICON("")



    };





    async function criarItemGO(event) {

        event.preventDefault();


        const upload = {

            SELF_ID,
            DS_MENU,
            URL_ICON,
            URL: "/" + TABELA + "/" + ACAO,
            TIPO: "task",
            ORDEM: "0",
            ESTADO: "1"


        }

        console.log(upload)


        try {

            const response = await api.post('/glbmenu', upload);

            if (response.status == '200') {

                uploadlist()
                setIsOpen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }


    //----------------------------------------------










    //-------------- Remover -------------------------





    const removeItemFunction = async (idx) => {

        let res = true

        try {

            const response = await api.delete('/glbmenu/' + idx);


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
            uploadglbmenulist()

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








                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" onChange={event => { setDS_MENU(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Perfil">Icon <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control" onChange={event => { setURL_ICON(event.target.value) }} id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {iconlist.map(e => (

                                                    <option key={e} value={e}>{e}</option>

                                                ))}


                                            </select>

                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Perfil">Página <span style={{ color: "red" }} >*</span></label>

                                            <select className="form-control" onChange={event => { setSELF_ID(event.target.value) }} id="menu" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {glbmenulist.map(e => (

                                                    e.TIPO == "item" || e.TIPO == "subitem" ?

                                                        <option key={e.ID} title={e.URL} value={e.ID}>{e.DS_MENU}</option>

                                                        : null


                                                ))}


                                            </select>

                                        </div>
                                    </Col>



                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ação <span style={{ color: "red" }} >*</span></label>
                                            <input list="acaolist" type="text" onChange={event => { setACAO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Ação..." required />

                                            <datalist id="acaolist">

                                                {acaolist.map(e => (

                                                    <option key={e} value={e} />

                                                ))}

                                            </datalist>

                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tabela <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control" onChange={event => { setTABELA(event.target.value) }} id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {tabelalist.map(e => (

                                                    <option key={e} value={e}>{e}</option>

                                                ))}


                                            </select>

                                        </div>
                                    </Col>


                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsOpen(false)}>Fechar</Button>
                            {!isLoading ? <Button type="submit" form="criarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>

                            }                        </Modal.Footer>
                    </Modal>


                    {/* --------------------Editar Item------------------- */}


                    <Modal size='x' show={isEditarOpen} onHide={() => setIsEditarOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Editar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="editarItem" onSubmit={editarItemGO} >


                                <Row>








                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" onChange={event => { setDS_MENU(event.target.value) }} defaultValue={DS_MENU} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Perfil">Icon <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control" onChange={event => { setURL_ICON(event.target.value) }} defaultValue={URL_ICON} id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {iconlist.map(e => (

                                                    <option key={e} value={e}>{e}</option>

                                                ))}


                                            </select>

                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Perfil">Página <span style={{ color: "red" }} >*</span></label>

                                            <select className="form-control" onChange={event => { setSELF_ID(event.target.value) }} id="menu" defaultValue={SELF_ID} required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {glbmenulist.map(e => (

                                                    e.TIPO == "item" || e.TIPO == "subitem" ?

                                                        <option key={e.ID} value={e.ID}>{e.DS_MENU}</option>

                                                        : null


                                                ))}


                                            </select>

                                        </div>
                                    </Col>



                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ação <span style={{ color: "red" }} >*</span></label>
                                            <input list="acaolist" type="text" onChange={event => { setACAO(event.target.value) }} defaultValue={ACAO} className="form-control" placeholder="Ação..." required />

                                            <datalist id="acaolist">

                                                {acaolist.map(e => (

                                                    <option key={e} value={e} />

                                                ))}

                                            </datalist>

                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tabela <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control" onChange={event => { setTABELA(event.target.value) }} defaultValue={TABELA} id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {tabelalist.map(e => (

                                                    <option key={e} value={e}>{e}</option>

                                                ))}


                                            </select>

                                        </div>
                                    </Col>


                                </Row>

                            </form>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsEditarOpen(false)}>Fechar</Button>
                            {!isLoading ? <Button type="submit" form="editarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>

                            }
                        </Modal.Footer>
                    </Modal>

                    {/* --------------------Ver Item------------------- */}

                    <Modal size='x' show={isVerOpen} onHide={() => setVerOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Acção de Menus</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <Row style={{ width: "100%", overflow: "auto" }}>


                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Designação</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.DS_MENU}</span>
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Icon</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.URL_ICON}</span>
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Página</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">
                                            {itemSelected.SELF_ID != null ? itemSelected.glbmenu_self.DS_MENU : null}
                                        </span>
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Ação</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{
                                            typeof (itemSelected.URL2) != "undefined" ?
                                                itemSelected.URL2[2]
                                                : null
                                        }</span>
                                    </div>
                                </Col>


                                <div className="col-sm-12">
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Address">Tabela</label>
                                        <label style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{
                                            typeof (itemSelected.URL) != "undefined" ?
                                                itemSelected.URL2[1]
                                                : null
                                        }</label>

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