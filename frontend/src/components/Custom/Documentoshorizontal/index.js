import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Pagination,
  Button,
  Modal,
  ListGroup,
} from "react-bootstrap";

import { Link } from "react-router-dom";

import api from "../../../services/api";

import useAuth from "../../../hooks/useAuth";

const Documentos = ({ documentolist, list, save, item, onSendData,hidden, required}) => {
  const { popUp_alertaOK } = useAuth();

  const [docedit, setdocedit] = useState(false);

  var [novosdocumentos, setnovosdocumentos] = useState([
    {
      id: "" + Math.random(),
      tipodocumento: "",
      numero: "",
      dataemissao: "",
      datavalidade: "",
      anexo: { type: 0, file: null },
    },
  ]);

  function addnovosdocumentos() {
    setnovosdocumentos(
      novosdocumentos.concat([
        {
          id: "" + Math.random(),
          tipodocumento: "",
          numero: "",
          dataemissao: "",
          datavalidade: "",
          anexo: { type: 0, file: null },
        },
      ])
    );
    if (onSendData) {
      onSendData(novosdocumentos)
    }

  }

  function removenovosdocumentos(id) {
    if (novosdocumentos.length > 1) {
      const indexx = novosdocumentos.findIndex((x) => x.id === id);
      //console.log(indexx)
      if (indexx > -1) {
        var newArr = novosdocumentos;
        newArr.splice(indexx, 1);
        setnovosdocumentos(newArr.concat([]));
        if (onSendData) {
          onSendData(novosdocumentos)
        }

        setdocedit(true);
      }
    }
  }

  function criartipodoc(tipodoc, id) {
    const indexx = novosdocumentos.findIndex((x) => x.id === id);

    novosdocumentos[indexx] = {
      id: id,

      tipodocumento: tipodoc,

      numero: novosdocumentos[indexx].numero,
      dataemissao: novosdocumentos[indexx].dataemissao,
      datavalidade: novosdocumentos[indexx].datavalidade,
      anexo: novosdocumentos[indexx].anexo,
    };

    setdocedit(true);

    setnovosdocumentos(novosdocumentos.concat([]));
    if (onSendData) {
      onSendData(novosdocumentos)
    }

  }

  function criardocnum(docnum, id) {
    const indexx = novosdocumentos.findIndex((x) => x.id === id);

    novosdocumentos[indexx] = {
      id: id,

      numero: docnum,

      tipodocumento: novosdocumentos[indexx].tipodocumento,
      dataemissao: novosdocumentos[indexx].dataemissao,
      datavalidade: novosdocumentos[indexx].datavalidade,
      anexo: novosdocumentos[indexx].anexo,
    };

    setdocedit(true);

    setnovosdocumentos(novosdocumentos.concat([]));
    if (onSendData) {
      onSendData(novosdocumentos)
    }
  }

  function criardocdataE(docdataE, id) {
    const indexx = novosdocumentos.findIndex((x) => x.id === id);

    novosdocumentos[indexx] = {
      id: id,

      dataemissao: docdataE,

      numero: novosdocumentos[indexx].numero,
      tipodocumento: novosdocumentos[indexx].tipodocumento,
      datavalidade: novosdocumentos[indexx].datavalidade,
      anexo: novosdocumentos[indexx].anexo,
    };

    setdocedit(true);

    setnovosdocumentos(novosdocumentos.concat([]));
    if (onSendData) {
      onSendData(novosdocumentos)
    }

  }

  function criardocdataV(docdataV, id) {
    const indexx = novosdocumentos.findIndex((x) => x.id === id);

    novosdocumentos[indexx] = {
      id: id,

      datavalidade: docdataV,

      numero: novosdocumentos[indexx].numero,
      tipodocumento: novosdocumentos[indexx].tipodocumento,
      dataemissao: novosdocumentos[indexx].dataemissao,
      anexo: novosdocumentos[indexx].anexo,
    };

    setdocedit(true);

    setnovosdocumentos(novosdocumentos.concat([]));
    if (onSendData) {
      onSendData(novosdocumentos)
    }

  }

  function criaranexo(anexo, id,event) {
    const indexx = novosdocumentos.findIndex((x) => x.id === id);

    console.log(novosdocumentos[indexx]);
    console.log(id);

    if (
      novosdocumentos[indexx].tipodocumento == "" 
      //||
      //novosdocumentos[indexx].numero == ""
    ) {
      popUp_alertaOK("Preencha o campos obrigatórios");
      event.target.value =  "";
      return
    }

    novosdocumentos[indexx] = {
      id: id,

      tipodocumento: novosdocumentos[indexx].tipodocumento,
      dataemissao: novosdocumentos[indexx].dataemissao,
      datavalidade: novosdocumentos[indexx].datavalidade,
      numero: novosdocumentos[indexx].numero,
      anexo: { type: 2, file: anexo },
    };

    setdocedit(true);

    setnovosdocumentos(novosdocumentos.concat([]));
    if (onSendData) {
      onSendData(novosdocumentos)
    }

  }

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

      console.log(uploadResponse);
    } catch (err) {
      console.error(err);

      res = {
        status: false,
        file: null,
      };
    }

    return res;
  }

  async function savedata() {
    if (docedit == true) {
      const response2x = await api.delete(
        "/sgigjreldocumento/0?" + item?.ENTIDADE + "=" + item?.ID
      );

      console.log(response2x.status);

      if (response2x.status == "200" || response2x.status == "204") {
        console.log(response2x);

        for (let i = 0; i < novosdocumentos.length; i++) {
          if (
            novosdocumentos[i].tipodocumento != "" &&
            (!hidden && novosdocumentos[i].numero != ""  || hidden)
          ) {
            console.log(novosdocumentos);

            var anexofile = "";

            if (novosdocumentos[i].anexo.type == "1") {
              anexofile = novosdocumentos[i].anexo.file;
            }

            if (novosdocumentos[i].anexo.type == "2") {
              const img = await onFormSubmitImage(
                novosdocumentos[i].anexo.file
              );

              anexofile = img.file.data;
            }

            console.log(anexofile);

            const upload2 = {
              [item?.ENTIDADE]: item?.ID,
              PR_DOCUMENTO_TP_ID: novosdocumentos[i].tipodocumento,
              NUMERO: hidden? 1: novosdocumentos[i].numero,
              DOC_URL: anexofile,
              DT_EMISSAO: novosdocumentos[i].dataemissao,
              DT_VALIDADE: novosdocumentos[i].datavalidade,

            };

            try {
              const response2 = await api.post("/sgigjreldocumento", upload2);
            } catch (err) {
              console.error(err.response);
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    if (list.length == 0) {
      setdocedit(true);

      setnovosdocumentos([
        {
          id: "" + Math.random(),
          tipodocumento: "",
          numero: "",
          dataemissao: "",
          datavalidade: "",
          anexo: { type: 0, file: null },
        },
      ]);

    } else {
      setdocedit(false);

      let listx = [];

      for (let ix = 0; ix < list.length; ix++) {
        const DT_E =
          list[ix].DT_EMISSAO != null
            ? list[ix].DT_EMISSAO.substring(0, 10)
            : "";
        const DT_V =
          list[ix].DT_VALIDADE != null
            ? list[ix].DT_VALIDADE.substring(0, 10)
            : "";

        listx.push({
          id: "" + list[ix].ID,
          tipodocumento: list[ix].PR_DOCUMENTO_TP_ID,
          numero: list[ix].NUMERO,
          dataemissao: DT_E,
          datavalidade: DT_V,
          anexo: { type: 1, file: list[ix].DOC_URL },
        });
      }

      setnovosdocumentos(listx.concat([]));
      if (onSendData) {
        onSendData(novosdocumentos)
      }

    }

    console.log(list);
  }, [list]);

  useEffect(() => {
    console.log("ssssssssssssss" + save);


    if (item.ID != "" && item.ID != null) savedata();
  }, [save]);

  const [indexlist, setindexlist] = useState(0);

  //------------------------------------

  return (
    <>
      <Col style={{ display: "flex", justifyContent: "flex-end" }} sm={12}>
        <Button onClick={() => addnovosdocumentos()} variant="primary">
          +
        </Button>
      </Col>

      {novosdocumentos.map((eq, index) => {
        if (index == indexlist)
          return (
            <Row style={{ marginBottom: "12px" }} key={eq.id}>
              { }

              <Col sm={10}>
                <Row>
                  <Col sm={6}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="Phone">
                        Tipo de Documentos{" "}
                        {required && <span style={{ color: "red" }}>*</span>}
                      </label>
                      <select
                        defaultValue={eq.tipodocumento}
                        onChange={(event) => {
                          criartipodoc(event.target.value, eq.id);
                        }}
                        className="form-control"
                        id="perfil"
                        required={required}
                        aria-required="true"
                      >
                        <option hidden value="">
                          --- Selecione ---
                        </option>

                        {documentolist.map((e) => (
                          <option key={e.ID} value={e.ID}>
                            {e.DESIG}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>
                  {!hidden && <Col sm={3}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="text">
                       Número   {/*<span style={{ color: "red" }}>*</span> */}
                      </label>
                      <input
                        defaultValue={eq.numero}
                        onChange={(event) => {
                          criardocnum(event.target.value, eq.id);
                        }}
                        type="text"
                        className="form-control"
                      />
                    </div>
                  </Col> }

                  <div className="sm-2 paddinhtop28OnlyPC">
                    <label
                      htmlFor={"anexareditar" + eq.id}
                      className="btn"
                      style={{ backgroundColor: "#d2b32a", color: "#fff" }}
                    >
                      {eq?.anexo?.file == null ? (
                        <>
                          <i className="feather icon-download" />
                          <>{" Anexar"}</>
                        </>
                      ) : (
                        "Anexado"
                      )}{" "}
                    </label>
                    <input
                      id={"anexareditar" + eq.id}
                      style={{ display: "none" }}
                      onChange={(event) =>
                        criaranexo(event.target.files[0], eq.id,event)
                      }
                      accept={hidden?undefined:"image/x-png,image/jpeg,.mp4"}
                      type="file"
                    />
                  </div>

                  {!hidden && <Col sm={6}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="date">
                        Data de Emissão
                      </label>
                      <input
                        defaultValue={eq.dataemissao}
                        onChange={(event) => {
                          criardocdataE(event.target.value, eq.id);
                        }}
                        type="date"
                        className="form-control"
                      />
                    </div>
                  </Col>}
                  {!hidden && <Col sm={6}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="text">
                        Data de Validade
                      </label>
                      <input
                        defaultValue={eq.datavalidade}
                        onChange={(event) => {
                          criardocdataV(event.target.value, eq.id);
                        }}
                        type="date"
                        className="form-control"
                      />
                    </div>
                  </Col>
                }
                </Row>
              </Col>

              {novosdocumentos.length > 1 ? (
                <div className="paddinhtop66OnlyPC sm-2">
                  <Button
                    onClick={() => removenovosdocumentos(eq.id)}
                    variant="danger"
                  >
                    <i className="feather icon-trash-2" />
                  </Button>
                </div>
              ) : null}
            </Row>
          );
      })}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination className="justify-content-end">
          <Pagination.First onClick={() => setindexlist(0)} />
          <Pagination.Prev
            onClick={() => setindexlist(indexlist > 0 ? indexlist - 1 : 0)}
          />
          <span
            style={{
              display: "flex",
              padding: "8px 20px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {indexlist + 1}
          </span>
          <Pagination.Next
            onClick={() =>
              setindexlist(
                indexlist >= novosdocumentos.length - 1
                  ? novosdocumentos.length - 1
                  : indexlist + 1
              )
            }
          />
          <Pagination.Last
            onClick={() => setindexlist(novosdocumentos.length - 1)}
          />
        </Pagination>
      </div>
    </>
  );
};
export default Documentos;
