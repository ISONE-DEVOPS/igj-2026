import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';



export default ({ Open, setOpen, list }) => {

    const [selected, setSelected] = useState(null);

    useEffect(()=> {
        setSelected(null)
    },[list])

    const getMediaUrl = (url) => url ? url + "?alt=media&token=0" : "";

    const isImage = (url) => {
        if(!url) return false;
        const ext = url.substring(url.lastIndexOf('.') + 1)?.toLowerCase();
        return ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif" || ext === "webp" || ext === "bmp";
    };

    const isVideo = (url) => {
        if(!url) return false;
        const ext = url.substring(url.lastIndexOf('.') + 1)?.toLowerCase();
        return ext === "mp4" || ext === "webm" || ext === "ogg" || ext === "mov" || ext === "avi";
    };

    const handleDownload = () => {
        if(selected?.DOC_URL){
            window.open(getMediaUrl(selected.DOC_URL), '_blank');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelected(null);
    };

    return (
        <>
        <Modal size='xl' show={Open} onHide={handleClose}>

            <Modal.Header style={{borderBottom: "1px solid #E9ECEF", padding:"12px 24px", position:"relative"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:"linear-gradient(90deg, #C5A55A, #2B7FB9)"}}></div>
                <Modal.Title style={{fontSize:"16px",fontWeight:600,color:"#2D3436"}}>
                    <i className="feather icon-file-text" style={{marginRight:"8px",color:"#C5A55A"}}/> Anexos
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{padding:"0"}}>
                <Row style={{margin:0, minHeight:"500px"}}>

                    {/* Lista de documentos - sidebar esquerda */}
                    <Col md={3} style={{
                        borderRight: "1px solid #E9ECEF",
                        padding: "16px",
                        background: "#F5F7FA",
                        maxHeight: "600px",
                        overflowY: "auto"
                    }}>
                        <div style={{fontSize:"11px",fontWeight:600,textTransform:"uppercase",color:"#636E72",letterSpacing:"0.5px",marginBottom:"12px"}}>
                            Documentos ({list?.length || 0})
                        </div>
                        {
                            typeof list !== "undefined" ?
                            list.map((e, idx) => (
                                <div
                                    key={e.ID || idx}
                                    onClick={() => setSelected(e)}
                                    style={{
                                        padding: "10px 12px",
                                        marginBottom: "6px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        background: selected === e ? "#FFFFFF" : "transparent",
                                        border: selected === e ? "1.5px solid rgba(43,127,185,0.3)" : "1.5px solid transparent",
                                        boxShadow: selected === e ? "0 1px 4px rgba(43,127,185,0.08)" : "none",
                                        transition: "all 0.15s ease"
                                    }}
                                >
                                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                                        <i className={isImage(e.DOC_URL) ? "feather icon-image" : isVideo(e.DOC_URL) ? "feather icon-video" : "feather icon-file-text"}
                                           style={{fontSize:"16px", color: selected === e ? "#2B7FB9" : "#636E72"}}/>
                                        <span style={{
                                            fontSize:"13px",
                                            fontWeight: selected === e ? 600 : 400,
                                            color: selected === e ? "#2D3436" : "#636E72",
                                            wordBreak: "break-word"
                                        }}>
                                            {e?.sgigjprdocumentotp?.DESIG || "Documento"}
                                        </span>
                                    </div>
                                </div>
                            ))
                            : null
                        }
                    </Col>

                    {/* Preview - área principal */}
                    <Col md={9} style={{padding: "0", display:"flex", flexDirection:"column"}}>
                        {selected?.DOC_URL ? (
                            <>
                                {/* Toolbar */}
                                <div style={{
                                    display:"flex",
                                    alignItems:"center",
                                    justifyContent:"space-between",
                                    padding:"10px 16px",
                                    borderBottom:"1px solid #E9ECEF",
                                    background:"#FAFBFC"
                                }}>
                                    <span style={{fontSize:"13px",fontWeight:500,color:"#2D3436"}}>
                                        <i className="feather icon-eye" style={{marginRight:"6px",color:"#C5A55A"}}/>
                                        {selected?.sgigjprdocumentotp?.DESIG || "Documento"}
                                    </span>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={handleDownload}
                                        style={{display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"12px",borderRadius:"6px"}}
                                    >
                                        <i className="feather icon-download"/> Download
                                    </Button>
                                </div>

                                {/* Conteúdo do preview */}
                                <div style={{flex:1, overflow:"hidden"}}>
                                    {isImage(selected.DOC_URL) ? (
                                        <div style={{
                                            display:"flex",
                                            justifyContent:"center",
                                            alignItems:"center",
                                            height:"100%",
                                            padding:"16px",
                                            background:"#F5F7FA"
                                        }}>
                                            <img
                                                src={getMediaUrl(selected.DOC_URL)}
                                                alt="Preview"
                                                style={{maxWidth:"100%",maxHeight:"500px",borderRadius:"6px",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}
                                            />
                                        </div>
                                    ) : isVideo(selected.DOC_URL) ? (
                                        <div style={{
                                            display:"flex",
                                            justifyContent:"center",
                                            alignItems:"center",
                                            height:"100%",
                                            padding:"16px",
                                            background:"#1a1a1a"
                                        }}>
                                            <video
                                                src={getMediaUrl(selected.DOC_URL)}
                                                controls
                                                style={{maxWidth:"100%",maxHeight:"500px",borderRadius:"6px"}}
                                            >
                                                O seu navegador não suporta a reprodução de vídeo.
                                            </video>
                                        </div>
                                    ) : (
                                        <object
                                            data={getMediaUrl(selected.DOC_URL)}
                                            type="application/pdf"
                                            width='100%'
                                            height='530'
                                            style={{border:"none"}}
                                        >
                                            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"400px",color:"#636E72",gap:"16px"}}>
                                                <i className="feather icon-alert-circle" style={{fontSize:"32px"}}/>
                                                <p style={{margin:0}}>Não foi possível pré-visualizar o documento.</p>
                                                <Button variant="primary" size="sm" onClick={handleDownload}>
                                                    <i className="feather icon-download" style={{marginRight:"6px"}}/> Abrir Documento
                                                </Button>
                                            </div>
                                        </object>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div style={{
                                display:"flex",
                                flexDirection:"column",
                                alignItems:"center",
                                justifyContent:"center",
                                height:"100%",
                                color:"#A0AEC0",
                                padding:"60px 20px"
                            }}>
                                <i className="feather icon-file" style={{fontSize:"48px",marginBottom:"16px"}}/>
                                <p style={{fontSize:"14px",margin:0}}>Selecione um documento para pré-visualizar</p>
                            </div>
                        )}
                    </Col>
                </Row>
            </Modal.Body>

            <Modal.Footer style={{borderTop:"1px solid #E9ECEF",padding:"10px 24px"}}>
                <Button variant="danger" onClick={handleClose}>Fechar</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}
