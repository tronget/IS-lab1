/* =====================================================================
   src/api.js
   Implements REST client and STOMP/SockJS subscribeToWs
   ===================================================================== */
import axios from 'axios'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

export const labApi = {
  list: () => api.get('/api/labworks'), // returns array
  get: (id) => api.get(`/api/labworks/${id}`),
  create: (payload) => api.post('/api/labworks', payload),
  update: (id, payload) => api.put(`/api/labworks/${id}`, payload),
  remove: (id) => api.delete(`/api/labworks/${id}`),
  // special ops (may not be implemented on server yet)
  sumMaxPoints: () => api.get('/api/labworks/sum-maximum-point'),
  groupByDescription: () => api.get('/api/labworks/group-by-description'),
  countByTunedInWorks: (value) => api.get('/api/labworks/count-by-tunedInWorks', { params: { tunedInWorks: value }}),
  addToDiscipline: (labId, disciplineId) => api.put(`/api/labworks/${labId}/add-to-discipline/${disciplineId}`),
  removeFromDiscipline: (labId, disciplineId) => api.delete(`/api/labworks/${labId}/remove-from-discipline/${disciplineId}`)
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


// Real STOMP/SockJS subscription helper
// onMessage will receive either parsed JSON (object) or raw message string
export function subscribeToWs(onMessage){
  const url = (API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE) + '/is-lab1'
  const client = new Client({
    // use SockJS as underlying websocket factory
    webSocketFactory: () => new SockJS(url),
    reconnectDelay: 5000,
    debug: function (str) { console.debug('[STOMP]', str) }
  })

  client.onConnect = () => {
    console.info('STOMP connected')
    client.subscribe('/topic/labworks', (message) => {
      const body = message.body
      if(!body) return
      try{
        const parsed = JSON.parse(body)
        onMessage(parsed)
      }catch(e){
        onMessage(body)
      }
    })
  }

  client.onStompError = (frame) => {
    console.error('STOMP error', frame)
  }

  client.activate()

  return () => {
    try{ client.deactivate() }catch(e){ console.warn('Error deactivating stomp', e) }
  }
}