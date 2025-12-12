export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  ...props 
}) {
  const baseClasses = 'font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105';
  
  const variantClasses = {
    primary: 'bg-primary-green hover:bg-eco-dark text-white',
    secondary: 'bg-primary-blue hover:bg-blue-600 text-white',
    orange: 'bg-primary-orange hover:bg-orange-600 text-white',
    outline: 'bg-transparent border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}










