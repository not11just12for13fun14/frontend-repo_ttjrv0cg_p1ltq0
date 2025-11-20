import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Join(){
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/quizzes/${code}`)
      if(!res.ok) throw new Error('Invalid code')
      nav(`/student/quiz/${code}`)
    } catch(e){
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white border rounded-xl p-6 mt-12">
      <h1 className="text-xl font-semibold mb-4">Join Quiz</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2 tracking-widest text-center" placeholder="ENTER CODE" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading || !code} className="w-full bg-blue-600 text-white rounded py-2">{loading? 'Checking...' : 'Join'}</button>
      </form>
    </div>
  )
}
