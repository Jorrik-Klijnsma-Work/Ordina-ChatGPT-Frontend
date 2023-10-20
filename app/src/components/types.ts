export type UserType = {
  userId: number
  userSessionToken: string
}
type RoleType = 'system' | 'user' | 'assistant'

export type MessagesType = {
  role: RoleType
  content: string
  name?: string
}

// export type ConversationType = {
//   model: 'gpt-3.5-turbo'
//   messages: MessagesType[]
//   temperature?: number
//   top_p?: number
// }


type Message = {
  role: string
  content: string
}
type OpenaiConv = {
  temperature: number
  top_p: number
  messages: Message[]
}
export type ConversationType = {
  openai_conv: OpenaiConv
  user_id: number
  id?: number
}

type Login = {
  user_id: number
  session_token: string
}

export type ConversationRequestType = {
  login: Login,
  conversation: ConversationType
}

export type DeleteConversationRequestType = {
  login: Login,
  conversation_id: number
}