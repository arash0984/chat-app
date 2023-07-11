'use client'

import Link from 'next/link'
import { useContext, useState } from 'react'
import styled from 'styled-components'
import { AuthContext } from 'lib/context/Auth'
import { Box, Flex } from 'lib/component/Toolkit'
import { createUser } from 'lib/api/user'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const { email } = useContext(AuthContext)
  const [inputName, setInputName] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [inputConfirmPassword, setInputConfirmPassword] = useState('')

  const handleNameInput = (event: any) => {
    if (!event.currentTarget.validity.valid) {
      return
    }
    setInputName(event.target.value)
  }

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

  const handleConfirmPasswordInput = (event: any) => {
    if (!event.currentTarget.validity.valid) {
      return
    }
    setInputConfirmPassword(event.target.value)
  }

  const handleSubmitButton = async () => {
    if (inputPassword !== inputConfirmPassword) {
      // TODO: Toastify error!
      return
    }

    try {
      await createUser({ name: inputName, email: inputEmail, password: inputPassword })
      router.replace('/')
    } catch (error: any) {
      // TODO: Toastify error!
      console.log(error)
      return
    }
  }

  if (email !== undefined && email !== '') {
    router.replace('/')
  }

  return (
    <Box margin="100px auto">
      <Container>
        <Heading>Sign up</Heading>
        <Box marginTop="30px">
          <p>Name:</p>
          <Input onChange={handleNameInput} type="text" />
        </Box>
        <Box marginTop="5px">
          <p>Email:</p>
          <Input onChange={handleEmailInput} type="email" />
        </Box>
        <Box marginTop="5px">
          <p>Password:</p>
          <Input onChange={handlePasswordInput} type="password" />
        </Box>
        <Box marginTop="5px">
          <p>Confirm Password:</p>
          <Input onChange={handleConfirmPasswordInput} type="password" />
        </Box>
        <Button onClick={handleSubmitButton}>Submit</Button>
      </Container>
      <Flex alignItems="center" justifyContent="center">
        <StyledLink href="/">Already have an account? Log in now!</StyledLink>
      </Flex>
    </Box>
  )
}
