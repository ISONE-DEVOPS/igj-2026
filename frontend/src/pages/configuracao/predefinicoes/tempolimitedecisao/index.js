import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';


import { Link } from 'react-router-dom';


import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";



import api from '../../../../services/api'; 

import useAuth from '../../../../hooks/useAuth';

import { useHistory } from 'react-router-dom';

import { pageEnable, taskEnable, taskEnableIcon, taskEnableTitle } from '../../../../functions';


const pageAcess = "/configuracao/predefinicoes/tempolimitedecisao"




const Customers = () => {


    const { permissoes } = useAuth();

    const history = useHistory();


    const {  popUp_alertaOK } = useAuth();


    const [DIA, setDIA] = useState("");
    const [getDIA, setgetDIA] = useState("");
    const [start, setstart] = useState(false);
    const [button, setbutton] = useState(false);



    async function uploadlist(){

        try {

            const response = await api.get('/glbpredefinicao/dialimitefinalizacao');           

            if(response.status=='200'){ 
                          
                setDIA(response.data[0].DADOS)
                setgetDIA(response.data[0].DADOS)
                setstart(true)

            }

          } catch (err) {

            console.error(err.response)
            
            
          }

    }
   


async function editarItemGO(){



    const upload ={

        DIA: DIA,


    }

    console.log(upload)


    try {

        const response = await api.put('/glbpredefinicao/dialimitefinalizacao',upload);   
        console.log(response)     

        if(response.status=='200'){ 

            uploadlist()
            setbutton(false)

        }

      } catch (err) {
        
        setDIA(getDIA)
        console.error(err.response)
        popUp_alertaOK("Falha. Tente mais tarde")
        
      }

}


//----------------------------------------------






    useEffect(()=> {

        
      if(pageEnable(pageAcess,permissoes)==false) history.push('/')

       else  uploadlist()

    
      },[])


      useEffect(()=> {

        if(start==true) setbutton(true)

      
        },[DIA])





    return (
        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Body>

                        <Row>
                            
                             <div className="col-sm-12">
                                <div className="form-group fill">
                                    
                                </div>
                            </div>

                            <Col sm={3}>
                                <div className="form-group fill">
                                    <label className="floating-label" htmlFor="Address">Tempo limite decisão (dias)</label>
                                    <input  type="number" className="form-control" min="0"   id="Name" value={DIA} onChange={event =>{setDIA(event.target.value)}} required/>
                                </div>
                            </Col>

                         


                            
                        </Row>

                        </Card.Body>

                        {

                            button?

                            <Modal.Footer>
                        
                                <Button onClick={()=>editarItemGO()} variant="primary">Guardar</Button>

                            </Modal.Footer>

                            :true
                        
                        
                        }
                        
                    </Card>

                 



                </Col>
            </Row>
        </React.Fragment>
    );







    

    

    
};
export default Customers;