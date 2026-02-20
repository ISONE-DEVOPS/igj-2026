import React from 'react';

const STATUS_MAP = {
  grey:   { label: 'Criado',         className: 'status-badge--criado' },
  green:  { label: 'Desp. Inicial',  className: 'status-badge--despacho' },
  orange: { label: 'Instrucao',      className: 'status-badge--instrucao' },
  blue:   { label: 'Desp. Final',    className: 'status-badge--final' },
  black:  { label: 'Encerrado',      className: 'status-badge--encerrado' },
};

const StatusBadge = ({ colorx }) => {
  const status = STATUS_MAP[colorx] || STATUS_MAP.grey;

  return (
    <span className={`status-badge ${status.className}`}>
      <span className="status-badge__dot" />
      <span>{status.label}</span>
    </span>
  );
};

export default StatusBadge;
