import React from 'react'

const Card = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ className = '', children, ...props }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 pb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

const CardTitle = ({ className = '', children, ...props }) => {
  return (
    <h3
      className={`text-lg font-semibold leading-none tracking-tight text-slate-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
}

const CardDescription = ({ className = '', children, ...props }) => {
  return (
    <p className={`text-sm text-slate-600 font-medium ${className}`} {...props}>
      {children}
    </p>
  )
}

const CardContent = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
}

const CardFooter = ({ className = '', children, ...props }) => {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

