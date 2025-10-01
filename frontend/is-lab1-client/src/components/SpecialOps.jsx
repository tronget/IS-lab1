import React, { useState } from 'react'
import { Paper, Button, TextField, Grid, Typography } from '@mui/material'
import { labApi } from '../api'


export default function SpecialOps() {
  const [sum, setSum] = useState(null)
  const [groups, setGroups] = useState(null)
  const [countRes, setCountRes] = useState(null)
  const [tunedVal, setTunedVal] = useState(0)
  const [labId, setLabId] = useState('')
  const [discId, setDiscId] = useState('')


  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Sum of maximumPoint</Typography>
        <Button sx={{ mt: 1 }} onClick={() => labApi.sumMaxPoints().then(r => setSum(r.data)).catch(() => alert('Not implemented on server'))}>Calculate</Button>
        {sum !== null && <div>Sum = {sum}</div>}
      </Paper>


      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Group by description</Typography>
        <Button sx={{ mt: 1 }} onClick={() => labApi.groupByDescription().then(r => setGroups(r.data)).catch(() => alert('Not implemented on server'))}>Run</Button>
        {groups && <pre>{JSON.stringify(groups, null, 2)}</pre>}
      </Paper>


      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Count by tunedInWorks</Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item><TextField type="number" value={tunedVal} onChange={e => setTunedVal(e.target.value)} /></Grid>
          <Grid item><Button onClick={() => labApi.countByTunedInWorks(tunedVal).then(r => setCountRes(r.data)).catch(() => alert('Not implemented on server'))}>Count</Button></Grid>
        </Grid>
        {countRes !== null && <div>Count = {countRes}</div>}
      </Paper>


      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Add / Remove lab to/from discipline</Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item><TextField placeholder="labId" value={labId} onChange={e => setLabId(e.target.value)} /></Grid>
          <Grid item><TextField placeholder="disciplineId" value={discId} onChange={e => setDiscId(e.target.value)} /></Grid>
          <Grid item>
            <Button onClick={() => labApi.addToDiscipline(labId, discId).then(() => alert('Added')).catch(() => alert('Not implemented on server'))}>Add</Button>
            <Button sx={{ ml: 1 }} onClick={() => labApi.removeFromDiscipline(labId, discId).then(() => alert('Removed')).catch(() => alert('Not implemented on server'))}>Remove</Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}