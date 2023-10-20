<script lang="ts">
  import ChatOutput from './ChatOutput.svelte'
  import ChatInput from './ChatInput.svelte'
  import { activeConversation } from '../../hooks/stores'
  let waitingForChatResponse: boolean = false

  let systemPrompt: string | undefined
  let container: HTMLDivElement
  const scroll = () => {
    container.scrollTop = container.scrollHeight
  }

  // Scroll down when new messages arrive
  $: if ($activeConversation) {
    setTimeout(() => scroll(), 200)

    const found = $activeConversation.openai_conv.messages.find((message) => {
      if (message.role === 'system') {
        return true
      }
      return false
    })

    if (found) {
      systemPrompt = found.content
    } else {
      systemPrompt = undefined
    }
  }
</script>

<div class="border-gray-100 h-full flex flex-col">
  {#if systemPrompt}
    <div
      class="flex-none text-center text-gray-600 mx-4 p-8 border-b border-gray-100"
    >
      <p><span class="italic">System prompt:</span> {systemPrompt}</p>
    </div>
  {/if}
  <div
    class="flex-grow overflow-y-scroll w-full shadow-inner scroll-smooth"
    bind:this={container}
  >
    <ChatOutput
      on:scroll={() => scroll()}
      bind:loading={waitingForChatResponse}
    />
  </div>
  <div class="flex-none">
    <ChatInput bind:loading={waitingForChatResponse} />
  </div>
</div>
