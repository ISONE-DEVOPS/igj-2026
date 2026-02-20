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


const pageAcess = "/entidades/entidades/maquina"


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
            const response = await api.get(`/export-pdf/sgigjentidademaquina`, { responseType: "blob" })
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

            const response = await api.get(`/export-csv/sgigjentidademaquina`, { responseType: "blob" })

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



const Maquina = () => {

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
                Header: 'Tipo de Máquina',
                accessor: 'TIPOMAQUINA',
                centered: true
            },

            {
                Header: 'Máquina',
                accessor: 'MAQUINA',
                centered: true
            },

            {
                Header: 'QTD',
                accessor: 'QUANT',
                centered: false
            },

            {
                Header: 'Grupo',
                accessor: 'ENTIDADEGRUPO',
                centered: true
            },

            {
                Header: 'Status',
                accessor: 'STATUS',
                centered: true
            },

            {
                Header: 'País',
                accessor: 'GEOGRAFIA',
                centered: true
            },

            {
                Header: 'Local Produção',
                accessor: 'LOCAL_PRODUCAO',
                centered: true
            },

            {
                Header: 'DT.FABRICO',
                accessor: 'DTFABRICO',
                centered: true
            },

            {
                Header: 'DT.AQUISIÇÃO',
                accessor: 'DTAQUISICAO',
                centered: true
            },

            {
                Header: 'Tipologia',
                accessor: 'TIPOLOGIA',
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


    const [ID_C, setID_C] = useState("");
    const [DESIG_C, setDESIG_C] = useState("");
    const [ENTIDADE_ID_C, setENTIDADE_ID_C] = useState("");
    const [OBS_C, setOBS_C] = useState("");
    const [ESTADO_C, setESTADO_C] = useState("");

    const [DESIG, setDESIG] = useState("");
    const [REFERENCIA, setREFERENCIA] = useState("");
    const [PRECO, setPRECO] = useState("");
    const [ANO, setANO] = useState("");
    const [PR_EQUIPAMENTO_TP_ID, setPR_EQUIPAMENTO_TP_ID] = useState("");
    const [PR_EQUIPAMENTO_CLASSIFICACAO_ID, setPR_EQUIPAMENTO_CLASSIFICACAO_ID] = useState("");
    const [DESCR, setDESCR] = useState("");

    //---------------------------

    const [MAQUINA, setMAQUINA] = useState("");
    const [QUANT, setQUANT] = useState("");
    const [NUM_SERIE, setNUM_SERIE] = useState("");
    const [DT_FABRICO, setDT_FABRICO] = useState("");
    const [LOCAL_PRODUCAO, setLOCAL_PRODUCAO] = useState("");
    const [DT_AQUISICAO, setDT_AQUISICAO] = useState("");

    const [ENTIDADE_ID, setENTIDADE_ID] = useState("");
    const [PR_STATUS_ID, setPR_STATUS_ID] = useState("");
    const [ENTIDADE_GRUPO_ID, setENTIDADE_GRUPO_ID] = useState("");
    const [PR_MAQUINA_TP_ID, setPR_MAQUINA_TP_ID] = useState("");
    const [PAIS_PRODUCAO_ID, setPAIS_PRODUCAO_ID] = useState("");
    const [PR_TIPOLOGIA_ID, setPR_TIPOLOGIA_ID] = useState("");

    const [itemSelected, setitemSelected] = useState({
        sgigjentidade: {},
        sgigjprstatus: {},
        sgigjentidadegrupo: {},
        sgigjprmaquinatp: {},
        glbgeografia: {},
        sgigjprtipologia: {},
    });



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    async function uploadlist() {


        setid_params(id)



        try {

            const response = await api.get('/sgigjentidademaquina?ENTIDADE_ID=' + id);

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID
                    response.data[i].id = response.data[i].ID

                    //-----------------------------------------------------------

                    response.data[i].DATA = createDate1(response.data[i].DT_AQUISICAO)
                    response.data[i].PREQUIPAMENTO = response.data[i].sgigjentidade.DESIG
                    response.data[i].CLASSIFICACAO = response.data[i].sgigjentidade.CLASSIFICACAO

                    //-----------------------------------------------------------

                    response.data[i].ENTIDADE = response.data[i].sgigjentidade.DESIG
                    response.data[i].TIPOLOGIA = response.data[i].sgigjprtipologia.DESIG
                    response.data[i].GEOGRAFIA = response.data[i].glbgeografia.PAIS
                    response.data[i].TIPOMAQUINA = response.data[i].sgigjprmaquinatp.DESIG
                    response.data[i].ENTIDADEGRUPO = response.data[i].sgigjentidadegrupo.DESIG
                    response.data[i].STATUS = response.data[i].sgigjprstatus.DESIG

                    response.data[i].DTFABRICO = createDate1(response.data[i].DT_FABRICO)
                    response.data[i].DTAQUISICAO = createDate1(response.data[i].DT_AQUISICAO)

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



    const [tipomaquinalist, settipomaquinalist] = useState([]);

    async function uploadtipomaquina() {

        try {

            const response = await api.get('/sgigjprmaquinatp');

            if (response.status == '200') {

                settipomaquinalist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }




    const [grupolist, setgrupolist] = useState([]);

    async function uploadgrupo() {

        try {

            const response = await api.get('/sgigjentidadegrupo');

            if (response.status == '200') {

                setgrupolist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    const [statuslist, setstatuslist] = useState([]);

    async function uploadstatus() {

        try {

            const response = await api.get('/sgigjprstatus');

            if (response.status == '200') {

                setstatuslist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    const [tipologialist, settipologialist] = useState([]);

    async function uploadtipologia() {

        try {

            const response = await api.get('/sgigjprtipologia');

            if (response.status == '200') {

                settipologialist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    const [geografialist, setgeografialist] = useState([]);

    async function uploadgeografia() {

        try {

            const response = await api.get('/glbgeografia');

            if (response.status == '200') {

                setgeografialist(response.data)

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

        setDT_FABRICO(idx.DT_FABRICO.slice(0, 10))
        setDT_AQUISICAO(idx.DT_AQUISICAO.slice(0, 10))

        setENTIDADE_ID(idx.sgigjentidade.DESIG)
        setPR_TIPOLOGIA_ID(idx.sgigjprtipologia.DESIG)
        setPAIS_PRODUCAO_ID(idx.glbgeografia.NOME)
        setPR_MAQUINA_TP_ID(idx.sgigjprmaquinatp.DESIG)
        setENTIDADE_GRUPO_ID(idx.sgigjentidadegrupo.DESIG)
        setPR_STATUS_ID(idx.sgigjprstatus.DESIG)

    };



    //-----------------------------------------------'





    //-------------- EDITAR -------------------------


    const openEditHandler = (idx) => {
        setIsEditarOpen(true);
        setIsOpen(false);
        setVerOpen(false);
        setitemSelected(idx)

        setMAQUINA(idx.MAQUINA)
        setQUANT(idx.QUANT)
        setNUM_SERIE(idx.NUM_SERIE)
        setDT_FABRICO(idx.DT_FABRICO.slice(0, 10))
        setLOCAL_PRODUCAO(idx.LOCAL_PRODUCAO)
        setDT_AQUISICAO(idx.DT_AQUISICAO.slice(0, 10))
        setENTIDADE_ID(idx.ENTIDADE_ID)
        setPR_STATUS_ID(idx.PR_STATUS_ID)
        setENTIDADE_GRUPO_ID(idx.ENTIDADE_GRUPO_ID)
        setPR_MAQUINA_TP_ID(idx.PR_MAQUINA_TP_ID)
        setPAIS_PRODUCAO_ID(idx.PAIS_PRODUCAO_ID)
        setPR_TIPOLOGIA_ID(idx.PR_TIPOLOGIA_ID)




    };







    async function editarItemGO(event) {
        event.preventDefault();
        setIsLoading(true)
        const upload = {

            MAQUINA,
            QUANT,
            NUM_SERIE,
            DT_FABRICO,
            LOCAL_PRODUCAO,
            DT_AQUISICAO,
            PR_STATUS_ID,
            ENTIDADE_GRUPO_ID,
            PR_MAQUINA_TP_ID,
            PAIS_PRODUCAO_ID,
            PR_TIPOLOGIA_ID,

            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,


        }

        console.log(upload)

        try {
            const response = await api.put('/sgigjentidademaquina/' + itemSelected.ID, upload);
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


        setDESIG("")
        setDESCR("")
        setQUANT("")
        setREFERENCIA("")
        setPRECO("")
        setANO("")
        setDT_AQUISICAO("")

        setENTIDADE_ID("")
        setPR_EQUIPAMENTO_TP_ID("")
        setPR_EQUIPAMENTO_CLASSIFICACAO_ID("")
    };





    async function criarItemGO(event) {

        event.preventDefault();
        setIsLoading(true)

        const upload = {

            MAQUINA,
            QUANT,
            NUM_SERIE,
            DT_FABRICO,
            LOCAL_PRODUCAO,
            DT_AQUISICAO,
            PR_STATUS_ID,
            ENTIDADE_GRUPO_ID,
            PR_MAQUINA_TP_ID,
            PAIS_PRODUCAO_ID,
            PR_TIPOLOGIA_ID,

            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,


        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjentidademaquina', upload);

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

            const response = await api.delete('/sgigjentidademaquina/' + idx);


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
            uploadtipomaquina()
            uploadgrupo()
            uploadstatus()
            uploadtipologia()
            uploadgeografia()

            uploadentidadelist()

        }



    }, [])





    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isNewentidade, setisNewentidade] = useState(false);



    function doNada() {

    }




    //--------------- Criar Tipo Maquina ----------------

    function openprmaquina() {

        setisprmaquinaopen(true)

        setDESIG_PRM("")
        setOBS_PRM("")

    }

    const [isprmaquinaopen, setisprmaquinaopen] = useState(false);

    const [DESIG_PRM, setDESIG_PRM] = useState("");
    const [OBS_PRM, setOBS_PRM] = useState("");


    async function criarprmaquinaGO(event) {

        event.preventDefault();


        const upload = {

            DESIG: DESIG_PRM,
            OBS: OBS_PRM,


        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjprmaquinatp', upload);

            if (response.status == '200') {

                uploadtipomaquina()
                setisprmaquinaopen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }


    //--------------- Criar Status ----------------

    function openstatus() {

        setisstatusopen(true)

        setDESIG_S("")
        setOBS_S("")

    }

    const [isstatusopen, setisstatusopen] = useState(false);

    const [DESIG_S, setDESIG_S] = useState("");
    const [OBS_S, setOBS_S] = useState("");


    async function criarstatusGO(event) {

        event.preventDefault();


        const upload = {

            DESIG: DESIG_S,
            OBS: OBS_S,


        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjprstatus', upload);

            if (response.status == '200') {

                uploadstatus()
                setisstatusopen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }





    //--------------- Criar Tipologia ----------------

    function opentipologia() {

        setistipologogia(true)

        setDESIG_T("")
        setOBS_T("")

    }

    const [istipologogia, setistipologogia] = useState(false);

    const [DESIG_T, setDESIG_T] = useState("");
    const [OBS_T, setOBS_T] = useState("");


    async function criatipologiaGO(event) {

        event.preventDefault();


        const upload = {

            DESIG: DESIG_T,
            OBS: OBS_T,


        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjprtipologia', upload);

            if (response.status == '200') {

                uploadtipologia()
                setistipologogia(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }





    //--------------- Criar Grupo ----------------

    function opengrupo() {

        setisgrupoopen(true)

        setDESIG_G("")
        setDESCR_G("")
        setTIPO_G("")
        setENTIDADE_ID_G("")

    }

    const [isgrupoopen, setisgrupoopen] = useState(false);

    const [DESIG_G, setDESIG_G] = useState("");
    const [DESCR_G, setDESCR_G] = useState("");
    const [ENTIDADE_ID_G, setENTIDADE_ID_G] = useState("");
    const [TIPO_G, setTIPO_G] = useState("");


    async function criargrupoGO(event) {

        event.preventDefault();

        const upload = {

            DESIG: DESIG_G,
            TIPO: TIPO_G,
            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID_G : id_params,
            DESCR: DESCR_G,


        }
        console.log(upload)


        try {

            const response = await api.post('/sgigjentidadegrupo', upload);

            if (response.status == '200') {

                uploadgrupo()
                setisgrupoopen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }










    return (<>
        {/* 
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <div className="page-header-title">
                            <h5 className="m-b-10">Máquinas</h5>
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
                                <Link to='#'>Máquinas</Link>
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


                    <Modal size='lg' show={isOpen} onHide={() => setIsOpen(false)}>
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
                                            <label className="floating-label" htmlFor="Name">Máquina <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="text" onChange={event => { setMAQUINA(event.target.value) }} defaultValue={""} className="form-control" placeholder="Máquina..." required />
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Quantidade <span style={{ color: "red" }} >*</span></label>
                                            <input max="9999999999" type="number" min="0" onChange={event => { setQUANT(event.target.value) }} defaultValue={""} className="form-control" placeholder="Quantidade..." required />
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tipo de Máquina <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setPR_MAQUINA_TP_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {tipomaquinalist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/tipomaquina", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => openprmaquina()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }
                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Grupo <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>




                                                {
                                                    id_params == 0 ?



                                                        <select onChange={event => { setENTIDADE_GRUPO_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                            <option hidden value="">--- Selecione ---</option>

                                                            {grupolist.map(e => (

                                                                ENTIDADE_ID == e.ENTIDADE_ID ?

                                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                                    : null

                                                            ))}

                                                        </select>



                                                        :

                                                        <select onChange={event => { setENTIDADE_GRUPO_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                            <option hidden value="">--- Selecione ---</option>

                                                            {grupolist.map(e => (

                                                                id_params == e.ENTIDADE_ID ?

                                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                                    : null

                                                            ))}

                                                        </select>

                                                }
                                                {taskEnable("/entidades/entidades/grupo", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => opengrupo()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }
                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Status <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setPR_STATUS_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {statuslist.map(e => (

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
                                            <label className="floating-label" htmlFor="Name">Tipologia <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setPR_TIPOLOGIA_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {tipologialist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/tipologia", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => opentipologia()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }
                                            </span>

                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">País Produtor<span style={{ color: "red" }} >*</span></label>

                                            <select onChange={event => { setPAIS_PRODUCAO_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {geografialist.map(e => (

                                                    e.NIVEL_DETALHE == "1" ?

                                                        <option key={e.ID} value={e.ID}>{e.PAIS}</option>

                                                        : null

                                                ))}

                                            </select>
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Local de Produção <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="text" onChange={event => { setLOCAL_PRODUCAO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Local de Produção..." required />
                                        </div>
                                    </Col>


                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Fabrico <span style={{ color: "red" }} >*</span></label>
                                            <input type="date" onChange={event => { setDT_FABRICO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Data..." required />
                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Aquisição <span style={{ color: "red" }} >*</span></label>
                                            <input type="date" onChange={event => { setDT_AQUISICAO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Data..." required />
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Número de Serie <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="25" type="text" onChange={event => { setNUM_SERIE(event.target.value) }} defaultValue={""} className="form-control" placeholder="Número..." required />
                                        </div>
                                    </Col>




                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsOpen(false)}>Fechar</Button>
                            {!isLoading ? <Button type="submit" form="criarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

                        </Modal.Footer>
                    </Modal>


                    {/* --------------------Editar Item------------------- */}


                    <Modal size='lg' show={isEditarOpen} onHide={() => setIsEditarOpen(false)}>
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
                                            <label className="floating-label" htmlFor="Name">Máquina <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="text" onChange={event => { setMAQUINA(event.target.value) }} defaultValue={itemSelected.MAQUINA} className="form-control" placeholder="Máquina..." required />
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Quantidade <span style={{ color: "red" }} >*</span></label>
                                            <input type="number" max="9999999999" min="0" onChange={event => { setQUANT(event.target.value) }} defaultValue={itemSelected.QUANT} className="form-control" placeholder="Quantidade..." required />
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tipo de Máquina <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={itemSelected.PR_MAQUINA_TP_ID} onChange={event => { setPR_MAQUINA_TP_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {tipomaquinalist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/tipomaquina", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => openprmaquina()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }
                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Grupo <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>




                                                {
                                                    id_params == 0 ?



                                                        <select defaultValue={itemSelected.ENTIDADE_GRUPO_ID} onChange={event => { setENTIDADE_GRUPO_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                            <option hidden value="">--- Selecione ---</option>

                                                            {grupolist.map(e => (

                                                                ENTIDADE_ID == e.ENTIDADE_ID ?

                                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                                    : null

                                                            ))}

                                                        </select>



                                                        :

                                                        <select defaultValue={itemSelected.ENTIDADE_GRUPO_ID} onChange={event => { setENTIDADE_GRUPO_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                            <option hidden value="">--- Selecione ---</option>

                                                            {grupolist.map(e => (

                                                                id_params == e.ENTIDADE_ID ?

                                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                                    : null

                                                            ))}

                                                        </select>

                                                }

                                                {taskEnable("/entidades/entidades/grupo", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => opengrupo()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }

                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Status <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={itemSelected.PR_STATUS_ID} onChange={event => { setPR_STATUS_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {statuslist.map(e => (

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
                                            <label className="floating-label" htmlFor="Name">Tipologia <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={itemSelected.PR_TIPOLOGIA_ID} onChange={event => { setPR_TIPOLOGIA_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {tipologialist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/tipologia", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => opentipologia()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }
                                            </span>

                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">País Produtor<span style={{ color: "red" }} >*</span></label>

                                            <select defaultValue={itemSelected.PAIS_PRODUCAO_ID} onChange={event => { setPAIS_PRODUCAO_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {geografialist.map(e => (

                                                    e.NIVEL_DETALHE == "1" ?

                                                        <option key={e.ID} value={e.ID}>{e.PAIS}</option>

                                                        : null

                                                ))}

                                            </select>
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Local de Produção <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="text" onChange={event => { setLOCAL_PRODUCAO(event.target.value) }} defaultValue={itemSelected.LOCAL_PRODUCAO} className="form-control" placeholder="Local de Produção..." required />
                                        </div>
                                    </Col>


                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Fabrico <span style={{ color: "red" }} >*</span></label>
                                            <input type="date" onChange={event => { setDT_FABRICO(event.target.value) }} defaultValue={DT_FABRICO} className="form-control" placeholder="Data..." required />
                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Aquisição <span style={{ color: "red" }} >*</span></label>
                                            <input type="date" onChange={event => { setDT_AQUISICAO(event.target.value) }} defaultValue={DT_AQUISICAO} className="form-control" placeholder="Data..." required />
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Número de Serie <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="25" type="text" onChange={event => { setNUM_SERIE(event.target.value) }} defaultValue={itemSelected.NUM_SERIE} className="form-control" placeholder="Número..." required />
                                        </div>
                                    </Col>




                                </Row>

                            </form>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsEditarOpen(false)}>Fechar</Button>
                            {!isLoading ? <Button type="submit" form="editarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

                        </Modal.Footer>
                    </Modal>

                    {/* --------------------Ver Item------------------- */}

                    <Modal size='lg' show={isVerOpen} onHide={() => setVerOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Máquina</Modal.Title>
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
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{ENTIDADE_ID}</span>

                                    </div>
                                </Col>

                                <Col sm={8}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Máquina</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.MAQUINA}</span>
                                    </div>
                                </Col>

                                <Col sm={4}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Quantidade</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.QUANT}</span>
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Tipo de Máquina</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{PR_MAQUINA_TP_ID}</span>
                                    </div>
                                </Col>


                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Grupo</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{ENTIDADE_GRUPO_ID}</span>
                                    </div>
                                </Col>


                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Status</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{PR_STATUS_ID}</span>

                                    </div>
                                </Col>


                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Tipologia</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{PR_TIPOLOGIA_ID}</span>

                                    </div>
                                </Col>

                                <Col sm={4}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">País Produtor</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{PAIS_PRODUCAO_ID}</span>

                                    </div>
                                </Col>

                                <Col sm={4}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Local de Produção</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.LOCAL_PRODUCAO}</span>
                                    </div>
                                </Col>


                                <Col sm={4}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Data Fabrico</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{DT_FABRICO}</span>
                                    </div>
                                </Col>


                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Data Aquisição</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{DT_AQUISICAO}</span>
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Número de Serie</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.NUM_SERIE}</span>
                                    </div>
                                </Col>




                            </Row>



                        </Modal.Body>
                    </Modal>




                    {/* --------------------Criar TipoMaquina------------------- */}

                    <Modal size='x' show={isprmaquinaopen} onHide={() => setisprmaquinaopen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar Tipo de Máquina</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarprmaquina" onSubmit={criarprmaquinaGO} >

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
                                            <input maxLength="128" type="text" onChange={event => { setDESIG_PRM(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setOBS_PRM(event.target.value) }} defaultValue={""} rows="3" placeholder='Descrição...' />
                                        </div>
                                    </div>


                                </Row>


                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setisprmaquinaopen(false)}>Fechar</Button>
                            <Button type="submit" form="criarprmaquina" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>





                    {/* --------------------Criar Status------------------- */}

                    <Modal size='x' show={isstatusopen} onHide={() => setisstatusopen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar Status</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarstatus" onSubmit={criarstatusGO} >

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
                            <Button type="submit" form="criarstatus" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>




                    {/* --------------------Criar Tipologia------------------- */}

                    <Modal size='x' show={istipologogia} onHide={() => setistipologogia(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar Tipologia</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criartipologia" onSubmit={criatipologiaGO} >

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
                                            <input maxLength="128" type="text" onChange={event => { setDESIG_T(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setOBS_T(event.target.value) }} defaultValue={""} rows="3" placeholder='Descrição...' />
                                        </div>
                                    </div>


                                </Row>


                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setistipologogia(false)}>Fechar</Button>
                            <Button type="submit" form="criartipologia" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>





                    {/* --------------------Criar Grupo------------------- */}

                    <Modal size='x' show={isgrupoopen} onHide={() => setisgrupoopen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar Grupo</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criargrupo" onSubmit={criargrupoGO} >

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
                                            <input maxLength="128" type="text" onChange={event => { setDESIG_G(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>

                                    </Col>

                                    <Col sm={4}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tipo <span style={{ color: "red" }} >*</span></label>
                                            <select onChange={event => { setTIPO_G(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

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
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setDESCR_G(event.target.value) }} defaultValue={""} rows="3" placeholder='Descrição...' />
                                        </div>
                                    </div>


                                </Row>


                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setisgrupoopen(false)}>Fechar</Button>
                            <Button type="submit" form="criargrupo" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>





                    <Modal size="lg" show={isNewentidade} onHide={() => setistipologogia(false)}>


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
export default Maquina;