import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard(){
  const { token } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const run = async () => {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` }})
      const data = await res.json()
      setStats(data)
      setLoading(false)
    }
    if(token) run()
  },[token])

  if(!token) return <p className="mt-12 text-center">Please login to view dashboard.</p>
  if(loading) return <p className="mt-12 text-center">Loading...</p>

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Stat title="Quizzes" value={stats.quizzes} />
      <Stat title="Attempts" value={stats.attempts} />
      <Stat title="Active Attempts" value={stats.activeAttempts} />
    </div>
  )
}

function Stat({ title, value }){
  return (
    <div className="bg-white border rounded-xl p-6">
      <p className="text-slate-500 text-sm">{title}</p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  )
}
