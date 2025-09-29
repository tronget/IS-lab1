/* =====================================================================
   src/api.js
   Notes:
   - Controller base path: /api/labworks
   - You said you changed DTO to use `author` on server — client uses `author` too now.
   - Pagination and websockets are not implemented on server yet; client uses client-side pagination.
   ===================================================================== */
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

export const labApi = {
  list: () => api.get('/api/labworks'),
  get: (id) => api.get(`/api/labworks/${id}`),
  create: (payload) => api.post('/api/labworks', payload),
  update: (id, payload) => api.put(`/api/labworks/${id}`, payload),
  remove: (id) => api.delete(`/api/labworks/${id}`),
  // special ops (may not be implemented yet)
  sumMaxPoints: () => api.get('/api/labworks/sum-maximum-point'),
  groupByDescription: () => api.get('/api/labworks/group-by-description'),
  countByTunedInWorks: (value) => api.get('/api/labworks/count-by-tunedInWorks', { params: { tunedInWorks: value } }),
  addToDiscipline: (labId, disciplineId) => api.post(`/api/labworks/${labId}/add-to-discipline`, { disciplineId }),
  removeFromDiscipline: (labId, disciplineId) => api.post(`/api/labworks/${labId}/remove-from-discipline`, { disciplineId })
}

// New APIs for helper entities
export const disciplineApi = {
  list: () => api.get('/api/disciplines')
}

export const coordinatesApi = {
  list: () => api.get('/api/coordinates')
}

export const personApi = {
  list: () => api.get('/api/persons')
}

export const locationApi = {
  list: () => api.get('/api/locations')
}


// Stub for WebSocket subscription: kept for when server implements it.
export function subscribeToWs(onMessage) {
  // no-op for now; server not implemented
  return () => { }
}



// WebSocket helper (optional — your backend must expose a WS endpoint). If it doesn't, this will fail silently.
// export function subscribeToWs(onMessage) {
//   try {
//     const ws = new WebSocket(API_BASE.replace(/^http/, 'ws') + '/ws/updates')
//     ws.onopen = () => console.log('ws open')
//     ws.onmessage = (ev) => {
//       let obj = null
//       try { obj = JSON.parse(ev.data) } catch (e) { obj = ev.data }
//       onMessage(obj)
//     }
//     ws.onerror = (e) => console.warn('ws error', e)
//     return () => ws.close()
//   } catch (e) { console.warn('ws unavailable', e); return () => { } }
// }
