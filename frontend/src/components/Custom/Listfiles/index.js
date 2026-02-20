import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';



export default ({ Open, setOpen, list }) => {

    const [imgprev, setimgprev] = useState("");
    const [pdfprev, setpdfprev] = useState("");


    useEffect(()=> { 
        console.log("ROberto",list)
        setimgprev("")

      },[list])


    return (
        <>

        <Modal size='lg' show={Open} onHide={() => setOpen(false)}>
      

            <Modal.Body>
                <Row>
                


                <Col xl={12} className='task-detail-right'>
                    

                 
                    <div style={{width:"100%",display:"flex",justifyContent:"spaceAround"}}> 
                    
                      

                        <span 
                            
                            style={{paddingBottom:"4px", cursor:"pointer", borderBottom: "2px solid #d2b32a",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}
                            
                            ><i className="feather icon-file-text m-r-5"/>Anexos</span>

                       

                        
                    </div >

                   


                    <div style={{
                        width:"100%",
                        height:"500px",
                    }}>

                            <div style={{
                                width:"100%",
                                borderBottom: "1px solid #d2b32a",
                                paddingTop:"20px",
                                paddingBottom:"20px",
                                marginBottom:"20px",
                                overflow:"auto",
                                height:"70px"
                            }}>
                            

                                        
                            {
                                typeof list!="undefined"?
                                
                                list.map(e=>(
                                    
                                    <Link onClick={()=>{
                                        debugger
                                        e.DOC_URL?.substring(e.DOC_URL?.lastIndexOf('.') + 1) == "PDF" || e.DOC_URL?.substring(e.DOC_URL?.lastIndexOf('.') + 1) == "pdf"?
                                         setpdfprev(e.DOC_URL)
                                         :
                                        setimgprev(e.DOC_URL)}} key={e.ID} style={{margin:"2px"}} to='#' className="mb-1 text-muted d-flex align-items-end text-h-primary">{"::"+e?.sgigjprdocumentotp?.DESIG}</Link>
                                    
                                ))
                                
                                :null
                                
                            }


                            </div>



                            <div style={{width:"100%",display:imgprev ? "flex" : "none",justifyContent:"center",marginBottom:"10px"}}> 
                
                                <span><i className="feather icon-eye m-r-5"/>Pré-vizualização</span>
                                
                            </div>

                            <a style={{ display: imgprev ? 'block' : 'none' }} href={imgprev+"?alt=media&token=0"} target="_blank" rel="noopener noreferrer" ><div className={imgprev==""?'previewdoc':"previewdoc-img"} style={{backgroundImage:"url(\""+imgprev+"?alt=media&token=0\")",height:"350px"}}>
                            
                            </div></a>

                        
                            

                        </div> 




                        
                        
               
            </Col>
        </Row>
            </Modal.Body>

            

            <Modal.Footer>
                <Button variant="danger" onClick={() => setOpen(false)}>Fechar</Button>
            </Modal.Footer>
        </Modal>
        <Modal size='xl' show={pdfprev} onHide={() => {setpdfprev(null); setTimeout(()=>setOpen(true),150)}}>

<iframe
    height={1000}
    src={pdfprev+"?alt=media&token=0"}
    title='pdf-viewer'
    width='100%s'
></iframe>


</Modal>



                            </>
    )
}



