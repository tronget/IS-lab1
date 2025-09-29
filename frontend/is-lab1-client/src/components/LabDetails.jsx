// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { labApi } from '../api'
// import { Typography, Paper, Grid, Button, Dialog, DialogTitle, DialogContent } from '@mui/material'
// import LabForm from './LabForm'


// export default function LabDetails() {
//   const { id } = useParams()
//   const nav = useNavigate()
//   const [lab, setLab] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [editOpen, setEditOpen] = useState(false)


//   useEffect(() => { setLoading(true); labApi.get(id).then(r => setLab(r.data)).catch(e => console.error(e)).finally(() => setLoading(false)) }, [id])


//   function onDelete() { if (!confirm('Delete?')) return; labApi.remove(id).then(() => nav('/')).catch(e => alert('Delete failed')) }
//   function onUpdate(payload) { labApi.update(id, payload).then(() => { setEditOpen(false); labApi.get(id).then(r => setLab(r.data)) }).catch(e => alert('Update failed')) }


//   if (loading) return <div>Loading...</div>
//   if (!lab) return <div>Not found</div>


//   return (
//     <Paper sx={{ p: 3 }}>
//       <Typography variant="h5">{lab.name} (id: {lab.id})</Typography>
//       <Grid container spacing={2} sx={{ mt: 1 }}>
//         <Grid item xs={12}><strong>Description:</strong> {lab.description}</Grid>
//         <Grid item xs={6}><strong>Coordinates:</strong> {lab.coordinates?.x}, {lab.coordinates?.y}</Grid>
//         <Grid item xs={6}><strong>Min / Max:</strong> {lab.minimalPoint} / {lab.maximumPoint}</Grid>
//         <Grid item xs={6}><strong>Author:</strong> {lab.author?.name} ({lab.author?.nationality})</Grid>
//         <Grid item xs={6}><strong>Discipline:</strong> {lab.discipline?.name}</Grid>
//       </Grid>


//       <div style={{ marginTop: 16 }}>
//         <Button variant="outlined" onClick={() => setEditOpen(true)} sx={{ mr: 1 }}>Edit</Button>
//         <Button variant="contained" color="error" onClick={onDelete}>Delete</Button>
//       </div>


//       <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Edit</DialogTitle>
//         <DialogContent>
//           <LabForm initial={lab} onSubmit={onUpdate} onCancel={() => setEditOpen(false)} />
//         </DialogContent>
//       </Dialog>
//     </Paper>
//   )
// }

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { labApi } from '../api'
import { Typography, Paper, Grid, Button, Dialog, DialogTitle, DialogContent } from '@mui/material'
import LabForm from './LabForm'


export default function LabDetails() {
  const { id } = useParams()
  const nav = useNavigate()
  const [lab, setLab] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)


  useEffect(() => { setLoading(true); labApi.get(id).then(r => setLab(r.data)).catch(e => console.error(e)).finally(() => setLoading(false)) }, [id])


  function onDelete() { if (!confirm('Delete?')) return; labApi.remove(id).then(() => nav('/')).catch(e => alert('Delete failed')) }
  function onUpdate(payload) { labApi.update(id, payload).then(() => { setEditOpen(false); labApi.get(id).then(r => setLab(r.data)) }).catch(e => alert('Update failed')) }


  if (loading) return <div>Loading...</div>
  if (!lab) return <div>Not found</div>


  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">{lab.name} (id: {lab.id})</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}><strong>Description:</strong> {lab.description}</Grid>
        <Grid item xs={6}><strong>Coordinates:</strong> {lab.coordinates?.x}, {lab.coordinates?.y}</Grid>
        <Grid item xs={6}><strong>Min / Max:</strong> {lab.minimalPoint} / {lab.maximumPoint}</Grid>
        <Grid item xs={6}><strong>Author:</strong> {lab.author?.name} ({lab.author?.nationality})</Grid>
        <Grid item xs={6}><strong>Discipline:</strong> {lab.discipline?.name}</Grid>
      </Grid>


      <div style={{ marginTop: 16 }}>
        <Button variant="outlined" onClick={() => setEditOpen(true)} sx={{ mr: 1 }}>Edit</Button>
        <Button variant="contained" color="error" onClick={onDelete}>Delete</Button>
      </div>


      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          <LabForm initial={lab} onSubmit={onUpdate} onCancel={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </Paper>
  )
}