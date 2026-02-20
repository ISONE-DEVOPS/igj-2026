import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, ListGroup } from 'react-bootstrap';
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

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle, formatCurrency, parseCurrency, sumValues, formatDate, onFormSubmitImage, setParams } from '../../../../functions';


const pageAcess = "/entidade/visaogeral"

function Table({ columns, data, modalOpen, listProjetos, uploadlist, years }) {
    var total_Imposto
    var total_Contrapartida
    var total_Contribuicoes

    var total_ReceitaBruto
    var total_TotalRecibo
    var total_PrémioInicial
    var total_PrémioSubsequente


    const [projetoId, setProjetoId] = useState("")
    const [ano, setAno] = useState("")
    const [DATA_DE, setDATA_DE] = useState("");
    const [DATA_PARA, setDATA_PARA] = useState("");
    const [values, setValues] = useState()
    const params = useParams();

    if (data.length > 0) {
        console.log(data)
        const listImposto = data.map(res => parseCurrency(res.Imposto))
        total_Imposto = sumValues(listImposto)

        const listContrapartida = data.map(res => parseCurrency(res.Contrapartida))
        total_Contrapartida = sumValues(listContrapartida)

        const listReceitaBruto = data.map(res => parseCurrency(res.ReceitaBruta))
        total_ReceitaBruto = sumValues(listReceitaBruto)

        const listContribuicoes = data.map(res => parseCurrency(res.ContribuicoesIGJ))
        total_Contribuicoes = sumValues(listContribuicoes)

        const listPremioInicial = data.map(res => parseCurrency(res.PremioInicial))
        total_PrémioInicial = sumValues(listPremioInicial)

        const listPremioSubseqente = data.map(res => parseCurrency(res.PremioSubsequente))
        total_PrémioSubsequente = sumValues(listPremioSubseqente)

        const total_Recibo = data.map(res => parseCurrency(res.TotalRecibo))
        total_TotalRecibo = sumValues(total_Recibo)
    }

    const { permissoes, popUp_simcancelar } = useAuth();
    // const totalBRUTO = parseCurrency(totalBruto)
    function optionDownload(value) {
        if (value === "1") {
            exportPDF();
        } else if (value === "2") {
            exportExel()
        }
    }
    async function exportPDF() {
        const dataInicio = DATA_DE === "" ? undefined : DATA_DE
        const dataFim = DATA_PARA === "" ? undefined : DATA_PARA
        try {

            const response = await api.get(`/export-pdf/financeiro?` + setParams([['DATA_INICIO', dataInicio], ["DATA_FIM", dataFim]]), { responseType: "blob" });

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
    const resetForm = () => {
        setValues("")
    }
    function filterDataInicio(e) {
        setDATA_DE(e)
        console.log(e)
        uploadlist(e, DATA_PARA)
    }
    function filterDataFim(e) {
        setDATA_PARA(e)
        uploadlist(DATA_DE, e)
    }
    function reloadList() {
        setDATA_DE("")
        setDATA_PARA("")
        uploadlist()

    }
    async function exportExel() {
        const dataInicio = DATA_DE === "" ? undefined : DATA_DE
        const dataFim = DATA_PARA === "" ? undefined : DATA_PARA
        try {

            const response = await api.get(`/export-csv/financeiro` + setParams([['DATA_INICIO', dataInicio], ["DATA_FIM", dataFim]]), { responseType: "blob" });

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
                        className="form-control w-auto mx-2"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                        }}
                    >
                        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    entradas
                </Col>
                <Col md={9} className="d-flex justify-content-end">
                    {/* <div className="form-group fill">
            <label className="floating-label" htmlFor="Name">
              Data Início<span style={{ color: "red" }}>*</span>
            </label>
           
          </div> */}
                    <div className="d-flex align-items-center mr-2">
                        <div className="d-flex">
                            <div className="d-flex align-items-center mr-1">
                                <span className="floating-label" htmlFor="Name">
                                    De:<span style={{ color: "red" }}>*</span>
                                </span>
                                <input
                                    type="date"
                                    onChange={(event) => {
                                        filterDataInicio(event.target.value);
                                    }}
                                    value={DATA_DE}
                                    max="2050-12-31"
                                    className="form-control"
                                    placeholder="Data Inicio"
                                    required
                                />
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="floating-label" htmlFor="Name">
                                    Para:<span style={{ color: "red" }}>*</span>
                                </span>
                                <input
                                    onChange={(event) => {
                                        filterDataFim(event.target.value);
                                    }}
                                    type="date"
                                    value={DATA_PARA}
                                    max="2050-12-31"
                                    className="form-control"
                                    placeholder="Data Fim"
                                    required
                                /></div>
                        </div>
                        {DATA_DE !== "" || DATA_PARA !== "" ?
                            <div style={{ cursor: 'pointer' }} onClick={() => {
                                reloadList();
                            }} className="ml-2">
                                <i className="feather icon-x-circle" />
                            </div>
                            : ""
                        }
                    </div>

                    {/* {taskEnable(pageAcess, permissoes, "Criar") == false ? null : (
                        <Button
                            variant="primary"
                            className="btn-sm btn-round has-ripple ml-2"
                            onClick={modalOpen}
                        >
                            <i className="feather icon-plus" /> Adicionar
                        </Button>
                    )} */}

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
                    <tr>
                        <td className="merged-cell font-weight-bold" colspan="1">Total</td>
                        <td className='font-weight-bold text-right'>{formatCurrency(total_PrémioInicial)}</td>
                        <td className='font-weight-bold text-right'>{formatCurrency(total_PrémioSubsequente)}</td>
                        <td className='font-weight-bold text-right text-right'>{formatCurrency(total_ReceitaBruto)}</td>
                        <td className='font-weight-bold text-right text-right'>{formatCurrency(total_Imposto)}</td>
                        <td className='font-weight-bold text-right'>{formatCurrency(total_Contrapartida)}</td>
                        <td className='font-weight-bold text-right'>{formatCurrency(total_Contribuicoes)}</td>
                        <td className='font-weight-bold text-right'>{formatCurrency(total_TotalRecibo)}</td>

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



const VisaoGeral = () => {

    const { id } = useParams();

    const [id_params, setid_params] = useState("0");

    const { popUp_removerItem, popUp_alertaOK, popUp_simcancelar } = useAuth();


    const { permissoes } = useAuth();

    const history = useHistory();

    var todayDate = new Date().toJSON().slice(0, 10);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Ano.',
                accessor: 'ANO',
                centered: true
            },
            {
                Header: 'Prémio Inicial',
                accessor: 'PremioInicial',
                centered: false
            },
            {
                Header: 'Prémio Subsequente',
                accessor: 'PremioSubsequente',
                centered: false
            },
            {
                Header: 'Receita Bruta',
                accessor: 'ReceitaBruta',
                centered: false
            },
            {
                Header: 'Imposto',
                accessor: 'Imposto',
                centered: false
            },

            {
                Header: 'Contrapartida',
                accessor: 'Contrapartida',
                centered: false
            },

            {
                Header: 'Contribuições IGJ',
                accessor: 'ContribuicoesIGJ',
                centered: false
            }, {
                Header: 'Total Recibo',
                accessor: 'TotalRecibo',
                centered: false
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

    const [CABIMENTADO, setCABIMENTADO] = useState(0);
    const [CABIMENTADO_PERCENT, setCABIMENTADO_PERCENT] = useState("");


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

    const [impostoId, setImpostoId] = useState("");
    const [montanteRecebido, setMontanteRecebido] = useState(0);

    const [isCheck, setIsCheck] = useState(false);
    const [defaultMeioPagamento, setDefaultMeioPagamento] = useState();
    const [docFile, setDocFile] = useState(null);

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

    async function uploadlist(dataInicio, dataFim) {
        dataInicio = dataInicio === "" ? undefined : dataInicio
        dataFim = dataFim === "" ? undefined : dataFim
        setid_params(id)
        try {

            const response = await api.get('/financeiro?' + setParams([['DATA_INICIO', dataInicio], ["DATA_FIM", dataFim]]));

            if (response.status == '200') {
                let data = response.data.slice(0, -1)
                console.log(data)
                for (var i = 0; i < data.length; i++) {

                    const idx = response.data[i].ID
                    data[i].ANO = data[i]["Ano"]

                    data[i].ContribuicoesIGJ = data[i]["Contribuições IGJ"] == "" ? formatCurrency(0) : formatCurrency(data[i]["Contribuições IGJ"])
                    data[i].Contrapartida = data[i]["Contrapartida"] == "" ? formatCurrency(0) : formatCurrency(response.data[i]["Contrapartida"])
                    data[i].Imposto = data[i]["Imposto"] == "" ? formatCurrency(0) : formatCurrency(data[i]["Imposto"])
                    data[i].PremioSubsequente = data[i]["Prémio Subsequente"] == "" ? formatCurrency(0) : formatCurrency(data[i]["Prémio Subsequente"])
                    data[i].ReceitaBruta = data[i]["Receita Bruta"] == "" ? formatCurrency(0) : formatCurrency(data[i]["Receita Bruta"])
                    data[i].TotalRecibo = data[i]["Total Recibo"] == "" ? formatCurrency(0) : formatCurrency(data[i]["Total Recibo"])
                    data[i].PremioInicial = data[i]["Prémio Inicial"] == "" ? formatCurrency(0) : formatCurrency(data[i]["Prémio Inicial"])

                    // response.data[i].TOTAL = formatCurrency((parseCurrency(response.data[i].Art_48) + parseCurrency(response.data[i].Art_49)))


                }

                setnewdata(data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }



    function getMeioPagamenot(obj) {

        let meiopagamento = meiopagamentos.find(res => res.ID = obj.pagamento[0].meio_pagamento_ID)

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
    const [listProjetos, setListProjetos] = useState([]);

    async function uploadProjetos() {

        try {

            const response = await api.get('/projetos');

            if (response.status == '200') {
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

    const openVerHandler = (idx) => {
        setPROJETO_ID(idx.PROJETO_ID)
        setRUBRICA_ID(idx.RUBRICA_ID)
        // idx.ORCAMENTO_INICIAL = parseCurrency(idx.ORCAMENTO_INICIAL)
        // idx.ORCAMENTO_DISPONIVEL = parseCurrency(idx.ORCAMENTO_DISPONIVEL)
        // idx.ORCAMENTO_CORRIGIDO = parseCurrency(idx.ORCAMENTO_CORRIGIDO)

        setORCAMENTO_INICIAL(idx.ORCAMENTO_INICIAL)
        setORCAMENTO_DISPONIVEL(idx.ORCAMENTO_DISPONIVEL)
        setORCAMENTO_CORRIGIDO(idx.ORCAMENTO_CORRIGIDO)
        setCOMENTARIO(idx.COMENTARIO)
        setitemSelected(idx)
        setVerOpen(true);
        setIsEditarOpen(false);
        setIsEditarRecebimentoOpen(false);

        setIsOpen(false);
    };



    //-----------------------------------------------'





    //-------------- EDITAR -------------------------


    const openEditHandler = (idx) => {

        setPROJETO_ID(idx.PROJETO_ID)
        setRUBRICA_ID(idx.RUBRICA_ID)
        idx.ORCAMENTO_INICIAL = parseCurrency(idx.ORCAMENTO_INICIAL)
        idx.ORCAMENTO_DISPONIVEL = parseCurrency(idx.ORCAMENTO_DISPONIVEL)
        idx.ORCAMENTO_CORRIGIDO = parseCurrency(idx.ORCAMENTO_CORRIGIDO)

        setORCAMENTO_INICIAL(idx.ORCAMENTO_INICIAL)
        setORCAMENTO_DISPONIVEL(idx.ORCAMENTO_DISPONIVEL)
        setORCAMENTO_CORRIGIDO(idx.ORCAMENTO_CORRIGIDO)
        setCOMENTARIO(idx.COMENTARIO)
        setitemSelected(idx)
        setENTIDADE_ID(idx.ENTIDADE_ID)
        setIsEditarOpen(true);
    };





    async function editarItemGO(event) {
        event.preventDefault();
        setIsLoading(true)
        const upload = {
            ANO: ANO,
            VALOR: VALOR,
            ORCAMENTO_INICIAL: ORCAMENTO_INICIAL,
            ORCAMENTO_CORRIGIDO: ORCAMENTO_CORRIGIDO,
            ORCAMENTO_DISPONIVEL: ORCAMENTO_DISPONIVEL,
            COMENTARIO: COMENTARIO,
            PROJETO_ID: PROJETO_ID.value,
            RUBRICA_ID: RUBRICA_ID.value,
            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,
        }

        console.log(upload)


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
    const openPagamento = (orcamento) => {
        popUp_simcancelar(` Confirma o pagamento da Rúbrica  ${orcamento.rubrica[0].DESIGNACAO} ?`, {
            doit: executarPagamento,
            id: orcamento.cabimentacao[0].ID,
        })

        //setESTADO_C(idx.ID)
    };

    const executarPagamento = async (idx) => {

        let resx = false

        try {

            const response = await api.get('/payment/cabimentos/' + idx);

            if (response.status == '200') {

                uploadlist()
                resx = true

            }

        } catch (err) {

            console.error(err.response)

        }

        return resx

    }




    //----------------------------------------------

    // --------------- CABIMENTADO --------------------

    //// CRIAR
    const openCriarCabimentacao = (idx) => {
        setIsCabimentoOpen(true);
        setitemSelected(idx)
        //setESTADO_C(idx.ID)
    };


    async function criarCabimentoGO(event) {
        event.preventDefault();
        setIsLoading(true)
        const currentDateTime = new Date();
        const year = currentDateTime.getFullYear();
        const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');
        const day = String(currentDateTime.getDate()).padStart(2, '0');
        const hour = String(currentDateTime.getHours()).padStart(2, '0');
        const minute = String(currentDateTime.getMinutes()).padStart(2, '0');
        const second = String(currentDateTime.getSeconds()).padStart(2, '0');

        const formattedDateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

        const upload = {

            ORCAMENTO_DISPONIVEL: parseInt(parseCurrency(itemSelected.ORCAMENTO_DISPONIVEL)),
            CABIMENTADO: parseInt(CABIMENTADO),
            CABIMENTADO_PERCENT: parseInt(CABIMENTADO_PERCENT),
            COMENTARIO: itemSelected.COMENTARIO,
            DT_PAGAMENTO: formattedDateTime,
            ORCAMENTO_ID: itemSelected.ID,
            PROJETO_ID: itemSelected.projeto[0].ID,
            RUBRICA_ID: itemSelected.rubrica[0].ID
        }
        console.log(upload)

        try {

            const response = await api.post('/cabimentos', upload);

            if (response.status == '200') {
                uploadlist()
                setIsLoading(false)

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
        setIsLoading(true)
        const upload = {
            ANO: ANO,
            VALOR: VALOR,
            ORCAMENTO_INICIAL: ORCAMENTO_INICIAL,
            ORCAMENTO_CORRIGIDO: ORCAMENTO_CORRIGIDO,
            ORCAMENTO_DISPONIVEL: ORCAMENTO_DISPONIVEL,
            COMENTARIO: COMENTARIO,
            PROJETO_ID: PROJETO_ID.value,
            RUBRICA_ID: RUBRICA_ID.value,
            ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,
        }
        console.log(upload)


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
            uploadRubricas()
            uploadProjetos()

        }

    }, [])





    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isCabimentoOpen, setIsCabimentoOpen] = useState(false);
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
                            <Table listProjetos={listProjetos} columns={columns} data={newdata} modalOpen={openHandler} uploadlist={uploadlist} years={years} />
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
                                            <label className="floating-label" htmlFor="Name">Projeto <span style={{ color: "red" }} >*</span></label>


                                            {/* <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}> */}

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
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Rubricas <span style={{ color: "red" }} >*</span></label>

                                            {/* <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}> */}


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
                                            {/* </span> */}

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Inicial <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setORCAMENTO_INICIAL(event.target.value) }} defaultValue={""} className="form-control" placeholder="Orçamento Inicial..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Corrigido <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setORCAMENTO_CORRIGIDO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Orçamento Corrigido..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Disponível <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setORCAMENTO_DISPONIVEL(event.target.value) }} defaultValue={""} className="form-control" placeholder="Orçamento Disponível..." required />

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


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Projeto <span style={{ color: "red" }} >*</span></label>


                                            {/* <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}> */}

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
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Rubricas <span style={{ color: "red" }} >*</span></label>

                                            {/* <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}> */}


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
                                            {/* </span> */}

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Inicial <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setORCAMENTO_INICIAL(event.target.value) }} defaultValue={itemSelected.ORCAMENTO_INICIAL} className="form-control" placeholder="Orçamento Inicial..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Corrigido <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setORCAMENTO_CORRIGIDO(event.target.value) }} defaultValue={itemSelected.ORCAMENTO_CORRIGIDO} className="form-control" placeholder="Orçamento Corrigido..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Disponível <span style={{ color: "red" }} >*</span></label>

                                            <input type="number" onChange={event => { setORCAMENTO_DISPONIVEL(event.target.value) }} defaultValue={itemSelected.ORCAMENTO_DISPONIVEL} className="form-control" placeholder="Orçamento Disponível..." required />

                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Comentários <span style={{ color: "red" }} >*</span></label>
                                            <textarea defaultValue={itemSelected.COMENTARIO} className="form-control" maxLength="64000" onChange={event => { setCOMENTARIO(event.target.value) }} id="comentarios" rows="3" placeholder='Comentários...' />

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
                        {/*  */}
                        <Modal.Body className="newuserbox" style={activeProfileTab === "mensalidade" ? {} : { display: "none" }} >

                            <form id="editarItem"  >

                                <Row>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Projeto <span style={{ color: "red" }} >*</span></label>


                                            {/* <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}> */}

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
                                            {/* </span> */}

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Ano <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select disabled defaultValue={itemSelected.ANO} onChange={event => { setANO(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">-- Selecione --</option>

                                                    {years.map(e => (

                                                        <option key={e} value={e}>{e}</option>

                                                    ))}

                                                </select>
                                            </span>

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Rubricas <span style={{ color: "red" }} >*</span></label>

                                            {/* <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}> */}


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
                                            {/* </span> */}

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Inicial <span style={{ color: "red" }} >*</span></label>

                                            <input readOnly="readOnly"
                                                type="text" onChange={event => { setORCAMENTO_INICIAL(event.target.value) }} defaultValue={itemSelected.ORCAMENTO_INICIAL} className="form-control" placeholder="Orçamento Inicial..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Corrigido <span style={{ color: "red" }} >*</span></label>

                                            <input
                                                readOnly="readOnly" type="text" onChange={event => { setORCAMENTO_CORRIGIDO(event.target.value) }} defaultValue={itemSelected.ORCAMENTO_CORRIGIDO} className="form-control" placeholder="Orçamento Corrigido..." required />

                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Orçamento Disponível <span style={{ color: "red" }} >*</span></label>

                                            <input readOnly="readOnly" type="text" onChange={event => { setORCAMENTO_DISPONIVEL(event.target.value) }} defaultValue={itemSelected.ORCAMENTO_DISPONIVEL} className="form-control" placeholder="Orçamento Disponível..." required />

                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Comentários <span style={{ color: "red" }} >*</span></label>
                                            <textarea readOnly="readOnly" defaultValue={itemSelected.COMENTARIO} className="form-control" maxLength="64000" onChange={event => { setCOMENTARIO(event.target.value) }} id="comentarios" rows="3" placeholder='Comentários...' />

                                        </div>
                                    </Col>
                                </Row>


                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setVerOpen(false)}>Fechar</Button>
                            {/* {!isLoading ? <Button type="submit" form="editarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>} */}

                        </Modal.Footer>



                    </Modal>


                    {/* --------------------Criar Item Recebimento------------------- */}

                    <Modal size='x' show={isCabimentoOpen} onHide={() => setIsCabimentoOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar</Modal.Title>
                        </Modal.Header>
                        {itemSelected.projeto && itemSelected.rubrica ?

                            <Modal.Body className="newuserbox" >

                                <form id="criarCabimento" onSubmit={criarCabimentoGO} >

                                    <Row>
                                        <Col md={12}>


                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">
                                                    Projeto <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input type="text" readOnly="readOnly" defaultValue={itemSelected?.projeto[0]?.NOME} className="form-control" />

                                            </div>

                                        </Col>

                                        <Col md={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Rubricas">
                                                    Rubricas <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input type="text" readOnly="readOnly" defaultValue={itemSelected?.rubrica
                                                [0]?.DESIGNACAO} className="form-control" />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Rubricas">
                                                    Orçamento Disponível <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input type="text" readOnly="readOnly" defaultValue={itemSelected.ORCAMENTO_DISPONIVEL} className="form-control" />
                                            </div>

                                        </Col>

                                        <Col md={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Rubricas">
                                                    Cabimentado <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input type="number" onChange={event => { setCABIMENTADO(event.target.value) }} defaultValue={""} className="form-control" required placeholder="Cabimentado"
                                                />
                                            </div>



                                        </Col>
                                        <Col md={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Rubricas">
                                                    Cabimentado % <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input type="number" onChange={event => { setCABIMENTADO_PERCENT(event.target.value) }} defaultValue={""} className="form-control" required placeholder="Cabimentado % "
                                                />
                                            </div>



                                        </Col>


                                    </Row>

                                </form>

                            </Modal.Body>
                            : null
                        }

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsCabimentoOpen(false)}>Fechar</Button>

                            {!isLoading ? <Button type="submit" form="criarCabimento" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

                        </Modal.Footer>
                    </Modal>







                </Col>
            </Row >
        </React.Fragment >
    </>
    );












};
export default VisaoGeral;