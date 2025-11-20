import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function genCode(){
  return Math.random().toString(36).substring(2,8).toUpperCase()
}

export default function CreateQuiz(){
  const { token } = useAuth()
  const [title, setTitle] = useState('Sample Quiz')
  const [timeLimit, setTimeLimit] = useState(10)
  const [questions, setQuestions] = useState([{
    id: 'q1', text: '2 + 2 = ?', points: 1, options: [
      { id: 'a', text: '3', isCorrect: false },
      { id: 'b', text: '4', isCorrect: true },
      { id: 'c', text: '5', isCorrect: false },
    ]
  }])
  const [creating, setCreating] = useState(false)
  const [result, setResult] = useState(null)

  const addQuestion = () => {
    const id = `q${questions.length+1}`
    setQuestions([...questions, { id, text: '', points: 1, options: [ {id:'a', text:'', isCorrect:false} ] }])
  }

  const addOption = (qi) => {
    const opts = questions[qi].options
    const nextId = String.fromCharCode('a'.charCodeAt(0) + opts.length)
    const next = [...questions]
    next[qi] = { ...next[qi], options: [...opts, { id: nextId, text: '', isCorrect: false }]}
    setQuestions(next)
  }

  const updateQ = (qi, patch) => {
    const next = [...questions]
    next[qi] = { ...next[qi], ...patch }
    setQuestions(next)
  }

  const updateOpt = (qi, oi, patch) => {
    const next = [...questions]
    const opts = [...next[qi].options]
    opts[oi] = { ...opts[oi], ...patch }
    next[qi] = { ...next[qi], options: opts }
    setQuestions(next)
  }

  const setCorrect = (qi, oi) => {
    const next = [...questions]
    next[qi].options = next[qi].options.map((o, idx)=>({ ...o, isCorrect: idx===oi }))
    setQuestions(next)
  }

  const submit = async () => {
    setCreating(true)
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const res = await fetch(`${baseUrl}/quizzes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, timeLimit, questions })
    })
    const data = await res.json()
    setResult(data)
    setCreating(false)
  }

  if(!token) return <p className="mt-12 text-center">Please login to create quizzes.</p>

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600">Title</label>
              <input className="w-full border rounded px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-slate-600">Time Limit (minutes)</label>
              <input type="number" className="w-full border rounded px-3 py-2" value={timeLimit} onChange={e=>setTimeLimit(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {questions.map((q, qi)=> (
          <div key={q.id} className="bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">Question {qi+1}</p>
              <span className="text-xs text-slate-500">Points:</span>
            </div>
            <input className="mt-2 w-full border rounded px-3 py-2" placeholder="Question text" value={q.text} onChange={e=>updateQ(qi,{text:e.target.value})}/>
            <div className="mt-3 space-y-2">
              {q.options.map((o, oi)=> (
                <div key={o.id} className="flex items-center gap-2">
                  <input className="flex-1 border rounded px-3 py-2" placeholder={`Option ${o.id}`} value={o.text} onChange={e=>updateOpt(qi,oi,{text:e.target.value})}/>
                  <label className="text-sm flex items-center gap-1">
                    <input type="radio" name={`correct-${qi}`} checked={o.isCorrect} onChange={()=>setCorrect(qi,oi)} /> Correct
                  </label>
                </div>
              ))}
            </div>
            <button className="mt-3 text-sm text-blue-600" onClick={()=>addOption(qi)}>+ Add option</button>
          </div>
        ))}

        <div className="flex gap-3">
          <button onClick={addQuestion} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-2 rounded">Add Question</button>
          <button disabled={creating} onClick={submit} className="bg-blue-600 text-white px-3 py-2 rounded">{creating ? 'Creating...' : 'Create Quiz'}</button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-slate-600">Quick Tips</p>
          <ul className="list-disc pl-5 text-sm text-slate-700 mt-2 space-y-1">
            <li>Click the radio button to mark the correct answer.</li>
            <li>Use the time limit to enforce auto-submit.</li>
            <li>Students will join with an auto-generated code.</li>
          </ul>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-slate-600 mb-2">Result</p>
          <pre className="text-xs whitespace-pre-wrap">{result ? JSON.stringify(result, null, 2) : 'Create a quiz to see the code.'}</pre>
        </div>
      </div>
    </div>
  )
}
