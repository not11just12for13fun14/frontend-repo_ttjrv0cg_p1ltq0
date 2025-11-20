import React from 'react'

export default function Input({ className='', ...props }){
  return <input {...props} className={`border rounded px-3 py-2 ${className}`} />
}
