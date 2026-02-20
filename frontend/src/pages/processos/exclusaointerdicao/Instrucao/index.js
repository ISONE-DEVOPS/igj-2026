import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';

import { Link } from 'react-router-dom';




import { createDateToUser, createDateToInput } from '../../../../functions';


import api from '../../../../services/api';



import Interrompido from './Interrompido';

import Notacomunicacao from './Notacomunicacao';
// import Autodeclaracao from './Autodeclaracao';
// import Prova from './Prova';
// import Reclamacaovisado from './Reclamacaovisado';
// import Relatoriofinal from './Relatoriofinal';
import Table from './Table';
import useAuth from '../../../../hooks/useAuth';

import Listfiles from '../../../../components/Custom/Listfiles'
import PecasForm from './pecasprocesuaisform';


const Item = ({ item, setinstrucaoitem, uploadlist, instrucaoitem, decisaolist }) => {

    
    const { popUp_removerItem, popUp_alertaOK } = useAuth();



    const [InterrompidoTipo, setInterrompidoTipo] = useState("");


    const [pecaslist, setpecaslist] = useState([]);

    const [PECAselected, setPECAselected] = useState("");
    const [pecaSelected, setPecaSelected] = useState({});





    const [pessoalist, setpessoalist] = useState([]);

    async function uploadpessoa() {

        try {

            const response = await api.get('/sgigjpessoa');

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    response.data[i].value = response.data[i].ID
                    response.data[i].label = response.data[i].NOME

                }

                setpessoalist(response.data)

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





    async function uploadpecaslist() {

        try {

            const response = await api.get('/sgigjprpecasprocessual');

            if (response.status == '200') {


                setpecaslist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    //------------------------------


    const [instrucaopecaslist, setinstrucaopecaslist] = useState([]);

    const [REL_PROCESSO_INSTRUCAO_ID, setREL_PROCESSO_INSTRUCAO_ID] = useState("");
    const [REL_PROCESSO_INSTRUTOR_ID, setREL_PROCESSO_INSTRUTOR_ID] = useState("");

    async function uploadinstrucaopecaslist() {

        let newlist = {
            done: false,
            list: []
        }

        if (iscreated()) {

            const tempo_instrucao = item.sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao[0].ID

            setREL_PROCESSO_INSTRUCAO_ID(tempo_instrucao)
            setREL_PROCESSO_INSTRUTOR_ID(item.sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0].ID)


            try {

                const response = await api.get('/sgigjrelinstrutorpeca?REL_PROCESSO_INSTRUCAO_ID=' + tempo_instrucao);

                if (response.status == '200') {


                    for (var i = 0; i < response.data.length; i++) {



                        const idx = response.data[i].ID
                        const itemx = response.data[i]



                        response.data[i].id = response.data[i].ID
                        response.data[i].DATA2 = createDateToUser(response.data[i].DATA)
                        response.data[i].PECAS = response.data[i].sgigjprpecasprocessual.DESIG

                        if (response.data[i].FLAG_NOTA_COMUNICACAO == null) response.data[i].QUEM = "------------------"
                        else {
                            if (response.data[i].FLAG_NOTA_COMUNICACAO == "1") response.data[i].QUEM = "Visado"
                            if (response.data[i].FLAG_NOTA_COMUNICACAO == "2") response.data[i].QUEM = "Entidade Decisora"
                            if (response.data[i].FLAG_NOTA_COMUNICACAO == "3") response.data[i].QUEM = "Entidade Visada"
                        }

                       
                            if(!itemx.sgigjreldocumento && response.data[i]?.URL_DOC){
                                itemx.sgigjreldocumento = []
                            }

                            itemx.sgigjreldocumento.push({
                                "DOC_URL":response.data[i]?.URL_DOC,
                                "sgigjprdocumentotp":{
                                    "DESIG":"Documento Gerado"
                                }
                            })
                            // console.log("sgigjreldocumento",itemx,[{
                            //     "DOC_URL":response.data[i]?.URL_DOC
                            // }])
                            if (response.data[i]?.sgigjreldocumento.length > 0){}
                                response.data[i].ANEXOS = <React.Fragment><Link to='#' onClick={() => openAnexos(itemx)} ><i className={"feather icon-file"} /></Link></React.Fragment>
                      

                        response.data[i].action =
                            <React.Fragment>

                                <Link to='#' onClick={() => openEditHandler(itemx)} className="text-primary mx-1"><i className={"text-primary feather icon-edit"} /></Link>

                                <Link to='#' onClick={() => removeItem(idx)} className="text-danger"><i className={"feather icon-trash-2"} /></Link>

                            </React.Fragment>


                    }


                    newlist = {
                        done: true,
                        list: response.data
                    }

                    setinstrucaopecaslist(response.data)

                }

            } catch (err) {

                console.error(err.response)


            }

        }

        return newlist



    }



    const [PESSOA_TESTEMUNHA_ID, setPESSOA_TESTEMUNHA_ID] = useState("");
    const [CODIGO, setCODIGO] = useState("*");
    const [DATA, setDATA] = useState("");
    const [OBS, setOBS] = useState("");

    const [isVerAnexosOpen, setisVerAnexosOpen] = useState(false);
    const [listaAnexos, setlistaAnexos] = useState([]);

    function openAnexos(item) {

        setisVerAnexosOpen(true)
        console.log("sgigjreldocumento",item?.sgigjreldocumento)
        setlistaAnexos(item?.sgigjreldocumento)
    }




    async function criarInstrucao() {




        const upload = {

            PROCESSO_DESPACHO_ID: item.sgigjprocessodespacho[0].ID,

        }



        try {

            const response = await api.post(`/sgigjrelprocessoinstrucao`, upload);

            if (response.status == '200') {



                const response = await api.get('/sgigjprocessoexclusao/' + item.id);


                if (response.status == '200') {

                    if (response.data.length > 0) {

                        response.data[0].id = response.data[0].ID


                        setinstrucaoitem(response.data[0])



                    }



                }





            }

        } catch (err) {

            console.error(err.response)

        }

    }


    function iscreated() {

        if (item != null) {

            if (item.sgigjprocessodespacho.length > 0) {
                if (item.sgigjprocessodespacho[0].sgigjrelprocessoinstrutor.length > 0) {
                    if (item.sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao.length > 0) {
                        return true
                    }
                    else return false
                } else return false
            } else return false

        }


    }


    async function voltar() {

        uploadlist()
        setinstrucaoitem(null)


    }


    const [selected_relinstrucaopeca, setselected_relinstrucaopeca] = useState("");

    function openEditHandler(itemx) {

        setselected_relinstrucaopeca(itemx)


    }


    useEffect(() => {


        if (selected_relinstrucaopeca != null) {

            setPECAselected(selected_relinstrucaopeca.PR_PECAS_PROCESSUAIS_ID)
            setPESSOA_TESTEMUNHA_ID(selected_relinstrucaopeca.PESSOA_TESTEMUNHA_ID);
            setCODIGO(selected_relinstrucaopeca.REF);
            setDATA(createDateToInput(selected_relinstrucaopeca.DATA))
            setOBS(selected_relinstrucaopeca.OBS);

        }


    }, [selected_relinstrucaopeca])


    
    useEffect(() => {

        if (PECAselected != null) {
            setPecaSelected(pecaslist.find(p=> p.ID == PECAselected))

        }


    }, [PECAselected])


    function selectnewrelisntrucaopeca(id) {

        setselected_relinstrucaopeca(null)
        setPECAselected(id)

        setPESSOA_TESTEMUNHA_ID("");
        setCODIGO("*");
        setDATA("");
        setOBS("");

    }



    useEffect(() => {

        uploadpecaslist()
        uploadpessoa()
        uploaddocumentolist()
        uploadinstrucaopecaslist()


    }, [])


    function canAllowThisPecaFirst(id) {

        if (
            instrucaopecaslist.findIndex(x => x.PR_PECAS_PROCESSUAIS_ID === id) >= 0
            && id == "6b4729e2b01da73d490dc1b04671ea570d49"
        ) return false


        if (
            instrucaopecaslist.findIndex(x => x.PR_PECAS_PROCESSUAIS_ID === id) >= 0
            && id == "0a2557ff1b8e966ae041183b8bbcb4d2ce1d"
        ) return false

        let cont = 0

        if (id == "4ce0c01543457df12a96bc3eac9492e81657") {

            for (let index = 0; index < instrucaopecaslist.length; index++) {

                if (instrucaopecaslist[index].FLAG_NOTA_COMUNICACAO != null) cont++

            }

            if (cont >= 3) return false


        }


        return true



    }

    function canAllowThisPeca(id) {

        if (PECAselected == id) return true
        else return canAllowThisPecaFirst(id)

    }





    //-------------- Remover -------------------------



    const removeItemFunction = async (idx) => {

        let res = true

        try {

            const response = await api.delete('/sgigjrelinstrutorpeca/' + idx);


        } catch (err) {

            res = false
            console.error(err.response)
            popUp_alertaOK("Falha. Tente mais tarde")

        }

        uploadinstrucaopecaslist()

        return res

    };

    const removeItem = async (idx) => {

        popUp_removerItem({
            delete: removeItemFunction,
            id: idx,
        })


    }



    async function concluir() {



        try {


            const response = await api.put('/sgigjrelprocessoinstrucao/' + item.sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao[0].ID, {
                TIPO: "concluir"
            });


            if (response.status == '200') {



                uploadlist()
                popUp_alertaOK("Instrucão concluída")
                setinstrucaoitem(null)


            }



        } catch (err) {

            console.error(err.response)

            if (err?.response?.data?.code == "567785636745684")
                popUp_alertaOK("Só é possível concluir essa instrução, após inserção de peça Relatorio Final")


        }




    }



    const [mergedPdfUrl, setMergedPdfUrl] = useState();
    const [isjuntadaopen, setisjuntadaopen] = useState(false);




    async function juntada(newid) {


        let instrucao = []



        try {

            // const response = await api.get('/sgigjprocessoexclusao/' + newid);


            // if (response.status == '200') {

            //     if (response.data.length > 0) {

            //         response.data[0].id = response.data[0].ID

            //         if (response.data[0].sgigjprocessodespacho.length > 0) {

            //             if (response.data[0].sgigjprocessodespacho[0].sgigjrelprocessoinstrutor.length > 0) {

            //                 if (response.data[0].sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao.length > 0) {


            //                     instrucao = response.data[0].sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao[0].sgigjrelinstrutorpeca



            //                 }

            //             }

            //         }

            //     }

            // }





            // var list = []


            // if (instrucao.length > 0) {


            //     for (let index3 = 0; index3 < instrucao.length; index3++) {

            //         const element = instrucao[index3];


            //         for (let index2 = 0; index2 < element.sgigjreldocumento.length; index2++) {

            //             const element2 = element.sgigjreldocumento[index2];


            //             list.push(element2.DOC_URL)

            //         }




            //         if (element.URL_DOC != null) {

            //             list.push(element.URL_DOC)


            //         }



            //     }



            // }

            console.log("GO_ER");

            const responsePDF = await api.get('/juntada/'+ newid/*, { list }*/);

            if (responsePDF.status == '200') {



                const array = responsePDF.data.buffer.data

                const arraybuffer = new Uint8Array(array).buffer

                var blob = new Blob([arraybuffer], { type: "application/pdf" });

                const url = URL.createObjectURL(blob);


                //console.log(blob)

                setMergedPdfUrl(url)

                setisjuntadaopen(true)
                uploadinstrucaopecaslist()



            }


        } catch (err) {

            console.error(err)

        }



    }







    return (
        <>
            <Row className='mb-3'>
                <Col className="d-flex align-items-center" style={{ fontSize: "16px" }}>
                    Instrução do Processo
                </Col>

            </Row>


            {iscreated() ?

                <Row>
                    <Col sm={2}>
                        <div className="form-group fill">
                            <label className="floating-label" htmlFor="Name">Referência <span style={{ color: "red" }} >*</span></label>
                            <input disabled type="text" className="form-control" id="Name" value={CODIGO} required />
                        </div>
                    </Col>



                    <Col sm={7}>
                        <div className="form-group fill">
                            <label className="floating-label" htmlFor="Name">Peça Processual <span style={{ color: "red" }} >*</span></label>

                            <select value={PECAselected} onChange={event => { selectnewrelisntrucaopeca(event.target.value) }} className="form-control" id="pessoa" required aria-required="true">

                                <option hidden value="">--- Selecione ---</option>


                                {pecaslist.map(e => (

                                    canAllowThisPeca(e.ID) &&
                                    <option key={e.ID} title={e.CODIGO} value={e.ID}>{e.DESIG}</option>



                                ))
                                }

                            </select>

                        </div>
                    </Col>

                    <Col sm={3}>
                        <div className="form-group fill">
                            <label className="floating-label" htmlFor="Name">Data <span style={{ color: "red" }} >*</span></label>
                            <input type="date" onChange={event => { setDATA(event.target.value) }} value={DATA} className="form-control" placeholder="Data..." required />
                        </div>
                    </Col>


                </Row>

                :

                <div className="form-group fill" style={{ display: "flex", padding: "50px 0px", width: "100%", justifyContent: "center" }} >
                    <Button variant="primary" onClick={() => criarInstrucao()} >Iniciar Instrução</Button>
                </div>


            }

            <PecasForm
                DATA={DATA}
              PESSOA_TESTEMUNHA_ID={PESSOA_TESTEMUNHA_ID} setPESSOA_TESTEMUNHA_ID={setPESSOA_TESTEMUNHA_ID}
              OBS={OBS} setOBS={setOBS}
              item={item}
              uploadinstrucaopecaslist={uploadinstrucaopecaslist}
              PECAselected={PECAselected}
              selected_relinstrucaopeca={selected_relinstrucaopeca} setselected_relinstrucaopeca={setselected_relinstrucaopeca}

              pessoalist={pessoalist}
              documentolist={documentolist}
            peca={pecaSelected} />

            {/* {PECAselected == "4ce0c01543457df12a96bc3eac9492e81657" ? <Notacomunicacao

                PESSOA_TESTEMUNHA_ID={PESSOA_TESTEMUNHA_ID} setPESSOA_TESTEMUNHA_ID={setPESSOA_TESTEMUNHA_ID}
                DATA={DATA} setDATA={setDATA}
                OBS={OBS} setOBS={setOBS}
                item={item}
                setCODIGO={setCODIGO}
                uploadinstrucaopecaslist={uploadinstrucaopecaslist}
                PECAselected={PECAselected}
                selected_relinstrucaopeca={selected_relinstrucaopeca} setselected_relinstrucaopeca={setselected_relinstrucaopeca}
                instrucaopecaslist={instrucaopecaslist}
                instrucaoitem={item}


            /> : null}

            {PECAselected == "7cc509e3bd9b1fb1a472726bcdfe93ea91d6" ? <Autodeclaracao

                PESSOA_TESTEMUNHA_ID={PESSOA_TESTEMUNHA_ID} setPESSOA_TESTEMUNHA_ID={setPESSOA_TESTEMUNHA_ID}
                DATA={DATA} setDATA={setDATA}
                OBS={OBS} setOBS={setOBS}
                item={item}
                uploadinstrucaopecaslist={uploadinstrucaopecaslist}
                PECAselected={PECAselected}
                selected_relinstrucaopeca={selected_relinstrucaopeca} setselected_relinstrucaopeca={setselected_relinstrucaopeca}

                pessoalist={pessoalist}
                documentolist={documentolist}

            /> : null}

            {PECAselected == "5dbc3c3c079e3fad6acbbce343ffabf08fc8" ? <Prova

                PESSOA_TESTEMUNHA_ID={PESSOA_TESTEMUNHA_ID} setPESSOA_TESTEMUNHA_ID={setPESSOA_TESTEMUNHA_ID}
                DATA={DATA} setDATA={setDATA}
                OBS={OBS} setOBS={setOBS}
                item={item}
                uploadinstrucaopecaslist={uploadinstrucaopecaslist}
                PECAselected={PECAselected}
                selected_relinstrucaopeca={selected_relinstrucaopeca} setselected_relinstrucaopeca={setselected_relinstrucaopeca}

                documentolist={documentolist}

            /> : null}

            {PECAselected == "0a2557ff1b8e966ae041183b8bbcb4d2ce1d" ? <Reclamacaovisado

                PESSOA_TESTEMUNHA_ID={PESSOA_TESTEMUNHA_ID} setPESSOA_TESTEMUNHA_ID={setPESSOA_TESTEMUNHA_ID}
                DATA={DATA} setDATA={setDATA}
                OBS={OBS} setOBS={setOBS}
                item={item}
                uploadinstrucaopecaslist={uploadinstrucaopecaslist}
                PECAselected={PECAselected}
                selected_relinstrucaopeca={selected_relinstrucaopeca} setselected_relinstrucaopeca={setselected_relinstrucaopeca}

                documentolist={documentolist}

            /> : null}

            {PECAselected == "6b4729e2b01da73d490dc1b04671ea570d49" ? <Relatoriofinal

                PESSOA_TESTEMUNHA_ID={PESSOA_TESTEMUNHA_ID} setPESSOA_TESTEMUNHA_ID={setPESSOA_TESTEMUNHA_ID}
                DATA={DATA} setDATA={setDATA}
                OBS={OBS} setOBS={setOBS}
                item={item}
                uploadinstrucaopecaslist={uploadinstrucaopecaslist}
                PECAselected={PECAselected}
                selected_relinstrucaopeca={selected_relinstrucaopeca} setselected_relinstrucaopeca={setselected_relinstrucaopeca}

                documentolist={documentolist}
                decisaolist={decisaolist}

            /> : null} */}




            <br />

            {iscreated(item) &&

                <Table data={instrucaopecaslist} />


            }




            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", gridGap: "10px" }}>

                {iscreated(item) &&

                    <>
                        <Button onClick={() => juntada( item.sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao[0].ID	)} variant="primary" >Juntada</Button>

                        <Button variant="primary" onClick={() => setInterrompidoTipo("A")} >Arquivar</Button>
                        <Button variant="primary" onClick={() => setInterrompidoTipo("P")} >Prescrever</Button>

                        <Button variant="primary" onClick={() => concluir()} >Concluir Instrução do Processo</Button>

                    </>
                }

                <Button variant="danger" onClick={() => voltar()}>Voltar</Button>


            </div>


            <Listfiles Open={isVerAnexosOpen} setOpen={setisVerAnexosOpen} list={listaAnexos} />

            <Modal size='xl' show={isjuntadaopen} onHide={() => setisjuntadaopen(false)}>

                <iframe
                    height={1000}
                    src={`${mergedPdfUrl}`}
                    title='pdf-viewer'
                    width='100%s'
                ></iframe>


            </Modal>

            <Interrompido voltar={voltar} INSTRUCAO_ID={item?.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0]?.ID} InterrompidoTipo={InterrompidoTipo} setInterrompidoTipo={setInterrompidoTipo} uploadlist={uploadlist} />

        </>
    )
}




export default Item;