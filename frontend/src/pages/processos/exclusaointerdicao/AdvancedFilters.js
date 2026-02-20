import React from 'react';
import StatusBadge from '../../../components/Custom/StatusBadge';

var STATUS_OPTIONS = ['grey', 'green', 'orange', 'blue', 'black'];

var AdvancedFilters = function({ isOpen, onToggle, activeStatuses, onStatusToggle, dataDe, dataAte, onDateDeChange, onDateAteChange, onClear }) {
  var hasFilters = activeStatuses.length > 0 || dataDe || dataAte;

  return (
    <>
      <button
        type="button"
        className={'advanced-filters__toggle' + (isOpen ? ' advanced-filters__toggle--open' : '')}
        onClick={onToggle}
      >
        <i className="feather icon-filter" />
        Filtros
        {hasFilters && <span style={{ marginLeft: 4, color: '#2B7FB9', fontWeight: 700 }}>({activeStatuses.length + (dataDe ? 1 : 0) + (dataAte ? 1 : 0)})</span>}
        <i className="feather icon-chevron-down" />
      </button>

      <div className={'advanced-filters' + (isOpen ? ' advanced-filters--open' : '')}>
        <div className="advanced-filters__body">
          <div className="advanced-filters__group">
            <span className="advanced-filters__label">Estado</span>
            <div className="advanced-filters__status-row">
              {STATUS_OPTIONS.map(function(colorx) {
                var isActive = activeStatuses.indexOf(colorx) !== -1;
                return (
                  <div
                    key={colorx}
                    className={'filter-status-btn' + (isActive ? ' filter-status-btn--active' : '')}
                    onClick={function() { onStatusToggle(colorx); }}
                  >
                    <StatusBadge colorx={colorx} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="advanced-filters__group">
            <span className="advanced-filters__label">De</span>
            <input
              type="date"
              className="form-control form-control-sm"
              value={dataDe}
              onChange={function(e) { onDateDeChange(e.target.value); }}
              style={{ width: 150 }}
            />
          </div>

          <div className="advanced-filters__group">
            <span className="advanced-filters__label">Até</span>
            <input
              type="date"
              className="form-control form-control-sm"
              value={dataAte}
              onChange={function(e) { onDateAteChange(e.target.value); }}
              style={{ width: 150 }}
            />
          </div>

          {hasFilters && (
            <button type="button" className="advanced-filters__clear" onClick={onClear}>
              <i className="feather icon-x" style={{ marginRight: 3 }} />
              Limpar
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AdvancedFilters;
