import { useEffect, useRef, useState } from "react"
import { Switch } from "./switch";
import { Button, Col, Row } from "react-bootstrap";
import api from "../../../../../services/api";
import useAuth from "../../../../../hooks/useAuth";
import toast from 'react-hot-toast';



export default function PecasForm ({DATA,peca,selected_relinstrucaopeca,pessoalist,documentolist,setdocumentosgeral_lista,item,uploadinstrucaopecaslist,setselected_relinstrucaopeca}) {
    const [documentosgeral_lista_save, setdocumentosgeral_lista_save] = useState(false);
    const [ID_C, setID_C] = useState("");
    const [data,setData] = useState({})
    const { popUp_alertaOK } = useAuth();
    const obsRef = useRef()
    function set(k, val) {
        setData({...data, [k]: val});
    }

    useEffect(()=>{
        setData({
            DESTINATARIO:selected_relinstrucaopeca?.DESTINATARIO_ID || "",
            PESSOA:selected_relinstrucaopeca?.PESSOA_TESTEMUNHA_ID || "",
            COIMA:selected_relinstrucaopeca?.COIMA || "",
            OBS: selected_relinstrucaopeca?.OBS || peca?.OBS ||"",
            DECISAO:selected_relinstrucaopeca?.PR_DECISAO_TP_ID || "",
            INFRACAO_COIMA: null,
        });
        if(obsRef.current) obsRef.current.value = selected_relinstrucaopeca?.OBS || peca?.OBS || "";
    },[selected_relinstrucaopeca,peca])

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
                        }}}
            }

        } catch (err) {
            console.error(err.response)
        }
    }
    async function criarItemGO(event) {
        event.preventDefault();
        if (DATA == "") popUp_alertaOK("Escolha uma data")

        else {
            try {
                const upload = {
                    REL_PROCESSO_INSTRUCAO_ID: item?.sgigjprocessodespacho[0].sgigjrelprocessoinstrutor[0].sgigjrelprocessoinstrucao[0].ID,
                    PR_PECAS_PROCESSUAIS_ID: peca.ID,
                    PESSOA_TESTEMUNHA_ID:data.PESSOA || null,
                    DESTINATARIO_ID:data.DESTINATARIO || null,
                    PR_DECISAO_TP_ID:data.DECISAO || null,
                    INFRACAO_COIMA_ID:data.INFRACAO_COIMA?.INFRACAO || null,
                    COIMA:data.INFRACAO_COIMA?.COIMA || null,
                    DATA,
                    OBS:obsRef?.current?.value || "",
                }
                console.log(upload)
                if (selected_relinstrucaopeca == null) {
                    const response = await api.post('/sgigjrelinstrutorpeca', upload);
                    if (response.status == '200') {
                        setID_C(response.data.ID)
                        setdocumentosgeral_lista_save(!documentosgeral_lista_save)
                        const newlist = await uploadinstrucaopecaslist()
                        if (newlist.done == true) {
                            for (let index = 0; index < newlist.list.length; index++) {
                                const element = newlist.list[index];
                                if (element.ID == response.data.ID) {
                                    setselected_relinstrucaopeca(element)
                        }}}
                    }
                } else {
                    const response = await api.put('/sgigjrelinstrutorpeca/' + selected_relinstrucaopeca.ID, upload);
                    if (response.status == '200') {
                        toast.success('Documento Guardado!', { duration: 4000 })

                        setdocumentosgeral_lista_save(!documentosgeral_lista_save)
                        uploadinstrucaopecaslist()
                    }
                }
            } catch (err) { console.error(err)}
        }

    }
    function findKey (sigjprcampo) {
        if(!sigjprcampo) return undefined;
        return sigjprcampo['FLAG_ANEXO_DOC'] == "1"? "ANEXO_DOC":
        sigjprcampo['FLAG_DECISAO'] == "1"? "DECISAO":
        sigjprcampo['FLAG_DESTINATARIO'] == "1"? "DESTINATARIO":
        sigjprcampo['FLAG_INFRACAO_COIMA'] == "1"? "INFRACAO_COIMA":
        sigjprcampo['FLAG_OBS'] == "1"? "OBS":
        sigjprcampo['FLAG_PERIODO_EXCLUSAO'] == "1"? "PERIODO_EXCLUSAO":
        sigjprcampo['FLAG_PESSOA'] == "1"? "PESSOA": 
        sigjprcampo['FLAG_TEXTO'] == "1"? "TEXTO": 
        undefined
    }
    const fields =  peca?.sgigjrelpecaprocessualcampo?.map(f => ({
        key: findKey(f.sigjprcampo),
        value: data[findKey(f.sigjprcampo)],
        ORDEM: f.ORDEM,
        required: f.FLAG_OBRIGATORIEDADE == 1
    })).sort((a, b) => a.ORDEM - b.ORDEM) || [];

    return <form id="itemGO" onSubmit={criarItemGO}>
        {peca && <Row>
            {fields.map(o => Switch(o.key, o.value, set, selected_relinstrucaopeca, pessoalist, documentolist,documentosgeral_lista_save, ID_C, obsRef,o.required))}

            <Col sm={12} style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", gridGap: "15px" }}>
            {selected_relinstrucaopeca != null && <>

            {
            selected_relinstrucaopeca.URL_DOC != null && <a href={selected_relinstrucaopeca?.URL_DOC + "?alt=media&token=0"} target="_blank" ><Button variant="primary">Abrir DOC Gerado</Button> </a>
        }

            <Button onClick={() => criarPDF()} variant="primary">Gerar DOC</Button>

                </>}
                <Button type="submit" form="itemGO" variant="primary">Guardar</Button>
            </Col>
        </Row>}
    </form>

}