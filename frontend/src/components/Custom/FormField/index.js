import React from 'react';

const FormField = ({ label, required, error, touched, children, className }) => {
  var showError = touched && error;

  return (
    <div className={`form-field ${className || ''}`}>
      {label && (
        <label className="form-field__label">
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}
      {React.Children.map(children, function(child) {
        if (!child) return child;
        if (typeof child.type === 'string' || child.props) {
          var extraClass = '';
          if (showError) extraClass = 'field-invalid';
          else if (touched && !error) extraClass = 'field-valid';

          if (child.props && child.props.className) {
            return React.cloneElement(child, {
              className: child.props.className + ' ' + extraClass
            });
          }
          return child;
        }
        return child;
      })}
      {showError && (
        <div className="form-field__error">
          <i className="feather icon-alert-circle" style={{ fontSize: 11 }} />
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;
