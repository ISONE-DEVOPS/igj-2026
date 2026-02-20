import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, ListGroup, Tabs, Tab } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';

import { GlobalFilter } from './../GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";

import Select from 'react-select';

import { saveAs } from 'file-saver';

import api from '../../../../services/api';

import useAuth from '../../../../hooks/useAuth';

import toast from 'react-hot-toast';

import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle, formatCurrency, parseCurrency, roundToTwoDecimalPlaces, sumValues, formatDate, onFormSubmitImage, setParams, makedate, } from '../../../../functions';
import Projetos from '../../../configuracao/projetos';


const pageAcess = "/entidade/orcamento"

function Table({ columns, data, modalOpen, listProjetos, listAno, uploadlist, years, uploadmeiospagamento }) {
    var total_Orc_Disponivel
    var total_Orc_Corrigido
    var total_Orc_Inicial
    var total_Pago
    var total_Pago_Percent
    var total_Saldo_Disponivel
    var total_Cabimentado
    var total_Cabimentado_Percent
    console.log(listProjetos)
    const [projetoId, setProjetoId] = useState("")
    const [ano, setAno] = useState("")

    const [values, setValues] = useState()
    if (data.length > 0) {
        console.log(data)

        let listTotalPago = data.map(res => res.PAGO)
        total_Pago = sumValues(listTotalPago)

        let listCabimentado = data.map(res => parseCurrency(res.CABIMENTADO_FORMATTED))
        total_Cabimentado = sumValues(listCabimentado)
        let listCabimentadoPercent = data.map(res => res.CABIMENTADO_PERCENT)
        total_Cabimentado_Percent = sumValues(listCabimentadoPercent)
        let listOrcamentoInicial = data.map(res => res.ORCAMENTO_INICIAL)
        total_Orc_Inicial = sumValues(listOrcamentoInicial)

        let listOrcamentoDisponivel = data.map(res => res.ORCAMENTO_DISPONIVEL)
        total_Orc_Disponivel = sumValues(listOrcamentoDisponivel)

        let listOrcamentoCorrigido = data.map(res => res.ORCAMENTO_CORRIGIDO)
        total_Orc_Corrigido = sumValues(listOrcamentoCorrigido)

        let listPagoPercent = data.map(res => res.PAGO_PERCENT)
        total_Pago_Percent = sumValues(listPagoPercent)

        let listSaldoDisponivel = data.map(res => res.SALDO_DISPONIVEL)
        total_Saldo_Disponivel = sumValues(listSaldoDisponivel)
    }

    const { permissoes, popUp_simcancelar } = useAuth();
    function optionDownload(value) {
        if (value === "1") {
            exportPDFImposto();
        } else if (value === "2") {
            exportExel()
        }
    }
    async function exportPDFImposto() {
        let projeto = projetoId === "" ? undefined : projetoId
        let params = []
        try {

            if(projeto){
                params.push(['PROJETO_ID', projeto])
            }
    
            if(ano){
                params.push(["ANO", ano])
            }

            const response = await api.get(`/export-pdf/orcamento?` + setParams(params), { responseType: "blob" });

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
    const [timeoutId, setTimeoutId] = useState(null);


    function handleChangeAno(ano) {
        setAno(ano)

        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // Set a new timeout
        const newTimeoutId = setTimeout(() => {
            uploadlist(projetoId, ano)
            uploadmeiospagamento()
        }, 1500);

        // Save the new timeout ID
        setTimeoutId(newTimeoutId);


    }
    function handleChange(idProjeto) {
        setProjetoId(idProjeto)
        uploadlist(idProjeto, ano)
    }
    async function exportExel() {
        let projeto = projetoId === "" ? undefined : projetoId
        let params = []

        if(projeto){
            params.push(['PROJETO_ID', projeto])
        }

        if(ano){
            params.push(["ANO", ano])
        }
        try {
            const response = await api.get(`/export-csv/orcamento?` + setParams(params), { responseType: "blob" });
            if (response.status == '200') {
                const file = new Blob([response.data], { type: "api/csv" });
                //Build a URL from the file
                const blob = new Blob([response.data], { type: 'text/csv' });
                saveAs(blob, 'data.csv');
            }
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
                <Col md={2} className="d-flex align-items-center">


                    <select onChange={event => { handleChangeAno(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                        <option value=""> Selecione um Ano </option>

                        {listAno.map(e => (
                            // console.log("casas",e)
                            <option key={e} value={e}>{e}</option>

                        ))}

                    </select>
                </Col>
                <Col md={2}>

                    <select onChange={event => { handleChange(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                        <option value=""> Selecione um Projeto </option>

                        {listProjetos.map(e => (

                            <option key={e.value} value={e.value}>{e.label}</option>

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
            </Row >
            <BTable striped bordered hover responsive {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th    {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                        <td className="merged-cell text-left font-weight-bold" colSpan="2">Total</td>
                        <td className='font-weight-bold text-right'>{formatCurrency(total_Orc_Inicial)}</td>
                        <td className='font-weight-bold text-right'>{formatCurrency(total_Orc_Corrigido)}</td>
                        <td className='font-weight-bold text-right'>{formatCurrency(total_Orc_Disponivel)}</td>
                        <td className='font-weight-bold text-right text-right'>{formatCurrency(total_Cabimentado)}</td>
                        <td className='font-weight-bold text-right text-right'></td>

                        <td className='font-weight-bold text-right text-right'>{formatCurrency(total_Pago)}</td>
                        <td className='font-weight-bold text-right text-right'></td>

                        <td className='font-weight-bold text-right'>{formatCurrency(total_Saldo_Disponivel)}</td>
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



const Orcamento = () => {

    const { id } = useParams();

    const [id_params, setid_params] = useState("0");

    const { popUp_removerItem, popUp_alertaOK, popUp_simcancelar } = useAuth();
    const [tabDescription, setTabDescription] = useState("dados");
    const [tabDescriptionChildren, setTabDescriptionChildren] = useState("");


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
                Header: 'Rúbrica',
                accessor: 'rubrica.DESIGNACAO',
                centered: true
            },
            // {
            //     Header: 'Ano',
            //     accessor: 'ANO',
            //     centered: true
            // },
            {
                Header: 'Orç. Inicial',
                accessor: 'ORCAMENTO_INICIAL_FORMATTED',
                centered: false
            },
            {
                Header: 'Orç. Corrigido',
                accessor: 'ORCAMENTO_CORRIGIDO_FORMATTED',
                centered: false
            },
            {
                Header: 'Orç. Disponível',
                accessor: 'ORCAMENTO_DISPONIVEL_FORMATTED',
                centered: false
            },
            {
                Header: 'Cabimentado',
                accessor: 'CABIMENTADO_FORMATTED',
                centered: false
            },
            {
                Header: ' % Cabimentado',
                accessor: 'CABIMENTADO_PERCENT',
                centered: false
            },
            {
                Header: 'Pago',
                accessor: 'PAGO_FORMATTED',
                centered: false
            },
            {
                Header: ' % Pago',
                accessor: 'PAGO_PERCENT',
                centered: false
            },
            {
                Header: ' Saldo Disponivel',
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

    const [ANO, setANO] = useState(0);
    const [VALOR, setVALOR] = useState(0);
    const [ORCAMENTO_INICIAL, setORCAMENTO_INICIAL] = useState(0);
    const [ORCAMENTO_CORRIGIDO, setORCAMENTO_CORRIGIDO] = useState(0);
    const [ORCAMENTO_DISPONIVEL, setORCAMENTO_DISPONIVEL] = useState(0);
    const [COMENTARIO, setCOMENTARIO] = useState("");
    const [PROJETO_ID, setPROJETO_ID] = useState("");
    const [RUBRICA_ID, setRUBRICA_ID] = useState("");
    const [CABIMENTACAO_ID, setCABIMENTACAO_ID] = useState("");
    const [RUBRICA_DESCRICAO, setRUBRICA_DESCRICAO] = useState("");

    const [CABIMENTADO, setCABIMENTADO] = useState(0);
    const [CABIMENTADO_PERCENT, setCABIMENTADO_PERCENT] = useState("");

    const [selectedFiles, setSelectedFiles] = useState([]);

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

    const [VALOR_DESPESA, setVALOR_DESPESA] = useState(0);
    const [banco, setBanco] = useState("");

    const [meiopagamento, setMeioPagamento] = useState("");
    const [cheque, setCheque] = useState("");
    const [dataconfirmacao, setDataConfirmacao] = useState("");
    const [dataemissao, setDataEmissao] = useState("");

    const [orcamentoId, setOrcamentoId] = useState("");
    const [rubricasId, setRubricasId] = useState("");

    const [montanteRecebido, setMontanteRecebido] = useState(0);

    const [isCheck, setIsCheck] = useState(false);
    const [isMax, setIsMax] = useState(false);

    const [defaultMeioPagamento, setDefaultMeioPagamento] = useState();
    const [docFile, setDocFile] = useState(null);

    const [itemSelected, setitemSelected] = useState({
    });
    const [activeProfileTab, setActiveProfileTab] = useState("dados");
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




    async function uploadlist(projetoId, ano) {
        projetoId = projetoId === "" ? undefined : projetoId
        ano = ano === "" ? undefined : ano
        let listTotalCabimentado = []
        let total_Cabimentado = 0
        let anos = [] 
        setid_params(id)
        try {
            const response = await api.get('/orcamento?' + setParams([['PROJETO_ID', projetoId], ["ANO", ano]]));
            if (response.status === 200) {
                if (response.data.length === 0) {
                    return setnewdata(response.data)
                }

                for (var i = 0; i < response.data.length; i++) {
                    var listOfRubricas = []
                    const item = response.data[i];
                    response.data[i].SALDO_DISPONIVEL_FORMATTED = formatCurrency(response.data[i].SALDO_DISPONIVEL)
                    response.data[i].ORCAMENTO_INICIAL_FORMATTED = formatCurrency(response.data[i].ORCAMENTO_INICIAL)
                    response.data[i].ORCAMENTO_CORRIGIDO_FORMATTED = formatCurrency(response.data[i].ORCAMENTO_CORRIGIDO)
                    response.data[i].ORCAMENTO_DISPONIVEL_FORMATTED = formatCurrency(response.data[i].ORCAMENTO_DISPONIVEL)
                    // response.data[i].ANO = response.data[i].ANO
                    if(response.data[i].ANO && response.data[i].ANO != "" && !anos.includes(response.data[i].ANO)){
                        anos.push(response.data[i].ANO)
                    }
                    response.data[i].PAGO_FORMATTED = response.data[i].PAGO == null ? 0 : formatCurrency(response.data[i].PAGO)
                    response.data[i].PAGO_PERC = response.data[i].PAGO_PERC == null ? 0 : response.data[i].PAGO_PERC

                    // response.data[i].CABIMENTADO_FORMATTED = response.data[i].CABIMENTADO == null ? 0 : formatCurrency(response.data[i].CABIMENTADO)
                    // response.data[i].CABIMENTADO_PERCENT = response.data[i].CABIMENTADO_PERCENT == null ? 0 : response.data[i].CABIMENTADO_PERCENT
                    if (response?.data[i]?.cabimentacao?.length > 0) {
                        let listTotalCabimentado = response?.data[i]?.cabimentacao.map(res => res.CABIMENTADO)
                        response.data[i].CABIMENTADO_FORMATTED = formatCurrency(sumValues(listTotalCabimentado))
                        let listTotalCabimentadoPercent = response?.data[i]?.cabimentacao.map(res => res.CABIMENTADO_PERCENT)
                        let totalSumValues = sumValues(listTotalCabimentadoPercent)
                        response.data[i].CABIMENTADO_PERCENT = roundToTwoDecimalPlaces(totalSumValues);

                    } else {
                        response.data[i].CABIMENTADO_FORMATTED = "0"
                        response.data[i].CABIMENTADO_PERCENT = 0

                    }

                    if (response.data[i].SALDO_DISPONIVEL <= 0) {
                        response.data[i].COLOR_STATUS =
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <div style={{ backgroundColor: "red", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid red" }} />
                            </div>
                    }
                    if (response.data[i].cabimentacao?.length > 0) {
                        response.data[i].COLOR_STATUS =
                            <div style={{ display: "flex", alignItems: "center" }} >
                                <div style={{ backgroundColor: "gray", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid gray" }} />
                            </div>
                    }
                    if (response.data[i].cabimentacao?.length > 0 && response.data[i].SALDO_DISPONIVEL <= 0) {
                        response.data[i].COLOR_STATUS =
                            <>
                                <div style={{ display: "flex", alignItems: "center" }} >
                                    <div style={{ backgroundColor: "gray", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid gray", marginRight: "4px" }} />
                                    <div style={{ backgroundColor: "red", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid red" }} />

                                </div>

                            </>
                    }
                    // } else {
                    //     response.data[i].ESTADO =
                    //         <div style={{ display: "flex", alignItems: "center" }} >
                    //             <div style={{ backgroundColor: "green", width: "20px", height: "20px", borderRadius: "50%", border: "2px solid green" }} />
                    //         </div>
                    // }
                    const itemx = item

                    response.data[i].action =
                        <React.Fragment>
                            {taskEnable(pageAcess, permissoes, "Ler") == false ? null :
                                <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Ler")} onClick={() => openVerHandler(item)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Ler")} /></Link>
                            }

                            {taskEnable(pageAcess, permissoes, "Editar") == false ? null :
                                <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Editar")} onClick={() => openEditHandler(item)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Editar")} /></Link>
                            }

                            {response.data[i].SALDO_DISPONIVEL > 0 ? <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Cabimentacao")} onClick={() => openCriarCabimentacao(item)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Cabimentacao")} /></Link>
                                : null
                            }
                            {/* {response.data[i].DT_PAGAMENTO == null && taskEnable(pageAcess, permissoes, "Pagamento") == true ? <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Pagamento")} onClick={() => openPagamento(item)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Pagamento")} /></Link>
                                : null
                            } */}

                            {taskEnable(pageAcess, permissoes, "Eliminar") == false ? null :
                                <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Eliminar")} onClick={() => removeItem(item)} className="text-danger"><i className={"" + taskEnableIcon(pageAcess, permissoes, "Eliminar")} /></Link>
                            }
                        </React.Fragment>



                }

                setnewdata(response.data)

            }

            if( listAno.length == 0)
                setListAno(anos)

        } catch (err) {

            console.error(err.response)


        }

    }



    function getMeioPagamenot(obj) {

        let meiopagamento = meiopagamentos.find(res => res.ID = obj.pagamento[0].meio_pagamento_ID)

        return meiopagamento
    }


    function handleFiles(e) {
        console.log(selectedFiles)
        // Converte a coleção de arquivos para uma array e atualiza o estado
        setSelectedFiles([...selectedFiles, ...e]);
        setDocFile(e)
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


    function handleSelectedTab(key) {
        setTabDescription(key)
    }
    function handleSelectedTabChildren(key) {
        setTabDescriptionChildren(key)


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
    const [listProjetos, setListProjetos] = useState([]);
    const [listAno, setListAno] = useState([]);
    const [listProjetosAllObject, setListProjetosAllObject] = useState([]);

    async function uploadProjetos() {

        try {

            const response = await api.get('/projetos');

            if (response.status == '200') {
                setListProjetosAllObject(response.data)
                const selectOptions = response.data.map(option => ({
                    value: option.ID,
                    label: option.NOME,
                }));

                setListProjetos(selectOptions)
            }

        } catch (err) {

            console.error(err.response)
        }
    }

    const [listRubricas, setListRubricas] = useState([]);

    async function uploadRubricas() {
        try {
            const response = await api.get('/rubricas');
            if (response.status == '200') {
                const selectOptions = response.data.map(option => ({
                    value: option.ID,
                    label: option.DESIGNACAO,
                }));
                setListRubricas(selectOptions)
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

    const openVerHandler = (orcamento, cabimento) => {
        setPROJETO_ID(orcamento.PROJETO_ID)
        setORCAMENTO_INICIAL(orcamento.ORCAMENTO_INICIAL)
        setORCAMENTO_DISPONIVEL(orcamento.ORCAMENTO_DISPONIVEL)
        setORCAMENTO_CORRIGIDO(orcamento.ORCAMENTO_CORRIGIDO)
        setANO(orcamento.ANO)
        setRUBRICA_ID(orcamento.rubrica.ID)
        setCOMENTARIO(orcamento.COMENTARIO)
        const data = {
            orcamento: orcamento,
            cabimento: cabimento
        }
        setitemSelected(data)
        setVerOpen(true);
        setIsEditarOpen(false);
        setIsEditarRecebimentoOpen(false);
        setIsOpen(false);
    };



    //-----------------------------------------------'


    function handleFile(e) {
        setDocFile(e)
    }



    //-------------- EDITAR -------------------------


    const openEditHandler = (idx) => {
        setPROJETO_ID(idx.PROJETO_ID)
        setRUBRICA_ID(idx.RUBRICA_ID)
        setORCAMENTO_INICIAL(idx.ORCAMENTO_INICIAL)
        setORCAMENTO_DISPONIVEL(idx.ORCAMENTO_DISPONIVEL)
        setORCAMENTO_CORRIGIDO(idx.ORCAMENTO_CORRIGIDO)
        setANO(idx.ANO)
        setCOMENTARIO(idx.OBS)
        setitemSelected(idx)
        setENTIDADE_ID(idx.ENTIDADE_ID)
        setIsEditarOpen(true);
    };

    async function editarItemGO(event) {
        event.preventDefault();
        const upload = {
            ORCAMENTO_INICIAL: ORCAMENTO_INICIAL,
            ORCAMENTO_CORRIGIDO: ORCAMENTO_CORRIGIDO,
            OBS: COMENTARIO,
            PROJETO_ID: PROJETO_ID.value,
            RUBRICA_ID: RUBRICA_ID.value,
            ANO:ANO
        }
        if (isMax) {
            return popUp_alertaOK("Orcamento Inicial não pode ser superior ao Saldo Disponivel do Projeto");
        }
        setIsLoading(true)

        try {

            const response = await api.put('/orcamento/' + itemSelected.ID, upload);

            if (response.status == '200') {

                uploadlist()
                uploadRubricas()
                uploadProjetos()
                setIsLoading(false)

                setIsEditarOpen(false)

            }

        } catch (err) {
            setIsLoading(false)

            console.error(err.response)

        }

    }
    /// PAGAMENTO ////
    const openPagamento = (orcamento, cabimentacaoId) => {

        // setCABIMENTACAO_ID(cabimento.ID)
        // setRUBRICA_DESCRICAO(cabimento.rubrica[0].DESIGNACAO)
        // setIsRecebimentoOpen(true);
        // setitemSelected(orcamento)
        popUp_simcancelar(` Confirma o pagamento da Rúbrica  ${orcamento.rubrica.DESIGNACAO} ?`, {
            doit: executarPagamento,
            id: cabimentacaoId,
        })

        //setESTADO_C(idx.ID)
    };

    const executarPagamento = async (idx) => {

        let resx = false

        try {

            const response = await api.get('/payment/cabimentos/' + idx.ID);

            if (response.data.status == "fail") {
                return popUp_alertaOK(response.data.status.message);
            }
            if (response.status == '200') {
                setVerOpen(false);
                toast.success('Pagamento efectuado com sucesso!', { duration: 4000 })
                uploadlist()
                resx = true
            }


        } catch (err) {

            console.error(err.response)

        }

        return resx

    }

    const openCriarDespesa = (idx) => {
        setOrcamentoId(idx.ID)
        // setRubricasId(idx.rubrica[0].ID)
        setIsDespesaOpen(true);
        setitemSelected(idx)

        //setESTADO_C(idx.ID)
    };


    //----------------------------------------------

    // --------------- CABIMENTADO --------------------

    //// CRIAR
    const openCriarCabimentacao = (idx, cabimentado) => {
        setIsCabimentoOpen(true);
        setitemSelected(idx)
        //setESTADO_C(idx.ID)
    };


    async function criarCabimentoGO(event) {
        event.preventDefault();
        var isRequired = false
        var isRequiredAnexo = false

        var documentos = []
        // if (docFile === null) {
        //     return popUp_alertaOK("Selecione um comprovativo");

        if (novosdocumentos[0].DOC_URL === null) {
            return popUp_alertaOK("Preenche os campos de documentos");

        }
        if (isMax) {
            return popUp_alertaOK("Cabimentado não pode ser superior ao Saldo Disponivel");

        }
        for (let i = 0; i < novosdocumentos.length; i++) {
            if (novosdocumentos[i].numero == undefined || novosdocumentos[i].numero == '') {
                isRequired = true
            }
        }
        for (let i = 0; i < novosdocumentos.length; i++) {
            if (novosdocumentos[i].anexo == undefined || novosdocumentos[i].anexo.file == null) {
                isRequiredAnexo = true
            }
        }
        if (isRequiredAnexo) {
            return popUp_alertaOK("Falta inserir o anexo da Fatura");
        }
        if (isRequired) {
            return popUp_alertaOK("Preenche os campos de documentos");
        }
        setIsLoading(true)

        for (let i = 0; i < novosdocumentos.length; i++) {
            const img = await onFormSubmitImage(
                novosdocumentos[i].anexo.file
            );
            documentos.push({
                PR_DOCUMENTO_TP_ID: "f426156ba83c4b91c8f1c0de7025f582f16a",
                DOC_URL: img.file.data,
                NUMERO: novosdocumentos[i].numero
            })
        }
        const upload = {
            CABIMENTADO: parseInt(CABIMENTADO),
            COMENTARIO: COMENTARIO,
            PROJETO_RUBRICA_ID: itemSelected.ID,
            documentos: documentos
        }
        console.log(upload)

        try {

            const response = await api.post('/cabimentos', upload);

            if (response.status == '200') {
                uploadlist()
                setIsLoading(false)
                setCOMENTARIO("")
                setRUBRICA_ID("")
                setIsCabimentoOpen(false)

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
        setIsCabimentoOpen(false);
        setID_C("")
        setDESIG_C("")
        setOBS_C("")
        setESTADO_C("")
    };





    async function criarItemGO(event) {
        event.preventDefault();
        const upload = {
            ORCAMENTO_INICIAL: ORCAMENTO_INICIAL,
            ORCAMENTO_CORRIGIDO: ORCAMENTO_CORRIGIDO,
            COMENTARIO: COMENTARIO,
            PROJETO_ID: PROJETO_ID.value,
            RUBRICA_ID: RUBRICA_ID.value,
            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,
            OBS: COMENTARIO,
            ANO:ANO
        }
        console.log(upload)
        if (isMax) {
            return popUp_alertaOK("Orçamento Inicial não pode ser superior ao Saldo Disponível do Projeto");
        }
        setIsLoading(true)

        try {

            const response = await api.post('/orcamento', upload);

            if (response.status === 200) {
                if (response.data.status === "fail") {
                    popUp_alertaOK(response.data.message);


                    setIsLoading(false)
                    return
                }
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
    async function criarRecibimentoGO(event) {
        var isRequired = false
        var documentos = []
        event.preventDefault();

        for (let i = 0; i < novosdocumentos.length; i++) {
            if (novosdocumentos[i].anexo.file == null || novosdocumentos[i].numero == "") {
                isRequired = true
            }
        }
        if (isRequired) {
            return popUp_alertaOK("Preenche todos os campos");
        }
        for (let i = 0; i < novosdocumentos.length; i++) {
            const img = await onFormSubmitImage(
                novosdocumentos[i].anexo.file
            );
            documentos.push({
                PR_DOCUMENTO_TP_ID: "f426156ba83c4b91c8f1c0de7025f582f16a",
                DOC_URL: img.file.data,
                NUMERO: novosdocumentos[i].numero
            })
        }
        setIsLoading(true)

        const upload = {
            documentos: documentos
        }

        console.log(upload)

        try {

            const response = await api.post('/payment/cabimentos/' + CABIMENTACAO_ID, upload);
            if (response.status == '200') {
                toast.success('Pagamento efetuado com sucesso!', { duration: 4000 })

                uploadlist()
                setIsLoading(false)
                setIsRecebimentoOpen(false)

            }

        } catch (err) {
            setIsLoading(false)

            console.error(err.response)

        }

    }


    async function criarDespesa(event) {

        event.preventDefault();

        if (selectedFiles.length === 0) {
            return popUp_alertaOK("Selecione um comprovativo");

        }
        setIsLoading(true)

        var anexofile = "";
        let docs = []
        for (let index = 0; index < selectedFiles.length; index++) {
            const element = selectedFiles[index];
            const img = await onFormSubmitImage(element);
            anexofile = img.file.data;
            docs.push({ PR_DOCUMENTO_TP_ID: "f426156ba83c4b91c8f1c0de7025f582f16a", DOC_URL: anexofile })
        }


        const upload = {
            VALOR: VALOR_DESPESA,
            RUBRICA_ID: RUBRICA_ID.value,
            ORCALMENTO_ID: orcamentoId,
            documentos: docs,
        }

        console.log(upload)

        try {

            const response = await api.post('/despesa/orcamento', upload);

            if (response.status == '200') {

                uploadlist()
                uploadmeiospagamento()

                setIsLoading(false)

                setIsDespesaOpen(false)

            }

        } catch (err) {
            setIsLoading(false)

            console.error(err.response)

        }

    }



    function removeDespesasFiles(i) {

        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(i, 1);
        setSelectedFiles(updatedFiles);

    }






    //-------------- Remover -------------------------



    const removeItemFunction = async (idx) => {
        let res = true

        try {

            const response = await api.delete('/orcamento/' + idx);


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
            id: idx.ID,
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
    function getProjeto(projetoId) {
        const nome = listProjetos.find(res => res.value == projetoId)
        return nome?.label
    }
    function getRubrica(rubricaId) {
        const nome = listRubricas.find(res => res.value == rubricaId)
        return nome?.label
    }
    //-----------------------------------------------
    useEffect(() => {

        if (pageEnable(pageAcess, permissoes) == false) history.push('/')

        else {

            uploadlist()
            uploadRubricas()
            uploadProjetos()

        }

    }, [])





    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isRecebimentoOpen, setIsRecebimentoOpen] = useState(false);
    const [isDespesaOpen, setIsDespesaOpen] = useState(false);

    const [isCabimentoOpen, setIsCabimentoOpen] = useState(false);
    const [isEditarRecebimentoOpen, setIsEditarRecebimentoOpen] = useState(false);

    //-------------------- documento
    const [docedit, setdocedit] = useState(false);

    var [novosdocumentos, setnovosdocumentos] = useState([
        {
            id: "" + Math.random(),
            "PR_DOCUMENTO_TP_ID": "f426156ba83c4b91c8f1c0de7025f582f16a",
            DOC_URL: null
        },
    ]);
    function criaranexo(anexo, id) {
        const indexx = novosdocumentos.findIndex((x) => x.id === id);

        if (
            novosdocumentos[indexx].tipodocumento == "" ||
            novosdocumentos[indexx].numero == ""
        ) {
            popUp_alertaOK("Preencha o campos obrigatórios");
        }

        novosdocumentos[indexx] = {
            id: id,
            numero: novosdocumentos[indexx].numero,
            anexo: { type: 2, file: anexo },
        };

        setdocedit(true);

        setnovosdocumentos(novosdocumentos.concat([]));
    }
    function criardocnum(docnum, id) {
        const indexx = novosdocumentos.findIndex((x) => x.id === id);

        novosdocumentos[indexx] = {
            id: id,
            numero: docnum,
            anexo: novosdocumentos[indexx].anexo,

        };

        setdocedit(true);

        setnovosdocumentos(novosdocumentos.concat([]));
    }

    function addnovosdocumentos() {
        setnovosdocumentos(
            novosdocumentos.concat([
                {
                    id: "" + Math.random(),
                    tipodocumento: "",
                    numero: "",
                    anexo: { type: 0, file: null },
                },
            ])
        );
    }


    function removenovosdocumentos(id) {
        if (novosdocumentos.length > 1) {
            const indexx = novosdocumentos.findIndex((x) => x.id === id);

            if (indexx > -1) {
                var newArr = novosdocumentos;
                newArr.splice(indexx, 1);
                setnovosdocumentos(newArr.concat([]));

                setdocedit(true);
            }
        }
    }
    const handleChangeOrcamentoInicial = (event) => {
        const inputValue = event.target.value;
        if (inputValue === "") {
            return setIsMax(false)

        }
        if (PROJETO_ID === "") {
            setIsMax(false)
            return popUp_alertaOK("Escolhe um projeto");
        }
        let saldoDisponivelProjeto = listProjetosAllObject.find(res => res.ID === PROJETO_ID.value).SALDO_DISPONIVEL
        if (parseInt(inputValue) > saldoDisponivelProjeto) {
            setORCAMENTO_INICIAL(inputValue);
            setIsMax(true)
        } else {
            setORCAMENTO_INICIAL(inputValue);
            setIsMax(false)
        }
    };
    const handleChangeCabimentado = (event) => {
        const inputValue = event.target.value;
        if (inputValue === "") {
            return setIsMax(false)

        }
        console.log(itemSelected)
        if (parseInt(inputValue) > itemSelected?.SALDO_DISPONIVEL) {
            setCABIMENTADO(inputValue);
            setIsMax(true)
        } else {
            setCABIMENTADO(inputValue);
            setIsMax(false)
        }
    };
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
                    {/* <Card> */}
                    {/* <Card.Body> */}
                    {/* <Table columns={columns} data={newdata} modalOpen={openHandler} /> */}
                    <Tabs onSelect={(e) => handleSelectedTab(e)}
                        defaultActiveKey="dados"
                        id="justify-tab-example"
                        className="mb-3 tabs-casino"
                        justify
                    > <Tab eventKey="dados" title={<span> <i className={
                        "icon-tab-casino feather icon-edit "
                    } /> Orçamento</span>} >

                            {tabDescription == "dados" &&

                                <Card>
                                    <Card.Body>
                                        <Table listAno={listAno} listProjetos={listProjetos} columns={columns} data={newdata} modalOpen={openHandler} uploadlist={uploadlist} years={years} uploadmeiospagamento={uploadmeiospagamento} />
                                    </Card.Body>
                                </Card>
                            }

                        </Tab>
                        <Tab eventKey="projetos" title={<span> <i className={
                            "icon-tab-casino feather icon-edit "
                        } /> Projetos</span>} >

                            {tabDescription == "projetos" &&
                                <Projetos />
                            }

                        </Tab>
                    </Tabs>
                </Col>
                <Col sm={12}>


                    {/* --------------------Criar Item------------------- */}


                    <Modal size='x' show={isOpen} onHide={() => setIsOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarItem" onSubmit={criarItemGO} >

                                <Row>

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
                                            <label className="floating-label" htmlFor="Name">Projeto <span style={{ color: "red" }} >*</span></label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                onChange={event => setPROJETO_ID(event)}
                                                name="projeto"
                                                options={listProjetos}
                                                value={PROJETO_ID}
                                                required
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                placeholder="Projeto..."

                                            />
                                            {/* </span> */}

                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Rubricas <span style={{ color: "red" }} >*</span></label>



                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                onChange={event => setRUBRICA_ID(event)}
                                                name="rubricas"
                                                options={listRubricas}
                                                value={RUBRICA_ID}
                                                required
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                placeholder="Rubricas..."

                                            />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" defaultValue={""} onChange={event => {setANO(event.target.value)}} className="form-control" placeholder="Ano..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Inicial <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" defaultValue={""} onChange={handleChangeOrcamentoInicial} className="form-control" placeholder="Orçamento Inicial..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Corrigido <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setORCAMENTO_CORRIGIDO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Orçamento Corrigido..." required />

                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Comentários <span style={{ color: "red" }} >*</span></label>
                                            <textarea className="form-control" maxLength="64000" onChange={event => { setCOMENTARIO(event.target.value) }} id="comentarios" rows="3" placeholder='Comentários...' />

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
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Projeto <span style={{ color: "red" }} >*</span></label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                onChange={event => setPROJETO_ID(event)}
                                                name="projeto"
                                                options={listProjetos}
                                                defaultValue={
                                                    listProjetos.map(projeto => (
                                                        projeto.value == PROJETO_ID ? projeto : null
                                                    ))
                                                } required
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                placeholder="Projeto..."

                                            />
                                            {/* </span> */}

                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Rubricas <span style={{ color: "red" }} >*</span></label>

                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                onChange={event => setRUBRICA_ID(event)}
                                                name="rubricas"
                                                options={listRubricas}
                                                defaultValue={
                                                    listRubricas.map(rubrica => (
                                                        rubrica.value == RUBRICA_ID ? rubrica : null
                                                    ))
                                                } required
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                placeholder="Rubricas..."

                                            />

                                        </div>
                                    </Col>

                                    
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => {setANO(event.target.value)}} defaultValue={itemSelected.ANO} className="form-control" placeholder="Ano..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Inicial <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={handleChangeOrcamentoInicial} defaultValue={itemSelected.ORCAMENTO_INICIAL} className="form-control" placeholder="Orçamento Inicial..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Corrigido <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setORCAMENTO_CORRIGIDO(event.target.value) }} defaultValue={itemSelected.ORCAMENTO_CORRIGIDO} className="form-control" placeholder="Orçamento Corrigido..." required />

                                        </div>
                                    </Col>

                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Comentários <span style={{ color: "red" }} >*</span></label>
                                            <textarea defaultValue={itemSelected.OBS} className="form-control" maxLength="64000" onChange={event => { setCOMENTARIO(event.target.value) }} id="comentarios" rows="3" placeholder='Comentários...' />

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
                                        activeProfileTab === "dados"
                                            ? profileTabActiveClass
                                            : profileTabClass
                                    }
                                    onClick={() => {
                                        setActiveProfileTab("dados");
                                    }}
                                    id="profile-tab"
                                >
                                    <i className="feather icon-server mr-2" />
                                    Dados
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    to="#"
                                    className={
                                        activeProfileTab === "despesa"
                                            ? profileTabActiveClass
                                            : profileTabClass
                                    }
                                    onClick={() => {
                                        setActiveProfileTab("despesa");
                                    }}
                                    id="contact-tab"
                                >
                                    <i className="feather icon-file-text mr-2" />
                                    Cabimentação
                                </Link>
                            </li>
                        </ul>
                        <Modal.Body className="newuserbox" style={activeProfileTab === "dados" ? {} : { display: "none" }} >

                            <form id="editarItem"  >

                                <Row>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Projeto <span style={{ color: "red" }} >*</span></label>
                                            <Select
                                                isDisabled={true} className="basic-single"
                                                classNamePrefix="select"
                                                onChange={event => setPROJETO_ID(event)}
                                                name="projeto"
                                                options={listProjetos}
                                                defaultValue={
                                                    listProjetos.map(projeto => (
                                                        projeto.value == PROJETO_ID ? projeto : null
                                                    ))
                                                } required
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                placeholder="Projeto..."

                                            />
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Rubricas <span style={{ color: "red" }} >*</span></label>
                                            <Select
                                                isDisabled={true} className="basic-single"
                                                classNamePrefix="select"
                                                onChange={event => setRUBRICA_ID(event)}
                                                name="rubricas"
                                                options={listRubricas}
                                                defaultValue={
                                                    listRubricas.map(rubrica => (
                                                        rubrica.value == RUBRICA_ID ? rubrica : null
                                                    ))
                                                } required
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                placeholder="Rubricas..."
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>

                                            <input readOnly="readOnly"
                                                type="number" onChange={event => { setANO(event.target.value) }} defaultValue={itemSelected?.orcamento?.ANO} className="form-control" />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Inicial <span style={{ color: "red" }} >*</span></label>

                                            <input readOnly="readOnly"
                                                type="text" onChange={event => { setORCAMENTO_INICIAL(event.target.value) }} defaultValue={itemSelected?.orcamento?.ORCAMENTO_INICIAL_FORMATTED} className="form-control" />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Corrigido <span style={{ color: "red" }} >*</span></label>

                                            <input
                                                readOnly="readOnly" type="text" onChange={event => { setORCAMENTO_CORRIGIDO(event.target.value) }} defaultValue={itemSelected?.orcamento?.ORCAMENTO_CORRIGIDO_FORMATTED} className="form-control" />

                                        </div>
                                    </Col>

                                    {itemSelected?.orcamento?.PAGO != null ?
                                        <>

                                            <Col sm={6}>
                                                <div className="form-group fill">
                                                    <label className="floating-label" htmlFor="Name">Pago <span style={{ color: "red" }} >*</span></label>

                                                    <input
                                                        readOnly="readOnly" type="text" defaultValue={itemSelected?.orcamento?.PAGO_FORMATTED} className="form-control" />

                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group fill">
                                                    <label className="floating-label" htmlFor="Name">Pago %<span style={{ color: "red" }} >*</span></label>

                                                    <input readOnly="readOnly" type="text" defaultValue={itemSelected?.orcamento?.PAGO_PERCENT} className="form-control" />

                                                </div>
                                            </Col>
                                        </>
                                        : null}
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Comentários <span style={{ color: "red" }} >*</span></label>
                                            <textarea readOnly="readOnly" defaultValue={itemSelected?.orcamento?.OBS} className="form-control" maxLength="64000" onChange={event => { setCOMENTARIO(event.target.value) }} id="comentarios" rows="3" placeholder='Comentários...' />

                                        </div>
                                    </Col>
                                </Row>
                            </form>
                        </Modal.Body>
                        {itemSelected?.orcamento?.cabimentacao?.length > 0 ? (
                            <Modal.Body className="newuserbox" style={activeProfileTab === "despesa" ? {} : { display: "none" }} >
                                <form id="criarItem"  >
                                    <>
                                        {itemSelected?.orcamento?.cabimentacao?.map((cabimentacao, index) => (

                                            <Row className='mb-3 border-bottom'>
                                                <Col sm={4}>
                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="Name">
                                                            Cabimentado <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <input
                                                            readOnly="readOnly"
                                                            defaultValue={cabimentacao?.CABIMENTADO}
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Valor..."

                                                        />
                                                    </div>
                                                </Col>
                                                <Col sm={4}>
                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="Name">
                                                            Cabimentado % <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <input
                                                            readOnly="readOnly"
                                                            defaultValue={cabimentacao?.CABIMENTADO_PERCENT + "%"}
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Valor..."

                                                        />
                                                    </div>
                                                </Col>
                                                <Col sm={4}>
                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="Name">
                                                            Data Pagamento
                                                        </label>
                                                        <input
                                                            readOnly="readOnly"
                                                            defaultValue={makedate(cabimentacao?.DT_PAGAMENTO)}
                                                            type="text"
                                                            className="form-control"

                                                        />
                                                    </div>
                                                </Col>
                                                <Col sm={12}>
                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="Name">Comentários <span style={{ color: "red" }} >*</span></label>
                                                        <textarea readOnly="readOnly" defaultValue={cabimentacao?.COMENTARIO} className="form-control" maxLength="64000" rows="3" placeholder='Comentários...' />
                                                    </div>
                                                </Col>

                                                <Col sm={12}>

                                                    <div className='row align-items-center key={index}'>
                                                        <Col sm={12}>
                                                            <div className="form-group fill">
                                                                <label className="floating-label" htmlFor="Name">
                                                                    Rúbrica
                                                                </label>
                                                                <Select
                                                                    isDisabled={true} className="basic-single"
                                                                    classNamePrefix="select"
                                                                    name="rubricas"
                                                                    options={listRubricas}
                                                                    defaultValue={
                                                                        listRubricas.map(rubrica => (
                                                                            rubrica.value == itemSelected?.rubrica?.ID ? rubrica : null
                                                                        ))
                                                                    } required
                                                                    menuPlacement="auto"
                                                                    menuPosition="fixed"
                                                                    placeholder="Rúbrica..."

                                                                />
                                                            </div>
                                                        </Col>

                                                    </div>


                                                </Col>
                                                <Col sm={12}>
                                                    {cabimentacao?.sgigjreldocumento.length > 0 ? (
                                                        cabimentacao?.sgigjreldocumento.map((documento, index) => (
                                                            <div className='d-flex flex-column ' key={index}>
                                                                <div className='row align-items-center'>
                                                                    <Col sm={6}>
                                                                        <div className="form-group fill">
                                                                            <label className="floating-label" htmlFor="Name">
                                                                                Número Documento                                                                           </label>
                                                                            <input
                                                                                readOnly="readOnly"
                                                                                defaultValue={documento.NUMERO}
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Número Documento ..."

                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                    <Col sm={6}>
                                                                        <a href={`${documento.DOC_URL}?alt=media&token=0`} target="_blank">
                                                                            <Button variant="primary">Abrir documento {index + 1}</Button>
                                                                        </a>
                                                                    </Col>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : null}

                                                </Col>
                                                <Col className='mt-3 mb-3' sm={6}>
                                                    <>
                                                        {cabimentacao?.DT_PAGAMENTO == null ? (
                                                            <Button onClick={() => openPagamento(itemSelected?.orcamento, cabimentacao)} variant="primary">Efetuar Pagamento</Button>
                                                        ) : <Button variant="secondary"> Pagamento Efetuado</Button>}
                                                    </>
                                                </Col>
                                                {/* <Col sm={12}>
                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="Name">Rubricas <span style={{ color: "red" }} >*</span></label>



                                                        <Select
                                                            isDisabled={true} className="basic-single"
                                                            classNamePrefix="select"
                                                            onChange={event => setRUBRICA_ID(event)}
                                                            name="rubricas"
                                                            options={listRubricas}
                                                            defaultValue={
                                                                listRubricas.map(rubrica => (
                                                                    rubrica.value == itemSelected.despesa[itemSelected.despesa.length - 1].rubrica[0].ID ? rubrica : null
                                                                ))
                                                            } required
                                                            menuPlacement="auto"
                                                            menuPosition="fixed"
                                                            placeholder="Rubricas..."

                                                        />

                                                    </div>
                                                </Col> */}

                                                {/* <Col sm={12}>
                                                    <div className="d-flex">
                                                        {itemSelected.despesa[itemSelected.despesa.length - 1].sgigjreldocumento.length > 0 ? (
                                                            itemSelected.despesa[itemSelected.despesa.length - 1].sgigjreldocumento.map((documento, index) => (
                                                                <div className='mr-2' key={index}>
                                                                    <a href={`${documento.DOC_URL}?alt=media&token=0`} target="_blank">
                                                                        <Button variant="primary">Abrir documento {index + 1}</Button>
                                                                    </a>
                                                                </div>
                                                            ))
                                                        ) : null}
                                                    </div>
                                                </Col> */}

                                            </Row>
                                        ))}
                                    </>
                                </form>
                            </Modal.Body>
                        ) : null}
                        <Modal.Footer className="d-flex justify-content-between">
                            <span>Registado por: {itemSelected?.criadoPor?.sgigjrelpessoaentidade?.sgigjpessoa?.NOME}</span>
                            <Button variant="danger" onClick={() => setVerOpen(false)}>Fechar</Button>

                        </Modal.Footer>


                    </Modal>


                    {/* --------------------Criar Item Cabimento------------------- */}

                    <Modal size='x' show={isCabimentoOpen} onHide={() => setIsCabimentoOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar Cabimento</Modal.Title>
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
                                        activeProfileTab === "dados"
                                            ? profileTabActiveClass
                                            : profileTabClass
                                    }
                                    onClick={() => {
                                        setActiveProfileTab("dados");
                                    }}
                                    id="profile-tab"
                                >
                                    <i className="feather icon-server mr-2" />
                                    Dados
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    to="#"
                                    className={
                                        activeProfileTab === "despesa"
                                            ? profileTabActiveClass
                                            : profileTabClass
                                    }
                                    onClick={() => {
                                        setActiveProfileTab("despesa");
                                    }}
                                    id="contact-tab"
                                >
                                    <i className="feather icon-file-text mr-2" />
                                    Documentos
                                </Link>
                            </li>
                        </ul>
                        <Modal.Body className="newuserbox" style={activeProfileTab === "dados" ? {} : { display: "none" }} >

                            <form id="criarCabimento" onSubmit={criarCabimentoGO} >

                                <Row>
                                    <Col md={12}>


                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">
                                                Projeto <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input type="text" readOnly="readOnly" defaultValue={getProjeto(itemSelected?.PROJETO_ID)} className="form-control" />
                                        </div>

                                    </Col>
                                    <Col md={12}>


                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">
                                                Rúbrica <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input type="text" readOnly="readOnly" defaultValue={getRubrica(itemSelected?.RUBRICA_ID)} className="form-control" />
                                        </div>

                                    </Col>
                                    {/* <Col md={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Rubricas">
                                                    Rubricas <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input type="text" readOnly="readOnly" defaultValue={itemSelected?.rubrica
                                                [0]?.DESIGNACAO} className="form-control" />
                                            </div>
                                        </Col> */}
                                    <Col md={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Rubricas">
                                                Saldo Disponível <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input type="text" readOnly="readOnly" defaultValue={itemSelected?.SALDO_DISPONIVEL} className="form-control" />
                                        </div>

                                    </Col>

                                    <Col md={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Rubricas">
                                                Cabimentado <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input max={itemSelected?.SALDO_DISPONIVEL} type="number" onChange={handleChangeCabimentado} className="form-control" required placeholder="Cabimentado"
                                            />
                                            {isMax ?
                                                <small className='text-danger'> Cabimentado não pode ser superior ao Saldo Disponivel</small>
                                                : ""}
                                        </div>

                                    </Col>
                                    {/* <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Rubricas <span style={{ color: "red" }} >*</span></label>

                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                onChange={event => setRUBRICA_ID(event)}
                                                name="rubricas"
                                                options={listRubricas}
                                                value={RUBRICA_ID}
                                                required
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                placeholder="Rubricas..."

                                            />

                                        </div>
                                    </Col> */}
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Comentários <span style={{ color: "red" }} >*</span></label>
                                            <textarea className="form-control" maxLength="64000" onChange={event => { setCOMENTARIO(event.target.value) }} id="comentarios" rows="3" placeholder='Comentários...' />

                                        </div>
                                    </Col>
                                    {/* <Col md={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Rubricas">
                                                    Cabimentado % <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input type="number" onChange={event => { setCABIMENTADO_PERCENT(event.target.value) }} defaultValue={""} className="form-control" required placeholder="Cabimentado % "
                                                />
                                            </div>



                                        </Col> */}


                                </Row>

                            </form>

                        </Modal.Body>
                        <Modal.Body className="newuserbox" style={activeProfileTab === "despesa" ? {} : { display: "none" }} >
                            <form className='w-100'  >

                                <Row>
                                    <Col
                                        style={{ display: "flex", justifyContent: "flex-end" }}
                                        sm={12}
                                    >
                                        <Button onClick={() => addnovosdocumentos()} variant="primary">
                                            +
                                        </Button>
                                    </Col>
                                </Row>

                                {novosdocumentos.map((eq, index) => (
                                    <Row style={{ marginBottom: "12px" }} key={eq.id}>
                                        <Col sm={12}>
                                            <Row>
                                                <Col sm={6}>
                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="text">
                                                            Número <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <input
                                                            required
                                                            onChange={(event) => {
                                                                criardocnum(event.target.value, eq.id);
                                                            }}
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </Col>

                                                <div className="col-sm-6  paddinhtop28OnlyPC">
                                                    <div className='d-flex'>
                                                        <label
                                                            htmlFor={"anexarcriar" + eq.id}
                                                            className="btn"
                                                            style={{ backgroundColor: "#d2b32a", color: "#fff" }}
                                                        >
                                                            {eq?.anexo?.file == null ? (
                                                                <>
                                                                    <i className="feather icon-download" />
                                                                    <>{" Anexar"}</>
                                                                </>
                                                            ) : (
                                                                "Anexado"
                                                            )}{" "}
                                                        </label>
                                                        <input
                                                            id={"anexarcriar" + eq.id}
                                                            onChange={(event) =>
                                                                criaranexo(event.target.files[0], eq.id)
                                                            }
                                                            accept="image/x-png,image/jpeg"
                                                            style={{ display: "none" }}
                                                            type="file"
                                                        />
                                                        {novosdocumentos.length > 1 ? (
                                                            // <div className="paddinhtop66OnlyPC col-sm-4 ">
                                                            <label
                                                                onClick={() => removenovosdocumentos(eq.id)}
                                                                class="btn btn-danger ml-3"
                                                            >
                                                                <i className="feather icon-trash-2" />
                                                            </label>
                                                            // </div>
                                                        ) : null}
                                                    </div>
                                                </div>


                                            </Row>
                                        </Col>


                                    </Row>
                                ))}
                            </form>
                        </Modal.Body>


                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsCabimentoOpen(false)}>Fechar</Button>

                            {!isLoading ? <Button type="submit" form="criarCabimento" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

                        </Modal.Footer>
                    </Modal>

                    {/* --------------------Criar Item Pagamento------------------- */}

                    <Modal size='x' show={isRecebimentoOpen} onHide={() => setIsRecebimentoOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5"> Pagamento da Rúbrica {RUBRICA_DESCRICAO}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form className='w-100' id="criarItem" onSubmit={criarRecibimentoGO} >

                                <Row>
                                    <Col
                                        style={{ display: "flex", justifyContent: "flex-end" }}
                                        sm={12}
                                    >
                                        <Button onClick={() => addnovosdocumentos()} variant="primary">
                                            +
                                        </Button>
                                    </Col>
                                </Row>

                                {novosdocumentos.map((eq, index) => (
                                    <Row style={{ marginBottom: "12px" }} key={eq.id}>
                                        <Col sm={12}>
                                            <Row>
                                                <Col sm={6}>
                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="text">
                                                            Número <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <input
                                                            required
                                                            onChange={(event) => {
                                                                criardocnum(event.target.value, eq.id);
                                                            }}
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </Col>

                                                <div className="col-sm-6  paddinhtop28OnlyPC">
                                                    <div className='d-flex'>
                                                        <label
                                                            htmlFor={"anexarcriar" + eq.id}
                                                            className="btn"
                                                            style={{ backgroundColor: "#d2b32a", color: "#fff" }}
                                                        >
                                                            {eq?.anexo?.file == null ? (
                                                                <>
                                                                    <i className="feather icon-download" />
                                                                    <>{" Anexar"}</>
                                                                </>
                                                            ) : (
                                                                "Anexado"
                                                            )}{" "}
                                                        </label>
                                                        <input
                                                            id={"anexarcriar" + eq.id}
                                                            onChange={(event) =>
                                                                criaranexo(event.target.files[0], eq.id)
                                                            }
                                                            accept="image/x-png,image/jpeg"
                                                            style={{ display: "none" }}
                                                            type="file"
                                                        />
                                                        {novosdocumentos.length > 1 ? (
                                                            // <div className="paddinhtop66OnlyPC col-sm-4 ">
                                                            <label
                                                                onClick={() => removenovosdocumentos(eq.id)}
                                                                class="btn btn-danger ml-3"
                                                            >
                                                                <i className="feather icon-trash-2" />
                                                            </label>
                                                            // </div>
                                                        ) : null}
                                                    </div>
                                                </div>


                                            </Row>
                                        </Col>


                                    </Row>
                                ))}


                                {/* 
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">N° Documento <span style={{ color: "red" }} >*</span></label>

                                            <input type="text" onChange={event => { setCheque(event.target.value) }} defaultValue={""} className="form-control" placeholder="N° Documento ..." />

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
                                                    handleFile(event.target.files[0])
                                                }
                                                accept="image/*,.pdf" type="file"
                                            />

                                        </div>
                                    </Col> */}

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsRecebimentoOpen(false)}>Fechar</Button>

                            {!isLoading ? <Button type="submit" form="criarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

                        </Modal.Footer>
                    </Modal>

                    {/* --------------------Criar Item Despesa------------------- */}


                    <Modal size='x' show={isDespesaOpen} onHide={() => setIsDespesaOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar Despesa</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarDespesa" onSubmit={criarDespesa} >

                                <Row>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Valor <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setVALOR_DESPESA(event.target.value) }} className="form-control" placeholder="Valor ..." required />

                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Rubricas <span style={{ color: "red" }} >*</span></label>



                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                onChange={event => setRUBRICA_ID(event)}
                                                name="rubricas"
                                                options={listRubricas}
                                                value={RUBRICA_ID}
                                                required
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                placeholder="Rubricas..."

                                            />

                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="form-group fill">

                                            <label
                                                htmlFor={"anexareditarDespesa"}
                                                className="btn"
                                                style={{ backgroundColor: "#d2b32a", color: "#fff" }}
                                            >
                                                {selectedFiles.length === 0 ? (
                                                    <>
                                                        <i className="feather icon-download" />
                                                        <>{" Anexar"}</>
                                                    </>
                                                ) : (
                                                    "Anexado"
                                                )}{" "}
                                            </label>
                                            <input
                                                multiple
                                                id={"anexareditarDespesa"}
                                                style={{ display: "none" }}
                                                onChange={(event) =>
                                                    handleFiles(event.target.files)
                                                }
                                                accept="image/*,.pdf" type="file"
                                            />
                                            {/* {docFile != null ? <Button accept="image/*,.pdf" type='file' onChange={event => { handleFile(event.target.value) }} variant="primary">Anexar</Button> : <Button variant="primary">Anexado</Button>} */}

                                        </div>
                                        {selectedFiles.length > 0 ? (
                                            <div>
                                                <div>
                                                    {selectedFiles.map((file, index) => (
                                                        <>
                                                            <li className='d-flex justify-content-between ' key={index}>{file.name}
                                                                <span style={{ cursor: "pointer" }} onClick={() => removeDespesasFiles(index)}
                                                                    className="text-danger" ><i class="feather icon-trash-2"></i></span>
                                                            </li>
                                                        </>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null
                                        }
                                    </Col>
                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsDespesaOpen(false)}>Fechar</Button>

                            {!isLoading ? <Button type="submit" form="criarDespesa" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

                        </Modal.Footer>
                    </Modal>





                </Col>
            </Row >
        </React.Fragment >
    </>
    );












};
export default Orcamento;