import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Monitor(){
  const { token } = useAuth()
  const [attempts, setAttempts] = useState([])

  useEffect(()=>{
    const interval = setInterval(async()=>{
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` }})
      // Placeholder live refresh; in a real app, fetch detailed attempts list
      const data = await res.json()
      setAttempts([`Active attempts: ${data.activeAttempts} at ${new Date().toLocaleTimeString()}`])
    }, 3000)
    return ()=>clearInterval(interval)
  },[token])

  if(!token) return <p className="mt-12 text-center">Login required.</p>

  return (
    <div className="bg-white border rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">Live Monitoring</h2>
      <ul className="text-sm space-y-1">
        {attempts.map((x, i)=> <li key={i}>{x}</li>)}
      </ul>
    </div>
  )
}
