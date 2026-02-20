import Select from 'react-select';
import { Button, Col } from "react-bootstrap";
import CriarPessoa from '../../../../../components/Custom/CriarPessoa';
import { useEffect, useRef, useState } from 'react';
import api from '../../../../../services/api';
import Documentos from '../../../../../components/Custom/Documentoshorizontal'
import JoditEditor from 'jodit-react';


export function DesicaoField({k,value,set}){
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

    useEffect(()=>{
        uploaddecisaolist()

    })
    return <Col sm={12}>
    <div className="form-group fill">
        <label className="floating-label" htmlFor="Name">Decisão <span style={{ color: "red" }} >*</span></label>
        <select value={value} className="form-control" onChange={event => { set(k,event.target.value) }} id="perfil" required aria-required="true">

            <option hidden value="">--- Selecione ---</option>


            {decisaolist.map(e => (

                <option key={e.ID} value={e.ID}>{e.DESIG}</option>

            ))}


        </select>
    </div>
</Col>
}

export function InfracaoCoimaField({k,value,set}){

    const [infracaocoimalist, setinfracaocoimalist] = useState([]);

    async function uploadinfracaocoima() {

        try {

            const response = await api.get('/sgigjinfracaocoima');

            if (response.status == '200') {


                setinfracaocoimalist(response.data)

            }


        } catch (err) {

            console.error(err.response)


        }

        
    }
    useEffect(() => {
        uploadinfracaocoima()
    }, [])
    return <>

    <Col sm={8}>
        <div className="form-group fill">
            <label className="floating-label" htmlFor="Name">Infração{/*<span style={{ color: "red" }} >*</span>*/}</label>

            <select id="perfil" value={value?.INFRACAO} onChange={event => { set(k,{...value,INFRACAO:event.target.value}) }} className="form-control" required aria-required="true">


                <option hidden value="">--- Selecione ---</option>

                {infracaocoimalist.map(e => (

                    <option key={e.ID} value={e.ID}>{e?.sgigjprinfracaotp?.DESIG}</option>

                ))}


            </select>

        </div>
    </Col>


    <Col sm={4}>
        <div className="form-group fill">
            <label className="floating-label" htmlFor="Name">Coima </label>
            <input maxLength="128" type="number" onChange={event => { set(k,{...value,COIMA:event.target.value}) }} defaultValue={value?.COIMA} className="form-control" placeholder="Valor..." required />
        </div>
    </Col>

</>
}


export function DocumentsField ({k,value,set,documentolist,selected_relinstrucaopeca,ID_C,documentosgeral_lista_save,required=true}){
    const [documentosgeral_lista, setdocumentosgeral_lista] = useState([]);
    useEffect(() => {
        if (selected_relinstrucaopeca == null) {
            setdocumentosgeral_lista([])
        } else {
            setdocumentosgeral_lista(selected_relinstrucaopeca.sgigjreldocumento)
        }

    }, [selected_relinstrucaopeca])
    return <Col sm={12} >
    <Documentos required={required} documentolist={documentolist} list={documentosgeral_lista} save={documentosgeral_lista_save} item={selected_relinstrucaopeca == null ? { ID: ID_C, ENTIDADE: "REL_INSTRUTOR_PECAS_ID" } : { ID: selected_relinstrucaopeca.ID, ENTIDADE: "REL_INSTRUTOR_PECAS_ID" }} hidden={true} />
    </Col>
}


export function OBS ({k,value,set,obsRef}) {



    return <Col sm={12}>

        <div className="form-group fill">



            <JoditEditor
                value={value}
                config={{
                    readonly: false
                }}
                ref={obsRef}
                
            />


        </div>
    </Col>

}

export function PessoaField({k,value,set,selected_relinstrucaopeca,pessoalist,documentolist}){
    const [generolist, setgenerolist] = useState([]);
    const [estadocivillist, setestadocivillist] = useState([]);
    const [glbgeografialist, setglbgeografia] = useState([]);
    const [contactolist, setcontactolist] = useState([]);
    const [pessoaopen, setpessoaopen] = useState({ code: 0, value: false });
    const [newpessoalist, setnewpessoalist] = useState([]);
    

    /**
     * 
     */
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
    /**
     * 
     */
    async function uploadpessoa() {
        try {
            const response = await api.get('/sgigjpessoa');
            if (response.status == '200') {
                for (var i = 0; i < response.data.length; i++) {
                    response.data[i].value = response.data[i].ID
                    response.data[i].label = response.data[i].NOME
                }
                setnewpessoalist(response.data)
            }
        } catch (err) {
            console.error(err.response)
        }
    }
    /**
     * 
     */
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

    /**
     * 
     */
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



    /**
     * 
     */
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

    useEffect(() => {

        setnewpessoalist(pessoalist)

        // if (selected_relinstrucaopeca == null) {

        //     setdocumentosgeral_lista([])


        // } else {

        //     setdocumentosgeral_lista(selected_relinstrucaopeca.sgigjreldocumento)

        // }

        console.log(selected_relinstrucaopeca)


        uploadgenerolist()
        uploadestadocivil()
        uploadglbgeografia()
        uploadcontactolist()


    }, [])

    return <Col sm={12}>

    <label className="floating-label" htmlFor="text">Pessoa <span style={{ color: "red" }} >*</span></label>
    <div style={{ display: "flex" }} >
        <div className="form-group fill" style={{ width: "100%" }} >



            <Select
                className="basic-single"
                classNamePrefix="select"
                onChange={event => set(k,event.value)}
                name="pessoa"
                options={newpessoalist}
                value={newpessoalist.map(p => (

                    p.ID == value ? p : null

                ))}
                required
                menuPlacement="auto"
                menuPosition="fixed"
                placeholder="Pessoa..."
            />



        </div>

        <Button onClick={() => setpessoaopen({ code: pessoaopen.code + 1, value: true })} style={{ marginLeft: "8px", height: "38px" }} variant="primary"><i className="feather icon-plus" /></Button>

    </div>

    <CriarPessoa generolist={generolist} estadocivillist={estadocivillist} glbgeografialist={glbgeografialist} documentolist={documentolist} contactolist={contactolist} pessoaopenDO={pessoaopen} uploadpessoa={uploadpessoa} />

</Col>
}