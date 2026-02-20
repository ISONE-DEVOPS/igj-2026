import React from 'react';
import toast from 'react-hot-toast';

const FieldConfigPanel = ({ fields, selectedFields, onChange, readonly }) => {
    const selectedCount = selectedFields.length;

    const isFieldSelected = (fieldId) => {
        return selectedFields.some(sf => sf.PR_CAMPOS_ID === fieldId);
    };

    const getFieldData = (fieldId) => {
        return selectedFields.find(sf => sf.PR_CAMPOS_ID === fieldId);
    };

    const handleToggle = (field, checked) => {
        if (checked) {
            const next = [
                ...selectedFields,
                {
                    ID: null,
                    PR_CAMPOS_ID: field.ID,
                    FLAG_OBRIGATORIEDADE: "0",
                    ESTADO: "1",
                    ORDEM: ""
                }
            ];
            onChange(next);
        } else {
            onChange(selectedFields.filter(sf => sf.PR_CAMPOS_ID !== field.ID));
        }
    };

    const handleOrderChange = (fieldId, value) => {
        const order = parseInt(value);
        if (value === "" || isNaN(order)) {
            onChange(selectedFields.map(sf =>
                sf.PR_CAMPOS_ID === fieldId ? { ...sf, ORDEM: "" } : sf
            ));
            return;
        }
        if (order >= 1 && order <= 99) {
            onChange(selectedFields.map(sf =>
                sf.PR_CAMPOS_ID === fieldId ? { ...sf, ORDEM: order.toString() } : sf
            ));
        } else {
            toast.error("Escolha um número entre 1 e 99", { duration: 3000 });
        }
    };

    const handleObrigToggle = (fieldId) => {
        onChange(selectedFields.map(sf => {
            if (sf.PR_CAMPOS_ID === fieldId) {
                return { ...sf, FLAG_OBRIGATORIEDADE: sf.FLAG_OBRIGATORIEDADE === "1" ? "0" : "1" };
            }
            return sf;
        }));
    };

    // View mode: show only selected fields sorted by order
    if (readonly) {
        const sortedFields = [...selectedFields]
            .sort((a, b) => (parseInt(a.ORDEM) || 0) - (parseInt(b.ORDEM) || 0));

        if (sortedFields.length === 0) {
            return (
                <div className="text-center py-3">
                    <span style={{ color: '#636E72', fontSize: 13 }}>Nenhum campo configurado</span>
                </div>
            );
        }

        return (
            <div className="field-config-panel">
                {sortedFields.map((sf, idx) => {
                    const fieldInfo = fields.find(f => f.ID === sf.PR_CAMPOS_ID);
                    return (
                        <div key={idx} className="field-view-row">
                            <span className="field-order">{sf.ORDEM || '-'}</span>
                            <span className="field-name">{fieldInfo?.DESIG || sf.PR_CAMPOS_ID}</span>
                            <span className={`obrig-tag ${sf.FLAG_OBRIGATORIEDADE === "1" ? 'sim' : 'nao'}`}>
                                {sf.FLAG_OBRIGATORIEDADE === "1" ? 'Obrigatório' : 'Opcional'}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="field-config-panel">
            <div className="section-label">
                <i className="feather icon-layers" />
                Campos do Ecrã
                <span className="field-counter">{selectedCount} de {fields.length} selecionados</span>
            </div>

            {fields.map((field, idx) => {
                const active = isFieldSelected(field.ID);
                const fieldData = getFieldData(field.ID);

                return (
                    <div key={field.ID || idx} className={`field-row ${active ? 'active' : ''}`}>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={active}
                                onChange={(e) => handleToggle(field, e.target.checked)}
                            />
                            <span className="slider" />
                        </label>

                        <span className="field-name">{field.DESIG}</span>

                        <div className="field-controls">
                            <span className="order-label">Ordem:</span>
                            <input
                                type="number"
                                className="order-input"
                                min="1"
                                max="99"
                                value={fieldData?.ORDEM || ""}
                                onChange={(e) => handleOrderChange(field.ID, e.target.value)}
                                placeholder="-"
                            />

                            <button
                                type="button"
                                className={`obrig-badge ${fieldData?.FLAG_OBRIGATORIEDADE === "1" ? 'active' : 'inactive'}`}
                                onClick={() => handleObrigToggle(field.ID)}
                                title={fieldData?.FLAG_OBRIGATORIEDADE === "1" ? 'Clique para tornar opcional' : 'Clique para tornar obrigatório'}
                            >
                                {fieldData?.FLAG_OBRIGATORIEDADE === "1" ? 'Obrig.' : 'Opcional'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FieldConfigPanel;
