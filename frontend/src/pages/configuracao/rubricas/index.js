import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { Link } from 'react-router-dom';

// import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter, useExpanded } from "react-table";

import useAuth from '../../../hooks/useAuth';


import api from '../../../services/api';
import { GlobalFilter } from './GlobalFilter';

import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle, formatDate, createDa, makedate } from '../../../functions';


const pageAcess = "/configuracao/rubricas"



function Table({ columns, data, modalOpen, addChildRubricas, openEditHandler, removeItem, depth }) {
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
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useGlobalFilter, useSortBy, useExpanded, usePagination
    );
    return (
        <>
            {/* Table */}
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
                        <Button variant="primary" className="btn-sm btn-round has-ripple ml-2" onClick={modalOpen}><i className="feather icon-plus" /> Adicionar</Button>
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
                                <th style={{ width: column.id === 'DESCRICAO' ? '70%' : '' }} {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <span className='feather icon-arrow-down text-muted float-right' />
                                            ) : (
                                                <span className='feather icon-arrow-up text-muted float-right' />
                                            )
                                        ) : (
                                            ''
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <React.Fragment key={row.getRowProps().key}>
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        const isCentered = cell.column.centered;

                                        return (
                                            <td className={isCentered ? 'text-center' : 'text-left'} style={{ width: cell.column.id === 'DESCRICAO' ? '70%' : '', paddingLeft: cell.column.id === 'DESIGNACAO' ? '30px' : '' }}
                                                {...cell.getCellProps()}

                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                                </tr>

                                {row.original.rubricas.length > 0 ? (


                                    row.original.rubricas.map((item) => (
                                        < TableRow item={item} depth={depth + 1} addChildRubricas={addChildRubricas} openEditHandler={openEditHandler} removeItem={removeItem} />

                                    ))

                                ) : null}

                            </React.Fragment>
                        );
                    })}
                </tbody>
            </BTable >
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
    );
}


const TableRow = ({ item, depth, addChildRubricas, openEditHandler, removeItem }) => {
    const { permissoes } = useAuth();
    const paddingLeft = depth * 20

    // Adjust the padding as needed

    return (
        <>
            <tr >
                <td className='text-left' style={{ width: '70%', paddingLeft: paddingLeft }}>{item.DESIGNACAO}</td>
                <td className='text-center'>{makedate(item.DT_REGISTO)}</td>
                <td className='text-center'>
                    {
                        item.ESTADO === "1" ?
                            <div className=''><svg width="25" height="25" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.5586 18.3327L20.7447 23.3327L38.0319 6.66602" stroke="#167538" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M36.3043 20V31.6667C36.3043 32.5507 35.9401 33.3986 35.2917 34.0237C34.6433 34.6488 33.7639 35 32.8469 35H8.64493C7.72796 35 6.84855 34.6488 6.20016 34.0237C5.55176 33.3986 5.1875 32.5507 5.1875 31.6667V8.33333C5.1875 7.44928 5.55176 6.60143 6.20016 5.97631C6.84855 5.35119 7.72796 5 8.64493 5H27.6608" stroke="#167538" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg></div>

                            : <div className=''><svg width="25" height="25" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.5 41.25C32.8553 41.25 41.25 32.8553 41.25 22.5C41.25 12.1447 32.8553 3.75 22.5 3.75C12.1447 3.75 3.75 12.1447 3.75 22.5C3.75 32.8553 12.1447 41.25 22.5 41.25Z" stroke="#EC1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M28.125 16.875L16.875 28.125" stroke="#EC1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M16.875 16.875L28.125 28.125" stroke="#EC1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg></div>

                    }

                </td>
                <td className='text-center'>
                    <React.Fragment>
                        {/* {taskEnable(pageAcess, permissoes, "Ler") == false ? null :
                                <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Ler")} onClick={() => openVerHandler(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Ler")} /></Link>
                            } */}

                        {taskEnable(pageAcess, permissoes, "Editar") == false ? null :
                            <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Editar")} onClick={() => openEditHandler(item)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Editar")} /></Link>
                        }
                        {item.ULTIMO === "1" ? <>
                            <Link to='#' title="Adicionar Rúbrica" onClick={() => addChildRubricas(item)} className="text-primary mx-1"><i className={"text-primary feather icon-plus-circle"} /></Link>

                        </>
                            : <>
                                {item.ESTADO === "1" ?

                                    <>

                                        <Link to='#' title="Último Nível" className="text-primary mx-1"><i className={"text-danger feather icon-x-circle"} /></Link>
                                    </>
                                    : <Link to='#' title="Estado Inativo" className="text-primary mx-1"><i className={"text-danger feather icon-x-circle"} /></Link>

                                }

                            </>
                        }
                        {taskEnable(pageAcess, permissoes, "Eliminar") == false ? null :
                            <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Eliminar")} onClick={() => removeItem(item.ID)} className="text-danger"><i className={"" + taskEnableIcon(pageAcess, permissoes, "Eliminar")} /></Link>
                        }
                    </React.Fragment>
                </td>
            </tr>
            {item.rubricas.length > 0 &&
                item.rubricas.map((rubrica) => (
                    <TableRow item={rubrica} depth={depth + 1} addChildRubricas={addChildRubricas} openEditHandler={openEditHandler} removeItem={removeItem} />
                ))}
        </>
    );
};
const Rubricas = () => {


    const { permissoes } = useAuth();

    const history = useHistory();


    const { popUp_removerItem, popUp_alertaOK } = useAuth();


    const columns = React.useMemo(
        () => [

            {
                Header: 'Rúbrica',
                accessor: 'DESIGNACAO', centered: false,

            },
            {
                Header: 'Data Registro',
                accessor: 'DT_REGISTO', centered: true,

            },
            {
                Header: 'Ativa',
                accessor: 'ESTADO', centered: true,

            },
            {
                Header: 'Ações',
                accessor: 'action', centered: true,

            },
        ],
        []
    );

    const [NOME, setNOME] = useState("");
    const [OBS, setOBS] = useState("");
    const [DESIGNACAO, setDESIGNACAO] = useState("");
    const [DESCRICAO, setDESCRICAO] = useState("");
    const [RUBRICA_ID, setRUBRICA_ID] = useState("");
    const [ULTIMO, setULTIMO] = useState(false);
    const [ESTADO, setESTADO] = useState("");

    const [ID, setID] = useState("");


    const [itemSelected, setitemSelected] = useState({});



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);

    async function uploadlist() {

        try {

            const response = await api.get('/rubricas');

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID


                    response.data[i].id = response.data[i].ID
                    response.data[i].DT_REGISTO = makedate(response.data[i].DT_REGISTO)

                    response.data[i].ESTADO = <React.Fragment>
                        {
                            response.data[i].ESTADO === "1" ?
                                <div className=''><svg width="25" height="25" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5586 18.3327L20.7447 23.3327L38.0319 6.66602" stroke="#167538" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M36.3043 20V31.6667C36.3043 32.5507 35.9401 33.3986 35.2917 34.0237C34.6433 34.6488 33.7639 35 32.8469 35H8.64493C7.72796 35 6.84855 34.6488 6.20016 34.0237C5.55176 33.3986 5.1875 32.5507 5.1875 31.6667V8.33333C5.1875 7.44928 5.55176 6.60143 6.20016 5.97631C6.84855 5.35119 7.72796 5 8.64493 5H27.6608" stroke="#167538" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg></div>

                                : <div className=''><svg width="25" height="25" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.5 41.25C32.8553 41.25 41.25 32.8553 41.25 22.5C41.25 12.1447 32.8553 3.75 22.5 3.75C12.1447 3.75 3.75 12.1447 3.75 22.5C3.75 32.8553 12.1447 41.25 22.5 41.25Z" stroke="#EC1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M28.125 16.875L16.875 28.125" stroke="#EC1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M16.875 16.875L28.125 28.125" stroke="#EC1C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg></div>

                        }                    </React.Fragment >

                    const itemx = response.data[i]

                    response.data[i].action =
                        <React.Fragment>
                            {/* {taskEnable(pageAcess, permissoes, "Ler") == false ? null :
                                <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Ler")} onClick={() => openVerHandler(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Ler")} /></Link>
                            } */}

                            {taskEnable(pageAcess, permissoes, "Editar") == false ? null :
                                <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Editar")} onClick={() => openEditHandler(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Editar")} /></Link>
                            }
                            {itemx.ULTIMO === "1" ? <>
                                <Link to='#' title="Adicionar Rúbrica" onClick={() => addChildRubricas(itemx)} className="text-primary mx-1"><i className={"text-primary feather icon-plus-circle"} /></Link>

                            </>
                                : <>
                                    <Link to='#' title="Último Nível" className="text-primary mx-1"><i className={"text-danger feather icon-x-circle"} /></Link>

                                </>
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
        setID(idx.ID)
        setNOME(idx.NOME)
        setDESCRICAO(idx.DESCRICAO)
        setDESIGNACAO(idx.DESIGNACAO)
        setESTADO(idx.ESTADO)
        setRUBRICA_ID(idx.RUBRICA_ID)

        idx.ULTIMO = idx.ULTIMO === "0" ? false : true
        setULTIMO(idx.ULTIMO)
        setitemSelected(idx)

        //setESTADO_C(idx.ID)
    };

    const addChildRubricas = (idx) => {
        setRUBRICA_ID(idx.ID)
        setIsOpen(true);
        setIsEditarOpen(false);
        setVerOpen(false);

        //setESTADO_C(idx.ID)
    };






    async function editarItemGO(event) {

        event.preventDefault();


        const upload = {

            DESIGNACAO: DESIGNACAO,
            DESCRICAO: DESCRICAO,
            RUBRICA_ID: RUBRICA_ID,
            ULTIMO: ULTIMO,
            ESTADO: ESTADO
        }

        console.log(upload)


        try {

            const response = await api.put('/rubricas/' + itemSelected.ID, upload);

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


        setID("")
        setNOME("")
    };





    async function criarItemGO(event) {

        event.preventDefault();


        const upload = {

            DESIGNACAO: DESIGNACAO,
            DESCRICAO: DESCRICAO,
            RUBRICA_ID: RUBRICA_ID,
            ULTIMO: ULTIMO === true ? 1 : 0,
            ESTADO: ESTADO
        }

        console.log(upload)


        try {

            const response = await api.post('/rubricas', upload);

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

            const response = await api.delete('/rubricas/' + idx);


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
    function handleChange(event) {
        setULTIMO(event)
    }
    //-----------------------------------------------




    useEffect(() => {



        if (pageEnable(pageAcess, permissoes) == false) history.push('/')

        else uploadlist()


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
                            <Table columns={columns} data={newdata} modalOpen={openHandler} addChildRubricas={addChildRubricas} removeItem={removeItem} openEditHandler={openEditHandler} depth={1} />
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
                                            <label className="floating-label" htmlFor="Name">Designacão <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" maxLength="128" onChange={event => { setDESIGNACAO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>


                                    <Col sm={4}>
                                        <div className='d-flex flex-column rubricas-check'>
                                            <div className="form-group fill ">
                                            </div>
                                            <div className=" fill input-box">
                                                <input type="checkbox" name="" id="" onChange={e => handleChange(e.target.checked)} />
                                                <label className="floating-label ml-3" htmlFor="Name">Último <span style={{ color: "red" }} >*</span></label>
                                            </div>
                                        </div>

                                    </Col>
                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Estado <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control"
                                                onChange={(e) => { setESTADO(e.target.value) }}
                                            >
                                                <option selected value="1"> Ativo </option>
                                                <option value="0"> Inativo </option>
                                            </select>
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Descrição/Lesgilação <span style={{ color: "red" }} >*</span></label>
                                            <textarea className="form-control" maxLength="64000" onChange={event => { setDESCRICAO(event.target.value) }} id="obs" rows="3" placeholder='Descrição/Lesgilação...' />
                                        </div>
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
                                            <label className="floating-label" htmlFor="Name">Designacão <span style={{ color: "red" }} >*</span></label>
                                            <input defaultValue={itemSelected.DESIGNACAO} type="text" maxLength="128" onChange={event => { setDESIGNACAO(event.target.value) }} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>


                                    <Col sm={4}>
                                        <div className='d-flex flex-column rubricas-check'>
                                            <div className="form-group fill ">
                                            </div>
                                            <div className=" fill input-box">
                                                <input defaultChecked={itemSelected.ULTIMO} type="checkbox" name="" id="" onChange={e => handleChange(e.target.checked)} />
                                                <label className="floating-label ml-3" htmlFor="Name">Último <span style={{ color: "red" }} >*</span></label>
                                            </div>
                                        </div>

                                    </Col>
                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Estado <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={itemSelected.ESTADO} className="form-control"
                                                onChange={(e) => { setESTADO(e.target.value) }}
                                            >
                                                <option selected value="1"> Ativo </option>
                                                <option value="0"> Inativo </option>
                                            </select>
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Descrição/Lesgilação <span style={{ color: "red" }} >*</span></label>
                                            <textarea defaultValue={itemSelected.DESIGNACAO} className="form-control" maxLength="64000" onChange={event => { setDESCRICAO(event.target.value) }} id="obs" rows="3" placeholder='Descrição/Lesgilação...' />
                                        </div>
                                    </Col>
                                </Row>

                            </form>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsEditarOpen(false)}>Fechar</Button>
                            <Button type="submit" form="editarItem" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* --------------------Ver Item------------------- */}
                    {/* 
                    <Modal size='x' show={isVerOpen} onHide={() => setVerOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Tipologia</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <Row style={{ width: "100%", overflow: "auto" }}>
                                <Col sm={5}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Código</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.CODIGO}</span>
                                    </div>
                                </Col>

                                <Col sm={7}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Designação</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.DESIG}</span>
                                    </div>
                                </Col>


                                <div className="col-sm-12">
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Address">Descrição</label>
                                        <label style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.OBS}</label>

                                    </div>
                                </div>




                            </Row>
                        </Modal.Body>
                    </Modal> */}



                    {/* <Modal size="lg" show={isNewentidade} onHide={() => setisNewentidade(false)}>


                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setisNewentidade(false)}>Fechar</Button>
                            <Button variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal> */}

                </Col>
            </Row>
        </React.Fragment>
    );












};
export default Rubricas;