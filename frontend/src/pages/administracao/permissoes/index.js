import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, Form } from 'react-bootstrap';


import { Link } from 'react-router-dom';




import api from '../../../services/api';


import useAuth from '../../../hooks/useAuth';


import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle } from '../../../functions';


const pageAcess = "/administracao/permissoes"




function Table({ newdata, perfil, uploadlist }) {





    const [data2, setdata2] = useState(newdata);
    const [perfil_c, setperfil_c] = useState(perfil);


    useEffect(() => {

        setperfil_c(perfil)

    }, [perfil])


    //tempdata,settempdata,


    const { popUp_alertaOK, tempdata, } = useAuth();



    function opencloserow_responsive(list, id) {

        for (var i = 0; i < list.length; i++) {

            if (list[i].ID == id) list[i].open = !list[i].open

            else {

                if (list[i].hasOwnProperty('list')) if (list[i].list.length > 0) opencloserow_responsive(list[i].list, id)

            }

        }

        return list


    }

    function opencloserow(id) {

        var list = newdata

        var list2 = opencloserow_responsive(list, id)

        setdata2(list2.concat([]))

        //        setnovoscontactos(novoscontactos.concat([]))



    }



    function changecheck_responsive(list, id) {

        for (var i = 0; i < list.length; i++) {

            if (list[i].ID == id) list[i].checked = !list[i].checked


            else {

                if (list[i].hasOwnProperty('list')) if (list[i].list.length > 0) changecheck_responsive(list[i].list, id)

            }

        }

        return list


    }



    async function changecheck(id, check) {

        console.log(tempdata)

        if (check == false) {


            const upload = {

                PERFIL_ID: tempdata.perfil,
                MENUS_ID: id,


            }

            console.log(upload)


            try {

                const response = await api.post('/glbperfilmenu', upload);

                if (response.status == '200') {

                    var list = newdata

                    var list2 = changecheck_responsive(list, id)

                    setdata2(list2.concat([]))

                }

            } catch (err) {

                console.error(err.response)
                popUp_alertaOK("Falha. Tente novamente")
                tempdata.uploadlist()


            }



        } else {


            try {

                const response = await api.delete('/glbperfilmenu/0?PERFIL_ID=' + tempdata.perfil + "&MENUS_ID=" + id);

                if (response.status == '200') {

                    var list = newdata

                    var list2 = changecheck_responsive(list, id)

                    setdata2(list2.concat([]))


                }


            } catch (err) {

                console.error(err.response)
                popUp_alertaOK("Falha. Tente novamente")
                tempdata.uploadlist()

            }



        }



    }







    if (data2.length > 0)

        return (

            data2.map(e => (


                <div key={e.ID} >
                    <span>

                        {e.hasOwnProperty('list') == true ?
                            e.open == true ?
                                <i onClick={() => opencloserow(e.ID)} style={{ marginRight: "12px" }} className="feather icon-minus" />
                                : <i onClick={() => opencloserow(e.ID)} style={{ marginRight: "12px" }} className="feather icon-plus" />
                            : <i style={{ marginRight: "12px" }} className="feather icon-minus" />}

                        <label>
                            <Form.Group style={{ margin: "0", padding: "0" }}>
                                <Form.Check
                                    custom


                                    style={{ margin: "0" }}
                                    type="checkbox"
                                    id={e.ID}
                                    checked={e.checked}
                                    onChange={() => changecheck(e.ID, e.checked)}


                                />
                            </Form.Group>
                            <i className={e.URL_ICON} />
                            <p>{e.DS_MENU}</p>

                        </label>
                    </span>

                    {

                        e.hasOwnProperty('list') == true && e.open == true ?

                            e.list.length > 0 ?

                                <Table newdata={e.list} />

                                : null

                            : null

                    }

                </div>

            ))

        )

    else return null


}




const Customers = () => {


    const { permissoes } = useAuth();

    const history = useHistory();



    const { popUp_alertaOK, settempdata, } = useAuth();


    const [ID_C, setID_C] = useState("");
    const [SELF_ID, setSELF_ID] = useState("");
    const [DS_MENU, setDS_MENU] = useState("");
    const [URL_ICON, setURL_ICON] = useState("");
    const [ACAO, setACAO] = useState("");
    const [TABELA, setTABELA] = useState("");


    const [itemSelected, setitemSelected] = useState({});

    var [perfil, setperfil] = useState("");
    const [loading, setloading] = useState(false);


    //-------------------------- UPLOAD -----------------

    const [newdata, setnewdata] = useState([]);

    async function uploadlist() {

        setloading(true)

        try {

            const response = await api.get('/glbmenu');

            if (response.status == '200') {

                for (var i = 0; i < response.data.length; i++) {

                    const idx = response.data[i].ID

                    response.data[i].id = response.data[i].ID

                    if (response.data[i].SELF_ID == null) response.data[i].open = true
                    else response.data[i].open = false

                    if (ischecked(response.data[i].glbperfil) == true) response.data[i].checked = true
                    else response.data[i].checked = false


                }

                maker(response.data)

                console.log(maker2(response.data))

                setnewdata(maker2(response.data))


            }


        } catch (err) {

            console.error(err.response)


        }

        setloading(false)


    }






    const [glbperfillist, setglbperfillist] = useState([]);

    async function uploadglbperfillist() {

        try {

            const response = await api.get('/glbperfil');

            if (response.status == '200') {

                setglbperfillist(response.data)

            }

        } catch (err) {

            console.error(err.response)


        }

    }


    //-------------------------------------------






    //-------------- Ver -------------------------



    const openVerHandler = (idx) => {
        setVerOpen(true);
        setIsEditarOpen(false);
        setIsOpen(false);
        setitemSelected(idx)
    };



    //-----------------------------------------------'





    //-------------- EDITAR -------------------------


    const openEditHandler = (idx) => {
        setIsEditarOpen(true);
        setIsOpen(false);
        setVerOpen(false);
        setitemSelected(idx)

        setSELF_ID(idx.SELF_ID);
        setDS_MENU(idx.DS_MENU);
        setURL_ICON(idx.URL_ICON);

        if (typeof (idx.URL2) != "undefined") {

            setACAO(idx.URL2[2])
            setTABELA(idx.URL2[1])

        } else {

            setACAO("")
            setTABELA("")

        }

    };







    async function editarItemGO(event) {

        event.preventDefault();


        const upload = {

            SELF_ID,
            DS_MENU,
            URL_ICON,
            URL: "/" + TABELA + "/" + ACAO,
            TIPO: "task",
            ORDEM: "0",


        }

        console.log(upload)


        try {

            const response = await api.put('/glbmenu/' + itemSelected.ID, upload);

            if (response.status == '200') {

                uploadlist()
                setIsEditarOpen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }


    //----------------------------------------------









    //-------------- CRIAR -------------------------


    const openHandler = () => {
        setIsOpen(true);
        setIsEditarOpen(false);
        setVerOpen(false);


        setSELF_ID("");
        setDS_MENU("");
        setURL_ICON("");
        setACAO("")
        setTABELA("")
        setURL_ICON("")



    };





    async function criarItemGO(event) {

        event.preventDefault();


        const upload = {

            SELF_ID,
            DS_MENU,
            URL_ICON,
            URL: "/" + TABELA + "/" + ACAO,
            TIPO: "task",
            ORDEM: "0",


        }

        console.log(upload)


        try {

            const response = await api.post('/glbmenu', upload);

            if (response.status == '200') {

                uploadlist()
                setIsOpen(false)

            }

        } catch (err) {

            console.error(err.response)

        }

    }


    //----------------------------------------------










    //-------------- Remover -------------------------


    const removeItem = async (idx) => {


        try {

            const response = await api.delete('/glbmenu/' + idx);


        } catch (err) {

            console.error(err.response)

        }

        uploadlist()


    };



    //-----------------------------------------------




    useEffect(() => {


        if (pageEnable(pageAcess, permissoes) == false) history.push('/')

        else {

            uploadglbperfillist()
            settempdata({
                perfil,
                uploadlist
            })

        }


    }, [])


    useEffect(() => {

        uploadlist()
        settempdata({
            perfil,
            uploadlist
        })

    }, [perfil])






    const [isOpen, setIsOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [isVerOpen, setVerOpen] = useState(false);






    function maker(s) {


        for (var i = 0; i < s.length; i++) {

            if (s[i].SELF_ID != null) {

                for (var e = 0; e < s.length; e++) {

                    if (s[e].ID == s[i].SELF_ID) {

                        if (s[e].hasOwnProperty('list') == false) {
                            s[e].list = []
                        }

                        s[e].list.push(s[i])

                    } else {

                        if (s[e].hasOwnProperty('list') == true) {

                            if (s[e].list.length > 0) {

                                for (var o = 0; o < s[e].list.length; o++) {

                                    maker(s[e].list[o])

                                }

                            }

                        }

                    }



                }


            }



        }


    }

    function maker2(s) {


        for (var i = 0; i < s.length; i++) {

            if (s[i].SELF_ID != null) {

                s[i].EX = false

            } else s[i].EX = true

        }

        return s.filter(function (el) {
            return el.EX == true
        });



    }

    function ischecked(s) {

        var x = false

        for (var i = 0; i < s.length; i++) {

            if (s[i].ID == perfil) {

                x = true

            }

        }

        return x

    }



    return (
        <React.Fragment>


            {taskEnable(pageAcess, permissoes, "atribuir") == false ? null :


                <Row>
                    <Col sm={12}>
                        <Card>
                            <Card.Body>

                                <Row className='mb-3'>
                                    <Col >
                                        <select className="form-control" onChange={event => { setperfil(event.target.value) }} id="perfil"    >

                                            <option hidden value="">--- Selecione um Perfil ---</option>

                                            {glbperfillist.map(e => (

                                                <option key={e.ID} value={e.ID}>{e.DESIG}</option>

                                            ))}


                                        </select>

                                    </Col>

                                </Row>


                                {perfil != "" && loading == false ?

                                    <Row className='mb-3'>
                                        <Col >
                                            <div className="permissoes_box" >

                                                <Table newdata={newdata} perfil={perfil} uploadlist={uploadlist} />



                                            </div>

                                        </Col>

                                    </Row>

                                    : null}




                            </Card.Body>
                        </Card>






                    </Col>
                </Row>

            }

        </React.Fragment>
    );












};
export default Customers;