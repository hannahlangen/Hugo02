import React, { createContext, useContext, useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    const savedToken = localStorage.getItem('hugo_token')
    const savedUser = localStorage.getItem('hugo_user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('hugo_user')
      }
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Login failed')
      }
      
      const data = await response.json()
      
      // Store token and user data
      localStorage.setItem('hugo_token', data.access_token)
      localStorage.setItem('hugo_user', JSON.stringify(data.user))
      setToken(data.access_token)
      setUser(data.user)
      
      return data
    } catch (error) {
      throw error
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('hugo_token')
    localStorage.removeItem('hugo_user')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext as RoleBasedAuthContext }
