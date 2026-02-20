import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, ListGroup } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';

import { GlobalFilter } from './../GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";


import { saveAs } from 'file-saver';

import api from '../../../../services/api';

import useAuth from '../../../../hooks/useAuth';

import toast from 'react-hot-toast';

import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle, formatCurrency, sumValues, setParams, onFormSubmitImage, makedate } from '../../../../functions';


const pageAcess = "/entidades/entidades/detalhes"

function Table({ columns, data, modalOpen, modalOpenVer, openEditHandler, removeItem, openCriarPagamento, years, uploadList }) {
    var total_PremioInicial
    var total_Subsequente
    const [ANO, setANO] = useState("")
    const { id } = useParams();
    const [values, setValues] = useState()
    const listBruto = data.map(res => res.VALOR)
    const listSubsequente = data.map(res => res.subsequente.map(sub => sub.VALOR))
    total_PremioInicial = sumValues(listBruto)
    // total_Subsequente = sumValues(listSubsequente)

    const { permissoes } = useAuth();
    // const totalBRUTO = parseCurrency(totalBruto)
    function optionDownload(value) {
        if (value === "1") {
            exportPDFImposto();
        } else if (value === "2") {
            exportExel()
        }
    }
    async function exportPDFImposto() {
        const ano = ANO === "" ? undefined : ANO
        try {
            const response = await api.get(`/export-pdf/premios?ENTIDADE_ID=${id}` + setParams([["ANO", ano]]), { responseType: "blob" });
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
            const response = await api.get(`/export-csv/premios?ENTIDADE_ID=${id}` + setParams([["ANO", ano]]), { responseType: "blob" });
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
    function getTotalSubsequente(i) {
        let listOfSubSequente = data[i].subsequente.map(sub => sub.VALOR)
        let sum = sumValues(listOfSubSequente)
        return formatCurrency(sum)

    }
    const [timeoutId, setTimeoutId] = useState(null);

    function handleChangeAno(ano) {
        setANO(ano)

        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // Set a new timeout
        const newTimeoutId = setTimeout(() => {
            uploadList(ano)
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

                    <input
                        type="number"
                        className='form-control '
                        placeholder='Pesquise por ano'
                        onChange={event => { handleChangeAno(event.target.value) }} />


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
                    <tr>
                        <th>Estado</th>
                        <th>Ano</th>
                        <th className='text-right'>Premio Inicial</th>
                        <th>Data Registo</th>
                        <th></th>

                    </tr>
                </thead>
                <tbody >
                    {data.map((item, i) => (
                        <React.Fragment key={item.ID}>

                            <tr key={item.ID}>
                                <td>{item.DT_PAGAMENTO == null ?
                                    <>
                                        <div style={{ display: "flex", alignItems: "center" }} >
                                            <div style={{ backgroundColor: "red", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid red" }} />
                                        </div></>
                                    :

                                    <>
                                        <div style={{ display: "flex", alignItems: "center" }} >
                                            <div style={{ backgroundColor: "red", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid red" }} />

                                            <div style={{ backgroundColor: "green", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid green" }} />
                                        </div></>}</td>
                                <td className='text-center'>{item.ANO}</td>
                                <td className='text-right'>{formatCurrency(item.VALOR)}</td>
                                <td className='text-center'>{makedate(item.DT_REGISTO)}</td>
                                <td className='text-center'>
                                    <React.Fragment>
                                        {taskEnable(pageAcess, permissoes, "Ler") == false ? null :
                                            <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Ler")} onClick={() => modalOpenVer(item)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Ler")} /></Link>
                                        }

                                        {item.DT_PAGAMENTO !== null || taskEnable(pageAcess, permissoes, "Editar") == false ? null :
                                            <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Editar")} onClick={() => openEditHandler(item)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Editar")} /></Link>
                                        }
                                        {item.DT_PAGAMENTO === null && taskEnable(pageAcess, permissoes, "ConfirmacaoPagamento") == true ? <Link to='#' title="Confirmação Pagamento" onClick={() => openCriarPagamento(item)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "ConfirmacaoPagamento")} /></Link>
                                            : <Link to='#' title={"Pagamento Efectuado"} className="text-success mx-1"><i className={"text-success feather icon-box "} /></Link>
                                        }

                                        {taskEnable(pageAcess, permissoes, "Eliminar") == false ? null :
                                            <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Eliminar")} onClick={() => removeItem(item)} className="text-danger"><i className={"" + taskEnableIcon(pageAcess, permissoes, "Eliminar")} /></Link>
                                        }
                                    </React.Fragment>
                                </td>

                            </tr>
                            {/* <tr>
                                <td className='font-weight-bold'>Total Premio Subsequente</td>
                                <td className='font-weight-bold text-right'>{getTotalSubsequente(i)}</td>
                                <td></td>
                                <td></td>
                                <td></td>

                            </tr> */}
                            <tr>
                                <td colSpan="4">
                                    <BTable striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Estado</th>

                                                <th>Ano</th>
                                                <th className='text-right'>Premio Subsequente</th>
                                                <th>Data Registo</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.subsequente.map((nestedItem) => (
                                                <>
                                                    <tr key={nestedItem.ID}>
                                                        <td>{nestedItem.DT_PAGAMENTO == null ?
                                                            <>
                                                                <div style={{ display: "flex", alignItems: "center" }} >
                                                                    <div style={{ backgroundColor: "red", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid red" }} />
                                                                </div></>
                                                            :

                                                            <>
                                                                <div style={{ display: "flex", alignItems: "center" }} >
                                                                    <div style={{ backgroundColor: "red", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid red" }} />

                                                                    <div style={{ backgroundColor: "green", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid green" }} />
                                                                </div></>}</td>
                                                        <td className='text-center'>{nestedItem.ANO}</td>
                                                        <td className='text-right'>{formatCurrency(nestedItem.VALOR)}</td>
                                                        <td className='text-center'>{makedate(nestedItem.DT_REGISTO)}</td>
                                                        <td className='text-center'>
                                                            <React.Fragment>

                                                                {nestedItem.DT_PAGAMENTO === null && taskEnable(pageAcess, permissoes, "ConfirmacaoPagamento") == true ? <Link to='#' title="Confirmação Pagamento" onClick={() => openCriarPagamento(nestedItem)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "ConfirmacaoPagamento")} /></Link>
                                                                    : <Link to='#' title={"Pagamento Efectuado"} className="text-success mx-1"><i className={"text-success feather icon-box "} /></Link>
                                                                }


                                                            </React.Fragment>
                                                        </td>
                                                    </tr>
                                                </>

                                            ))}
                                            <tr>
                                                <td className='font-weight-bold'>Total Premio Subsequente</td>
                                                <td className='font-weight-bold text-right'>{getTotalSubsequente(i)}</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>

                                            </tr>
                                        </tbody>
                                    </BTable>
                                </td>
                            </tr>

                        </React.Fragment>
                    ))}
                    {/* <tr>
                        <td className="merged-cell font-weight-bold" colspan="1">Total Premio Inicial</td>
                        <td className='font-weight-bold text-right'>{formatCurrency(total_PremioInicial)}</td>
                        <td className='font-weight-bold'></td>
                        <td className='font-weight-bold'></td>

                    </tr> */}
                </tbody >
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
    )
}



const Premios = () => {

    const { id } = useParams();

    const [id_params, setid_params] = useState("0");

    const { popUp_removerItem, popUp_alertaOK } = useAuth();

    var todayDate = new Date().toJSON().slice(0, 10);

    const { permissoes } = useAuth();

    const history = useHistory();


    const columns = React.useMemo(
        () => [
            {
                Header: 'Estado',
                accessor: 'COLOR_STATUS',
            },
            {
                Header: 'Ano',
                accessor: 'ANO',
            },
            {
                Header: 'Premio Inicial',
                accessor: 'VALOR',
            },
            {
                Header: 'Data',
                accessor: 'DT_REGISTO',
            },

            {
                Header: 'Ações',
                accessor: 'action',
            },
        ],
        []
    );





    const [ANO, setANO] = useState(0);
    const [MES, setMES] = useState("");
    const [BRUTO, setBRUTO] = useState(0);
    const [VALOR, setVALOR] = useState(0);
    const [SUBSEQUENTE, setSUBSEQUENTE] = useState(0);
    const [PRIMEIRO_ANO, setPRIMEIRO_ANO] = useState(0);
    const [VEZES, setVEZES] = useState(0);
    const [PREMIO_ID, setPREMIO_ID] = useState("");

    const [Art_48, setArt_48] = useState(0);
    const [DUC, setDUC] = useState(0);
    const [DT_EMISSAO_DUC, setDT_EMISSAO_DUC] = useState(0);

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

    const [impostoId, setImpostoId] = useState("");
    const [montanteRecebido, setMontanteRecebido] = useState(0);

    const [isCheck, setIsCheck] = useState(false);
    const [defaultMeioPagamento, setDefaultMeioPagamento] = useState();

    const [itemSelected, setitemSelected] = useState({
    });
    const [activeProfileTab, setActiveProfileTab] = useState("Premios");
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

            const response = await api.get('/premios?ENTIDADE_ID=' + id + setParams([["ANO", ano]]));

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {
                    const idx = response.data[i].ID

                    const itemx = response.data[i]


                }

                setnewdata(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }



    function getMeioPagamenot(id) {


        console.log(listmeiopagamentos)
        console.log(meiopagamentos)

        let meiopagamento = listmeiopagamentos.find(res => res.ID == id)

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
    var meiopagamentos = []
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

        if (idx.DT_PAGAMENTO != "") {

            const defaultMeioPagamento = getMeioPagamenot(idx.meio_pagamento_ID)
            setDefaultMeioPagamento(defaultMeioPagamento)

        }
        setVALOR(idx.VALOR)
        setANO(idx.ANO)
        setVEZES(idx.N_VEZES)
        setSUBSEQUENTE(idx.SUBSEQUENTE)
        setPRIMEIRO_ANO(idx.PRIMEIRO_ANO)
        setVerOpen(true);
        setIsEditarOpen(false);
        setitemSelected(idx)

        setIsEditarRecebimentoOpen(false);
        console.log(itemSelected)
        setIsOpen(false);
    };



    //-----------------------------------------------'





    //-------------- EDITAR -------------------------


    const openEditHandler = (idx) => {

        setIsEditarRecebimentoOpen(false);
        setIsOpen(false);
        setVerOpen(false);
        setVALOR(idx.VALOR)
        setANO(idx.ANO)
        setVEZES(idx.N_VEZES)
        setSUBSEQUENTE(idx.SUBSEQUENTE)
        setPRIMEIRO_ANO(idx.PRIMEIRO_ANO)
        setitemSelected(idx)
        setENTIDADE_ID(idx.ENTIDADE_ID)
        setIsEditarOpen(true);

        //setESTADO_C(idx.ID)
    };





    async function editarItemGO(event) {
        event.preventDefault();
        setIsLoading(true)
        // if (parseInt(SUBSEQUENTE) > parseInt(VALOR)) {
        //     popUp_alertaOK("Prêmio inicial deve ser superior a valor subsequente");
        //     setIsLoading(false)
        //     return
        // }
        const upload = {
            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,
            ANO: parseInt(ANO),
            VALOR: parseInt(VALOR),
            SUBSEQUENTE: parseInt(SUBSEQUENTE),
            N_VEZES: parseInt(VEZES),
            PRIMEIRO_ANO: parseInt(PRIMEIRO_ANO)
        }


        try {

            const response = await api.put('/premios/' + itemSelected.ID, upload);

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

    // --------------- RECEBIMENTO --------------------

    //// CRIAR
    const openCriarPagamento = async (item) => {

        setIsRecebimentoOpen(true);
        // setitemSelected(item)
        setPREMIO_ID(item.ID)
        // try {
        //     const response = await api.get('/payment/premios/' + item.ID);
        //     if (response.status == '200') {
        //         toast.success('Pagamento efetuado com sucesso!', { duration: 4000 })
        //         uploadlist()
        //     }
        // } catch (err) {
        //     setIsLoading(false)
        //     console.error(err.response)
        // }
    };


    //// CRIAR
    // const openCriarRecebimento = (idx) => {
    //     setContrapartida(idx.ID)
    //     setIsRecebimentoOpen(true);
    //     setitemSelected(idx)

    //     //setESTADO_C(idx.ID)
    // };


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
            DATA_EMISSAO_DUC: DT_EMISSAO_DUC,
            DT_PAGAMENTO: dataconfirmacao,
            NUM_DOC_PAGAMENTO: cheque,
            banco_iD: banco,
            meio_pagamento_ID: meiopagamento,
            documentos: {
                PR_DOCUMENTO_TP_ID: "f426156ba83c4b91c8f1c0de7025f582f16a",
                DOC_URL: anexofile
            }
        }

        console.log(upload)

        try {

            const response = await api.post('/payment/premios/' + PREMIO_ID, upload);
            if (response.status == '200') {
                toast.success('Pagamento efetuado com sucesso!', { duration: 4000 })

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
        // if (parseInt(SUBSEQUENTE) > parseInt(VALOR)) {
        //     popUp_alertaOK("Prêmio inicial deve ser superior a valor subsequente");

        //     setIsLoading(false)

        //     return
        // }
        const upload = {
            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,
            ANO: parseInt(ANO),
            VALOR: parseInt(VALOR),
            SUBSEQUENTE: parseInt(SUBSEQUENTE),
            N_VEZES: parseInt(VEZES),
            PRIMEIRO_ANO: parseInt(PRIMEIRO_ANO)
        }

        console.log(upload)

        try {

            const response = await api.post('/premios', upload);

            if (response.status === 200) {
                if (response.data.status === "fail") {
                    popUp_alertaOK(response.data.message);


                    setIsLoading(false)
                    return
                }
                uploadmeiospagamento()
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

    function handleFile(e) {
        setDocFile(e)
    }








    //-------------- Remover -------------------------



    const removeItemFunction = async (idx) => {

        let res = true

        try {

            const response = await api.delete('/premios/' + idx.ID);


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
                            <Table columns={columns} data={newdata} modalOpen={openHandler} modalOpenVer={openVerHandler} removeItem={removeItem} openEditHandler={openEditHandler} openCriarPagamento={openCriarPagamento} years={years} uploadList={uploadlist} />
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
                                    <Col sm={12} className=''>
                                        <div className="form-group fill">
                                            <span className="floating-label font-weight-bold" htmlFor="Name">Premio Inicial</span>
                                            <div className='yellow-bottom'></div>

                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value="*" required />
                                        </div>
                                    </Col>


                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>

                                            <input
                                                type="number" defaultValue={parseInt(itemSelected.ANO)}
                                                className='form-control '
                                                placeholder='Ano...'
                                                onChange={event => { setANO(event.target.value) }} />

                                        </div>
                                    </Col>
                                    <Col sm={8}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Premio Inicial <span style={{ color: "red" }} >*</span></label>
                                            <input type="number" className="form-control" id="Name" onChange={event => { setVALOR(event.target.value) }} placeholder="Premio Inicial..." required />
                                        </div>

                                    </Col>
                                    <Col sm={12} className=''>
                                        <div className="form-group fill">
                                            <span className="floating-label mt-3 font-weight-bold" htmlFor="Name">Premio Subsequente</span>
                                            <div className='yellow-bottom'></div>

                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Premio Subsequente <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setSUBSEQUENTE(event.target.value) }} className="form-control" placeholder="Premio Subsequente..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Nº de prestações anuais <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setVEZES(event.target.value) }} className="form-control" placeholder="Nº de prestações anuais..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setPRIMEIRO_ANO(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {years.map(e => (

                                                        <option key={e} value={e}>{e}</option>

                                                    ))}

                                                </select>
                                            </span>

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


                    <Modal size='x' show={isEditarOpen} onHide={() => setIsEditarOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Editar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >
                            <form id="editarItem" onSubmit={editarItemGO} >

                                <Row>
                                    <Col sm={12} className=''>
                                        <div className="form-group fill">
                                            <span className="floating-label font-weight-bold " htmlFor="Name">Premio Inicial</span>
                                            <div className='yellow-bottom'></div>

                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value="*" required />
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>
                                            <input
                                                type="number" defaultValue={parseInt(itemSelected.ANO)}
                                                className='form-control '
                                                placeholder='Ano...'
                                                onChange={event => { setANO(event.target.value) }} />


                                        </div>
                                    </Col>
                                    <Col sm={8}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Premio Inicial <span style={{ color: "red" }} >*</span></label>
                                            <input defaultValue={itemSelected.VALOR} type="number" className="form-control" id="Name" onChange={event => { setVALOR(event.target.value) }} placeholder="Premio Inicial..." required />
                                        </div>

                                    </Col>
                                    <Col sm={12} className=''>
                                        <div className="form-group fill">
                                            <span className="floating-label font-weight-bold mt-3" htmlFor="Name">Premio Subsequente</span>
                                            <div className='yellow-bottom'></div>

                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Premio Subsequente <span style={{ color: "red" }} >*</span></label>

                                            <input defaultValue={itemSelected.SUBSEQUENTE} type="number" onChange={event => { setSUBSEQUENTE(event.target.value) }} className="form-control" placeholder="Premio Subsequente..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Nº de prestações anuais <span style={{ color: "red" }} >*</span></label>

                                            <input defaultValue={VEZES} type="number" onChange={event => { setVEZES(event.target.value) }} className="form-control" placeholder="Nº de prestações anuais..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">1 Ano <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={itemSelected.PRIMEIRO_ANO} onChange={event => { setPRIMEIRO_ANO(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {years.map(e => (

                                                        <option key={e} value={e}>{e}</option>

                                                    ))}

                                                </select>
                                            </span>

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
                                        activeProfileTab === "Premios"
                                            ? profileTabActiveClass
                                            : profileTabClass
                                    }
                                    onClick={() => {
                                        setActiveProfileTab("Premios");
                                    }}
                                    id="profile-tab"
                                >
                                    <i className="feather icon-server mr-2" />
                                    Premios
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
                                    Recebimento
                                </Link>
                            </li>
                        </ul>
                        <Modal.Body className="newuserbox" style={activeProfileTab === "Premios" ? {} : { display: "none" }} >

                            <form id="editarItem"  >


                                <Row>
                                    <Col sm={12} className=''>
                                        <div className="form-group fill">
                                            <span className="floating-label font-weight-bold" htmlFor="Name">Premio Inicial</span>
                                            <div className='yellow-bottom'></div>

                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input readOnly defaultValue={itemSelected.CODIGO} type="text" className="form-control" id="Name" value="*" required />
                                        </div>
                                    </Col>


                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>

                                            <input
                                                readOnly
                                                type="number" defaultValue={parseInt(itemSelected.ANO)}
                                                className='form-control '
                                                placeholder='Ano...'
                                                onChange={event => { setANO(event.target.value) }} />

                                        </div>
                                    </Col>
                                    <Col sm={8}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Premio Inicial <span style={{ color: "red" }} >*</span></label>
                                            <input readOnly type="number" className="form-control" id="Name" defaultValue={itemSelected.VALOR} placeholder="Premio Inicial..." required />
                                        </div>

                                    </Col>
                                    <Col sm={12} className=''>
                                        <div className="form-group fill">
                                            <span className="floating-label mt-3 font-weight-bold" htmlFor="Name">Premio Subsequente</span>
                                            <div className='yellow-bottom'></div>
                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Premio Subsequente <span style={{ color: "red" }} >*</span></label>

                                            <input readOnly type="number" defaultValue={itemSelected.SUBSEQUENTE} className="form-control" placeholder="Premio Subsequente..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Nº de prestações anuais<span style={{ color: "red" }} >*</span></label>

                                            <input readOnly type="number" defaultValue={VEZES} className="form-control" placeholder="Nº de prestações anuais..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select disabled defaultValue={itemSelected.PRIMEIRO_ANO} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {years.map(e => (

                                                        <option key={e} value={e}>{e}</option>

                                                    ))}

                                                </select>
                                            </span>

                                        </div>
                                    </Col>

                                </Row>

                            </form>

                        </Modal.Body>
                        {itemSelected.DT_PAGAMENTO != "" ?
                            <Modal.Body className="newuserbox" style={activeProfileTab === "recebimento" ? {} : { display: "none" }} >
                                <form id="criarItem"  >

                                    <Row>
                                        <Col sm={12}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">
                                                    Data Confirmação do Tesouro <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    readOnly="readOnly"
                                                    defaultValue={createDate2(itemSelected.DT_PAGAMENTO)}
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="Data..."
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col sm={12}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Banco <span style={{ color: "red" }} >*</span></label>
                                                <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <select disabled defaultValue={itemSelected.banco_iD}
                                                        className="form-control" id="perfil" required aria-required="true">
                                                        <option hidden value="">-- Selecione --</option>
                                                        {listbancos.map(e => (
                                                            <option key={e.ID} value={e.ID}>{e.NOME}</option>
                                                        ))}
                                                    </select>
                                                </span>
                                            </div>
                                        </Col>

                                        {/* {
                                            itemSelected.pagamento[0] ? */}
                                        {/* <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Número do DUC    <span style={{ color: "red" }} >*</span></label>

                                                <input defaultValue={itemSelected.pagamento[0].DUC} type="text" className="form-control" placeholder="Número do DUC ..." required />

                                            </div>
                                        </Col>*/}  <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Número do DUC    <span style={{ color: "red" }} >*</span></label>
                                                <input readOnly="readOnly"
                                                    defaultValue={itemSelected.DUC} type="text" className="form-control" placeholder="Número do DUC ..." required />
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">
                                                    Data Emissão do DUC <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    max={todayDate}
                                                    defaultValue={createDate2(itemSelected.DT_EMISSAO_DUC)}
                                                    readOnly="readOnly"

                                                    className="form-control"
                                                    placeholder="Data..."
                                                />
                                            </div>

                                        </Col>
                                        {/* } */}

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
                                        <Col sm={12}>
                                            <div className="form-group fill">
                                                {itemSelected.sgigjreldocumento && itemSelected?.sgigjreldocumento?.length > 0 ? (
                                                    <a href={`${itemSelected.sgigjreldocumento[0].DOC_URL}?alt=media&token=0`} target="_blank">
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

                                                        <input readOnly="readOnly" type="text" defaultValue={itemSelected.NUM_DOC} className="form-control" placeholder="N° Cheque ..." />

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


                    <Modal size='x' show={isRecebimentoOpen} onHide={() => setIsRecebimentoOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarItem" onSubmit={criarRecibimentoGO} >

                                <Row>
                                    <Col sm={12}>


                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">
                                                Data Confirmação do Tesouro <span style={{ color: "red" }}>*</span>
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

                                    <Col sm={12}>
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
                                            <label className="floating-label" htmlFor="Name">Número do DUC    <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setDUC(event.target.value) }} defaultValue={""} className="form-control" placeholder="Número do DUC ..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">
                                                Data Emissão do DUC <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                                type="date"
                                                max={todayDate}
                                                onChange={(event) => {
                                                    setDT_EMISSAO_DUC(event.target.value);
                                                }}
                                                className="form-control"
                                                placeholder="Data..."
                                                required
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={12}>
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
                                                    handleFile(event.target.files[0])
                                                }
                                                accept="image/*,.pdf" type="file"
                                            />
                                            {/* {docFile != null ? <Button accept="image/*,.pdf" type='file' onChange={event => { handleFile(event.target.value) }} variant="primary">Anexar</Button> : <Button variant="primary">Anexado</Button>} */}

                                        </div>
                                    </Col>
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
export default Premios;