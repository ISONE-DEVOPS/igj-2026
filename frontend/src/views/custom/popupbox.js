import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';


import useAuth from '../../hooks/useAuth';


const Customers = () => {

    const { popUp, popUp_reset } = useAuth();

    

     function close(){

        if (typeof popUp?.function?.nao === "function") {

            console.log("ss")
           // popUp?.function?.nao()
          }

        console.log(popUp?.function)
        popUp_reset()
     }


     async function doit(btn){

        if(btn=="remover-cancelar") {
            popUp_reset()
        } 

        if(btn=="remover-remover") {
            if(popUp?.haveFunction==true){
                if(await popUp?.function?.delete(popUp?.function?.id)==true) popUp_reset()
            }
        } 

        if(btn=="simcancelar-sim") {
            if(popUp?.haveFunction==true){
                if(await popUp?.function?.doit(popUp?.function?.id)==true) popUp_reset()
            }
        } 

        if(btn=="alerta-ok") {
            popUp_reset()
        } 

        if(btn=="simnao-sim") {
            if(popUp?.haveFunction==true){
                if(await popUp?.function?.sim(popUp?.function?.id)==true) popUp_reset()
            }
        } 

        if(btn=="simnao-nao") {
            if(popUp?.haveFunction==true){
                if(await popUp?.function?.nao()==true) popUp_reset()
            }
        }
        

     }
    



    


    return (
    
        <div>

            <Modal size='sm' show={popUp.showpop} onHide={() => close()} aria-labelledby="contained-modal-title-vcenter"  centered>
            

                            

                <Modal.Header>
                    <div style={{display:"flex",width:"100%",justifyContent:"center",paddingBottom:"20px",paddingTop:"20px", alignItems:"center"}}>
                        {popUp.text}
                    </div>
                </Modal.Header>

                    {popUp.type=="alerta"?

                        <div style={{width:"100%",display:"flex"}}>
                            <Button onClick={() => doit("alerta-ok")} style={{width:"100%",borderRadius:"0"}} variant="primary" >Ok</Button>
                        </div>
                    
                    :null}

                    {popUp.type=="simnao"?

                    <div style={{width:"100%",display:"flex"}}>
                        <Button onClick={() => doit("simnao-sim")} style={{width:"100%",borderRadius:"0"}} variant="primary" >Sim</Button>
                        <Button onClick={() => doit("simnao-nao")}style={{width:"100%",borderRadius:"0"}} variant="danger" >Não</Button>
                    </div>

                    :null}

                    {popUp.type=="simcancelar"?

                    <div style={{width:"100%",display:"flex"}}>
                        <Button onClick={() => doit("simcancelar-sim")} style={{width:"100%",borderRadius:"0"}} variant="primary" >Sim</Button>
                        <Button onClick={() => close()} style={{width:"100%",borderRadius:"0"}} variant="danger" >Cancelar</Button>
                    </div>

                    :null}


                    {popUp.type=="remover"?

                    <div style={{width:"100%",display:"flex"}}>
                        <Button onClick={() => doit("remover-remover")} style={{width:"100%",borderRadius:"0"}} variant="danger" >Remover</Button>
                        <Button onClick={() => doit("remover-cancelar")} style={{width:"100%",borderRadius:"0"}} variant="primary" >Cancelar</Button>
                    </div>

                    :null}



            </Modal>

        </div>


    );







    

    

    
};
export default Customers;