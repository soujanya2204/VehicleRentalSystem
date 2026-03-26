import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const CREDENTIALS = { email: 'vendor@rentwheels.com', password: 'vendor123' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('vendor_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (email, password) => {
    if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
      const userData = { email, role: 'vendor', name: 'Vendor Admin' }
      sessionStorage.setItem('vendor_user', JSON.stringify(userData))
      setUser(userData)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('vendor_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
