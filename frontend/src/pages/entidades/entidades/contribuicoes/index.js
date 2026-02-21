import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, ListGroup } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { useParams } from 'react-router-dom';
import { saveAs } from 'file-saver';

import { Link } from 'react-router-dom';

import { GlobalFilter } from './../GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";



import api from '../../../../services/api';

import useAuth from '../../../../hooks/useAuth';

import toast from 'react-hot-toast';

import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle, formatCurrency, parseCurrency, sumValues, formatDate, onFormSubmitImage, setParams, makedate } from '../../../../functions';


const pageAcess = "/entidades/entidades/detalhes"

function Table({ columns, data, modalOpen, years, uploadList, uploadmeiospagamento }) {
    const [ANO, setANO] = useState("")

    const { id } = useParams();
    var total_Bruto
    var total_Montante_Recebido
    const [values, setValues] = useState()

    if (data.length > 0) {
        const listBruto = data.map(res => parseCurrency(res.VALOR))
        total_Bruto = sumValues(listBruto)
        const listMontanteRecebido = data.map(res => parseCurrency(res.MONTANTE_RECEBIDO))
        total_Montante_Recebido = sumValues(listMontanteRecebido)
    }

    const { permissoes } = useAuth();
    // const totalBRUTO = parseCurrency(totalBruto)
    function optionDownload(value) {
        if (value === "1") {
            exportPDFContribuicoes();
        } else if (value === "2") {
            exportExel()
        }
    }
    async function exportPDFContribuicoes() {
        const ano = ANO === "" ? undefined : ANO

        try {

            const response = await api.get(`/export-pdf/contribuicoes?ENTIDADE_ID=${id}` + setParams([["ANO", ano]]), { responseType: "blob" });

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
        const ano = ANO === "" ? undefined : ANO

        try {

            const response = await api.get(`/export-csv/imposto?ENTIDADE_ID=${id}` + setParams([["ANO", ano]]), { responseType: "blob" });

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
    function handleChangeAno(ano) {
        setANO(ano)
        uploadList(ano)
        uploadmeiospagamento()
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
                <Col md={3} className="d-flex align-items-center">
                    <select onChange={event => { handleChangeAno(event.target.value) }} className="form-control" style={{ minWidth: '150px' }}>
                        <option value="">Todos os anos</option>
                        {Array.from({ length: new Date().getFullYear() - 2022 + 1 }, (_, i) => 2022 + i).map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>

                </Col>
                <Col className='d-flex justify-content-end'>
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
                                <th className={column.id === 'VALOR' || column.id === 'MONTANTE_RECEBIDO' ? 'text-right' : ''} {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                    <tr>
                        <td className="merged-cell font-weight-bold" colspan="2">Total</td>
                        <td className='font-weight-bold text-right'>{formatCurrency(total_Bruto)}</td>
                        <td className='font-weight-bold'></td>
                        <td className='font-weight-bold'></td>
                        <td className='font-weight-bold text-right'>{formatCurrency(total_Montante_Recebido)}</td>
                        <td className='font-weight-bold'></td>
                        <td className='font-weight-bold'></td>

                    </tr>
                    {/* <div style={{ width: '100px', height: '100px', backgroundColor: "red" }}
                        className=''>

                    </div> */}
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



const Contribuicoes = () => {

    const { id } = useParams();

    const [id_params, setid_params] = useState("0");

    const { popUp_removerItem, popUp_alertaOK } = useAuth();


    const { permissoes } = useAuth();

    const history = useHistory();
    var todayDate = new Date().toJSON().slice(0, 10);


    const columns = React.useMemo(
        () => [
            {
                Header: 'Estado',
                accessor: 'COLOR_STATUS',
                centered: true

            },
            {
                Header: 'Mês',
                accessor: 'MES',
                centered: true

            },
            {
                Header: 'Valor',
                accessor: 'VALOR',
                centered: false

            },
            {
                Header: 'Data DUC',
                accessor: 'DATA_EMISSAO_DUC',
                centered: false

            },
            {
                Header: 'DUC',
                accessor: 'DUC',
                centered: false

            },
            {
                Header: 'Montante Recebido',
                accessor: 'MONTANTE_RECEBIDO',
                centered: false

            },
            {
                Header: 'Data Tesouro',
                accessor: 'DT_CONFIRMACAO',
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





    const [ANO, setANO] = useState(0);
    const [MES, setMES] = useState("");
    const [BRUTO, setBRUTO] = useState(0);
    const [Art_48, setArt_48] = useState(0);
    const [DUC, setDUC] = useState(0);
    const [ENTIDADE_ID, setENTIDADE_ID] = useState("");


    const [ID_C, setID_C] = useState("");
    const [DESIG_C, setDESIG_C] = useState("");
    const [ENTIDADE_ID_C, setENTIDADE_ID_C] = useState("");
    const [OBS_C, setOBS_C] = useState("");
    const [ESTADO_C, setESTADO_C] = useState("");

    const [TOTAL_BRUTO, setTOTAL_BRUTO] = useState(0);
    const [TOTAL_ART48, setTOTAL_ART48] = useState(0);
    const [TOTAL_ART49, setTOTAL_ART49] = useState(0);

    const [banco, setBanco] = useState("");

    const [meiopagamento, setMeioPagamento] = useState("");
    const [cheque, setCheque] = useState("");
    const [dataconfirmacao, setDataConfirmacao] = useState("");
    const [dataemissao, setDataEmissao] = useState("");
    const [docFile, setDocFile] = useState(null);

    const [contribuicoesId, setContribuicoesId] = useState("");
    const [montanteRecebido, setMontanteRecebido] = useState(0);

    const [isCheck, setIsCheck] = useState(false);
    const [defaultMeioPagamento, setDefaultMeioPagamento] = useState();

    const [itemSelected, setitemSelected] = useState({
    });
    const [activeProfileTab, setActiveProfileTab] = useState("mensalidade");
    const profileTabClass = "nav-link text-reset";
    const profileTabActiveClass = "nav-link text-reset active";

    const month = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];
    const [startYear] = useState(2000);
    const [endYear] = useState(2023);

    const years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }

    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    async function uploadlist(ano) {
        ano = ano === "" ? undefined : ano

        setid_params(id)



        try {

            const response = await api.get('/contribuicoes?ENTIDADE_ID=' + id + setParams([["ANO", ano]]));

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {
                    const idx = response.data[i].ID


                    response.data[i].VALOR = formatCurrency(response.data[i].VALOR)

                    response.data[i].id = response.data[i].ID
                    // response.data[i].TOTAL = formatCurrency((parseCurrency(response.data[i].Art_48) + parseCurrency(response.data[i].Art_49)))


                    if (response.data[i].pagamento.length > 0) {
                        response.data[i].MONTANTE_RECEBIDO = formatCurrency(response.data[i].pagamento[0].VALOR)
                        response.data[i].DT_CONFIRMACAO = makedate(response.data[i].pagamento[0].DT_CONFIRMACAO)
                        response.data[i].DATA_EMISSAO_DUC = makedate(response.data[i].pagamento[0].DT_EMISSAO_DUC)
                        response.data[i].DUC = response.data[i].pagamento[0].DUC
                        response.data[i].COLOR_STATUS =
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <div style={{ backgroundColor: "red", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid red" }} />
                                <div style={{ backgroundColor: "green", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid green" }} />
                            </div>
                    } else {
                        response.data[i].MONTANTE_RECEBIDO = 0
                        response.data[i].DT_CONFIRMACAO = ""
                        response.data[i].DATA_EMISSAO_DUC = ""
                        response.data[i].DUC = ""
                        response.data[i].COLOR_STATUS =
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <div style={{ backgroundColor: "red", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid red" }} />
                            </div>
                    }
                    const itemx = response.data[i]

                    response.data[i].action =
                        <React.Fragment>
                            {taskEnable(pageAcess, permissoes, "Ler") == false ? null :
                                <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Ler")} onClick={() => openVerHandler(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Ler")} /></Link>
                            }

                            {!response.data[i]?.pagamento?.length > 0 && taskEnable(pageAcess, permissoes, "Editar") == true ? <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Editar")} onClick={() => openEditHandler(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Editar")} /></Link>
                                : null
                            }
                            {!response.data[i]?.pagamento?.length > 0 && taskEnable(pageAcess, permissoes, "ConfirmacaoPagamento") == true ? <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "ConfirmacaoPagamento")} onClick={() => openCriarRecebimento(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "ConfirmacaoPagamento")} /></Link>
                                : null
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



    function getMeioPagamenot(obj) {
        let meiopagamento = meiopagamentos.find(res => res.ID == obj.pagamento[0].meiopagamento.ID)

        return meiopagamento
    }






    const [prbancatp, setprbancatp] = useState([]);

    async function uploadeprbancatp() {

        try {

            const response = await api.get('/sgigjprbancatp');

            if (response.status == '200') {

                setprbancatp(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }





    const [listbancos, setListBancos] = useState([]);

    async function uploadbancos() {

        try {

            const response = await api.get('/banco');

            if (response.status == '200') {

                setListBancos(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }



    const [listmeiopagamentos, setListMeioPagamento] = useState([]);
    var meiopagamentos
    async function uploadmeiospagamento() {

        try {

            const response = await api.get('/meiospagamento');

            if (response.status == '200') {
                meiopagamentos = response.data
                setListMeioPagamento(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    //-------------------------------------------






    //-------------- Ver -------------------------


    const [selectItemPagamento, setSelectItemPagamento] = useState([]);

    const openVerHandler = (idx) => {

        setSelectItemPagamento(idx.pagamento)

        if (idx.pagamento.length > 0) {
            idx.pagamento[0].DT_EMISSAO_DUC = createDate2(idx.pagamento[0].DT_EMISSAO_DUC)

            const defaultMeioPagamento = getMeioPagamenot(idx)
            setDefaultMeioPagamento(defaultMeioPagamento)

        }
        setitemSelected(idx)

        setVerOpen(true);
        setIsEditarOpen(false);
        setIsEditarRecebimentoOpen(false);

        setIsOpen(false);
    };



    //-----------------------------------------------'





    //-------------- EDITAR -------------------------


    const openEditHandler = (idx) => {
        if (!Number(idx.VALOR)) {
            idx.VALOR = parseCurrency(idx.VALOR)
        }
        setIsEditarRecebimentoOpen(false);
        setIsOpen(false);
        setVerOpen(false);
        // idx.DT_EMISSAO_DUC = createDate2(idx.DT_EMISSAO_DUC)
        setANO(idx.ANO)
        setBRUTO(idx.VALOR)
        setDUC(idx.DUC)
        setMES(idx.MES)
        setitemSelected(idx)
        console.log(idx)
        setENTIDADE_ID(idx.ENTIDADE_ID)
        setIsEditarOpen(true);

        //setESTADO_C(idx.ID)
    };





    async function editarItemGO(event) {
        event.preventDefault();
        setIsLoading(true)
        const upload = {
            // DT_EMISSAO_DUC: dataemissao,
            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,
            ANO: parseInt(ANO),
            MES: MES,
            VALOR: BRUTO,
            // DUC: DUC,
        }

        console.log(upload)
        if (ANO.toString().length !== 4) {
            popUp_alertaOK("Campo Ano deve ter 4 caractéres")
            setIsLoading(false)
            return
        }

        try {

            const response = await api.put('/contribuicoes/' + itemSelected.ID, upload);

            if (response.status == '200') {
                uploadmeiospagamento()
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

    // --------------- RECEBIMENTO --------------------

    //// CRIAR
    const openCriarRecebimento = (idx) => {

        if (!Number(idx.VALOR)) {
            idx.VALOR = parseCurrency(idx.VALOR)
        } setContribuicoesId(idx.ID)
        setIsOpen(false)
        setIsEditarOpen(false)
        setIsRecebimentoOpen(true);
        setitemSelected(idx)

        //setESTADO_C(idx.ID)
    };


    async function criarRecibimentoGO(event) {

        event.preventDefault();
        if (docFile === null) {
            return popUp_alertaOK("Selecione um comprovativo");

        }

        setIsLoading(true)
        var anexofile = "";
        const img = await onFormSubmitImage(docFile);
        anexofile = img.file.data;

        const upload = {
            DUC: DUC,
            DT_EMISSAO_DUC: dataemissao,
            VALOR: itemSelected.VALOR,
            NUM_DOC: cheque,
            DT_CONFIRMACAO: dataconfirmacao,
            contribuicoes_ID: contribuicoesId,
            banco_iD: banco,
            meio_pagamento_ID: meiopagamento,
            documentos: {
                PR_DOCUMENTO_TP_ID: "f426156ba83c4b91c8f1c0de7025f582f16a",
                DOC_URL: anexofile
            }
        }

        console.log(upload)

        try {

            const response = await api.post('/payment/contribuicoes', upload);

            if (response.status == '200') {

                uploadlist()
                uploadmeiospagamento()
                setIsLoading(false)

                setIsRecebimentoOpen(false)

            }

        } catch (err) {
            setIsLoading(false)

            console.error(err.response)

        }

    }


    //// EDITAR






    //-------------- CRIAR -------------------------


    const openHandler = () => {
        setIsOpen(true);
        setIsEditarOpen(false);
        setVerOpen(false);
        setIsRecebimentoOpen(false);
        setID_C("")
        setDESIG_C("")
        setOBS_C("")
        setESTADO_C("")
    };





    async function criarItemGO(event) {
        event.preventDefault();
        setIsLoading(true)

        const upload = {
            // DT_EMISSAO_DUC: dataemissao,
            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,
            ANO: ANO,
            MES: MES,
            VALOR: BRUTO,
            // DUC: DUC,
        }

        if (ANO.toString().length !== 4) {
            popUp_alertaOK("Campo Ano deve ter 4 caractéres")
            setIsLoading(false)
            return
        }

        console.log(upload)


        try {

            const response = await api.post('/contribuicoes', upload);

            if (response.status === 200) {
                if (response.data.status === "fail") {
                    popUp_alertaOK(response.data.message);


                    setIsLoading(false)
                    return
                }
                uploadlist()
                uploadmeiospagamento()
                setIsLoading(false)

                setIsOpen(false)

            }

        } catch (err) {

            setIsLoading(false)

            console.error(err.response)

        }

    }


    //----------------------------------------------





    const handleAno = (event) => {
        const value = event.target.value;
        var valid = ((value != '') && /^\d*\.?\d*$/.test(value));
        if (valid) {
            setANO(value)
        }

    };



    //-------------- Remover -------------------------



    const removeItemFunction = async (idx) => {

        let res = true

        try {

            const response = await api.delete('/contribuicoes/' + idx);


        } catch (err) {

            res = false
            console.error(err.response)
            popUp_alertaOK("Falha. Tente mais tarde")

        }

        uploadlist()
        uploadmeiospagamento()
        return res

    };

    const removeItem = async (idx) => {

        popUp_removerItem({
            delete: removeItemFunction,
            id: idx,
        })


    }

    function createDate2(data) {
        if (data == null) return "";

        return new Date(data).toISOString().slice(0, 10);
    }

    function verifyIfIsCheckAndSetPaymentMethod(e) {
        let obj = JSON.parse(e.target.value);
        setMeioPagamento(obj.ID)
        if (obj.TEM_NUMERO === 1) {
            setIsCheck(true)
        } else {
            setIsCheck(false)
        }
    }
    //-----------------------------------------------




    useEffect(() => {

        if (pageEnable(pageAcess, permissoes) == false) history.push('/')

        else {

            uploadlist()
            uploadbancos()
            uploadmeiospagamento()

        }

    }, [])





    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isRecebimentoOpen, setIsRecebimentoOpen] = useState(false);
    const [isEditarRecebimentoOpen, setIsEditarRecebimentoOpen] = useState(false);







    return (<>

        {/* <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <div className="page-header-title">
                            <h5 className="m-b-10">Bancas</h5>
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
                                <Link to='#'>Bancas</Link>
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
                            <Table columns={columns} data={newdata} modalOpen={openHandler} years={years} uploadList={uploadlist} uploadmeiospagamento={uploadmeiospagamento} />
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

                                    {/* <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Entidade <span style={{ color: "red" }} >*</span></label>

                                            <input disabled type="text" className="form-control" id="Name" value={

                                                entidadelist.map(e => (
                                                    e.ID == id_params ? e.DESIG : null
                                                )).join('')

                                            } required />

                                        </div>
                                    </Col> */}

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>
                                            <input
                                                type="number"
                                                className='form-control '
                                                placeholder='Ano...'
                                                onChange={event => { setANO(event.target.value) }} />

                                            {/* <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setANO(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {years.map(e => (

                                                        <option key={e} value={e}>{e}</option>

                                                    ))}

                                                </select>
                                            </span> */}

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Mês <span style={{ color: "red" }} >*</span></label>


                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setMES(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {month.map(e => (

                                                        <option key={e} value={e}>{e}</option>

                                                    ))}

                                                </select>
                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Montante  <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setBRUTO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Montante..." required />

                                        </div>
                                    </Col>


                                    {/* <Col sm={6}>


                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">
                                                Data Emissão DUC <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                type="date"
                                                onChange={(event) => {
                                                    setDataConfirmacao(event.target.value);
                                                }}
                                                defaultValue={dataconfirmacao} className="form-control"
                                                placeholder="Data..."
                                                required
                                            />
                                        </div>

                                    </Col> */}

                                    {/* <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Status <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setPR_STATUS_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">Selecione</option>

                                                    {prstatus.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/status", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => openstatus()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }
                                            </span>

                                        </div>
                                    </Col> */}






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
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value="*" required />
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>
                                            <input
                                                className='form-control '
                                                placeholder='Ano...'
                                                defaultValue={itemSelected.ANO}
                                                onChange={event => { setANO(event.target.value) }}
                                                type="number"
                                            />
                                            {/* <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={itemSelected.ANO} onChange={event => { setANO(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {years.map(e => (

                                                        <option key={e} value={e}>{e}</option>

                                                    ))}

                                                </select>
                                            </span> */}

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Mês <span style={{ color: "red" }} >*</span></label>


                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={itemSelected.MES} onChange={event => { setMES(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {month.map(e => (

                                                        <option key={e} value={e}>{e}</option>

                                                    ))}

                                                </select>
                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Montante  <span style={{ color: "red" }} >*</span></label>

                                            <input defaultValue={itemSelected.VALOR} type="number" onChange={event => { setBRUTO(event.target.value) }} className="form-control" placeholder="Montante..." required />

                                        </div>
                                    </Col>


                                    {/* <Col sm={6}>


                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">
                                                Data Emissao De DUC  <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                onChange={(event) => {
                                                    setDataEmissao(event.target.value);
                                                }}
                                                defaultValue={itemSelected.DT_EMISSAO_DUC}
                                                type="date"
                                                className="form-control"
                                                placeholder="Data..."
                                                required
                                            />
                                        </div>

                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Número do DUC<span style={{ color: "red" }} >*</span></label>

                                            <input defaultValue={itemSelected.DUC} type="number" onChange={event => { setDUC(event.target.value) }} className="form-control" placeholder="Número do DUC ..." required />

                                        </div>
                                    </Col> */}

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
                            <Modal.Title as="h5">Detalhes</Modal.Title>
                        </Modal.Header>
                        <ul
                            className="nav nav-tabs profile-tabs nav-fill"
                            id="myTab"
                            role="tablist"
                        >
                            <li className="nav-item">
                                <Link
                                    to="#"
                                    className={
                                        activeProfileTab === "mensalidade"
                                            ? profileTabActiveClass
                                            : profileTabClass
                                    }
                                    onClick={() => {
                                        setActiveProfileTab("mensalidade");
                                    }}
                                    id="profile-tab"
                                >
                                    <i className="feather icon-server mr-2" />
                                    Mensalidade
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    to="#"
                                    className={
                                        activeProfileTab === "recebimento"
                                            ? profileTabActiveClass
                                            : profileTabClass
                                    }
                                    onClick={() => {
                                        setActiveProfileTab("recebimento");
                                    }}
                                    id="contact-tab"
                                >
                                    <i className="feather icon-file-text mr-2" />
                                    Pagamento
                                </Link>
                            </li>
                        </ul>
                        <Modal.Body className="newuserbox" style={activeProfileTab === "mensalidade" ? {} : { display: "none" }} >

                            <form id="editarItem"  >


                                <Row>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input readOnly="readOnly" defaultValue={itemSelected.CODIGO} disabled type="text" className="form-control" id="Name" value="*" required />
                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>
                                            <input
                                                readOnly="readOnly"
                                                defaultValue={itemSelected.ANO}
                                                type="number"
                                                className='form-control '
                                                placeholder='Ano...'
                                                onChange={event => { setANO(event.target.value) }} />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Mês
                                                <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select disabled defaultValue={itemSelected.MES} onChange={event => { setMES(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {month.map(e => (

                                                        <option key={e} value={e}>{e}</option>

                                                    ))}

                                                </select>
                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Valor  <span style={{ color: "red" }} >*</span></label>
                                            <input readOnly="readOnly" type="text" onChange={event => { setBRUTO(event.target.value) }} defaultValue={itemSelected.VALOR} className="form-control" placeholder="Valor..." required />

                                        </div>
                                    </Col>


                                </Row>

                            </form>

                        </Modal.Body>
                        {itemSelected.pagamento && itemSelected.pagamento.length > 0 ?
                            <Modal.Body className="newuserbox" style={activeProfileTab === "recebimento" ? {} : { display: "none" }} >
                                <form id="criarItem"  >

                                    <Row>
                                        <Col sm={6}>


                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">
                                                    Data Tesouro <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    readOnly="readOnly"
                                                    defaultValue={itemSelected.pagamento[0].DT_CONFIRMACAO}
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="Data..."
                                                    required
                                                />
                                            </div>

                                        </Col>

                                        <Col md={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Montante  <span style={{ color: "red" }} >*</span></label>

                                                <input
                                                    type="text"
                                                    readOnly="readOnly"
                                                    defaultValue={itemSelected.pagamento[0].VALOR}
                                                    onChange={(event) => {
                                                        setMontanteRecebido(event.target.value);
                                                    }}
                                                    className="form-control"
                                                    placeholder="Montante ..."
                                                    required
                                                />

                                            </div>
                                        </Col>

                                        <Col sm={12}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Banco <span style={{ color: "red" }} >*</span></label>

                                                <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                    <select disabled defaultValue={itemSelected.pagamento[0].banco_iD}
                                                        className="form-control" id="perfil" required aria-required="true">

                                                        <option hidden value="">-- Selecione --</option>

                                                        {listbancos.map(e => (

                                                            <option key={e.ID} value={e.ID}>{e.NOME}</option>

                                                        ))}

                                                    </select>
                                                </span>

                                            </div>
                                        </Col>
                                        <Col sm={12}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Meio Pagamento
                                                    <span style={{ color: "red" }} >*</span></label>

                                                <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                    <select disabled defaultValue={JSON.stringify(defaultMeioPagamento)} className="form-control" id="perfil" required aria-required="true">

                                                        <option hidden value="">-- Selecione --</option>

                                                        {listmeiopagamentos.map(e => (

                                                            <option key={e.ID} value={JSON.stringify(e)}>{e.NOME}</option>

                                                        ))}
                                                    </select>
                                                </span>
                                            </div>
                                        </Col>
                                        <Col sm={6}>


                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">
                                                    Data Emissao De DUC  <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    disabled
                                                    defaultValue={itemSelected.pagamento[0].DT_EMISSAO_DUC}
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="Data..."
                                                    required
                                                />
                                            </div>

                                        </Col>

                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Número do DUC  <span style={{ color: "red" }} >*</span></label>

                                                <input readOnly="readOnly" defaultValue={itemSelected.pagamento[0].DUC} type="number" onChange={event => { setDUC(event.target.value) }} className="form-control" placeholder="Número do DUC ..." required />

                                            </div>
                                        </Col>
                                        <Col sm={12}>
                                            <div className="form-group fill">
                                                {itemSelected.pagamento[0].sgigjreldocumento.length > 0 ? (
                                                    <a href={`${itemSelected.pagamento[0].sgigjreldocumento[0].DOC_URL}?alt=media&token=0`} target="_blank">
                                                        <Button variant="primary">Abrir documento</Button>
                                                    </a>
                                                ) : null
                                                }
                                            </div>
                                        </Col>
                                        {isCheck ?
                                            <>
                                                <Col sm={12}>
                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="Name">N° Cheque <span style={{ color: "red" }} >*</span></label>

                                                        <input readOnly="readOnly" type="text" defaultValue={itemSelected.pagamento[0].NUM_DOC} className="form-control" placeholder="N° Cheque ..." />

                                                    </div>
                                                </Col>
                                            </>
                                            : null}
                                    </Row>

                                </form>
                            </Modal.Body>
                            : null}
                        <Modal.Footer className="d-flex justify-content-between">
                            <span>Registado por: {itemSelected?.criadoPor?.sgigjrelpessoaentidade?.sgigjpessoa?.NOME}</span>
                            <Button variant="danger" onClick={() => setVerOpen(false)}>Fechar</Button>

                        </Modal.Footer>



                    </Modal>


                    {/* --------------------Criar Item Recebimento------------------- */}

                    <Modal size='x' show={isRecebimentoOpen} onHide={() => setIsRecebimentoOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarItem" onSubmit={criarRecibimentoGO} >

                                <Row>
                                    <Col md={6}>


                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">
                                                DT Confirmação do Tesouro <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                type="date"
                                                max={todayDate}

                                                onChange={(event) => {
                                                    setDataConfirmacao(event.target.value);
                                                }}
                                                defaultValue={dataconfirmacao} className="form-control"
                                                placeholder="Data..."
                                                required
                                            />
                                        </div>

                                    </Col>

                                    <Col md={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Montante  <span style={{ color: "red" }} >*</span></label>

                                            <input
                                                type="number"
                                                onChange={(event) => {
                                                    setMontanteRecebido(event.target.value);
                                                }}

                                                defaultValue={itemSelected.VALOR} className="form-control"
                                                placeholder="Montante ..."
                                                required
                                            />

                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Banco <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setBanco(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {listbancos.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.NOME}</option>

                                                    ))}

                                                </select>
                                            </span>

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Meio Pagamento
                                                <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { verifyIfIsCheckAndSetPaymentMethod(event) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {listmeiopagamentos.map(e => (

                                                        <option key={e.ID} value={JSON.stringify(e)}>{e.NOME}</option>

                                                    ))}

                                                </select>
                                            </span>

                                        </div>
                                    </Col>
                                    <Col sm={6}>


                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">
                                                Data Emissao De DUC  <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                onChange={(event) => {
                                                    setDataEmissao(event.target.value);
                                                }}
                                                defaultValue={""}
                                                type="date"
                                                className="form-control"
                                                placeholder="Data..."
                                                required
                                            />
                                        </div>

                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Número do DUC    <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setDUC(event.target.value) }} defaultValue={""} className="form-control" placeholder="Número do DUC ..." required />

                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="form-group fill">

                                            <label
                                                htmlFor={"anexareditar"}
                                                className="btn"
                                                style={{ backgroundColor: "#d2b32a", color: "#fff" }}
                                            >
                                                {docFile == null ? (
                                                    <>
                                                        <i className="feather icon-download" />
                                                        <>{" Anexar"}</>
                                                    </>
                                                ) : (
                                                    "Anexado"
                                                )}{" "}
                                            </label>
                                            <input
                                                id={"anexareditar"}
                                                style={{ display: "none" }}
                                                onChange={(event) =>
                                                    setDocFile(event.target.files[0])
                                                }
                                                accept="image/*,.pdf" type="file"
                                            />
                                            {/* {docFile != null ? <Button accept="image/*,.pdf" type='file' onChange={event => { handleFile(event.target.value) }} variant="primary">Anexar</Button> : <Button variant="primary">Anexado</Button>} */}

                                        </div>
                                    </Col>
                                    {isCheck ?
                                        <>
                                            <Col sm={12}>
                                                <div className="form-group fill">
                                                    <label className="floating-label" htmlFor="Name">N° Cheque <span style={{ color: "red" }} >*</span></label>

                                                    <input type="text" onChange={event => { setCheque(event.target.value) }} defaultValue={""} className="form-control" placeholder="N° Cheque ..." />

                                                </div>
                                            </Col>
                                        </>
                                        : null}
                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsRecebimentoOpen(false)}>Fechar</Button>

                            {!isLoading ? <Button type="submit" form="criarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

                        </Modal.Footer>
                    </Modal>







                </Col>
            </Row >
        </React.Fragment >
    </>
    );












};
export default Contribuicoes;