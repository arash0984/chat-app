import customAxios from 'lib/api'

export interface Session {
  token: string
}

export interface User {
  name?: string
  email?: string
  password?: string
}

export async function createSession(user: User) {
  const { data } = await customAxios.request<{ session: Session }>({
    data: user,
    method: 'post',
    url: '/sessions',
  })
  return data.session
}

export async function createUser(user: User) {
  const { data } = await customAxios.request<{ user: User }>({
    data: user,
    method: 'post',
    url: '/users',
  })
  return data.user
}

export async function listUsers(email: string) {
  const { data } = await customAxios.request<{ users: User[] }>({
    method: 'get',
    url: `/users?email=${email}`,
  })
  return data.users
}
