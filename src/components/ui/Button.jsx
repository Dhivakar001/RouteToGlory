import { forwardRef } from 'react';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  gold: 'btn-gold',
};

const sizes = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

const Button = forwardRef(({ children, variant = 'primary', size = 'md', className = '', disabled, loading, icon, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`btn ${variants[variant]} ${sizes[size]} ${loading ? 'btn-loading' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn-spinner" />}
      {icon && !loading && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
