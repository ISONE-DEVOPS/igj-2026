import React, { useContext, useEffect, useState } from 'react';
import { ListGroup, Dropdown, Media } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import ChatList from "./ChatList";
import { ConfigContext } from "../../../../contexts/ConfigContext";

import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';
import avatarLogo from '../../../../assets/images/avatar.svg';

import api from '../../../../services/api';

import useAuth from '../../../../hooks/useAuth';

import { useHistory } from 'react-router-dom';

import { timerMaker2, taskEnable, taskEnableIcon, taskEnableTitle } from '../../../../functions';

import moment from 'moment-timezone';
import gtm from '../../../../services/gtm';
import Profile from '../ProfileSettings';

const NavRight = () => {

    const [time, settime] = useState(moment().tz(gtm).format());


    const history = useHistory();

    const { thememenu, setthememenu, user, createlockdata, notificacao, countNotification, uploadlistnotificacao } = useAuth();

    const { permissoes } = useAuth();

    const location = useLocation();
    const configContext = useContext(ConfigContext);
    const { logout } = useAuth();
    const { rtlLayout } = configContext.state;

    const [listOpen, setListOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const [notification, setNotification] = useState(false);
    const [avatar, setAvatar] = useState(false);

    // const navigate = useNavigate();

    async function openCloseNotification() {
        if (!notification) {
            if (countNotification === 0) {
                setNotification(!notification)
                return
            }
            setNotification(!notification)
            try {
                const response = await api.get('/lido');
                uploadlistnotificacao()
            } catch (err) {
                console.error(err.response)
            }
        } else {
            setNotification(!notification)
            console.log(notification)
        }
    }
    function closeNotificationAndSetIDToLocalStorage(autoexclusaoId, url) {
        if (autoexclusaoId == undefined || autoexclusaoId == null) {
            history.push(url)
            return
        }
        let autoexclusao = JSON.parse(autoexclusaoId)
        setNotification(!notification)
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
    function goToNotification() {
        setNotification(!notification)
        history.push('/notificacoes')
    }
    const bloquear = async () => {

        if (typeof user != "undefined") {

            createlockdata(user.USERNAME, user.URL_FOTO, document.location.pathname)
            handleLogout()
            history.push('/auth/lock')

        } else handleLogout()

    };


    const handleLogout = async () => {

        try {
            //handleClose();
            await logout();
        } catch (err) {
            console.error(err);
        }

    };

    const goToAllNotification = async () => {

        history.push('/notificacoes')

    };





    useEffect(() => {
        if (user.URL_FOTO === undefined || user.URL_FOTO == "" || user.URL_FOTO == null) {
            let avatar = 'https://ui-avatars.com/api/?name=' + user.USERNAME;
            setAvatar(avatar)
        }
        console.log("sssssssssssssssssssssssss", user)
        setInterval(function () {
            settime(moment().tz('Etc/GMT+1').format())
        }, 1000);




    }, [])

    return (
        <>
            <React.Fragment>
                <ListGroup as='ul' bsPrefix=' ' className="navbar-nav ml-auto">

                    {user.FLAG_NOTIFICACAO == "0" ?

                        <ListGroup.Item as='li' bsPrefix=' '>
                            <Dropdown show={notification} alignRight={!rtlLayout} onToggle={openCloseNotification}>

                                <Dropdown.Toggle as={Link} variant='link' to='#' onClick={openCloseNotification}
                                    id="dropdown-basic">
                                    <i className="fas fa-bell" style={{ color: '#FFB64D', fontSize: 18 }} />
                                    <div className='notification-circle'>{countNotification}</div>
                                    {/*<span className="badge badge-pill badge-danger"><span/></span>*/}
                                </Dropdown.Toggle>

                                <Dropdown.Menu alignRight className="notification notification-scroll">
                                    <div className="noti-head">
                                        <h6 className="d-inline-block m-b-0">Notificações</h6>
                                        <div className="float-right">
                                            {/* <Link to='#'>Marcar como lidas</Link> */}
                                        </div>
                                    </div>
                                    <PerfectScrollbar>
                                        <ListGroup as='ul' bsPrefix=' ' variant="flush" className="noti-body">

                                            {notificacao.filter(x => notificacao.findIndex((y) => y == x) < 4).map(e => (

                                                <span onClick={() => closeNotificationAndSetIDToLocalStorage(e.EXTRA, e.URL)} key={e.ID} style={{ color: "#555", cursor: "pointer" }} >

                                                    <ListGroup.Item as='li' bsPrefix=' ' className="notification">
                                                        <Media>


                                                            <img style={{ width: "40px", height: "40px" }} src={getUrlPhoto(e)} className="img-radius wid-40" alt="User Profile" />


                                                            <Media.Body>
                                                                <p>
                                                                    <strong>{e?.sgigjpessoa?.NOME}</strong>
                                                                    <span className="n-time text-muted">
                                                                        <i className="icon feather icon-clock m-r-10" />{timerMaker2(e.DT_REGISTO, time)}
                                                                        {e.sgigjrelnotificacaovizualizado.length > 0
                                                                            && <span style={{ backgroundColor: "#FF5370", width: "6px", height: "6px", left: "53px", top: "20px", position: "absolute", borderRadius: "50%" }} ></span>}

                                                                    </span>
                                                                </p>
                                                                <p>{e.MSG}</p>
                                                            </Media.Body>
                                                        </Media>
                                                    </ListGroup.Item>

                                                </span>



                                            ))}


                                        </ListGroup>
                                    </PerfectScrollbar>
                                    <div className="noti-footer">
                                        <span style={{ cursor: 'pointer' }} onClick={goToNotification}>Mostrar todas</span>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </ListGroup.Item>

                        : null}

                    {taskEnable("/administracao/utilizador", permissoes, "useronline") == false ? null :
                        <ListGroup.Item as='li' bsPrefix=' '>
                            <Dropdown>
                                <Dropdown.Toggle as={Link} variant='link' to='#' className="displayChatbox" onClick={() => setListOpen(true)}>
                                    <i title={taskEnableTitle("/administracao/utilizador", permissoes, "useronline")} className="fas fa-users" style={{ color: '#4680FF', fontSize: 18 }} />
                                </Dropdown.Toggle>
                            </Dropdown>
                        </ListGroup.Item>
                    }
                    <ListGroup.Item as='li' bsPrefix=' '>
                        <Dropdown alignRight={!rtlLayout} className="drp-user">
                            <Dropdown.Toggle as={Link} variant='link' to='#' id="dropdown-basic">
                                {
                                    user.URL_FOTO === undefined || user.URL_FOTO === "" || user.URL_FOTO === "" ?
                                        <>
                                            <div className="wid-40 img-radius" style={{ height: '40px' }}>
                                                <img src={avatar} className="img-radius  h-100 w-100" alt="User Profile" />
                                            </div>
                                        </>
                                        :
                                        <>  <div className="wid-40 img-radius" style={{ height: '40px' }}>
                                            <img src={user.URL_FOTO + "?alt=media&token=0"} className="img-radius  h-100 w-100" alt="User Profile" />  </div>  </>

                                }
                            </Dropdown.Toggle>
                            <Dropdown.Menu alignRight className="profile-notification">
                                <div className="pro-head d-flex align-items-center">
                                    {
                                        user.URL_FOTO === undefined || user.URL_FOTO === "" || user.URL_FOTO === "" ?
                                            <>
                                                <div className="wid-40 img-radius" style={{ height: '40px' }}>
                                                    <img src={avatar} className="img-radius  h-100 w-100" alt="User Profile" />
                                                </div>
                                            </>
                                            :
                                            <>  <div className="wid-40 img-radius" style={{ height: '40px' }}>
                                                <img src={user.URL_FOTO + "?alt=media&token=0"} className="img-radius  h-100 w-100" alt="User Profile" />  </div>  </>

                                    }
                                    <span>{

                                        typeof user != "undefined" ?

                                            typeof user.sgigjrelpessoaentidade != "undefined" ?

                                                typeof user.sgigjrelpessoaentidade.sgigjpessoa != "undefined" ?

                                                    typeof user.sgigjrelpessoaentidade.sgigjpessoa.NOME != "undefined" ?

                                                        user.sgigjrelpessoaentidade.sgigjpessoa.NOME

                                                        : ""

                                                    : ""

                                                : ""

                                            : ""


                                    }</span>
                                    <Link to='#' onClick={handleLogout} className="dud-logout" title="Sair">
                                        <i className="fas fa-sign-out-alt" style={{ color: '#FC6180' }} />
                                    </Link>
                                </div>
                                <ListGroup as='ul' bsPrefix=' ' variant='flush' className="pro-body">
                                    <ListGroup.Item as='li' bsPrefix=' '><Link to='#' className="dropdown-item" onClick={()=>setProfileOpen(true)}><i className="fas fa-user" style={{ color: '#4680FF', marginRight: 8 }} /> Meu Perfil</Link></ListGroup.Item>
                                    <ListGroup.Item as='li' bsPrefix=' '><Link to='#' className="dropdown-item" onClick={() => bloquear()}><i className="fas fa-lock" style={{ color: '#FFB64D', marginRight: 8 }} /> Bloquear ecrã</Link></ListGroup.Item>
                                    <ListGroup.Item as='li' bsPrefix=' '><Link to='#' className="dropdown-item" onClick={() => setthememenu(!thememenu)} ><i className="fas fa-palette" style={{ color: '#AB7DF6', marginRight: 8 }} /> Mudar tema</Link></ListGroup.Item>
                                    <ListGroup.Item as='li' bsPrefix=' '><Link to='#' className="dropdown-item" onClick={handleLogout}><i className="fas fa-sign-out-alt" style={{ color: '#FC6180', marginRight: 8 }} /> Sair</Link></ListGroup.Item>
                                </ListGroup>
                            </Dropdown.Menu>
                        </Dropdown>
                    </ListGroup.Item>
                </ListGroup>
                <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
                <Profile listOpen={profileOpen} closed={() => setProfileOpen(false)} />
            </React.Fragment>
        </>
    )
};

export default NavRight;
