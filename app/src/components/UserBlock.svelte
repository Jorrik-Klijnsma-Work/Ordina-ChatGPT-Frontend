<script lang="ts">
  import { fade } from 'svelte/transition'
  import { makeApiCall } from '../hooks/apiCalls'
  import { user } from '../hooks/stores'
  import { activeConversation, chats } from '../hooks/stores'
  import type { ConversationType } from './types'
  import Spinner from './Spinner.svelte'

  export let modalHidden: boolean = true
  let settingsOpen: boolean = false
  let creating: boolean = false
  let systemPrompt: string = ''
  let temperature: number = 1.0
  let topP: number = 1.0

  const handleLogout = () => {
    localStorage.removeItem('userSessionToken')
    localStorage.removeItem('userId')
    user.set(undefined)
    window.location.href = '/'
  }

  const startNewConversation = async () => {
    creating = true
    // Create a new conversation
    try {
      const result: ConversationType = (await makeApiCall({
        apiFunction: 'create-conversation',
        content: {
          login: {
            user_id: $user.userId,
            session_token: $user.userSessionToken,
          },
          conversation: {
            openai_conv: {
              temperature: temperature,
              top_p: topP,
              messages: [
                {
                  role: 'system',
                  content: systemPrompt,
                },
              ],
            },
            user_id: $user.userId,
          },
        },
      })) as ConversationType

      // Update stores
      activeConversation.set(result)
      chats.update((chats) => {
        return [...chats, result]
      })
    } catch (e) {
      console.error(e)
      creating = false
    } finally {
      // Close modal
      creating = false
      modalHidden = true
      settingsOpen = false

      // Reset settings
      systemPrompt = ''
      temperature = 1.0
      topP = 1.0
    }
  }
</script>

<div class="flex h-16 md:h-20 flex-row text-center gap-4">
  <button
    class="flex-1 cursor-pointer p-4 hover:bg-gray-100 align-middle"
    aria-label="New Chat"
    on:click={() => (modalHidden = false)}
  >
    New Chat
  </button>
  <button
    class="flex-1 cursor-pointer p-4 hover:bg-gray-100 align-middle"
    aria-label="Log Out"
    on:click={() => {
      handleLogout()
    }}
  >
    Log Out
  </button>
</div>

{#if !modalHidden}
  <div
    transition:fade={{ duration: 200 }}
    class="w-screen h-screen bg-white bg-opacity-50 fixed top-0 left-0 z-50 backdrop-blur-sm text-black overflow-auto"
  >
    <div
      class="w-screen h-screen absolute top-0 left-0 -z-40"
      on:click={() => (modalHidden = true)}
      on:keypress={() => (modalHidden = true)}
    />
    <div class="container bg-white shadow mx-auto w-3/4 mt-12 p-12 z-50">
      <h1 class="text-3xl mb-4">New conversation</h1>
      <p class="mb-8">
        Start a new conversation with the AI. You can customize the way the chat
        responds by tuning the settings below.
      </p>
      <form on:submit|preventDefault={startNewConversation}>
        <div id="accordion-collapse" data-accordion="collapse">
          <h2
            id="accordion-collapse-heading-1"
            on:click={() => (settingsOpen = !settingsOpen)}
            on:keypress={() => (settingsOpen = !settingsOpen)}
          >
            <button
              type="button"
              class="flex items-center justify-between w-full p-5 font-medium text-left cursor-pointer border border-gray-200 rounded-full hover:bg-gray-100"
              data-accordion-target="#accordion-collapse-body-1"
              aria-expanded="true"
              aria-controls="accordion-collapse-body-1"
            >
              <span>Conversation settings</span>
              <i
                class:rotate-180={settingsOpen}
                class="fa-solid fa-chevron-down"
              />
            </button>
          </h2>
          <div
            id="accordion-collapse-body-1"
            class:hidden={!settingsOpen}
            aria-labelledby="accordion-collapse-heading-1"
          >
            <div
              class="p-5 px-8 border-gray-200 border-l shadow-inner border-b border-r mx-8"
            >
              <label
                for="systemPrompt"
                class="block mb-2 font-bold cursor-pointer">System prompt</label
              >
              <p class="italic text-sm mb-2">
                The "System Prompt" to use. This is the text that the AI will
                use to generate all of its responses. E.g. using a prompt like
                "Act like a pirate" will make the AI respond like a pirate for
                every chat message.
              </p>
              <textarea
                id="systemPrompt"
                class="w-full border rounded p-2 mb-4 px-4"
                bind:value={systemPrompt}
                placeholder="Type your system prompt here..."
              />
              <label
                for="temperature"
                class="block mb-2 font-bold cursor-pointer">Temperature</label
              >
              <p class="italic text-sm mb-2">
                What sampling temperature to use, between 0 and 2. Higher values
                means the model will take more risks. Try 0.9 for more creative
                applications, and 0 for ones with a well-defined answer. We
                generally recommend altering this or "Top P" but not both.
              </p>
              <input
                id="temperature"
                type="number"
                min="0.0"
                max="2.0"
                step="0.1"
                bind:value={temperature}
                class="w-full border rounded p-2 px-4 mb-4"
              />
              <label for="topP" class="block mb-2 font-bold cursor-pointer"
                >Top-P</label
              >
              <p class="italic text-sm mb-2">
                An alternative to sampling with temperature, called nucleus
                sampling, where the model considers the results of the tokens
                with top_p probability mass. So 0.1 means only the tokens
                comprising the top 10% probability mass are considered. We
                generally recommend altering this or temperature but not both.
              </p>
              <input
                id="topP"
                type="number"
                min="0.0"
                max="1.0"
                step="0.05"
                bind:value={topP}
                class="w-full border rounded p-2 mb-4 px-4"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-row gap-2">
          <button
            class="bg-gray-200 rounded-full hover:bg-gray-300 px-12 py-4 mt-12 w-full"
            type="button"
            on:click={() => (modalHidden = true)}>Cancel</button
          >
          <button
            class="bg-orange-500 rounded-full text-white hover:bg-orange-600 px-12 py-4 mt-12 w-full"
            type="submit"
            >{#if creating}<div class="w-16 mx-auto">
                <Spinner />
              </div>{:else}Submit{/if}</button
          >
        </div>
      </form>
    </div>
  </div>
{/if}
