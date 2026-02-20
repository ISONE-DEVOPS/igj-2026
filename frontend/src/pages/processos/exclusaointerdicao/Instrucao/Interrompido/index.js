import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import api from "../../../../../services/api";
import useAuth from "../../../../../hooks/useAuth";

const Customers = ({
  uploadlist,
  voltar,
  InterrompidoTipo,
  setInterrompidoTipo,
  INSTRUCAO_ID,
}) => {
  const [isDepachoOpen, setIsDepachoOpen] = useState(false);
  const [OBS, setOBS] = useState("");
  const { popUp_alertaOK } = useAuth();
  const [documentList, setDocumentList] = useState([]);
  const [useThisDoc, setUseThisDoc] = useState(-1);
  const [novosDocumentos, setNovosDocumentos] = useState([
    {
      id: Date.now(),
      tipodocumento: "",
      numero: "",
      dataemissao: "",
      datavalidade: "",
      anexo: { type: 0, file: null },
      main: "",
    },
  ]);
  const [docEdit, setDocEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsDepachoOpen(InterrompidoTipo !== "");
    uploaddocumentolist();
  }, [InterrompidoTipo]);

  async function uploaddocumentolist() {
    try {
      const response = await api.get("/sgigjprdocumentotp");

      if (response.status == "200") {
        setDocumentList(response.data);
      }
    } catch (err) {
      console.error(err.response);
    }
  }

  const handleAddDocumento = () => {
    setNovosDocumentos([
      ...novosDocumentos,
      {
        id: Date.now(),
        tipodocumento: "",
        numero: "",
        dataemissao: "",
        datavalidade: "",
        anexo: { type: 0, file: null },
        main: "",
      },
    ]);
  };

  const handleRemoveDocumento = (id) => {
    if (novosDocumentos.length > 1) {
      setNovosDocumentos(novosDocumentos.filter((doc) => doc.id !== id));
    }
  };

  const handleUpdateDocumento = (id, field, value) => {
    setNovosDocumentos((prevDocs) =>
      prevDocs.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc))
    );
    setDocEdit(true);
  };

  const handleSetAnexo = (id, file) => {
    const doc = novosDocumentos.find((doc) => doc.id === id);
    if (!doc.tipodocumento || !doc.numero) {
      popUp_alertaOK("Preencha os campos obrigatórios");
      return;
    }
    handleUpdateDocumento(id, "anexo", { type: 2, file });
  };

  async function onFormSubmitImage(thumnail) {
    var res = {
      status: false,
      file: null,
    };
    try {
      const formData = new FormData();

      formData.append("file", thumnail);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      const uploadResponse = await api.post("/upload", formData, config);

      res = {
        status: true,
        file: uploadResponse,
      };
    } catch (err) {
      console.error(err.response);
      res = {
        status: false,
        file: null,
      };
    }

    return res;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isDocIdentification = false;
    let docs = [];
    try {
      for (let i = 0; i < novosDocumentos.length; i++) {
        console.log("pkoko", novosDocumentos[i]);
        if (
          !novosDocumentos[i].anexo ||
          novosDocumentos[i].anexo.file == null
        ) {
          popUp_alertaOK("Por favor anexa documento");
          return;
        }

        let tipodocumento = documentList.find(
          (res) => res.ID === novosDocumentos[i].tipodocumento
        );
        if (tipodocumento.IDENTIFICACAO === 1) {
          if (
            novosDocumentos[i].datavalidade == "" ||
            novosDocumentos[i].numero == "" ||
            novosDocumentos[i].dataemissao == ""
          ) {
            isDocIdentification = true;

            continue;
          }
        }

        if (
          novosDocumentos[i].tipodocumento != "" &&
          novosDocumentos[i].numero != ""
        ) {
          var anexofile = "";

          if (novosDocumentos[i].anexo.type == "1") {
            anexofile = novosDocumentos[i].anexo.file;
          }

          if (novosDocumentos[i].anexo.type == "2") {
            const img = await onFormSubmitImage(novosDocumentos[i].anexo.file);

            anexofile = img.file.data;
          }

          const upload2 = {
            PR_DOCUMENTO_TP_ID: novosDocumentos[i].tipodocumento,
            NUMERO: novosDocumentos[i].numero,
            DOC_URL: anexofile,
            DT_EMISSAO: novosDocumentos[i].dataemissao,
            DT_VALIDADE: novosDocumentos[i].datavalidade,
            ESTADO: "1",
            MAIN: novosDocumentos[i].main,
          };
          docs.push(upload2);
          if (isDocIdentification) {
            setIsLoading(false);
            popUp_alertaOK(
              "Preenche os campos que representam um documento de identificação"
            );
            break;
          }
        }
      }
      try {
        const response = await api.put(
          `/sgigjrelprocessoinstrucao/${INSTRUCAO_ID}/interrompido`,
          { OBS, TIPO: InterrompidoTipo, documentos: docs }
        );

        if (response.status === 200) {
          setInterrompidoTipo("");
          uploadlist();
          voltar();
        }
      } catch (err) {
        console.error(err.response);
      }
    } catch (err) {
      console.error(err.response);
    }
  };

  return (
    <Modal
      size="lg"
      show={isDepachoOpen}
      onHide={() => setIsDepachoOpen(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">
          {InterrompidoTipo === "A" ? "Arquivar" : "Prescrever"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form id="GO" onSubmit={handleSubmit}>
          <Row>
            <Col sm={12}>
              <Form.Group>
                <Form.Label>
                  Justificação <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  style={{ height: "250px" }}
                  required
                  value={OBS}
                  onChange={(e) => setOBS(e.target.value)}
                  placeholder="Justificação..."
                />
              </Form.Group>
            </Col>
          </Row>
          {novosDocumentos.map((doc, index) => {
            const selectedDocType = documentList.find(
              (d) => d.ID === parseInt(doc.tipodocumento, 10)
            );
            const isIdentification = selectedDocType?.IDENTIFICACAO === 1;

            return (
              <Row key={doc.id} className="mb-3">
                <Col sm={12}>
                  <Row>
                    <Col sm={4}>
                      <Form.Group>
                        <Form.Label>
                          Tipo de Documento{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="select"
                          required
                          onChange={(e) =>
                            handleUpdateDocumento(
                              doc.id,
                              "tipodocumento",
                              e.target.value
                            )
                          }
                        >
                          <option hidden value="">
                            --- Selecione ---
                          </option>
                          {documentList.map((e) => (
                            <option key={e.ID} value={e.ID}>
                              {e.DESIG}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col sm={4}>
                      <Form.Group>
                        <Form.Label>
                          Número <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          onChange={(e) =>
                            handleUpdateDocumento(
                              doc.id,
                              "numero",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col
                      sm={4}
                      className="d-flex"
                      style={{ alignItems: "center", paddingTop: "20px" }}
                    >
                      <Button
                        style={{ backgroundColor: "#d2b32a", color: "#fff" }}
                        as="label"
                        htmlFor={`anexar${doc.id}`}
                      >
                        {" "}
                        {doc.anexo.file ? "Anexado" : "Anexar"}{" "}
                      </Button>
                      <Form.Control
                        type="file"
                        id={`anexar${doc.id}`}
                        style={{ display: "none" }}
                        accept="image/png,image/jpeg"
                        onChange={(e) =>
                          handleSetAnexo(doc.id, e.target.files[0])
                        }
                      />
                      <Form.Check
                        style={{ marginLeft: "10px", paddingTop: "-100px" }}
                        inline
                        type="radio"
                        name="documento"
                        onChange={() => setUseThisDoc(index)}
                        label="Usar este"
                      />
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>
                          Data de Emissão{" "}
                          {isIdentification && (
                            <span className="text-danger">*</span>
                          )}
                        </Form.Label>
                        <Form.Control
                          type="date"
                          required={isIdentification}
                          onChange={(e) =>
                            handleUpdateDocumento(
                              doc.id,
                              "dataemissao",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>
                          Data de Validade{" "}
                          {isIdentification && (
                            <span className="text-danger">*</span>
                          )}
                        </Form.Label>
                        <Form.Control
                          type="date"
                          required={isIdentification}
                          onChange={(e) =>
                            handleUpdateDocumento(
                              doc.id,
                              "datavalidade",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                {novosDocumentos.length > 1 && (
                  <Col sm={2} className="d-flex align-items-center">
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveDocumento(doc.id)}
                    >
                      <i className="feather icon-trash-2" />
                    </Button>
                  </Col>
                )}
              </Row>
            );
          })}
          <Button variant="secondary" onClick={handleAddDocumento}>
            Adicionar Documento
          </Button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="GO" variant="primary">
          {InterrompidoTipo === "A" ? "Arquivar" : "Prescrever"}
        </Button>
        <Button variant="danger" onClick={() => setIsDepachoOpen(false)}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Customers;
