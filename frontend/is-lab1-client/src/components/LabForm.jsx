// // src/components/LabForm.jsx
// import React, { useState, useEffect } from 'react'
// import {
//   Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Divider
// } from '@mui/material'
// import { disciplineApi, coordinatesApi, personApi, locationApi } from '../api'

// const difficulties = ['', 'VERY_EASY', 'NORMAL', 'VERY_HARD']
// const colors = ['', 'RED', 'YELLOW', 'ORANGE', 'WHITE']
// const countries = ['', 'USA', 'FRANCE', 'CHINA', 'ITALY', 'THAILAND']

// const empty = {
//   name: '', description: '', difficulty: '', minimalPoint: '', maximumPoint: '', tunedInWorks: 0,
//   // discipline either { id } or full object without id
//   disciplineMode: 'new', // 'new' | 'existing'
//   disciplineExistingId: '',
//   discipline: { name: '', practiceHours: '', selfStudyHours: '', labsCount: '' },

//   // coordinates
//   coordinatesMode: 'new', // 'new' | 'existing'
//   coordinatesExistingId: '',
//   coordinates: { x: '', y: '' },

//   // author (person)
//   authorMode: 'new', // 'new' | 'existing'
//   authorExistingId: '',
//   author: {
//     name: '', eyeColor: '', hairColor: '', weight: '', nationality: '',
//     locationMode: 'new', // for nested location when creating new person
//     locationExistingId: '',
//     location: { x: '', y: '', name: '' }
//   }
// }

// function deepClone(v) { return JSON.parse(JSON.stringify(v)) }

// export default function LabForm({ initial = null, onSubmit, onCancel }) {
//   const [form, setForm] = useState(initial ? adaptInitial(initial) : deepClone(empty))
//   const [errors, setErrors] = useState({})
//   const [disciplines, setDisciplines] = useState([])
//   const [coordsList, setCoordsList] = useState([])
//   const [persons, setPersons] = useState([])
//   const [locations, setLocations] = useState([])

//   // Load helper lists
//   useEffect(() => {
//     disciplineApi.list().then(r => setDisciplines(r.data || [])).catch(() => setDisciplines([]))
//     coordinatesApi.list().then(r => setCoordsList(r.data || [])).catch(() => setCoordsList([]))
//     personApi.list().then(r => setPersons(r.data || [])).catch(() => setPersons([]))
//     locationApi.list().then(r => setLocations(r.data || [])).catch(() => setLocations([]))
//   }, [])

//   // If initial prop changes (edit case) convert it to internal form representation
//   useEffect(() => setForm(initial ? adaptInitial(initial) : deepClone(empty)), [initial])

//   function adaptInitial(init) {
//     // adapt server response (it includes author, discipline, coordinates) into our form structure
//     const res = deepClone(empty)
//     res.name = init.name ?? ''
//     res.description = init.description ?? ''
//     res.difficulty = init.difficulty ?? ''
//     res.minimalPoint = init.minimalPoint ?? ''
//     res.maximumPoint = init.maximumPoint ?? ''
//     res.tunedInWorks = init.tunedInWorks ?? 0

//     if (init.discipline) {
//       res.disciplineMode = 'existing'
//       res.disciplineExistingId = init.discipline.id ?? ''
//     }
//     if (init.coordinates) {
//       res.coordinatesMode = 'existing'
//       res.coordinatesExistingId = init.coordinates.id ?? ''
//     }
//     if (init.author) {
//       res.authorMode = 'existing'
//       res.authorExistingId = init.author.id ?? ''
//     }
//     // Note: when editing and you want to show full fields instead of existing selects, you can expand this.
//     return res
//   }

//   function change(path, value) {
//     const parts = path.split('.')
//     setForm(prev => {
//       const copy = deepClone(prev)
//       let cur = copy
//       for (let i = 0; i < parts.length - 1; i++) {
//         if (cur[parts[i]] == null) cur[parts[i]] = {}
//         cur = cur[parts[i]]
//       }
//       cur[parts.at(-1)] = value
//       return copy
//     })
//   }

//   function validate() {
//     const e = {}
//     if (!form.name) e.name = 'Name is required'
//     if (!form.description) e.description = 'Description is required'
//     if (!(Number(form.minimalPoint) > 0)) e.minimalPoint = 'minimalPoint must be > 0'
//     if (!(Number(form.maximumPoint) > 0)) e.maximumPoint = 'maximumPoint must be > 0'
//     // coordinates validation: if creating new or existing chosen? If existing chosen -> assume server-side ok
//     if (form.coordinatesMode === 'new') {
//       if (form.coordinates.y === '' || form.coordinates.y === null) e.coordinates = 'Coordinates.y is required'
//       else if (Number(form.coordinates.y) > 508) e.coordinates = 'Coordinates.y must be ≤508'
//     }
//     // author validation
//     if (form.authorMode === 'new') {
//       if (!form.author.name) e.author = 'Author name is required'
//       if (form.author.locationMode === 'new') {
//         if (form.author.location.x === '' || form.author.location.y === '' || !form.author.location.name) e.location = 'Location fields required'
//       }
//     }
//     setErrors(e)
//     return Object.keys(e).length === 0
//   }

//   function submit(e) {
//     e.preventDefault()
//     if (!validate()) return

//     const payload = {
//       name: form.name,
//       description: form.description,
//       difficulty: form.difficulty || null,
//       minimalPoint: Number(form.minimalPoint),
//       maximumPoint: Number(form.maximumPoint),
//       tunedInWorks: Number(form.tunedInWorks)
//     }

//     // discipline
//     if (form.disciplineMode === 'existing') {
//       payload.discipline = { id: Number(form.disciplineExistingId) }
//     } else {
//       // create new discipline: include fields expected by DisciplineDto (no id)
//       payload.discipline = {
//         name: form.discipline.name || '',
//         practiceHours: form.discipline.practiceHours !== '' ? Number(form.discipline.practiceHours) : null,
//         selfStudyHours: form.discipline.selfStudyHours !== '' ? Number(form.discipline.selfStudyHours) : null,
//         labsCount: form.discipline.labsCount !== '' ? Number(form.discipline.labsCount) : null
//       }
//     }

//     // coordinates
//     if (form.coordinatesMode === 'existing') {
//       payload.coordinates = { id: Number(form.coordinatesExistingId) }
//     } else {
//       payload.coordinates = {
//         x: form.coordinates.x !== '' ? Number(form.coordinates.x) : null,
//         y: form.coordinates.y !== '' ? Number(form.coordinates.y) : null
//       }
//     }

//     // author / person
//     if (form.authorMode === 'existing') {
//       payload.author = { id: Number(form.authorExistingId) }
//     } else {
//       // create new author: include nested location either existing id or new object
//       const author = {
//         name: form.author.name || '',
//         eyeColor: form.author.eyeColor || null,
//         hairColor: form.author.hairColor || null,
//         weight: form.author.weight !== '' ? Number(form.author.weight) : null,
//         nationality: form.author.nationality || null
//       }
//       if (form.author.locationMode === 'existing') {
//         author.location = { id: Number(form.author.locationExistingId) }
//       } else {
//         author.location = {
//           x: form.author.location.x !== '' ? Number(form.author.location.x) : null,
//           y: form.author.location.y !== '' ? Number(form.author.location.y) : null,
//           name: form.author.location.name || ''
//         }
//       }
//       payload.author = author
//     }

//     // pass payload to parent
//     onSubmit(payload)
//   }

//   // render helpers
//   function renderDisciplineSection() {
//     return (
//       <>
//         <Grid item xs={12} md={4}>
//           <FormControl fullWidth>
//             <InputLabel>Discipline</InputLabel>
//             <Select
//               label="Discipline"
//               value={form.disciplineMode === 'existing' ? `existing:${form.disciplineExistingId}` : 'new'}
//               onChange={e => {
//                 const v = e.target.value
//                 if (v === 'new') { change('disciplineMode', 'new'); change('disciplineExistingId', '') }
//                 else {
//                   // value like existing:ID
//                   const id = v.split(':')[1]
//                   change('disciplineMode', 'existing'); change('disciplineExistingId', id)
//                 }
//               }}
//             >
//               <MenuItem value="new">Create new discipline</MenuItem>
//               {disciplines.map(d => <MenuItem key={d.id} value={`existing:${d.id}`}>{d.name} (id:{d.id})</MenuItem>)}
//             </Select>
//           </FormControl>
//         </Grid>

//         {form.disciplineMode === 'new' && (
//           <>
//             <Grid item xs={12} md={4}>
//               <TextField label="Discipline name" fullWidth value={form.discipline.name} onChange={e => change('discipline.name', e.target.value)} />
//             </Grid>
//             <Grid item xs={12} md={2}>
//               <TextField label="Practice hours" fullWidth value={form.discipline.practiceHours} onChange={e => change('discipline.practiceHours', e.target.value)} />
//             </Grid>
//             <Grid item xs={12} md={2}>
//               <TextField label="Self study hours" fullWidth value={form.discipline.selfStudyHours} onChange={e => change('discipline.selfStudyHours', e.target.value)} />
//             </Grid>
//           </>
//         )}
//       </>
//     )
//   }

//   function renderCoordinatesSection() {
//     return (
//       <>
//         <Grid item xs={12} md={4}>
//           <FormControl fullWidth>
//             <InputLabel>Coordinates</InputLabel>
//             <Select
//               label="Coordinates"
//               value={form.coordinatesMode === 'existing' ? `existing:${form.coordinatesExistingId}` : 'new'}
//               onChange={e => {
//                 const v = e.target.value
//                 if (v === 'new') { change('coordinatesMode', 'new'); change('coordinatesExistingId', '') }
//                 else { const id = v.split(':')[1]; change('coordinatesMode', 'existing'); change('coordinatesExistingId', id) }
//               }}
//             >
//               <MenuItem value="new">Create new coordinates</MenuItem>
//               {coordsList.map(c => <MenuItem key={c.id} value={`existing:${c.id}`}>x:{c.x} y:{c.y} (id:{c.id})</MenuItem>)}
//             </Select>
//           </FormControl>
//         </Grid>

//         {form.coordinatesMode === 'new' && (
//           <>
//             <Grid item xs={12} md={4}><TextField label="Coordinates X" fullWidth value={form.coordinates.x} onChange={e => change('coordinates.x', e.target.value)} /></Grid>
//             <Grid item xs={12} md={4}><TextField label="Coordinates Y" fullWidth value={form.coordinates.y} onChange={e => change('coordinates.y', e.target.value)} error={!!errors.coordinates} helperText={errors.coordinates} /></Grid>
//           </>
//         )}
//       </>
//     )
//   }

//   function renderAuthorSection() {
//     return (
//       <>
//         <Grid item xs={12}>
//           <FormControl fullWidth>
//             <InputLabel>Author (Person)</InputLabel>
//             <Select
//               label="Author"
//               value={form.authorMode === 'existing' ? `existing:${form.authorExistingId}` : 'new'}
//               onChange={e => {
//                 const v = e.target.value
//                 if (v === 'new') { change('authorMode', 'new'); change('authorExistingId', '') }
//                 else { const id = v.split(':')[1]; change('authorMode', 'existing'); change('authorExistingId', id) }
//               }}
//             >
//               <MenuItem value="new">Create new person</MenuItem>
//               {persons.map(p => <MenuItem key={p.id} value={`existing:${p.id}`}>{p.name} (id:{p.id})</MenuItem>)}
//             </Select>
//           </FormControl>
//         </Grid>

//         {form.authorMode === 'new' && (
//           <>
//             <Grid item xs={12} md={6}><TextField label="Author name" fullWidth value={form.author.name} onChange={e => change('author.name', e.target.value)} error={!!errors.author} helperText={errors.author} /></Grid>
//             <Grid item xs={12} md={3}>
//               <FormControl fullWidth>
//                 <InputLabel>Eye Color</InputLabel>
//                 <Select label="Eye Color" value={form.author.eyeColor || ''} onChange={e => change('author.eyeColor', e.target.value)}>
//                   {colors.map(c => <MenuItem key={c} value={c}>{c || '—'}</MenuItem>)}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={3}>
//               <FormControl fullWidth>
//                 <InputLabel>Hair Color</InputLabel>
//                 <Select label="Hair Color" value={form.author.hairColor || ''} onChange={e => change('author.hairColor', e.target.value)}>
//                   {colors.map(c => <MenuItem key={c} value={c}>{c || '—'}</MenuItem>)}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} md={4}><TextField label="Weight" fullWidth value={form.author.weight} onChange={e => change('author.weight', e.target.value)} /></Grid>
//             <Grid item xs={12} md={4}>
//               <FormControl fullWidth>
//                 <InputLabel>Nationality</InputLabel>
//                 <Select label="Nationality" value={form.author.nationality || ''} onChange={e => change('author.nationality', e.target.value)}>
//                   {countries.map(c => <MenuItem key={c} value={c}>{c || '—'}</MenuItem>)}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12}><Divider>Location for Author</Divider></Grid>

//             <Grid item xs={12} md={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Location</InputLabel>
//                 <Select
//                   label="Location"
//                   value={form.author.locationMode === 'existing' ? `existing:${form.author.locationExistingId}` : 'new'}
//                   onChange={e => {
//                     const v = e.target.value
//                     if (v === 'new') { change('author.locationMode', 'new'); change('author.locationExistingId', '') }
//                     else { const id = v.split(':')[1]; change('author.locationMode', 'existing'); change('author.locationExistingId', id) }
//                   }}
//                 >
//                   <MenuItem value="new">Create new location</MenuItem>
//                   {locations.map(l => <MenuItem key={l.id} value={`existing:${l.id}`}>{l.name} (id:{l.id})</MenuItem>)}
//                 </Select>
//               </FormControl>
//             </Grid>

//             {form.author.locationMode === 'new' && (
//               <>
//                 <Grid item xs={12} md={3}><TextField label="Location X (Double)" fullWidth value={form.author.location.x} onChange={e => change('author.location.x', e.target.value)} /></Grid>
//                 <Grid item xs={12} md={3}><TextField label="Location Y (Long)" fullWidth value={form.author.location.y} onChange={e => change('author.location.y', e.target.value)} /></Grid>
//                 <Grid item xs={12} md={6}><TextField label="Location name" fullWidth value={form.author.location.name} onChange={e => change('author.location.name', e.target.value)} /></Grid>
//               </>
//             )}
//           </>
//         )}
//       </>
//     )
//   }

//   return (
//     <form onSubmit={submit}>
//       <Grid container spacing={2}>
//         <Grid item xs={12} md={6}><TextField label="Name" fullWidth value={form.name} onChange={e => change('name', e.target.value)} error={!!errors.name} helperText={errors.name} /></Grid>
//         <Grid item xs={12} md={6}>
//           <FormControl fullWidth>
//             <InputLabel>Difficulty</InputLabel>
//             <Select label="Difficulty" value={form.difficulty || ''} onChange={e => change('difficulty', e.target.value)}>
//               {difficulties.map(d => <MenuItem key={d} value={d}>{d || '—'}</MenuItem>)}
//             </Select>
//           </FormControl>
//         </Grid>

//         <Grid item xs={12}><TextField label="Description" fullWidth value={form.description} onChange={e => change('description', e.target.value)} error={!!errors.description} helperText={errors.description} /></Grid>

//         <Grid item xs={12} md={4}><TextField label="Minimal Point" fullWidth value={form.minimalPoint} onChange={e => change('minimalPoint', e.target.value)} error={!!errors.minimalPoint} helperText={errors.minimalPoint} /></Grid>
//         <Grid item xs={12} md={4}><TextField label="Maximum Point" fullWidth value={form.maximumPoint} onChange={e => change('maximumPoint', e.target.value)} error={!!errors.maximumPoint} helperText={errors.maximumPoint} /></Grid>
//         <Grid item xs={12} md={4}><TextField label="Tuned In Works" fullWidth value={form.tunedInWorks} onChange={e => change('tunedInWorks', e.target.value)} /></Grid>

//         {/* Discipline */}
//         {renderDisciplineSection()}

//         {/* Coordinates */}
//         {renderCoordinatesSection()}

//         {/* Author / Person */}
//         {renderAuthorSection()}

//         <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
//           <Button onClick={onCancel}>Cancel</Button>
//           <Button type="submit" variant="contained">Save</Button>
//         </Grid>
//       </Grid>
//     </form>
//   )
// }

import React, { useState, useEffect } from 'react'
import {
  Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Divider, Paper, Box
} from '@mui/material'
import { disciplineApi, coordinatesApi, personApi, locationApi } from '../api'

const difficulties = ['', 'VERY_EASY', 'NORMAL', 'VERY_HARD']
const colors = ['', 'RED', 'YELLOW', 'ORANGE', 'WHITE']
const countries = ['', 'USA', 'FRANCE', 'CHINA', 'ITALY', 'THAILAND']

const empty = {
  name: '', description: '', difficulty: '', minimalPoint: '', maximumPoint: '', tunedInWorks: 0,
  // discipline
  disciplineMode: 'new', // 'new' | 'existing'
  disciplineExistingId: '',
  discipline: { name: '', practiceHours: '', selfStudyHours: '', labsCount: '' },
  // coordinates
  coordinatesMode: 'new',
  coordinatesExistingId: '',
  coordinates: { x: '', y: '' },
  // author (person)
  authorMode: 'new',
  authorExistingId: '',
  author: {
    name: '', eyeColor: '', hairColor: '', weight: '', nationality: '',
    locationMode: 'new', locationExistingId: '', location: { x: '', y: '', name: '' }
  }
}

function deepClone(v) { return JSON.parse(JSON.stringify(v)) }

export default function LabForm({ initial = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ? adaptInitial(initial) : deepClone(empty))
  const [errors, setErrors] = useState({})
  const [disciplines, setDisciplines] = useState([])
  const [coordsList, setCoordsList] = useState([])
  const [persons, setPersons] = useState([])
  const [locations, setLocations] = useState([])

  useEffect(() => {
    disciplineApi.list().then(r => setDisciplines(r.data || [])).catch(() => setDisciplines([]))
    coordinatesApi.list().then(r => setCoordsList(r.data || [])).catch(() => setCoordsList([]))
    personApi.list().then(r => setPersons(r.data || [])).catch(() => setPersons([]))
    locationApi.list().then(r => setLocations(r.data || [])).catch(() => setLocations([]))
  }, [])

  useEffect(() => setForm(initial ? adaptInitial(initial) : deepClone(empty)), [initial])

  function adaptInitial(init) {
    const res = deepClone(empty)
    res.name = init.name ?? ''
    res.description = init.description ?? ''
    res.difficulty = init.difficulty ?? ''
    res.minimalPoint = init.minimalPoint ?? ''
    res.maximumPoint = init.maximumPoint ?? ''
    res.tunedInWorks = init.tunedInWorks ?? 0

    if (init.discipline) { res.disciplineMode = 'existing'; res.disciplineExistingId = init.discipline.id ?? '' }
    if (init.coordinates) { res.coordinatesMode = 'existing'; res.coordinatesExistingId = init.coordinates.id ?? '' }
    if (init.author) { res.authorMode = 'existing'; res.authorExistingId = init.author.id ?? '' }

    return res
  }

  function change(path, value) {
    const parts = path.split('.')
    setForm(prev => {
      const copy = deepClone(prev)
      let cur = copy
      for (let i = 0; i < parts.length - 1; i++) {
        if (cur[parts[i]] == null) cur[parts[i]] = {}
        cur = cur[parts[i]]
      }
      cur[parts.at(-1)] = value
      return copy
    })
  }

  function validate() {
    const e = {}
    // LabWork
    if (!form.name || String(form.name).trim() === '') e.name = 'Name is required'
    if (!form.description || String(form.description).trim() === '') e.description = 'Description is required'
    if (!(Number(form.minimalPoint) > 0)) e.minimalPoint = 'minimalPoint must be a positive number (>0)'
    if (!(Number(form.maximumPoint) > 0)) e.maximumPoint = 'maximumPoint must be a positive number (>0)'

    // Discipline if new
    if (form.disciplineMode === 'new') {
      if (!form.discipline.name || String(form.discipline.name).trim() === '') e.disciplineName = 'Discipline name is required'
      if (form.discipline.labsCount !== '' && Number(form.discipline.labsCount) < 0) e.disciplineLabs = 'labsCount must be >= 0'
    }

    // Coordinates
    if (form.coordinatesMode === 'new') {
      if (form.coordinates.x === '' || form.coordinates.x === null) e.coordinatesX = 'Coordinates.x is required'
      if (form.coordinates.y === '' || form.coordinates.y === null) e.coordinatesY = 'Coordinates.y is required'
      else if (Number(form.coordinates.y) > 508) e.coordinatesY = 'Coordinates.y must be ≤ 508'
    }

    // Author (Person)
    if (form.authorMode === 'new') {
      if (!form.author.name || String(form.author.name).trim() === '') e.authorName = 'Author name is required'
      if (!form.author.eyeColor) e.authorEye = 'Eye color is required'
      if (!form.author.hairColor) e.authorHair = 'Hair color is required'
      if (!(Number(form.author.weight) > 0)) e.authorWeight = 'Weight must be positive (>0)'
      if (!form.author.nationality) e.authorNationality = 'Nationality is required'

      // Location nested
      if (form.author.locationMode === 'new') {
        if (form.author.location.x === '' || form.author.location.x === null) e.locationX = 'Location.x is required'
        if (form.author.location.y === '' || form.author.location.y === null) e.locationY = 'Location.y is required'
        if (!form.author.location.name || String(form.author.location.name).trim() === '') e.locationName = 'Location.name is required'
      }
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit(e) {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      name: String(form.name).trim(),
      description: String(form.description).trim(),
      difficulty: form.difficulty || null,
      minimalPoint: Number(form.minimalPoint),
      maximumPoint: Number(form.maximumPoint),
      tunedInWorks: Number(form.tunedInWorks)
    }

    // Discipline
    if (form.disciplineMode === 'existing') {
      payload.discipline = { id: Number(form.disciplineExistingId) }
    } else {
      payload.discipline = {
        name: String(form.discipline.name).trim(),
        practiceHours: form.discipline.practiceHours === '' ? null : Number(form.discipline.practiceHours),
        selfStudyHours: form.discipline.selfStudyHours === '' ? null : Number(form.discipline.selfStudyHours),
        labsCount: form.discipline.labsCount === '' ? null : Number(form.discipline.labsCount)
      }
    }

    // Coordinates
    if (form.coordinatesMode === 'existing') {
      payload.coordinates = { id: Number(form.coordinatesExistingId) }
    } else {
      payload.coordinates = {
        x: Number(form.coordinates.x),
        y: Number(form.coordinates.y)
      }
    }

    // Author
    if (form.authorMode === 'existing') {
      payload.author = { id: Number(form.authorExistingId) }
    } else {
      const author = {
        name: String(form.author.name).trim(),
        eyeColor: form.author.eyeColor || null,
        hairColor: form.author.hairColor || null,
        weight: Number(form.author.weight),
        nationality: form.author.nationality || null
      }
      if (form.author.locationMode === 'existing') {
        author.location = { id: Number(form.author.locationExistingId) }
      } else {
        author.location = {
          x: Number(form.author.location.x),
          y: Number(form.author.location.y),
          name: String(form.author.location.name).trim()
        }
      }
      payload.author = author
    }

    onSubmit(payload)
  }

  // Render helpers: each entity section wrapped in Paper for clarity
  function DisciplineSection() {
    return (
      <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
        <Typography variant="h6">Discipline</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Discipline</InputLabel>
              <Select label="Discipline" value={form.disciplineMode === 'existing' ? `existing:${form.disciplineExistingId}` : 'new'}
                onChange={e => { const v = e.target.value; if (v === 'new') { change('disciplineMode', 'new'); change('disciplineExistingId', '') } else { const id = v.split(':')[1]; change('disciplineMode', 'existing'); change('disciplineExistingId', id) } }}>
                <MenuItem value="new">Create new discipline</MenuItem>
                {disciplines.map(d => <MenuItem key={d.id} value={`existing:${d.id}`}>{d.name} (id:{d.id})</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          {form.disciplineMode === 'new' && (
            <>
              <Grid item xs={12} md={4}><TextField label="Discipline name" fullWidth value={form.discipline.name} onChange={e => change('discipline.name', e.target.value)} error={!!errors.disciplineName} helperText={errors.disciplineName} /></Grid>
              <Grid item xs={12} md={2}><TextField label="Practice hours" fullWidth value={form.discipline.practiceHours} onChange={e => change('discipline.practiceHours', e.target.value)} /></Grid>
              <Grid item xs={12} md={2}><TextField label="Self study hours" fullWidth value={form.discipline.selfStudyHours} onChange={e => change('discipline.selfStudyHours', e.target.value)} /></Grid>
              <Grid item xs={12} md={3}><TextField label="Labs count" fullWidth value={form.discipline.labsCount} onChange={e => change('discipline.labsCount', e.target.value)} error={!!errors.disciplineLabs} helperText={errors.disciplineLabs} /></Grid>
            </>
          )}
        </Grid>
      </Paper>
    )
  }

  function CoordinatesSection() {
    return (
      <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
        <Typography variant="h6">Coordinates</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Coordinates</InputLabel>
              <Select label="Coordinates" value={form.coordinatesMode === 'existing' ? `existing:${form.coordinatesExistingId}` : 'new'} onChange={e => { const v = e.target.value; if (v === 'new') { change('coordinatesMode', 'new'); change('coordinatesExistingId', '') } else { const id = v.split(':')[1]; change('coordinatesMode', 'existing'); change('coordinatesExistingId', id) } }}>
                <MenuItem value="new">Create new coordinates</MenuItem>
                {coordsList.map(c => <MenuItem key={c.id} value={`existing:${c.id}`}>x:{c.x} y:{c.y} (id:{c.id})</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          {form.coordinatesMode === 'new' && (
            <>
              <Grid item xs={12} md={4}><TextField label="Coordinates X" fullWidth value={form.coordinates.x} onChange={e => change('coordinates.x', e.target.value)} error={!!errors.coordinatesX} helperText={errors.coordinatesX} /></Grid>
              <Grid item xs={12} md={4}><TextField label="Coordinates Y" fullWidth value={form.coordinates.y} onChange={e => change('coordinates.y', e.target.value)} error={!!errors.coordinatesY} helperText={errors.coordinatesY} /></Grid>
            </>
          )}
        </Grid>
      </Paper>
    )
  }

  function AuthorSection() {
    return (
      <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
        <Typography variant="h6">Author (Person)</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Author</InputLabel>
              <Select label="Author" value={form.authorMode === 'existing' ? `existing:${form.authorExistingId}` : 'new'} onChange={e => { const v = e.target.value; if (v === 'new') { change('authorMode', 'new'); change('authorExistingId', '') } else { const id = v.split(':')[1]; change('authorMode', 'existing'); change('authorExistingId', id) } }}>
                <MenuItem value="new">Create new person</MenuItem>
                {persons.map(p => <MenuItem key={p.id} value={`existing:${p.id}`}>{p.name} (id:{p.id})</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          {form.authorMode === 'new' && (
            <>
              <Grid item xs={12} md={6}><TextField label="Author name" fullWidth value={form.author.name} onChange={e => change('author.name', e.target.value)} error={!!errors.authorName} helperText={errors.authorName} /></Grid>
              <Grid item xs={12} md={3}><FormControl fullWidth><InputLabel>Eye Color</InputLabel><Select label="Eye Color" value={form.author.eyeColor || ''} onChange={e => change('author.eyeColor', e.target.value)}>{colors.map(c => <MenuItem key={c} value={c}>{c || '—'}</MenuItem>)}</Select></FormControl></Grid>
              <Grid item xs={12} md={3}><FormControl fullWidth><InputLabel>Hair Color</InputLabel><Select label="Hair Color" value={form.author.hairColor || ''} onChange={e => change('author.hairColor', e.target.value)}>{colors.map(c => <MenuItem key={c} value={c}>{c || '—'}</MenuItem>)}</Select></FormControl></Grid>

              <Grid item xs={12} md={4}><TextField label="Weight" fullWidth value={form.author.weight} onChange={e => change('author.weight', e.target.value)} error={!!errors.authorWeight} helperText={errors.authorWeight} /></Grid>
              <Grid item xs={12} md={4}><FormControl fullWidth><InputLabel>Nationality</InputLabel><Select label="Nationality" value={form.author.nationality || ''} onChange={e => change('author.nationality', e.target.value)}>{countries.map(c => <MenuItem key={c} value={c}>{c || '—'}</MenuItem>)}</Select></FormControl></Grid>

              <Grid item xs={12}><Divider sx={{ my: 1 }} /><Typography variant="subtitle1">Location for Author</Typography></Grid>

              <Grid item xs={12} md={6}><FormControl fullWidth><InputLabel>Location</InputLabel><Select label="Location" value={form.author.locationMode === 'existing' ? `existing:${form.author.locationExistingId}` : 'new'} onChange={e => { const v = e.target.value; if (v === 'new') { change('author.locationMode', 'new'); change('author.locationExistingId', '') } else { const id = v.split(':')[1]; change('author.locationMode', 'existing'); change('author.locationExistingId', id) } }}>{/* options */}<MenuItem value="new">Create new location</MenuItem>{locations.map(l => <MenuItem key={l.id} value={`existing:${l.id}`}>{l.name} (id:{l.id})</MenuItem>)}</Select></FormControl></Grid>

              {form.author.locationMode === 'new' && (
                <>
                  <Grid item xs={12} md={3}><TextField label="Location X (Double)" fullWidth value={form.author.location.x} onChange={e => change('author.location.x', e.target.value)} error={!!errors.locationX} helperText={errors.locationX} /></Grid>
                  <Grid item xs={12} md={3}><TextField label="Location Y (Long)" fullWidth value={form.author.location.y} onChange={e => change('author.location.y', e.target.value)} error={!!errors.locationY} helperText={errors.locationY} /></Grid>
                  <Grid item xs={12} md={6}><TextField label="Location name" fullWidth value={form.author.location.name} onChange={e => change('author.location.name', e.target.value)} error={!!errors.locationName} helperText={errors.locationName} /></Grid>
                </>
              )}
            </>
          )}
        </Grid>
      </Paper>
    )
  }

  return (
    <form onSubmit={submit}>
      <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
        <Typography variant="h6">LabWork</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}><TextField label="Name" fullWidth value={form.name} onChange={e => change('name', e.target.value)} error={!!errors.name} helperText={errors.name} /></Grid>
          <Grid item xs={12} md={6}><FormControl fullWidth><InputLabel>Difficulty</InputLabel><Select label="Difficulty" value={form.difficulty || ''} onChange={e => change('difficulty', e.target.value)}>{difficulties.map(d => <MenuItem key={d} value={d}>{d || '—'}</MenuItem>)}</Select></FormControl></Grid>

          <Grid item xs={12}><TextField label="Description" fullWidth value={form.description} onChange={e => change('description', e.target.value)} error={!!errors.description} helperText={errors.description} /></Grid>

          <Grid item xs={12} md={4}><TextField label="Minimal Point" fullWidth value={form.minimalPoint} onChange={e => change('minimalPoint', e.target.value)} error={!!errors.minimalPoint} helperText={errors.minimalPoint} /></Grid>
          <Grid item xs={12} md={4}><TextField label="Maximum Point" fullWidth value={form.maximumPoint} onChange={e => change('maximumPoint', e.target.value)} error={!!errors.maximumPoint} helperText={errors.maximumPoint} /></Grid>
          <Grid item xs={12} md={4}><TextField label="Tuned In Works" fullWidth value={form.tunedInWorks} onChange={e => change('tunedInWorks', e.target.value)} /></Grid>
        </Grid>
      </Paper>

      {DisciplineSection()}
      {CoordinatesSection()}
      {AuthorSection()}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </form>
  )
}
