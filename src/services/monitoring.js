import api from './api'

export async function logSuspiciousEvent(attemptId, type, meta){
  try{
    await api.post('/monitor/log', { attemptId, type, meta })
  }catch(e){ /* ignore */ }
}
