import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, ListGroup } from 'react-bootstrap';


import { Link } from 'react-router-dom';

import api from '../../../services/api';


import useAuth from '../../../hooks/useAuth';





const CriarPessoa = ({ generolist, estadocivillist, glbgeografialist, documentolist, contactolist, uploadpessoa, pessoaopenDO }) => {


    const { popUp_alertaOK } = useAuth();



    const [pessoaopen, setpessoaopen] = useState(false);




    const [ID_C_PESSOA, setID_C_PESSOA] = useState("");
    const [CODIGO_C_PESSOA, setCODIGO_C_PESSOA] = useState("");
    const [NACIONALIDADE_ID_C_PESSOA, setNACIONALIDADE_ID_C_PESSOA] = useState("");
    const [LOCALIDADE_ID_C_PESSOA, setLOCALIDADE_ID_C_PESSOA] = useState("");
    const [PR_ESTADO_CIVIL_ID_C_PESSOA, setPR_ESTADO_CIVIL_ID_C_PESSOA] = useState("");
    const [PR_GENERO_ID_C_PESSOA, setPR_GENERO_ID_C_PESSOA] = useState("");
    const [NOME_C_PESSOA, setNOME_C_PESSOA] = useState("");
    const [DT_NASC_C_PESSOA, setDT_NASC_C_PESSOA] = useState("");
    const [ALCUNHA_C_PESSOA, setALCUNHA_C_PESSOA] = useState("");
    const [NOME_PAI_C_PESSOA, setNOME_PAI_C_PESSOA] = useState("");
    const [NOME_MAE_PESSOA, setNOME_MAE_PESSOA] = useState("");
    const [OBS_C_PESSOA, setOBS_C_PESSOA] = useState("");
    const [ENDERECO_C_PESSOA, setENDERECO_C_PESSOA] = useState("");
    const [ENDERECO_COORD_C_PESSOA, setENDERECO_COORD_C_PESSOA] = useState("");

    const [NIF_C_PESSOA, setNIF_C_PESSOA] = useState("");

    const [SEM_NIF, setSEM_NIF] = useState(false);
    const [TEM_CNI, setTEM_CNI] = useState(false);

    const [ILHA, setILHA] = useState("");
    const [CONCELHO, setCONCELHO] = useState("");
    const [FREGUESIA, setFREGUESIA] = useState("");

    //-------------- CRIAR -------------------------




    useEffect(() => {


        openModel()
        setpessoaopen(pessoaopenDO.value)


    }, [pessoaopenDO])







    function openModel() {

        setCODIGO_C_PESSOA("")
        setNACIONALIDADE_ID_C_PESSOA("")
        setLOCALIDADE_ID_C_PESSOA("")
        setPR_ESTADO_CIVIL_ID_C_PESSOA("")
        setPR_GENERO_ID_C_PESSOA("")
        setNOME_C_PESSOA("")
        setDT_NASC_C_PESSOA("")
        setALCUNHA_C_PESSOA("")
        setNOME_PAI_C_PESSOA("")
        setNOME_MAE_PESSOA("")
        setOBS_C_PESSOA("")
        setENDERECO_C_PESSOA("")
        setENDERECO_COORD_C_PESSOA("")

        setNIF_C_PESSOA("")

        setILHA("");
        setCONCELHO("");
        setFREGUESIA("");



        setpessoaopen(true);


        setActiveProfileTab_PESSOA('geral')


        setnovoscontactos_PESSOA([{
            id: "" + Math.random(),
            tipocontacto: "",
            contacto: "",
        }])



        setnovosdocumentos_PESSOA([{
            id: "" + Math.random(),
            tipodocumento: "",
            numero: "",
            dataemissao: "",
            datavalidade: "",
            anexo: { type: 0, file: null },
        }])



    }




    function putILHA(id) {

        setILHA(id)
        setCONCELHO("")
        setFREGUESIA("")
        setLOCALIDADE_ID_C_PESSOA("")


    }

    function putCONCELHO(id) {

        setCONCELHO(id)
        setFREGUESIA("")
        setLOCALIDADE_ID_C_PESSOA("")

    }

    function putFREGUESIA(id) {

        setFREGUESIA(id)
        setLOCALIDADE_ID_C_PESSOA("")


    }




    async function criar_PESSOA(event) {

        event.preventDefault();

        console.log(NACIONALIDADE_ID_C_PESSOA)

        const upload = {
            NACIONALIDADE_ID: NACIONALIDADE_ID_C_PESSOA,
            LOCALIDADE_ID: LOCALIDADE_ID_C_PESSOA,
            PR_ESTADO_CIVIL_ID: PR_ESTADO_CIVIL_ID_C_PESSOA,
            PR_GENERO_ID: PR_GENERO_ID_C_PESSOA,
            NOME: NOME_C_PESSOA,
            DT_NASC: DT_NASC_C_PESSOA,
            ALCUNHA: ALCUNHA_C_PESSOA,
            NOME_PAI: NOME_PAI_C_PESSOA,
            NOME_MAE: NOME_MAE_PESSOA,
            OBS: OBS_C_PESSOA,
            ENDERECO: ENDERECO_C_PESSOA,
            ENDERECO_COORD: ENDERECO_COORD_C_PESSOA,
            NIF: SEM_NIF ? "" : NIF_C_PESSOA,
        }

        console.log(upload)


        try {

            const response = await api.post('/sgigjpessoa', upload);

            if (response.status == '200') {


                for (let i = 0; i < novoscontactos_PESSOA.length; i++) {

                    if (novoscontactos_PESSOA[i].tipocontacto != "" && novoscontactos_PESSOA[i].contacto != "") {

                        console.log(novoscontactos_PESSOA)

                        const upload2 = {

                            PESSOA_ID: response.data.ID,
                            PR_CONTACTO_TP_ID: novoscontactos_PESSOA[i].tipocontacto,
                            CONTACTO: novoscontactos_PESSOA[i].contacto,



                        }

                        try {

                            const response2 = await api.post('/sgigjrelcontacto', upload2);


                        } catch (err) {

                            console.error(err.response)

                        }

                    }


                }




                for (let i = 0; i < novosdocumentos_PESSOA.length; i++) {

                    if (novosdocumentos_PESSOA[i].tipodocumento != "" && novosdocumentos_PESSOA[i].numero != "") {

                        console.log(novosdocumentos_PESSOA)

                        var anexofile = ""



                        if (novosdocumentos_PESSOA[i].anexo.type == "2") {

                            const img = await onFormSubmitImage(novosdocumentos_PESSOA[i].anexo.file)

                            anexofile = img.file.data

                        }

                        console.log(anexofile)

                        const upload2 = {

                            PESSOA_ID: response.data.ID,
                            PR_DOCUMENTO_TP_ID: novosdocumentos_PESSOA[i].tipodocumento,
                            NUMERO: novosdocumentos_PESSOA[i].numero,
                            DOC_URL: anexofile,
                            DT_EMISSAO: novosdocumentos_PESSOA[i].dataemissao,
                            DT_VALIDADE: novosdocumentos_PESSOA[i].datavalidade,



                        }

                        try {

                            const response2 = await api.post('/sgigjreldocumento', upload2);


                        } catch (err) {

                            console.error(err.response)

                        }

                    }


                }


                uploadpessoa()
                setpessoaopen(false);


            }

        } catch (err) {

            try {

                console.error(err)
                console.error(err.response)
                if (err.response.data.code == "3058") popUp_alertaOK("Esse NIF já existe")

            } catch (x) {

                console.error(x)

            }



        }

    }


    //----------------------------------------------










    const [activeProfileTab_PESSOA, setActiveProfileTab_PESSOA] = useState('geral');

    const profileTabClass_PESSOA = 'nav-link text-reset';
    const profileTabActiveClass_PESSOA = 'nav-link text-reset active';



    var [novoscontactos_PESSOA, setnovoscontactos_PESSOA] = useState([{
        id: "" + Math.random(),
        tipocontacto: "",
        contacto: "",
    }]);



    function addnovoscontactos_PESSOA() {

        setnovoscontactos_PESSOA(novoscontactos_PESSOA.concat([{
            id: "" + Math.random(),
            tipocontacto: "",
            contacto: "",
        }]))

    }


    function removenovoscontactos_PESSOA(id) {

        if (novoscontactos_PESSOA.length > 1) {


            const indexx = novoscontactos_PESSOA.findIndex(x => x.id === id);
            //console.log(indexx)
            if (indexx > -1) {

                var newArr = novoscontactos_PESSOA
                newArr.splice(indexx, 1)
                setnovoscontactos_PESSOA(newArr.concat([]))

                setcontacedit_PESSOA(true)



            }



        }

    }




    const [contacedit_PESSOA, setcontacedit_PESSOA] = useState(false);

    function criartipocontacto_PESSOA(tipoc, id) {

        const indexx = novoscontactos_PESSOA.findIndex(x => x.id === id);

        novoscontactos_PESSOA[indexx] = {
            id: id,
            tipocontacto: tipoc,
            contacto: novoscontactos_PESSOA[indexx].contacto
        }

        setcontacedit_PESSOA(true)

        setnovoscontactos_PESSOA(novoscontactos_PESSOA.concat([]))


    }




    function criacontacto_PESSOA(conc, id) {

        const indexx = novoscontactos_PESSOA.findIndex(x => x.id === id);

        novoscontactos_PESSOA[indexx] = {
            id: id,
            contacto: conc,
            tipocontacto: novoscontactos_PESSOA[indexx].tipocontacto
        }

        setcontacedit_PESSOA(true)

        setnovoscontactos_PESSOA(novoscontactos_PESSOA.concat([]))


    }



    //-------------------- documento 



    var [novosdocumentos_PESSOA, setnovosdocumentos_PESSOA] = useState([{
        id: "" + Math.random(),
        tipodocumento: "",
        numero: "",
        dataemissao: "",
        datavalidade: "",
        anexo: { type: 0, file: null },
    }]);

    function addnovosdocumentos_PESSOA() {

        setnovosdocumentos_PESSOA(novosdocumentos_PESSOA.concat([{
            id: "" + Math.random(),
            tipodocumento: "",
            numero: "",
            dataemissao: "",
            datavalidade: "",
            anexo: { type: 0, file: null },
        }]))

    }


    function removenovosdocumentos_PESSOA(id) {

        if (novosdocumentos_PESSOA.length > 1) {


            const indexx = novosdocumentos_PESSOA.findIndex(x => x.id === id);
            //console.log(indexx)
            if (indexx > -1) {

                var newArr = novosdocumentos_PESSOA
                newArr.splice(indexx, 1)
                setnovosdocumentos_PESSOA(newArr.concat([]))

                setdocedit_PESSOA(true)

            }



        }

    }

    const [docedit_PESSOA, setdocedit_PESSOA] = useState(false);



    function criartipodoc_PESSOA(tipodoc, id) {
        let tipo = documentolist.find(res => res.ID === tipodoc)
        if (tipo.DESIG.toLowerCase() === "cni") {
            setTEM_CNI(true)
        } else {
            setTEM_CNI(false)

        }
        const indexx = novosdocumentos_PESSOA.findIndex(x => x.id === id);

        novosdocumentos_PESSOA[indexx] = {

            id: id,

            tipodocumento: tipodoc,

            numero: novosdocumentos_PESSOA[indexx].numero,
            dataemissao: novosdocumentos_PESSOA[indexx].dataemissao,
            datavalidade: novosdocumentos_PESSOA[indexx].datavalidade,
            anexo: novosdocumentos_PESSOA[indexx].anexo,
        }

        setdocedit_PESSOA(true)

        setnovosdocumentos_PESSOA(novosdocumentos_PESSOA.concat([]))


    }



    function criardocnum_PESSOA(docnum, id) {

        const indexx = novosdocumentos_PESSOA.findIndex(x => x.id === id);

        novosdocumentos_PESSOA[indexx] = {

            id: id,

            numero: docnum,

            tipodocumento: novosdocumentos_PESSOA[indexx].tipodocumento,
            dataemissao: novosdocumentos_PESSOA[indexx].dataemissao,
            datavalidade: novosdocumentos_PESSOA[indexx].datavalidade,
            anexo: novosdocumentos_PESSOA[indexx].anexo,
        }

        setdocedit_PESSOA(true)

        setnovosdocumentos_PESSOA(novosdocumentos_PESSOA.concat([]))


    }



    function criardocdataE_PESSOA(docdataE, id) {

        const indexx = novosdocumentos_PESSOA.findIndex(x => x.id === id);

        novosdocumentos_PESSOA[indexx] = {

            id: id,

            dataemissao: docdataE,

            numero: novosdocumentos_PESSOA[indexx].numero,
            tipodocumento: novosdocumentos_PESSOA[indexx].tipodocumento,
            datavalidade: novosdocumentos_PESSOA[indexx].datavalidade,
            anexo: novosdocumentos_PESSOA[indexx].anexo,
        }

        setdocedit_PESSOA(true)

        setnovosdocumentos_PESSOA(novosdocumentos_PESSOA.concat([]))


    }


    function criardocdataV_PESSOA(docdataV, id) {

        const indexx = novosdocumentos_PESSOA.findIndex(x => x.id === id);

        novosdocumentos_PESSOA[indexx] = {

            id: id,

            datavalidade: docdataV,

            numero: novosdocumentos_PESSOA[indexx].numero,
            tipodocumento: novosdocumentos_PESSOA[indexx].tipodocumento,
            dataemissao: novosdocumentos_PESSOA[indexx].dataemissao,
            anexo: novosdocumentos_PESSOA[indexx].anexo,
        }

        setdocedit_PESSOA(true)

        setnovosdocumentos_PESSOA(novosdocumentos_PESSOA.concat([]))


    }


    function criaranexo(anexo, id) {

        const indexx = novosdocumentos_PESSOA.findIndex(x => x.id === id);

        console.log(novosdocumentos_PESSOA[indexx])
        console.log(id)

        if (novosdocumentos_PESSOA[indexx].tipodocumento == "" || novosdocumentos_PESSOA[indexx].numero == "") {
            popUp_alertaOK("Preencha o campos obrigatórios")
        }

        novosdocumentos_PESSOA[indexx] = {

            id: id,

            tipodocumento: novosdocumentos_PESSOA[indexx].tipodocumento,
            dataemissao: novosdocumentos_PESSOA[indexx].dataemissao,
            datavalidade: novosdocumentos_PESSOA[indexx].datavalidade,
            numero: novosdocumentos_PESSOA[indexx].numero,
            anexo: { type: 2, file: anexo },
        }

        setdocedit_PESSOA(true)

        setnovosdocumentos_PESSOA(novosdocumentos_PESSOA.concat([]))


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




    //------------------------------------



    return (



        <Modal size='lg' show={pessoaopen} onHide={() => setpessoaopen(false)}>
            <Modal.Header style={{ border: "0" }} closeButton>
                <Modal.Title as="h5">Criar Pessoal</Modal.Title>
            </Modal.Header>



            <ul className="nav nav-tabs profile-tabs nav-fill" id="myTab" role="tablist">
                <li className="nav-item">
                    <Link to='#' className={activeProfileTab_PESSOA === 'geral' ? profileTabActiveClass_PESSOA : profileTabClass_PESSOA} onClick={() => { setActiveProfileTab_PESSOA('geral') }} id="profile-tab"><i className="feather icon-user mr-2" />Perfil</Link>
                </li>
                <li className="nav-item">
                    <Link to='#' className={activeProfileTab_PESSOA === 'contactos' ? profileTabActiveClass_PESSOA : profileTabClass_PESSOA} onClick={() => { setActiveProfileTab_PESSOA('contactos') }} id="contact-tab"><i className="feather icon-phone mr-2" />Contactos</Link>
                </li>

                <li className="nav-item">
                    <Link to='#' className={activeProfileTab_PESSOA === 'documentos' ? profileTabActiveClass_PESSOA : profileTabClass_PESSOA} onClick={() => { setActiveProfileTab_PESSOA('documentos') }} id="contact-tab"><i className="feather icon-file-text mr-2" />Documentos</Link>
                </li>
            </ul>


            <Modal.Body style={activeProfileTab_PESSOA === 'documentos' ? {} : { display: "none" }}>

                <Col style={{ display: "flex", justifyContent: "flex-end" }} sm={12}>

                    <Button onClick={() => addnovosdocumentos_PESSOA()} variant="primary">+</Button>

                </Col>


                {novosdocumentos_PESSOA.map(eq => (

                    <Row style={{ marginBottom: "12px" }} key={eq.id}>

                        <Col sm={10}><Row>


                            <Col sm={6}>
                                <div className="form-group fill">
                                    <label className="floating-label" htmlFor="Phone">Tipo de Documentos <span style={{ color: "red" }} >*</span></label>
                                    <select onChange={event => { criartipodoc_PESSOA(event.target.value, eq.id) }} className="form-control" id="perfil" required aria-required="true">
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
                                    <input onChange={event => { criardocnum_PESSOA(event.target.value, eq.id) }} type="text" className="form-control" />
                                </div>
                            </Col>



                            <div className='sm-2 paddinhtop28OnlyPC' >
                                <label htmlFor={"anexarcriar" + eq.id} className="btn" style={{ backgroundColor: "#d2b32a", color: "#fff" }}>{eq?.anexo?.file == null ? <><i className="feather icon-download" /><>{" Anexar"}</></> : "Anexado"} </label>
                                <input id={"anexarcriar" + eq.id} onChange={event => criaranexo(event.target.files[0], eq.id)} accept="image/x-png,image/jpeg" style={{ display: "none" }} type="file" />
                            </div>
                            {
                                !TEM_CNI ?
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="date">Data de Emissão</label>
                                            <input onChange={event => { criardocdataE_PESSOA(event.target.value, eq.id) }} type="date" className="form-control" />
                                        </div>

                                    </Col> : null
                            }

                            <Col sm={6}>
                                <div className="form-group fill">
                                    <label className="floating-label" htmlFor="text">Data de Validade</label>
                                    <input onChange={event => { criardocdataV_PESSOA(event.target.value, eq.id) }} type="date" className="form-control" />
                                </div>
                            </Col>

                        </Row></Col>


                        {novosdocumentos_PESSOA.length > 1 ?
                            <div className='paddinhtop66OnlyPC sm-2' >
                                <Button onClick={() => removenovosdocumentos_PESSOA(eq.id)} variant="danger"><i className="feather icon-trash-2" /></Button>
                            </div>
                            : null}


                    </Row>
                ))}



            </Modal.Body>



            <Modal.Body style={activeProfileTab_PESSOA === 'contactos' ? {} : { display: "none" }}>

                <Col style={{ display: "flex", justifyContent: "flex-end" }} sm={12}>

                    <Button onClick={() => addnovoscontactos_PESSOA()} variant="primary">+</Button>

                </Col>


                {novoscontactos_PESSOA.map(eq => (

                    <Row style={{ marginBottom: "12px" }} key={eq.id}>


                        <Col sm={5}>
                            <div className="form-group fill">
                                <label className="floating-label" htmlFor="Phone">Tipo de Contacto <span style={{ color: "red" }} >*</span></label>
                                <select onChange={event => { criartipocontacto_PESSOA(event.target.value, eq.id) }} className="form-control" id="perfil" required aria-required="true">
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
                                <input maxLength="128" onChange={event => { criacontacto_PESSOA(event.target.value, eq.id) }} type="text" className="form-control" />
                            </div>
                        </Col>

                        {novoscontactos_PESSOA.length > 1 ?
                            <div className='sm-2 paddinhtop28OnlyPC' >
                                <Button onClick={() => removenovoscontactos_PESSOA(eq.id)} variant="danger"><i className="feather icon-trash-2" /></Button>
                            </div>
                            : null}


                    </Row>
                ))}




            </Modal.Body>



            <Modal.Body style={activeProfileTab_PESSOA === 'geral' ? {} : { display: "none" }}>
                {/* --------------------Criar Pessoa-------------------- */}

                <form id="criarpessoa" onSubmit={criar_PESSOA} >
                    <Row>
                        <Col sm={3}>
                            <div className="form-group fill">
                                <label className="floating-label" htmlFor="text">Código <span style={{ color: "red" }} >*</span></label>
                                <input disabled value="0003" type="text" className="form-control" id="Name" />
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="form-group fill">
                                <label className="floating-label" htmlFor="Email">Nome <span style={{ color: "red" }} >*</span></label>
                                <input maxLength="256" type="text" onChange={event => { setNOME_C_PESSOA(event.target.value) }} className="form-control" id="Nome " placeholder="Nome" required />
                            </div>
                        </Col>
                        <Col sm={3}>
                            <div className="form-group fill">
                                <label className="floating-label" htmlFor="text">Alcunha</label>
                                <input type="text" maxLength="75" onChange={event => { setALCUNHA_C_PESSOA(event.target.value) }} className="form-control" id="alcunga" placeholder="Alcunha..." />
                            </div>
                        </Col>
                        <Col sm={4}>
                            <div className="form-group fill">
                                <label className="floating-label" htmlFor="Phone">Gênero <span style={{ color: "red" }} >*</span></label>
                                <select className="form-control" onChange={event => { setPR_GENERO_ID_C_PESSOA(event.target.value) }} id="perfil" required aria-required="true">
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
                                <select className="form-control" onChange={event => { setPR_ESTADO_CIVIL_ID_C_PESSOA(event.target.value) }} id="perfil" required aria-required="true">
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
                                <input type="date" onChange={event => { setDT_NASC_C_PESSOA(event.target.value) }} className="form-control" id="data" required />
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="form-group fill">
                                <label className="floating-label" htmlFor="text">Nome Pai</label>
                                <input type="text" maxLength="128" onChange={event => { setNOME_PAI_C_PESSOA(event.target.value) }} className="form-control" id="pai" placeholder="Nome Pai..." />
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="form-group fill">
                                <label className="floating-label" htmlFor="text">Nome Mãe</label>
                                <input type="text" maxLength="128" onChange={event => { setNOME_MAE_PESSOA(event.target.value) }} className="form-control" id="mae" placeholder="Nome Mae..." />
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="form-group fill">
                                <label className="floating-label" htmlFor="text">Nacionalidade <span style={{ color: "red" }} >*</span></label>
                                <select onChange={event => { setNACIONALIDADE_ID_C_PESSOA(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

                                    <option hidden value="">--- Selecione ---</option>

                                    {glbgeografialist.map(e => (

                                        e.NIVEL_DETALHE == "-1" ?

                                            <option key={e.ID} value={e.ID}>{e.NACIONALIDADE}</option>

                                            : null

                                    ))}

                                </select>
                            </div>
                        </Col><Col sm={6}>
                            <div className="form-group fill">
                                <label className="floating-label" htmlFor="text">Coordenadas</label>
                                <input type="text" maxLength="50" onChange={event => { setENDERECO_COORD_C_PESSOA(event.target.value) }} className="form-control" id="coordenada" placeholder="Endereco Coord..." />
                            </div>
                        </Col>
                        <div className="col-sm-6">
                            <div className="form-group fill">
                                <label className="floating-label" htmlFor="Address">Endereço</label>
                                <textarea className="form-control" maxLength="64000" onChange={event => { setENDERECO_C_PESSOA(event.target.value) }} id="endereco" rows="3" placeholder='Endereço...' />
                            </div>
                        </div>



                        <Col sm={6}>

                            <div className="form-group fill">
                                <label className="floating-label" htmlFor="text">NIF <span style={{ color: "red" }} >*</span></label>

                                {SEM_NIF ?
                                    <input readOnly="readOnly" type="text" maxLength="9" onChange={event => { setNIF_C_PESSOA(event.target.value) }} className="form-control" id="nif" placeholder="NIF..." />

                                    :
                                    <input type="text" maxLength="9" required onChange={event => { setNIF_C_PESSOA(event.target.value) }} className="form-control" id="nif" placeholder="NIF..." />
                                }
                                <div className=" fill mt-2 input-box">
                                    <input type="checkbox" name="" id="" onChange={e => setSEM_NIF(e.target.checked)} />
                                    <label className="floating-label ml-3" htmlFor="Name">Sem NIF </label>
                                </div>
                            </div>

                        </Col>
                        {/* <Col sm={1}>
                            <div className='d-flex flex-column '>

                                <div className=" fill input-box">
                                    <input type="checkbox" name="" id="" onChange={e => setSEM_NIF(e.target.checked)} />
                                    <label className="floating-label ml-3" htmlFor="Name">Sem NIF </label>
                                </div>

                            </div>

                        </Col> */}

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
                                <select onChange={event => { setLOCALIDADE_ID_C_PESSOA(event.target.value) }} className="form-control" id="perfil" required aria-required="true">

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
                                <textarea className="form-control" maxLength="64000" onChange={event => { setOBS_C_PESSOA(event.target.value) }} id="Address" rows="3" placeholder='Obs...' />
                            </div>
                        </div>

                    </Row>
                </form>
            </Modal.Body>





            <Modal.Footer>
                <Button variant="danger" onClick={() => setpessoaopen(false)}>Fechar</Button>
                <Button type="submit" form="criarpessoa" variant="primary">Guardar</Button>
            </Modal.Footer>
        </Modal>







    );












};
export default CriarPessoa;