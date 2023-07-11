'use client'

import { Flex } from '../Toolkit'
import styled from 'styled-components'
import { useContext } from 'react'
import { AuthContext } from 'lib/context/Auth'

const Container = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  background-color: #070599;
  color: white;
  height: 70px;
  padding: 0 30px;
`

const Button = styled.button``

export default function Nav({ name }: { name: string }) {
  const { setEmail } = useContext(AuthContext)

  const handleLogOut = () => {
    localStorage.removeItem('access_token')
    setEmail(undefined)
  }

  return (
    <Container>
      Welcome {name}
      <Button onClick={handleLogOut}>Log out</Button>
    </Container>
  )
}
