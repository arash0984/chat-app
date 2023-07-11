'use client'

import { createContext } from 'react'

export interface Auth {
  email?: string
  setEmail?: any
}

const Context = createContext<Auth>({})

export default Context
