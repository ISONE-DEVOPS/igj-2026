import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, Form } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';


import { Link } from 'react-router-dom';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";



import api from '../../../services/api';

import iconlist from '../../../data/iconlist';
import urllist from '../../../data/urllist';
import tabelalist from '../../../data/tabelalist';

import useAuth from '../../../hooks/useAuth';


import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle } from '../../../functions';


const pageAcess = "/administracao/menu"



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
                                            <td className={isCentered ? 'text-center' : 'text-right'}{...cell.getCellProps({
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
                maxWidth: 40,
                minWidth: 40,
                width: 40,
                textAlign: "center",
                centered: true

            },


            {
                Header: 'Designação',
                accessor: 'DS_MENU',
                centered: true
            },

            {
                Header: 'TIPO',
                accessor: 'TIPO2',
                centered: true
            },


            {
                Header: 'Menu Principal',
                accessor: 'ITEM',
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


    var doyoueditVer = false
    var doyoueditCriar = false
    var doyoueditEditar = false
    var doyoueditEliminar = false


    const [isLoading, setIsLoading] = useState(false)

    const [SELF_ID, setSELF_ID] = useState("");
    const [DS_MENU, setDS_MENU] = useState("");
    const [URL_ICON, setURL_ICON] = useState("");
    const [URL, setURL] = useState("");
    const [TABELA, setTABELA] = useState("");
    const [ORDEM, setORDEM] = useState("");




    const [itemSelected, setitemSelected] = useState({});



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);

    async function uploadlist() {

        try {

            const response = await api.get('/glbmenu');

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID


                    response.data[i].id = response.data[i].ID

                    if (response.data[i].SELF_ID != null) response.data[i].ITEM = response.data[i].glbmenu_self.DS_MENU




                    if (response.data[i].TIPO != "task") response.data[i].EX = true
                    else response.data[i].EX = false


                    if (response.data[i].TIPO == "group") response.data[i].TIPO2 = "Grupo"
                    if (response.data[i].TIPO == "collapse") response.data[i].TIPO2 = "Subgrupo"
                    if (response.data[i].TIPO == "item") response.data[i].TIPO2 = "Página"
                    if (response.data[i].TIPO == "subitem") response.data[i].TIPO2 = "Subpágina"




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

                console.log(response.data)


                var filtered = response.data.filter(function (el) {
                    return el.EX == true
                });



                setnewdata(filtered)


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

        setradios_tipo(idx.TIPO)

        setSELF_ID(idx.SELF_ID);
        setDS_MENU(idx.DS_MENU);
        setURL_ICON(idx.URL_ICON);
        setORDEM(idx.ORDEM);
        setURL(idx.URL);
    };



    //-----------------------------------------------'





    //-------------- EDITAR -------------------------


    const openEditHandler = (idx) => {
        setIsEditarOpen(true);
        setIsOpen(false);
        setVerOpen(false);
        setitemSelected(idx)

        setradios_tipo(idx.TIPO)

        setSELF_ID(idx.SELF_ID);
        setDS_MENU(idx.DS_MENU);
        setURL_ICON(idx.URL_ICON);
        setORDEM(idx.ORDEM);
        setURL(idx.URL);

        //if(chVer&&chCriar&&chEditar&&chEliminar)

        setchAcoes(false);
        setchVer(false);
        setchCriar(false);
        setchEditar(false);
        setchEliminar(false);

        doyoueditVer = false
        doyoueditCriar = false
        doyoueditEditar = false
        doyoueditEliminar = false


    };







    async function editarItemGO(event) {

        event.preventDefault();


        const upload = {

            SELF_ID,
            DS_MENU,
            URL_ICON,
            URL,
            TIPO: radios_tipo,
            ORDEM,
            ESTADO: "1"


        }

        console.log(upload)


        try {

            const response = await api.put('/glbmenu/' + itemSelected.ID, upload);



            if (response.status == '200') {

                if (radios_tipo == "item" || radios_tipo == "subitem") {

                    if (doyoueditVer) {

                        if (chVer) {
                            const response2_1 = await api.post('/glbmenu',

                                {
                                    SELF_ID: itemSelected.ID,
                                    DS_MENU: "Ler",
                                    URL_ICON: "feather icon-eye",
                                    URL: "/" + TABELA + "/" + "Ler",
                                    TIPO: "task",
                                    ORDEM: "0",


                                }

                            );
                        }
                    }


                    if (doyoueditEditar) {
                        if (chEditar) {
                            const response2_2 = await api.post('/glbmenu',

                                {
                                    SELF_ID: itemSelected.ID,
                                    DS_MENU: "Editar",
                                    URL_ICON: "feather icon-edit",
                                    URL: "/" + TABELA + "/" + "Editar",
                                    TIPO: "task",
                                    ORDEM: "0",


                                }

                            );
                        }
                    }


                    if (doyoueditEditar) {
                        if (chCriar) {
                            const response2_1 = await api.post('/glbmenu',

                                {
                                    SELF_ID: itemSelected.ID,
                                    DS_MENU: "Criar",
                                    URL_ICON: "feather icon-x",
                                    URL: "/" + TABELA + "/" + "Criar",
                                    TIPO: "task",
                                    ORDEM: "0",


                                }

                            );
                        }
                    }


                    if (doyoueditEliminar) {
                        if (chEliminar) {
                            const response2_1 = await api.post('/glbmenu',

                                {
                                    SELF_ID: itemSelected.ID,
                                    DS_MENU: "Eliminar",
                                    URL_ICON: "feather icon-trash-2",
                                    URL: "/" + TABELA + "/" + "Eliminar",
                                    TIPO: "task",
                                    ORDEM: "0",


                                }

                            );
                        }
                    }

                }



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
        setradios_tipo("group")
        setchAcoes(false);
        setchVer(false);
        setchCriar(false);
        setchEditar(false);
        setchEliminar(false);

        setSELF_ID("");
        setDS_MENU("");
        setURL_ICON("");
        setSELF_ID("");
        setURL("");
        setORDEM("1");
        setTABELA("");



    };





    async function criarItemGO(event) {
        event.preventDefault();


        const upload = {

            SELF_ID,
            DS_MENU,
            URL_ICON,
            URL,
            TIPO: radios_tipo,
            ORDEM,
            ESTADO: "1"


        }
        console.log(upload)


        try {

            const response = await api.post('/glbmenu', upload);

            if (response.status == '200') {

                if (radios_tipo == "item" || radios_tipo == "subitem") {


                    if (chVer) {
                        const response2_1 = await api.post('/glbmenu',

                            {
                                SELF_ID: response.data.ID,
                                DS_MENU: "Ler",
                                URL_ICON: "feather icon-eye",
                                URL: "/" + TABELA + "/" + "Ler",
                                TIPO: "task",
                                ORDEM: "0",


                            }

                        );
                    }


                    if (chEditar) {
                        const response2_2 = await api.post('/glbmenu',

                            {
                                SELF_ID: response.data.ID,
                                DS_MENU: "Editar",
                                URL_ICON: "feather icon-edit",
                                URL: "/" + TABELA + "/" + "Editar",
                                TIPO: "task",
                                ORDEM: "0",


                            }

                        );
                    }


                    if (chCriar) {
                        const response2_1 = await api.post('/glbmenu',

                            {
                                SELF_ID: response.data.ID,
                                DS_MENU: "Criar",
                                URL_ICON: "feather icon-x",
                                URL: "/" + TABELA + "/" + "Criar",
                                TIPO: "task",
                                ORDEM: "0",


                            }

                        );
                    }


                    if (chEliminar) {
                        const response2_1 = await api.post('/glbmenu',

                            {
                                SELF_ID: response.data.ID,
                                DS_MENU: "Eliminar",
                                URL_ICON: "feather icon-trash-2",
                                URL: "/" + TABELA + "/" + "Eliminar",
                                TIPO: "task",
                                ORDEM: "0",


                            }

                        );
                    }

                }





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

    const [chAcoes, setchAcoes] = useState(false);
    const [chVer, setchVer] = useState(false);
    const [chCriar, setchCriar] = useState(false);
    const [chEditar, setchEditar] = useState(false);
    const [chEliminar, setchEliminar] = useState(false);


    useEffect(() => {


        if (pageEnable(pageAcess, permissoes) == false) history.push('/')

        else uploadlist()

    }, [])





    useEffect(() => {

        doyoueditVer = true

    }, [chVer])


    useEffect(() => {

        doyoueditCriar = true

    }, [chCriar])


    useEffect(() => {

        doyoueditEditar = true

    }, [chEditar])


    useEffect(() => {

        doyoueditEliminar = false

    }, [chEliminar])








    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isNewentidade, setisNewentidade] = useState(false);






    const [supportedRadio, setSupportedRadio] = useState(false);
    const [radios_tipo, setradios_tipo] = useState("grupo");


    function makeradios_tipo(id) {

        setradios_tipo(id);
        console.log(id);



    }


    function GOsetchAcoes() {

        if (chAcoes == true) {

            setchAcoes(false)
            setchVer(false)
            setchCriar(false)
            setchEditar(false)
            setchEliminar(false)

        }


        if (chAcoes == false) {

            setchAcoes(true)
            setchVer(true)
            setchCriar(true)
            setchEditar(true)
            setchEliminar(true)

        }



    }






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





                                    <Col sm={12}>


                                        <Form.Group style={{ display: "flex", justifyContent: "center" }}>
                                            <Form.Check
                                                inline
                                                custom
                                                required

                                                type="radio"
                                                label="Grupo"
                                                name="supportedRadio"
                                                id="group"
                                                defaultChecked={true}

                                                onChange={() => makeradios_tipo("group")}

                                            />
                                            <Form.Check
                                                inline
                                                custom
                                                required

                                                type="radio"
                                                label="Subgrupo"
                                                name="supportedRadio"
                                                id="collapse"
                                                onChange={() => makeradios_tipo("collapse")}

                                            />
                                            <Form.Check
                                                inline
                                                custom
                                                required

                                                type="radio"
                                                label="Página"
                                                name="supportedRadio"
                                                id="item"
                                                onChange={() => makeradios_tipo("item")}
                                            />
                                            <Form.Check
                                                inline
                                                custom
                                                required

                                                type="radio"
                                                label="Subpágina"
                                                name="supportedRadio"
                                                id="subitem"
                                                onChange={() => makeradios_tipo("subitem")}
                                            />
                                        </Form.Group>



                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" onChange={event => { setDS_MENU(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    {radios_tipo != "group" ?

                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Icon">Icon </label>
                                                <input list="iconlist" type="text" onChange={event => { setURL_ICON(event.target.value) }} defaultValue={""} className="form-control" placeholder="Icon..." required />


                                                <datalist id="iconlist">

                                                    {iconlist.map(e => (

                                                        <option key={e} value={e} />

                                                    ))}

                                                </datalist>

                                            </div>
                                        </Col>

                                        : null}

                                    {radios_tipo == "item" || radios_tipo == "collapse" ?


                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Menu">Menu Principal <span style={{ color: "red" }} >*</span></label>

                                                <select className="form-control" onChange={event => { setSELF_ID(event.target.value) }} id="Menu" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {newdata.map(e => (

                                                        e.TIPO == "group" || e.TIPO == "collapse" ?

                                                            <option title={

                                                                " | " + (typeof e?.glbmenu_self?.DS_MENU !== 'undefined' ? e?.glbmenu_self?.DS_MENU : "-") +
                                                                " | " + (e?.ORDEM != null ? e?.ORDEM : "-") + " | "

                                                            } key={e.ID} value={e.ID}>{e.DS_MENU}</option>

                                                            : null


                                                    ))}


                                                </select>

                                            </div>
                                        </Col>

                                        : null

                                    }




                                    {radios_tipo == "subitem" ?


                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Menu">Página <span style={{ color: "red" }} >*</span></label>

                                                <select className="form-control" onChange={event => { setSELF_ID(event.target.value) }} id="Menu" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {newdata.map(e => (

                                                        e.TIPO == "item" || e.TIPO == "subitem" ?

                                                            <option title={e.URL} key={e.ID} value={e.ID}>{e.DS_MENU}</option>

                                                            : null


                                                    ))}


                                                </select>

                                            </div>
                                        </Col>

                                        : null

                                    }









                                    {radios_tipo != "subitem" ?

                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Ordem">Ordem <span style={{ color: "red" }} >*</span></label>
                                                <input type="number" min="1" onChange={event => { setORDEM(event.target.value) }} defaultValue={"1"} className="form-control" placeholder="Ordem..." required />
                                            </div>
                                        </Col>

                                        : null}


                                    {radios_tipo == "item" || radios_tipo == "subitem" ? <>








                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Url">Url <span style={{ color: "red" }} >*</span></label>
                                                <input list="urllist" type="text" onChange={event => { setURL(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />

                                                <datalist id="urllist">

                                                    {urllist.map(e => (

                                                        <option key={e} value={e} />

                                                    ))}

                                                </datalist>

                                            </div>
                                        </Col>



                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Tabela">Tabela das ações <span style={{ color: "red" }} >*</span></label>
                                                <select className="form-control" onChange={event => { setTABELA(event.target.value) }} id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {tabelalist.map(e => (

                                                        <option key={e} value={e}>{e}</option>

                                                    ))}


                                                </select>

                                            </div>
                                        </Col>



                                        <Col sm={12}>


                                            <Form.Group>
                                                <Form.Check
                                                    custom

                                                    isInvalid={!chAcoes}
                                                    isValid={chAcoes}
                                                    type="checkbox"
                                                    id="supported-checkbox1"
                                                    label="Ações"
                                                    checked={chAcoes}

                                                    onChange={() => GOsetchAcoes()}
                                                />
                                            </Form.Group>
                                            <span style={{ display: "flex", paddingLeft: "8px" }}>
                                                <Form.Group>
                                                    <Form.Check
                                                        custom

                                                        isInvalid={!chVer}
                                                        isValid={chVer}
                                                        type="checkbox"
                                                        id="supported-checkbox2"
                                                        label="Ver"
                                                        checked={chVer}
                                                        onChange={() => setchVer(prevState => !prevState)}
                                                    />
                                                </Form.Group>


                                                <Form.Group style={{ paddingLeft: "8px" }}>
                                                    <Form.Check
                                                        custom

                                                        isInvalid={!chCriar}
                                                        isValid={chCriar}
                                                        type="checkbox"
                                                        id="supported-checkbox3"
                                                        label="Criar"
                                                        checked={chCriar}
                                                        onChange={() => setchCriar(prevState => !prevState)}
                                                    />
                                                </Form.Group>
                                                <Form.Group style={{ paddingLeft: "8px" }}>
                                                    <Form.Check
                                                        custom

                                                        isInvalid={!chEditar}
                                                        isValid={chEditar}
                                                        type="checkbox"
                                                        id="supported-checkbox4"
                                                        label="Editar"
                                                        checked={chEditar}
                                                        onChange={() => setchEditar(prevState => !prevState)}
                                                    />
                                                </Form.Group>
                                                <Form.Group style={{ paddingLeft: "8px" }}>
                                                    <Form.Check
                                                        custom

                                                        isInvalid={!chEliminar}
                                                        isValid={chEliminar}
                                                        type="checkbox"
                                                        id="supported-checkbox5"
                                                        label="Eliminar"
                                                        checked={chEliminar}
                                                        onChange={() => setchEliminar(prevState => !prevState)}
                                                    />
                                                </Form.Group>
                                            </span>
                                        </Col>

                                    </> : null}


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


                                    {radios_tipo != "group" ?


                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Icon">Icon </label>
                                                <input list="iconlist" type="text" onChange={event => { setURL_ICON(event.target.value) }} defaultValue={URL_ICON} className="form-control" placeholder="Icon..." required />


                                                <datalist id="iconlist">

                                                    {iconlist.map(e => (

                                                        <option key={e} value={e} />

                                                    ))}

                                                </datalist>

                                            </div>
                                        </Col>

                                        : null}

                                    {radios_tipo == "item" || radios_tipo == "collapse" ?


                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Menu">Menu Principal <span style={{ color: "red" }} >*</span></label>

                                                <select className="form-control" defaultValue={SELF_ID} onChange={event => { setSELF_ID(event.target.value) }} id="Menu" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {newdata.map(e => (

                                                        (e.TIPO == "group" || e.TIPO == "collapse") && e.ID != itemSelected.ID ?

                                                            <option title={

                                                                " | " + (typeof e?.glbmenu_self?.DS_MENU !== 'undefined' ? e?.glbmenu_self?.DS_MENU : "-") +
                                                                " | " + (e?.ORDEM != null ? e?.ORDEM : "-") + " | "

                                                            } key={e.ID} value={e.ID}>{e.DS_MENU}</option>


                                                            : null


                                                    ))}


                                                </select>

                                            </div>
                                        </Col>

                                        : null

                                    }





                                    {radios_tipo == "subitem" ?


                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Menu">Página <span style={{ color: "red" }} >*</span></label>

                                                <select className="form-control" defaultValue={SELF_ID} onChange={event => { setSELF_ID(event.target.value) }} id="Menu" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {newdata.map(e => (

                                                        e.TIPO == "item" || e.TIPO == "subitem" ?

                                                            <option title={e.URL} key={e.ID} value={e.ID}>{e.DS_MENU}</option>

                                                            : null


                                                    ))}

                                                    {/* {newdata.map(e => (

                                                        (e.TIPO == "item" || e.TIPO == "subimte") && e.ID != itemSelected.ID ?

                                                            <option title={e.URL} key={e.ID} value={e.ID}>{e.DS_MENU}</option>

                                                            : null


                                                    ))} */}


                                                </select>

                                            </div>
                                        </Col>

                                        : null

                                    }


                                    {radios_tipo != "subitem" ?

                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Ordem">Ordem <span style={{ color: "red" }} >*</span></label>
                                                <input type="number" min="1" onChange={event => { setORDEM(event.target.value) }} defaultValue={ORDEM} className="form-control" placeholder="Ordem..." required />
                                            </div>
                                        </Col>

                                        : null}


                                    {radios_tipo == "item" || radios_tipo == "subitem" ? <>

                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Url">Url <span style={{ color: "red" }} >*</span></label>
                                                <input list="urllist" type="text" onChange={event => { setURL(event.target.value) }} defaultValue={URL} className="form-control" placeholder="URL..." required />

                                                <datalist id="urllist">

                                                    {urllist.map(e => (

                                                        <option key={e} value={e} />

                                                    ))}

                                                </datalist>

                                            </div>
                                        </Col>





                                        <Col sm={12}>


                                            <Form.Group>
                                                <Form.Check
                                                    custom

                                                    isInvalid={!chAcoes}
                                                    isValid={chAcoes}
                                                    type="checkbox"
                                                    id="supported-checkbox1"
                                                    label="Ações"
                                                    checked={chAcoes}

                                                    onChange={() => GOsetchAcoes()}
                                                />
                                            </Form.Group>
                                            <span style={{ display: "flex", paddingLeft: "8px" }}>
                                                <Form.Group>
                                                    <Form.Check
                                                        custom

                                                        isInvalid={!chVer}
                                                        isValid={chVer}
                                                        type="checkbox"
                                                        id="supported-checkbox2"
                                                        label="Ver"
                                                        checked={chVer}
                                                        onChange={() => setchVer(prevState => !prevState)}
                                                    />
                                                </Form.Group>


                                                <Form.Group style={{ paddingLeft: "8px" }}>
                                                    <Form.Check
                                                        custom

                                                        isInvalid={!chCriar}
                                                        isValid={chCriar}
                                                        type="checkbox"
                                                        id="supported-checkbox3"
                                                        label="Criar"
                                                        checked={chCriar}
                                                        onChange={() => setchCriar(prevState => !prevState)}
                                                    />
                                                </Form.Group>
                                                <Form.Group style={{ paddingLeft: "8px" }}>
                                                    <Form.Check
                                                        custom

                                                        isInvalid={!chEditar}
                                                        isValid={chEditar}
                                                        type="checkbox"
                                                        id="supported-checkbox4"
                                                        label="Editar"
                                                        checked={chEditar}
                                                        onChange={() => setchEditar(prevState => !prevState)}
                                                    />
                                                </Form.Group>
                                                <Form.Group style={{ paddingLeft: "8px" }}>
                                                    <Form.Check
                                                        custom

                                                        isInvalid={!chEliminar}
                                                        isValid={chEliminar}
                                                        type="checkbox"
                                                        id="supported-checkbox5"
                                                        label="Eliminar"
                                                        checked={chEliminar}
                                                        onChange={() => setchEliminar(prevState => !prevState)}
                                                    />
                                                </Form.Group>
                                            </span>
                                        </Col>

                                    </> : null}


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
                            <Modal.Title as="h5">{itemSelected.TIPO2}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <Row style={{ width: "100%", overflow: "auto" }}>


                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Designação</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.DS_MENU}</span>
                                    </div>
                                </Col>

                                {radios_tipo != "group" ?


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Icon</label>
                                            <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">
                                                {itemSelected.URL_ICON}
                                            </span>
                                        </div>
                                    </Col>

                                    : null}


                                {radios_tipo != "group" ?

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Menu Principal</label>
                                            <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">
                                                {Object.keys(itemSelected).length != 0 ? Object.keys(itemSelected.glbmenu_self).length != 0 ?
                                                    itemSelected.glbmenu_self.DS_MENU
                                                    : "" : ""}
                                            </span>
                                        </div>
                                    </Col>

                                    : null}


                                {radios_tipo == "item" ?

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Url</label>
                                            <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">
                                                {itemSelected.URL}
                                            </span>
                                        </div>
                                    </Col>

                                    : null}


                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Ordem</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">
                                            {itemSelected.ORDEM}
                                        </span>
                                    </div>
                                </Col>

                                {radios_tipo == "item" ? <>





                                    <Col sm={12}>


                                        <Form.Group>
                                            <Form.Check
                                                custom

                                                isInvalid={!chAcoes}
                                                isValid={chAcoes}
                                                type="checkbox"
                                                id="supported-checkbox1"
                                                label="Ações"
                                                checked={chAcoes}
                                                disabled

                                            />
                                        </Form.Group>
                                        <span style={{ display: "flex", paddingLeft: "8px" }}>
                                            <Form.Group>
                                                <Form.Check
                                                    custom

                                                    isInvalid={!chVer}
                                                    isValid={chVer}
                                                    type="checkbox"
                                                    id="supported-checkbox2"
                                                    label="Ver"
                                                    checked={chVer}
                                                    disabled
                                                />
                                            </Form.Group>


                                            <Form.Group style={{ paddingLeft: "8px" }}>
                                                <Form.Check
                                                    custom

                                                    isInvalid={!chCriar}
                                                    isValid={chCriar}
                                                    type="checkbox"
                                                    id="supported-checkbox3"
                                                    label="Criar"
                                                    checked={chCriar}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group style={{ paddingLeft: "8px" }}>
                                                <Form.Check
                                                    custom

                                                    isInvalid={!chEditar}
                                                    isValid={chEditar}
                                                    type="checkbox"
                                                    id="supported-checkbox4"
                                                    label="Editar"
                                                    checked={chEditar}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Form.Group style={{ paddingLeft: "8px" }}>
                                                <Form.Check
                                                    custom

                                                    isInvalid={!chEliminar}
                                                    isValid={chEliminar}
                                                    type="checkbox"
                                                    id="supported-checkbox5"
                                                    label="Eliminar"
                                                    checked={chEliminar}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </span>
                                    </Col>

                                </> : null}



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