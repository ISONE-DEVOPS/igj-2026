import React from 'react';

var MARKER_CLASSES = {
  criacao: 'processo-timeline__marker--criacao',
  despacho: 'processo-timeline__marker--despacho',
  instrucao: 'processo-timeline__marker--instrucao',
  final: 'processo-timeline__marker--final',
  encerrado: 'processo-timeline__marker--encerrado',
};

var ICONS = {
  criacao: 'feather icon-file-plus',
  despacho: 'feather icon-check-circle',
  instrucao: 'feather icon-clipboard',
  final: 'feather icon-award',
  encerrado: 'feather icon-lock',
};

function buildEvents(processo) {
  var events = [];

  // 1. Criacao
  events.push({
    type: 'criacao',
    title: 'Pedido Criado',
    date: processo.DATA2,
    desc: processo.DESCR || '',
    doc: processo.URL_DOC_GERADO,
    completed: true,
  });

  // 2. Despacho Inicial
  if (processo.despacho) {
    var d = processo.despacho;
    var parts = [];
    if (d.REFERENCIA) parts.push('Ref: ' + d.REFERENCIA);
    if (d.PRAZO) parts.push('Prazo: ' + d.PRAZO);
    if (d.INSTRUTOR) parts.push('Instrutor: ' + d.INSTRUTOR);

    events.push({
      type: 'despacho',
      title: 'Despacho Inicial',
      date: d.DATA,
      desc: parts.join(' | '),
      doc: d.DOC,
      completed: true,
    });
  }

  // 3. Instrucao (pecas)
  if (processo.instrucao && processo.instrucao.list && processo.instrucao.list.length > 0) {
    var pecas = processo.instrucao.list.map(function(e) {
      return e?.sgigjprpecasprocessual?.DESIG || 'Peça';
    });

    events.push({
      type: 'instrucao',
      title: 'Instrução',
      date: '',
      desc: pecas.join(', '),
      completed: true,
    });
  }

  // 4. Despacho Final
  if (processo.despachofinal) {
    var df = processo.despachofinal;
    events.push({
      type: 'final',
      title: 'Despacho Final',
      date: df.DATA,
      desc: df.DESICAO ? 'Decisão: ' + df.DESICAO : '',
      doc: df.DOC,
      completed: true,
    });
  }

  return events;
}

var ProcessoTimeline = function({ processo }) {
  if (!processo) return null;

  var events = buildEvents(processo);

  if (events.length === 0) return null;

  return (
    <div className="processo-timeline">
      {events.map(function(evt, idx) {
        var isLast = idx === events.length - 1;

        return (
          <div key={idx} className="processo-timeline__event">
            <div className="processo-timeline__marker-wrap">
              <div className={'processo-timeline__marker ' + (MARKER_CLASSES[evt.type] || '')}>
                <i className={ICONS[evt.type] || 'feather icon-circle'} />
              </div>
              {!isLast && (
                <div className={'processo-timeline__line processo-timeline__line--completed'} />
              )}
            </div>

            <div className="processo-timeline__card">
              {evt.date && (
                <div className="processo-timeline__date">{evt.date}</div>
              )}
              <div className="processo-timeline__title">{evt.title}</div>
              {evt.desc && (
                <div className="processo-timeline__desc">{evt.desc}</div>
              )}
              {evt.doc && (
                <a
                  className="processo-timeline__doc-link"
                  href={evt.doc + '?alt=media&token=0'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="feather icon-external-link" />
                  Abrir Documento
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProcessoTimeline;
