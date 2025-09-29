/* =====================================================================
   src/App.jsx
   ===================================================================== */
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material'
import LabList from './components/LabList'
import LabDetails from './components/LabDetails'
import SpecialOps from './components/SpecialOps'

export default function App(){
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>IS-Lab1 — LabWork Manager</Typography>
          <Button color="inherit" component={Link} to="/">List</Button>
          <Button color="inherit" component={Link} to="/special">Special Ops</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<LabList/>} />
          <Route path="/lab/:id" element={<LabDetails/>} />
          <Route path="/special" element={<SpecialOps/>} />
        </Routes>
      </Container>
    </div>
  )
}