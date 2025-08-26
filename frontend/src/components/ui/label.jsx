import React from 'react'

const Label = ({ 
  className = '', 
  htmlFor,
  children,
  ...props 
}) => {
  const baseClasses = 'text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700'
  
  return (
    <label
      htmlFor={htmlFor}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}

export { Label }

