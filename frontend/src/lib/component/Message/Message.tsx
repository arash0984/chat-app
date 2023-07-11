'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Flex, Text } from '../Toolkit'
import styled from 'styled-components'
import { createMessage, listMessages, Message } from 'lib/api/message'

const Container = styled(Flex)`
  position: relative;
  flex-direction: column;
  height: calc(100vh - 70px);
  width: 100%;
`

const TextBox = styled(Flex)`
  flex-direction: column;
  height: calc(100vh - 100px - 70px);
  width: 100%;
`

const SendBox = styled(Flex)`
  border-top: 1px solid gray;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
`

const Input = styled.input`
  width: calc(100% - 150px);
  padding: 5px 20px;
`

const Button = styled.button`
  margin: 0 0 0 10px;
  background-color: #070599;
  color: white;
  padding: 5px 20px;
  cursor: pointer;
`

const MessageRight = styled(Flex)`
  border: 1px solid gray;
  border-radius: 10px;
  padding: 10px 20px;
  max-width: 250px;
  margin: 5px 10px;
  align-self: flex-start;
`

const MessageLeft = styled(Flex)`
  border: 1px solid gray;
  border-radius: 10px;
  padding: 10px 20px;
  max-width: 250px;
  margin: 5px 10px;
  align-self: flex-end;
`

export default function MessageComp({ fromEmail, toEmail }: any) {
  console.log(toEmail)
  const [inputText, setInputText] = useState('')

  const handleTextInput = (event: any) => {
    if (!event.currentTarget.validity.valid) {
      return
    }
    setInputText(event.target.value)
  }

  const handleSendButton = async () => {
    try {
      await createMessage({ from: fromEmail, to: toEmail, body: inputText })
    } catch (error: any) {
      console.log(error)
    }
    setInputText('')
  }

  const { data, error } = useSWR(
    fromEmail !== undefined && toEmail !== undefined ? [fromEmail, toEmail] : null,
    () => listMessages(fromEmail, toEmail),
    {
      refreshInterval: 500,
    },
  )

  return (
    <Container>
      <TextBox>
        {data !== undefined
          ? data.map((value: Message, index: number) =>
              fromEmail === value.from ? (
                <MessageRight key={index}>{value.body}</MessageRight>
              ) : (
                <MessageLeft key={index}>{value.body}</MessageLeft>
              ),
            )
          : null}
      </TextBox>
      <SendBox>
        <Input value={inputText} onChange={handleTextInput} type="text" placeholder="Write message here..." />
        <Button onClick={handleSendButton}>Send</Button>
      </SendBox>
    </Container>
  )
}
