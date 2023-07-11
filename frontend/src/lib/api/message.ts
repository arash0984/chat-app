import customAxios from '.'

export interface Message {
  from: string
  to: string
  body: string
}

export async function createMessage(message: Message) {
  const { data } = await customAxios.request<{ message: Message }>({
    data: message,
    method: 'post',
    url: `/messages`,
  })
  return data.message
}

export async function listMessages(fromEmail: string, toEmail: string) {
  const { data } = await customAxios.request<{ messages: Message[] }>({
    method: 'get',
    url: `/messages?from=${fromEmail}&to=${toEmail}`,
  })
  return data.messages
}
