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

import { formatCurrency, pageEnable, taskEnable, taskEnableIcon, taskEnableTitle } from '../../../../functions';


const pageAcess = "/entidades/entidades/equipamento"



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

    async function exportExel() {
        try {

            const response = await api.get(`/export-csv/sgigjentidadegrupo`, { responseType: "blob" })

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



const Equipamento = () => {


    const { popUp_removerItem, popUp_alertaOK } = useAuth();


    const { id } = useParams();

    const [id_params, setid_params] = useState("0");



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
                Header: 'Tipo de Equipamento',
                accessor: 'PREQUIPAMENTO',
                centered: true
            },

            {
                Header: 'Classificação',
                accessor: 'CLASSIFICACAO',
                centered: true
            },

            {
                Header: 'QTD',
                accessor: 'QUANT',
                centered: false
            },

            {
                Header: 'Designação',
                accessor: 'DESIG',
                centered: true
            },

            {
                Header: 'Preço',
                accessor: 'CUSTOM_PRECO',
                centered: false
            },

            {
                Header: 'Ano',
                accessor: 'ANO',
                centered: true
            },


            {
                Header: 'Data Aquisição',
                accessor: 'DATA',
                centered: true
            },

            {
                Header: 'Referência',
                accessor: 'REFERENCIA',
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
    const [ENTIDADE_ID_C, setENTIDADE_ID_C] = useState("");
    const [OBS_C, setOBS_C] = useState("");
    const [ESTADO_C, setESTADO_C] = useState("");

    const [DESIG, setDESIG] = useState("");
    const [DESCR, setDESCR] = useState("");
    const [QUANT, setQUANT] = useState("");
    const [REFERENCIA, setREFERENCIA] = useState("");
    const [PRECO, setPRECO] = useState("");
    const [ANO, setANO] = useState("");
    const [DT_AQUISICAO, setDT_AQUISICAO] = useState("");

    const [ENTIDADE_ID, setENTIDADE_ID] = useState("");
    const [PR_EQUIPAMENTO_TP_ID, setPR_EQUIPAMENTO_TP_ID] = useState("");
    const [PR_EQUIPAMENTO_CLASSIFICACAO_ID, setPR_EQUIPAMENTO_CLASSIFICACAO_ID] = useState("");




    const [itemSelected, setitemSelected] = useState({
        sgigjentidade: {},
        sgigjprequipamentotp: {},
        sgigjprequipamentoclassificacao: {},
    });



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    async function uploadlist() {


        setid_params(id)



        try {

            const response = await api.get('/sgigjentidadeequipamento?ENTIDADE_ID=' + id);

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID


                    response.data[i].id = response.data[i].ID

                    response.data[i].DATA = createDate1(response.data[i].DT_AQUISICAO)
                    response.data[i].CUSTOM_PRECO = formatCurrency(response.data[i].PRECO)

                    response.data[i].ENTIDADE = response.data[i].sgigjentidade.DESIG
                    response.data[i].PREQUIPAMENTO = response.data[i].sgigjprequipamentotp.DESIG
                    response.data[i].CLASSIFICACAO = response.data[i].sgigjprequipamentoclassificacao.CLASSIFICACAO

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


    const [prequipamentotplist, prequipamentotplistlist] = useState([]);

    async function uploadeprequipamento() {

        try {

            const response = await api.get('/sgigjprequipamentotp');

            if (response.status == '200') {

                prequipamentotplistlist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    const [classificacaolist, setclassificacaolist] = useState([]);

    async function uploadclassificacao() {

        try {

            const response = await api.get('/sgigjprequipamentoclassificacao');

            if (response.status == '200') {

                setclassificacaolist(response.data)

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
        setOBS_C(idx.OBS)


        setDESIG(idx.DESIG)
        setDESCR(idx.DESCR)
        setQUANT(idx.QUANT)
        setREFERENCIA(idx.REFERENCIA)
        setPRECO(idx.PRECO)
        setANO(idx.ANO)
        setDT_AQUISICAO(idx.DT_AQUISICAO.slice(0, 10))

        setENTIDADE_ID(idx.ENTIDADE_ID)
        setPR_EQUIPAMENTO_TP_ID(idx.PR_EQUIPAMENTO_TP_ID)
        setPR_EQUIPAMENTO_CLASSIFICACAO_ID(idx.PR_EQUIPAMENTO_CLASSIFICACAO_ID)

    };







    async function editarItemGO(event) {

        event.preventDefault();

        setIsLoading(true)
        const upload = {

            DESIG,
            DESCR,
            QUANT,
            REFERENCIA,
            PRECO,
            ANO,
            DT_AQUISICAO,

            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,
            PR_EQUIPAMENTO_TP_ID,
            PR_EQUIPAMENTO_CLASSIFICACAO_ID,


        }

        console.log(upload)


        try {

            const response = await api.put('/sgigjentidadeequipamento/' + itemSelected.ID, upload);

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

            DESIG,
            DESCR,
            QUANT,
            REFERENCIA,
            PRECO,
            ANO,
            DT_AQUISICAO,

            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,
            PR_EQUIPAMENTO_TP_ID,
            PR_EQUIPAMENTO_CLASSIFICACAO_ID,


        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjentidadeequipamento', upload);

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

            const response = await api.delete('/sgigjentidadeequipamento/' + idx);


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
            uploadclassificacao()
            uploadeprequipamento()

        }


    }, [])







    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isNewentidade, setisNewentidade] = useState(false);



    function doNada() {

    }


    //--------------- Criar Classificacao ----------------

    function openclassificacao() {

        //setIsOpen(false)
        setisclassificacao(true)

        setCLASSIFICACAO_CA("")
        setOBS_CA("")

    }

    const [isclassificacao, setisclassificacao] = useState(false);

    const [CLASSIFICACAO_CA, setCLASSIFICACAO_CA] = useState("");
    const [OBS_CA, setOBS_CA] = useState("");


    async function criarClassificacaoGO(event) {

        event.preventDefault();


        const upload = {

            CLASSIFICACAO: CLASSIFICACAO_CA,
            OBS: OBS_CA,


        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjprequipamentoclassificacao', upload);

            if (response.status == '200') {

                uploadclassificacao()
                setisclassificacao(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }


    //--------------- Criar Tipo Equipamento ----------------

    function openprequipamento() {

        setisprequipamentoopen(true)

        setOBS_PRE("")
        setDESIG_PRE("")

    }

    const [isprequipamentoopen, setisprequipamentoopen] = useState(false);

    const [DESIG_PRE, setDESIG_PRE] = useState("");
    const [OBS_PRE, setOBS_PRE] = useState("");


    async function criarptequipamentoGO(event) {

        event.preventDefault();


        const upload = {

            DESIG: DESIG_PRE,
            OBS: OBS_PRE,


        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjprequipamentotp', upload);

            if (response.status == '200') {

                uploadeprequipamento()
                setisprequipamentoopen(false)

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
                            <h5 className="m-b-10">Equipamentos</h5>
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
                                <Link to='#'>Equipamentos</Link>
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

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tipo de Equipamento <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setPR_EQUIPAMENTO_TP_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {prequipamentotplist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/tipoequipamento", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => openprequipamento()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }
                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Classificação <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setPR_EQUIPAMENTO_CLASSIFICACAO_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {classificacaolist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.CLASSIFICACAO}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/classificacaoequipamento", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => openclassificacao()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }
                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" type="text" onChange={event => { setDESIG(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Quantidade <span style={{ color: "red" }} >*</span></label>
                                            <input max="99999999" type="number" min="0" onChange={event => { setQUANT(event.target.value) }} defaultValue={""} className="form-control" placeholder="Quantidade..." required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Referência <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="25" type="text" onChange={event => { setREFERENCIA(event.target.value) }} defaultValue={""} className="form-control" placeholder="Referência..." required />
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Preço <span style={{ color: "red" }} >*</span></label>
                                            <input max="99999999" type="number" min="0" onChange={event => { setPRECO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Preço..." required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Aquisição <span style={{ color: "red" }} >*</span></label>
                                            <input type="date" onChange={event => { setDT_AQUISICAO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Data..." required />
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>
                                            <input type="number" min="1900" max="2100" onChange={event => { setANO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Ano..." required />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setDESCR(event.target.value) }} defaultValue={""} rows="3" placeholder='Descrição...' />
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
                                            <label className="floating-label" htmlFor="Name">Entidade <span style={{ color: "red" }} >*</span></label>

                                            <input disabled type="text" className="form-control" id="Name" value={

                                                entidadelist.map(e => (
                                                    e.ID == itemSelected.ENTIDADE_ID ? e.DESIG : null
                                                )).join('')

                                            } required />

                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tipo de Equipamento <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={itemSelected.PR_EQUIPAMENTO_TP_ID} onChange={event => { setPR_EQUIPAMENTO_TP_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {prequipamentotplist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/tipoequipamento", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => openprequipamento()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }                                        </span>

                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Classificação <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={itemSelected.PR_EQUIPAMENTO_CLASSIFICACAO_ID} onChange={event => { setPR_EQUIPAMENTO_CLASSIFICACAO_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {classificacaolist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.CLASSIFICACAO}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/classificacaoequipamento", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => openclassificacao()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }

                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" defaultValue={itemSelected.DESIG} type="text" onChange={event => { setDESIG(event.target.value) }} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Quantidade <span style={{ color: "red" }} >*</span></label>
                                            <input max="99999999" type="number" min="0" onChange={event => { setQUANT(event.target.value) }} defaultValue={itemSelected.QUANT} className="form-control" placeholder="Quantidade..." required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Referência <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="25" type="text" onChange={event => { setREFERENCIA(event.target.value) }} defaultValue={itemSelected.REFERENCIA} className="form-control" placeholder="Referência..." required />
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Preço <span style={{ color: "red" }} >*</span></label>
                                            <input max="99999999" type="number" min="0" onChange={event => { setPRECO(event.target.value) }} defaultValue={itemSelected.PRECO} className="form-control" placeholder="Preço..." required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Aquisição <span style={{ color: "red" }} >*</span></label>
                                            <input type="date" onChange={event => { setDT_AQUISICAO(event.target.value) }} defaultValue={DT_AQUISICAO} className="form-control" placeholder="Data..." required />
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>
                                            <input type="number" min="1900" max="2100" onChange={event => { setANO(event.target.value) }} defaultValue={itemSelected.ANO} className="form-control" placeholder="Ano..." required />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setDESCR(event.target.value) }} defaultValue={itemSelected.DESCR} rows="3" placeholder='Descrição...' />
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
                            <Modal.Title as="h5">Equipamento</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >


                            <Row style={{ width: "100%", overflow: "auto" }}>
                                <Col sm={4}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Código</label>
                                        <input style={{ overflow: "auto", height: "auto", minHeight: "33px" }} disabled type="text" className="form-control" id="Name" value="*" required />
                                    </div>
                                </Col>

                                <Col sm={8}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Entidade</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.ENTIDADE}</span>
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Tipo de Equipamento</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.PREQUIPAMENTO}</span>

                                    </div>
                                </Col>


                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Classificação</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.CLASSIFICACAO}</span>


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
                                        <label className="floating-label" htmlFor="Name">Quantidade</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.QUANT}</span>
                                    </div>
                                </Col>

                                <Col sm={8}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Referência</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.REFERENCIA}</span>
                                    </div>
                                </Col>

                                <Col sm={4}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Preço</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.PRECO}</span>
                                    </div>
                                </Col>

                                <Col sm={8}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Data Aquisição</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{DT_AQUISICAO}</span>
                                    </div>
                                </Col>

                                <Col sm={4}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Ano </label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.ANO}</span>
                                    </div>
                                </Col>

                                <div className="col-sm-12">
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Address">Descrição</label>
                                        <span style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{itemSelected.DESCR}</span>
                                    </div>
                                </div>


                            </Row>


                        </Modal.Body>
                    </Modal>




                    {/* --------------------Criar Classificacao------------------- */}

                    <Modal size='x' show={isclassificacao} onHide={() => setisclassificacao(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar Classificação</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarClassificacao" onSubmit={criarClassificacaoGO} >

                                <Row>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value="*" required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Classificação <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" maxLength="64" onChange={event => { setCLASSIFICACAO_CA(event.target.value) }} defaultValue={""} className="form-control" placeholder="Classificação..." required />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea className="form-control" maxLength="64000" onChange={event => { setOBS_CA(event.target.value) }} defaultValue={""} rows="3" placeholder='Descrição...' />
                                        </div>
                                    </div>


                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setisclassificacao(false)}>Fechar</Button>
                            <Button type="submit" form="criarClassificacao" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>



                    {/* --------------------Criar tipo de equipamento------------------- */}

                    <Modal size='x' show={isprequipamentoopen} onHide={() => setisprequipamentoopen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar tipo de equipamento</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarprequipamento" onSubmit={criarptequipamentoGO} >

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
                                            <input type="text" maxLength="128" onChange={event => { setDESIG_PRE(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea className="form-control" maxLength="64000" onChange={event => { setOBS_PRE(event.target.value) }} defaultValue={""} rows="3" placeholder='Descrição...' />
                                        </div>
                                    </div>


                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setisprequipamentoopen(false)}>Fechar</Button>
                            <Button type="submit" form="criarprequipamento" variant="primary">Guardar</Button>
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
export default Equipamento;