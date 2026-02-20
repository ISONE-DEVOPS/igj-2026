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


const pageAcess = "/administracao/utilizador"

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
                Header: 'Foto',
                accessor: 'img',
                maxWidth: 400,
                minWidth: 400,
                width: 400,
                centered: true

            },

            {
                Header: 'Nome',
                accessor: 'NOME',
                centered: true
            },

            {
                Header: 'Utilizador',
                accessor: 'USERNAME',
                centered: true
            },


            {
                Header: 'Perfil',
                accessor: 'PERFIL',
                centered: true
            },

            {
                Header: 'Estado',
                accessor: 'active',
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


    //-------------------------- UPLOAD -----------------
    const [isLoading, setIsLoading] = useState(false)

    const [newdata, setnewdata] = useState([]);

    async function uploadlist() {

        try {

            const response = await api.get('/glbuser');

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID

                    response.data[i].img = <img className="img-fluid m-r-5" src={response.data[i].URL_FOTO + '?alt=media&token=0'} style={{ width: '28px', height: '28px' }} alt="Foto Perfil" />
                    response.data[i].id = response.data[i].ID
                    response.data[i].NOME = response.data[i].sgigjrelpessoaentidade != null ? response.data[i].sgigjrelpessoaentidade.sgigjpessoa.NOME : ""
                    response.data[i].PERFIL = response.data[i].glbperfil.DESIG

                    const itemx = response.data[i]


                    response.data[i].active =
                        <div className="custom-control custom-switch">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id={'customSwitch' + response.data[i].ID}
                                disabled={taskEnable(pageAcess, permissoes, "Editar") ? false : true}
                                defaultChecked={response.data[i].ESTADO == 1 ? true : false}
                                onChange={event => changeESTADO(event.target.checked, itemx)}
                            />

                            <label className="custom-control-label" htmlFor={'customSwitch' + response.data[i].ID} />
                        </div>


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





    const [pessoalist, setpessoalist] = useState([]);

    async function uploadpessoa() {

        try {

            const response = await api.get('/sgigjpessoa');

            if (response.status == '200') {

                setpessoalist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }



    }





    const [perfillist, setperfillist] = useState([]);

    async function uploadperfillist() {

        try {

            const response = await api.get('/glbperfil');

            if (response.status == '200') {

                setperfillist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }



    }





    //-------------- Ver -------------------------

    const [itemSelected, setitemSelected] = useState({});


    const openVerHandler = (idx) => {
        setVerOpen(true);
        setIsEditarOpen(false);
        setIsOpen(false);
        setitemSelected(idx)
    };



    //-----------------------------------------------'





    //-------------- Editar -------------------------


    const openEditHandler = (idx) => {
        setIsEditarOpen(true);
        setIsOpen(false);
        setVerOpen(false);
        setitemSelected(idx)
        setFLAG_NOTIFICACAO(idx.FLAG_NOTIFICACAO)

        setThumnail2(null)


        setUSERNAME(idx.USERNAME)
        setPERFIL_ID(idx.PERFIL_ID)
        setREL_PESSOA_ENTIDADE_ID(idx.REL_PESSOA_ENTIDADE_ID)



    };




    async function editarItemGO(event) {



        event.preventDefault();
        setIsLoading(true)

        var anexofile = ""

        if (thumnail2 == null) {

            anexofile = itemSelected.URL_FOTO + "?alt=media&token=0"

        } else {

            const img = await onFormSubmitImage(thumnail2)
            anexofile = img.file.data


        }




        const upload = {

            USERNAME,
            PERFIL_ID,
            REL_PESSOA_ENTIDADE_ID,
            FLAG_NOTIFICACAO,
            URL_FOTO: anexofile,

        }

        console.log(upload)


        try {

            const response = await api.put('/glbuser/' + itemSelected.ID, upload);

            if (response.status == '200') {
                setIsLoading(false)

                uploadlist()
                setIsEditarOpen(false)

            }

        } catch (err) {
            setIsLoading(false)

            console.error(err.response)

        }



    }

    async function changeESTADO(v, itemx) {



        const estadoGO = v ? "0" : "1"


        const upload = {

            USERNAME: itemx.USERNAME,
            PERFIL_ID: itemx.PERFIL_ID,
            REL_PESSOA_ENTIDADE_ID: itemx.REL_PESSOA_ENTIDADE_ID,
            URL_FOTO: itemx.URL_FOTO,
            ESTADO: estadoGO,

        }

        console.log(upload)


        try {

            const response = await api.put('/glbuser/' + itemx.ID, upload);

        } catch (err) {

            popUp_alertaOK("Não foi possível mudar o estado")
            uploadlist()

            console.error(err.response)

        }


    }




    //-----------------------------------------------








    //-------------- Remover -------------------------




    const removeItemFunction = async (idx) => {

        let res = true

        try {

            const response = await api.delete('/glbuser/' + idx);


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

            uploadpessoa()
            uploadperfillist()


        }


    }, [])


    const [CODIGO, setCODIGO] = useState("");
    const [USERNAME, setUSERNAME] = useState("");
    const [PASSWORD, setPASSWORD] = useState("");
    const [FLAG_NOTIFICACAO, setFLAG_NOTIFICACAO] = useState("i");
    const [URL_FOTO, setURL_FOTO] = useState("");


    const [REL_PESSOA_ENTIDADE_ID, setREL_PESSOA_ENTIDADE_ID] = useState("");
    const [PERFIL_ID, setPERFIL_ID] = useState("");





    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isNewentidade, setisNewentidade] = useState(false);




    const openHandler = () => {
        setIsOpen(true);
        setIsEditarOpen(false);
        setVerOpen(false);


        setCODIGO("")
        setUSERNAME("")
        setPASSWORD("")
        setURL_FOTO("")
    };



    async function criarItemGO(event) {


        event.preventDefault();
        setIsLoading(true)
        if (thumnail == null) {

            popUp_alertaOK("Escolha uma imagem")

        } else {



            var anexofile = ""
            const img = await onFormSubmitImage(thumnail)
            anexofile = img.file.data


            const upload = {

                USERNAME,
                PASSWORD,
                PERFIL_ID,
                REL_PESSOA_ENTIDADE_ID,
                FLAG_NOTIFICACAO,
                URL_FOTO: anexofile,


            }


            try {

                const response = await api.post('/glbuser', upload);

                if (response.status == '200') {
                    setIsLoading(false)

                    uploadlist()
                    setIsOpen(false)

                }

            } catch (err) {
                setIsLoading(false)

                console.error(err.response)

            }

        }

    }



    const openNewentidade = () => {
        setisNewentidade(true);
        setVerOpen(false);
        setIsEditarOpen(false);
        setIsOpen(false);
        //setid(idx)
    };

    function doNada() {

    }



    function changeNotifi(v) {

        console.log(v)

        setFLAG_NOTIFICACAO(v ? "0" : "1")

    }








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
            return thumnail2 ? URL.createObjectURL(thumnail2) : "";
        },

        [thumnail2]

    );



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
                    <Modal size='x' show={isOpen} onHide={() => setIsOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >


                            <Row>
                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Foto Perfil</label>
                                        <input onChange={event => setThumnail(event.target.files[0])} style={thumnail ? { backgroundImage: 'url(' + preview + ')', backgroundSize: "cover", backgroundPosition: "center" } : {}} type="file" id="input-file-now" className="file-upload perfil_img_upload-none" />
                                    </div>


                                    <div className="custom-control custom-switch">



                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id={'customSwitchNotC' + "0001"}
                                            defaultChecked={FLAG_NOTIFICACAO == "0" ? true : false}
                                            onChange={event => changeNotifi(event.target.checked)}
                                        />

                                        <label className="custom-control-label" htmlFor={'customSwitchNotC' + "0001"} />

                                        Notificações

                                    </div>

                                </Col>








                            </Row>
                            <Row>

                                <form id="criarItem" onSubmit={criarItemGO} >

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="codigo" placeholder="0004" required />
                                        </div>
                                    </Col>


                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Perfil">Nome <span style={{ color: "red" }} >*</span></label>
                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setREL_PESSOA_ENTIDADE_ID(event.target.value) }} className="form-control" id="pessoa" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {pessoalist.map(e => (

                                                        e.sgigjrelpessoaentidade.length > 0 ?

                                                            e.sgigjrelpessoaentidade.map(ex => (

                                                                ex.glbuser.length > 0 ? null :

                                                                    <option key={ex.ID} title={e.CODIGO} value={ex.ID}>{e.NOME}</option>

                                                            ))





                                                            : null

                                                    ))
                                                    }

                                                </select>

                                            </span>
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Utilizador <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" onChange={event => { setUSERNAME(event.target.value) }} className="form-control" id="Utilizador" placeholder="Utilizador" required />
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Perfil">Perfil <span style={{ color: "red" }} >*</span></label>
                                            <select onChange={event => { setPERFIL_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>




                                                {perfillist.map(e => (


                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>


                                                ))

                                                }

                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Password">Password <span style={{ color: "red" }} >*</span></label>
                                            <input type="password" onChange={event => { setPASSWORD(event.target.value) }} className="form-control" id="Password" autoComplete="off" placeholder="Password..." required />
                                        </div>
                                    </Col>

                                </form>

                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsOpen(false)}>Fechar</Button>
                            {!isLoading ? <Button type="submit" form="criarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>

                            }
                        </Modal.Footer>
                    </Modal>





                    <Modal size='x' show={isEditarOpen} onHide={() => setIsEditarOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Editar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >
                            <Row>
                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Foto Perfil</label>
                                        <input onChange={event => setThumnail2(event.target.files[0])} style={thumnail2 ? { backgroundImage: 'url(' + preview2 + ')', backgroundSize: "cover", backgroundPosition: "center" } : { backgroundImage: 'url(' + itemSelected.URL_FOTO + '?alt=media&token=0)', backgroundSize: "cover", backgroundPosition: "center" }} type="file" id="input-file-now" className="file-upload perfil_img_upload-none" />
                                    </div>


                                    <div className="custom-control custom-switch">



                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id={'customSwitchNotEdit' + itemSelected.ID}
                                            defaultChecked={FLAG_NOTIFICACAO == "0" ? true : false}
                                            onChange={event => changeNotifi(event.target.checked)}
                                        />

                                        <label className="custom-control-label" htmlFor={'customSwitchNotEdit' + itemSelected.ID} />

                                        Notificações

                                    </div>


                                </Col>






                            </Row>
                            <Row>

                                <form id="editarItem" onSubmit={editarItemGO} >

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label disabled className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" disabled onChange={() => doNada()} defaultValue={itemSelected.CODIGO} className="form-control" id="Name" placeholder="code" required />
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Perfil">Nome <span style={{ color: "red" }} >*</span></label>
                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <select onChange={event => setREL_PESSOA_ENTIDADE_ID(event.target.value)} defaultValue={itemSelected.REL_PESSOA_ENTIDADE_ID} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>




                                                    {pessoalist.map(e => (

                                                        e.sgigjrelpessoaentidade.length > 0 ?

                                                            e.sgigjrelpessoaentidade.map(ex => (

                                                                ex.ID == itemSelected.REL_PESSOA_ENTIDADE_ID ?

                                                                    <option key={ex.ID} title={e.CODIGO} value={ex.ID}>{e.NOME}</option>

                                                                    : null

                                                            ))





                                                            : null

                                                    ))
                                                    }



                                                    {pessoalist.map(e => (

                                                        e.sgigjrelpessoaentidade.length > 0 ?

                                                            e.sgigjrelpessoaentidade.map(ex => (

                                                                ex.glbuser.length != 0 ? null :

                                                                    <option key={ex.ID} value={ex.ID}>{e.NOME}</option>

                                                            ))





                                                            : null

                                                    ))
                                                    }

                                                </select>
                                            </span>
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Utilizador <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" onChange={event => setUSERNAME(event.target.value)} defaultValue={itemSelected.USERNAME} className="form-control" id="Utilizador" placeholder="username" required />
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Perfil">Perfil <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={itemSelected.PERFIL_ID} className="form-control" onChange={event => setPERFIL_ID(event.target.value)} id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {perfillist.map(e => (


                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>


                                                ))

                                                }

                                            </select>
                                        </div>
                                    </Col>


                                </form>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsEditarOpen(false)}>Fechar</Button>
                            {!isLoading ? <Button type="submit" form="editarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>
                            }
                        </Modal.Footer>
                    </Modal>


                    <Modal size='x' show={isVerOpen} onHide={() => setVerOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5"></Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >
                            <Row>
                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Foto Perfil</label>
                                        <label style={{ backgroundImage: 'url(' + itemSelected.URL_FOTO + '?alt=media&token=0)', backgroundSize: "cover", backgroundPosition: "center" }} className="file-upload perfil_img_upload-none" />
                                    </div>


                                    <div className="custom-control custom-switch">



                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            disabled={true}
                                            defaultChecked={itemSelected.FLAG_NOTIFICACAO == "0" ? true : false}
                                        />

                                        <label className="custom-control-label" />

                                        Notificações

                                    </div>


                                </Col>






                            </Row>
                            <Row>
                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Código</label>
                                        <label className="form-control">{itemSelected.CODIGO}</label>
                                    </div>
                                </Col>

                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Nome</label>
                                        <label className="form-control">{itemSelected.NOME}</label>
                                    </div>
                                </Col>


                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Utilizador</label>
                                        <label className="form-control">{itemSelected.USERNAME}</label>
                                    </div>
                                </Col>

                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Perfil</label>
                                        <label className="form-control">{itemSelected.PERFIL}</label>
                                    </div>
                                </Col>




                            </Row>
                        </Modal.Body>
                    </Modal>






                </Col>
            </Row>
        </React.Fragment>
    );












};
export default Customers;