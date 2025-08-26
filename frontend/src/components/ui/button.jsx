import React from 'react'

const Button = ({ 
  children, 
  className = '', 
  variant = 'default', 
  size = 'default',
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    ghost: 'hover:bg-slate-100',
    link: 'underline-offset-4 hover:underline text-blue-600'
  }
  
  const sizes = {
    default: 'h-10 py-2 px-4 rounded-lg',
    sm: 'h-9 px-3 rounded-lg',
    lg: 'h-11 px-8 rounded-lg',
    icon: 'h-10 w-10'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} transform hover:-translate-y-0.5 transition-all duration-200 ${className}`
  
  return (
    <button
      className={classes}
      disabled={disabled}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }

