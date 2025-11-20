import api from './api'

export async function createQuiz(payload){
  const { data } = await api.post('/quizzes', payload)
  return data
}

export async function getQuiz(code){
  const { data } = await api.get(`/quizzes/${code}`)
  return data
}

export async function startAttempt(quizCode, studentId){
  const { data } = await api.post('/attempts/start', { quizCode, studentId })
  return data
}

export async function submitAttempt(attemptId, answers){
  const { data } = await api.post('/attempts/submit', { attemptId, answers })
  return data
}
