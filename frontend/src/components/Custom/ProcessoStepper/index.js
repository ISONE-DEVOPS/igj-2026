import React from 'react';

const STEPS = [
  { key: 'grey',   label: 'Criado',      icon: 'feather icon-file-plus' },
  { key: 'green',  label: 'Despacho',    icon: 'feather icon-check-circle' },
  { key: 'orange', label: 'Instrucao',   icon: 'feather icon-clipboard' },
  { key: 'blue',   label: 'Desp. Final', icon: 'feather icon-award' },
  { key: 'black',  label: 'Encerrado',   icon: 'feather icon-lock' },
];

const KEY_INDEX = { grey: 0, green: 1, orange: 2, blue: 3, black: 4 };

const ProcessoStepper = ({ colorx, variant = 'compact' }) => {
  const activeIndex = KEY_INDEX[colorx] !== undefined ? KEY_INDEX[colorx] : 0;
  const cssVariant = variant === 'detail' ? 'processo-stepper--detail' : 'processo-stepper--compact';

  return (
    <div className={`processo-stepper ${cssVariant}`}>
      {STEPS.map((step, idx) => {
        var stepState = 'processo-step--pending';
        if (idx < activeIndex) stepState = 'processo-step--completed';
        if (idx === activeIndex) stepState = 'processo-step--current';

        return (
          <div key={step.key} className={`processo-step ${stepState}`}>
            {variant === 'detail' ? (
              <>
                <div className="processo-step__top">
                  {idx > 0 && <div className="processo-step__connector" />}
                  <div className="processo-step__circle">
                    <i className={step.icon} />
                  </div>
                </div>
                <div className="processo-step__label">{step.label}</div>
              </>
            ) : (
              <>
                {idx > 0 && <div className="processo-step__connector" />}
                <div className="processo-step__circle" title={step.label}>
                  {idx + 1}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProcessoStepper;
