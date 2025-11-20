import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function Quiz(){
  const { code } = useParams()
  const nav = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [attemptId, setAttemptId] = useState('')
  const [remaining, setRemaining] = useState(0)

  // Anti-cheat: tab switch detection
  useEffect(()=>{
    const handler = () => {
      if (document.hidden) logEvent('TAB_SWITCH')
    }
    document.addEventListener('visibilitychange', handler)
    return ()=>document.removeEventListener('visibilitychange', handler)
  },[])

  // Fullscreen enforcement helper
  const enterFullscreen = () => {
    const el = document.documentElement
    if (el.requestFullscreen) el.requestFullscreen()
  }

  useEffect(()=>{
    const load = async () => {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/quizzes/${code}`)
      if(!res.ok){ nav('/student'); return }
      const data = await res.json()
      setQuiz(data)
      setRemaining(data.timeLimit * 60)
      const startRes = await fetch(`${baseUrl}/attempts/start`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ quizCode: code, studentId: crypto.randomUUID() }) })
      const s = await startRes.json()
      setAttemptId(s.attemptId)
      enterFullscreen()
    }
    load()
  },[code])

  useEffect(()=>{
    if(!remaining) return
    const t = setInterval(()=> setRemaining((r)=> r>0 ? r-1 : 0), 1000)
    return ()=>clearInterval(t)
  },[remaining])

  useEffect(()=>{
    if(remaining === 0 && quiz){
      submit()
    }
  },[remaining, quiz])

  const select = (qid, oid) => setAnswers(a=> ({ ...a, [qid]: oid }))

  const logEvent = async (type, meta) => {
    try{
      if(!attemptId) return
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      await fetch(`${baseUrl}/monitor/log`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ attemptId, type, meta }) })
    }catch(e){ /* ignore */ }
  }

  const submit = async () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const res = await fetch(`${baseUrl}/attempts/submit`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ attemptId, answers }) })
    const data = await res.json()
    nav('/student/result', { state: { score: data.score, total: quiz.questions.reduce((s,q)=>s+(q.points||1),0) } })
  }

  if(!quiz) return <p className="mt-12 text-center">Loading quiz...</p>

  return (
    <div className="max-w-3xl mx-auto bg-white border rounded-xl p-4 mt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{quiz.title}</h1>
        <div className="text-sm bg-slate-100 rounded px-2 py-1">Time left: {Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')}</div>
      </div>

      <div className="h-px bg-slate-200 my-4"/>

      <ol className="space-y-4">
        {quiz.questions.map((q, qi)=> (
          <li key={q.id}>
            <p className="font-medium">{qi+1}. {q.text}</p>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {shuffle(q.options).map((o)=> (
                <button key={o.id} onClick={()=>select(q.id, o.id)} className={`text-left border rounded px-3 py-2 ${answers[q.id]===o.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>{o.text}</button>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div className="flex justify-end mt-6">
        <button onClick={submit} className="bg-blue-600 text-white rounded px-4 py-2">Submit</button>
      </div>
    </div>
  )
}

function shuffle(array){
  return [...array].sort(()=> Math.random()-0.5)
}
