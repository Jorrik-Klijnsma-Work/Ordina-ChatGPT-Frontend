# API Documentation

## Table of Contents

- [Introduction](#Introduction)
- [GetUserChatList](#GetUserChatList)
- [GetChat](#GetChat)
- [MakeNewChat](#MakeNewChat)
- [RequestChatResponse](#RequestChatResponse)
- [RequestMagicToken](#RequestMagicToken)
- [LoginUser](#LoginUser)
- [Types](#Types)
- [Changelog](#Changelog)

---

## Introduction

This API is designed for frontend developers working on a Svelte application. It allows interaction with our Azure backend service for managing chat sessions. The API is designed to be flexible and easy to use, providing endpoints for managing chat sessions, authenticating users, and interacting with chat content.

---

## GetUserChatList

This function retrieves a list of all chat sessions for a specific user. Each chat session contains a unique `chatId` and a `title`.

### Request

```javascript
// JavaScript
fetch('https://api.yourservice.com/GetUserChatList', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 'asdvq346fg',
  }),
})
```

```javascript
// TypeScript
import { GetUserChatListRequest } from 'api-types'

const request: GetUserChatListRequest = {
  userId: 'asdvq346fg',
}

fetch('https://api.yourservice.com/GetUserChatList', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(request),
})
```

### Response

The response will be an array of chat objects. Each object contains `chatId` and `title` fields.

```json
[
  {
    "chatId": "pw4gbn97vgq34ognae90vuaehwp498hbv",
    "title": "My first Chat"
  },
  {
    "chatId": "wyt234t87h5g9aenv07w4yherv",
    "title": "My second Chat"
  }
]
```

---

## GetChat

This function retrieves the history of a chat session. The `chatId` is required to fetch the correct chat session.

### Request

```javascript
// JavaScript
fetch('https://api.yourservice.com/GetChat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    chatId: 'pw4gbn97vgq34ognae90vuaehwp498hbv',
  }),
})
```

```javascript
// TypeScript
import { GetChatRequest } from 'api-types'

const request: GetChatRequest = {
  chatId: 'pw4gbn97vgq34ognae90vuaehwp498hbv',
}

fetch('https://api.yourservice.com/GetChat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(request),
})
```

### Response

The response will be a chat object which includes the `title` and a list of `messages`. Each message in the list includes a `role` and `content`.

```json
{
  "title": "My first Chat",
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ]
}
```

---

## MakeNewChat

This function creates a new chat session with the specified `temp`, `persona`, and `top_p` parameters.

### Request

```javascript
// JavaScript
fetch('https://api.yourservice.com/MakeNewChat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    temp: 0.4,
    persona: 'persona system-prompt',
    top_p: 0.2,
  }),
})
```

```javascript
// TypeScript
import { MakeNewChatRequest } from 'api-types'

const request: MakeNewChatRequest = {
  temp: 0.4,
  persona: 'persona system-prompt',
  top_p: 0.2,
}

fetch('https://api.yourservice.com/MakeNewChat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(request),
})
```

### Response

The response will be a chat object which includes the `title`, `chatId`, and a list of `messages`. Each message in the list includes a `role` and `content`.

```json
{
  "title": "My third Chat",
  "chatId": "asdgbvawf723taieuvbo",
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ]
}
```

This function creates a new chat session with the specified parameters and returns the chat ID, title, and an initial message.

---

## RequestChatResponse

This function allows a user to send a message in a chat session and receive a response from the assistant.

### Request

```javascript
// JavaScript
fetch('https://api.yourservice.com/requestChatResponse', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    chatId: 'wyt234t87h5g9aenv07w4yherv',
    content: 'input content',
  }),
})
```

```javascript
// TypeScript
import { RequestChatResponseRequest } from 'api-types'

const request: RequestChatResponseRequest = {
  chatId: 'wyt234t87h5g9aenv07w4yherv',
  content: 'input content',
}

fetch('https://api.yourservice.com/requestChatResponse', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(request),
})
```

### Response

The response will be a chat object which includes the `chatId` and a list of `messages`. Each message in the list includes a `role` and `content`.

```json
{
  "chatId": "wyt234t87h5g9aenv07w4yherv",
  "messages": [
    {
      "role": "assistant",
      "content": "Hello!"
    }
  ]
}
```

---

## RequestMagicToken

This function requests a magic token for the user. The Backend service sends a token to the user email if it's an email from the @ordina.nl domain.

### Request

```javascript
// JavaScript
fetch('https://api.yourservice.com/requestMagicToken', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@ordina.nl',
  }),
})
```

```javascript
// TypeScript
import { RequestMagicTokenRequest } from 'api-types'

const request: RequestMagicTokenRequest = {
  email: 'user@ordina.nl',
}

fetch('https://api.yourservice.com/requestMagicToken', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(request),
})
```

---

## LoginUser

This function logs in a user using a magic token and returns a user ID and a session token.

### Request

```javascript
// JavaScript
fetch('https://api.yourservice.com/LoginUser', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    magicToken: 'your_magic_token',
  }),
})
```

```javascript
// TypeScript
import { LoginUserRequest } from 'api-types'

const request: LoginUserRequest = {
  magicToken: 'your_magic_token',
}

fetch('https://api.yourservice.com/LoginUser', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(request),
})
```

### Response

The response will be a user object which includes the `userId` and a `sessionToken`.

```json
{
  "userId": "asdvq346fg",
  "sessionToken": "qwiuothq34gfbnap97rgw45"
}
```

---

## Types

```typescript
interface ChatMessage {
  role: string
  content: string
}

interface GetUserChatListRequest {
  userId: number
}

interface GetUserChatListResponse {
  chatId: string
  title: string
}

interface GetChatRequest {
  chatId: string
}

interface GetChatResponse {
  title: string
  messages: ChatMessage[]
}

interface MakeNewChatRequest {
  temp: number
  persona: string
  top_p: number
}

interface MakeNewChatResponse {
  title: string
  chatId: string
  messages: ChatMessage[]
}

interface RequestChatResponseRequest {
  chatId: string
  content: string
}

interface RequestChatResponseResponse {
  chatId: string
  messages: ChatMessage[]
}

interface RequestMagicTokenRequest {
  email: string
}

interface LoginUserRequest {
  magicToken: string
}

interface LoginUserResponse {
  userId: number
  sessionToken: string
}
```

## Changelog

### v1.0

- Initial release of the API documentation.
