import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

import JoditEditor from "jodit-react";

import { visado, entidadedecisora, entidadevisada } from './textogerador';

import useAuth from '../../../../../hooks/useAuth';

import api from '../../../../../services/api';

const Item = ({

    DATA,
    setCODIGO,
    OBS, setOBS,
    PESSOA_TESTEMUNHA_ID, setPESSOA_TESTEMUNHA_ID,
    uploadinstrucaopecaslist, item,
    PECAselected,
    selected_relinstrucaopeca, setselected_relinstrucaopeca,
    instrucaopecaslist,
    instrucaoitem

}) => {


    const [QUEM, setQUEM] = useState("");


    const { user, popUp_alertaOK } = useAuth();


    const [editorcontent, seteditorcontent] = useState("");

    let parecerEdit = ""


    const editorREF = useRef(null)

    const setRef = jodit => {
        // control
    };

    const updateContent = (value) => {
        //seteditorcontent(value);
        parecerEdit = value

        console.log(parecerEdit)

    };



    useEffect(() => {

        parecerEdit = OBS
        seteditorcontent(parecerEdit)

        console.log(selected_relinstrucaopeca)



    }, [OBS])


    useEffect(() => {


        if (selected_relinstrucaopeca != null) {


            if (selected_relinstrucaopeca?.FLAG_NOTA_COMUNICACAO != null) {

                setQUEM(selected_relinstrucaopeca?.FLAG_NOTA_COMUNICACAO)

            } else setQUEM("")

        } else setQUEM("")


    }, [selected_relinstrucaopeca])




    useEffect(() => {



        if (QUEM == "1") {

            parecerEdit = visado(user?.sgigjrelpessoaentidade?.sgigjpessoa?.NOME, DATA, instrucaoitem)

            seteditorcontent(parecerEdit)

        }


        if (QUEM == "2") {

            parecerEdit = entidadedecisora(user?.sgigjrelpessoaentidade?.sgigjpessoa?.NOME, DATA, instrucaoitem)

            seteditorcontent(parecerEdit)

        }


        if (QUEM == "3") {

            parecerEdit = entidadevisada(user?.sgigjrelpessoaentidade?.sgigjpessoa?.NOME, DATA, instrucaoitem)

            seteditorcontent(parecerEdit)

        }



    }, [QUEM])




    async function criarItemGO(event) {

        event.preventDefault();

        if (DATA == "") popUp_alertaOK("Escolha uma data")

        else {

            try {

                const upload = {

                    REL_PROCESSO_INSTRUCAO_ID: item?.sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao[0].ID,
                    PR_PECAS_PROCESSUAIS_ID: PECAselected,
                    DATA,
                    FLAG_NOTA_COMUNICACAO: QUEM,
                    OBS: editorREF?.current?.value,


                }

                console.log(upload)


                if (selected_relinstrucaopeca == null) {



                    const response = await api.post('/sgigjrelinstrutorpeca', upload);

                    if (response.status == '200') {


                        toast.success('Documento Guardado!', { duration: 4000 })

                        const newlist = await uploadinstrucaopecaslist()

                        if (newlist.done == true) {


                            for (let index = 0; index < newlist.list.length; index++) {

                                const element = newlist.list[index];

                                if (element.ID == response.data.ID) {

                                    setselected_relinstrucaopeca(element)

                                }

                            }

                        }

                    }



                } else {


                    const response = await api.put('/sgigjrelinstrutorpeca/' + selected_relinstrucaopeca.ID, upload);

                    if (response.status == '200') {

                        uploadinstrucaopecaslist()

                    }


                }







            } catch (err) {

                console.error(err.response)

            }


        }

    }


    function canAllowThisPecaFirst(id) {

        if (instrucaopecaslist.findIndex(x => x.FLAG_NOTA_COMUNICACAO == id) >= 0) return false


        return true

    }



    function canAllowThisPeca(id) {

        if (QUEM == id) return true
        else return canAllowThisPecaFirst(id)

    }



    async function criarPDF() {

        try {

            const response = await api.put('/sgigjrelinstrutorpeca/' + selected_relinstrucaopeca?.ID + '/despacho', {

            });

            if (response.status == '200') {




                const newlist = await uploadinstrucaopecaslist()

                if (newlist.done == true) {


                    for (let index = 0; index < newlist.list.length; index++) {

                        const element = newlist.list[index];

                        if (element.ID == selected_relinstrucaopeca?.ID) {

                            setselected_relinstrucaopeca(element)

                        }

                    }

                }





            }

        } catch (err) {

            console.error(err.response)

        }

    }






    function changeQUEM(value) {

        setselected_relinstrucaopeca(null)
        setCODIGO("*")

        setQUEM(value)

    }



    return (



        <form id="itemGO" onSubmit={criarItemGO}  >
            <Row>

                <Col sm={12}>
                    <div className="form-group fill">
                        <label className="floating-label" htmlFor="Name">Para Quem <span style={{ color: "red" }} >*</span></label>

                        <select value={QUEM} onChange={event => { changeQUEM(event.target.value) }} required aria-required="true" className="form-control" id="pessoa" >

                            <option hidden value="">--- Selecione ---</option>

                            {
                                DATA != "" &&

                                <>

                                    {canAllowThisPeca("1") && <option value="1" >Visado</option>}
                                    {canAllowThisPeca("2") && <option value="2" >Entidade Decisora</option>}
                                    {canAllowThisPeca("3") && <option value="3" >Entidade Visada</option>}

                                </>
                            }




                        </select>

                    </div>

                    <div className="form-group fill">


                        <JoditEditor
                            editorRef={setRef}
                            value={editorcontent}
                            config={{
                                readonly: false
                            }}
                            ref={editorREF}
                            onChange={event => updateContent(event)}
                        />


                    </div>
                </Col>




                <Col sm={12} style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", gridGap: "15px" }}>


                    {selected_relinstrucaopeca != null && <>

                        {
                            selected_relinstrucaopeca.URL_DOC != null && <a href={selected_relinstrucaopeca?.URL_DOC + "?alt=media&token=0"} target="_blank" ><Button variant="primary">Abrir DOC Gerado</Button> </a>
                        }

                        <Button onClick={() => criarPDF()} variant="primary">Gerar DOC</Button>

                    </>}

                    <Button type="submit" form="itemGO" variant="primary">Guardar</Button>

                </Col>




            </Row>
        </form>

    )
}




export default Item;