import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, ListGroup } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";

import imgperilview from '../../../../assets/images/user/sample-user.png';

import api from '../../../../services/api';

import useAuth from '../../../../hooks/useAuth';

import { saveAs } from 'file-saver';

import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle } from '../../../../functions';

import Select from 'react-select';

import CriarPessoa from '../../../../components/Custom/CriarPessoa'


const pageAcess = "/entidades/entidades/colaboradores"


function Table({ columns, data, modalOpen, catProf }) {

    const [listx, setlistx] = useState(data);
    const [cat, setcat] = useState("");

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
    useEffect(() => {

        if (cat == "") {

            setlistx(data)

        } else {


            var s = data

            for (var i = 0; i < s.length; i++) {

                console.log(s[i])

                if (s[i].PR_CATEGORIA_PROFISSIONAL_ID != cat) {

                    s[i].block = true

                }

                else s[i].block = false

            }

            var filtered = s.filter(function (el) {
                return el.block == false;
            });

            setlistx(filtered)


        }





    }, [cat, data])





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
            data: listx,
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
                    <select onChange={event => { setcat(event.target.value) }} className="form-control" style={{ width: "200px", marginRight: "60px" }} >

                        <option hidden value="">Selecione...</option>

                        <option value="">TODOS</option>



                        {catProf.map(e => (

                            <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                        ))}

                    </select>
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

            <BTable striped bordered hover {...getTableProps()}>
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
                                            <td className={isCentered ? 'text-center' : 'text-right'} {...cell.getCellProps({
                                                style: {
                                                    minWidth: cell.column.minWidth,
                                                    width: cell.column.width,
                                                    maxWidth: cell.column.maxWidth,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis"
                                                },
                                            })}>{cell.render('Cell')}</td>
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
                    <span style={{ minWidth: "472.5px" }} className="d-flex align-items-center">
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



const Colaboradores = () => {

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
                width: 80,
                maxWidth: 80,
                minWidth: 80,

                centered: false
            },



            {
                Header: 'Nome',
                accessor: 'PESSOA',
                width: 200,
                maxWidth: 200,
                minWidth: 200,
                centered: true
            },

            {
                Header: 'Categoria Profissional',
                accessor: 'CATEGORIA',
                width: 200,
                maxWidth: 200,
                minWidth: 200,
                centered: true
            },

            {
                Header: 'Nível de Escolaridade',
                accessor: 'ESCOLARIDADE',
                centered: true
            },

            {
                Header: 'Data Início',
                accessor: 'INICIO',
                centered: true
            },

            {
                Header: 'Data Fim',
                accessor: 'FIM',
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



    const [ID, setID] = useState("");
    const [CODIGO, setCODIGO] = useState("");
    const [ENTIDADE_ID, setENTIDADE_ID] = useState("");
    const [PESSOA_ID, setPESSOA_ID] = useState("");
    const [PR_CATEGORIA_PROFISSIONAL_ID, setPR_CATEGORIA_PROFISSIONAL_ID] = useState("");
    const [PR_NIVEL_ESCOLARIDADE_ID, setPR_NIVEL_ESCOLARIDADE_ID] = useState("");
    const [DT_INICIO, setDT_INICIO] = useState("");
    const [DT_FIM, setDT_FIM] = useState("");
    const [OBS, setOBS] = useState("");





    const [itemSelected, setitemSelected] = useState({});
    const [itemSelectedver, setitemSelectedver] = useState({});



    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    async function uploadlist() {


        setid_params(id)



        try {

            const response = await api.get('/sgigjrelpessoaentidade?ENTIDADE_ID=' + id);

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID


                    response.data[i].id = response.data[i].ID


                    response.data[i].CATEGORIA = response.data[i].sgigjprcategoriaprofissional.DESIG
                    response.data[i].ESCOLARIDADE = response.data[i].sgigjprnivelescolaridade.DESIG
                    response.data[i].PESSOA = response.data[i].sgigjpessoa.NOME

                    response.data[i].INICIO = createDate1(response.data[i].DT_INICIO)
                    response.data[i].FIM = createDate1(response.data[i].DT_FIM)

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






    const [escolaridadelist, setescolaridadelist] = useState([]);

    async function uplaodescolaridadelist() {

        try {

            const response = await api.get('/sgigjprnivelescolaridade');

            if (response.status == '200') {

                setescolaridadelist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    const [profissionallist, setprofissionallist] = useState([]);

    async function uploadprofissionallist() {

        try {

            const response = await api.get('/sgigjprcategoriaprofissional');

            if (response.status == '200') {

                setprofissionallist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    const [pessoalist, setpessoalist] = useState([]);




    const [pessoalistOrigin, setpessoalistOrigin] = useState([]);

    async function uploadpessoa() {

        try {

            const response = await api.get('/sgigjpessoa');

            if (response.status == '200') {

                let newarray = []

                for (var i = 0; i < response.data.length; i++) {

                    response.data[i].value = response.data[i].ID
                    response.data[i].label = response.data[i].NOME


                    if (response.data[i].sgigjrelpessoaentidade.length == 0) {

                        newarray.push(response.data[i])

                    }



                    if (response.data[i].ID == itemSelected?.PESSOA_ID) {

                        newarray.push(response.data[i])

                    }

                }

                setpessoalist(newarray)
                setpessoalistOrigin(response.data)



            }


        } catch (err) {

            console.error(err)


        }

    }



    const [lingualist, setlingualist] = useState([]);

    async function uploadlingua() {

        try {

            const response = await api.get('/sgigjprlingua');

            if (response.status == '200') {

                setlingualist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }



    const [nivellist, setnivellist] = useState([]);

    async function uploadnivellist() {

        try {

            const response = await api.get('/sgigjprnivellinguistico');

            if (response.status == '200') {

                setnivellist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }





    const [generolist, setgenerolist] = useState([]);

    async function uploadgenerolist() {

        try {

            const response = await api.get('/sgigjprgenero');

            if (response.status == '200') {



                setgenerolist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    const [estadocivillist, setestadocivillist] = useState([]);

    async function uploadestadocivil() {

        try {

            const response = await api.get('/sgigjprestadocivil');

            if (response.status == '200') {

                setestadocivillist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }




    const [glbgeografialist, setglbgeografia] = useState([]);

    async function uploadglbgeografia() {

        try {

            const response = await api.get('/glbgeografia');

            if (response.status == '200') {

                setglbgeografia(response.data)

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


    const [contactolist, setcontactolist] = useState([]);

    async function uploadcontactolist() {

        try {

            const response = await api.get('/sgigjprcontactotp');

            if (response.status == '200') {

                setcontactolist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }







    //-------------------------------------------









    //-------------- CRIAR -------------------------


    const openHandler = () => {

        setitemSelected({})


        setIsEditarOpen(false);
        setVerOpen(false);

        setID("")
        setCODIGO("")

        setENTIDADE_ID("")
        setPESSOA_ID("")
        setPR_CATEGORIA_PROFISSIONAL_ID("")
        setPR_NIVEL_ESCOLARIDADE_ID("")
        setDT_INICIO("")
        setDT_FIM("")

        setnovoscontactos([{
            id: "" + Math.random(),
            idlingua: "",
            idnivel: "",
        }])

        setActiveProfileTab('colaboradores')



        let newarray = []

        for (var i = 0; i < pessoalistOrigin.length; i++) {

            let newitem = pessoalistOrigin[i]


            if (pessoalistOrigin[i].sgigjrelpessoaentidade.length == 0) {

                newarray.push(newitem)

            }


        }

        setpessoalist(newarray)

        console.log(newarray)


        setIsOpen(true);


    };





    async function criarItemGO(event) {

        event.preventDefault();

        setIsLoading(true)
        if (PESSOA_ID == null || PESSOA_ID == "") popUp_alertaOK("Escolha uma Pessoa"); else {


            const upload = {

                PESSOA_ID,
                PR_CATEGORIA_PROFISSIONAL_ID,
                PR_NIVEL_ESCOLARIDADE_ID,
                DT_INICIO,
                DT_FIM,
                OBS,


                ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,

            }



            try {

                const response = await api.post('/sgigjrelpessoaentidade', upload);

                if (response.status == '200') {

                    uploadlist()
                    uploadpessoa()


                    for (let i = 0; i < novoscontactos.length; i++) {

                        if (novoscontactos[i].idlingua != "" && novoscontactos[i].idlingua != null) {

                            const upload2 = {

                                REL_PESSOA_ENTIDADE_ID: response.data.ID,
                                PR_LINGUA_ID: novoscontactos[i].idlingua,
                                PR_NIVEL_LINGUISTICO_ID: novoscontactos[i].idnivel != "" ? novoscontactos[i].idnivel : nivellist[0].ID,



                            }

                            try {

                                const response2 = await api.post('/sgigjrelpessoaentidadelingua', upload2);


                            } catch (err) {

                                console.error(err.response)

                            }

                        }


                    }
                    setIsLoading(false)

                    setIsOpen(false)

                }

            } catch (err) {
                setIsLoading(false)

                console.error(err.response)

            }


        }





    }



    //----------------------------------------------









    //-------------- Ver -------------------------



    const openVerHandler = async (idx) => {
        setIsEditarOpen(false);
        setIsOpen(false);
        setverlistgp("dados")


        try {

            const response = await api.get('/sgigjrelpessoaentidade/' + idx.ID);

            if (response.status == '200') {

                if (response.data.length > 0) {


                    setVerOpen(true);
                    setIsEditarOpen(false);
                    setIsOpen(false);

                    for (var i = 0; i < response.data[0].sgigjpessoa.sgigjrelcontacto.length; i++) {

                        const e = response.data[0].sgigjpessoa.sgigjrelcontacto[i];

                        if (e.sgigjprcontactotp.DESIG == "Telefone") response.data[0].TEL = e.CONTACTO
                        if (e.sgigjprcontactotp.DESIG == "Telemóvel") response.data[0].TEM = e.CONTACTO
                        if (e.sgigjprcontactotp.DESIG == "Email") response.data[0].EMAIL = e.CONTACTO


                    }


                    var doclist = []

                    for (let ix = 0; ix < response.data[0].sgigjpessoa.sgigjreldocumento.length; ix++) {

                        doclist.push({
                            id: response.data[0].sgigjpessoa.sgigjreldocumento[ix].ID,
                            nome: response.data[0].sgigjpessoa.sgigjreldocumento[ix].sgigjprdocumentotp.DESIG
                        })

                    }

                    response.data[0].doclist = doclist

                    response.data[0].INICIO = response.data[0].DT_INICIO != null ? response.data[0].DT_INICIO.substring(0, 10) : ""
                    response.data[0].FIM = response.data[0].DT_FIM != null ? response.data[0].DT_FIM.substring(0, 10) : ""
                    response.data[0].NASC = response.data[0].sgigjpessoa.DT_NASC != null ? response.data[0].sgigjpessoa.DT_NASC.substring(0, 10) : ""

                    setitemSelectedver(response.data[0])

                }


            }

        } catch (err) {

            console.error(err.response)
        }









    };



    //-----------------------------------------------'





    //-------------- EDITAR -------------------------

    const [linguaniveleditchange, setlinguaniveleditchange] = useState(false);


    const openEditHandler = async (idx) => {
        setIsOpen(false);
        setVerOpen(false);
        setitemSelected(idx)

        setID(idx.ID)
        setCODIGO(idx.CODIGO)

        setENTIDADE_ID(idx.ENTIDADE_ID)
        setPESSOA_ID(idx.PESSOA_ID)
        setPR_CATEGORIA_PROFISSIONAL_ID(idx.PR_CATEGORIA_PROFISSIONAL_ID)
        setPR_NIVEL_ESCOLARIDADE_ID(idx.PR_NIVEL_ESCOLARIDADE_ID)
        setDT_INICIO(idx.DT_INICIO.slice(0, 10))
        setDT_FIM(idx.DT_FIM.slice(0, 10))

        setActiveProfileTab('colaboradores')
        setlinguaniveleditchange(true)


        setnovoscontactos([{
            id: "" + Math.random(),
            idlingua: "",
            idnivel: "",
        }])

        novoscontactos = []


        try {

            const response = await api.get('/sgigjrelpessoaentidadelingua?REL_PESSOA_ENTIDADE_ID=' + idx.ID);

            if (response.status == '200') {

                for (let i = 0; i < response.data.length; i++) {

                    novoscontactos.push({

                        id: "" + response.data[i].ID,
                        idlingua: "" + response.data[i].PR_LINGUA_ID,
                        idnivel: "" + response.data[i].PR_NIVEL_LINGUISTICO_ID,

                    })



                }

            }


        } catch (err) {

            console.error(err.response)

        }





        let newarray = []

        console.log(pessoalistOrigin)

        for (var i = 0; i < pessoalistOrigin.length; i++) {

            let newitem = pessoalistOrigin[i]


            if (pessoalistOrigin[i].sgigjrelpessoaentidade.length == 0) {

                newarray.push(newitem)

            }



            if (pessoalistOrigin[i].ID == idx?.PESSOA_ID) {

                newarray.push(newitem)

            }

            console.log("sdsd")


        }

        setpessoalist(newarray)

        console.log(newarray)






        setnovoscontactos(novoscontactos.concat([]))
        setIsEditarOpen(true);



    };







    async function editarItemGO(event) {

        event.preventDefault();

        setIsLoading(true)

        if (PESSOA_ID == null || PESSOA_ID == "") popUp_alertaOK("Escolha uma Pessoa"); else {


            var upload = {

                PR_CATEGORIA_PROFISSIONAL_ID,
                PR_NIVEL_ESCOLARIDADE_ID,
                DT_INICIO,
                DT_FIM,
                OBS,


                ENTIDADE_ID: id_params == 0 ? ENTIDADE_ID : id_params,

            }

            if (PESSOA_ID != itemSelected.PESSOA_ID) {

                upload.PESSOA_ID = PESSOA_ID

            }



            try {

                const response = await api.put('/sgigjrelpessoaentidade/' + itemSelected.ID, upload);

                if (response.status == '200') {

                    uploadlist()
                    uploadpessoa()
                    setIsLoading(false)
                    setIsEditarOpen(false)

                    if (linguaniveleditchange == true) {


                        const response2x = await api.delete('/sgigjrelpessoaentidadelingua/' + itemSelected.ID);


                        if (response2x.status == '200' || response2x.status == '204') {


                            for (let i = 0; i < novoscontactos.length; i++) {

                                if (novoscontactos[i].idlingua != "" && novoscontactos[i].idlingua != null) {

                                    const upload2 = {

                                        REL_PESSOA_ENTIDADE_ID: itemSelected.ID,
                                        PR_LINGUA_ID: novoscontactos[i].idlingua,
                                        PR_NIVEL_LINGUISTICO_ID: novoscontactos[i].idnivel != "" ? novoscontactos[i].idnivel : nivellist[0].ID,



                                    }

                                    try {

                                        const response2 = await api.post('/sgigjrelpessoaentidadelingua', upload2);


                                    } catch (err) {
                                        setIsLoading(false)

                                        console.error(err.response)

                                    }

                                }


                            }


                        }




                    }

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

            const response = await api.delete('/sgigjrelpessoaentidade/' + idx);


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
            uploadprofissionallist()
            uploadentidadelist()

            uploadpessoa()
            uplaodescolaridadelist()

            uploadlingua()
            uploadnivellist()

            uploadgenerolist()
            uploadestadocivil()
            uploadglbgeografia()
            uploadcontactolist()
            uploaddocumentolist()

        }

    }, [])








    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [isNewentidade, setisNewentidade] = useState(false);



    const [activeProfileTab, setActiveProfileTab] = useState('colaboradores');

    const profileTabClass = 'nav-link text-reset';
    const profileTabActiveClass = 'nav-link text-reset active';








    //--------------- Criar Escolaridade ----------------

    function operescolaridade() {

        setisescolaridadeopen(true)

        setDESIG_E("")
        setOBS_E("")

    }

    const [isescolaridadeopen, setisescolaridadeopen] = useState(false);

    const [DESIG_E, setDESIG_E] = useState("");
    const [OBS_E, setOBS_E] = useState("");


    async function criarEscolaridadeGO(event) {

        event.preventDefault();


        const upload = {

            DESIG: DESIG_E,
            OBS: OBS_E,


        }



        try {

            const response = await api.post('/gigjprcategoriaprofissional', upload);

            if (response.status == '200') {

                uplaodescolaridadelist()
                setisescolaridadeopen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }



    //--------------- Criar Profissional ----------------

    function openprofisional() {

        setisprofissionalopen(true)

        setDESIG_P("")
        setOBS_P("")

    }

    const [isprofissionalopen, setisprofissionalopen] = useState(false);

    const [DESIG_P, setDESIG_P] = useState("");
    const [OBS_P, setOBS_P] = useState("");


    async function criarprofissionalGO(event) {

        event.preventDefault();


        const upload = {

            DESIG: DESIG_P,
            OBS: OBS_P,


        }


        try {

            const response = await api.post('/sgigjprcategoriaprofissional', upload);

            if (response.status == '200') {

                uploadprofissionallist()
                setisprofissionalopen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }


    // ---------------- Lingua ------------


    var [novoscontactos, setnovoscontactos] = useState([{
        id: "" + Math.random(),
        idlingua: "",
        idnivel: "",
    }]);



    function addnovoscontactos() {

        if (novoscontactos.length < lingualist.length)

            setnovoscontactos(novoscontactos.concat([{
                id: "" + Math.random(),
                idlingua: "",
                idnivel: "",
            }]))


    }


    function removenovoscontactos(id) {

        if (novoscontactos.length > 1) {


            const indexx = novoscontactos.findIndex(x => x.id === id);

            if (indexx > -1) {

                var newArr = novoscontactos
                newArr.splice(indexx, 1)
                setnovoscontactos(newArr.concat([]))


            }


        }

        setlinguaniveleditchange(true)

    }

    function criarlingua(lingua, id) {

        const indexx = novoscontactos.findIndex(x => x.id === id);

        novoscontactos[indexx] = {
            id: id,
            idlingua: lingua,
            idnivel: novoscontactos[indexx].idlingua
        }

        setlinguaniveleditchange(true)

        setnovoscontactos(novoscontactos.concat([]))


    }



    function criarnivel(nivel, id) {

        const indexx = novoscontactos.findIndex(x => x.id === id);

        novoscontactos[indexx] = {
            id: id,
            idnivel: nivel,
            idlingua: novoscontactos[indexx].idlingua
        }

        setlinguaniveleditchange(true)

        setnovoscontactos(novoscontactos.concat([]))

    }

    function isonlingualist(id, idlist) {

        let res = false


        for (let i = 0; i < novoscontactos.length; i++) {

            if (novoscontactos[i].idlingua == id && idlist != novoscontactos[i].id) {
                res = true
            }

        }

        return res

    }


    const [verlistgp, setverlistgp] = useState("dados");




    //---------------- cria pessoa ------------

    const [pessoaopen, setpessoaopen] = useState({ code: 0, value: false });



    const openpessoafunction = () => {


        setpessoaopen({ code: pessoaopen.code + 1, value: true });



    };





    //------------------------------------



    return (<>

        {/* <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <div className="page-header-title">
                            <h5 className="m-b-10">Colaboradores</h5>
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
                                <Link to='#'>Colaboradores</Link>
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
                            <Table catProf={profissionallist} columns={columns} data={newdata} modalOpen={openHandler} />
                        </Card.Body>
                    </Card>



                    <Modal size='x' show={isOpen} onHide={() => setIsOpen(false)}>
                        <Modal.Header style={{ border: "0" }} closeButton>
                            <Modal.Title as="h5">Criar</Modal.Title>
                        </Modal.Header>


                        <ul className="nav nav-tabs profile-tabs nav-fill" id="myTab" role="tablist">
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'colaboradores' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('colaboradores') }} id="profile-tab"><i className="feather icon-user mr-2" />Colaborador</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'lingua' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('lingua') }} id="contact-tab"><i className="feather icon-anchor mr-2" />Língua</Link>
                            </li>


                        </ul>


                        <Modal.Body style={activeProfileTab === 'lingua' ? {} : { display: "none" }}>

                            <Col style={{ display: "flex", justifyContent: "flex-end" }} sm={12}>

                                <Button onClick={() => addnovoscontactos()} variant="primary">+</Button>

                            </Col>


                            {novoscontactos.map(eq => (

                                <Row style={{ marginBottom: "12px" }} key={eq.id}>


                                    <Col sm={5}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Phone">Língua <span style={{ color: "red" }} >*</span></label>
                                            <select onChange={event => { criarlingua(event.target.value, eq.id) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {



                                                    lingualist.map(e => (

                                                        isonlingualist(e.ID, eq.id) ?

                                                            null :

                                                            <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))

                                                }



                                            </select>
                                        </div>

                                    </Col>
                                    <Col sm={5}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Nível Linguístico <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={nivellist.length > 0 ? nivellist[0].ID : null} onChange={event => { criarnivel(event.target.value, eq.id) }} className="form-control" id="perfil" required aria-required="true">


                                                {nivellist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}

                                            </select>
                                        </div>
                                    </Col>

                                    {novoscontactos.length > 1 ?
                                        <div className='sm-2 paddinhtop28OnlyPC' >
                                            <Button onClick={() => removenovoscontactos(eq.id)} variant="danger"><i className="feather icon-trash-2" /></Button>
                                        </div>
                                        : null}


                                </Row>
                            ))}




                        </Modal.Body>

                        {/* --------------------Criar Item------------------- */}


                        <Modal.Body style={activeProfileTab === 'colaboradores' ? {} : { display: "none" }} >

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



                                    <Col sm={12}>

                                        <label className="floating-label" htmlFor="text">Pessoa <span style={{ color: "red" }} >*</span></label>

                                        <div style={{ display: "flex" }} >
                                            <div className="form-group fill" style={{ width: "100%" }} >



                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    onChange={event => setPESSOA_ID(event.value)}
                                                    name="pessoa"
                                                    options={pessoalist}
                                                    defaultValue={PESSOA_ID}
                                                    required
                                                    menuPlacement="auto"
                                                    menuPosition="fixed"
                                                    placeholder="Pessoa..."
                                                />



                                            </div>

                                            <Button onClick={() => openpessoafunction()} style={{ marginLeft: "8px", height: "38px" }} variant="primary"><i className="feather icon-plus" /></Button>

                                        </div>


                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Nível Escolaridade <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setPR_NIVEL_ESCOLARIDADE_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>


                                                    {escolaridadelist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}


                                                </select>

                                                {taskEnable("/configuracao/nivelescolaridade", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => operescolaridade()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }
                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Categoria Profissional <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select onChange={event => { setPR_CATEGORIA_PROFISSIONAL_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {profissionallist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/categoriaprofissional", permissoes, "Criar") == false ? null :

                                                    <Button onClick={() => openprofisional()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>

                                                }

                                            </span>

                                        </div>
                                    </Col>




                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Início <span style={{ color: "red" }} >*</span></label>
                                            <input type="date" onChange={event => { setDT_INICIO(event.target.value) }} defaultValue={""} className="form-control" placeholder="Data..." required />
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Fim </label>
                                            <input type="date" onChange={event => { setDT_FIM(event.target.value) }} defaultValue={""} className="form-control" placeholder="Data..." />
                                        </div>
                                    </Col>


                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Observação</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setOBS(event.target.value) }} defaultValue={""} rows="3" placeholder='Observação...' />
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


                        <ul className="nav nav-tabs profile-tabs nav-fill" id="myTab" role="tablist">
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'colaboradores' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('colaboradores') }} id="profile-tab"><i className="feather icon-user mr-2" />Colaborador</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'lingua' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('lingua') }} id="contact-tab"><i className="feather icon-anchor mr-2" />Língua</Link>
                            </li>


                        </ul>


                        <Modal.Body style={activeProfileTab === 'lingua' ? {} : { display: "none" }}>

                            <Col style={{ display: "flex", justifyContent: "flex-end" }} sm={12}>

                                <Button onClick={() => addnovoscontactos()} variant="primary">+</Button>

                            </Col>


                            {novoscontactos.map(eq => (

                                <Row style={{ marginBottom: "12px" }} key={eq.id}>


                                    <Col sm={5}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Phone">Língua <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={eq.idlingua} onChange={event => { criarlingua(event.target.value, eq.id) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {



                                                    lingualist.map(e => (

                                                        isonlingualist(e.ID, eq.id) ?

                                                            null :

                                                            <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))

                                                }



                                            </select>
                                        </div>

                                    </Col>
                                    <Col sm={5}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Nível Linguístico <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={eq.idnivel} onChange={event => { criarnivel(event.target.value, eq.id) }} className="form-control" id="perfil" required aria-required="true">


                                                {nivellist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}

                                            </select>
                                        </div>
                                    </Col>

                                    {novoscontactos.length > 1 ?
                                        <div className='sm-2 paddinhtop28OnlyPC' >
                                            <Button onClick={() => removenovoscontactos(eq.id)} variant="danger"><i className="feather icon-trash-2" /></Button>
                                        </div>
                                        : null}


                                </Row>
                            ))}




                        </Modal.Body>



                        {/* --------------------Editar Item------------------- */}


                        <Modal.Body style={activeProfileTab === 'colaboradores' ? {} : { display: "none" }} >


                            <form id="editarItem" onSubmit={editarItemGO} >

                                <Row>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled type="text" className="form-control" id="Name" value={itemSelected.CODIGO} required />
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



                                    <Col sm={12}>

                                        <label className="floating-label" htmlFor="text">Pessoa <span style={{ color: "red" }} >*</span></label>

                                        <div style={{ display: "flex" }} >
                                            <div className="form-group fill" style={{ width: "100%" }} >



                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    onChange={event => setPESSOA_ID(event.value)}
                                                    name="pessoa"
                                                    options={pessoalist}
                                                    defaultValue={

                                                        pessoalist.map(p => (

                                                            p.ID == PESSOA_ID ? p : null

                                                        ))

                                                    }
                                                    required
                                                    menuPlacement="auto"
                                                    menuPosition="fixed"
                                                    placeholder="Pessoa..."
                                                />




                                            </div>

                                            <Button onClick={() => openpessoafunction()} style={{ marginLeft: "8px", height: "38px" }} variant="primary"><i className="feather icon-plus" /></Button>

                                        </div>

                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Nível Escolaridade <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={itemSelected.PR_NIVEL_ESCOLARIDADE_ID} onChange={event => { setPR_NIVEL_ESCOLARIDADE_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>


                                                    {escolaridadelist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}


                                                </select>

                                                {taskEnable("/configuracao/nivelescolaridade", permissoes, "Criar") == false ? null :
                                                    <Button onClick={() => operescolaridade()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>
                                                }

                                            </span>

                                        </div>
                                    </Col>


                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Categoria Profissional <span style={{ color: "red" }} >*</span></label>

                                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                                                <select defaultValue={itemSelected.PR_CATEGORIA_PROFISSIONAL_ID} onChange={event => { setPR_CATEGORIA_PROFISSIONAL_ID(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                    <option hidden value="">--- Selecione ---</option>

                                                    {profissionallist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}

                                                </select>

                                                {taskEnable("/configuracao/categoriaprofissional", permissoes, "Criar") == false ? null :

                                                    <Button onClick={() => openprofisional()} style={{ marginLeft: "8px" }} variant="primary"><i className="feather icon-plus" /></Button>

                                                }

                                            </span>

                                        </div>
                                    </Col>




                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Início <span style={{ color: "red" }} >*</span></label>
                                            <input type="date" defaultValue={DT_INICIO} onChange={event => { setDT_INICIO(event.target.value) }} className="form-control" placeholder="Data..." required />
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Name">Data Fim</label>
                                            <input type="date" defaultValue={DT_FIM} onChange={event => { setDT_FIM(event.target.value) }} className="form-control" placeholder="Data..." />
                                        </div>
                                    </Col>


                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Observação</label>
                                            <textarea maxLength="64000" defaultValue={itemSelected.OBS} className="form-control" onChange={event => { setOBS(event.target.value) }} rows="3" placeholder='Observação...' />
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

                    <Modal size='lg' show={isVerOpen} onHide={() => setVerOpen(false)}>
                        <Modal.Header style={{ border: "0" }} closeButton>
                            <Modal.Title as="h5">Colaborador</Modal.Title>
                        </Modal.Header>

                        {Object.keys(itemSelectedver).length === 0 ? null :


                            <Modal.Body>
                                <Row>
                                    <Col xl={4} className='task-detail-right'>


                                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

                                            <span><i className="feather icon-user m-r-5" />Geral</span>

                                        </div>

                                        <div style={{ width: "100%", display: "flex", alignItems: "center", marginBottom: "20px", flexDirection: "column", borderBottom: "1px solid #d2b32a", borderTop: "1px solid #d2b32a", paddingBottom: "15px", paddingTop: "15px", marginTop: "5px" }}>

                                            <img src={imgperilview} style={{ borderRadius: "50%", width: "100px", height: "100px", marginBottom: "10px" }} alt="" />
                                            <span>{itemSelectedver.sgigjpessoa.NOME}</span>

                                        </div>


                                        <div style={{ borderBottom: "1px solid #d2b32a", marginBottom: "20px" }}>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span ><i className="feather icon-map-pin m-r-5" />Gênero</span>

                                                <span style={{ color: "#6c757d" }}>{itemSelectedver.sgigjpessoa.sgigjprgenero.DESIG}</span>

                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Estado Civil</span>

                                                <span style={{ color: "#6c757d" }}>{itemSelectedver.sgigjpessoa.sgigjprestadocivil.DESIG}</span>


                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Dt. Nascimento</span>
                                                <span style={{ color: "#6c757d" }}>{itemSelectedver.NASC}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Observações</span>
                                                <span style={{ color: "#6c757d" }}>{itemSelectedver.sgigjpessoa.OBS}</span>
                                            </div>

                                        </div>

                                        <div style={{ borderBottom: "1px solid #d2b32a", marginBottom: "20px" }}>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Endereço</span>
                                                <span style={{ color: "#6c757d" }}>{itemSelectedver.sgigjpessoa.ENDERECO}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Localidade</span>
                                                <span style={{ color: "#6c757d" }}>{itemSelectedver.sgigjpessoa.localidade.NOME}</span>
                                            </div>


                                        </div>


                                        <div >

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-phone m-r-5" />Telefone</span>
                                                <span style={{ color: "#6c757d" }}>{itemSelectedver.TEL}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-phone m-r-5" />Telemóvel</span>
                                                <span style={{ color: "#6c757d" }}>{itemSelectedver.TEM}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-mail m-r-5" />Email</span>
                                                <span style={{ color: "#6c757d" }}>{itemSelectedver.EMAIL}</span>
                                            </div>


                                        </div>



                                    </Col>



                                    <Col xl={8} className='task-detail-right'>


                                        <div style={{ width: "100%", display: "flex", justifyContent: "spaceAround" }}>

                                            <span onClick={() => setverlistgp("dados")}

                                                style={verlistgp == "dados" ? { paddingBottom: "4px", cursor: "pointer", borderBottom: "2px solid #d2b32a", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" } : { paddingBottom: "4px", cursor: "pointer", borderBottom: "1px solid #E5E5E5", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}

                                            ><i className="feather icon-user m-r-5" />Dados</span>

                                            <span onClick={() => setverlistgp("lingua")}

                                                style={verlistgp == "lingua" ? { paddingBottom: "4px", cursor: "pointer", borderBottom: "2px solid #d2b32a", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" } : { paddingBottom: "4px", cursor: "pointer", borderBottom: "1px solid #E5E5E5", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}

                                            ><i className="feather icon-anchor m-r-5" />Língua</span>

                                            <span onClick={() => setverlistgp("documentos")}

                                                style={verlistgp == "documentos" ? { paddingBottom: "4px", cursor: "pointer", borderBottom: "2px solid #d2b32a", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" } : { paddingBottom: "4px", cursor: "pointer", borderBottom: "1px solid #E5E5E5", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}

                                            ><i className="feather icon-minimize-2 m-r-5" />Documentos</span>


                                        </div>

                                        <div style={verlistgp != "documentos" ? { flexWrap: "wrap", width: "100%", display: "flex", borderBottom: "1px solid #d2b32a", flexDirection: "row", paddingBottom: "40px", paddingTop: "15px", marginTop: "5px" } : { display: "none" }} />






                                        <div style={verlistgp == "dados" ? {
                                            width: "100%",
                                            height: "450px",
                                        } : { display: "none" }}>

                                            <div style={{
                                                width: "100%",
                                                borderBottom: "1px solid #E5E5E5",
                                                paddingTop: "20px"
                                            }}>

                                                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                    <span><i className="feather icon-map-pin m-r-5" />Categoria Profissional</span>
                                                    <span style={{ color: "#6c757d" }}>{itemSelectedver.sgigjprcategoriaprofissional.DESIG}</span>
                                                </div>

                                                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                    <span><i className="feather icon-map-pin m-r-5" />Nível de Escolaridade</span>
                                                    <span style={{ color: "#6c757d" }}>{itemSelectedver.sgigjprnivelescolaridade.DESIG}</span>
                                                </div>

                                                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                    <span><i className="feather icon-map-pin m-r-5" />Data Início</span>
                                                    <span style={{ color: "#6c757d" }}>{itemSelectedver.INICIO}</span>
                                                </div>

                                                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                    <span><i className="feather icon-map-pin m-r-5" />Data Fim</span>
                                                    <span style={{ color: "#6c757d" }}>{itemSelectedver.FIM}</span>
                                                </div>


                                            </div>




                                        </div>






                                        <div style={verlistgp == "lingua" ? {
                                            width: "100%",
                                            height: "450px",
                                            overflow: "auto"

                                        } : { display: "none" }}>

                                            {itemSelectedver.sgigjrelpessoaentidadelingua.map(e => (

                                                <div style={{
                                                    width: "100%",
                                                    borderBottom: "1px solid #E5E5E5",
                                                    paddingTop: "20px"
                                                }}>

                                                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                        <span><i className="feather icon-map-pin m-r-5" />Língua</span>
                                                        <span style={{ color: "#6c757d" }}>{e.sgigjprlingua.DESIG}</span>
                                                    </div>

                                                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                        <span><i className="feather icon-map-pin m-r-5" />Nível Linguístico</span>
                                                        <span style={{ color: "#6c757d" }}>{e.sgigjprnivellinguistico.DESIG}</span>
                                                    </div>


                                                </div>

                                            ))}

                                        </div>


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
                                                    typeof itemSelectedver.doclist != "undefined" ?

                                                        itemSelectedver.doclist.map(e => (

                                                            <Link key={e.id} style={{ margin: "2px" }} to='#' className="mb-1 text-muted d-flex align-items-end text-h-primary">{"::" + e.nome}</Link>

                                                        ))

                                                        : null

                                                }



                                            </div>



                                            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "10px" }}>

                                                <span><i className="feather icon-eye m-r-5" />Pré-vizualização</span>

                                            </div>

                                            <div className='previewdoc' style={{ borderRadius: "8px", border: "1px solid #bcbcbc", width: "100%", height: "400px" }}>

                                            </div>




                                        </div>





                                    </Col>
                                </Row>
                            </Modal.Body>

                        }
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setVerOpen(false)}>Fechar</Button>
                            <Button variant="primary" onClick={() => openEditHandler(itemSelectedver)}>Editar</Button>
                        </Modal.Footer>



                    </Modal>




                    {/* --------------------Criar escolaridade------------------- */}

                    <Modal size='x' show={isescolaridadeopen} onHide={() => setisescolaridadeopen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar Nível Escolaridade</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criarescolaridade" onSubmit={criarEscolaridadeGO} >

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
                                            <input maxLength="128" type="text" onChange={event => { setDESIG_E(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setOBS_E(event.target.value) }} defaultValue={""} rows="3" placeholder='Descrição...' />
                                        </div>
                                    </div>


                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setisescolaridadeopen(false)}>Fechar</Button>
                            <Button type="submit" form="criarescolaridade" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>





                    {/* --------------------Criar profissional------------------- */}

                    <Modal size='x' show={isprofissionalopen} onHide={() => setisprofissionalopen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Criar Categoria Profissional</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="newuserbox" >

                            <form id="criaprofissional" onSubmit={criarprofissionalGO} >

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
                                            <input maxLength="128" type="text" onChange={event => { setDESIG_P(event.target.value) }} defaultValue={""} className="form-control" placeholder="Designação..." required />
                                        </div>
                                    </Col>

                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Descrição</label>
                                            <textarea maxLength="64000" className="form-control" onChange={event => { setOBS_P(event.target.value) }} defaultValue={""} rows="3" placeholder='Descrição...' />
                                        </div>
                                    </div>


                                </Row>

                            </form>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setisprofissionalopen(false)}>Fechar</Button>
                            <Button type="submit" form="criaprofissional" variant="primary">Guardar</Button>
                        </Modal.Footer>
                    </Modal>


                    <CriarPessoa generolist={generolist} estadocivillist={estadocivillist} glbgeografialist={glbgeografialist} documentolist={documentolist} contactolist={contactolist} pessoaopenDO={pessoaopen} uploadpessoa={uploadpessoa} />






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
export default Colaboradores;