import React, { useEffect, useState } from 'react';
import { Row, Col, Card, ListGroup, Tabs, Tab, Table, Badge } from 'react-bootstrap';

import avatarLogo from '../../assets/images/avatar.svg';

import useAuth from '../../hooks/useAuth';

import { useHistory, useLocation } from 'react-router-dom';

import api from '../../services/api';

import { timerMaker2 } from '../../functions';
import moment from 'moment-timezone';
import gtm from '../../services/gtm';


const Notificacoes = () => {

    const { popUp_removerItem, popUp_alertaOK, user, uploadlistnotificacao } = useAuth();

    const history = useHistory();

    const [newdata, setnewdata] = useState([]);
    const [prazos, setPrazos] = useState([]);
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
        } else {
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
        } catch (err) {
            console.error(err.response)
        }
    }

    async function uploadPrazos() {
        try {
            const dataagora = moment().tz(gtm)
            const response = await api.get('/tempolimiteprocessoexclusao');
            if (response.status == '200') {
                let newlist = []

                // Processar prazolimite (exclusão interdição)
                if (response.data.prazolimite) {
                    for (let i = 0; i < response.data.prazolimite.length; i++) {
                        const element = response.data.prazolimite[i]
                        const despacho = element?.sgigjprocessodespacho?.[0]
                        if (despacho?.DATA && despacho?.PRAZO) {
                            const dataDespacho = moment(despacho.DATA)
                            const prazoFim = dataDespacho.clone().add(despacho.PRAZO, "days")
                            const diasRestantes = prazoFim.diff(dataagora, "days")
                            if (diasRestantes >= 0 && diasRestantes <= 10) {
                                newlist.push({
                                    ID: element.ID,
                                    CODIGO: element.CODIGO,
                                    VISADO: element?.sgigjpessoa?.NOME || '',
                                    PRAZO: despacho.PRAZO,
                                    dataDespacho: moment(despacho.DATA).format("DD/MM/YYYY"),
                                    diasRestantes: diasRestantes,
                                    tipo: element.TIPO || 'I',
                                    url: '/processos/exclusaointerdicao'
                                })
                            }
                        }
                    }
                }

                // Processar prazocontraordenacao
                if (response.data.prazocontraordenacao) {
                    for (let i = 0; i < response.data.prazocontraordenacao.length; i++) {
                        const element = response.data.prazocontraordenacao[i]
                        const despacho = element?.sgigjprocessodespacho?.[0]
                        if (despacho?.DATA && despacho?.PRAZO) {
                            const dataDespacho = moment(despacho.DATA)
                            const prazoFim = dataDespacho.clone().add(despacho.PRAZO, "days")
                            const diasRestantes = prazoFim.diff(dataagora, "days")
                            if (diasRestantes >= 0 && diasRestantes <= 10) {
                                if (!newlist.find(o => o.ID === element.ID)) {
                                    newlist.push({
                                        ID: element.ID,
                                        CODIGO: element.CODIGO,
                                        VISADO: element?.sgigjpessoa?.NOME || '',
                                        PRAZO: despacho.PRAZO,
                                        dataDespacho: moment(despacho.DATA).format("DD/MM/YYYY"),
                                        diasRestantes: diasRestantes,
                                        tipo: 'C',
                                        url: '/processos/contraordenacao'
                                    })
                                }
                            }
                        }
                    }
                }

                // Processar prazovisado (reclamação)
                if (response.data.prazovisado) {
                    for (let i = 0; i < response.data.prazovisado.length; i++) {
                        const element = response.data.prazovisado[i]
                        const subelement = element?.sgigjprocessodespacho?.[0]?.sgigjrelprocessoinstrutor?.[0]?.sgigjrelprocessoinstrucao?.[0]?.sgigjrelinstrutorpeca
                        if (subelement) {
                            for (let j = 0; j < subelement.length; j++) {
                                if (subelement[j].PR_PECAS_PROCESSUAIS_ID == "0a2557ff1b8e966ae041183b8bbcb4d2ce1d") {
                                    const dataprocesso = "" + subelement[j].DT_REGISTO
                                    const prazo = dataagora.diff(moment(dataprocesso.slice(0, 10)).tz(gtm), 'days')
                                    if (prazo > 0 && !newlist.find(o => o.ID === element.ID)) {
                                        newlist.push({
                                            ID: element.ID,
                                            CODIGO: element.CODIGO,
                                            VISADO: element?.sgigjpessoa?.NOME || '',
                                            PRAZO: prazo,
                                            dataDespacho: moment(dataprocesso.slice(0, 10)).format("DD/MM/YYYY"),
                                            diasRestantes: -prazo,
                                            tipo: 'V',
                                            url: '/processos/exclusaointerdicao'
                                        })
                                    }
                                }
                            }
                        }
                    }
                }

                // Ordenar por dias restantes (mais urgente primeiro)
                newlist.sort((a, b) => a.diasRestantes - b.diasRestantes)
                setPrazos(newlist)
            }
        } catch (err) {
            console.error(err.response)
        }
    }

    function getRowColor(diasRestantes) {
        if (diasRestantes <= 0) return 'rgba(252, 97, 128, 0.1)'
        if (diasRestantes <= 3) return 'rgba(252, 97, 128, 0.08)'
        if (diasRestantes <= 7) return 'rgba(255, 182, 77, 0.08)'
        return 'rgba(46, 216, 182, 0.08)'
    }

    function getBadgeVariant(diasRestantes) {
        if (diasRestantes <= 3) return 'danger'
        if (diasRestantes <= 7) return 'warning'
        return 'success'
    }

    function getTipoLabel(tipo) {
        if (tipo === 'I') return 'Interdição'
        if (tipo === 'C') return 'Contra-Ordenação'
        if (tipo === 'V') return 'Visado'
        return tipo
    }

    function getTipoBadgeColor(tipo) {
        if (tipo === 'I') return '#AB7DF6'
        if (tipo === 'C') return '#E8575A'
        if (tipo === 'V') return '#FF8C00'
        return '#4680FF'
    }

    const removeNotification = async (idx) => {
        let res = true;
        try {
            await api.delete("/glbnotificacao/" + idx);
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
        if (user.FLAG_NOTIFICACAO != "0") history.push('/')
        else {
            uploadlist()
            uploadPrazos()
        }
    }, [])


    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Tabs defaultActiveKey="prazos" className="mb-3">

                                {/* Tab 1: Alertas de Prazos */}
                                <Tab eventKey="prazos" title={
                                    <span>
                                        <i className="fas fa-clock" style={{ marginRight: 6, color: '#FC6180' }} /> Alertas de Prazos
                                        {prazos.length > 0 && <Badge pill variant="danger" style={{ marginLeft: 6, fontSize: '10px' }}>{prazos.length}</Badge>}
                                    </span>
                                }>
                                    {prazos.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#A0AEC0' }}>
                                            <i className="fas fa-check-circle" style={{ fontSize: 32, marginBottom: 12, color: '#2ed8b6' }} />
                                            <p>Sem prazos a vencer nos próximos 10 dias</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ marginBottom: 16 }}>
                                                <small className="text-muted">
                                                    <i className="fas fa-info-circle" style={{ marginRight: 4 }} />
                                                    Processos com prazo a vencer nos próximos 10 dias. Clique numa linha para abrir o processo.
                                                </small>
                                            </div>
                                            <Table hover responsive style={{ fontSize: '13px' }}>
                                                <thead style={{ background: '#F5F7FA' }}>
                                                    <tr>
                                                        <th>Tipo</th>
                                                        <th>Código</th>
                                                        <th>Visado</th>
                                                        <th>Prazo Total</th>
                                                        <th>Data Despacho</th>
                                                        <th>Dias Restantes</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {prazos.map(p => (
                                                        <tr
                                                            key={p.ID + p.tipo}
                                                            onClick={() => history.push(p.url)}
                                                            style={{ cursor: 'pointer', background: getRowColor(p.diasRestantes) }}
                                                        >
                                                            <td>
                                                                <Badge style={{ backgroundColor: getTipoBadgeColor(p.tipo), color: '#fff', fontSize: '11px', padding: '4px 8px' }}>
                                                                    {getTipoLabel(p.tipo)}
                                                                </Badge>
                                                            </td>
                                                            <td style={{ fontWeight: 600 }}>{p.CODIGO}</td>
                                                            <td>{p.VISADO}</td>
                                                            <td>{p.PRAZO} dias</td>
                                                            <td>{p.dataDespacho}</td>
                                                            <td>
                                                                <Badge variant={getBadgeVariant(p.diasRestantes)} style={{ fontSize: '12px', padding: '4px 10px' }}>
                                                                    {p.diasRestantes <= 0 ? 'Vencido' : p.diasRestantes + ' dias'}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </>
                                    )}
                                </Tab>

                                {/* Tab 2: Notificações */}
                                <Tab eventKey="notificacoes" title={
                                    <span><i className="fas fa-bell" style={{ marginRight: 6, color: '#FFB64D' }} /> Notificações</span>
                                }>
                                    {newdata.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#A0AEC0' }}>
                                            <i className="fas fa-bell-slash" style={{ fontSize: 32, marginBottom: 12 }} />
                                            <p>Sem notificações</p>
                                        </div>
                                    ) : (
                                        newdata.map(e => (
                                            <ListGroup as='ul' bsPrefix=' ' className="feed-blog pl-0" key={e.ID}>
                                                <ListGroup.Item as='li' bsPrefix=' ' className={e.sgigjrelnotificacaovizualizado.length > 0 ? "diactive-feed" : ""}>
                                                    <span onClick={() => { closeNotificationAndSetIDToLocalStorage(e.EXTRA, e.URL) }} style={{ color: "#555", cursor: 'pointer' }} >
                                                        <div className="feed-user-img">
                                                            <img style={{ width: "40px", height: "40px" }} src={getUrlPhoto(e)} className="img-radius wid-40" alt="User Profile" />
                                                        </div>
                                                        <p style={{ top: "-12px", position: "absolute" }} >
                                                            <b>{e?.sgigjpessoa?.NOME}</b> <small style={{ marginLeft: "10px" }} className="text-muted">{timerMaker2(e.DT_REGISTO, time)}</small>
                                                            <br />{(e.MSG)}</p>
                                                    </span>
                                                    <div style={{ cursor: "pointer", right: "0px", position: "absolute" }} className='text-right'>
                                                        <a title="Eliminar" className="text-danger" onClick={() => removeItem(e.ID)}><i className="feather icon-trash-2"></i></a>
                                                    </div>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        ))
                                    )}
                                </Tab>

                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Notificacoes;
