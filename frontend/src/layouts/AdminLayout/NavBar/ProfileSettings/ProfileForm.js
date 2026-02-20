import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import useAuth from "../../../../hooks/useAuth";
import api from "../../../../services/api";
import { sign } from "jsonwebtoken";

export default function ProfileForm({closed}) {
    const { user, popUp_alertaOK } = useAuth();
    const [isLoading, setIsLoading] = useState(false)
    const [PASSWORD, setPASSWORD] = useState("");
    const [PASSWORD_CONFIRMATION, setPASSWORD_CONFIRMATION] = useState("");
    const [thumnail, setThumnail] = useState(null);
    const [sign, setSign] = useState(null);

    const preview = React.useMemo(

        () => {
            //return thumnail ? onFormSubmit() : null;
            return thumnail ? URL.createObjectURL(thumnail) : null;
        },

        [thumnail]

    );
    const previewSign = React.useMemo(

        () => {
            //return thumnail ? onFormSubmit() : null;
            return sign ? URL.createObjectURL(sign) : null;
        },

        [sign]

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
    async function editarItemGO(event) {

        

        event.preventDefault();
        setIsLoading(true)

        var anexofile = ""
        var anexoSign = ""
        // TODO: Melhorar Depois
        if(!(PASSWORD && PASSWORD != "")) { } else if(PASSWORD != PASSWORD_CONFIRMATION) { popUp_alertaOK("Confirmação do Password Tem que ser igual ao Password");setIsLoading(false); return;}
       


        if(thumnail == null) anexofile = user.URL_FOTO + "?alt=media&token=0";
        else { const img = await onFormSubmitImage(thumnail);  anexofile = img.file.data}

        if(sign == null) anexoSign = user.ASSINATURA_URL + "?alt=media&token=0";
        else { const signImg = await onFormSubmitImage(sign); anexoSign = signImg.file.data}


        const upload = {

        ...(PASSWORD && {PASSWORD}),
           URL_FOTO: anexofile,
           ASSINATURA_URL:anexoSign,

        }

        console.log(upload)


        try {

            const response = await api.post('/update-own', upload);

            if (response.status == '200') {
                setIsLoading(false)

                closed && closed()

            }

        } catch (err) {
            setIsLoading(false)
            popUp_alertaOK("Algum ERRO aconteceu");
            console.error(err.response)

        }
    }
    return (
       <>
                            <Row>
                                <Col sm={12} md={6}>
                                    <div className="form-group fill">
                                        <label className="floating-label" htmlFor="Name">Foto Perfil</label>
                                        <input onChange={event => setThumnail(event.target.files[0])} style={thumnail ? { backgroundImage: 'url(' + preview + ')', backgroundSize: "cover", backgroundPosition: "center" } : { backgroundImage: 'url(' + user.URL_FOTO + '?alt=media&token=0)', backgroundSize: "cover", backgroundPosition: "center",borderRadius:"100%"}} type="file" id="input-file-now" className="file-upload  perfil_img_upload-cicle" />
                                    </div>


                                    <div className="form-group fill">
                                    <label className="floating-label" style={{ color: "black" }}  htmlFor="Sing">Assinatura:</label>
                                        <input name="Sing" onChange={event => setSign(event.target.files[0])} style={sign ? { backgroundImage: 'url(' + previewSign + ')', backgroundSize: "cover", backgroundPosition: "center" } : { backgroundImage: 'url(' + user.ASSINATURA_URL + '?alt=media&token=0)', backgroundSize: "cover", backgroundPosition: "center"}} type="file" id="input-file-now" className="sign-upload  perfil_sign_upload-rect" />
                                    </div>
{/* 
                                    <div className="custom-control custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id={'customSwitchNotEdit' + itemSelected.ID}
                                            defaultChecked={FLAG_NOTIFICACAO == "0" ? true : false}
                                            onChange={event => changeNotifi(event.target.checked)}
                                        />

                                        <label className="custom-control-label" htmlFor={'customSwitchNotEdit' + itemSelected.ID} />

                                        Notificações

                                    </div> */}

                                </Col>
                                <Col sm={12} md={6}>
                                <Row>

                                <form id="editar" onSubmit={editarItemGO} >
                                    
                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label" style={{ color: "black" }}  htmlFor="Name">Nome</label>
                                        <label className="form-control" style={{cursor:"not-allowed"}}>{user.NOME || user.sgigjrelpessoaentidade?.sgigjpessoa?.NOME}</label>
                                    </div>
                                </Col>


                                <Col sm={12}>
                                    <div className="form-group fill">
                                        <label className="floating-label"style={{ color: "black" }}  htmlFor="Name">Utilizador</label>
                                        <label className="form-control" style={{cursor:"not-allowed"}}>{user.USERNAME}</label>
                                    </div>
                                </Col>

                                <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" style={{ color: "black" }} htmlFor="Password">Password </label>
                                            <input type="password" onChange={event => { setPASSWORD(event.target.value) }} className="form-control" id="Password" autoComplete="off" placeholder="Password..." />
                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                        <div className="form-group fill">
                                            <label className="floating-label" style={{ color: "black" }} htmlFor="Password-confirmation">Confirmar Password {PASSWORD && PASSWORD != "" &&  <span style={{ color: "red" }} >*</span>}</label>
                                            <input type="password" onChange={event => { setPASSWORD_CONFIRMATION(event.target.value) }} className="form-control" id="Password-confirmation" autoComplete="off" placeholder="Confirmação de Password..." required={PASSWORD && PASSWORD != ""} />
                                        </div>
                                    </Col>
                                    <Col sm={12}>
                                    <Row className="justify-content-end px-5">
                            {!isLoading ? <Button type="submit" form="editar" className="p-2" variant="primary">Guardar</Button> : <Button className="p-2" variant="primary">Guardando</Button>

                            }
                            </Row>
                            </Col>
                                </form>
                            </Row>
                                </Col>

                            </Row>
                          
                       </>
    );
}