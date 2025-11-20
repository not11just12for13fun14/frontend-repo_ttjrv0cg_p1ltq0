import React from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function Result(){
  const { state } = useLocation()
  if(!state) return <p className="mt-12 text-center">No result.</p>
  const { score, total } = state
  const pct = Math.round((score/total)*100)
  return (
    <div className="max-w-md mx-auto bg-white border rounded-xl p-6 mt-12 text-center">
      <h1 className="text-xl font-semibold mb-2">Your Result</h1>
      <p className="text-4xl font-bold">{score} / {total}</p>
      <p className={`mt-2 text-sm ${pct>=60? 'text-green-600':'text-red-600'}`}>{pct}%</p>
      <Link className="mt-4 inline-block bg-blue-600 text-white rounded px-4 py-2" to="/student">Back to Join</Link>
    </div>
  )
}
