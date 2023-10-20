<script lang="ts">
  import { user } from '../hooks/stores'
  import { chats, activeConversation } from '../hooks/stores'
  import { makeApiCall } from '../hooks/apiCalls'
  import type { ConversationType } from './types'
  import { onMount } from 'svelte'
  import Spinner from './Spinner.svelte'
  import { fade } from 'svelte/transition'

  let loading: boolean = true
  let deleting: boolean = false
  let confirmDialogHidden: boolean = true
  let deleteCandidate: ConversationType | undefined = undefined

  onMount(async () => {
    // Get all conversations for this user
    try {
      const result = await makeApiCall({
        apiFunction: 'my-conversations',
        content: {
          user_id: $user.userId,
          session_token: $user.userSessionToken,
        },
      })

      // Set the conversations in the store
      chats.set(result)
    } catch (e) {
      console.error(e)
    } finally {
      loading = false
    }
  })

  const openConversation = (conversation: ConversationType) => {
    activeConversation.set(conversation)
  }

  const openConfirmDialog = (conversation: ConversationType) => {
    deleteCandidate = conversation
    confirmDialogHidden = false
  }

  const deleteConversation = async (conversation: ConversationType) => {
    deleting = true
    await makeApiCall({
      apiFunction: 'delete-conversation',
      content: {
        login: {
          user_id: $user.userId,
          session_token: $user.userSessionToken,
        },
        conversation_id: conversation.id,
      },
    })

    // Remove the conversation from the store
    chats.update((chats) => {
      return chats.filter((chat) => {
        return chat.id !== conversation.id
      })
    })

    // If the conversation we deleted was the active conversation, set the active conversation to undefined
    if ($activeConversation?.id === conversation.id) {
      activeConversation.set(undefined)
    }

    deleteCandidate = undefined
    confirmDialogHidden = true
    deleting = false
  }

  const closeConfirmationDialog = () => {
    confirmDialogHidden = true
    deleteCandidate = undefined
    deleting = false
  }
</script>

{#if loading}
  <div class="flex justify-center items-center h-full">
    <Spinner />
  </div>
{:else}
  <ul class="px-2">
    {#if $chats}
      {#each $chats as chat, index}
        <li
          transition:fade={{ duration: 400, delay: index * 200 }}
          class="flex flex-row justify-center items-center rounded hover:bg-gray-100 cursor-pointer"
          class:bg-gray-100={chat.id === $activeConversation?.id}
        >
          <div
            class="flex-1 flex p-3 px-6 truncate"
            on:click={() => {
              openConversation(chat)
            }}
            on:keydown={() => {
              openConversation(chat)
            }}
          >
            <p class="truncate">
              {chat.openai_conv.messages.find((message) => {
                return message.role === 'system'
              })?.content ||
                chat.openai_conv.messages.find((message) => {
                  return message.role === 'user'
                })?.content ||
                'No messages yet'}
            </p>
          </div>
          <div class="flex-none pr-4">
            <button on:click={() => openConfirmDialog(chat)}>
              <div
                class="py-1 px-3 bg-red-400 hover:bg-red-600 rounded-full text-white flex items-center justify-center text-xs"
              >
                <i class="fa-solid fa-xmark" />
              </div>
            </button>
          </div>
        </li>
      {/each}
    {/if}
  </ul>
{/if}

{#if !confirmDialogHidden}
  <div
    transition:fade={{ duration: 200 }}
    class="w-screen h-screen bg-white bg-opacity-50 fixed top-0 left-0 z-50 backdrop-blur-sm text-black overflow-auto"
  >
    <div
      class="w-screen h-screen absolute top-0 left-0 -z-40"
      on:click={closeConfirmationDialog}
      on:keypress={closeConfirmationDialog}
    />
    <div class="container bg-white rounded shadow mx-auto w-3/4 mt-12 p-12">
      <h1 class="text-3xl mb-4">
        Are you sure you want to delete this conversation?
      </h1>
      <div class="flex flex-row gap-2">
        <button
          class="bg-gray-200 rounded-full hover:bg-gray-300 px-12 py-4 text-black mt-12 w-full"
          type="button"
          on:click={() => closeConfirmationDialog()}>No</button
        >
        <button
          class="bg-red-600 rounded-full hover:bg-red-700 px-12 py-4 text-white mt-12 w-full"
          type="submit"
          on:click={() => deleteConversation(deleteCandidate)}
          >{#if deleting}<div class="w-16 mx-auto">
              <Spinner />
            </div>{:else}Yes{/if}</button
        >
      </div>
    </div>
  </div>
{/if}
