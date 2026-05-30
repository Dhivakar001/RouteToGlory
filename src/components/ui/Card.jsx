export default function Card({ children, className = '', padding = 'md', hover = false, ...props }) {
  const paddings = { none: '', sm: 'card-sm', md: 'card-md', lg: 'card-lg' };
  return (
    <div className={`card ${paddings[padding]} ${hover ? 'card-hover' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}
