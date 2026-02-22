import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, ListGroup } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom';

// import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import api from '../../../../services/api';

import useAuth from '../../../../hooks/useAuth';


import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle } from '../../../../functions';
import Autoexclusao from '../../../processos/autoexclusao';
import Handpay from '../../../processos/handpay';
import EventosAprovados from '../../../eventos/aprovados';
import EventosPedidos from '../../../eventos/eventospedidos';
import EventosRecusados from '../../../eventos/recusados';
import ProcessoEmCurso from '../../../processos/exclusaointerdicao';
import ProcessoFinalizado from '../../../processos/exclusaofinalizado';
import ProcessoArquivados from '../../../processos/exclusaoarquivado';
import ProcessoPrescritos from '../../../processos/exclusaoprescrito';
import Banca from '../banca';
import Colaboradores from '../colaboradores';
import Maquina from '../maquina';
import Grupo from '../grupo';
import Equipamento from '../equipamento';
import casinoroyal from '../../../../assets/images/casino-roya.png';
import Contrapartida from '../contrapartida';
import Contribuicoes from '../contribuicoes';
import Imposto from '../imposto';
import Premios from '../premios';
import CasoSuspeito from '../casosuspeitos';


const pageAcess = "/entidades/entidades/detalhes"

const DetalhesEntidade = () => {

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
            },



            {
                Header: 'Entidade',
                accessor: 'ENTIDADE',
            },

            {
                Header: 'Tipo de Máquina',
                accessor: 'TIPOMAQUINA',
            },

            {
                Header: 'Máquina',
                accessor: 'MAQUINA',
            },

            {
                Header: 'QTD',
                accessor: 'QUANT',
            },

            {
                Header: 'Grupo',
                accessor: 'ENTIDADEGRUPO',
            },

            {
                Header: 'Status',
                accessor: 'STATUS',
            },

            {
                Header: 'País',
                accessor: 'GEOGRAFIA',
            },

            {
                Header: 'Local Produção',
                accessor: 'LOCAL_PRODUCAO',
            },

            {
                Header: 'DT.FABRICO',
                accessor: 'DTFABRICO',
            },

            {
                Header: 'DT.AQUISIÇÃO',
                accessor: 'DTAQUISICAO',
            },

            {
                Header: 'Tipologia',
                accessor: 'TIPOLOGIA',
            },

            {
                Header: 'NUM_SERIE',
                accessor: 'NUM_SERIE',
            },

            {
                Header: 'Ações',
                accessor: 'action',
            },

        ],
        []
    );

    const [tabDescription, setTabDescription] = useState("dados");
    const [tabDescriptionChildren, setTabDescriptionChildren] = useState("");

    const [imgprev, setimgprev] = useState("");

    const [index, setIndex] = useState(0);
    const [itemSelectedver, setitemSelectedver] = useState({});
    const [verlistgp, setverlistgp] = useState("colaboradores");
    const [showlinguadata, setshowlinguadata] = useState(false);
    const [showlinguapessoa, setshowlinguapessoa] = useState("");
    const [selectedTab, setselectedTab] = useState("");


    const [ILHA, setILHA] = useState("");
    const [CONCELHO, setCONCELHO] = useState("");
    const [FREGUESIA, setFREGUESIA] = useState("");

    const [ID_C, setID_C] = useState("");
    const [CODIGO_C, setCODIGO_C] = useState("");
    const [SELF_ID_C, setSELF_ID_C] = useState("");
    const [PR_ENTIDADE_TP_ID_C, setPR_ENTIDADE_TP_ID_C] = useState("");
    const [GEOGRAFIA_ID_C, setGEOGRAFIA_ID_C] = useState("");
    const [DESIG_C, setDESIG_C] = useState("");
    const [OBS_C, setOBS_C] = useState("");
    const [ENDERECO_C, setENDERECO_C] = useState("");
    const [ENDERECO_COORD_C, setENDERECO_COORD_C] = useState("");
    const [NIF_C, setNIF_C] = useState("");
    const [REGISTO_COMERCIAL_C, setREGISTO_COMERCIAL_C] = useState("");
    const [CAPITAL_SOCIAL_C, setCAPITAL_SOCIAL_C] = useState("");
    const [LOGO_URL_C, setLOGO_URL_C] = useState("");
    const [DT_INICIO_ATIVIDADE_C, setDT_INICIO_ATIVIDADE_C] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);
    const [docedit, setdocedit] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenModalEdit, setIsOpenModalEdit] = useState(false)

    const [itemSelected, setitemSelected] = useState({
        sgigjentidade: {},
        glbgeografia: {},
    });
    const [thumnail, setThumnail] = useState(null);
    const preview = React.useMemo(() => {
        //return thumnail ? onFormSubmit() : null;
        return thumnail ? URL.createObjectURL(thumnail) : null;
    }, [thumnail]);

    const [activeProfileTab, setActiveProfileTab] = useState("geral");
    const profileTabClass = "nav-link text-reset";
    const profileTabActiveClass = "nav-link text-reset active";
    const [contacedit, setcontacedit] = useState(false);
    var [novosdocumentos, setnovosdocumentos] = useState([
        {
            id: "" + Math.random(),
            tipodocumento: "",
            numero: "",
            dataemissao: "",
            datavalidade: "",
            anexo: { type: 0, file: null },
        },
    ]);

    function handleSelectedTab(key) {
        setTabDescription(key)
    }
    function handleSelectedTabChildren(key) {
        setTabDescriptionChildren(key)


    }

    function selectedTabs(e) {
        setselectedTab(e)
    }
    function selectDocTypeAndSetPrevImg(i, url) {
        setIndex(i)
        setimgprev(url)
    }
    function showld(e) {
        setshowlinguadata(true);
        setshowlinguapessoa(e);
    }
    function makedate(date) {
        return date != null ? date.substring(0, 10) : "";
    }
    const [glbgeografialist, setglbgeografia] = useState([]);

    async function uploadglbgeografia() {
        try {
            const response = await api.get("/glbgeografia");

            if (response.status == "200") {
                setglbgeografia(response.data);
            }
        } catch (err) {
            console.error(err.response);
        }
    }

    const [prentidadelist, setprentidadelist] = useState([]);

    async function uploadprentidade() {
        try {
            const response = await api.get("/sgigjprentidadetp");

            if (response.status == "200") {
                setprentidadelist(response.data);
            }
        } catch (err) {
            console.error(err.response);
        }
    }

    const [entidadelist, setentidadelist] = useState([]);

    async function uploadentidade() {
        try {
            const response = await api.get("/sgigjentidade");

            if (response.status == "200") {
                setentidadelist(response.data);
            }
        } catch (err) {
            console.error(err.response);
        }
    }

    const [documentolist, setdocumentolist] = useState([]);

    async function uploaddocumentolist() {
        try {
            const response = await api.get("/sgigjprdocumentotp");

            if (response.status == "200") {
                setdocumentolist(response.data);
            }
        } catch (err) {
            console.error(err.response);
        }
    }

    const [contactolist, setcontactolist] = useState([]);
    function criartipocontacto(tipoc, id) {
        const indexx = novoscontactos.findIndex((x) => x.id === id);

        novoscontactos[indexx] = {
            id: id,
            tipocontacto: tipoc,
            contacto: novoscontactos[indexx].contacto,
        };

        setcontacedit(true);

        setnovoscontactos(novoscontactos.concat([]));
    }
    function criartipodoc(tipodoc, id) {
        const indexx = novosdocumentos.findIndex((x) => x.id === id);

        novosdocumentos[indexx] = {
            id: id,

            tipodocumento: tipodoc,

            numero: novosdocumentos[indexx].numero,
            dataemissao: novosdocumentos[indexx].dataemissao,
            datavalidade: novosdocumentos[indexx].datavalidade,
            anexo: novosdocumentos[indexx].anexo,
        };

        setdocedit(true);

        setnovosdocumentos(novosdocumentos.concat([]));
    }
    function criacontacto(conc, id) {
        const indexx = novoscontactos.findIndex((x) => x.id === id);

        novoscontactos[indexx] = {
            id: id,
            contacto: conc,
            tipocontacto: novoscontactos[indexx].tipocontacto,
        };

        setcontacedit(true);

        setnovoscontactos(novoscontactos.concat([]));
    }
    async function uploadcontactolist() {
        try {
            const response = await api.get("/sgigjprcontactotp");

            if (response.status == "200") {
                setcontactolist(response.data);
            }
        } catch (err) {
            console.error(err.response);
        }
    }
    var [novoscontactos, setnovoscontactos] = useState([
        {
            id: "" + Math.random(),
            tipocontacto: "",
            contacto: "",
        },
    ]);

    function addnovoscontactos() {
        setnovoscontactos(
            novoscontactos.concat([
                {
                    id: "" + Math.random(),
                    tipocontacto: "",
                    contacto: "",
                },
            ])
        );
    }

    function removenovoscontactos(id) {
        if (novoscontactos.length > 1) {
            const indexx = novoscontactos.findIndex((x) => x.id === id);
            //console.log(indexx)
            if (indexx > -1) {
                var newArr = novoscontactos;
                newArr.splice(indexx, 1);
                setnovoscontactos(newArr.concat([]));

                setcontacedit(true);
            }
        }
    }
    function criardocnum(docnum, id) {
        const indexx = novosdocumentos.findIndex((x) => x.id === id);

        novosdocumentos[indexx] = {
            id: id,

            numero: docnum,

            tipodocumento: novosdocumentos[indexx].tipodocumento,
            dataemissao: novosdocumentos[indexx].dataemissao,
            datavalidade: novosdocumentos[indexx].datavalidade,
            anexo: novosdocumentos[indexx].anexo,
        };

        setdocedit(true);

        setnovosdocumentos(novosdocumentos.concat([]));
    }

    function criardocdataE(docdataE, id) {
        const indexx = novosdocumentos.findIndex((x) => x.id === id);

        novosdocumentos[indexx] = {
            id: id,

            dataemissao: docdataE,

            numero: novosdocumentos[indexx].numero,
            tipodocumento: novosdocumentos[indexx].tipodocumento,
            datavalidade: novosdocumentos[indexx].datavalidade,
            anexo: novosdocumentos[indexx].anexo,
        };

        setdocedit(true);

        setnovosdocumentos(novosdocumentos.concat([]));
    }

    function criardocdataV(docdataV, id) {
        const indexx = novosdocumentos.findIndex((x) => x.id === id);

        novosdocumentos[indexx] = {
            id: id,

            datavalidade: docdataV,

            numero: novosdocumentos[indexx].numero,
            tipodocumento: novosdocumentos[indexx].tipodocumento,
            dataemissao: novosdocumentos[indexx].dataemissao,
            anexo: novosdocumentos[indexx].anexo,
        };

        setdocedit(true);

        setnovosdocumentos(novosdocumentos.concat([]));
    }


    //-------------------- documento


    function addnovosdocumentos() {
        setnovosdocumentos(
            novosdocumentos.concat([
                {
                    id: "" + Math.random(),
                    tipodocumento: "",
                    numero: "",
                    dataemissao: "",
                    datavalidade: "",
                    anexo: { type: 0, file: null },
                },
            ])
        );
    }

    function removenovosdocumentos(id) {
        if (novosdocumentos.length > 1) {
            const indexx = novosdocumentos.findIndex((x) => x.id === id);
            //console.log(indexx)
            if (indexx > -1) {
                var newArr = novosdocumentos;
                newArr.splice(indexx, 1);
                setnovosdocumentos(newArr.concat([]));

                setdocedit(true);
            }
        }
    } function criaranexo(anexo, id) {
        const indexx = novosdocumentos.findIndex((x) => x.id === id);

        console.log(novosdocumentos[indexx]);
        console.log(id);

        if (
            novosdocumentos[indexx].tipodocumento == "" ||
            novosdocumentos[indexx].numero == ""
        ) {
            popUp_alertaOK("Preencha o campos obrigatórios");
        }

        novosdocumentos[indexx] = {
            id: id,

            tipodocumento: novosdocumentos[indexx].tipodocumento,
            dataemissao: novosdocumentos[indexx].dataemissao,
            datavalidade: novosdocumentos[indexx].datavalidade,
            numero: novosdocumentos[indexx].numero,
            anexo: { type: 2, file: anexo },
        };

        setdocedit(true);

        setnovosdocumentos(novosdocumentos.concat([]));
    }
    function doNada() { }
    async function onFormSubmitImage(thumnail) {
        var res = {
            status: false,
            file: null,
        };

        try {
            const formData = new FormData();

            formData.append("file", thumnail);

            const config = {
                headers: {
                    "content-type": "multipart/form-data",
                },
            };

            const uploadResponse = await api.post("/upload", formData, config);

            res = {
                status: true,
                file: uploadResponse,
            };

            console.log(uploadResponse);
        } catch (err) {
            console.error(err.response);

            res = {
                status: false,
                file: null,
            };
        }

        return res;
    }

    const openEditHandler = async (idT) => {
        setIsOpenModalEdit(true)
        setIsOpen(false);
        setVerOpen(false);
        setitemSelected(idT);

        setID_C(idT.ID);
        setCODIGO_C(idT.CODIGO);
        setSELF_ID_C(idT.SELF_ID);
        setPR_ENTIDADE_TP_ID_C(idT.PR_ENTIDADE_TP_ID);
        setGEOGRAFIA_ID_C(idT.GEOGRAFIA_ID);
        setDESIG_C(idT.DESIG);
        setOBS_C(idT.OBS);
        setNIF_C(idT.NIF);
        setENDERECO_C(idT.ENDERECO);
        setENDERECO_COORD_C(idT.ENDERECO_COORD);
        setREGISTO_COMERCIAL_C(idT.REGISTO_COMERCIAL);
        setCAPITAL_SOCIAL_C(idT.CAPITAL_SOCIAL);
        setLOGO_URL_C(idT.LOGO_URL);
        setDT_INICIO_ATIVIDADE_C(idT.DT_INICIO_ATIVIDADE.slice(0, 10));

        setIsOpen(false);
        setVerOpen(false);

        setActiveProfileTab("geral");

        var ilhax = "";
        var conselhox = "";
        var freguesiax = "";

        for (let i = 0; i < glbgeografialist.length; i++) {
            const e = glbgeografialist[i];

            if (e.ID == idT.GEOGRAFIA_ID) freguesiax = e.GLB_GEOG_ID;
        }

        for (let i = 0; i < glbgeografialist.length; i++) {
            const e = glbgeografialist[i];

            if (e.ID == freguesiax) conselhox = e.GLB_GEOG_ID;
        }

        for (let i = 0; i < glbgeografialist.length; i++) {
            const e = glbgeografialist[i];

            if (e.ID == conselhox) ilhax = e.GLB_GEOG_ID;
        }

        const response3 = await api.get("/glbgeografia");

        if (response3.status == "200") {
            var ilhax = "";
            var conselhox = "";
            var freguesiax = "";

            const listgeo = response3.data;

            for (let i = 0; i < listgeo.length; i++) {
                const e = listgeo[i];

                if (e.ID == idT.GEOGRAFIA_ID) freguesiax = e.GLB_GEOG_ID;
            }

            for (let i = 0; i < listgeo.length; i++) {
                const e = listgeo[i];

                if (e.ID == freguesiax) conselhox = e.GLB_GEOG_ID;
            }

            for (let i = 0; i < listgeo.length; i++) {
                const e = listgeo[i];

                if (e.ID == conselhox) ilhax = e.GLB_GEOG_ID;
            }

            setILHA(ilhax);
            setCONCELHO(conselhox);
            setFREGUESIA(freguesiax);
        }

        novoscontactos = [];

        try {
            const response2 = await api.get(
                "/sgigjrelcontacto?ENTIDADE_ID=" + idT.ID
            );

            if (response2.status == "200") {
                for (let i = 0; i < response2.data.length; i++) {
                    novoscontactos.push({
                        id: "" + response2.data[i].ID,
                        tipocontacto: "" + response2.data[i].PR_CONTACTO_TP_ID,
                        contacto: "" + response2.data[i].CONTACTO,
                    });

                    console.log(response2.data);
                    console.log(response2.data[i]);
                }
            }
        } catch (err) {
            console.error(err.response2);
        }

        setnovoscontactos(novoscontactos.concat([]));

        novosdocumentos = [];

        try {
            const response3 = await api.get(
                "/sgigjreldocumento?ENTIDADE_ID=" + idT.ID
            );

            if (response3.status == "200") {
                for (let ix = 0; ix < response3.data.length; ix++) {
                    const DT_E =
                        response3.data[ix].DT_EMISSAO != null
                            ? response3.data[ix].DT_EMISSAO.substring(0, 10)
                            : "";
                    const DT_V =
                        response3.data[ix].DT_VALIDADE != null
                            ? response3.data[ix].DT_VALIDADE.substring(0, 10)
                            : "";

                    novosdocumentos.push({
                        id: "" + response3.data[ix].ID,
                        tipodocumento: response3.data[ix].PR_DOCUMENTO_TP_ID,
                        numero: response3.data[ix].NUMERO,
                        dataemissao: DT_E,
                        datavalidade: DT_V,
                        anexo: { type: 1, file: response3.data[ix].DOC_URL },
                    });

                    console.log(response3.data);
                    console.log(response3.data[ix]);
                }
            }
        } catch (err) {
            console.error(err.response3);
        }

        setnovosdocumentos(novosdocumentos.concat([]));

        setIsOpenModalEdit(false);

        setIsEditarOpen(true);
    };
    function putILHA(id) {
        setILHA(id);
        setCONCELHO("");
        setFREGUESIA("");
        setGEOGRAFIA_ID_C("");
    }

    function putCONCELHO(id) {
        setCONCELHO(id);
        setFREGUESIA("");
        setGEOGRAFIA_ID_C("");
    }

    function putFREGUESIA(id) {
        setFREGUESIA(id);
        setGEOGRAFIA_ID_C("");
    }
    function formatCurrency(value) {
        const formattedNumber = new Intl.NumberFormat('pt-CV', { style: 'currency', currency: 'CVE' }).format(value);
        return formattedNumber
    }
    // const handleChange = (event) => {
    //     debugger
    //     const { value } = event.target;
    //     const formattedValue = new Intl.NumberFormat('pt-CV', { style: 'currency', currency: 'CVE' }).format(value);
    //     const unformattedValue = formattedValue.replace(/[CVE\s]/g, ''); setCAPITAL_SOCIAL_C(unformattedValue);

    // };


    useEffect(() => {
        // history.replace("/");
        // setTimeout(() => {
        //   history.replace("/same-page");
        // }, 10);
        setimgprev(typeof itemSelectedver.doclist != "undefined" ? itemSelectedver?.doclist[0]?.url : "")
        if (pageEnable(pageAcess, permissoes) == false) history.push("/");
        else {
            openVerHandler(id)
            uploadglbgeografia();
            uploadprentidade();
            uploadentidade();
            uploadcontactolist();
            uploaddocumentolist();
        }
    }, [id]);



    const openVerHandler = async (idx) => {
        setverlistgp("colaboradores");
        setimgprev("");
        try {
            const response = await api.get("/sgigjentidade/" + idx);
            if (response.status == "200") {
                if (response.data.length > 0) {
                    response.data[0].INICIO_ATIVIDADE =
                        response.data[0].DT_INICIO_ATIVIDADE != null
                            ? response.data[0].DT_INICIO_ATIVIDADE.substring(0, 10)
                            : "";

                    for (var i = 0; i < response.data[0].sgigjrelcontacto.length; i++) {
                        const e = response.data[0].sgigjrelcontacto[i];

                        if (e.sgigjprcontactotp.DESIG == "Telefone")
                            response.data[0].TEL = e.CONTACTO;
                        if (e.sgigjprcontactotp.DESIG == "Telemóvel")
                            response.data[0].TEM = e.CONTACTO;
                        if (e.sgigjprcontactotp.DESIG == "Email")
                            response.data[0].EMAIL = e.CONTACTO;
                    }

                    var doclist = [];

                    for (
                        let ix = 0;
                        ix < response.data[0].sgigjreldocumento.length;
                        ix++
                    ) {
                        doclist.push({
                            id: response.data[0].sgigjreldocumento[ix].ID,
                            nome: response.data[0].sgigjreldocumento[ix].sgigjprdocumentotp
                                .DESIG,
                            url: response.data[0].sgigjreldocumento[ix].DOC_URL,
                        });
                    }

                    response.data[0].doclist = doclist;
                    setitemSelectedver(response.data[0]);

                }
            }
        } catch (err) {
            console.error(err.response);
        }
    };

    async function editarItem(event) {
        event.preventDefault();
        setIsLoading(true)

        if (thumnail == null) return popUp_alertaOK("Escolha uma imagem");

        var anexofile = "";
        const img = await onFormSubmitImage(thumnail);
        anexofile = img.file.data;

        const upload = {
            SELF_ID: SELF_ID_C,
            PR_ENTIDADE_TP_ID: PR_ENTIDADE_TP_ID_C,
            GEOGRAFIA_ID: GEOGRAFIA_ID_C,
            DESIG: DESIG_C,
            ENDERECO: ENDERECO_C,
            ENDERECO_COORD: ENDERECO_COORD_C,
            OBS: OBS_C,
            NIF: NIF_C,
            REGISTO_COMERCIAL: REGISTO_COMERCIAL_C,
            CAPITAL_SOCIAL: CAPITAL_SOCIAL_C,
            LOGO_URL: LOGO_URL_C,
            DT_INICIO_ATIVIDADE: DT_INICIO_ATIVIDADE_C,
            LOGO_URL: anexofile,

        };

        console.log(upload);

        try {
            const response = await api.put("/sgigjentidade/" + ID_C, upload);

            if (response.status == "200") {
                if (contacedit == true) {
                    const response2x = await api.delete(
                        "/sgigjrelcontacto/0?ENTIDADE_ID=" + ID_C
                    );

                    console.log(response2x.status);

                    if (response2x.status == "200" || response2x.status == "204") {
                        console.log(novoscontactos);

                        for (let i = 0; i < novoscontactos.length; i++) {
                            if (
                                novoscontactos[i].tipocontacto != "" &&
                                novoscontactos[i].contacto != ""
                            ) {
                                console.log(novoscontactos);

                                const upload2 = {
                                    ENTIDADE_ID: ID_C,
                                    PR_CONTACTO_TP_ID: novoscontactos[i].tipocontacto,
                                    CONTACTO: novoscontactos[i].contacto,

                                };

                                try {
                                    const response2 = await api.post(
                                        "/sgigjrelcontacto",
                                        upload2
                                    );
                                } catch (err) {
                                    console.error(err.response);
                                }
                            }
                        }
                    }
                }

                if (docedit == true) {
                    const response2x = await api.delete(
                        "/sgigjreldocumento/0?ENTIDADE_ID=" + ID_C
                    );

                    console.log(response2x.status);

                    if (response2x.status == "200" || response2x.status == "204") {
                        console.log(novoscontactos);

                        for (let i = 0; i < novosdocumentos.length; i++) {
                            if (
                                novosdocumentos[i].tipodocumento != "" &&
                                novosdocumentos[i].numero != ""
                            ) {
                                console.log(novosdocumentos);

                                var anexofile = "";

                                if (novosdocumentos[i].anexo.type == "1") {
                                    anexofile = novosdocumentos[i].anexo.file;
                                }

                                if (novosdocumentos[i].anexo.type == "2") {
                                    const img = await onFormSubmitImage(
                                        novosdocumentos[i].anexo.file
                                    );

                                    anexofile = img.file.data;
                                }

                                console.log(anexofile);

                                const upload2 = {
                                    ENTIDADE_ID: ID_C,
                                    PR_DOCUMENTO_TP_ID: novosdocumentos[i].tipodocumento,
                                    NUMERO: novosdocumentos[i].numero,
                                    DOC_URL: anexofile,
                                    DT_EMISSAO: novosdocumentos[i].dataemissao,
                                    DT_VALIDADE: novosdocumentos[i].datavalidade,

                                };

                                try {
                                    const response2 = await api.post(
                                        "/sgigjreldocumento",
                                        upload2
                                    );
                                } catch (err) {
                                    console.error(err.response);
                                }
                            }
                        }
                    }
                }

                openVerHandler(id);
                setIsLoading(false)
                setIsEditarOpen(false);
            }
        } catch (err) {
            setIsLoading(false)

            console.error(err.response);
        }
    }




    return (<>


        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <div className="page-header">
                        <div className="page-block">
                            <div className="row align-items-center">
                                <div className="col-md-12">
                                    <div className="page-header-title">
                                        <h5 className="m-b-10">{itemSelectedver.DESIG}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
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
                    } /> Dados</span>} >

                            {tabDescription == "dados" &&

                                Object.keys(itemSelectedver).length === 0 ? null : (
                                <Modal.Body>
                                    <Row>
                                        <Col xl={4} className="task-detail-right">
                                            <div
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <span>
                                                    <i className="feather icon-shield m-r-5" />
                                                    Geral
                                                </span>
                                            </div>

                                            <div
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "20px",
                                                    flexDirection: "column",
                                                    borderBottom: "1px solid #d2b32a",
                                                    borderTop: "1px solid #d2b32a",
                                                    paddingBottom: "15px",
                                                    paddingTop: "15px",
                                                    marginTop: "5px",
                                                }}
                                            >
                                                {itemSelectedver.LOGO_URL != "" || itemSelectedver.LOGO_URL != "0" ?
                                                    <>
                                                        <div style={{
                                                            width: "60px",
                                                            position: "relative",
                                                            height: "60px"
                                                        }} className='casino-logo'>
                                                            <img style={{
                                                                width: "100%",
                                                                position: "absolute",
                                                                height: "100%"
                                                            }} src={itemSelectedver.LOGO_URL +
                                                                '?alt=media&token=0'} alt="" />
                                                        </div>
                                                    </>
                                                    : <i
                                                        className="feather icon-shield"
                                                        style={{
                                                            fontSize: "80px",
                                                            marginBottom: "15px",
                                                            marginTop: "10px",
                                                        }}
                                                    />}
                                                <span>{itemSelectedver.DESIG}</span>
                                            </div>

                                            <div
                                                style={{
                                                    borderBottom: "1px solid #d2b32a",
                                                    marginBottom: "20px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "15px",
                                                    }}
                                                >
                                                    <span>
                                                        <i className="feather icon-map-pin m-r-5" />
                                                        Tipo de Entidade
                                                    </span>

                                                    <span style={{ color: "#6c757d" }}>
                                                        {itemSelectedver.sgigjprentidadetp.DESIG}
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "15px",
                                                    }}
                                                >
                                                    <span>
                                                        <i className="feather icon-map-pin m-r-5" />
                                                        NIF
                                                    </span>
                                                    <span style={{ color: "#6c757d" }}>
                                                        {itemSelectedver.NIF}
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "15px",
                                                    }}
                                                >
                                                    <span>
                                                        <i className="feather icon-map-pin m-r-5" />
                                                        Início de Atividade
                                                    </span>
                                                    <span style={{ color: "#6c757d" }}>
                                                        {makedate(itemSelectedver.DT_INICIO_ATIVIDADE)}
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "15px",
                                                    }}
                                                >
                                                    <span>
                                                        <i className="feather icon-map-pin m-r-5" />
                                                        Registo Comercial
                                                    </span>
                                                    <span style={{ color: "#6c757d" }}>
                                                        {itemSelectedver.REGISTO_COMERCIAL}
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    borderBottom: "1px solid #d2b32a",
                                                    marginBottom: "20px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "15px",
                                                    }}
                                                >
                                                    <span>
                                                        <i className="feather icon-map-pin m-r-5" />
                                                        Capital Social
                                                    </span>
                                                    <span style={{ color: "#6c757d" }}>
                                                        {formatCurrency(itemSelectedver.CAPITAL_SOCIAL)}
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        marginBottom: "15px",
                                                    }}
                                                >
                                                    <span>
                                                        <i className="feather icon-map-pin m-r-5" />
                                                        Observações
                                                    </span>
                                                    <span style={{ color: "#6c757d" }}>
                                                        {itemSelectedver.OBS}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "15px",
                                                    }}
                                                >
                                                    <span>
                                                        <i className="feather icon-phone m-r-5" />
                                                        Telefone
                                                    </span>
                                                    <span style={{ color: "#6c757d" }}>
                                                        {itemSelectedver.TEL}
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "15px",
                                                    }}
                                                >
                                                    <span>
                                                        <i className="feather icon-phone m-r-5" />
                                                        Telemóvel
                                                    </span>
                                                    <span style={{ color: "#6c757d" }}>
                                                        {itemSelectedver.TEM}
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        marginBottom: "15px",
                                                    }}
                                                >
                                                    <span>
                                                        <i className="feather icon-mail m-r-5" />
                                                        Email
                                                    </span>
                                                    <span style={{ color: "#6c757d" }}>
                                                        {itemSelectedver.EMAIL}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-end'>
                                                {taskEnable(pageAcess, permissoes, "Editar") == false ? null : (
                                                    <>
                                                        {!isOpenModalEdit ?
                                                            <Button
                                                                variant="primary"
                                                                className="btn-sm btn-round has-ripple ml-2"
                                                                onClick={() => openEditHandler(itemSelectedver)}
                                                            >
                                                                <i className="feather icon-edit" /> Editar
                                                            </Button>
                                                            : <Button
                                                                variant="primary"
                                                                className="btn-sm btn-round has-ripple ml-2"
                                                            >
                                                                <i className="feather icon-pencil" /> Aguarde...
                                                            </Button>
                                                        }
                                                    </>
                                                )}

                                            </div>


                                        </Col>

                                        <Col xl={8} className="task-detail-right">
                                            <div
                                                style={{
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "spaceAround",
                                                }}
                                            >
                                                <span
                                                    onClick={() => setverlistgp("colaboradores")}
                                                    style={
                                                        verlistgp == "colaboradores"
                                                            ? {
                                                                paddingBottom: "4px",
                                                                cursor: "pointer",
                                                                borderBottom: "2px solid #d2b32a",
                                                                width: "100%",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }
                                                            : {
                                                                paddingBottom: "4px",
                                                                cursor: "pointer",
                                                                borderBottom: "1px solid #E5E5E5",
                                                                width: "100%",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }
                                                    }
                                                >
                                                    <i className="feather icon-users m-r-5" />
                                                    Colaboradores
                                                </span>

                                                <span
                                                    onClick={() => setverlistgp("equipamentos")}
                                                    style={
                                                        verlistgp == "equipamentos"
                                                            ? {
                                                                paddingBottom: "4px",
                                                                cursor: "pointer",
                                                                borderBottom: "2px solid #d2b32a",
                                                                width: "100%",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }
                                                            : {
                                                                paddingBottom: "4px",
                                                                cursor: "pointer",
                                                                borderBottom: "1px solid #E5E5E5",
                                                                width: "100%",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }
                                                    }
                                                >
                                                    <i className="feather icon-monitor m-r-5" />
                                                    Equipamentos
                                                </span>

                                                <span
                                                    onClick={() => setverlistgp("documentos")}
                                                    style={
                                                        verlistgp == "documentos"
                                                            ? {
                                                                paddingBottom: "4px",
                                                                cursor: "pointer",
                                                                borderBottom: "2px solid #d2b32a",
                                                                width: "100%",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }
                                                            : {
                                                                paddingBottom: "4px",
                                                                cursor: "pointer",
                                                                borderBottom: "1px solid #E5E5E5",
                                                                width: "100%",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }
                                                    }
                                                >
                                                    <i className="feather icon-file-text m-r-5" />
                                                    Documentos
                                                </span>
                                            </div>

                                            <div
                                                style={{
                                                    width: "66%",
                                                    display: "flex",
                                                    justifyContent: "spaceAround",
                                                    marginTop: "10px",
                                                }}
                                            >
                                                <span
                                                    onClick={() => setverlistgp("maquinas")}
                                                    style={
                                                        verlistgp == "maquinas"
                                                            ? {
                                                                paddingBottom: "4px",
                                                                cursor: "pointer",
                                                                borderBottom: "2px solid #d2b32a",
                                                                width: "100%",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }
                                                            : {
                                                                paddingBottom: "4px",
                                                                cursor: "pointer",
                                                                borderBottom: "1px solid #E5E5E5",
                                                                width: "100%",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }
                                                    }
                                                >
                                                    <i className="feather icon-cpu m-r-5" />
                                                    Máquinas
                                                </span>

                                                <span
                                                    onClick={() => setverlistgp("bancas")}
                                                    style={
                                                        verlistgp == "bancas"
                                                            ? {
                                                                paddingBottom: "4px",
                                                                cursor: "pointer",
                                                                borderBottom: "2px solid #d2b32a",
                                                                width: "100%",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }
                                                            : {
                                                                paddingBottom: "4px",
                                                                cursor: "pointer",
                                                                borderBottom: "1px solid #E5E5E5",
                                                                width: "100%",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }
                                                    }
                                                >
                                                    <i className="feather icon-layout m-r-5" />
                                                    Bancas
                                                </span>
                                            </div>

                                            <div
                                                style={
                                                    verlistgp == "colaboradores"
                                                        ? {
                                                            width: "100%",
                                                            height: "450px",
                                                            overflow: "auto",
                                                        }
                                                        : { display: "none" }
                                                }
                                            >
                                                <div
                                                    style={{
                                                        width: "100%",

                                                        paddingTop: "20px",
                                                        marginTop: "20px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            padding: "5px",
                                                            borderBottom: "1px solid #d2b32a",
                                                            width: "100%",
                                                            display: "flex",
                                                            marginBottom: "10px",
                                                        }}
                                                    >
                                                        <span style={{ color: "#6c757d", width: "30%" }}>
                                                            Nome
                                                        </span>
                                                        <span style={{ color: "#6c757d", width: "25%" }}>
                                                            Categoria Prof.
                                                        </span>
                                                        <span style={{ color: "#6c757d", width: "25%" }}>
                                                            Escolaridade
                                                        </span>
                                                        <span style={{ color: "#6c757d", width: "20%" }}>
                                                            Dt. Início
                                                        </span>
                                                    </div>

                                                    {itemSelectedver.sgigjrelpessoaentidade.map((e) => (
                                                        <div
                                                            key={e.ID}
                                                            onMouseOver={() => showld(e.ID)}
                                                            onMouseOut={() => setshowlinguadata(false)}
                                                            style={{
                                                                padding: "7px",
                                                                width: "100%",
                                                                display: "flex",
                                                                borderBottom: "1px solid #E5E5E5",
                                                                marginBottom: "10px",
                                                                position: "relative",
                                                            }}
                                                        >
                                                            <span style={{ color: "#6c757d", width: "30%" }}>
                                                                {e.sgigjpessoa.NOME}
                                                            </span>
                                                            <span style={{ color: "#6c757d", width: "25%" }}>
                                                                {e.sgigjprcategoriaprofissional.DESIG}
                                                            </span>
                                                            <span style={{ color: "#6c757d", width: "25%" }}>
                                                                {e.sgigjprnivelescolaridade.DESIG}
                                                            </span>
                                                            <span style={{ color: "#6c757d", width: "20%" }}>
                                                                {makedate(e.DT_INICIO)}
                                                            </span>

                                                            {e.sgigjrelpessoaentidadelingua.length <
                                                                1 ? null : (
                                                                <div
                                                                    style={
                                                                        showlinguadata == true &&
                                                                            showlinguapessoa == e.ID
                                                                            ? {
                                                                                display: "inline",
                                                                                position: "absolute",
                                                                                backgroundColor: "#EFEFEF",
                                                                                padding: "10px",
                                                                                top: "38px",
                                                                                borderRadius: "8px",
                                                                                zIndex: "8",
                                                                                boxShadow: "0px 0px 19px -16px #000000",
                                                                            }
                                                                            : { display: "none" }
                                                                    }
                                                                >
                                                                    <div
                                                                        style={{
                                                                            display: "flex",
                                                                            width: "250px",
                                                                            justifyContent: "space-between",
                                                                            borderBottom: "1px solid #d2b32a",
                                                                            paddingBottom: "4px",
                                                                            marginBottom: "8px",
                                                                        }}
                                                                    >
                                                                        <span>Língua</span>
                                                                        <span>Nível</span>
                                                                    </div>

                                                                    {e.sgigjrelpessoaentidadelingua.map((ex) =>
                                                                        showlinguapessoa != e.ID ? null : (
                                                                            <div
                                                                                style={{
                                                                                    display: "flex",
                                                                                    width: "250px",
                                                                                    justifyContent: "space-between",
                                                                                }}
                                                                                key={ex.ID}
                                                                            >
                                                                                <span>{ex.sgigjprlingua.DESIG}</span>
                                                                                <span>
                                                                                    {ex.sgigjprnivellinguistico.DESIG}
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div
                                                style={
                                                    verlistgp == "maquinas"
                                                        ? {
                                                            width: "100%",
                                                            height: "450px",
                                                            overflow: "auto",
                                                        }
                                                        : { display: "none" }
                                                }
                                            >
                                                <div
                                                    style={{
                                                        width: "100%",

                                                        paddingTop: "20px",
                                                        marginTop: "20px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            padding: "5px",
                                                            borderBottom: "1px solid #d2b32a",
                                                            width: "100%",
                                                            display: "flex",
                                                            marginBottom: "10px",
                                                        }}
                                                    >
                                                        <span style={{ color: "#6c757d", width: "37%" }}>
                                                            Designação
                                                        </span>
                                                        <span style={{ color: "#6c757d", width: "29%" }}>
                                                            Tipo
                                                        </span>
                                                        <span style={{ color: "#6c757d", width: "10%" }}>
                                                            Qtd
                                                        </span>
                                                        <span style={{ color: "#6c757d", width: "23%" }}>
                                                            Num_Serie
                                                        </span>
                                                    </div>

                                                    {itemSelectedver.sgigjentidademaquina.map((e) => (
                                                        <div
                                                            key={e.ID}
                                                            style={{
                                                                padding: "7px",
                                                                width: "100%",
                                                                display: "flex",
                                                                borderBottom: "1px solid #E5E5E5",
                                                                marginBottom: "10px",
                                                            }}
                                                        >
                                                            <span style={{ color: "#6c757d", width: "37%" }}>
                                                                {e.MAQUINA}
                                                            </span>
                                                            <span style={{ color: "#6c757d", width: "29%" }}>
                                                                {e.sgigjprmaquinatp.DESIG}
                                                            </span>
                                                            <span style={{ color: "#6c757d", width: "10%" }}>
                                                                {e.QUANT}
                                                            </span>
                                                            <span style={{ color: "#6c757d", width: "23%" }}>
                                                                {e.NUM_SERIE}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div
                                                style={
                                                    verlistgp == "bancas"
                                                        ? {
                                                            width: "100%",
                                                            height: "450px",
                                                            overflow: "auto",
                                                        }
                                                        : { display: "none" }
                                                }
                                            >
                                                <div
                                                    style={{
                                                        width: "100%",

                                                        paddingTop: "20px",
                                                        marginTop: "20px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            padding: "5px",
                                                            borderBottom: "1px solid #d2b32a",
                                                            width: "100%",
                                                            display: "flex",
                                                            marginBottom: "10px",
                                                        }}
                                                    >
                                                        <span style={{ color: "#6c757d", width: "40%" }}>
                                                            Designação
                                                        </span>
                                                        <span style={{ color: "#6c757d", width: "33%" }}>
                                                            Tipo
                                                        </span>
                                                        <span style={{ color: "#6c757d", width: "26%" }}>
                                                            Num_Serie
                                                        </span>
                                                    </div>

                                                    {itemSelectedver.sgigjentidadebanca.map((e) => (
                                                        <div
                                                            key={e.ID}
                                                            style={{
                                                                padding: "7px",
                                                                width: "100%",
                                                                display: "flex",
                                                                borderBottom: "1px solid #E5E5E5",
                                                                marginBottom: "10px",
                                                            }}
                                                        >
                                                            <span style={{ color: "#6c757d", width: "40%" }}>
                                                                {e.BANCA}
                                                            </span>
                                                            <span style={{ color: "#6c757d", width: "33%" }}>
                                                                {e.sgigjprbancatp.DESIG}
                                                            </span>
                                                            <span style={{ color: "#6c757d", width: "26%" }}>
                                                                {e.NUM_SERIE}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div
                                                style={
                                                    verlistgp == "equipamentos"
                                                        ? {
                                                            width: "100%",
                                                            height: "450px",
                                                            overflow: "auto",
                                                        }
                                                        : { display: "none" }
                                                }
                                            >
                                                <div
                                                    style={{
                                                        width: "100%",

                                                        paddingTop: "20px",
                                                        marginTop: "20px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            padding: "5px",
                                                            borderBottom: "1px solid #d2b32a",
                                                            width: "100%",
                                                            display: "flex",
                                                            marginBottom: "10px",
                                                        }}
                                                    >
                                                        <span style={{ color: "#6c757d", width: "32%" }}>
                                                            Designação
                                                        </span>
                                                        <span style={{ color: "#6c757d", width: "28%" }}>
                                                            Tipo
                                                        </span>
                                                        <span style={{ color: "#6c757d", width: "10%" }}>
                                                            Qtd
                                                        </span>
                                                        <span style={{ color: "#6c757d", width: "20%" }}>
                                                            Preço
                                                        </span>
                                                        <span style={{ color: "#6c757d", width: "10%" }}>
                                                            Ano
                                                        </span>
                                                    </div>

                                                    {itemSelectedver.sgigjentidadeequipamento.map((e) => (
                                                        <div
                                                            key={e.ID}
                                                            style={{
                                                                padding: "7px",
                                                                width: "100%",
                                                                display: "flex",
                                                                borderBottom: "1px solid #E5E5E5",
                                                                marginBottom: "10px",
                                                            }}
                                                        >
                                                            <span style={{ color: "#6c757d", width: "32%" }}>
                                                                {e.DESIG}
                                                            </span>
                                                            <span style={{ color: "#6c757d", width: "28%" }}>
                                                                {e.sgigjprequipamentotp.DESIG}
                                                            </span>
                                                            <span style={{ color: "#6c757d", width: "10%" }}>
                                                                {e.QUANT}
                                                            </span>
                                                            <span style={{ color: "#6c757d", width: "20%" }}>
                                                                {e.PRECO}
                                                            </span>
                                                            <span style={{ color: "#6c757d", width: "10%" }}>
                                                                {e.ANO}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div
                                                style={
                                                    verlistgp == "documentos"
                                                        ? {
                                                            width: "100%",
                                                            height: "450px",
                                                        }
                                                        : { display: "none" }
                                                }
                                            >
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        borderBottom: "1px solid #d2b32a",
                                                        paddingTop: "20px",
                                                        paddingBottom: "20px",
                                                        marginBottom: "20px",
                                                        overflow: "auto",
                                                        height: "70px",
                                                    }}
                                                >
                                                    {typeof itemSelectedver.doclist != "undefined"
                                                        ? itemSelectedver.doclist.map((e, i) => (
                                                            <Link onClick={() => selectDocTypeAndSetPrevImg(i, e.url)} key={e.id} style={{ margin: "2px", color: i === index ? '#d2b32a' : '#6c757d' }} to='#' className="mb-1  d-flex align-items-end text-h-primary">{"::" + e.nome}</Link>
                                                        ))
                                                        : null}
                                                </div>

                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        marginBottom: "10px",
                                                    }}
                                                >
                                                    <span>
                                                        <i className="feather icon-eye m-r-5" />
                                                        Pré-vizualização
                                                    </span>
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
                                            </div>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                            )

                            }
                        </Tab>
                        {taskEnable(pageAcess, permissoes, "Tabparametrizacao") == false ? null : (
                            <Tab
                                eventKey="parametrizacao" title={<span> <i className={
                                    "icon-tab-casino feather icon-settings"
                                } /> Parametrizações</span>}>
                                {tabDescription === "parametrizacao" &&
                                    <Tabs
                                        onSelect={(e) => handleSelectedTabChildren(e)}

                                        defaultActiveKey="grupo"
                                        id="justify-tab-example"
                                        className="mb-3"
                                        justify
                                    >
                                        {taskEnable(pageAcess, permissoes, "Tabgrupo") == false ? null : (

                                            <Tab eventKey="grupo" title={<span> <i className={
                                                "icon-tab-casino feather icon-users"
                                            } /> Grupo</span>}>
                                                {(tabDescription === "parametrizacao" || tabDescriptionChildren === "grupo") &&

                                                    <Grupo key={id} />
                                                }
                                            </Tab>
                                        )}
                                        {taskEnable(pageAcess, permissoes, "Tabequipamento") == false ? null : (

                                            <Tab eventKey="equipamentos" title={<span> <i className={
                                                "icon-tab-casino feather icon-monitor"
                                            } /> Equipamento</span>}>
                                                {tabDescriptionChildren === "equipamentos" &&
                                                    <Equipamento key={id} />}
                                            </Tab>
                                        )}
                                        {taskEnable(pageAcess, permissoes, "Tabparametrizacaobanca") == false ? null : (
                                            <Tab eventKey="banca" title={<span> <i className={
                                                "icon-tab-casino feather icon-layout"
                                            } /> Banca</span>}>
                                                {tabDescriptionChildren === "banca" &&
                                                    <Banca key={id} />}
                                            </Tab>
                                        )}
                                        {taskEnable(pageAcess, permissoes, "Tabparametrizacaomaquina") == false ? null : (
                                            <Tab eventKey="maquina" title={<span> <i className={
                                                "icon-tab-casino feather icon-cpu"
                                            } /> Máquina</span>}>
                                                {tabDescriptionChildren === "maquina" &&
                                                    <Maquina key={id} />}
                                            </Tab>
                                        )}
                                        {taskEnable(pageAcess, permissoes, "Tabparametrizacaocolaboradores") == false ? null : (

                                            <Tab eventKey="colaboradores" title={<span> <i className={
                                                "icon-tab-casino feather icon-user-check"
                                            } /> Colaboradores</span>}>
                                                {tabDescriptionChildren === "colaboradores" &&
                                                    <Colaboradores key={id} />}
                                            </Tab>
                                        )}
                                    </Tabs>
                                }
                            </Tab>
                        )}
                        {taskEnable(pageAcess, permissoes, "Tabhandpay") == false ? null : (

                            <Tab eventKey="handpay" title={<span> <i className={
                                "icon-tab-casino feather icon-dollar-sign"
                            } /> Handpay</span>}>
                                {tabDescription === "handpay" &&
                                    <Handpay key={id} />}
                            </Tab>
                        )}
                        {taskEnable(pageAcess, permissoes, "Tabeventos") == false ? null : (
                            <Tab eventKey="eventos" title={<span> <i className={
                                "icon-tab-casino feather icon-calendar"
                            } /> Eventos</span>}>
                                {tabDescription === "eventos" &&
                                    <Tabs
                                        onSelect={(e) => handleSelectedTabChildren(e)}
                                        defaultActiveKey="eventospedidos"
                                        id="justify-tab-example"
                                        className="mb-3"
                                        justify
                                    >
                                        {taskEnable(pageAcess, permissoes, "Tabeventospedidos") == false ? null : (

                                            <Tab eventKey="eventospedidos" title={<span> <i className={
                                                "icon-tab-casino feather icon-inbox"
                                            } /> Pedidos</span>}>
                                                {(tabDescription === "eventos" || tabDescriptionChildren === "eventospedidos") &&
                                                    < EventosPedidos key={id} />
                                                }
                                            </Tab>)}
                                        {taskEnable(pageAcess, permissoes, "Tabeventoseaprovados") == false ? null : (
                                            <Tab eventKey="aprovados" title={<span> <i className={
                                                "icon-tab-casino feather icon-check-circle"
                                            } /> Aprovados</span>}>
                                                {tabDescriptionChildren == "aprovados" &&
                                                    <EventosAprovados key={id} />
                                                }
                                            </Tab>
                                        )}

                                        {taskEnable(pageAcess, permissoes, "Tabeventosrecusados") == false ? null : (

                                            <Tab eventKey="recusados" title={<span> <i className={
                                                "icon-tab-casino feather icon-x-circle"
                                            } /> Recusados</span>}>
                                                {tabDescriptionChildren == "recusados" &&
                                                    <EventosRecusados key={id} />
                                                }
                                            </Tab>)}

                                    </Tabs>

                                }
                            </Tab>)}

                        {taskEnable(pageAcess, permissoes, "Tabprocessos") == false ? null : (
                            <Tab eventKey="processos" title={<span> <i className={
                                "icon-tab-casino feather icon-folder"
                            } /> Processos</span>}>
                                {tabDescription === "processos" &&

                                    <Tabs
                                        onSelect={(e) => handleSelectedTabChildren(e)}

                                        defaultActiveKey="emcurso"
                                        id="justify-tab-example"
                                        className="mb-3"
                                        justify
                                    >
                                        {taskEnable(pageAcess, permissoes, "Tabprocessosempcurso") == false ? null : (

                                            <Tab eventKey="emcurso" title={<span> <i className={
                                                "icon-tab-casino feather icon-clock"
                                            } /> Em curso</span>}>
                                                {(tabDescription === "processos" || tabDescriptionChildren === "emcurso") &&
                                                    <ProcessoEmCurso key={id} />}
                                            </Tab>
                                        )}
                                        {taskEnable(pageAcess, permissoes, "Tabprocessosdespachados") == false ? null : (
                                            <Tab eventKey="despachados" title={<span> <i className={
                                                "icon-tab-casino feather icon-send"
                                            } /> Despachados</span>}>
                                                {tabDescriptionChildren === "despachados" &&
                                                    <ProcessoFinalizado key={id} />
                                                }
                                            </Tab>
                                        )}
                                        {taskEnable(pageAcess, permissoes, "Tabprocessosarquivados") == false ? null : (

                                            <Tab eventKey="arquivados" title={<span> <i className={
                                                "icon-tab-casino feather icon-archive"
                                            } /> Arquivados</span>}>
                                                {tabDescriptionChildren === "arquivados" &&

                                                    <ProcessoArquivados key={id} />}
                                            </Tab>
                                        )}
                                        {taskEnable(pageAcess, permissoes, "Tabprocessosprescritos") == false ? null : (

                                            <Tab eventKey="prescritos" title={<span> <i className={
                                                "icon-tab-casino feather icon-alert-octagon"
                                            } /> Prescritos</span>} >
                                                {tabDescriptionChildren === "prescritos" &&
                                                    <ProcessoPrescritos key={id} />
                                                }
                                            </Tab>
                                        )}
                                    </Tabs>

                                }
                            </Tab>
                        )}
                        {taskEnable(pageAcess, permissoes, "Tabparametrizacaocasosuspeito") == false ? null : (


                            <Tab eventKey="casossuspeitos" title={<span> <i className={
                                "icon-tab-casino feather icon-alert-triangle"
                            } /> Casos Suspeitos</span>} >
                                {tabDescription === "casossuspeitos" &&
                                    <CasoSuspeito key={id} />}

                            </Tab>)}
                        {taskEnable(pageAcess, permissoes, "Tabparametrizacaofinanceiro") == false ? null : (

                            <Tab eventKey="financeiros" title={<span> <i className={
                                "icon-tab-casino feather icon-credit-card"
                            } /> Financeiros</span>}>

                                {tabDescription === "financeiros" &&

                                    <Tabs
                                        onSelect={(e) => handleSelectedTabChildren(e)}

                                        defaultActiveKey="contrapartida"
                                        id="justify-tab-example"
                                        className="mb-3"
                                        justify
                                    >
                                        {taskEnable(pageAcess, permissoes, "TabContrapartida") == false ? null : (

                                            <Tab eventKey="contrapartida" title={<span> <i className={
                                                "icon-tab-casino feather icon-repeat"
                                            } /> Contrapartida</span>}>
                                                {(tabDescription === "financeiros" || tabDescriptionChildren === "contrapartida") &&
                                                    <Contrapartida key={id} />}
                                            </Tab>
                                        )}
                                        {taskEnable(pageAcess, permissoes, "TabContribuicoes") == false ? null : (

                                            <Tab eventKey="contribuicoes" title={<span> <i className={
                                                "icon-tab-casino feather icon-trending-up"
                                            } /> Contribuições IGJ</span>}>
                                                {(tabDescriptionChildren === "contribuicoes") &&
                                                    <Contribuicoes key={id} />}
                                            </Tab>
                                        )}
                                        {taskEnable(pageAcess, permissoes, "TabImposto") == false ? null : (

                                            <Tab eventKey="imposto" title={<span> <i className={
                                                "icon-tab-casino " +
                                                taskEnableIcon(pageAcess, permissoes, "TabImposto")
                                            } /> Imposto Especial</span>}>
                                                {(tabDescriptionChildren === "imposto") &&
                                                    <Imposto key={id} />}
                                            </Tab>
                                        )}
                                        {taskEnable(pageAcess, permissoes, "TabPremios") == false ? null : (

                                            <Tab eventKey="premios" title={<span> <i className={
                                                "icon-tab-casino " +
                                                taskEnableIcon(pageAcess, permissoes, "TabPremios")
                                            } /> Prêmios</span>}>
                                                {(tabDescriptionChildren === "premios") &&
                                                    <Premios key={id} />}
                                            </Tab>
                                        )}

                                    </Tabs>

                                }
                            </Tab>
                        )}
                    </Tabs>
                    {/* </Card.Body> */}
                    {/* </Card> */}


                </Col>
                <Modal
                    size="lg"
                    show={isEditarOpen}
                    onHide={() => setIsEditarOpen(false)}
                >
                    <Modal.Header style={{ border: "0" }} closeButton>
                        <Modal.Title as="h5">Editar</Modal.Title>
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
                                    activeProfileTab === "geral"
                                        ? profileTabActiveClass
                                        : profileTabClass
                                }
                                onClick={() => {
                                    setActiveProfileTab("geral");
                                }}
                                id="profile-tab"
                            >
                                <i className="feather icon-user mr-2" />
                                Perfil
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="#"
                                className={
                                    activeProfileTab === "contactos"
                                        ? profileTabActiveClass
                                        : profileTabClass
                                }
                                onClick={() => {
                                    setActiveProfileTab("contactos");
                                }}
                                id="contact-tab"
                            >
                                <i className="feather icon-phone mr-2" />
                                Contactos
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                to="#"
                                className={
                                    activeProfileTab === "documentos"
                                        ? profileTabActiveClass
                                        : profileTabClass
                                }
                                onClick={() => {
                                    setActiveProfileTab("documentos");
                                }}
                                id="contact-tab"
                            >
                                <i className="feather icon-file-text mr-2" />
                                Documentos
                            </Link>
                        </li>
                    </ul>

                    <Modal.Body
                        style={
                            activeProfileTab === "documentos" ? {} : { display: "none" }
                        }
                    >
                        <Col
                            style={{ display: "flex", justifyContent: "flex-end" }}
                            sm={12}
                        >
                            <Button onClick={() => addnovosdocumentos()} variant="primary">
                                +
                            </Button>
                        </Col>

                        {novosdocumentos.map((eq) => (
                            <Row style={{ marginBottom: "12px" }} key={eq.id}>
                                <Col sm={10}>
                                    <Row>
                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Phone">
                                                    Tipo de Documentos{" "}
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <select
                                                    defaultValue={eq.tipodocumento}
                                                    onChange={(event) => {
                                                        criartipodoc(event.target.value, eq.id);
                                                    }}
                                                    className="form-control"
                                                    id="perfil"
                                                    required
                                                    aria-required="true"
                                                >
                                                    <option hidden value="">
                                                        --- Selecione ---
                                                    </option>

                                                    {documentolist.map((e) => (
                                                        <option key={e.ID} value={e.ID}>
                                                            {e.DESIG}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </Col>
                                        <Col sm={3}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="text">
                                                    Número <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    max="99999999999999"
                                                    defaultValue={eq.numero}
                                                    onChange={(event) => {
                                                        criardocnum(event.target.value, eq.id);
                                                    }}
                                                    type="number"
                                                    className="form-control"
                                                />
                                            </div>
                                        </Col>

                                        <div className="sm-2 paddinhtop28OnlyPC">
                                            <label
                                                htmlFor={"anexareditar" + eq.id}
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
                                                id={"anexareditar" + eq.id}
                                                style={{ display: "none" }}
                                                onChange={(event) =>
                                                    criaranexo(event.target.files[0], eq.id)
                                                }
                                                accept="image/x-png,image/jpeg"
                                                type="file"
                                            />
                                        </div>

                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="date">
                                                    Data de Emissão
                                                </label>
                                                <input
                                                    defaultValue={eq.dataemissao}
                                                    onChange={(event) => {
                                                        criardocdataE(event.target.value, eq.id);
                                                    }}
                                                    type="date"
                                                    className="form-control"
                                                />
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="text">
                                                    Data de Validade
                                                </label>
                                                <input
                                                    defaultValue={eq.datavalidade}
                                                    onChange={(event) => {
                                                        criardocdataV(event.target.value, eq.id);
                                                    }}
                                                    type="date"
                                                    className="form-control"
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>

                                {novosdocumentos.length > 1 ? (
                                    <div className="paddinhtop66OnlyPC sm-2">
                                        <Button
                                            onClick={() => removenovosdocumentos(eq.id)}
                                            variant="danger"
                                        >
                                            <i className="feather icon-trash-2" />
                                        </Button>
                                    </div>
                                ) : null}
                            </Row>
                        ))}
                    </Modal.Body>

                    <Modal.Body
                        style={
                            activeProfileTab === "contactos" ? {} : { display: "none" }
                        }
                    >
                        <Col
                            style={{ display: "flex", justifyContent: "flex-end" }}
                            sm={12}
                        >
                            <Button onClick={() => addnovoscontactos()} variant="primary">
                                +
                            </Button>
                        </Col>

                        {novoscontactos.map((eq) => (
                            <Row style={{ marginBottom: "12px" }} key={eq.id}>
                                <Col sm={5}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Phone">
                                            Tipo de Contacto <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <select
                                            defaultValue={eq.tipocontacto}
                                            onChange={(event) => {
                                                criartipocontacto(event.target.value, eq.id);
                                            }}
                                            className="form-control"
                                            id="perfil"
                                            required
                                            aria-required="true"
                                        >
                                            <option hidden value="">
                                                --- Selecione ---
                                            </option>

                                            {contactolist.map((e) => (
                                                <option key={e.ID} value={e.ID}>
                                                    {e.DESIG}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </Col>
                                <Col sm={5}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="text">
                                            Contacto <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            defaultValue={eq.contacto}
                                            onChange={(event) => {
                                                criacontacto(event.target.value, eq.id);
                                            }}
                                            type="text"
                                            className="form-control"
                                        />
                                    </div>
                                </Col>

                                {novoscontactos.length > 1 ? (
                                    <div className="sm-2 paddinhtop28OnlyPC">
                                        <Button
                                            onClick={() => removenovoscontactos(eq.id)}
                                            variant="danger"
                                        >
                                            <i className="feather icon-trash-2" />
                                        </Button>
                                    </div>
                                ) : null}
                            </Row>
                        ))}
                    </Modal.Body>

                    <Modal.Body
                        style={activeProfileTab === "geral" ? {} : { display: "none" }}
                    >
                        {/* --------------------Editar Entidade-------------------- */}

                        <form id="editarItem" onSubmit={editarItem}>
                            <Row>
                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="text">
                                            Código <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            disabled
                                            onChange={() => doNada()}
                                            defaultValue={itemSelected.CODIGO}
                                            type="text"
                                            className="form-control"
                                            id="Name"
                                        />
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name"></label>
                                        <input
                                            accept="image/*"
                                            onChange={(event) => setThumnail(event.target.files[0])}
                                            style={
                                                thumnail
                                                    ? {
                                                        width: "100%",
                                                        backgroundImage: "url(" + preview + ")",
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center",
                                                    }
                                                    : {
                                                        width: "100%",
                                                        backgroundImage:
                                                            "url(" +
                                                            itemSelected.LOGO_URL +
                                                            "?alt=media&token=0)",
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center",
                                                    }






                                            }
                                            type="file"
                                            id="input-file-now"
                                            className="file-upload perfil_img_lingua-none"
                                        />
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Email">
                                            Designação <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            maxLength="256"
                                            defaultValue={itemSelected.DESIG}
                                            type="text"
                                            onChange={(event) => {
                                                setDESIG_C(event.target.value);
                                            }}
                                            className="form-control"
                                            id="Nome "
                                            placeholder="Designação..."
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="text">
                                            NIF <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            maxLength="9"
                                            defaultValue={itemSelected.NIF}
                                            type="number"
                                            onChange={(event) => {
                                                setNIF_C(event.target.value);
                                            }}
                                            className="form-control"
                                            id="alcunga"
                                            placeholder="NIF..."
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col sm={4}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Phone">
                                            Entidade Principal
                                        </label>
                                        <select
                                            defaultValue={itemSelected.SELF_ID}
                                            className="form-control"
                                            onChange={(event) => {
                                                setSELF_ID_C(event.target.value);
                                            }}
                                            id="perfil"
                                        >
                                            <option hidden value="">
                                                --- Selecione ---
                                            </option>

                                            {entidadelist.map((e) =>
                                                e.ID != itemSelected.ID ? (
                                                    <option key={e.ID} value={e.ID}>
                                                        {e.DESIG}
                                                    </option>
                                                ) : null
                                            )}
                                        </select>
                                    </div>
                                </Col>
                                <Col sm={4}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Phone">
                                            Tipo de Entidade<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <select
                                            defaultValue={itemSelected.PR_ENTIDADE_TP_ID}
                                            className="form-control"
                                            onChange={(event) => {
                                                setPR_ENTIDADE_TP_ID_C(event.target.value);
                                            }}
                                            id="perfil"
                                            required
                                            aria-required="true"
                                        >
                                            <option hidden value="">
                                                --- Selecione ---
                                            </option>

                                            {prentidadelist.map((e) => (
                                                <option key={e.ID} value={e.ID}>
                                                    {e.DESIG}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </Col>
                                <Col sm={4}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="date">
                                            Data Início Atividade{" "}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            defaultValue={DT_INICIO_ATIVIDADE_C}
                                            type="date"
                                            onChange={(event) => {
                                                setDT_INICIO_ATIVIDADE_C(event.target.value);
                                            }}
                                            className="form-control"
                                            id="data"
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Phone">
                                            Registo Comercial{" "}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <input
                                            maxLength="25"
                                            defaultValue={itemSelected.REGISTO_COMERCIAL}
                                            type="text"
                                            onChange={(event) => {
                                                setREGISTO_COMERCIAL_C(event.target.value);
                                            }}
                                            className="form-control"
                                            id="pai"
                                            placeholder="Registo Comercial..."
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Phone">
                                            Capital Social
                                        </label>
                                        <input
                                            max="99999999999"
                                            defaultValue={itemSelected.CAPITAL_SOCIAL}
                                            type="number"
                                            onChange={(event) => {
                                                setCAPITAL_SOCIAL_C(event.target.value);
                                            }}
                                            className="form-control"
                                            id="mae"
                                            placeholder="Capital Social..."
                                        />
                                    </div>
                                </Col>

                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="text">
                                            Coordenadas
                                        </label>
                                        <input
                                            maxLength="48"
                                            defaultValue={itemSelected.ENDERECO_COORD}
                                            type="text"
                                            onChange={(event) => {
                                                setENDERECO_COORD_C(event.target.value);
                                            }}
                                            className="form-control"
                                            id="coordenada"
                                            placeholder="Endereco Coord..."
                                        />
                                    </div>
                                </Col>

                                <div className="col-sm-12">
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Address">
                                            Endereço <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <textarea
                                            maxLength="256"
                                            defaultValue={itemSelected.ENDERECO}
                                            className="form-control"
                                            onChange={(event) => {
                                                setENDERECO_C(event.target.value);
                                            }}
                                            id="endereco"
                                            rows="3"
                                            required
                                            placeholder="Endereço..."
                                        />
                                    </div>
                                </div>
                                <Col sm={3}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="text">
                                            Ilha <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <select
                                            defaultValue={ILHA}
                                            className="form-control"
                                            id="perfil"
                                            onChange={(event) => {
                                                putILHA(event.target.value);
                                            }}
                                            required
                                            aria-required="true"
                                        >
                                            <option hidden value="">
                                                --- Selecione ---
                                            </option>

                                            {glbgeografialist.map((e) =>
                                                e.NIVEL_DETALHE == "2" ? (
                                                    <option key={e.ID} value={e.ID}>
                                                        {e.ILHA}
                                                    </option>
                                                ) : null
                                            )}
                                        </select>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="text">
                                            Concelho <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <select
                                            defaultValue={CONCELHO}
                                            className="form-control"
                                            id="perfil"
                                            onChange={(event) => {
                                                putCONCELHO(event.target.value);
                                            }}
                                            required
                                            aria-required="true"
                                        >
                                            <option hidden value="">
                                                --- Selecione ---
                                            </option>

                                            {glbgeografialist.map((e) =>
                                                e.NIVEL_DETALHE == "3" && e.GLB_GEOG_ID == ILHA ? (
                                                    <option key={e.ID} value={e.ID}>
                                                        {e.CONCELHO}
                                                    </option>
                                                ) : null
                                            )}
                                        </select>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="text">
                                            Freguêsia <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <select
                                            defaultValue={FREGUESIA}
                                            className="form-control"
                                            id="perfil"
                                            onChange={(event) => {
                                                putFREGUESIA(event.target.value);
                                            }}
                                            required
                                            aria-required="true"
                                        >
                                            <option hidden value="">
                                                --- Selecione ---
                                            </option>

                                            {glbgeografialist.map((e) =>
                                                e.NIVEL_DETALHE == "4" &&
                                                    e.GLB_GEOG_ID == CONCELHO ? (
                                                    <option key={e.ID} value={e.ID}>
                                                        {e.FREGUESIA}
                                                    </option>
                                                ) : null
                                            )}
                                        </select>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="text">
                                            Localidade<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <select
                                            defaultValue={itemSelected.GEOGRAFIA_ID}
                                            onChange={(event) => {
                                                setGEOGRAFIA_ID_C(event.target.value);
                                            }}
                                            className="form-control"
                                            id="perfil"
                                            required
                                            aria-required="true"
                                        >
                                            <option hidden value="">
                                                --- Selecione ---
                                            </option>

                                            {glbgeografialist.map((e) =>
                                                e.NIVEL_DETALHE == "5" &&
                                                    e.GLB_GEOG_ID == FREGUESIA ? (
                                                    <option key={e.ID} value={e.ID}>
                                                        {e.NOME}
                                                    </option>
                                                ) : null
                                            )}
                                        </select>
                                    </div>
                                </Col>
                                <div className="col-sm-12">
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Address">
                                            Obs
                                        </label>
                                        <textarea
                                            maxLength="64000"
                                            defaultValue={itemSelected.OBS}
                                            className="form-control"
                                            onChange={(event) => {
                                                setOBS_C(event.target.value);
                                            }}
                                            id="Address"
                                            rows="3"
                                            placeholder="Obs..."
                                        />
                                    </div>
                                </div>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setIsEditarOpen(false)}>
                            Fechar
                        </Button>

                        {!isLoading ? <Button type="submit" form="editarItem" variant="primary">Guardar</Button> : <Button variant="primary">Guardando</Button>}
                    </Modal.Footer>
                </Modal>

            </Row>
        </React.Fragment >
    </>
    );












};
export default DetalhesEntidade;