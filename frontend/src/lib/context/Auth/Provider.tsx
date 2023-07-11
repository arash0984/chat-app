'use client'

import { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import Context from './Context'

interface ProviderProps {
  children: React.ReactNode
}

export default function Provider({ children }: ProviderProps) {
  const [email, setEmail] = useState<string | undefined>(undefined)

  const authenticate = async () => {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken == null) {
      setEmail(undefined)
      return
    }
    const jwt = jwt_decode<{ email?: string }>(accessToken)
    if (jwt.email === undefined || jwt.email === '') {
      setEmail(undefined)
      return
    }
    setEmail(jwt.email)
  }

  useEffect(() => {
    authenticate()
  }, [])

  return <Context.Provider value={{ email, setEmail }}>{children}</Context.Provider>
}
