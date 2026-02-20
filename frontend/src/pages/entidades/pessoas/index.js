import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import imgperilview from '../../../assets/images/user/sample-user.png';

import { Link } from 'react-router-dom';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";


import api from '../../../services/api';


import useAuth from '../../../hooks/useAuth';


import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle } from '../../../functions';



function Table({ columns, data, modalOpen }) {

    const { permissoes } = useAuth();

    const pageAcess = "/entidades/pessoas"


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



    const history = useHistory();

    const { permissoes } = useAuth();

    const pageAcess = "/entidades/pessoas"

    const [itemlist, setitemlist] = useState({});

    useEffect(() => {
        uploadlist()
    }, [])

    useEffect(() => {
        setimgprev(typeof itemlist.doclist != "undefined" ? itemlist?.doclist[0]?.url : "")


        if (pageEnable(pageAcess, permissoes) == false) history.push('/')

        else {

            uploadgenerolist()
            uploadestadocivil()
            uploadglbgeografia()
            uploadcontactolist()
            uploaddocumentolist()

        }


    }, [itemlist])









    const { popUp_removerItem, popUp_alertaOK } = useAuth();



    const columns = React.useMemo(
        () => [
            {
                Header: 'Código',
                accessor: 'CODIGO',
                centered: false
            },

            {
                Header: 'Nome',
                accessor: 'NOME',
                centered: true
            },

            {
                Header: 'Email',
                accessor: 'EMAIL',
                centered: true
            },
            {
                Header: 'Estado civil',
                accessor: 'estadocivilSOLVE',
                centered: true
            },
            {
                Header: 'Data Nascimento',
                accessor: 'DT_NASCISMENTO',
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

        if (data == null) return


        return new Date(data).toISOString().slice(0, 10)



    }




    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    async function uploadlist() {

        if (taskEnable(pageAcess, permissoes, "Ler"))

            try {

                const response = await api.get('/sgigjpessoa');

                if (response.status == '200') {

                    for (var i = 0; i < response.data.length; i++) {

                        const idx = response.data[i].ID

                        response.data[i].id = response.data[i].ID
                        response.data[i].estadocivilSOLVE = response.data[i].sgigjprestadocivil.DESIG
                        response.data[i].generoSOLVE = response.data[i].sgigjprgenero.DESIG
                        response.data[i].DT_NASCISMENTO = createDate1(response.data[i].DT_NASC)

                        for (let ix = 0; ix < response.data[i].sgigjrelcontacto.length; ix++) {


                            if (typeof response.data[i].sgigjrelcontacto[ix].sgigjprcontactotp.DESIG != "undefined") {


                                if (response.data[i].sgigjrelcontacto[ix].sgigjprcontactotp.DESIG == "Email") {

                                    response.data[i].EMAIL = response.data[i].sgigjrelcontacto[ix].CONTACTO

                                }

                            }

                        }

                        response.data[i].action =
                            <React.Fragment>

                                {taskEnable(pageAcess, permissoes, "Ler") == false ? null :
                                    <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Ler")} onClick={() => openVerHandler(idx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Ler")} /></Link>
                                }

                                {taskEnable(pageAcess, permissoes, "Editar") == false ? null :
                                    <Link to='#' title={taskEnableTitle(pageAcess, permissoes, "Editar")} onClick={() => openEditHandler(idx)} className="text-primary mx-1"><i className={"text-primary " + taskEnableIcon(pageAcess, permissoes, "Editar")} /></Link>
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

    //   /entidades/pessoas














    //-------------------------------------------------------












    const [ID_C, setID_C] = useState("");
    const [CODIGO_C, setCODIGO_C] = useState("");
    const [NACIONALIDADE_ID_C, setNACIONALIDADE_ID_C] = useState("");
    const [LOCALIDADE_ID_C, setLOCALIDADE_ID_C] = useState("");
    const [PR_ESTADO_CIVIL_ID_C, setPR_ESTADO_CIVIL_ID_C] = useState("");
    const [PR_GENERO_ID_C, setPR_GENERO_ID_C] = useState("");
    const [NOME_C, setNOME_C] = useState("");
    const [DT_NASC_C, setDT_NASC_C] = useState("");
    const [ALCUNHA_C, setALCUNHA_C] = useState("");
    const [NOME_PAI_C, setNOME_PAI_C] = useState("");
    const [NOME_MAE, setNOME_MAE] = useState("");
    const [OBS_C, setOBS_C] = useState("");
    const [ENDERECO_C, setENDERECO_C] = useState("");
    const [ENDERECO_COORD_C, setENDERECO_COORD_C] = useState("");

    const [NIF_C, setNIF_C] = useState("");
    const [SEM_NIF, setSEM_NIF] = useState(false);

    const [ILHA, setILHA] = useState("");
    const [CONCELHO, setCONCELHO] = useState("");
    const [FREGUESIA, setFREGUESIA] = useState("");

    const [imgprev, setimgprev] = useState("");

    const [index, setIndex] = useState(0);


    //-------------- CRIAR -------------------------



    const openHandler = () => {

        setCODIGO_C("")
        setNACIONALIDADE_ID_C("")
        setLOCALIDADE_ID_C("")
        setPR_ESTADO_CIVIL_ID_C("")
        setPR_GENERO_ID_C("")
        setNOME_C("")
        setDT_NASC_C("")
        setALCUNHA_C("")
        setNOME_PAI_C("")
        setNOME_MAE("")
        setOBS_C("")
        setENDERECO_C("")
        setENDERECO_COORD_C("")

        setNIF_C("")

        setILHA("");
        setCONCELHO("");
        setFREGUESIA("");


        setIsOpen(true);
        setIsEditarOpen(false);
        setVerOpen(false);

        setActiveProfileTab('geral')


        setnovoscontactos([{
            id: "" + Math.random(),
            tipocontacto: "",
            contacto: "",
        }])



        setnovosdocumentos([{
            id: "" + Math.random(),
            tipodocumento: "",
            numero: "",
            dataemissao: "",
            datavalidade: "",
            anexo: { type: 0, file: null },
        }])


    };





    async function criar(event) {

        event.preventDefault();
        setIsLoading(true)
        const upload = {

            NACIONALIDADE_ID: NACIONALIDADE_ID_C,
            LOCALIDADE_ID: LOCALIDADE_ID_C,
            PR_ESTADO_CIVIL_ID: PR_ESTADO_CIVIL_ID_C,
            PR_GENERO_ID: PR_GENERO_ID_C,
            NOME: NOME_C,
            DT_NASC: DT_NASC_C,
            ALCUNHA: ALCUNHA_C,
            NOME_PAI: NOME_PAI_C,
            NOME_MAE: NOME_MAE,
            OBS: OBS_C,
            ENDERECO: ENDERECO_C,
            ENDERECO_COORD: ENDERECO_COORD_C,
            NIF: SEM_NIF ? "" : NIF_C,

        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjpessoa', upload);

            if (response.status == '200') {


                for (let i = 0; i < novoscontactos.length; i++) {

                    if (novoscontactos[i].tipocontacto != "" && novoscontactos[i].contacto != "") {

                        console.log(novoscontactos)

                        const upload2 = {

                            PESSOA_ID: response.data.ID,
                            PR_CONTACTO_TP_ID: novoscontactos[i].tipocontacto,
                            CONTACTO: novoscontactos[i].contacto,



                        }

                        try {

                            const response2 = await api.post('/sgigjrelcontacto', upload2);


                        } catch (err) {

                            console.error(err.response)

                        }

                    }


                }



                for (let i = 0; i < novosdocumentos.length; i++) {

                    if (novosdocumentos[i].tipodocumento != "" && novosdocumentos[i].numero != "") {

                        console.log(novosdocumentos)

                        var anexofile = ""

                        if (novosdocumentos[i].anexo.type == "1") {
                            anexofile = novosdocumentos[i].anexo.file
                        }

                        if (novosdocumentos[i].anexo.type == "2") {

                            const img = await onFormSubmitImage(novosdocumentos[i].anexo.file)

                            anexofile = img.file.data

                        }

                        console.log(anexofile)

                        const upload2 = {

                            PESSOA_ID: response.data.ID,
                            PR_DOCUMENTO_TP_ID: novosdocumentos[i].tipodocumento,
                            NUMERO: novosdocumentos[i].numero,
                            DOC_URL: anexofile,
                            DT_EMISSAO: novosdocumentos[i].dataemissao,
                            DT_VALIDADE: novosdocumentos[i].datavalidade,



                        }

                        try {

                            const response2 = await api.post('/sgigjreldocumento', upload2);


                        } catch (err) {

                            console.error(err.response)

                        }

                    }


                }


                uploadlist()
                setIsLoading(false)
                setIsOpen(false)

            }

        } catch (err) {

            console.error(err.response)
            if (err.response.data.code == "3058") popUp_alertaOK("Esse NIF já existe")
            setIsLoading(false)

        }

    }


    //----------------------------------------------







    //-------------- EDITAR -------------------------


    const openEditHandler = async (idx) => {


        try {

            const response = await api.get('/sgigjpessoa/' + idx);

            console.log(response)

            if (response.status == '200') {

                if (response.data.length > 0) {



                    setID_C(idx)
                    setCODIGO_C(response.data[0].CODIGO)
                    setNACIONALIDADE_ID_C(response.data[0].NACIONALIDADE_ID)
                    setLOCALIDADE_ID_C(response.data[0].LOCALIDADE_ID)
                    setPR_ESTADO_CIVIL_ID_C(response.data[0].PR_ESTADO_CIVIL_ID)
                    setPR_GENERO_ID_C(response.data[0].PR_GENERO_ID)
                    setNOME_C(response.data[0].NOME)
                    setDT_NASC_C(createDate2(response.data[0].DT_NASC))
                    setALCUNHA_C(response.data[0].ALCUNHA)
                    setNOME_PAI_C(response.data[0].NOME_PAI)
                    setNOME_MAE(response.data[0].NOME_MAE)
                    setOBS_C(response.data[0].OBS)
                    setENDERECO_C(response.data[0].ENDERECO)
                    setENDERECO_COORD_C(response.data[0].ENDERECO_COORD)

                    setNIF_C(response.data[0].NIF)




                    const response3 = await api.get('/glbgeografia');

                    if (response3.status == '200') {

                        var ilhax = ""
                        var conselhox = ""
                        var freguesiax = ""


                        const listgeo = response3.data;

                        for (let i = 0; i < listgeo.length; i++) {

                            const e = listgeo[i]


                            if (e.ID == response.data[0].LOCALIDADE_ID) freguesiax = e.GLB_GEOG_ID

                        }

                        for (let i = 0; i < listgeo.length; i++) {

                            const e = listgeo[i]

                            if (e.ID == freguesiax) conselhox = e.GLB_GEOG_ID

                        }

                        for (let i = 0; i < listgeo.length; i++) {

                            const e = listgeo[i]

                            if (e.ID == conselhox) ilhax = e.GLB_GEOG_ID

                        }

                        setILHA(ilhax);
                        setCONCELHO(conselhox);
                        setFREGUESIA(freguesiax);


                    }









                    setIsOpen(false);
                    setVerOpen(false);


                    //console.log(createDate2(response.data[0].DT_NASC))

                }


            }

        } catch (err) {

            console.error(err.response)


        }


        setActiveProfileTab('geral')



        novoscontactos = []

        try {

            const response2 = await api.get('/sgigjrelcontacto?PESSOA_ID=' + idx);

            if (response2.status == '200') {

                for (let i = 0; i < response2.data.length; i++) {

                    novoscontactos.push({

                        id: "" + response2.data[i].ID,
                        tipocontacto: "" + response2.data[i].PR_CONTACTO_TP_ID,
                        contacto: "" + response2.data[i].CONTACTO,

                    })

                    console.log(response2.data)
                    console.log(response2.data[i])

                }

            }


        } catch (err) {

            console.error(err.response2)

        }

        setnovoscontactos(novoscontactos.concat([]))



        novosdocumentos = []


        try {

            const response3 = await api.get('/sgigjreldocumento?PESSOA_ID=' + idx);


            if (response3.status == '200') {


                for (let ix = 0; ix < response3.data.length; ix++) {

                    const DT_E = response3.data[ix].DT_EMISSAO != null ? response3.data[ix].DT_EMISSAO.substring(0, 10) : ""
                    const DT_V = response3.data[ix].DT_VALIDADE != null ? response3.data[ix].DT_VALIDADE.substring(0, 10) : ""

                    novosdocumentos.push({

                        id: "" + response3.data[ix].ID,
                        tipodocumento: response3.data[ix].PR_DOCUMENTO_TP_ID,
                        numero: response3.data[ix].NUMERO,
                        dataemissao: DT_E,
                        datavalidade: DT_V,
                        anexo: { type: 1, file: response3.data[ix].DOC_URL },

                    })

                    console.log(response3.data)
                    console.log(response3.data[ix])

                }

            }


        } catch (err) {

            console.error(err.response3)

        }

        setnovosdocumentos(novosdocumentos.concat([]))

        setIsEditarOpen(true);


        //setid(idx)
    };

    function putILHA(id) {

        setILHA(id)
        setCONCELHO("")
        setFREGUESIA("")
        setLOCALIDADE_ID_C("")


    }

    function putCONCELHO(id) {

        setCONCELHO(id)
        setFREGUESIA("")
        setLOCALIDADE_ID_C("")

    }

    function putFREGUESIA(id) {

        setFREGUESIA(id)
        setLOCALIDADE_ID_C("")


    }


    function selectDocTypeAndSetPrevImg(i, url) {
        setIndex(i)
        setimgprev(url)
    }

    async function editar(event) {

        event.preventDefault();

        setIsLoading(true)

        const upload = {

            NACIONALIDADE_ID: NACIONALIDADE_ID_C,
            LOCALIDADE_ID: LOCALIDADE_ID_C,
            PR_ESTADO_CIVIL_ID: PR_ESTADO_CIVIL_ID_C,
            PR_GENERO_ID: PR_GENERO_ID_C,
            NOME: NOME_C,
            DT_NASC: DT_NASC_C,
            ALCUNHA: ALCUNHA_C,
            NOME_PAI: NOME_PAI_C,
            NOME_MAE: NOME_MAE,
            OBS: OBS_C,
            ENDERECO: ENDERECO_C,
            ENDERECO_COORD: ENDERECO_COORD_C,
            NIF: SEM_NIF ? "" : NIF_C,
        }

        console.log(upload)


        try {

            const response = await api.put('/sgigjpessoa/' + ID_C, upload);

            if (response.status == '200') {



                if (contacedit == true) {


                    const response2x = await api.delete('/sgigjrelcontacto/0?PESSOA_ID=' + ID_C);

                    console.log(response2x.status)

                    if (response2x.status == '200' || response2x.status == '204') {

                        console.log(novoscontactos)

                        for (let i = 0; i < novoscontactos.length; i++) {

                            if (novoscontactos[i].tipocontacto != "" && novoscontactos[i].contacto != "") {

                                console.log(novoscontactos)

                                const upload2 = {

                                    PESSOA_ID: ID_C,
                                    PR_CONTACTO_TP_ID: novoscontactos[i].tipocontacto,
                                    CONTACTO: novoscontactos[i].contacto,



                                }

                                try {

                                    const response2 = await api.post('/sgigjrelcontacto', upload2);


                                } catch (err) {

                                    console.error(err.response)

                                }

                            }


                        }


                    }




                }





                if (docedit == true) {


                    const response2x = await api.delete('/sgigjreldocumento/0?PESSOA_ID=' + ID_C);

                    console.log(response2x.status)

                    if (response2x.status == '200' || response2x.status == '204') {

                        console.log(novoscontactos)



                        for (let i = 0; i < novosdocumentos.length; i++) {

                            if (novosdocumentos[i].tipodocumento != "" && novosdocumentos[i].numero != "") {

                                console.log(novosdocumentos)

                                var anexofile = ""

                                if (novosdocumentos[i].anexo.type == "1") {
                                    anexofile = novosdocumentos[i].anexo.file
                                }

                                if (novosdocumentos[i].anexo.type == "2") {

                                    const img = await onFormSubmitImage(novosdocumentos[i].anexo.file)

                                    anexofile = img.file.data

                                }

                                console.log(anexofile)

                                const upload2 = {

                                    PESSOA_ID: ID_C,
                                    PR_DOCUMENTO_TP_ID: novosdocumentos[i].tipodocumento,
                                    NUMERO: novosdocumentos[i].numero,
                                    DOC_URL: anexofile,
                                    DT_EMISSAO: novosdocumentos[i].dataemissao,
                                    DT_VALIDADE: novosdocumentos[i].datavalidade,



                                }

                                try {

                                    const response2 = await api.post('/sgigjreldocumento', upload2);


                                } catch (err) {

                                    console.error(err.response)

                                }

                            }


                        }



                    }




                }





                uploadlist()
                setIsLoading(false)

                setIsEditarOpen(false)

            }

        } catch (err) {

            console.error(err.response)
            if (err.response.data.code == "3058") popUp_alertaOK("Esse NIF já existe")
            setIsLoading(false)

        }





    }


    //----------------------------------------------



    //-------------- LER -------------------------




    const openVerHandler = async (idx) => {

        setimgprev("")

        try {

            const response = await api.get('/sgigjpessoa/' + idx);

            console.log(response)

            if (response.status == '200') {

                if (response.data.length > 0) {


                    for (let ix = 0; ix < response.data[0].sgigjrelcontacto.length; ix++) {

                        if (typeof response.data[0].sgigjrelcontacto[ix].sgigjprcontactotp.DESIG != "undefined") {


                            if (response.data[0].sgigjrelcontacto[ix].sgigjprcontactotp.DESIG == "Email") {

                                response.data[0].EMAIL = response.data[0].sgigjrelcontacto[ix].CONTACTO

                            }

                            if (response.data[0].sgigjrelcontacto[ix].sgigjprcontactotp.DESIG == "Telemóvel") {

                                response.data[0].TELEMOVEL = response.data[0].sgigjrelcontacto[ix].CONTACTO

                            }


                            if (response.data[0].sgigjrelcontacto[ix].sgigjprcontactotp.DESIG == "Telefone") {

                                response.data[0].TELEFONE = response.data[0].sgigjrelcontacto[ix].CONTACTO

                            }

                        }

                    }


                    var doclist = []

                    for (let ix = 0; ix < response.data[0].sgigjreldocumento.length; ix++) {

                        doclist.push({
                            id: response.data[0].sgigjreldocumento[ix].ID,
                            nome: response.data[0].sgigjreldocumento[ix].sgigjprdocumentotp.DESIG,
                            url: response.data[0].sgigjreldocumento[ix].DOC_URL,

                        })

                    }

                    let foto = null

                    if (response.data[0].sgigjrelpessoaentidade.length > 0) {

                        if (response.data[0].sgigjrelpessoaentidade[0].glbuser.length > 0) {

                            foto = response.data[0].sgigjrelpessoaentidade[0].glbuser[0].URL_FOTO


                        }



                    }


                    response.data[0].foto = foto

                    response.data[0].doclist = doclist

                    setitemlist(response.data[0])
                    setVerOpen(true);
                    setIsEditarOpen(false);
                    setIsOpen(false);
                }


            }

        } catch (err) {

            console.error(err.response)

        }


    };




    //-----------------------------------------------


    //-------------- Remover -------------------------


    const removeItemFunction = async (idx) => {

        let res = true

        try {

            const response = await api.delete('/sgigjpessoa/' + idx);


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





    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);







    function doNada() {

    }

    const [activeProfileTab, setActiveProfileTab] = useState('geral');

    const profileTabClass = 'nav-link text-reset';
    const profileTabActiveClass = 'nav-link text-reset active';

    var [novoscontactos, setnovoscontactos] = useState([{
        id: "" + Math.random(),
        tipocontacto: "",
        contacto: "",
    }]);



    function addnovoscontactos() {

        setnovoscontactos(novoscontactos.concat([{
            id: "" + Math.random(),
            tipocontacto: "",
            contacto: "",
        }]))

    }


    function removenovoscontactos(id) {

        if (novoscontactos.length > 1) {


            const indexx = novoscontactos.findIndex(x => x.id === id);
            //console.log(indexx)
            if (indexx > -1) {

                var newArr = novoscontactos
                newArr.splice(indexx, 1)
                setnovoscontactos(newArr.concat([]))

                setcontacedit(true)



            }



        }

    }




    const [contacedit, setcontacedit] = useState(false);

    function criartipocontacto(tipoc, id) {

        const indexx = novoscontactos.findIndex(x => x.id === id);

        novoscontactos[indexx] = {
            id: id,
            tipocontacto: tipoc,
            contacto: novoscontactos[indexx].contacto
        }

        setcontacedit(true)

        setnovoscontactos(novoscontactos.concat([]))


    }




    function criacontacto(conc, id) {

        const indexx = novoscontactos.findIndex(x => x.id === id);

        novoscontactos[indexx] = {
            id: id,
            contacto: conc,
            tipocontacto: novoscontactos[indexx].tipocontacto
        }

        setcontacedit(true)

        setnovoscontactos(novoscontactos.concat([]))


    }



    //-------------------- documento 



    var [novosdocumentos, setnovosdocumentos] = useState([{
        id: "" + Math.random(),
        tipodocumento: "",
        numero: "",
        dataemissao: "",
        datavalidade: "",
        anexo: { type: 0, file: null },
    }]);

    function addnovosdocumentos() {

        setnovosdocumentos(novosdocumentos.concat([{
            id: "" + Math.random(),
            tipodocumento: "",
            numero: "",
            dataemissao: "",
            datavalidade: "",
            anexo: { type: 0, file: null },
        }]))

    }


    function removenovosdocumentos(id) {

        if (novosdocumentos.length > 1) {


            const indexx = novosdocumentos.findIndex(x => x.id === id);
            //console.log(indexx)
            if (indexx > -1) {

                var newArr = novosdocumentos
                newArr.splice(indexx, 1)
                setnovosdocumentos(newArr.concat([]))

                setdocedit(true)

            }



        }

    }

    const [docedit, setdocedit] = useState(false);



    function criartipodoc(tipodoc, id) {

        const indexx = novosdocumentos.findIndex(x => x.id === id);

        novosdocumentos[indexx] = {

            id: id,

            tipodocumento: tipodoc,

            numero: novosdocumentos[indexx].numero,
            dataemissao: novosdocumentos[indexx].dataemissao,
            datavalidade: novosdocumentos[indexx].datavalidade,
            anexo: novosdocumentos[indexx].anexo,
        }

        setdocedit(true)

        setnovosdocumentos(novosdocumentos.concat([]))


    }



    function criardocnum(docnum, id) {

        const indexx = novosdocumentos.findIndex(x => x.id === id);

        novosdocumentos[indexx] = {

            id: id,

            numero: docnum,

            tipodocumento: novosdocumentos[indexx].tipodocumento,
            dataemissao: novosdocumentos[indexx].dataemissao,
            datavalidade: novosdocumentos[indexx].datavalidade,
            anexo: novosdocumentos[indexx].anexo,
        }

        setdocedit(true)

        setnovosdocumentos(novosdocumentos.concat([]))


    }


    function criaranexo(anexo, id) {

        const indexx = novosdocumentos.findIndex(x => x.id === id);

        console.log(novosdocumentos[indexx])
        console.log(id)

        if (novosdocumentos[indexx].tipodocumento == "" || novosdocumentos[indexx].numero == "") {
            popUp_alertaOK("Preencha o campos obrigatórios")
        }

        novosdocumentos[indexx] = {

            id: id,

            tipodocumento: novosdocumentos[indexx].tipodocumento,
            dataemissao: novosdocumentos[indexx].dataemissao,
            datavalidade: novosdocumentos[indexx].datavalidade,
            numero: novosdocumentos[indexx].numero,
            anexo: { type: 2, file: anexo },
        }

        setdocedit(true)

        setnovosdocumentos(novosdocumentos.concat([]))


    }



    function criardocdataE(docdataE, id) {



        const indexx = novosdocumentos.findIndex(x => x.id === id);

        console.log(novosdocumentos[indexx])
        console.log(id)

        novosdocumentos[indexx] = {

            id: id,

            dataemissao: docdataE,

            numero: novosdocumentos[indexx].numero,
            tipodocumento: novosdocumentos[indexx].tipodocumento,
            datavalidade: novosdocumentos[indexx].datavalidade,
            anexo: novosdocumentos[indexx].anexo,
        }

        setdocedit(true)

        setnovosdocumentos(novosdocumentos.concat([]))


    }


    function criardocdataV(docdataV, id) {

        const indexx = novosdocumentos.findIndex(x => x.id === id);

        novosdocumentos[indexx] = {

            id: id,

            datavalidade: docdataV,

            numero: novosdocumentos[indexx].numero,
            tipodocumento: novosdocumentos[indexx].tipodocumento,
            dataemissao: novosdocumentos[indexx].dataemissao,
            anexo: novosdocumentos[indexx].anexo,
        }

        setdocedit(true)

        setnovosdocumentos(novosdocumentos.concat([]))


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



                    <Modal size="lg" show={isOpen} onHide={() => setIsOpen(false)}>

                        <Modal.Header style={{ border: "0" }} closeButton>
                            <Modal.Title as="h5">Novo</Modal.Title>
                        </Modal.Header>

                        <ul className="nav nav-tabs profile-tabs nav-fill" id="myTab" role="tablist">
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'geral' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('geral') }} id="profile-tab"><i className="feather icon-user mr-2" />Perfil</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'contactos' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('contactos') }} id="contact-tab"><i className="feather icon-phone mr-2" />Contactos</Link>
                            </li>

                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'documentos' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('documentos') }} id="contact-tab"><i className="feather icon-file-text mr-2" />Documentos</Link>
                            </li>
                        </ul>


                        <Modal.Body style={activeProfileTab === 'documentos' ? {} : { display: "none" }}>

                            <Col style={{ display: "flex", justifyContent: "flex-end" }} sm={12}>

                                <Button onClick={() => addnovosdocumentos()} variant="primary">+</Button>

                            </Col>


                            {novosdocumentos.map(eq => (

                                <Row style={{ marginBottom: "12px" }} key={eq.id}>

                                    <Col sm={10}><Row>


                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Phone">Tipo de Documentos <span style={{ color: "red" }} >*</span></label>
                                                <select onChange={event => { criartipodoc(event.target.value, eq.id) }} className="form-control" id="perfil" required aria-required="true">
                                                    <option hidden value="">--- Selecione ---</option>

                                                    {documentolist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}
                                                </select>
                                            </div>

                                        </Col>
                                        <Col sm={3}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="text">Número <span style={{ color: "red" }} >*</span></label>
                                                <input onChange={event => { criardocnum(event.target.value, eq.id) }} type="text" className="form-control" />
                                            </div>
                                        </Col>

                                        <div className='sm-2 paddinhtop28OnlyPC' >
                                            <label htmlFor={"anexarcriar" + eq.id} className="btn" style={{ backgroundColor: "#d2b32a", color: "#fff" }}>{eq?.anexo?.file == null ? <><i className="feather icon-download" /><>{" Anexar"}</></> : "Anexado"} </label>
                                            <input id={"anexarcriar" + eq.id} onChange={event => criaranexo(event.target.files[0], eq.id)} accept="image/x-png,image/jpeg" style={{ display: "none" }} type="file" />
                                        </div>

                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="date">Data de Emissão</label>
                                                <input onChange={event => { criardocdataE(event.target.value, eq.id) }} type="date" className="form-control" />
                                            </div>

                                        </Col>
                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="text">Data de Validade</label>
                                                <input onChange={event => { criardocdataV(event.target.value, eq.id) }} type="date" className="form-control" />
                                            </div>
                                        </Col>

                                    </Row></Col>


                                    {novosdocumentos.length > 1 ?
                                        <div className='paddinhtop66OnlyPC sm-2' >
                                            <Button onClick={() => removenovosdocumentos(eq.id)} variant="danger"><i className="feather icon-trash-2" /></Button>
                                        </div>
                                        : null}


                                </Row>
                            ))}



                        </Modal.Body>



                        <Modal.Body style={activeProfileTab === 'contactos' ? {} : { display: "none" }}>

                            <Col style={{ display: "flex", justifyContent: "flex-end" }} sm={12}>

                                <Button onClick={() => addnovoscontactos()} variant="primary">+</Button>

                            </Col>


                            {novoscontactos.map(eq => (

                                <Row style={{ marginBottom: "12px" }} key={eq.id}>


                                    <Col sm={5}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Phone">Tipo de Contacto <span style={{ color: "red" }} >*</span></label>
                                            <select onChange={event => { criartipocontacto(event.target.value, eq.id) }} className="form-control" id="perfil" required aria-required="true">
                                                <option hidden value="">--- Selecione ---</option>

                                                {contactolist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}
                                            </select>
                                        </div>

                                    </Col>
                                    <Col sm={5}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Contacto <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" onChange={event => { criacontacto(event.target.value, eq.id) }} type="text" className="form-control" />
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



                        <Modal.Body style={activeProfileTab === 'geral' ? {} : { display: "none" }}>
                            {/* --------------------Criar Pessoa-------------------- */}

                            <form id="criarpessoa" onSubmit={criar} >
                                <Row>
                                    <Col sm={3}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled value="0003" onChange={() => doNada()} type="text" className="form-control" id="Name" />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Email">Nome <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="256" type="text" onChange={event => { setNOME_C(event.target.value) }} className="form-control" id="Nome " placeholder="Nome" required />
                                        </div>
                                    </Col>
                                    <Col sm={3}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Alcunha</label>
                                            <input type="text" maxLength="75" onChange={event => { setALCUNHA_C(event.target.value) }} className="form-control" id="alcunga" placeholder="Alcunha..." />
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Phone">Gênero <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control" onChange={event => { setPR_GENERO_ID_C(event.target.value) }} id="perfil" required aria-required="true">
                                                <option hidden value="">--- Selecione ---</option>

                                                {generolist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}


                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Phone">Estado civil <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control" onChange={event => { setPR_ESTADO_CIVIL_ID_C(event.target.value) }} id="perfil" required aria-required="true">
                                                <option hidden value="">--- Selecione ---</option>

                                                {estadocivillist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}

                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="date">Data Nascimento <span style={{ color: "red" }} >*</span></label>
                                            <input type="date" onChange={event => { setDT_NASC_C(event.target.value) }} className="form-control" id="data" required />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Nome Pai</label>
                                            <input type="text" maxLength="128" onChange={event => { setNOME_PAI_C(event.target.value) }} className="form-control" id="pai" placeholder="Nome Pai..." />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Nome Mãe</label>
                                            <input type="text" maxLength="128" onChange={event => { setNOME_MAE(event.target.value) }} className="form-control" id="mae" placeholder="Nome Mae..." />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Nacionalidade <span style={{ color: "red" }} >*</span></label>
                                            <select onChange={event => { setNACIONALIDADE_ID_C(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {glbgeografialist.map(e => (

                                                    e.NIVEL_DETALHE == "-1" ?

                                                        <option key={e.ID} value={e.ID}>{e.NACIONALIDADE}</option>

                                                        : null

                                                ))}

                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Coordenadas</label>
                                            <input type="text" maxLength="50" onChange={event => { setENDERECO_COORD_C(event.target.value) }} className="form-control" id="coordenada" placeholder="Endereco Coord..." />
                                        </div>
                                    </Col>
                                    <div className="col-sm-6">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Endereço</label>
                                            <textarea className="form-control" maxLength="64000" onChange={event => { setENDERECO_C(event.target.value) }} id="endereco" rows="3" placeholder='Endereço...' />
                                        </div>
                                    </div>
                                    <Col sm={6}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">NIF <span style={{ color: "red" }} >*</span></label>

                                            {SEM_NIF ?
                                                <input readOnly="readOnly" type="text" maxLength="9" onChange={event => { setNIF_C(event.target.value) }} className="form-control" id="nif" placeholder="NIF..." />

                                                :
                                                <input type="text" maxLength="9" required onChange={event => { setNIF_C(event.target.value) }} className="form-control" id="nif" placeholder="NIF..." />
                                            }
                                            <div className=" fill mt-2 input-box">
                                                <input type="checkbox" name="" id="" onChange={e => setSEM_NIF(e.target.checked)} />
                                                <label className="floating-label ml-3" htmlFor="Name">Sem NIF </label>
                                            </div>
                                        </div>

                                    </Col>


                                    <Col sm={3}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Ilha <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control" id="perfil" onChange={event => { putILHA(event.target.value) }} required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {glbgeografialist.map(e => (

                                                    e.NIVEL_DETALHE == "2" ?

                                                        <option key={e.ID} value={e.ID}>{e.ILHA}</option>

                                                        : null

                                                ))}

                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={3}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Concelho <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control" id="perfil" onChange={event => { putCONCELHO(event.target.value) }} required aria-required="true">
                                                <option hidden value="">--- Selecione ---</option>

                                                {glbgeografialist.map(e => (

                                                    e.NIVEL_DETALHE == "3" && e.GLB_GEOG_ID == ILHA ?

                                                        <option key={e.ID} value={e.ID}>{e.CONCELHO}</option>

                                                        : null

                                                ))}

                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={3}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Freguêsia <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control" id="perfil" onChange={event => { putFREGUESIA(event.target.value) }} required aria-required="true">
                                                <option hidden value="">--- Selecione ---</option>

                                                {glbgeografialist.map(e => (

                                                    e.NIVEL_DETALHE == "4" && e.GLB_GEOG_ID == CONCELHO ?

                                                        <option key={e.ID} value={e.ID}>{e.FREGUESIA}</option>

                                                        : null

                                                ))}


                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={3}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Localidade<span style={{ color: "red" }} >*</span></label>
                                            <select onChange={event => { setLOCALIDADE_ID_C(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {glbgeografialist.map(e => (

                                                    e.NIVEL_DETALHE == "5" && e.GLB_GEOG_ID == FREGUESIA ?

                                                        <option key={e.ID} value={e.ID}>{e.NOME}</option>

                                                        : null

                                                ))}

                                            </select>
                                        </div>
                                    </Col>
                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Obs</label>
                                            <textarea className="form-control" maxLength="64000" onChange={event => { setOBS_C(event.target.value) }} id="Address" rows="3" placeholder='Obs...' />
                                        </div>
                                    </div>

                                </Row>
                            </form>
                        </Modal.Body>




                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsOpen(false)}>Fechar</Button>

                            {!isLoading ? <Button type="submit" form="criarpessoa" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}
                        </Modal.Footer>
                    </Modal>




                    <Modal size='lg' show={isEditarOpen} onHide={() => setIsEditarOpen(false)}>
                        <Modal.Header style={{ border: "0" }} closeButton>
                            <Modal.Title as="h5">Editar</Modal.Title>
                        </Modal.Header>

                        <ul className="nav nav-tabs profile-tabs nav-fill" id="myTab" role="tablist">
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'geral' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('geral') }} id="profile-tab"><i className="feather icon-user mr-2" />Perfil</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'contactos' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('contactos') }} id="contact-tab"><i className="feather icon-phone mr-2" />Contactos</Link>
                            </li>

                            <li className="nav-item">
                                <Link to='#' className={activeProfileTab === 'documentos' ? profileTabActiveClass : profileTabClass} onClick={() => { setActiveProfileTab('documentos') }} id="contact-tab"><i className="feather icon-file-text mr-2" />Documentos</Link>
                            </li>
                        </ul>

                        <Modal.Body style={activeProfileTab === 'documentos' ? {} : { display: "none" }}>

                            <Col style={{ display: "flex", justifyContent: "flex-end" }} sm={12}>

                                <Button onClick={() => addnovosdocumentos()} variant="primary">+</Button>

                            </Col>


                            {novosdocumentos.map(eq => (

                                <Row style={{ marginBottom: "12px" }} key={eq.id}>

                                    <Col sm={10}><Row>


                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Phone">Tipo de Documentos <span style={{ color: "red" }} >*</span></label>
                                                <select defaultValue={eq.tipodocumento} onChange={event => { criartipodoc(event.target.value, eq.id) }} className="form-control" id="perfil" required aria-required="true">
                                                    <option hidden value="">--- Selecione ---</option>

                                                    {documentolist.map(e => (

                                                        <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                    ))}
                                                </select>
                                            </div>

                                        </Col>
                                        <Col sm={3}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="text">Número <span style={{ color: "red" }} >*</span></label>
                                                <input defaultValue={eq.numero} onChange={event => { criardocnum(event.target.value, eq.id) }} type="text" className="form-control" />
                                            </div>
                                        </Col>

                                        <div className='sm-2 paddinhtop28OnlyPC' >
                                            <label htmlFor={"anexareditar" + eq.id} className="btn" style={{ backgroundColor: "#d2b32a", color: "#fff" }}> {eq?.anexo?.file == null ? <><i className="feather icon-download" /><>{"Anexar"}</></> : "Anexado"} </label>

                                            <input id={"anexareditar" + eq.id} style={{ display: "none" }} onChange={event => criaranexo(event.target.files[0], eq.id)} accept="image/x-png,image/jpeg" type="file" />
                                        </div>

                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="date">Data de Emissão</label>
                                                <input defaultValue={eq.dataemissao} onChange={event => { criardocdataE(event.target.value, eq.id) }} type="date" className="form-control" />
                                            </div>

                                        </Col>
                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="text">Data de Validade</label>
                                                <input defaultValue={eq.datavalidade} onChange={event => { criardocdataV(event.target.value, eq.id) }} type="date" className="form-control" />
                                            </div>
                                        </Col>

                                    </Row></Col>


                                    {novosdocumentos.length > 1 ?
                                        <div className='paddinhtop66OnlyPC sm-2' >
                                            <Button onClick={() => removenovosdocumentos(eq.id)} variant="danger"><i className="feather icon-trash-2" /></Button>
                                        </div>
                                        : null}


                                </Row>
                            ))}



                        </Modal.Body>



                        <Modal.Body style={activeProfileTab === 'contactos' ? {} : { display: "none" }}>

                            <Col style={{ display: "flex", justifyContent: "flex-end" }} sm={12}>

                                <Button onClick={() => addnovoscontactos()} variant="primary">+</Button>

                            </Col>


                            {novoscontactos.map(eq => (

                                <Row style={{ marginBottom: "12px" }} key={eq.id}>


                                    <Col sm={5}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Phone">Tipo de Contacto <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={eq.tipocontacto} onChange={event => { criartipocontacto(event.target.value, eq.id) }} className="form-control" id="perfil" required aria-required="true">
                                                <option hidden value="">--- Selecione ---</option>

                                                {contactolist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}
                                            </select>
                                        </div>

                                    </Col>
                                    <Col sm={5}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Contacto <span style={{ color: "red" }} >*</span></label>
                                            <input maxLength="128" defaultValue={eq.contacto} onChange={event => { criacontacto(event.target.value, eq.id) }} type="text" className="form-control" />
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



                        <Modal.Body style={activeProfileTab === 'geral' ? {} : { display: "none" }}>

                            {/* --------------------Editar Pessoa-------------------- */}

                            <form id="editarpessoa" onSubmit={editar} >

                                <Row>
                                    <Col sm={3}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Código <span style={{ color: "red" }} >*</span></label>
                                            <input disabled defaultValue={CODIGO_C} onChange={() => doNada()} type="text" className="form-control" id="Name" />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Email">Nome <span style={{ color: "red" }} >*</span></label>
                                            <input type="text" maxLength="256" defaultValue={NOME_C} onChange={event => { setNOME_C(event.target.value) }} className="form-control" id="Nome " required placeholder="Nome" />
                                        </div>
                                    </Col>
                                    <Col sm={3}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Alcunha</label>
                                            <input type="text" maxLength="256" defaultValue={ALCUNHA_C} onChange={event => { setALCUNHA_C(event.target.value) }} className="form-control" id="alcunga" placeholder="Alcunha..." />
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Phone">Gênero <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control" defaultValue={PR_GENERO_ID_C} onChange={event => { setPR_GENERO_ID_C(event.target.value) }} id="perfil" required aria-required="true">
                                                <option hidden value="">--- Selecione ---</option>

                                                {generolist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}


                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Phone">Estado civil <span style={{ color: "red" }} >*</span></label>
                                            <select className="form-control" defaultValue={PR_ESTADO_CIVIL_ID_C} onChange={event => { setPR_ESTADO_CIVIL_ID_C(event.target.value) }} id="perfil" required aria-required="true">
                                                <option hidden value="">--- Selecione ---</option>

                                                {estadocivillist.map(e => (

                                                    <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                                ))}

                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="date">Data Nascimento <span style={{ color: "red" }} >*</span></label>
                                            <input defaultValue={DT_NASC_C} type="date" onChange={event => { setDT_NASC_C(event.target.value) }} className="form-control" id="data" required aria-required="true" />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Nome Pai</label>
                                            <input defaultValue={NOME_PAI_C} maxLength="128" type="text" onChange={event => { setNOME_PAI_C(event.target.value) }} className="form-control" id="pai" placeholder="Nome Pai..." />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Nome Mãe</label>
                                            <input defaultValue={NOME_MAE} maxLength="128" type="text" onChange={event => { setNOME_MAE(event.target.value) }} className="form-control" id="mae" placeholder="Nome Mae..." />
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Nacionalidade <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={NACIONALIDADE_ID_C} onChange={event => { setNACIONALIDADE_ID_C(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {glbgeografialist.map(e => (

                                                    e.NIVEL_DETALHE == "-1" ?

                                                        <option key={e.ID} value={e.ID}>{e.NACIONALIDADE}</option>

                                                        : null

                                                ))}

                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Coordenadas</label>
                                            <input maxLength="50" defaultValue={ENDERECO_COORD_C} type="text" onChange={event => { setENDERECO_COORD_C(event.target.value) }} className="form-control" id="coordenada" placeholder="Endereco Coord..." />
                                        </div>
                                    </Col>
                                    <div className="col-sm-6">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Endereço</label>
                                            <textarea maxLength="64000" defaultValue={ENDERECO_C} className="form-control" onChange={event => { setENDERECO_C(event.target.value) }} id="endereco" rows="3" placeholder='Endereço...' />
                                        </div>
                                    </div>
                                    <Col sm={6}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">NIF <span style={{ color: "red" }} >*</span></label>

                                            {SEM_NIF ?
                                                <input readOnly="readOnly" type="text" maxLength="9" onChange={event => { setNIF_C(event.target.value) }} className="form-control" id="nif" placeholder="NIF..." />

                                                :
                                                <input defaultValue={NIF_C} type="text" maxLength="9" required onChange={event => { setNIF_C(event.target.value) }} className="form-control" id="nif" placeholder="NIF..." />
                                            }
                                            <div className=" fill mt-2 input-box">
                                                <input type="checkbox" name="" id="" onChange={e => setSEM_NIF(e.target.checked)} />
                                                <label className="floating-label ml-3" htmlFor="Name">Sem NIF </label>
                                            </div>
                                        </div>

                                    </Col>



                                    <Col sm={3}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Ilha <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={ILHA} className="form-control" id="perfil" onChange={event => { putILHA(event.target.value) }} required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {glbgeografialist.map(e => (

                                                    e.NIVEL_DETALHE == "2" ?

                                                        <option key={e.ID} value={e.ID}>{e.ILHA}</option>

                                                        : null

                                                ))}

                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={3}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Concelho <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={CONCELHO} className="form-control" id="perfil" onChange={event => { putCONCELHO(event.target.value) }} required aria-required="true">


                                                <option hidden value="">--- Selecione ---</option>

                                                {glbgeografialist.map(e => (

                                                    e.NIVEL_DETALHE == "3" && e.GLB_GEOG_ID == ILHA ?

                                                        <option key={e.ID} value={e.ID}>{e.CONCELHO}</option>

                                                        : null

                                                ))}

                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={3}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Freguêsia <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={FREGUESIA} className="form-control" id="perfil" onChange={event => { putFREGUESIA(event.target.value) }} required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {glbgeografialist.map(e => (

                                                    e.NIVEL_DETALHE == "4" && e.GLB_GEOG_ID == CONCELHO ?

                                                        <option key={e.ID} value={e.ID}>{e.FREGUESIA}</option>

                                                        : null

                                                ))}


                                            </select>
                                        </div>
                                    </Col>
                                    <Col sm={3}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="text">Localidade <span style={{ color: "red" }} >*</span></label>
                                            <select defaultValue={LOCALIDADE_ID_C} onChange={event => { setLOCALIDADE_ID_C(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                                <option hidden value="">--- Selecione ---</option>

                                                {glbgeografialist.map(e => (

                                                    e.NIVEL_DETALHE == "5" && e.GLB_GEOG_ID == FREGUESIA ?

                                                        <option key={e.ID} value={e.ID}>{e.NOME}</option>

                                                        : null

                                                ))}

                                            </select>
                                        </div>
                                    </Col>
                                    <div className="col-sm-12">
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="Address">Obs</label>
                                            <textarea maxLength="64000" defaultValue={OBS_C} className="form-control" onChange={event => { setOBS_C(event.target.value) }} id="Address" rows="3" placeholder='Obs...' />
                                        </div>
                                    </div>

                                </Row>

                            </form>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsEditarOpen(false)}>Fechar</Button>
                            {!isLoading ? <Button type="submit" form="editarpessoa" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}

                        </Modal.Footer>
                    </Modal>


                    <Modal size='lg' show={isVerOpen} onHide={() => setVerOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5"></Modal.Title>
                            <Modal.Title as="h5">Pessoa</Modal.Title>
                        </Modal.Header>

                        {Object.keys(itemlist).length === 0 ? null :

                            <Modal.Body>
                                <Row>
                                    <Col xl={4} className='task-detail-right'>


                                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

                                            <span><i className="feather icon-user m-r-5" />Geral</span>

                                        </div>

                                        <div style={{ width: "100%", display: "flex", alignItems: "center", marginBottom: "20px", flexDirection: "column", borderBottom: "1px solid #d2b32a", borderTop: "1px solid #d2b32a", paddingBottom: "15px", paddingTop: "15px", marginTop: "5px" }}>

                                            <img src={itemlist.foto == null ? imgperilview : itemlist.foto + "?alt=media&token=0"} style={{ borderRadius: "50%", width: "100px", height: "100px", marginBottom: "10px" }} alt="" />
                                            <span>{itemlist.NOME}</span>

                                        </div>


                                        <div style={{ borderBottom: "1px solid #d2b32a", marginBottom: "20px" }}>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span ><i className="feather icon-map-pin m-r-5" />Gênero</span>

                                                <span style={{ color: "#6c757d" }}>{itemlist.sgigjprgenero.DESIG}</span>

                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Estado Civil</span>

                                                <span style={{ color: "#6c757d" }}>{itemlist.sgigjprestadocivil.DESIG}</span>


                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Dt. Nascimento</span>
                                                <span style={{ color: "#6c757d" }}>{createDate1(itemlist.DT_NASC)}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />NIF</span>
                                                <span style={{ color: "#6c757d" }}>{(itemlist.NIF)}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Observações</span>
                                                <span style={{ color: "#6c757d" }}>{itemlist.OBS}</span>
                                            </div>

                                        </div>

                                        <div style={{ borderBottom: "1px solid #d2b32a", marginBottom: "20px" }}>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Endereço</span>
                                                <span style={{ color: "#6c757d" }}>{itemlist.ENDERECO}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-map-pin m-r-5" />Localidade</span>
                                                <span style={{ color: "#6c757d" }}>{itemlist.localidade.NOME}</span>
                                            </div>


                                        </div>


                                        <div >

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-phone m-r-5" />Telefone</span>
                                                <span style={{ color: "#6c757d" }}>{itemlist.TELEFONE}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-phone m-r-5" />Telemóvel</span>
                                                <span style={{ color: "#6c757d" }}>{itemlist.TELEMOVEL}</span>
                                            </div>

                                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                                <span><i className="feather icon-mail m-r-5" />Email</span>
                                                <span style={{ color: "#6c757d" }}>{itemlist.EMAIL}</span>
                                            </div>


                                        </div>



                                    </Col>



                                    <Col xl={8} className='task-detail-right'>


                                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

                                            <span><i className="feather icon-file-text m-r-5" />Documentos</span>

                                        </div>

                                        <div style={{
                                            flexWrap: "wrap",
                                            width: "100%",
                                            display: "flex",
                                            marginBottom: "15px",
                                            flexDirection: "row",
                                            borderBottom: "1px solid #d2b32a",
                                            borderTop: "1px solid #d2b32a",
                                            paddingTop: "20px",
                                            paddingBottom: "20px",
                                            marginTop: "5px",
                                            overflow: "auto",
                                            height: "70px"
                                        }}>



                                            {
                                                typeof itemlist.doclist != "undefined" ?

                                                    itemlist.doclist.map((e, i) => (

                                                        <Link onClick={() => selectDocTypeAndSetPrevImg(i, e.url)} key={e.id} style={{ margin: "2px", color: i === index ? '#d2b32a' : '#6c757d' }} to='#' className="mb-1  d-flex align-items-end text-h-primary">{"::" + e.nome}</Link>

                                                    ))

                                                    : null

                                            }


                                            {/*
                                           
                                                <Link style={{margin:"2px"}} to='#' className="mb-1 text-muted d-flex align-items-end text-h-primary">::contrato_de_trabalho</Link>
                                                <Link style={{margin:"2px"}} to='#' className="mb-1 text-muted d-flex align-items-end text-h-primary">::contrato</Link>
                                                <Link style={{margin:"2px"}} to='#' className="mb-1 text-muted d-flex align-items-end text-h-primary">::contrato_de_trabalho</Link>
                                                <Link style={{margin:"2px"}} to='#' className="mb-1 text-muted d-flex align-items-end text-h-primary">::contrato_de_trabalho</Link>
                                           
                                           */}


                                        </div>



                                        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "10px" }}>

                                            <span><i className="feather icon-eye m-r-5" />Pré-vizualização</span>

                                        </div>

                                        {
                                            imgprev?.substring(imgprev?.lastIndexOf('.') + 1) !== "pdf" ? (
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





                                    </Col>
                                </Row>
                            </Modal.Body>

                        }

                        <Modal.Footer>
                            <Button variant="danger" onClick={() => setVerOpen(false)}>Fechar</Button>
                            {taskEnable(pageAcess, permissoes, "Editar") == false ? null :
                                <Button variant="primary" onClick={() => openEditHandler(itemlist.ID)}>Editar</Button>
                            }
                        </Modal.Footer>
                    </Modal>



                </Col>
            </Row>
        </React.Fragment>
    );












};
export default Customers;