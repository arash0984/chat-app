import { Flex } from '../Toolkit'

import styled from 'styled-components'
import { User } from 'lib/api/user'

const Container = styled(Flex)`
  flex-direction: column;
  min-width: 300px;
  border-right: 1px solid gray;
  height: calc(100vh - 70px);
`

const StyledUser = styled(Flex)`
  align-items: center;
  width: 300px;
  border-bottom: 1px solid lightgray;
  height: 60px;
  padding: 0 0 0 20px;

  &:hover {
    background-color: lightgray;
    cursor: pointer;
  }
`

const FocusedUser = styled(Flex)`
  align-items: center;
  width: 300px;
  border-bottom: 1px solid lightgray;
  height: 60px;
  padding: 0 0 0 20px;
  background-color: lightgray;

  &:hover {
    cursor: pointer;
  }
`

export default function SideNav({ users, otherSide, setOtherSide }: any) {
  console.log(users)
  return (
    <Container>
      {users !== undefined
        ? users.map((user: User, index: number) =>
            user.email === otherSide ? (
              <FocusedUser onClick={() => setOtherSide(user.email)} key={index}>
                {user.email}
              </FocusedUser>
            ) : (
              <StyledUser onClick={() => setOtherSide(user.email)} key={index}>
                {user.email}
              </StyledUser>
            ),
          )
        : null}
    </Container>
  )
}
