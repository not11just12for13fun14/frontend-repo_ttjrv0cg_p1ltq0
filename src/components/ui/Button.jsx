import React from 'react'

export default function Button({ children, className='', ...props }){
  return (
    <button {...props} className={`inline-flex items-center justify-center rounded px-3 py-2 font-medium ${className}`}>{children}</button>
  )
}
