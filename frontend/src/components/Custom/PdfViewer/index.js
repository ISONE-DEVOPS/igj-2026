import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const getMediaUrl = (url) => {
    if (!url) return "";
    return url.includes("?") ? url : url + "?alt=media&token=0";
};

const PdfViewer = ({ show, onHide, url, title }) => {

    const handleDownload = () => {
        if (url) window.open(getMediaUrl(url), '_blank');
    };

    return (
        <Modal size='xl' show={show} onHide={onHide}>
            <Modal.Header style={{ borderBottom: "1px solid #E9ECEF", padding: "12px 24px", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #C5A55A, #2B7FB9)" }}></div>
                <Modal.Title style={{ fontSize: "16px", fontWeight: 600, color: "#2D3436", display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="feather icon-file-text" style={{ color: "#C5A55A" }} />
                    {title || "Documento"}
                </Modal.Title>
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleDownload}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", borderRadius: "6px" }}
                >
                    <i className="feather icon-download" /> Download
                </Button>
            </Modal.Header>

            <Modal.Body style={{ padding: 0 }}>
                {url ? (
                    <object
                        data={getMediaUrl(url)}
                        type="application/pdf"
                        width="100%"
                        height="700"
                        style={{ border: "none", display: "block" }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "400px", color: "#636E72", gap: "16px" }}>
                            <i className="feather icon-alert-circle" style={{ fontSize: "32px" }} />
                            <p style={{ margin: 0 }}>Não foi possível pré-visualizar o documento.</p>
                            <Button variant="primary" size="sm" onClick={handleDownload}>
                                <i className="feather icon-download" style={{ marginRight: "6px" }} /> Abrir Documento
                            </Button>
                        </div>
                    </object>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "400px", color: "#A0AEC0" }}>
                        <i className="feather icon-file" style={{ fontSize: "48px", marginBottom: "16px" }} />
                        <p style={{ fontSize: "14px", margin: 0 }}>Nenhum documento disponível</p>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer style={{ borderTop: "1px solid #E9ECEF", padding: "10px 24px" }}>
                <Button variant="danger" onClick={onHide}>Fechar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PdfViewer;
