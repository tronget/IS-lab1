/* =====================================================================
   src/components/LabList.jsx
   Table + client-side pagination, filtering (full-match) and sorting using Material UI
   ===================================================================== */
import React, { useEffect, useState, useCallback } from 'react'
import { labApi, subscribeToWs } from '../api'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Select, MenuItem, Grid, Button, TablePagination, Dialog, DialogTitle, DialogContent } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link } from 'react-router-dom'
import LabForm from './LabForm'

function getNested(obj, path){
  if(!path) return undefined
  const parts = path.split('.')
  let cur = obj
  for(const p of parts){ if(cur == null) return undefined; cur = cur[p] }
  return cur
}

export default function LabList(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterField, setFilterField] = useState('name')
  const [filterValue, setFilterValue] = useState('')
  const [sort, setSort] = useState('')

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetch = useCallback(()=>{
    setLoading(true)
    labApi.list().then(r=> setItems(r.data || [])).catch(e=>{ console.error(e); alert('Failed to load list') }).finally(()=>setLoading(false))
  }, [])

  useEffect(()=>{ fetch() }, [fetch])
  useEffect(()=>{ const unsub = subscribeToWs(()=>fetch()); return unsub }, [fetch])

  function applyAll(){
    let result = items.slice()
    if(filterValue){ result = result.filter(it => { const val = getNested(it, filterField); return val != null && String(val) === String(filterValue) }) }
    if(sort){ const [field, dir] = sort.split(','); result.sort((a,b)=>{ const va = getNested(a, field); const vb = getNested(b, field); if(va==null&&vb==null) return 0; if(va==null) return 1; if(vb==null) return -1; if(va<vb) return dir==='asc'?-1:1; if(va>vb) return dir==='asc'?1:-1; return 0 }) }
    return result
  }

  const displayed = applyAll().slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage)

  function openCreate(){ setEditing(null); setDialogOpen(true) }
  function openEdit(item){ setEditing(item); setDialogOpen(true) }
  function handleDelete(id){ if(!confirm('Delete?')) return; labApi.remove(id).then(()=>fetch()).catch(e=>alert('Delete failed')) }

  function handleSave(payload){
    const action = editing ? labApi.update(editing.id, payload) : labApi.create(payload)
    action.then(()=>{ setDialogOpen(false); fetch() }).catch(e=>{ alert('Error: '+(e?.response?.data?.message||e.message)) })
  }

  return (
    <div>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid>
          <Select value={filterField} onChange={e=>setFilterField(e.target.value)}>
            <MenuItem value="name">name</MenuItem>
            <MenuItem value="description">description</MenuItem>
            <MenuItem value="author.name">author.name</MenuItem>
          </Select>
        </Grid>
        <Grid>
          <TextField placeholder="Filter (full match)" value={filterValue} onChange={e=>setFilterValue(e.target.value)} />
        </Grid>
        <Grid>
          <Button variant="outlined" onClick={()=>{ setPage(0) }}>Apply</Button>
        </Grid>
        <Grid sx={{ ml: 'auto' }}>
          <Select value={sort} onChange={e=>setSort(e.target.value)} displayEmpty>
            <MenuItem value="">Sort (none)</MenuItem>
            <MenuItem value="name,asc">name ↑</MenuItem>
            <MenuItem value="name,desc">name ↓</MenuItem>
            <MenuItem value="maximumPoint,desc">maxPoint ↓</MenuItem>
          </Select>
          <Button variant="contained" sx={{ ml: 2 }} onClick={openCreate}>Create</Button>
        </Grid>
      </Grid>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Max</TableCell>
                <TableCell>Min</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayed.map(it=> (
                <TableRow key={it.id}>
                  <TableCell>{it.id}</TableCell>
                  <TableCell><Link to={`/lab/${it.id}`}>{it.name}</Link></TableCell>
                  <TableCell>{it.description}</TableCell>
                  <TableCell>{it.maximumPoint}</TableCell>
                  <TableCell>{it.minimalPoint}</TableCell>
                  <TableCell>{it.author?.name}</TableCell>
                  <TableCell>
                    <IconButton onClick={()=>openEdit(it)}><EditIcon/></IconButton>
                    <IconButton onClick={()=>handleDelete(it.id)} color="error"><DeleteIcon/></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={applyAll().length} page={page} onPageChange={(e,newPage)=>setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={e=>{ setRowsPerPage(parseInt(e.target.value,10)); setPage(0) }} />
      </Paper>

      <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Lab' : 'Create Lab'}</DialogTitle>
        <DialogContent>
          <LabForm initial={editing} onSubmit={handleSave} onCancel={()=>setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
