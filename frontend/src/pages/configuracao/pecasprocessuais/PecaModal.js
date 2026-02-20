import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import JoditEditor from 'jodit-react';
import FieldConfigPanel from './FieldConfigPanel';

const TITLES = {
    criar: 'Criar Peça Processual',
    editar: 'Editar Peça Processual',
    ver: 'Visualizar Peça Processual'
};

const PecaModal = ({ show, mode, item, fields, onHide, onSave }) => {
    const editorRef = useRef(null);
    const [desig, setDesig] = useState('');
    const [obs, setObs] = useState('');
    const [selectedFields, setSelectedFields] = useState([]);

    // Reset form when modal opens or item changes
    useEffect(() => {
        if (show) {
            if (mode === 'criar') {
                setDesig('');
                setObs('');
                setSelectedFields([]);
            } else if (item) {
                setDesig(item.DESIG || '');
                setObs(item.OBS || '');
                const campos = (item.sgigjrelpecaprocessualcampo || []).map(c => ({
                    ID: c.ID,
                    PR_CAMPOS_ID: c.PR_CAMPOS_ID,
                    FLAG_OBRIGATORIEDADE: c.FLAG_OBRIGATORIEDADE,
                    ESTADO: c.ESTADO,
                    ORDEM: c.ORDEM ? c.ORDEM.toString() : ''
                }));
                setSelectedFields(campos);
            }
        }
    }, [show, mode, item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const editorValue = editorRef?.current?.value || obs;

        if (mode === 'criar') {
            onSave({
                PECA: {
                    DESIG: desig,
                    OBS: editorValue,
                    ESTADO: "1"
                },
                CAMPOS: selectedFields
            });
        } else if (mode === 'editar') {
            onSave({
                DESIG: desig,
                OBS: editorValue,
                ESTADO: "1",
                CAMPOS: selectedFields
            });
        }
    };

    const isReadonly = mode === 'ver';

    return (
        <Modal
            size="xl"
            show={show}
            onHide={onHide}
            className="peca-modal"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title as="h5">{TITLES[mode] || 'Peça Processual'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form id="pecaForm" onSubmit={handleSubmit}>
                    {/* Secção 1: Dados Gerais */}
                    <div className="section-label">
                        <i className="feather icon-file-text" />
                        Dados Gerais
                    </div>

                    <Row>
                        <Col sm={3}>
                            <div className="form-group fill">
                                <label className="floating-label">Código</label>
                                {isReadonly ? (
                                    <span className="view-value">{item?.CODIGO || '-'}</span>
                                ) : (
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={mode === 'editar' ? (item?.CODIGO || '') : '*'}
                                        disabled
                                    />
                                )}
                            </div>
                        </Col>
                        <Col sm={9}>
                            <div className="form-group fill">
                                <label className="floating-label">
                                    Designação {!isReadonly && <span style={{ color: '#E74C3C' }}>*</span>}
                                </label>
                                {isReadonly ? (
                                    <span className="view-value">{item?.DESIG || '-'}</span>
                                ) : (
                                    <input
                                        type="text"
                                        className="form-control"
                                        maxLength="128"
                                        value={desig}
                                        onChange={(e) => setDesig(e.target.value)}
                                        placeholder="Designação da peça processual..."
                                        required
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12}>
                            <div className="form-group fill">
                                <label className="floating-label">Descrição</label>
                                {isReadonly ? (
                                    <div
                                        className="view-html"
                                        dangerouslySetInnerHTML={{ __html: item?.OBS || '<em>Sem descrição</em>' }}
                                    />
                                ) : (
                                    <JoditEditor
                                        value={obs}
                                        config={{ readonly: false }}
                                        ref={editorRef}
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>

                    {/* Secção 2: Campos do Ecrã */}
                    <div className="mt-3">
                        {isReadonly ? (
                            <>
                                <div className="section-label">
                                    <i className="feather icon-layers" />
                                    Campos Configurados
                                    {selectedFields.length > 0 && (
                                        <span className="field-counter">{selectedFields.length} campos</span>
                                    )}
                                </div>
                                <FieldConfigPanel
                                    fields={fields}
                                    selectedFields={selectedFields}
                                    onChange={() => {}}
                                    readonly
                                />
                            </>
                        ) : (
                            <FieldConfigPanel
                                fields={fields}
                                selectedFields={selectedFields}
                                onChange={setSelectedFields}
                            />
                        )}
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Fechar
                </Button>
                {!isReadonly && (
                    <Button type="submit" form="pecaForm" variant="primary">
                        <i className="feather icon-save mr-1" />
                        Guardar
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default PecaModal;
