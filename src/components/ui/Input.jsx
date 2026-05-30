import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon, className = '', ...props }, ref) => {
  return (
    <div className={`input-group ${error ? 'input-error' : ''} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input ref={ref} className="input-field" {...props} />
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
