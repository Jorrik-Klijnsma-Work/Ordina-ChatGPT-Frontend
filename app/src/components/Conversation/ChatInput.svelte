<script lang="ts">
  import { makeApiCall } from '../../hooks/apiCalls'
  import { user } from '../../hooks/stores'
  import { activeConversation, chats } from '../../hooks/stores'
  import type {
    ConversationRequestType,
    ConversationType,
    MessagesType,
  } from '../types'

  let chatInputMessage: string
  export let loading: boolean = false

  const handleInput = async () => {
    loading = true
    const newItem: MessagesType = {
      role: 'user',
      content: chatInputMessage,
    }
    chatInputMessage = ''

    activeConversation.update((conversation) => ({
      ...conversation,
      openai_conv: {
        ...conversation.openai_conv,
        messages: [...conversation.openai_conv.messages, newItem],
      },
    }))

    const response: ConversationType = await makeApiCall({
      apiFunction: 'request-chat-response',
      content: {
        login: { user_id: $user.userId, session_token: $user.userSessionToken },
        conversation: $activeConversation,
      } as ConversationRequestType,
    })
    activeConversation.set(response)

    chats.update((chats) => {
      const newChats = chats.map((chat) => {
        if (chat.id === response.id) {
          return response
        }
        return chat
      })
      return newChats
    })

    loading = false
  }
</script>

<form
  on:submit|preventDefault={handleInput}
  class="flex flex-row items-center border-t border-gray-100 bg-white border-l h-16 md:h-20 w-full"
>
  <input
    class="px-8 py-4 flex-1 border-gray-300 outline-none"
    type="text"
    placeholder="Your chat message"
    disabled={loading}
    bind:value={chatInputMessage}
  />
  <button
    type="submit"
    disabled={loading || !chatInputMessage}
    class="text-white flex-none text-center px-12 mr-4 rounded-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200"
  >
    Send
  </button>
</form>
