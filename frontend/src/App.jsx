import React from 'react'
import { AuthProvider } from './contexts/RoleBasedAuthContext.jsx'
import RoleBasedRouter from './components/RoleBasedRouter.jsx'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <RoleBasedRouter />
    </AuthProvider>
  )
}

export default App
