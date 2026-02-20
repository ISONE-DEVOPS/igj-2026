import React from "react";
import { Card} from "react-bootstrap";

import logo from '../../../assets/images/logo.png';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import loginimg from '../../../assets/images/login.svg';
import circle from '../../../assets/images/circlelogin2.svg';
import dots from '../../../assets/images/dots.svg';


import JWTLock from './JWTLock';


import useAuth from '../../../hooks/useAuth'


const Signin1 = () => {

    const { lockdata } = useAuth();


    return (
        <React.Fragment>
            <Breadcrumb/>
            <div className="auth-wrapper">

            
                <div className="yellow-div">
                    
                    <h1>Sistema Integrado de Gestão</h1>
                    <img src={loginimg}  alt="pessoas em cartas" />
                    <h1>Inspeção Geral de Jogos</h1>
                  
                        <div className="figures_box">
                            <img src={circle} style={{ opacity: "0.2",top:"-450px",right:"0px",width:"800px",position:"absolute"}} alt="circulo" />
                            <img src={circle} style={{ opacity: "0.2",bottom:"-450px",left:"-350px",width:"800px",position:"absolute"}} alt="circulo2" />

                            <img src={dots} style={{ opacity: "0.3",top:"10px",left:"30px",width:"200px",position:"absolute"}} alt="pontos" />
                            <img src={dots} style={{ opacity: "0.3",bottom:"10px",right:"30px",width:"200px",position:"absolute"}} alt="pontos2" />
                            
                        </div>

                    <div className="auth-content text-center">
                        <Card className="borderless" style={{borderRadius:"20px"}}>
                            <Card.Body>
                                <img style={{backgroundColor:"#d2b32a", width:"130px", height:"130px",marginBottom:"10px",borderRadius: "50%"}} src={lockdata.foto+"?alt=media&token=0"} alt="logo"/>
                                <p  className="mb-2 text-muted" >{lockdata.username}</p>
                                <div style={{marginBottom:"36px"}}></div>
                                <JWTLock />

                            
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Signin1;