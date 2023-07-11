'use client'

import Link from 'next/link'
import { useContext, useState } from 'react'
import useSWR from 'swr'
import styled from 'styled-components'
import { AuthContext } from 'lib/context/Auth'
import { Box, Flex } from 'lib/component/Toolkit'
import { createSession, listUsers } from 'lib/api/user'
import { Nav } from 'lib/component/Nav'
import { SideNav } from 'lib/component/SideNav'
import { MessageComp } from 'lib/component/Message'

const Button = styled.button`
  background-color: #070599;
  color: white;
  padding: 5px;
  margin: 20px 0 0 0;
  width: 100%;
`

const Container = styled(Flex)`
  align-items: center;
  border: 1px solid gray;
  flex-direction: column;
  justify-content: center;
  padding: 40px 20px;
`

const Heading = styled.h1`
  font-size: 30px;
`

const Input = styled.input`
  min-width: 300px;
`

const StyledLink = styled(Link)`
  color: #070599;
`

export default function Home() {
  const { email, setEmail } = useContext(AuthContext)
  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [otherSide, setOtherSide] = useState('')

  const handleEmailInput = (event: any) => {
    if (!event.currentTarget.validity.valid) {
      return
    }
    setInputEmail(event.target.value)
  }

  const handlePasswordInput = (event: any) => {
    if (!event.currentTarget.validity.valid) {
      return
    }
    setInputPassword(event.target.value)
  }

  const handleSubmitButton = async () => {
    const session = await createSession({ email: inputEmail, password: inputPassword })
    if (session.token === '') {
      // TODO: Show an error notification.
      return
    }
    localStorage.setItem('access_token', session.token)
    setEmail(inputEmail)
  }

  const { data: contact, error: contactError } = useSWR(email, (email) => listUsers(email), {
    refreshInterval: 500,
  })

  if (email === undefined || email === '') {
    return (
      <Box margin="100px auto">
        <Container>
          <Heading>Log in</Heading>
          <Box marginTop="30px">
            <p>Email:</p>
            <Input onChange={handleEmailInput} type="email" />
          </Box>
          <Box marginTop="5px">
            <p>Password:</p>
            <Input onChange={handlePasswordInput} type="password" />
          </Box>
          <Button onClick={handleSubmitButton}>Submit</Button>
        </Container>
        <Flex alignItems="center" justifyContent="center">
          <StyledLink href="/sign-up">Don't have an account? Sign up now!</StyledLink>
        </Flex>
      </Box>
    )
  }

  return (
    <main>
      <Nav name={email} />
      <Flex>
        <SideNav users={contact} otherSide={otherSide} setOtherSide={setOtherSide} />
        <MessageComp fromEmail={email} toEmail={otherSide} />
      </Flex>
    </main>
  )
}
