import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../../../services/api';
import gtm from '../../../../services/gtm';



import  moment from 'moment-timezone';

export default () => {



    const [Open, setOpen] = useState(false)
    const [list, setList] = useState([])






                

    async function uploadtempolimite(){


        const dataagora = moment().tz(gtm)



        try {

            const response = await api.get('/tempolimiteprocessoexclusao');           



            if(response.status=='200'){ 


                console.log(response.data.prazovisado.length)
               
                if(response.data.prazolimite.length>0||response.data.prazovisado.length>0) {

                    
                    let newlist = []


                    

                    console.log(newlist)

                    

                    for (let i2 = 0; i2 < response.data.prazovisado.length; i2++) {


                        const element = response.data.prazovisado[i2]
                        const subelement = element?.sgigjprocessodespacho[0]?.sgigjrelprocessoinstrutor[0]?.sgigjrelprocessoinstrucao[0]?.sgigjrelinstrutorpeca

                        for (let i3 = 0; i3 < subelement.length; i3++) {

                            if(subelement[i3].PR_PECAS_PROCESSUAIS_ID=="0a2557ff1b8e966ae041183b8bbcb4d2ce1d") {
                                
                               

                                    const dataprocesso = ""+subelement[i3].DT_REGISTO
                                    const prazo = dataagora.diff(moment(dataprocesso.slice(0,10)).tz(gtm), 'days')
                                   

                                    if(prazo>0) {

                                        newlist.push({
                                            ID:element.ID,
                                            CODIGO:element.CODIGO,
                                            VISADO:element.sgigjpessoa.NOME,
                                            PRAZO:prazo
                                        })

                                    }
                                    

                                
                                



                            }
                            

                        }

                    }




                    for (let i = 0; i < response.data.prazolimite.length; i++) {

                        const element = response.data.prazolimite[i]
                        const subelement = element?.sgigjprocessodespacho[0]

                        if(!(newlist.find(o => o.ID === element.ID)?.ID == element.ID)) {


                            const dataprocesso = ""+subelement.DATA
                            const prazo = dataagora.diff(moment(dataprocesso.slice(0,10)).tz(gtm), 'days')

                            if(prazo>0) {

                                newlist.push({
                                    ID:element.ID,
                                    CODIGO:element.CODIGO,
                                    VISADO:element.sgigjpessoa.NOME,
                                    PRAZO:prazo
                                })

                            }


                        }

                        console.log(subelement.DATA)

                        


                    }
                    
                    if(newlist.length>0) {
                        
                        setList(newlist)
                        setOpen(true)
                    }
                    



                }




            }






        } catch (err) {

            console.error(err.response)
            
            
        }

    }




    useEffect(() => {

        uploadtempolimite()

    
        
    }, [])



    return (
        


        <Modal size='g' show={Open} onHide={() => setOpen(false)}>
      

                         <Modal.Header closeButton>
                            <Modal.Title  as="h5">Prazo</Modal.Title>
                        </Modal.Header>
                      
                      {
                          list.map(e=>(

                            <Modal.Body key={e?.ID} className="newuserbox" style={{paddingBottom:"0px"}} >
                     

                                <Row style={{width:"100%",overflow:"auto"}}> 
                                        <Col sm={4}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Referência</label>
                                                <span style={{overflow:"auto",height:"auto", minHeight: "33px"}} className="form-control">{e?.REF}</span>
                                            </div>
                                        </Col>

                                        <Col sm={5}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Visado</label>
                                                <span style={{overflow:"auto",height:"auto", minHeight: "33px"}} className="form-control">{e?.VISADO}</span>
                                            </div>
                                        </Col>

                                        <Col sm={3}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="Name">Prazo</label>
                                                <span style={{overflow:"auto",height:"auto", minHeight: "33px"}} className="form-control">{e?.PRAZO}</span>
                                            </div>
                                        </Col>



                                        
                                    </Row>



                                </Modal.Body>
                              
                          ))
                      }
                      
                      




                       


                    </Modal>


    )
}



