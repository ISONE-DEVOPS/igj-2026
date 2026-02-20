import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';


import { Link } from 'react-router-dom';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";



import api from '../../../services/api';

import useAuth from '../../../hooks/useAuth';

import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle } from '../../../functions';


const pageAcess = "/configuracao/lingua"


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



const Customers = () => {


    const { permissoes } = useAuth();

    const history = useHistory();


    const { popUp_removerItem, popUp_alertaOK } = useAuth();



    const columns = React.useMemo(
        () => [

            {
                Header: 'Símbolo',
                accessor: 'SIMBOLO',
                centered: true
            },
            {
                Header: 'Designação',
                accessor: 'DESIG',
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
    const [URL_BANDEIRA_C, setURL_BANDEIRA_C] = useState("");
    const [SIMBOLO, setSIMBOLO] = useState("");
    const [ESTADO_C, setESTADO_C] = useState("");


    const [itemSelected, setitemSelected] = useState({});



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);

    async function uploadlist() {

        try {

            const response = await api.get('/sgigjprlingua');

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID


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

        setID_C(idx.ID)
        setDESIG_C(idx.DESIG)
        setSIMBOLO(idx.SIMBOLO)
        setURL_BANDEIRA_C(idx.URL_BANDEIRA)
        //setESTADO_C(idx.ID)

        setThumnail2(null)
    };







    async function editarItemGO(event) {

        event.preventDefault();

        var anexofile = ""

        if (thumnail2 == null) {

            anexofile = itemSelected.URL_BANDEIRA

        } else {

            const img = await onFormSubmitImage(thumnail2)
            anexofile = img.file.data


        }






        const upload = {

            DESIG: DESIG_C,
            URL_BANDEIRA: anexofile,
            SIMBOLO: SIMBOLO,


        }

        console.log(upload)


        try {

            const response = await api.put('/sgigjprlingua/' + itemSelected.ID, upload);

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
        setThumnail(null)
        setIsOpen(true);
        setIsEditarOpen(false);
        setVerOpen(false);


        setID_C("")
        setDESIG_C("")
        setSIMBOLO("")
        setURL_BANDEIRA_C("")
        setESTADO_C("")
    };





    async function criarItemGO(event) {


        event.preventDefault();

        if (thumnail == null) {

            popUp_alertaOK("Escolha uma imagem")

        } else {



            var anexofile = ""
            const img = await onFormSubmitImage(thumnail)
            anexofile = img.file.data


            const upload = {

                DESIG: DESIG_C,
                URL_BANDEIRA: anexofile,
                SIMBOLO: SIMBOLO,


            }

            console.log(upload)


            try {

                const response = await api.post('/sgigjprlingua', upload);

                if (response.status == '200') {

                    uploadlist()
                    setIsOpen(false)

                }

            } catch (err) {

                console.error(err.response)

            }

        }

    }


    //----------------------------------------------










    //-------------- Remover -------------------------





    const removeItemFunction = async (idx) => {

        let res = true

        try {

            const response = await api.delete('/sgigjprlingua/' + idx);


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

        }




    }, [])




    const [thumnail, setThumnail] = useState(null);

    const preview = React.useMemo(

        () => {
            //return thumnail ? onFormSubmit() : null;
            return thumnail ? URL.createObjectURL(thumnail) : null;
        },

        [thumnail]

    );



    const [thumnail2, setThumnail2] = useState(null);

    const preview2 = React.useMemo(

        () => {
            //return thumnail ? onFormSubmit() : null;
            return thumnail2 ? URL.createObjectURL(thumnail2) : "/static/media/l6.e0eceb02.jpg";
        },

        [thumnail2]

    );



    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isNewentidade, setisNewentidade] = useState(false);



    async function onFormSubmitImage(thumnail) {

        var res = {
            status: false,
            file: null
        }



        try {



            const formData = new FormData();

            formData.append('file', thumnail);

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };


            const uploadResponse = await api.post("/upload", formData, config)

            res = {
                status: true,
                file: uploadResponse
            }

            console.log(uploadResponse)


        } catch (err) {
            console.error(err.response)

            res = {
                status: false,
                file: null
            }
        }


        return res



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


                            <Row>
                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Bandeira</label>
                                        <input accept="image/x-png,image/jpeg" onChange={event => setThumnail(event.target.files[0])} style={thumnail ? { backgroundImage: 'url(' + preview + ')', backgroundSize: "cover", backgroundPosition: "center" } : {}} type="file" id="input-file-now" className="file-upload perfil_img_lingua-none" />
                                    </div>
                                </Col>






                            </Row>
                            <form id="criarItem" onSubmit={criarItemGO} >

                                <Row>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Símbolo <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" maxLength="5" onChange={event => { setSIMBOLO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" maxLength="128" onChange={event => { setDESIG_C(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
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


                            <Row>
                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Bandeira</label>
                                        <input accept="image/x-png,image/jpeg" onChange={event => setThumnail2(event.target.files[0])} style={thumnail2 ? { backgroundImage: 'url(' + preview2 + ')', backgroundSize: "cover", backgroundPosition: "center" } : { backgroundImage: 'url(' + itemSelected.URL_BANDEIRA + '?alt=media&token=0)', backgroundSize: "cover", backgroundPosition: "center" }} type="file" id="input-file-now" className="file-upload perfil_img_lingua-none" />
                                    </div>
                                </Col>
                            </Row>

                            <form id="editarItem" onSubmit={editarItemGO} >


                                <Row>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Símbolo <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" maxLength="5" defaultValue={itemSelected.SIMBOLO} onChange={event => { setSIMBOLO(event.target.value) }} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" maxLength="128" onChange={event => { setDESIG_C(event.target.value) }} defaultValue={itemSelected.DESIG} className="form-control" id="Utilizador" placeholder="Designação..." required />
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

                    <Modal size='x' show={isVerOpen} onHide={() => setVerOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Língua</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <Row>


                                <Col sm={12}>
                                    <div className="form-group fill" style={{ display: "flex", flexDirection: "column" }}>
                                        <label >Bandeira</label>
                                        <label style={{ backgroundImage: 'url(' + itemSelected.URL_BANDEIRA + '?alt=media&token=0)', backgroundSize: "cover", backgroundPosition: "center" }} type="file" id="input-file-now" className="file-upload perfil_img_lingua-ver" htmlFor="Name">Designação</label>
                                    </div>
                                </Col>






                            </Row>


                            <Row style={{ width: "100%", overflow: "auto" }}>



                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Símbolo</label>
                                        <label style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.SIMBOLO}</label>
                                    </div>
                                </Col>


                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Address">Designação</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.DESIG}</span>

                                    </div>
                                </Col>




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