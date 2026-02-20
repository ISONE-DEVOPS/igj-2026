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
    const params = useParams();
    const [values, setValues] = useState()

    const pageAcess = "/eventos/recusados"
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


    } async function exportExel() {
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
    const [ANO, setANO] = useState("")

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



const EventosRecusados = () => {
    const params = useParams();


    const editorREFParecer = useRef(null)
    const editorREFDesicao = useRef(null)



    const { permissoes } = useAuth();

    const history = useHistory();


    const pageAcess = "/eventos/recusados"



    useEffect(() => {



        if (pageEnable(pageAcess, permissoes) == false) history.push('/')



        else {


            uploadlist()
            uploadeventoprlist()
            uploaddecisaolist()
            uploadentidadelist()
            uploadcolaboradoreslist()
            uploaddocumentolist()

        }

    }, [])



    const { popUp_removerItem, popUp_alertaOK, popUp_simcancelar, user } = useAuth();



    const columns = React.useMemo(
        () => [



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


    const [documentosgeral_lista, setdocumentosgeral_lista] = useState([]);
    const [documentosgeral_lista_save, setdocumentosgeral_lista_save] = useState(false);

    const [documentosParecer_lista, setdocumentosParecer_lista] = useState([]);
    const [documentosParecer_lista_save, setdocumentosParecer_lista_save] = useState(false);



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);

    async function uploadlist(ano) {
        ano = ano === "" ? undefined : ano

        if (taskEnable(pageAcess, permissoes, "Ler")) {

            try {

                var response

                if (taskEnable(pageAcess, permissoes, "LerapenasEP")) {
                    response = await api.get(`/sgigjentidadeevento_parecer?ENTIDADE_ID=${params.id}` + setParams([['ANO', ano]]));
                }
                else {
                    // response = await api.get(`/sgigjentidadeevento?ENTIDADE_ID=${params.id}${dataInicio !== undefined || dataInicio != null ? "&date-start=" + dataInicio : ""}${dataFim === undefined || dataFim === "" ? "" : "&date-end=" + dataFim}`);
                    response = await api.get(`/sgigjentidadeevento?ENTIDADE_ID=${params.id}` + setParams([['ANO', ano]]));

                }

                if (response.status == '200') {

                    for (var i = 0; i < response.data.length; i++) {

                        const idx = response.data[i].ID


                        response.data[i].id = response.data[i].ID


                        response.data[i].ENTIDADES = response.data[i].sgigjentidade.DESIG
                        response.data[i].PESSOA = response.data[i].sgigjrelpessoaentidade.sgigjpessoa.NOME
                        response.data[i].TIPO = response.data[i].sgigjpreventotp.DESIG
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
                                {
                                    response.data[i].sgigjreleventodespacho.length > 0 ? <>


                                        {
                                            response.data[i].sgigjreleventodespacho[0].URL_DOC_GERADO != null && <>
                                                {taskEnable(pageAcess, permissoes, "DocDesicao") == false ? null :
                                                    <a target="_blank" href={response.data[i].sgigjreleventodespacho[0].URL_DOC_GERADO + "?alt=media&token=0"} >
                                                        <i title={taskEnableTitle(pageAcess, permissoes, "DocDesicao")} className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "DocDesicao")} />
                                                    </a>
                                                }

                                            </>
                                        }


                                        {
                                            response.data[i].sgigjreleventodespacho[0].sgigjreleventoparecer.length > 0 ?
                                                <>


                                                    {taskEnable(pageAcess, permissoes, "Decisao") == false ? null :
                                                        <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Decisao")} onClick={() => openDecisao(itemx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Decisao")} /></Link>
                                                    }

                                                </>


                                                : null
                                        }
                                    </>
                                        :
                                        <>

                                        </>

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

                            if (response.data[i].sgigjreleventodespacho[0].STATUS == null || response.data[i].sgigjreleventodespacho[0].STATUS == "") response.data[i] = null

                            else {

                                if (response.data[i].sgigjreleventodespacho[0].PR_DECISAO_TP_ID == null) response.data[i] = null

                                else {

                                    if (response.data[i].sgigjreleventodespacho[0].sgigjprdecisaotp.TIPO != "NAO_APROVADO") response.data[i] = null
                                    //  else console.log((response.data[i]))


                                }

                            }



                        } else {

                            response.data[i] = null

                        }




                    }


                    var filtered = response.data.filter(function (el) {
                        return el != null;
                    });

                    // console.log(filtered)


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

        parecerEdit = `<p class="MsoNormal" style="margin: 0in; line-height: 107%; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify;"><span style="font-size: 29px; line-height: 107%; font-family: &quot;Ropa Mix Pro&quot;, sans-serif;">Escreva um texto aqui</span></p>`

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

        event.preventDefault();


        const upload = {

            ENTIDADE_ID: ENTIDADE_ID,
            PR_EVENTO_TP_ID: PR_EVENTO_TP_ID,
            REL_PESSOA_ENTIDADE_RESPONSAVEL_ID: REL_PESSOA_ENTIDADE_RESPONSAVEL_ID,
            DESIG: DESIG,
            DESCR: DESCR,
            PREMIO: PREMIO,
            NUM_SORTEIO_NOITE: NUM_SORTEIO_NOITE,
            DT_INICIO: DT_INICIO,
            DT_FIM: DT_FIM,


        }

        //console.log(upload)


        try {

            const response = await api.post('/sgigjentidadeevento', upload);

            if (response.status == '200') {


                setID_C(response.data.ID)

                setdocumentosgeral_lista_save(!documentosgeral_lista_save)

                uploadlist()
                setIsOpen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }



    //----------------------------------------------








    //-------------- EDITAR -------------------------

    const [itemSelected, setitemSelected] = useState({});




    const openEditHandler = async (idx) => {


        setitemSelected(idx)

        setENTIDADE_ID(idx.ENTIDADE_ID);
        setPR_EVENTO_TP_ID(idx.PR_EVENTO_TP_ID);
        setREL_PESSOA_ENTIDADE_RESPONSAVEL_ID(idx.REL_PESSOA_ENTIDADE_RESPONSAVEL_ID);
        setCODIGO(idx.CODIGO);
        setDESIG(idx.DESIG);
        setDESCR(idx.DESCR);
        setPREMIO(idx.PREMIO);
        setNUM_SORTEIO_NOITE(idx.NUM_SORTEIO_NOITE);
        setDT_INICIO(createDate2(idx.DT_INICIO));
        setDT_FIM(createDate2(idx.DT_FIM));



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

        event.preventDefault();


        const upload = {

            ENTIDADE_ID: ENTIDADE_ID,
            PR_EVENTO_TP_ID: PR_EVENTO_TP_ID,
            REL_PESSOA_ENTIDADE_RESPONSAVEL_ID: REL_PESSOA_ENTIDADE_RESPONSAVEL_ID,
            DESIG: DESIG,
            DESCR: DESCR,
            PREMIO: PREMIO,
            NUM_SORTEIO_NOITE: NUM_SORTEIO_NOITE,
            DT_INICIO: DT_INICIO,
            DT_FIM: DT_FIM,


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



        try {
            let response
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



                    let decisaox = {}


                    if (response.data[0].sgigjreleventodespacho.length > 0) {

                        if (response.data[0].sgigjreleventodespacho[0].PR_DECISAO_TP_ID != null) {

                            decisaox.dec = response.data[0].sgigjreleventodespacho[0].sgigjprdecisaotp.TIPO
                            decisaox.url = response.data[0].sgigjreleventodespacho[0].URL_DOC_GERADO
                            decisaox.pessoa = response.data[0].sgigjreleventodespacho[0].sgigjrelpessoaentidade.sgigjpessoa.NOME


                        }

                    }




                    response.data[0].decisaox = decisaox




                    let parecerolist = false

                    if (response.data[0].sgigjreleventodespacho.length > 0) {


                        if (response.data[0].sgigjreleventodespacho[0].sgigjreleventoparecer.length > 0) {

                            parecerolist = true

                        }



                    }


                    response.data[0].parecerolist = parecerolist




                    let doclist = []

                    for (let ix = 0; ix < response.data[0].sgigjreldocumento.length; ix++) {

                        doclist.push({
                            id: response.data[0].sgigjreldocumento[ix].ID,
                            nome: response.data[0].sgigjreldocumento[ix].sgigjprdocumentotp.DESIG,
                            url: response.data[0].sgigjreldocumento[ix].DOC_URL,

                        })

                    }



                    response.data[0].doclist = doclist









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

        parecerEdit = `<p class="MsoNormal" style="margin: 0in; line-height: 107%; font-size: 15px; font-family: Calibri, sans-serif; text-align: justify;"><span style="font-size: 29px; line-height: 107%; font-family: &quot;Ropa Mix Pro&quot;, sans-serif;">Escreva um texto aqui</span></p>`

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
            PR_DECISAO_TP_ID: parecer_a_decisao,
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
            PR_DECISAO_TP_ID: parecer_a_decisao,
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


                                            <span onClick={() => setverlistgp("decisao")}

                                                style={verlistgp == "decisao" ? { paddingBottom: "4px", cursor: "pointer", borderBottom: "2px solid #d2b32a", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" } : { paddingBottom: "4px", cursor: "pointer", borderBottom: "1px solid #E5E5E5", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}

                                            ><i className="feather icon-file-text m-r-5" />Decisão</span>



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


                                            {Object.keys(itemlist.decisaox).length === 0 ? null :

                                                <>


                                                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

                                                        <span><i className="feather icon-server m-r-5" />Decisão</span>

                                                    </div>

                                                    <div style={{
                                                        flexWrap: "wrap",
                                                        width: "100%",
                                                        display: "flex",
                                                        marginBottom: "15px",
                                                        flexDirection: "row",
                                                        borderTop: "1px solid #d2b32a",
                                                        paddingTop: "20px",
                                                        paddingBottom: "20px",
                                                        marginTop: "5px",
                                                        overflow: "auto",
                                                        height: "auto"
                                                    }}>




                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Decisão</span>
                                                            <span style={{
                                                                display: "flex", backgroundColor: itemlist.decisaox.dec == "APROVADO" ? "#d2b32a" : "#FF5370", color: "#fff",
                                                                paddingTop: "4px",
                                                                paddingBottom: "4px",
                                                                paddingLeft: "8px",
                                                                paddingRight: "8px",
                                                            }}>{itemlist.decisaox.dec}</span>
                                                        </div>


                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Decisor</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{itemlist.decisaox.pessoa}</span>
                                                        </div>

                                                        {itemlist.decisaox.url != null ?

                                                            <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>

                                                                <a target="_blank" href={itemlist.decisaox.url + "?alt=media&token=0"} >

                                                                    <span style={{ display: "flex", fontWeight: "bold" }}>Abrir Ficheiro</span>

                                                                </a>

                                                            </div>


                                                            : null}



                                                    </div>




                                                </>



                                            }



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
                                                        {/* <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Decisão</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{


                                                                eq.sgigjprdecisaotp == null && eq.STATUS != "finalizado" ? "Sem decisão" : eq.sgigjprdecisaotp.DESIG

                                                            }</span>
                                                        </div> */}


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
                                        <span

                                            style={verlistgp == "decisao" ? {} : { display: "none" }}>

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
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Decisão</span>
                                                            <span style={{
                                                                display: "flex", backgroundColor: itemlist.decisaox.dec == "APROVADO" ? "#d2b32a" : "#FF5370", color: "#fff",
                                                                paddingTop: "4px",
                                                                paddingBottom: "4px",
                                                                paddingLeft: "8px",
                                                                paddingRight: "8px",
                                                            }}>{itemlist.decisaox.dec}</span>
                                                        </div>


                                                        <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Decisor</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{itemlist.decisaox.pessoa}</span>
                                                        </div>

                                                        {itemlist.decisaox.url != null ?

                                                            <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>

                                                                <a target="_blank" href={itemlist.decisaox.url + "?alt=media&token=0"} >

                                                                    <span style={{ display: "flex", fontWeight: "bold" }}>Abrir Ficheiro</span>

                                                                </a>

                                                            </div>


                                                            : null}


                                                        {/* <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
<span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Decisão</span>
<span style={{ width: "50%", display: "flex" }}>{


eq.sgigjprdecisaotp == null && eq.STATUS != "finalizado" ? "Sem decisão" : eq.sgigjprdecisaotp.DESIG

}</span>
</div> */}


                                                        {/* <div style={{ width: "100%", display: "flex", marginBottom: "15px" }}>
                                                            <span style={{ width: "50%", display: "flex", fontWeight: "bold" }}>Pessoa Responsável</span>
                                                            <span style={{ width: "50%", display: "flex" }}>{

                                                                itemlist.sgigjreleventodespacho[0].sgigjrelpessoaentidade == null ? "" : itemlist.sgigjreleventodespacho[0].sgigjrelpessoaentidade.sgigjpessoa.NOME

                                                            }</span>
                                                        </div> */}









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



                                                {
                                                    typeof itemlist.doclist != "undefined" ?

                                                        itemlist.doclist.map(e => (

                                                            <Link onClick={() => setimgprev(e.url)} key={e.id} style={{ margin: "2px" }} to='#' className="mb-1 text-muted d-flex align-items-end text-h-primary">{"::" + e.nome}</Link>

                                                        ))

                                                        : null

                                                }


                                            </div>



                                            {
                                                itemlist.doclist.length > 0 ?
                                                    <>
                                                        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "10px" }}>

                                                            <span><i className="feather icon-eye m-r-5" />Pré-vizualização</span>

                                                        </div>

                                                        <a href={imgprev + "?alt=media&token=0"} target="_blank" rel="noopener noreferrer" ><div className={imgprev == "" ? 'previewdoc' : "previewdoc-img"} style={{ backgroundImage: "url(\"" + imgprev + "?alt=media&token=0\")", height: "400px" }}>

                                                        </div></a>
                                                    </>
                                                    : <p className='text-center'>Sem Anexo</p>

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





                </Col>
            </Row>
        </React.Fragment>
    );












};
export default EventosRecusados;