import React, { useState, useRef } from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { Formik } from "formik";

import api from "../../../../services/api";
import JoditEditor from "jodit-react";
import FormField from "../../../../components/Custom/FormField";
import { termoEncerramentoSchema } from "../validationSchemas";

const TermoEncerramento = ({
  processo_ID,
  setprocesso_ID,
  uploadlist,
  pessoalist,
  decisaolist,
  isOpenEncerrar,
  setIsOpenEncerrar,
  instrucao_ID,
}) => {
  const editorREF = useRef(null);
  const [editorcontent, seteditorcontent] = useState("");

  const geraText = async (setFieldValue) => {
    try {
      const response = await api.get(`/termo-encerramento/texto`);
      if (response.status == "200" && response.data.OBS) {
        seteditorcontent(response.data.OBS);
        setFieldValue("DESPACHO", response.data.OBS);
      }
    } catch (error) {}
  };

  async function submeterTermoEncerramento(values) {
    var upload = {
      DATA: values.DATA,
      DESPACHO: values.DESPACHO,
      PROCESSO_EXCLUSAO_ID: processo_ID
    };

    try {
      var response = await api.put(
        `/sgigjprocessoexclusao/${instrucao_ID}/termo-encerramento`,
        upload
      );

      if (response.status == "200") {
        toast.success("Termo de Encerramento enviado!", { duration: 4000 });
        uploadlist();
        setIsOpenEncerrar(false);
      } else {
        toast.error("Erro ao enviar Termo de Encerramento", { duration: 4000 });
      }
    } catch (err) {
      console.error(err.response);
      toast.error("Erro ao enviar Termo de Encerramento", { duration: 4000 });
    }
  }

  return (
    <Modal size="xl" show={isOpenEncerrar} onHide={() => setIsOpenEncerrar(false)}>
      <Modal.Header closeButton>
        <Modal.Title as="h5">Termo de Encerramento</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ DATA: "", DESPACHO: "" }}
        validationSchema={termoEncerramentoSchema}
        onSubmit={submeterTermoEncerramento}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched }) => (
          <>
            <Modal.Body className="newuserbox">
              <form id="submeterTermoEncerramento" onSubmit={handleSubmit}>
                <Row>
                  <Col sm={3}>
                    <FormField label="Data" required error={errors.DATA} touched={touched.DATA}>
                      <input
                        type="date"
                        name="DATA"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.DATA}
                        className="form-control"
                        placeholder="Data..."
                      />
                    </FormField>
                  </Col>

                  <Col sm={12}>
                    <FormField label="Despacho" required error={errors.DESPACHO} touched={touched.DESPACHO}>
                      <JoditEditor
                        ref={editorREF}
                        value={editorcontent}
                        config={{ readonly: false }}
                        onChange={function(value) {
                          setFieldValue("DESPACHO", value);
                          setFieldTouched("DESPACHO", true, false);
                        }}
                      />
                    </FormField>
                  </Col>
                </Row>
              </form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger" onClick={() => setIsOpenEncerrar(false)}>
                Fechar
              </Button>
              <Button onClick={() => geraText(setFieldValue)} variant="primary">
                Gerar texto
              </Button>
              <Button
                type="submit"
                form="submeterTermoEncerramento"
                variant="primary"
              >
                Concluir
              </Button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </Modal>
  );
};
export default TermoEncerramento;
