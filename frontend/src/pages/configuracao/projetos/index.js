import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';


import { Link } from 'react-router-dom';

// import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";

import useAuth from '../../../hooks/useAuth';


import api from '../../../services/api';


import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle, formatDate, createDa, makedate, formatCurrency, setParams } from '../../../functions';


const pageAcess = "/configuracao/projetos"



function Table({ columns, data, modalOpen, uploadlist }) {
    const [ano, setAno] = useState("")
    const [timeoutId, setTimeoutId] = useState(null);

    const { permissoes } = useAuth();
    function handleChangeAno(ano) {
        setAno(ano)

        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // Set a new timeout
        const newTimeoutId = setTimeout(() => {
            uploadlist(ano)
        }, 1500);

        // Save the new timeout ID
        setTimeoutId(newTimeoutId);


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

                <Col md={3}>
                    <select
                        onChange={event => { handleChangeAno(event.target.value) }}
                        className="form-control"
                    >
                        <option value="">Todos os anos</option>
                        {Array.from({ length: new Date().getFullYear() - 2022 + 1 }, (_, i) => 2022 + i).map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </Col>
                <Col className='d-flex justify-content-end'>
                    {/* <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} /> */}
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



const Projetos = () => {


    const { permissoes } = useAuth();

    const history = useHistory();


    const { popUp_removerItem, popUp_alertaOK } = useAuth();


    const columns = React.useMemo(
        () => [
            {
                Header: 'Ano',
                accessor: 'ANO',
                centered: true
            },
            {
                Header: 'Designação',
                accessor: 'NOME',
                centered: true
            },
            {
                Header: 'Orçamento Inical',
                accessor: 'ORCAMENTO_INICIAL_FORMATTED',
                centered: false
            }, {
                Header: 'Orçamento Corrigido',
                accessor: 'ORCAMENTO_CORRIGIDO_FORMATTED',
                centered: false
            },
            {
                Header: 'Orçamento Disponível',
                accessor: 'ORCAMENTO_DISPONIVEL_FORMATTED',
                centered: false
            },

            {
                Header: 'Pago',
                accessor: 'PAGO_FORMATTED',
                centered: false
            },
            {
                Header: 'Pago %',
                accessor: 'PAGO_PERCENT',
                centered: false
            },
            {
                Header: 'Saldo Disponível',
                accessor: 'SALDO_DISPONIVEL_FORMATTED',
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


    const [NOME, setNOME] = useState("");
    const [ANO, setANO] = useState(0);
    const [OBS, setOBS] = useState("");
    const [ORCAMENTO_INICIAL, setORCAMENTO_INICIAL] = useState(0);
    const [ORCAMENTO_CORRIGIDO, setORCAMENTO_CORRIGIDO] = useState(0);
    const [ID, setID] = useState("");


    const [itemSelected, setitemSelected] = useState({});



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);

    async function uploadlist(ano) {
        ano = ano === "" ? undefined : ano

        try {

            const response = await api.get('/projetos?' + setParams([["ANO", ano]]));
            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID


                    response.data[i].id = response.data[i].ID
                    response.data[i].DT_REGISTO = makedate(response.data[i].DT_REGISTO)
                    response.data[i].ORCAMENTO_CORRIGIDO_FORMATTED = formatCurrency(response.data[i].ORCAMENTO_CORRIGIDO)
                    response.data[i].ORCAMENTO_INICIAL_FORMATTED = formatCurrency(response.data[i].ORCAMENTO_INICIAL)
                    response.data[i].ORCAMENTO_DISPONIVEL_FORMATTED = formatCurrency(response.data[i].ORCAMENTO_DISPONIVEL)
                    response.data[i].SALDO_DISPONIVEL_FORMATTED = formatCurrency(response.data[i].SALDO_DISPONIVEL)
                    response.data[i].PAGO_FORMATTED = response.data[i].PAGO == null ? 0 : formatCurrency(response.data[i].PAGO)


                    const itemx = response.data[i]

                    response.data[i].action =
                        <React.Fragment>
                            {/* {taskEnable(pageAcess, permissoes, "Ler") == false ? null :
                                <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Ler")} onClick={() => openVerHandler(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Ler")} /></Link>
                            } */}

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
        setID(idx.ID)
        setNOME(idx.NOME)
        setOBS(idx.OBS)
        setORCAMENTO_CORRIGIDO(idx.ORCAMENTO_CORRIGIDO)
        setORCAMENTO_INICIAL(idx.ORCAMENTO_INICIAL)
        setANO(idx.ANO)
        // setitemSelected(idx)
        setIsEditarOpen(true);
        setIsOpen(false);
        setVerOpen(false);
    };







    async function editarItemGO(event) {

        event.preventDefault();

        const upload = {
            NOME: NOME,
            OBS: OBS,
            ANO: ANO,
            ORCAMENTO_INICIAL: ORCAMENTO_INICIAL,
            ORCAMENTO_CORRIGIDO: ORCAMENTO_CORRIGIDO

        }

        console.log(upload)


        try {

            const response = await api.put('/projetos/' + ID, upload);

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
        setID("")
        setNOME("")
        setOBS("")
        setORCAMENTO_CORRIGIDO(0)
        setORCAMENTO_INICIAL(0)
        setIsOpen(true);
        setIsEditarOpen(false);
        setVerOpen(false);

    };





    async function criarItemGO(event) {

        event.preventDefault();


        const upload = {

            NOME: NOME,
            OBS: OBS,
            ANO: ANO,
            ORCAMENTO_INICIAL: ORCAMENTO_INICIAL,
            ORCAMENTO_CORRIGIDO: ORCAMENTO_CORRIGIDO
        }

        console.log(upload)


        try {

            const response = await api.post('/projetos', upload);

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

            const response = await api.delete('/projetos/' + idx);


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
                            <Table columns={columns} data={newdata} modalOpen={openHandler} uploadlist={uploadlist} />
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
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value="*" required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Nome <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" maxLength="128" onChange={event => { setNOME(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>

                                            <input
                                                type="number"
                                                className='form-control '
                                                placeholder='Ano...'
                                                onChange={event => { setANO(event.target.value) }} />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Inicial <span style={{ color: "red" }} >*</span></label>

                                            <input
                                                type="number" onChange={event => { setORCAMENTO_INICIAL(event.target.value) }} className="form-control" required placeholder='Orçamento Inicial...' />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Corrigido <span style={{ color: "red" }} >*</span></label>

                                            <input
                                                type="number" onChange={event => { setORCAMENTO_CORRIGIDO(event.target.value) }} required className="form-control" placeholder='Orçamento Corrigido...' />

                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Observação <span style={{ color: "red" }} >*</span></label>
                                            <textarea className="form-control" maxLength="64000" onChange={event => { setOBS(event.target.value) }} id="obs" required rows="3" placeholder='Observação...' />
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

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Nome <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" maxLength="128" onChange={event => { setNOME(event.target.value) }} defaultValue={NOME} className="form-control" id="Utilizador" placeholder="Designação..." required />
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>

                                            <input
                                                type="number"
                                                defaultValue={ANO}
                                                className='form-control '
                                                placeholder='Ano...'
                                                onChange={event => { setANO(event.target.value) }} />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Inicial <span style={{ color: "red" }} >*</span></label>

                                            <input
                                                type="number" onChange={event => { setORCAMENTO_INICIAL(event.target.value) }} defaultValue={ORCAMENTO_INICIAL} className="form-control" placeholder='Orçamento Inicial...'
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Corrigido <span style={{ color: "red" }} >*</span></label>

                                            <input
                                                type="number" onChange={event => { setORCAMENTO_CORRIGIDO(event.target.value) }} defaultValue={ORCAMENTO_CORRIGIDO} className="form-control" placeholder='Orçamento Corrigido...' />

                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Observação <span style={{ color: "red" }} >*</span></label>
                                            <textarea className="form-control" defaultValue={OBS} maxLength="64000" onChange={event => { setOBS(event.target.value) }} id="obs" rows="3" placeholder='Observação...' />
                                        </div>
                                    </Col>

                                    {/* <Col sm={6}>

                                        <div className="form-group form-check">
                                            <input type="text" maxLength="128" onChange={event => { setTEM_NUMERO(event.target.value) }} defaultValue={itemSelected.TEM_NUMERO === 0 ? false : true} className="form-control" placeholder="Designação..." required />
                                            <label className="floating-label" htmlFor="Name">É Cheque ? <span style={{ color: "red" }} >*</span></label>

                                        </div>
                                    </Col> */}








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
export default Projetos;