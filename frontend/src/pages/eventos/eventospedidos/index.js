import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { Link } from 'react-router-dom';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";


import api from '../../../services/api';

import { saveAs } from 'file-saver';

import useAuth from '../../../hooks/useAuth';

import { useHistory, useParams } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle, setParams, formatCurrency } from '../../../functions';

import JoditEditor from "jodit-react";


import Documentos from '../../../components/Custom/Documentos'


function Table({ uploadList, columns, data, modalOpen }) {

    const { user } = useAuth();
    const [DATA_DE, setDATA_DE] = useState("");
    const [DATA_PARA, setDATA_PARA] = useState("");
    const { permissoes } = useAuth();
    const [values, setValues] = useState()
    const params = useParams();
    const [ANO, setANO] = useState("")

    const pageAcess = "/eventos/eventospedidos"
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
            const response = taskEnable(pageAcess, permissoes, "LerapenasEP") ? await api.get(`/export-pdf/sgigjentidadeevento_parecer?ENTIDADE_ID=${params.id}` + setParams([['DATA_INICIO', dataInicio], ["DATA_FIM", dataFim]]), { responseType: "blob" }) : await api.get(`/export-pdf/sgigjentidadeevento?ENTIDADE_ID=${params.id}` + setParams([['DATA_INICIO', dataInicio], ["DATA_FIM", dataFim]]), { responseType: "blob" });
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


    function reloadList() {
        setDATA_DE("")
        setDATA_PARA("")
        uploadList()

    }
    async function exportExel() {
        try {

            const response = taskEnable(pageAcess, permissoes, "LerapenasEP") ? await api.get(`/export-csv/sgigjentidadeevento_parecer`, { responseType: "blob" }) : await api.get(`/export-csv/sgigjentidadeevento`, { responseType: "blob" });

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
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th className={column.id === 'VALOR_PREMIO'

                                    ? 'text-right' : ''} {...column.getHeaderProps(column.getSortByToggleProps())}>
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
            <div style={{ display: "flex", gridColumnGap: "40px", margin: "4px 0px", flexWrap: "wrap" }} >

                <span style={{ color: "grey" }} >Pedido registado</span>
                <span style={{ color: "#FFD801" }} >Pedido atribuído</span>
                <span style={{ color: "blue" }} >Pedido re-atribuído</span>
                <span style={{ color: "orange" }} >Pedido aceite</span>
                <span style={{ color: "green" }} >Pedido com parecer</span>

            </div>
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



const EventosPedidos = () => {
    const params = useParams();


    const editorREFParecer = useRef(null)
    const editorREFDesicao = useRef(null)



    const { permissoes } = useAuth();

    const history = useHistory();


    const pageAcess = "/eventos/eventospedidos"
    const [tipoDataEventoId, setTipoDataEventoId] = useState("")
    const [tipoDataEvento, setTipoDataEvento] = useState([
        {
            id: "MENSAL",
            value: "Mensal",
        },
        {
            id: "ANUAL",
            value: "Anual",
        },
        {
            id: "FIXO",
            value: "Fixo",
        },
        {
            id: "INTERVALO",
            value: "Intervalo",
        },
        {
            id: "SEMANAL",
            value: "Semanal",
        },
    ]);
    const [diaSemana, setDiaSemana] = useState([
        {
            id: "Segunda-Feira",
            value: "Segunda-Feira",
        },
        {
            id: "Terça-Feira",
            value: "Terça-Feira",
        },
        {
            id: "Quarta-Feira",
            value: "Quarta-Feira",
        },
        {
            id: "Quinta-Feira",
            value: "Quinta-Feira",
        },
        {
            id: "Sexta-Feira",
            value: "Sexta-Feira",
        },
        {
            id: "Sabado",
            value: "Sabado",
        }, {
            id: "Domingo",
            value: "Domingo",
        },
    ]);
    const [listMes, setListMes] = useState([
        {
            id: "JAN",
            value: "Janeiro",
        },
        {
            id: "Fev",
            value: "Fevereiro",
        },
        {
            id: "MARC",
            value: "Março",
        },
        {
            id: "ABR",
            value: "Abril",
        },
        {
            id: "MAI",
            value: "Maio",
        },
        {
            id: "JUN",
            value: "Junho",
        }, {
            id: "JUL",
            value: "Julho",
        },
        {
            id: "AGO",
            value: "Agosto",
        }, {
            id: "SET",
            value: "Setembro",
        }, {
            id: "OUT",
            value: "Outubro",
        }, {
            id: "NOV",
            value: "Novembro",
        }, {
            id: "DEZ",
            value: "Dezembro",
        },
    ]);
    const [numeroDias, setNumeroDias] = useState([])
    const [mes, setMes] = useState("")
    const [diasId, setDiasId] = useState()
    const [mesId, setMesId] = useState("")

    var [novosdocumentos, setnovosdocumentos] = useState([
        {
            id: "" + Math.random(),
            NUMERO: 1,
            VALOR: null
        },
    ]);
    const dayOptions = [];
    for (let day = 1; day <= 31; day++) {
        dayOptions.push(
            <option key={day} value={day}>
                {day}
            </option>
        );
    }

    useEffect(() => {
        if (pageEnable(pageAcess, permissoes) == false) history.push('/')
        else {

            uploadlist()
            uploadeventoprlist()
            uploaddecisaolist()
            uploadparecerlist()
            uploadentidadelist()
            uploadcolaboradoreslist()
            uploaddocumentolist()

        }

    }, [])



    const { popUp_removerItem, popUp_alertaOK, popUp_simcancelar, user } = useAuth();



    const columns = React.useMemo(
        () => [

            {
                Header: 'EST',
                accessor: 'COLOR_STATUS',
                centered: false
            },

            {
                Header: 'ENTIDADES',
                accessor: 'ENTIDADES',
                centered: true
            },

            {
                Header: 'DESIGNAÇÃO',
                accessor: 'DESIG',
                centered: true
            },
            {
                Header: 'Nº SORTEIO',
                accessor: 'NUM_SORTEIO_NOITE',
                centered: false
            },
            {
                Header: 'PESSOA RESPONSÁVEL',
                accessor: 'PESSOA',
                centered: true
            },
            {
                Header: 'TIPO DE EVENTO',
                accessor: 'TIPO',
                centered: true
            },
            {
                Header: 'PRÊMIO',
                accessor: 'PREMIO_FORMATTED',
                centered: true,
                Cell: ({ row }) => (
                    <div dangerouslySetInnerHTML={{ __html: row.original.PREMIO_FORMATTED }}></div>
                ),
            },
            {
                Header: 'TIPO DE DATA DE EVENTO',
                accessor: 'data.TIPO',
                centered: true
            },
            // {
            //     Header: 'DATA INÍCIO',
            //     accessor: 'INICIO',
            //     centered: true
            // },
            // {
            //     Header: 'DATA FIM',
            //     accessor: 'FIM',
            //     centered: true
            // },

            {
                Header: 'Ações',
                accessor: 'action',
                centered: true
            },
        ],
        []
    );


    const [eventoprlist, seteventoprlist] = useState([]);

    async function uploadeventoprlist() {

        try {

            const response = await api.get('/sgigjpreventotp');

            if (response.status == '200') {

                seteventoprlist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    const [decisaolist, setdecisaolist] = useState([]);

    async function uploaddecisaolist() {

        try {

            const response = await api.get('/sgigjprdecisaotp');

            if (response.status == '200') {

                setdecisaolist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }

    const [parecerlist, setparecerlist] = useState([]);

    async function uploadparecerlist() {

        try {

            const response = await api.get('/parecerparametrizacao');

            if (response.status == '200') {

                setparecerlist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

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


    const [colaboradoreslist, setcolaboradoreslist] = useState([]);

    async function uploadcolaboradoreslist() {

        try {

            const response = await api.get('/sgigjrelpessoaentidade');

            if (response.status == '200') {

                setcolaboradoreslist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }

    const [documentolist, setdocumentolist] = useState([]);

    async function uploaddocumentolist() {

        try {

            const response = await api.get('/sgigjprdocumentotp');

            if (response.status == '200') {

                setdocumentolist(response.data)

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

    function createDate2(data) {

        if (data == null) return ""


        return new Date(data).toISOString().slice(0, 10)



    }
    //-------------------- documento
    const [docedit, setdocedit] = useState(false);

    var [novosdocumentos, setnovosdocumentos] = useState([
        {
            id: "" + Math.random(),
            NUMERO: 1,
            VALOR: null
        },
    ]);

    function addnovosdocumentos() {
        setnovosdocumentos(
            novosdocumentos.concat([
                {
                    id: "" + Math.random(),
                    NUMERO: null,
                    VALOR: null
                },
            ])
        );
    }
    function criardocnum(docnum, id) {
        const indexx = novosdocumentos.findIndex((x) => x.id === id);

        novosdocumentos[indexx] = {
            id: id,
            numero: indexx + 1,
            VALOR: docnum,

        };

        setdocedit(true);

        setnovosdocumentos(novosdocumentos.concat([]));
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



    const [documentosgeral_lista, setdocumentosgeral_lista] = useState([]);
    const [documentosgeral_lista_save, setdocumentosgeral_lista_save] = useState(false);

    const [documentosParecer_lista, setdocumentosParecer_lista] = useState([]);
    const [documentosParecer_lista_save, setdocumentosParecer_lista_save] = useState(false);



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    async function uploadlist(ano) {
        ano = ano === "" ? undefined : ano
        if (taskEnable(pageAcess, permissoes, "Ler")) {

            try {
                var response

                if (taskEnable(pageAcess, permissoes, "LerapenasEP")) {
                    response = await api.get(`/sgigjentidadeevento_parecer?ENTIDADE_ID=${params.id}` + setParams([["ANO", ano]]));
                }
                else {
                    // response = await api.get(`/sgigjentidadeevento?ENTIDADE_ID=${params.id}${dataInicio !== undefined || dataInicio != null ? "&date-start=" + dataInicio : ""}${dataFim === undefined || dataFim === "" ? "" : "&date-end=" + dataFim}`);
                    response = await api.get(`/sgigjentidadeevento?ENTIDADE_ID=${params.id}` + setParams([["ANO", ano]]));


                }
                // if (taskEnable(pageAcess, permissoes, "LerapenasEP")) response = await api.get(`/sgigjentidadeevento_parecer?ENTIDADE_ID=${params.id}`);
                // else response = await api.get(`/sgigjentidadeevento?ENTIDADE_ID=${params.id}`);

                if (response.status == '200') {

                    for (var i = 0; i < response.data.length; i++) {

                        const idx = response.data[i].ID


                        response.data[i].id = response.data[i].ID


                        response.data[i].ENTIDADES = response.data[i].sgigjentidade.DESIG
                        response.data[i].PESSOA = response.data[i].sgigjrelpessoaentidade.sgigjpessoa.NOME
                        response.data[i].TIPO = response.data[i].sgigjpreventotp.DESIG
                        response.data[i].VALOR_PREMIO = formatCurrency(response.data[i].PREMIO)

                        response.data[i].INICIO = createDate1(response.data[i].DT_INICIO)
                        response.data[i].FIM = createDate1(response.data[i].DT_FIM)
                        const formattedArray = response.data[i].premios?.map(item => `${item.NUMERO} º Prêmio: ${formatCurrency(item.VALOR)}`);

                        const sortedFormattedArray = formattedArray.sort((a, b) => {
                            // Extract the NUMERO from each string
                            const numeroA = parseInt(a.match(/\d+/)[0]);
                            const numeroB = parseInt(b.match(/\d+/)[0]);

                            // Compare the NUMERO values
                            return numeroA - numeroB;
                        });

                        // Join the sorted formatted strings into a single string
                        const resultString = sortedFormattedArray.join('<br>');
                        response.data[i].PREMIO_FORMATTED = resultString;



                        const itemx = response.data[i]

                        response.data[i].action =
                            <React.Fragment>


                                {taskEnable(pageAcess, permissoes, "Ler") == false ? null :
                                    <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Ler")} onClick={() => openVerHandler(idx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Ler")} /></Link>
                                }

                                {taskEnable(pageAcess, permissoes, "Editar") == false ? null :
                                    <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Editar")} onClick={() => openEditHandler(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Editar")} /></Link>
                                }


                                {
                                    response.data[i].sgigjreleventodespacho.length > 0 ? <>
                                        {taskEnable(pageAcess, permissoes, "Inspectorparecer") == false ? null :
                                            <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Inspectorparecer")} onClick={() => openverparecer(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Inspectorparecer")} /></Link>
                                        }
                                        {
                                            response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length > 0 ?
                                                <>

                                                    {response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer[response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].STATUS == "atribuido" && taskEnable(pageAcess, permissoes, "Aceitar") == true && response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer[response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].REL_PESSOA_ENTIDADE_ID == user.REL_PESSOA_ENTIDADE_ID ?
                                                        <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Aceitar")} onClick={() => openaceitarparecer(itemx)} className="text-primary mx-1 "><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Aceitar")} /></Link>
                                                        : null}


                                                    {response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer[response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].STATUS == "aceite" && taskEnable(pageAcess, permissoes, "Parecer") == true && response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer[response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].REL_PESSOA_ENTIDADE_ID == user.REL_PESSOA_ENTIDADE_ID ?
                                                        <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Parecer")} onClick={() => openparecer(itemx)} className="text-primary mx-1 "><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Parecer")} /></Link>
                                                        : null}




                                                    {response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer[response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].STATUS == "finalzado" && taskEnable(pageAcess, permissoes, "Decisao") == false ? null :
                                                        <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Decisao")} onClick={() => openDecisao(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Decisao")} /></Link>
                                                    }

                                                </>


                                                : null
                                        }
                                    </>
                                        :
                                        <>
                                            {taskEnable(pageAcess, permissoes, "Atriubuirparecer") == false ? null :
                                                <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Atriubuirparecer")} onClick={() => openeventopedidoparecer(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Atriubuirparecer")} /></Link>
                                            }
                                        </>

                                }





                                {taskEnable(pageAcess, permissoes, "Eliminar") == false ? null :
                                    <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Eliminar")} onClick={() => removeItem(idx)} className="text-danger"><i className={"" + taskEnableIcon(pageAcess, permissoes, "Eliminar")} /></Link>
                                }



                            </React.Fragment>


                        let colorx = "grey"



                        if (response.data[i].sgigjreleventodespacho.length > 0) {

                            if (response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length == 1) {

                                if (response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer[response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].STATUS == "atribuido") {

                                    colorx = "#FFD801"

                                }

                                if (response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer[response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].STATUS == "aceite") {

                                    colorx = "orange"

                                }

                                if (response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer[response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].STATUS == "finalizado") {

                                    colorx = "green"

                                }

                            }

                            if (response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length > 1) {


                                if (response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer[response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].STATUS == "atribuido") {

                                    colorx = "blue"

                                }

                                if (response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer[response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].STATUS == "aceite") {

                                    colorx = "orange"

                                }

                                if (response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer[response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].STATUS == "finalizado") {

                                    colorx = "green"

                                }

                            }

                        }


                        response.data[i].COLOR_STATUS = <div style={{ backgroundColor: colorx, width: "20px", height: "20px", borderRadius: "50%" }} />




                        //-------------------------------------

                        if (response.data[i].sgigjreleventodespacho.length > 0) {

                            if (response.data[i].sgigjreleventodespacho[0].STATUS != null) response.data[i] = null


                        }




                    }


                    var filtered = response.data.filter(function (el) {
                        return el != null;
                    });


                    setnewdata(filtered)



                }

            } catch (err) {

                console.error(err.response)


            }
        }

    }


    //-------------------------------------------






    const [isOpen, setIsOpen] = useState(false);

    const [isdecisaoopen, setisdecisaoopen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);

    const [ENTIDADE_ID, setENTIDADE_ID] = useState("");
    const [PR_EVENTO_TP_ID, setPR_EVENTO_TP_ID] = useState("");
    const [TIPO_DATA_EVENTO, setTIPO_DATA_EVENTO] = useState("");

    const [REL_PESSOA_ENTIDADE_RESPONSAVEL_ID, setREL_PESSOA_ENTIDADE_RESPONSAVEL_ID] = useState("");
    const [CODIGO, setCODIGO] = useState("");
    const [DESIG, setDESIG] = useState("");
    const [DESCR, setDESCR] = useState("");
    const [PREMIO, setPREMIO] = useState("");
    const [NUM_SORTEIO_NOITE, setNUM_SORTEIO_NOITE] = useState("");
    const [DT_INICIO, setDT_INICIO] = useState("");
    const [DT_FIM, setDT_FIM] = useState("");





    const [ENTIDADE_EVENTO_ID_D, setENTIDADE_EVENTO_ID_D] = useState("");
    const [PR_DECISAO_TP_ID_D, setPR_DECISAO_TP_ID_D] = useState("");
    const [DATA_D, setDATA_D] = useState("");
    const [OBS_D, setOBS_D] = useState("");

    //-------------- CRIAR DECISAO -------------------------

    const [decisao_a_data, setdecisao_a_data] = useState("")
    const [decisao_a_decisao, setdecisao_a_decisao] = useState("")
    const [decisao_a_id, setdecisao_a_id] = useState("")
    const [decisao_a_referencia, setdecisao_a_referencia] = useState("")
    const [decisao_a_despacho, setdecisao_a_despacho] = useState("")

    var parecerEdit = ""

    const openDecisao = (itemx) => {


        var decisao_a_data_temp = ""
        var decisao_a_decisao_temp = ""
        var decisao_a_id_temp = ""

        parecerEdit = `<p style="margin: 0; line-height: 1.6; font-size: 12pt; font-family: 'Times New Roman', serif; text-align: justify;">Escreva um texto aqui</p>`

        if (itemx.sgigjreleventodespacho.length > 0) {

            decisao_a_id_temp = itemx.sgigjreleventodespacho[0].ID

            if (itemx.sgigjreleventodespacho[0].sgigjreleventoparecer.length > 0) {

                decisao_a_decisao_temp = itemx.sgigjreleventodespacho[0].sgigjreleventoparecer[itemx.sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].PR_DECISAO_TP_ID
                decisao_a_data_temp = createDate2(itemx.sgigjreleventodespacho[0].sgigjreleventoparecer[itemx.sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].DATA)

            }
        }

        //console.log(itemx.sgigjreleventodespacho[0].REFERENCIA)


        if (itemx.sgigjreleventodespacho[0].PR_DECISAO_TP_ID == null) setdecisao_a_decisao(decisao_a_decisao_temp)
        else setdecisao_a_decisao(itemx.sgigjreleventodespacho[0].PR_DECISAO_TP_ID)


        if (itemx.sgigjreleventodespacho[0].DATA == null) setdecisao_a_data(decisao_a_data_temp)
        else setdecisao_a_data(createDate2(itemx.sgigjreleventodespacho[0].DATA))


        setdecisao_a_referencia(itemx.sgigjreleventodespacho[0].REFERENCIA)
        setdecisao_a_id(decisao_a_id_temp)




        //console.log(parecerEdit)

        if (itemx.sgigjreleventodespacho[0].DESPACHO != null) parecerEdit = itemx.sgigjreleventodespacho[0].DESPACHO
        seteditorcontent(parecerEdit)


        setparecer_a_parecer(parecerEdit)



        setisdecisaoopen(true);
        setIsOpen(false);
        setIsEditarOpen(false);
        setVerOpen(false);


    }



    async function criarDecisaoGO() {



        const upload = {

            DATA: decisao_a_data,
            PR_DECISAO_TP_ID: decisao_a_decisao,
            REFERENCIA: decisao_a_referencia,
            DESPACHO: editorREFDesicao?.current?.value,
            STATUS: "atualizar",


        }


        //console.log(upload)


        try {

            const response = await api.put('/sgigjreleventodespacho/' + decisao_a_id, upload);

            if (response.status == '200') {

                uploadlist()

                setisdecisaoopen(false);
                setIsOpen(false);
                setIsEditarOpen(false);
                setVerOpen(false);

            }

        } catch (err) {

            console.error(err.response)

        }


    }




    async function finalizarDecisaoGO(event) {


        event.preventDefault();


        const upload = {

            DATA: decisao_a_data,
            PR_DECISAO_TP_ID: decisao_a_decisao,
            REFERENCIA: decisao_a_referencia,
            DESPACHO: editorREFDesicao?.current?.value,
            STATUS: "atualizar",


        }


        //console.log(upload)


        try {

            const response = await api.put('/sgigjreleventodespacho/' + decisao_a_id, upload);

            if (response.status == '200') {

                const upload22 = {

                    STATUS: "finalizado",
                }

                const response2 = await api.put('/sgigjreleventodespacho/' + decisao_a_id, upload22);

                if (response2.status == '200') {

                    uploadlist()

                    setisdecisaoopen(false);
                    setIsOpen(false);
                    setIsEditarOpen(false);
                    setVerOpen(false);

                }


            }

        } catch (err) {

            if (err.response.data.code == "33343345") popUp_alertaOK("O tempo limite desse evento já foi ultrapassado")


        }


    }



    //-------------- CRIAR -------------------------


    const [ID_C, setID_C] = useState("");

    const openHandler = () => {


        setENTIDADE_ID("");
        setPR_EVENTO_TP_ID("");
        setREL_PESSOA_ENTIDADE_RESPONSAVEL_ID("");
        setCODIGO("");
        setDESIG("");
        setDESCR("");
        setPREMIO("");
        setNUM_SORTEIO_NOITE("");
        setDT_INICIO("");
        setDT_FIM("");

        setdocumentosgeral_lista([])

        setisdecisaoopen(false);
        setIsOpen(true);
        setIsEditarOpen(false);
        setVerOpen(false);

        setID_C("")

    }

    async function criarItemGO(event) {
        let data

        event.preventDefault();
        const isAnyValueEmpty = novosdocumentos.some(res => res.VALOR == null)
        if (isAnyValueEmpty) {
            return popUp_alertaOK("Prenche os campos do valor do premio");

        }
        let premios = novosdocumentos.map((eq, index) => {
            return {
                NUMERO: index + 1,
                VALOR: eq.VALOR
            }
        })
        if (tipoDataEventoId == "ANUAL") {
            const dataIncio = numeroDias + "/" + mes
            data = {
                TIPO: tipoDataEventoId,
                DT_INICIO: dataIncio
            }
        } else if (tipoDataEventoId == "INTERVALO") {
            data = {
                TIPO: tipoDataEventoId,
                DT_INICIO: DT_INICIO,
                DT_FIM: DT_FIM
            }
        } else {
            data = {
                TIPO: tipoDataEventoId,
                DT_INICIO: DT_INICIO,
            }
        }



        setIsLoading(true)
        const upload = {

            ENTIDADE_ID: params.id,
            PR_EVENTO_TP_ID: PR_EVENTO_TP_ID,
            REL_PESSOA_ENTIDADE_RESPONSAVEL_ID: REL_PESSOA_ENTIDADE_RESPONSAVEL_ID,
            DESIG: DESIG,
            DESCR: DESCR,
            premios: premios,
            NUM_SORTEIO_NOITE: NUM_SORTEIO_NOITE,
            DT_INICIO: DT_INICIO,
            data: data

        }

        //console.log(upload)


        try {

            const response = await api.post('/sgigjentidadeevento', upload);

            if (response.status == '200') {


                setID_C(response.data.ID)

                setdocumentosgeral_lista_save(!documentosgeral_lista_save)

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








    //-------------- EDITAR -------------------------

    const [itemSelected, setitemSelected] = useState({});
    const [previewSelected, setPreviewSelected] = useState(null);




    const openEditHandler = async (idx) => {

        setTipoDataEventoId(idx.data.TIPO)
        setDT_INICIO(idx.data.DT_INICIO)

        if (idx.data.TIPO == "ANUAL") {
            const parts = idx.data.DT_INICIO.split('/');
            const [day, month] = parts
            setDiasId(day)
            setMesId(month)
        }
        if (idx.data.TIPO == "INTERVALO") {
            setDT_INICIO(createDate2(idx.data.DT_INICIO));
            setDT_FIM(createDate2(idx.data.DT_FIM));

        }
        if (idx.data.TIPO == "FIXO") {
            setDT_INICIO(createDate2(idx.data.DT_INICIO));
        }
        let premios = idx.premios.map(res => {
            return {
                id: "" + Math.random(),
                NUMERO: parseInt(res.NUMERO),
                VALOR: res.VALOR
            }
        })
        setitemSelected(idx)

        console.log(premios)
        setnovosdocumentos(premios)

        setENTIDADE_ID(idx.ENTIDADE_ID);
        setPR_EVENTO_TP_ID(idx.PR_EVENTO_TP_ID);
        setREL_PESSOA_ENTIDADE_RESPONSAVEL_ID(idx.REL_PESSOA_ENTIDADE_RESPONSAVEL_ID);
        setCODIGO(idx.CODIGO);
        setDESIG(idx.DESIG);
        setDESCR(idx.DESCR);
        setPREMIO(idx.PREMIO);
        setNUM_SORTEIO_NOITE(idx.NUM_SORTEIO_NOITE);




        try {

            const response3 = await api.get('/sgigjreldocumento?ENTIDADE_EVENTO_ID=' + idx.ID);


            if (response3.status == '200') {


                setdocumentosgeral_lista(response3.data)

            }


        } catch (err) {

            console.error(err.response3)

        }







        setisdecisaoopen(false);
        setIsOpen(false);
        setIsEditarOpen(true);
        setVerOpen(false);




    }






    async function editarItemGO(event) {

        let data

        event.preventDefault();
        const isAnyValueEmpty = novosdocumentos.some(res => res.VALOR == null)
        if (isAnyValueEmpty) {
            return popUp_alertaOK("Prenche os campos do valor do premio");

        }
        let premios = novosdocumentos.map((eq, index) => {
            return {
                NUMERO: index + 1,
                VALOR: eq.VALOR
            }
        })
        if (tipoDataEventoId == "ANUAL") {
            const dataIncio = diasId + "/" + mesId
            data = {
                TIPO: tipoDataEventoId,
                DT_INICIO: dataIncio
            }
        } else if (tipoDataEventoId == "INTERVALO") {
            data = {
                TIPO: tipoDataEventoId,
                DT_INICIO: DT_INICIO,
                DT_FIM: DT_FIM
            }
        } else {
            data = {
                TIPO: tipoDataEventoId,
                DT_INICIO: DT_INICIO,
            }
        }
        const upload = {
            ENTIDADE_ID: params.id,
            PR_EVENTO_TP_ID: PR_EVENTO_TP_ID,
            REL_PESSOA_ENTIDADE_RESPONSAVEL_ID: REL_PESSOA_ENTIDADE_RESPONSAVEL_ID,
            DESIG: DESIG,
            DESCR: DESCR,
            PREMIO: PREMIO,
            NUM_SORTEIO_NOITE: NUM_SORTEIO_NOITE,
            DT_INICIO: DT_INICIO,
            DT_FIM: DT_FIM,
            data: data,
            premios: premios
        }

        //console.log(upload)


        try {

            const response = await api.put('/sgigjentidadeevento/' + itemSelected.ID, upload);

            if (response.status == '200') {


                setdocumentosgeral_lista_save(!documentosgeral_lista_save)



                uploadlist()
                setIsEditarOpen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }





    //----------------------------------------------









    //-------------------------------------------------------






    const [imgprev, setimgprev] = useState("");
    const [isVerOpen, setVerOpen] = useState(false);




    //-------------- LER -------------------------


    const [itemlist, setitemlist] = useState({});


    const openVerHandler = async (idx) => {

        let response

        try {
            if (taskEnable(pageAcess, permissoes, "LerapenasEP")) {
                response = await api.get('/sgigjentidadeevento_parecer/' + idx);

            } else {
                response = await api.get('/sgigjentidadeevento/' + idx);

            }


            //console.log(response)

            if (response.status == '200') {

                if (response.data.length > 0) {

                    const formattedArray = response.data[0].premios?.map(item => `${item.NUMERO} º Prêmio: ${formatCurrency(item.VALOR)}`);

                    const sortedFormattedArray = formattedArray.sort((a, b) => {
                        // Extract the NUMERO from each string
                        const numeroA = parseInt(a.match(/\d+/)[0]);
                        const numeroB = parseInt(b.match(/\d+/)[0]);

                        // Compare the NUMERO values
                        return numeroA - numeroB;
                    });

                    // Join the sorted formatted strings into a single string
                    const resultString = sortedFormattedArray.join('<br>');
                    response.data[0].PREMIO_FORMATTED = resultString;


                    for (let ix = 0; ix < response.data[0].sgigjentidade.sgigjrelcontacto.length; ix++) {


                        if (typeof response.data[0].sgigjentidade.sgigjrelcontacto[ix].sgigjprcontactotp.DESIG != "undefined") {



                            if (response.data[0].sgigjentidade.sgigjrelcontacto[ix].sgigjprcontactotp.DESIG == "Email") {


                                response.data[0].EMAIL = response.data[0].sgigjentidade.sgigjrelcontacto[ix].CONTACTO

                            }

                            if (response.data[0].sgigjentidade.sgigjrelcontacto[ix].sgigjprcontactotp.DESIG == "Telemóvel") {

                                response.data[0].TELEMOVEL = response.data[0].sgigjentidade.sgigjrelcontacto[ix].CONTACTO



                            }


                            if (response.data[0].sgigjentidade.sgigjrelcontacto[ix].sgigjprcontactotp.DESIG == "Telefone") {

                                response.data[0].TELEFONE = response.data[0].sgigjentidade.sgigjrelcontacto[ix].CONTACTO

                            }

                        }

                    }




                    let parecerolist = false

                    if (response.data[0].sgigjreleventodespacho.length > 0) {


                        if (response.data[0].sgigjreleventodespacho[0].sgigjreleventoparecer.length > 0) {

                            parecerolist = true

                        }



                    }


                    response.data[0].parecerolist = parecerolist




                    let doclist = []
                    if (response.data[0].sgigjreldocumento && response.data[0].sgigjreldocumento.length > 0) {
                        for (let ix = 0; ix < response.data[0].sgigjreldocumento.length; ix++) {

                            doclist.push({
                                id: response.data[0].sgigjreldocumento[ix].ID,
                                nome: response.data[0].sgigjreldocumento[ix].sgigjprdocumentotp.DESIG,
                                url: response.data[0].sgigjreldocumento[ix].DOC_URL,

                            })

                        }

                    }

                    response.data[0].doclist = doclist
                    console.log(response.data[0])
                    setitemlist(response.data[0])
                    setVerOpen(true);
                    setisdecisaoopen(false);
                    setIsOpen(false);
                    setIsEditarOpen(false);

                }


            }

        } catch (err) {

            console.error(err)

        }



    };
    function selectedImg(preview) {
        if (preview != undefined) {
            setimgprev(preview?.url)
            setPreviewSelected(preview)
        }

    }





    //-----------------------------------------------






    //-------------- Remover -------------------------




    const removeItemFunction = async (idx) => {

        let res = true

        try {

            const response = await api.delete('/sgigjentidadeevento/' + idx);


        } catch (err) {

            res = false
            //console.error(err.response)
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

    const removeItemFileFunction = async (idx) => {

        let res = true;

        try {
            const response = await api.delete("/sgigjreldocumento/" + idx);
            setVerOpen(false)
            uploadlist();

        } catch (err) {
            res = false;
            console.error(err.response);
            popUp_alertaOK("Falha. Tente mais tarde");
        }
        localStorage.setItem("showAlert", false)

        return res;
    };

    const removeItemFile = async (idx) => {
        popUp_removerItem({
            delete: removeItemFileFunction,
            id: idx,
        });
    };

    //-----------------------------------------------






    const [isparecer, setisparecer] = useState(false)
    const [parecer_a_data, setparecer_a_data] = useState("")
    const [parecer_a_decisao, setparecer_a_decisao] = useState("")
    const [parecer_a_parecer, setparecer_a_parecer] = useState("")
    const [parecer_a_id, setparecer_a_id] = useState("")


    async function openparecer(itemx) {

        setitemSelected(itemx)



        var parecer_DECISAO_temp = ""
        var parecer_DATA_temp = ""
        var parecer_ID_temp = ""
        var parecer_a_parecer_temp = ""

        parecerEdit = `<p style="margin: 0; line-height: 1.6; font-size: 12pt; font-family: 'Times New Roman', serif; text-align: justify;">Escreva um texto aqui</p>`

        if (itemx.sgigjreleventodespacho.length > 0) {
            if (itemx.sgigjreleventodespacho[0].sgigjreleventoparecer.length > 0) {

                parecer_ID_temp = itemx.sgigjreleventodespacho[0].sgigjreleventoparecer[itemx.sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].ID
                parecer_a_parecer_temp = itemx.sgigjreleventodespacho[0].sgigjreleventoparecer[itemx.sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].PARECER

                parecer_DECISAO_temp = itemx.sgigjreleventodespacho[0].sgigjreleventoparecer[itemx.sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].PR_DECISAO_TP_ID
                parecer_DATA_temp = createDate2(itemx.sgigjreleventodespacho[0].sgigjreleventoparecer[itemx.sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].DATA)

                if (itemx.sgigjreleventodespacho[0].sgigjreleventoparecer[itemx.sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].PARECER != null) parecerEdit = itemx.sgigjreleventodespacho[0].sgigjreleventoparecer[itemx.sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].PARECER

            }
        }



        try {

            const response3 = await api.get('/sgigjreldocumento?REL_EVENTO_PARECER_ID=' + parecer_ID_temp);


            if (response3.status == '200') {


                setdocumentosParecer_lista(response3.data)

            }


        } catch (err) {

            console.error(err.response3)

        }







        setparecer_a_data(parecer_DATA_temp)
        setparecer_a_decisao(parecer_DECISAO_temp)

        //parecerEdit=parecer_a_parecer_temp
        seteditorcontent(parecerEdit)

        setparecer_a_id(parecer_ID_temp)
        setisparecer(true)


    }




    async function atualizarparecer() {

        //console.log(editorREFParecer)
        //console.log(setRef)

        const upload = {

            DATA: parecer_a_data,
            // PR_PARECER_TP_ID: parecer_a_decisao,
            STATUS: "atualizar",
            PARECER: editorREFParecer?.current?.value,


        }

        //console.log(upload)


        try {

            const response = await api.put('/sgigjreleventoparecer/0?entidadeevento_id=' + itemSelected.ID, upload);

            if (response.status == '200') {

                setdocumentosParecer_lista_save(!documentosParecer_lista_save)
                uploadlist()
                setisparecer(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }


    async function concluirevento(event) {

        event.preventDefault();


        const upload = {

            DATA: parecer_a_data,
            // PR_PARECER_TP_ID: parecer_a_decisao,
            STATUS: "atualizar",
            PARECER: editorREFParecer?.current?.value,


        }

        //console.log(upload)


        try {

            const response = await api.put('/sgigjreleventoparecer/0?entidadeevento_id=' + itemSelected.ID, upload);

            if (response.status == '200') {


                const upload2 = {

                    STATUS: "finalizado",

                }

                //console.log(upload)


                try {

                    const response2 = await api.put('/sgigjreleventoparecer/0?entidadeevento_id=' + itemSelected.ID, upload2);

                    if (response2.status == '200') {


                        uploadlist()
                        setisparecer(false)


                    }

                } catch (err2) {

                    console.error(err2.response)

                }





            }

        } catch (err) {

            console.error(err.response)

        }

    }







    const [iseventopedidoparecer, setiseventopedidoparecer] = useState(false)
    const [parecer_REL_PESSOA_ENTIDADE_ID, setparecer_REL_PESSOA_ENTIDADE_ID] = useState("")
    const [parecer_OBS, setparecer_OBS] = useState("")
    const [parecer_ID, setparecer_ID] = useState("")


    function openeventopedidoparecer(item) {

        setparecer_ID(item)
        setparecer_REL_PESSOA_ENTIDADE_ID("")
        setparecer_OBS("")
        setiseventopedidoparecer(true)




    }



    async function criarparecer(event) {

        event.preventDefault();


        const upload = {

            REL_PESSOA_ENTIDADE_ID: parecer_REL_PESSOA_ENTIDADE_ID,
            ENTIDADE_EVENTO_ID: parecer_ID.ID,
            OBS: parecer_OBS,


        }

        //console.log(upload)


        try {

            const response = await api.post('/sgigjreleventoparecer', upload);

            if (response.status == '200') {

                setdocumentosParecer_lista_save(!documentosParecer_lista_save)


                uploadlist()
                setiseventopedidoparecer(false)
                setisverparecer(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }




    const [isverparecer, setisverparecer] = useState(false)
    const [parecerinspector, setparecerinspector] = useState("")
    const [parecerobs, setparecerobs] = useState("")
    const [parecer_novoparecer, setparecer_novoparecer] = useState(false)
    const [itemparecer, setitemparecer] = useState({})

    function openverparecer(item) {

        setitemparecer(item)


        var obs_parecer = ""
        var inspector_parecer = ""
        var novoparecer = false

        if (item.sgigjreleventodespacho.length > 0) {
            if (item.sgigjreleventodespacho[0].sgigjreleventoparecer.length > 0) {

                obs_parecer = item.sgigjreleventodespacho[0].sgigjreleventoparecer[item.sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].OBS
                inspector_parecer = item.sgigjreleventodespacho[0].sgigjreleventoparecer[item.sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].sgigjrelpessoaentidade.sgigjpessoa.NOME
                if (item.sgigjreleventodespacho[0].sgigjreleventoparecer[item.sgigjreleventodespacho[0].sgigjreleventoparecer.length - 1].STATUS == "finalizado") novoparecer = true

            }
        }

        setparecerobs(obs_parecer)
        setparecerinspector(inspector_parecer)
        setparecer_novoparecer(novoparecer)



        setisverparecer(true)


    }




    const [iscriartipoeventoopen, setiscriartipoeventoopen] = useState(false)

    const [DESIG_TE, setDESIG_TE] = useState("");
    const [OBS_TE, setOBS_TE] = useState("");

    function opencriartipoeventoopen() {

        setiscriartipoeventoopen(true)
        setDESIG_TE("")
        setOBS_TE("")


    }

    async function criartipoevento(event) {

        event.preventDefault();


        const upload = {

            DESIG: DESIG_TE,
            OBS: OBS_TE,


        }

        //console.log(upload)


        try {

            const response = await api.post('/sgigjpreventotp', upload);

            if (response.status == '200') {

                uploadeventoprlist()
                setiscriartipoeventoopen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }






    const [activeProfileTab, setActiveProfileTab] = useState('eventos');

    const profileTabClass = 'nav-link text-reset';
    const profileTabActiveClass = 'nav-link text-reset active';







    const [verlistgp, setverlistgp] = useState("eventos");



    const [isEDITORopen, setisEDITORopen] = useState(false);


    const [editorcontent, seteditorcontent] = useState("");

    const updateContent = (value) => {
        //seteditorcontent(value);
        parecerEdit = value

    };

    const setRef = jodit => {
        // control
    };

    const savedataeditor = () => {


        setparecer_a_parecer(parecerEdit)
        setisEDITORopen(false)



    }


    const config = {
        readonly: false
    };

    const [editortipo, seteditortipo] = useState("");




    const openaceitarparecer = async (itemx) => {


        popUp_simcancelar("Aceita o pedido que lhe foi atribuído?", {
            doit: aceitapedido,
            id: itemx.id,
        })




    }

    const aceitapedido = async (idx) => {

        let resx = false

        const upload = {

            STATUS: "aceite",

        }

        //console.log(upload)


        try {

            const response = await api.put('/sgigjreleventoparecer/0?entidadeevento_id=' + idx, upload);

            if (response.status == '200') {

                uploadlist()
                resx = true

            }

        } catch (err) {

            console.error(err.response)

        }

        return resx

    }



    return (
        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Body>
                            <Table uploadList={uploadlist} columns={columns} data={newdata} modalOpen={openHandler} />
                        </Card.Body>
                    </Card>




                    <Modal size='x' show={isOpen} onHide={() => setIsOpen(false)}>
                        <Modal.Header style={{ border: "0" }} closeButton>
                            <Modal.Title as="h5">Criar</Modal.Title>
                        </Modal.Header>


                        <ul className="nav nav-tabs profile-tabs nav-fill" id="myTab" role="tablist">
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'eventos' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('eventos') }} id="profile-tab"><i className="feather icon-server mr-2" />Eventos</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'documentos' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('documentos') }} id="contact-tab"><i className="feather icon-file-text mr-2" />Documentos</Link>
                            </li>


                        </ul>


                        <Modal.Body style={activeProfileTab === 'documentos' ? {} : { display: "none" }}>

                            <Documentos documentolist={documentolist} list={documentosgeral_lista} save={documentosgeral_lista_save} item={{ ID: ID_C, ENTIDADE: "ENTIDADE_EVENTO_ID" }}
                            />


                        </Modal.Body>

                        {/* --------------------Criar Item------------------- */}


                        <Modal.Body style={activeProfileTab === 'eventos' ? {} : { display: "none" }} >

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

                                            <select onChange={event => { setENTIDADE_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>


                                                {entidadelist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}


                                            </select>

                                        </div>
                                    </Col> */}


                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="48" onChange={event => { setDESIG(event.target.value) }} defaultValue={""} type="text" className="form-control" id="coordenada" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Nº Sorteio <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="48" type="number" onChange={event => { setNUM_SORTEIO_NOITE(event.target.value) }} defaultValue={""} className="form-control" id="coordenada" placeholder="Número..." required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Pessoa Responsável <span style={{ color: "red" }} >*</span></label>
                                            <select onChange={event => { setREL_PESSOA_ENTIDADE_RESPONSAVEL_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {colaboradoreslist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.sgigjpessoa.NOME}</option>

                                                ))}


                                            </select>
                                        </div>
                                    </Col>



                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Tipo de Evento <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setPR_EVENTO_TP_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {eventoprlist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}


                                                </select>

                                            </span>

                                        </div>
                                    </Col>

                                    {/* <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Prêmio <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="48" type="number" onChange={event => { setPREMIO(event.target.value) }} defaultValue={""} className="form-control" id="coordenada" placeholder="Prêmio..." required />
                                        </div>
                                    </Col> */}

                                    <Col
                                        style={{ display: "flex", justifyContent: "flex-end" }}
                                        sm={12}
                                    >
                                        <Button onClick={() => addnovosdocumentos()} variant="primary">
                                            +
                                        </Button>
                                    </Col>

                                    {novosdocumentos.map((eq, index) => (
                                        <>
                                            <Col sm={9}>
                                                <div className="form-group fill">
                                                    <label className="floating-label" htmlFor="text">{index + 1}º Prêmio <span style={{ color: "red" }} >*</span></label>
                                                    <input onChange={(event) => {
                                                        criardocnum(event.target.value, eq.id);
                                                    }} maxLength="48" type="number" defaultValue={""} className="form-control" id="coordenada" placeholder="Prêmio..." required />
                                                </div>
                                            </Col>
                                            <div className="col-sm-3  paddinhtop28OnlyPC">
                                                <div className='d-flex justify-content-end'>
                                                    {novosdocumentos.length > 1 ? (
                                                        <label
                                                            onClick={() => removenovosdocumentos(eq.id)}
                                                            class="btn btn-danger ml-3"
                                                        >
                                                            <i className="feather icon-trash-2" />
                                                        </label>
                                                    ) : null}
                                                </div>
                                            </div>

                                        </>

                                    ))}


                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tipo de Data de Evento <span style={{ color: "red" }} >*</span></label>
                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setTipoDataEventoId(event.target.value) }} className="form-control" id="perfil" aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {tipoDataEvento.map(e => (

                                                        <option key={e.id} value={e.id}>{e.value}</option>

                                                    ))}


                                                </select>

                                            </span>
                                        </div>
                                    </Col>
                                    {tipoDataEventoId == "ANUAL" && (
                                        <>
                                            <Col sm={6}>
                                                <div className="form-group fill">
                                                    <label className="floating-label" htmlFor="Name">Número de Dias <span style={{ color: "red" }} >*</span></label>
                                                    <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                        <select onChange={event => { setNumeroDias(event.target.value) }} className="form-control" id="perfil" aria-required="true">
                                                            <option hidden value="">--- Selecione ---</option>
                                                            {dayOptions}
                                                        </select>
                                                    </span>                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group fill">
                                                    <label className="floating-label" htmlFor="Name">Mês
                                                        <span style={{ color: "red" }} >*</span></label>
                                                    <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                        <select onChange={event => { setMes(event.target.value) }} className="form-control" id="perfil" aria-required="true">

                                                            <option hidden value="">--- Selecione ---</option>

                                                            {listMes.map(e => (

                                                                <option key={e.id} value={e.id}>{e.value}</option>

                                                            ))}
                                                        </select>
                                                    </span>
                                                </div>
                                            </Col>
                                        </>
                                    )}

                                    {tipoDataEventoId == "FIXO" && (
                                        <Col sm={12}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Data Início <span style={{ color: "red" }} >*</span></label>
                                                <input type="date" onChange={event => { setDT_INICIO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Data..." />
                                            </div>
                                        </Col>
                                    )}

                                    {tipoDataEventoId == "MENSAL" && (
                                        <Col sm={12}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Dia <span style={{ color: "red" }} >*</span></label>
                                                <input type="number" onChange={event => { setDT_INICIO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Dia..." />
                                            </div>
                                        </Col>
                                    )}

                                    {tipoDataEventoId == "INTERVALO" && (
                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Data Início <span style={{ color: "red" }} >*</span></label>
                                                <input type="date" onChange={event => { setDT_INICIO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Data..." />
                                            </div>
                                        </Col>
                                    )
                                    }
                                    {tipoDataEventoId == "SEMANAL" && (
                                        <Col sm={12}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Dia de Semana <span style={{ color: "red" }} >*</span></label>
                                                <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <select onChange={event => { setDT_INICIO(event.target.value) }} className="form-control" id="perfil" aria-required="true">
                                                        <option hidden value="">--- Selecione ---</option>
                                                        {diaSemana.map(e => (
                                                            <option key={e.id} value={e.id}>{e.value}</option>
                                                        ))}
                                                    </select>

                                                </span>
                                            </div>
                                        </Col>
                                    )
                                    }
                                    {tipoDataEventoId == "INTERVALO" && (

                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Data Fim <span style={{ color: "red" }} >*</span></label>
                                                <input type="date" onChange={event => { setDT_FIM(event.target.value) }} defaultValue={""} className="form-control" placeholder="Data..." />
                                            </div>
                                        </Col>
                                    )

                                    }

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição  <span style={{ color: "red" }} >*</span></label>
                                            <textarea maxLength="64000" onChange={event => { setDESCR(event.target.value) }} className="form-control" defaultValue={""} required rows="3" placeholder='Descrição...' />
                                        </div>
                                    </div>


                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsOpen(false)}>Fechar</Button>
                            <Button type="submit" form="criarItem" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>












                    <Modal size='x' show={isEditarOpen} onHide={() => setIsEditarOpen(false)}>
                        <Modal.Header style={{ border: "0" }} closeButton>
                            <Modal.Title as="h5">Editar</Modal.Title>
                        </Modal.Header>


                        <ul className="nav nav-tabs profile-tabs nav-fill" id="myTab" role="tablist">
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'eventos' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('eventos') }} id="profile-tab"><i className="feather icon-server mr-2" />Eventos</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'documentos' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('documentos') }} id="contact-tab"><i className="feather icon-file-text mr-2" />Documentos</Link>
                            </li>


                        </ul>



                        <Modal.Body style={activeProfileTab === 'documentos' ? {} : { display: "none" }}>

                            <Documentos documentolist={documentolist} list={documentosgeral_lista} save={documentosgeral_lista_save} item={{ ID: itemSelected.ID, ENTIDADE: "ENTIDADE_EVENTO_ID" }} />


                        </Modal.Body>



                        {/* --------------------Editar Item------------------- */}


                        <Modal.Body style={activeProfileTab === 'eventos' ? {} : { display: "none" }} >


                            <form id="criarItem" onSubmit={editarItemGO} >

                                <Row>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input defaultValue={CODIGO} disabled type="text" className="form-control" id="Name" required />
                                        </div>
                                    </Col>

                                    {/* <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Entidade <span style={{ color: "red" }} >*</span></label>

                                            <select defaultValue={ENTIDADE_ID} onChange={event => { setENTIDADE_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>


                                                {entidadelist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}


                                            </select>

                                        </div>
                                    </Col> */}


                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Designação <span style={{ color: "red" }} >*</span></label>
                                            <input defaultValue={DESIG} maxLength="48" onChange={event => { setDESIG(event.target.value) }} type="text" className="form-control" id="coordenada" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Nº Sorteio <span style={{ color: "red" }} >*</span></label>
                                            <input defaultValue={NUM_SORTEIO_NOITE} maxLength="48" type="number" onChange={event => { setNUM_SORTEIO_NOITE(event.target.value) }} className="form-control" id="coordenada" placeholder="Número..." required />
                                        </div>
                                    </Col>

                                    <Col sm={8}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Pessoa Responsável <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={REL_PESSOA_ENTIDADE_RESPONSAVEL_ID} onChange={event => { setREL_PESSOA_ENTIDADE_RESPONSAVEL_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {colaboradoreslist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.sgigjpessoa.NOME}</option>

                                                ))}


                                            </select>
                                        </div>
                                    </Col>



                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Tipo de Evento <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={PR_EVENTO_TP_ID} onChange={event => { setPR_EVENTO_TP_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {eventoprlist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}


                                                </select>

                                                <Button onClick={() => opencriartipoeventoopen()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                            </span>

                                        </div>
                                    </Col>

                                    {/* <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Prêmio <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="48" type="number" onChange={event => { setPREMIO(event.target.value) }} defaultValue={""} className="form-control" id="coordenada" placeholder="Prêmio..." required />
                                        </div>
                                    </Col> */}

                                    <Col
                                        style={{ display: "flex", justifyContent: "flex-end" }}
                                        sm={12}
                                    >
                                        <Button onClick={() => addnovosdocumentos()} variant="primary">
                                            +
                                        </Button>
                                    </Col>

                                    {novosdocumentos.map((eq, index) => (
                                        <>
                                            <Col sm={9}>
                                                <div className="form-group fill">
                                                    <label className="floating-label" htmlFor="text">{index + 1}º Prêmio <span style={{ color: "red" }} >*</span></label>
                                                    <input onChange={(event) => {
                                                        criardocnum(event.target.value, eq.id);
                                                    }} maxLength="48" type="number" defaultValue={eq.VALOR} className="form-control" id="coordenada" placeholder="Prêmio..." required />
                                                </div>
                                            </Col>
                                            <div className="col-sm-3  paddinhtop28OnlyPC">
                                                <div className='d-flex justify-content-end'>
                                                    {novosdocumentos.length > 1 ? (
                                                        <label
                                                            onClick={() => removenovosdocumentos(eq.id)}
                                                            class="btn btn-danger ml-3"
                                                        >
                                                            <i className="feather icon-trash-2" />
                                                        </label>
                                                    ) : null}
                                                </div>
                                            </div>

                                        </>

                                    ))}


                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Tipo de Data de Evento <span style={{ color: "red" }} >*</span></label>
                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setTipoDataEventoId(event.target.value) }} defaultValue={tipoDataEventoId} className="form-control" id="perfil" aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {tipoDataEvento.map(e => (

                                                        <option key={e.id} value={e.id}>{e.value}</option>

                                                    ))}


                                                </select>

                                            </span>
                                        </div>
                                    </Col>
                                    {tipoDataEventoId == "ANUAL" && (
                                        <>
                                            <Col sm={6}>
                                                <div className="form-group fill">
                                                    <label className="floating-label" htmlFor="Name">Número de Dias <span style={{ color: "red" }} >*</span></label>
                                                    <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                        <select value={diasId} onChange={event => { setDiasId(event.target.value) }} className="form-control" id="perfil" aria-required="true">
                                                            <option hidden value="">--- Selecione ---</option>
                                                            {dayOptions}
                                                        </select>
                                                    </span>                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="form-group fill">
                                                    <label className="floating-label" htmlFor="Name">Mês
                                                        <span style={{ color: "red" }} >*</span></label>
                                                    <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                        <select value={mesId} onChange={event => { setMesId(event.target.value) }} className="form-control" id="perfil" aria-required="true">

                                                            <option hidden value="">--- Selecione ---</option>

                                                            {listMes.map(e => (

                                                                <option key={e.id} value={e.id}>{e.value}</option>

                                                            ))}
                                                        </select>
                                                    </span>
                                                </div>
                                            </Col>
                                        </>
                                    )}

                                    {tipoDataEventoId == "FIXO" && (
                                        <Col sm={12}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Data Início <span style={{ color: "red" }} >*</span></label>
                                                <input type="date" onChange={event => { setDT_INICIO(event.target.value) }} defaultValue={DT_INICIO} className="form-control" placeholder="Data..." />
                                            </div>
                                        </Col>
                                    )}

                                    {tipoDataEventoId == "MENSAL" && (
                                        <Col sm={12}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Dia <span style={{ color: "red" }} >*</span></label>
                                                <input type="number" onChange={event => { setDT_INICIO(event.target.value) }} defaultValue={DT_INICIO} className="form-control" placeholder="Dia..." />
                                            </div>
                                        </Col>
                                    )}

                                    {tipoDataEventoId == "INTERVALO" && (
                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Data Início <span style={{ color: "red" }} >*</span></label>
                                                <input type="date" onChange={event => { setDT_INICIO(event.target.value) }} defaultValue={DT_INICIO} className="form-control" placeholder="Data..." />
                                            </div>
                                        </Col>
                                    )
                                    }
                                    {tipoDataEventoId == "SEMANAL" && (
                                        <Col sm={12}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Dia de Semana <span style={{ color: "red" }} >*</span></label>
                                                <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <select onChange={event => { setDT_INICIO(event.target.value) }} defaultValue={DT_INICIO} className="form-control" id="perfil" aria-required="true">
                                                        <option hidden value="">--- Selecione ---</option>
                                                        {diaSemana.map(e => (
                                                            <option key={e.id} value={e.id}>{e.value}</option>
                                                        ))}
                                                    </select>

                                                </span>
                                            </div>
                                        </Col>
                                    )
                                    }
                                    {tipoDataEventoId == "INTERVALO" && (

                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Data Fim <span style={{ color: "red" }} >*</span></label>
                                                <input defaultValue={DT_FIM} type="date" onChange={event => { setDT_FIM(event.target.value) }} className="form-control" placeholder="Data..." />
                                            </div>
                                        </Col>
                                    )

                                    }


                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição <span style={{ color: "red" }} >*</span></label>
                                            <textarea defaultValue={DESCR} maxLength="64000" onChange={event => { setDESCR(event.target.value) }} className="form-control" rows="3" required placeholder='Descrição...' />
                                        </div>
                                    </div>


                                </Row>

                            </form>


                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsEditarOpen(false)}>Fechar</Button>
                            <Button type="submit" form="criarItem" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>
















                    <Modal size='lg' show={isVerOpen} onHide={() => setVerOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5"></Modal.Title>
                            <Modal.Title as="h5">Evento</Modal.Title>
                        </Modal.Header>

                        {Object.keys(itemlist).length === 0 ? null :

                            <Modal.Body>
                                <Row>
                                    <Col xl={4} className='task-detail-right'>


                                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

                                            <span><i className="feather icon-user m-r-5" />Geral</span>

                                        </div>

                                        <div style={{ width: "100%", display: "flex", alignItems: "center", marginBottom: "20px", flexDirection: "column", borderBottom: "1px solid #d2b32a", borderTop: "1px solid #d2b32a", paddingBottom: "15px", paddingTop: "15px", marginTop: "5px" }}>

                                            <i className="feather icon-shield" style={{ fontSize: "80px", marginBottom: "15px", marginTop: "10px" }} />
                                            <span>{itemlist.sgigjentidade.DESIG}</span>

                                        </div>


                                        <div style={{ borderBottom: "1px solid #d2b32a", marginBottom: "20px" }}>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span ><i className="feather icon-map-pin m-r-5" />Tipo de Entidade</span>

                                                <span style={{ color: "#6c757d" }}>{itemlist.sgigjentidade.sgigjprentidadetp.DESIG}</span>

                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />NIF</span>

                                                <span style={{ color: "#6c757d" }}>{itemlist.sgigjentidade.NIF}</span>


                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Início de Atividade</span>
                                                <span style={{ color: "#6c757d" }}>{createDate1(itemlist.sgigjentidade.DT_INICIO_ATIVIDADE)}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Registo Comercial</span>
                                                <span style={{ color: "#6c757d" }}>{itemlist.sgigjentidade.REGISTO_COMERCIAL}</span>
                                            </div>



                                        </div>

                                        <div style={{ borderBottom: "1px solid #d2b32a", marginBottom: "20px" }}>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Capital Social</span>
                                                <span style={{ color: "#6c757d" }}>{itemlist.sgigjentidade.CAPITAL_SOCIAL}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Observações</span>
                                                <span style={{ color: "#6c757d" }}>{itemlist.sgigjentidade.OBS}</span>
                                            </div>


                                        </div>


                                        <div >


                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-phone m-r-5" />Telefone</span>
                                                <span style={{ color: "#6c757d" }}>{itemlist.EMAIL}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-phone m-r-5" />Telemóvel</span>
                                                <span style={{ color: "#6c757d" }}>{itemlist.TELEMOVEL}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-mail m-r-5" />Email</span>
                                                <span style={{ color: "#6c757d" }}>{itemlist.TELEFONE}</span>
                                            </div>


                                        </div>



                                    </Col>



                                    <Col xl={8} className='task-detail-right'>



                                        <div style={{ width: "100%", display: "flex", justifyContent: "spaceAround" }}>

                                            <span onClick={() => setverlistgp("eventos")}

                                                style={verlistgp == "eventos" ? { paddingBottom: "4px", cursor: "pointer", borderBottom: "2px solid #d2b32a", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" } : { paddingBottom: "4px", cursor: "pointer", borderBottom: "1px solid #E5E5E5", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}

                                            ><i className="feather icon-server m-r-5" />Evento</span>

                                            <span onClick={() => setverlistgp("documentos")}

                                                style={verlistgp == "documentos" ? { paddingBottom: "4px", cursor: "pointer", borderBottom: "2px solid #d2b32a", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" } : { paddingBottom: "4px", cursor: "pointer", borderBottom: "1px solid #E5E5E5", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}

                                            ><i className="feather icon-file-text m-r-5" />Documentos</span>


                                            <span onClick={() => setverlistgp("parecer")}

                                                style={verlistgp == "parecer" ? { paddingBottom: "4px", cursor: "pointer", borderBottom: "2px solid #d2b32a", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" } : { paddingBottom: "4px", cursor: "pointer", borderBottom: "1px solid #E5E5E5", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}

                                            ><i className="feather icon-file-text m-r-5" />Parecer</span>




                                        </div >

                                        <span

                                            style={verlistgp == "eventos" ? {} : { display: "none" }}>

                                            <div style={{
                                                flexWrap: "wrap",
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "row",
                                                paddingTop: "20px",
                                                paddingBottom: "20px",
                                                marginTop: "5px",
                                                overflow: "auto",
                                                height: "auto"
                                            }}>




                                                <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                    <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Tipo de Evento</span>
                                                    <span style={{ width: "50%", display: "flex" }}>{itemlist.sgigjpreventotp.DESIG}</span>
                                                </div>


                                                <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                    <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Designação</span>
                                                    <span style={{ width: "50%", display: "flex" }}>{itemlist.DESIG}</span>
                                                </div>

                                                <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                    <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Pessoa Responsável</span>
                                                    <span style={{ width: "50%", display: "flex" }}>{itemlist.sgigjrelpessoaentidade.sgigjpessoa.NOME}</span>
                                                </div>

                                                <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                    <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Nº Sorteio</span>
                                                    <span style={{ width: "50%", display: "flex" }}>{itemlist.NUM_SORTEIO_NOITE}</span>
                                                </div>

                                                <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                    <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Prêmio</span>

                                                    <div style={{ width: "50%", display: "flex" }}>

                                                        <div dangerouslySetInnerHTML={{ __html: itemlist.PREMIO_FORMATTED }}></div>

                                                    </div>
                                                </div>
                                                <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                    <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Tipo Data de Evento</span>
                                                    <span style={{ width: "50%", display: "flex" }}>{itemlist.data?.TIPO}</span>
                                                </div>
                                                {
                                                    itemlist.data.TIPO == "ANUAL" && (
                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Data Início</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{itemlist.data.DT_INICIO}</span>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    itemlist.data.TIPO == "FIXO" && (
                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Data Início</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{itemlist.data.DT_INICIO}</span>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    itemlist.data.TIPO == "SEMANAL" && (
                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Data Início</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{itemlist.data.DT_INICIO}</span>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    itemlist.data.TIPO == "MENSAL" && (
                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Dia</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{itemlist.data.DT_INICIO} </span>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    itemlist.data.TIPO == "INTERVALO" && (
                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Data Início</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{createDate1(itemlist.data.DT_INICIO)}</span>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    itemlist.data.TIPO == "FIXO" && (
                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Data Início</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{createDate1(itemlist.data.DT_INICIO)}</span>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    itemlist.data.TIPO == "INTERVALO" && (
                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Data Fim</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{createDate1(itemlist.data.DT_FIM)}</span>
                                                        </div>

                                                    )
                                                }

                                                <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                    <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Descrição</span>
                                                    <span style={{ width: "50%", display: "flex" }}>{itemlist.DESCR}</span>
                                                </div>



                                            </div>



                                        </span>



                                        <span

                                            style={verlistgp == "parecer" ? {} : { display: "none" }}>

                                            <div style={{
                                                flexWrap: "wrap",
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "row",

                                                paddingTop: "20px",
                                                paddingBottom: "20px",
                                                marginTop: "5px",
                                                overflow: "auto",
                                                scroll: "auto",
                                                width: "100%",
                                                height: "auto",
                                                maxHeight: "500px",
                                                paddingRight: "20px"
                                            }}>

                                                {itemlist.parecerolist == true ? itemlist.sgigjreleventodespacho[0].sgigjreleventoparecer.map(eq => (


                                                    <div key={eq.ID} style={{ width: "100%", marginBottom: "20px", borderBottom: "1px solid #6c757d" }} >

                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Parecer</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{


                                                                eq.STATUS != "finalizado" ? "Sem Parecer" : "Finalizado"

                                                            }</span>
                                                        </div>


                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Inspetor(a)</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{

                                                                eq.sgigjrelpessoaentidade == null ? "" : eq.sgigjrelpessoaentidade.sgigjpessoa.NOME

                                                            }</span>
                                                        </div>


                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Data Atribuição</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{

                                                                createDate1(eq.DT_ATRIBUICAO)

                                                            }</span>
                                                        </div>


                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Observação</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{

                                                                eq.OBS

                                                            }</span>
                                                        </div>

                                                        {eq.URL_DOC_GERADO != null ?

                                                            <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>

                                                                <a target="_blank" href={eq.URL_DOC_GERADO + "?alt=media&token=0"} >

                                                                    <span style={{ display: "flex", fontWeight: "bold" }}>Abrir Ficheiro</span>

                                                                </a>

                                                            </div>


                                                            : null}






                                                    </div>


                                                )) : null}











                                            </div>



                                        </span>


                                        <div style={verlistgp == "documentos" ? {
                                            width: "100%",
                                            height: "450px",
                                        } : { display: "none" }}>

                                            <div style={{
                                                width: "100%",
                                                borderBottom: "1px solid #d2b32a",
                                                paddingTop: "20px",
                                                paddingBottom: "20px",
                                                marginBottom: "20px",
                                                overflow: "auto",
                                                height: "70px"
                                            }}>



                                                {typeof itemSelected.doclist != "undefined"
                                                    ? itemSelected.doclist.map((e) => (
                                                        <Link
                                                            onClick={() => selectedImg(e)}
                                                            key={e.id}
                                                            style={{ margin: "2px" }}
                                                            to="#"
                                                            className="mb-1 text-muted d-flex align-items-end text-h-primary"
                                                        >
                                                            {"::" + e.nome}
                                                        </Link>
                                                    ))
                                                    : null}


                                            </div>


                                            {
                                                itemSelected?.doclist?.length > 0 ?
                                                    <>

                                                        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "10px" }}>

                                                            <span><i className="feather icon-eye m-r-5" />Pré-vizualização</span>
                                                            <span style={{ cursor: "pointer" }} className="text-danger" onClick={() => removeItemFile(previewSelected?.id)}
                                                            >
                                                                <i className="feather icon-trash ml-5 text-danger" />
                                                                Eliminar                </span>
                                                        </div>
                                                        {
                                                            imgprev?.substring(imgprev?.lastIndexOf('.') + 1) !== "PDF" && imgprev?.substring(imgprev?.lastIndexOf('.') + 1) !== "pdf" ? (
                                                                <a
                                                                    href={imgprev + "?alt=media&token=0"}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <div
                                                                        className={imgprev == "" ? "previewdoc" : "previewdoc-img"}
                                                                        style={{
                                                                            backgroundImage: 'url("' + imgprev + '?alt=media&token=0")',
                                                                            height: "450px",
                                                                        }}
                                                                    ></div>
                                                                </a>
                                                            ) : (
                                                                <object data={`${imgprev + "?alt=media&token=0"}`} type="application/pdf" width="100%" height="450px">
                                                                    <p>Alternative text - include a link <a href="myfile.pdf">to the PDF!</a></p>
                                                                </object>
                                                            )

                                                        }
                                                    </>


                                                    : <p className='text-center'>Sem Anexos</p>

                                            }




                                        </div>







                                    </Col>
                                </Row>
                            </Modal.Body>

                        }

                        <Modal.Footer className="d-flex justify-content-between">
                            <span>Registado por: {itemlist?.criadoPor?.sgigjrelpessoaentidade?.sgigjpessoa?.NOME}</span>
                            <Button variant="danger" onClick={() => setVerOpen(false)}>Fechar</Button>

                        </Modal.Footer>
                    </Modal>



                    <Modal size='xl' show={isdecisaoopen} onHide={() => setisdecisaoopen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Decisão</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarDecisao" onSubmit={finalizarDecisaoGO} >

                                <Row>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data <span style={{ color: "red" }} >*</span></label>
                                            <input defaultValue={decisao_a_data} type="date" onChange={event => { setdecisao_a_data(event.target.value) }} className="form-control" id="data" required />
                                        </div>
                                    </Col>



                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Decisão <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={decisao_a_decisao} className="form-control" onChange={event => { setdecisao_a_decisao(event.target.value) }} id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>


                                                {decisaolist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}


                                            </select>
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Referência</label>
                                            <input defaultValue={decisao_a_referencia} type="number" onChange={event => { setdecisao_a_referencia(event.target.value) }} className="form-control" id="Name" />
                                        </div>
                                    </Col>

                                    <Col sm={12}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Documento Decisão</label>

                                            <JoditEditor
                                                editorRef={setRef}
                                                value={editorcontent}
                                                config={config}
                                                ref={editorREFDesicao}
                                                onChange={event => updateContent(event)}
                                            />


                                        </div>
                                    </Col>


                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setisdecisaoopen(false)}>Fechar</Button>
                            <Button variant="primary" onClick={() => criarDecisaoGO()}>Guardar</Button>
                            <Button type="submit" form="criarDecisao" variant="primary">Concluir</Button>
                        </Modal.Footer>
                    </Modal>





                    <Modal size='x' show={iseventopedidoparecer} onHide={() => setiseventopedidoparecer(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Evento - Pedido Parecer</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarparecer" onSubmit={criarparecer} >

                                <Row>


                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Inspector <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control" onChange={event => { setparecer_REL_PESSOA_ENTIDADE_ID(event.target.value) }} id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {colaboradoreslist.map(e => (

                                                    e.glbuser.length > 0 ?

                                                        e.glbuser[0].glbperfil.ID == "f8382845e6dad3fb2d2e14aa45b14f0f85de" ?


                                                            <option key={e.ID} value={e.ID}>{e.sgigjpessoa.NOME}</option>

                                                            : null


                                                        : null


                                                ))}


                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Observação </label>
                                            <textarea maxLength="64000" onChange={event => { setparecer_OBS(event.target.value) }} className="form-control" defaultValue={""} rows="3" placeholder='Observação...' />
                                        </div>
                                    </div>





                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setiseventopedidoparecer(false)}>Fechar</Button>
                            <Button type="submit" form="criarparecer" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>




                    <Modal size='x' show={isverparecer} onHide={() => setisverparecer(false)}>
                        <Modal.Header closeButton>

                            {/*-------- ver -----------------*/}

                            <Modal.Title as="h5">Evento - Pedido Parecer</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >


                            <Row style={{ width: "100%", overflow: "auto" }}>



                                <div className="col-sm-12">
                                    <div className="form-group fill">
                                        <label className="floating-label" >Inspector</label>
                                        <label style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{parecerinspector}</label>

                                    </div>
                                </div>


                                <div className="col-sm-12">
                                    <div className="form-group fill">
                                        <label className="floating-label">Observação</label>
                                        <label style={{ overflow: "auto", height: "auto", minHeight: "33px" }} className="form-control">{parecerobs}</label>

                                    </div>
                                </div>

                                {parecer_novoparecer == true && taskEnable(pageAcess, permissoes, "Atriubuirparecer") == true ?


                                    <Col sm={12}>

                                        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "13px" }} className="form-group fill">
                                            <Button onClick={() => openeventopedidoparecer(itemparecer)} variant="primary" >Atribuir novo Parecer</Button>
                                        </div>


                                    </Col>

                                    : null}



                            </Row>


                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setisverparecer(false)}>Fechar</Button>
                        </Modal.Footer>
                    </Modal>




                    <Modal size='xl' show={isparecer} onHide={() => setisparecer(false)}>
                        <Modal.Header style={{ border: "0" }} closeButton>
                            <Modal.Title as="h5">Parecer</Modal.Title>
                        </Modal.Header>


                        <ul className="nav nav-tabs profile-tabs nav-fill" id="myTab" role="tablist">
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'eventos' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('eventos') }} id="profile-tab"><i className="feather icon-server mr-2" />Eventos</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'documentos' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('documentos') }} id="contact-tab"><i className="feather icon-file-text mr-2" />Documentos</Link>
                            </li>


                        </ul>


                        <Modal.Body style={activeProfileTab === 'documentos' ? {} : { display: "none" }}>

                            <Documentos documentolist={documentolist} list={documentosParecer_lista} save={documentosParecer_lista_save} item={{ ID: parecer_a_id, ENTIDADE: "REL_EVENTO_PARECER_ID" }} />

                        </Modal.Body>





                        <Modal.Body style={activeProfileTab === 'eventos' ? {} : { display: "none" }} >

                            <form id="atualizarparecer" onSubmit={concluirevento} >

                                <Row>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data <span style={{ color: "red" }} >*</span></label>
                                            <input defaultValue={parecer_a_data} type="date" onChange={event => { setparecer_a_data(event.target.value) }} className="form-control" id="data" required />
                                        </div>
                                    </Col>



                                    {/* 
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Parecer <span style={{ color: "red" }} >*</span></label>

                                            <select defaultValue={parecer_a_decisao} className="form-control" onChange={event => { setparecer_a_decisao(event.target.value) }} id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>


                                                {parecerlist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.NOME}</option>

                                                ))}


                                            </select>

                                        </div>
                                    </Col> */}


                                    <Col sm={12}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Documento parecer</label>

                                            <JoditEditor
                                                editorRef={setRef}
                                                value={editorcontent}
                                                config={config}
                                                ref={editorREFParecer}
                                                onChange={event => updateContent(event)}
                                            />


                                        </div>
                                    </Col>



                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => 0(false)}>Fechar</Button>
                            <Button onClick={() => atualizarparecer()} variant="primary">Guardar</Button>
                            <Button type="submit" form="atualizarparecer" variant="primary">Concluir</Button>
                        </Modal.Footer>
                    </Modal>







                    <Modal size='x' show={iscriartipoeventoopen} onHide={() => setiscriartipoeventoopen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar Tipo de Evento</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarevento" onSubmit={criartipoevento} >

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
                                            <input maxLength="128" type="text" onChange={event => { setDESIG_TE(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setOBS_TE(event.target.value) }} defaultValue={""} rows="3" placeholder='Descrição...' />
                                        </div>
                                    </div>


                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setiscriartipoeventoopen(false)}>Fechar</Button>
                            <Button type="submit" form="criarevento" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>


                    <Modal size="xl" show={isEDITORopen} onHide={() => setisEDITORopen(false)}>

                        <Modal.Header style={{ border: "0" }} closeButton>
                            <Modal.Title as="h5">
                                {editortipo == "parecer" ? "Documento parecer" : ""}
                                {editortipo == "decisão" ? "Documento decisão" : ""}
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body >




                        </Modal.Body >

                        <Modal.Footer>
                            <Button onClick={() => savedataeditor()} variant="primary" type="submit" form="editarpessoa" >Guardar</Button>
                        </Modal.Footer>

                    </Modal>





                </Col>
            </Row >
        </React.Fragment >
    );












};
export default EventosPedidos;