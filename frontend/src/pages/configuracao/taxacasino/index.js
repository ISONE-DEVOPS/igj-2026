import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import Select from 'react-select';

import { Link } from 'react-router-dom';

// import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";

import useAuth from '../../../hooks/useAuth';


import api from '../../../services/api';


import { useHistory } from 'react-router-dom';

import { formatDate, pageEnable, taskEnable, taskEnableIcon, taskEnableTitle, createDate1 } from '../../../functions';


const pageAcess = "/configuracao/taxacasino"

export const Entidades = [
    { value: '1edec189f637517791edc5f7859d5622dfcf', label: 'Casino Maio' },
    { value: '9a182b620443cbef3036ff397d3010f34923', label: 'Casino Santiago' },
    { value: '243954801f3a0dc2306c5d0c0ef45bbd228a', label: 'Casino Royal' },
    { value: '469da868b3ce93bbc7c8465a47f0acfa5aa0', label: 'Casino Boa Vista' },
    { value: '008553d58fb786ad43a600eed327ccf62789', label: 'Casino Mindelo' },

]

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



const TaxaCasino = () => {


    const { permissoes } = useAuth();

    const history = useHistory();


    const { popUp_removerItem, popUp_alertaOK } = useAuth();


    const columns = React.useMemo(
        () => [

            {
                Header: 'Contrapartida 1',
                accessor: 'Art_48_percent',
                centered: false
            },
            {
                Header: 'Contrapartida 2',
                accessor: 'Art_49_percent',
                centered: false
            },
            {
                Header: 'Data',
                accessor: 'DT_REGISTO',
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


    const [NOME, setNOME] = useState("");
    const [ANO, setANO] = useState("");
    const [Art_48_percent, setArt_48_percent] = useState(0);
    const [Art_49_percent, serArt_49_percent] = useState("");
    const [ENTIDADE, setENTIDADE] = useState([]);
    const [ENTIDADE_ID, setENTIDADE_ID] = useState("");


    const [ID, setID] = useState("");


    const [itemSelected, setitemSelected] = useState({});
    const [startYear] = useState(2000);
    const [endYear] = useState(2023);

    const years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);

    async function uploadlist() {

        try {

            const response = await api.get('/contrapartida-entidade');

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID
                    response.data[i].id = response.data[i].ID
                    response.data[i].DT_REGISTO = createDate1(response.data[i].DT_REGISTO)
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
        setENTIDADE_ID(idx.ENTIDADE_ID)
        setVerOpen(true);
        setIsEditarOpen(false);
        setIsOpen(false);
        setitemSelected(idx)

    };



    //-----------------------------------------------'





    //-------------- EDITAR -------------------------


    const openEditHandler = (idx) => {
        setENTIDADE_ID(idx.ENTIDADE_ID)

        setIsEditarOpen(true);
        setIsOpen(false);
        setVerOpen(false);
        setitemSelected(idx)
        setID(idx.ID)
        setArt_48_percent(idx.Art_48_percent)
        serArt_49_percent(idx.Art_49_percent)
        const minLength = Math.max(idx.entidade.length, Entidades.length);
        const filteredArray = [];
        for (let i = 0; i < Entidades.length; i++) {

            let hasEntitity = idx.entidade.find(res => res.ENTIDADE_ID == Entidades[i].value)
            if (hasEntitity) {
                filteredArray.push({
                    value: Entidades[i].value,
                    label: Entidades[i].label,
                });
            }

        }


        setENTIDADE(filteredArray)
        //setESTADO_C(idx.ID)

    }






    async function editarItemGO(event) {

        event.preventDefault();

        const upload = {
            ANO: ANO,
            Art_48_percent: Art_48_percent,
            Art_49_percent: Art_49_percent,
            ENTIDADE_ID: ENTIDADE.map(res => res.value)
        }


        console.log(upload)


        try {

            const response = await api.put('/contrapartida-entidade/' + itemSelected.ID, upload);

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
            Art_48_percent: parseInt(Art_48_percent),
            Art_49_percent: parseInt(Art_49_percent),
            ENTIDADE_ID: ENTIDADE.map(res => res.value)
        }

        console.log(upload)


        try {

            const response = await api.post('/contrapartida-entidade', upload);

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

            const response = await api.delete('/contrapartida-entidade/' + idx);


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
                                    {/* <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value="*" required />
                                        </div>
                                    </Col> */}
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Contrapartida 1 <span style={{ color: "red" }} >*</span></label>
                                            <input onChange={event => { setArt_48_percent(event.target.value) }} type="number" className="form-control" required />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Contrapartida 2 <span style={{ color: "red" }} >*</span></label>
                                            <input onChange={event => { serArt_49_percent(event.target.value) }} type="number" className="form-control" required />
                                        </div>
                                    </Col>
                                    {/* <Col sm={3}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setANO(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {years.map(e => (

                                                        <option key={e} value={e}>{e}</option>

                                                    ))}

                                                </select>
                                            </span>

                                        </div>
                                    </Col> */}

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Entidade <span style={{ color: "red" }} >*</span></label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                onChange={event => setENTIDADE(event)}
                                                name="pessoa"
                                                options={Entidades}
                                                defaultValue={

                                                    ENTIDADE.map(entidade => (

                                                        entidade.value == ENTIDADE_ID ? entidade : null

                                                    ))


                                                }
                                                required
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                placeholder="Entidade..."
                                                isMulti
                                            />
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
                                    {/* <Col sm={4}>
        <div className="form-group fill">
            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
            <input disabled type="text" className="form-control" id="Name" defaultValue={itemSelected.} required />
        </div>
    </Col>  */}
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Contrapartida 1<span style={{ color: "red" }} >*</span></label>
                                            <input defaultValue={itemSelected.Art_48_percent} onChange={event => { setArt_48_percent(event.target.value) }} type="number" className="form-control" required />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Contrapartida 2 <span style={{ color: "red" }} >*</span></label>
                                            <input defaultValue={itemSelected.Art_49_percent} onChange={event => { serArt_49_percent(event.target.value) }} type="number" className="form-control" required />
                                        </div>
                                    </Col>
                                    {/* <Col sm={3}>

        <div className="form-group fill">
            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>

            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                <select defaultValue={itemSelected.ANO} onChange={event => { setANO(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                    <option hidden value="">-- Selecione --</option>

                    {years.map(e => (

                        <option key={e} value={e}>{e}</option>

                    ))}

                </select>
            </span>

        </div>
    </Col> */}

                                    <Col sm={9}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Entidade <span style={{ color: "red" }} >*</span></label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                onChange={event => setENTIDADE(event)}
                                                name="pessoa"
                                                options={Entidades}
                                                defaultValue={ENTIDADE}
                                                required
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                placeholder="Entidade..."
                                                isMulti
                                            />
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
        </React.Fragment >
    );












};
export default TaxaCasino;