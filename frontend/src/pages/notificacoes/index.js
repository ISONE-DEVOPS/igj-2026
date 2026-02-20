import React, { useEffect, useState } from 'react';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';


import avatar3 from '../../assets/images/user/avatar-3.jpg';
import avatarLogo from '../../assets/images/avatar.svg';

import useAuth from '../../hooks/useAuth';

import { useHistory, useLocation } from 'react-router-dom';

import api from '../../services/api';


import { timerMaker2 } from '../../functions';
import moment from 'moment-timezone';
import gtm from '../../services/gtm';

import { Link } from 'react-router-dom';


const DashAnalytics = () => {

    const { popUp_removerItem, popUp_alertaOK, user, uploadlistnotificacao } = useAuth();

    const history = useHistory();


    const [newdata, setnewdata] = useState([]);
    const [avatar, setAvatar] = useState('');

    const [time, settime] = useState(moment().tz(gtm).format());
    const location = useLocation();


    function closeNotificationAndSetIDToLocalStorage(autoexclusaoId, url) {
        if (autoexclusaoId == undefined || autoexclusaoId == null) {
            history.push(url)
            return
        }
        let autoexclusao = JSON.parse(autoexclusaoId)
        localStorage.setItem("EXTRA", autoexclusao.IdAutoexclusao)
        if (url !== undefined || url !== null) {
            if (location.pathname === url) {
                window.location.reload(false);
                return
            } else {
                history.push(url)
            }
        }
    }
    function getUrlPhoto(notification) {
        let url = ''
        if (notification?.URL_FOTO) {
            url = notification?.URL_FOTO + "?alt=media&token=0"

        } else if (notification?.autoexclusao?.URL_FOTO) {
            url = notification?.autoexclusao?.URL_FOTO + "?alt=media&token=0"
        }
        else {
            url = avatarLogo
        }
        return url
    }
    async function uploadlist() {

        try {

            const response = await api.get('/glbnotificacao');

            if (response.status == '200') {
                let data = response.data['data']
                for (var i = 0; i < data.length; i++) {


                    if (data[i]?.sgigjpessoa?.sgigjrelpessoaentidade.length > 0) {

                        if (data[i]?.sgigjpessoa?.sgigjrelpessoaentidade[0].glbuser.length > 0) {

                            data[i].URL_FOTO = data[i]?.sgigjpessoa?.sgigjrelpessoaentidade[0].glbuser[0].URL_FOTO


                        } else data[i].URL_FOTO = ""

                    } else data[i].URL_FOTO = ""



                }

                setnewdata(data)

            }

            console.log(response)

        } catch (err) {

            console.error(err.response)


        }

    }
    console.log("sssssssssssssss", newdata)
    //-------------- Remover -------------------------

    const removeNotification = async (idx) => {
        let res = true;

        try {
            const response = await api.delete("/glbnotificacao/" + idx);

            uploadlistnotificacao()

            uploadlist();

        } catch (err) {
            res = false;
            console.error(err.response);
            popUp_alertaOK("Falha. Tente mais tarde");
        }


        return res;
    };

    const removeItem = async (idx) => {

        popUp_removerItem({
            delete: removeNotification,
            id: idx,
        });
    };


    useEffect(() => {
        if (user.URL_FOTO === undefined || user.URL_FOTO == "" || user.URL_FOTO == null) {
            let avatar = 'https://ui-avatars.com/api/?name=' + user.USERNAME;
            setAvatar(avatar)
        }


        if (user.FLAG_NOTIFICACAO != "0") history.push('/')


        else {

            uploadlist()

        }



    }, [])



    return (
        <React.Fragment>
            <Row>
                <Col >
                    <Card>
                        <Card.Header>

                            <h4 style={{ marginBottom: "25px" }} > <i className="feather icon-bell" /> Notificações</h4>
                        </Card.Header>
                        <Card.Body className="card-body">

                            {newdata.map(e => (


                                <ListGroup as='ul' bsPrefix=' ' className="feed-blog pl-0">
                                    <ListGroup.Item as='li' bsPrefix=' ' className={e.sgigjrelnotificacaovizualizado.length > 0 ? "diactive-feed" : ""}>
                                        <span onClick={() => { closeNotificationAndSetIDToLocalStorage(e.EXTRA, e.URL) }} key={e.ID} style={{ color: "#555", cursor: 'pointer' }} >

                                            <div className="feed-user-img">


                                                <img style={{ width: "40px", height: "40px" }} src={getUrlPhoto(e)} className="img-radius wid-40" alt="User Profile" />


                                            </div>

                                            <p style={{ top: "-12px", position: "absolute" }} >
                                                <b>{e?.sgigjpessoa?.NOME}</b> <small style={{ marginLeft: "10px" }} className="text-muted">{timerMaker2(e.DT_REGISTO, time)}</small>
                                                <br />{(e.MSG)}</p>
                                        </span>
                                        <div style={{ cursor: "pointer", right: "0px", position: "absolute" }} className='text-right'>   <a title="Eliminar" className="text-danger" onClick={() => removeItem(e.ID)}><i class="feather icon-trash-2"></i></a></div>
                                    </ListGroup.Item>
                                </ListGroup>


                            ))}




                        </Card.Body>





                    </Card>
                </Col>






            </Row>
        </React.Fragment>
    );
};

export default DashAnalytics;
