<script lang="ts">
  import ChatGPTLogo from '../../assets/ChatGPT_logo.svg'
  import profilePicture from '../../assets/user.png'
  import { activeConversation } from '../../hooks/stores'
  import Spinner from '../Spinner.svelte'
  import { createEventDispatcher, onMount } from 'svelte'

  const dispatch = createEventDispatcher()

  export let loading: boolean = true

  onMount(() => {
    setTimeout(() => {
      dispatch('scroll')
    }, 200)
  })
</script>

{#if $activeConversation}
  <div class="flex flex-col">
    <div class="flex flex-1 justify-center w-full">
      <ul class="p-12 flex w-full flex-col justify-end">
        {#each $activeConversation.openai_conv.messages as message}
          {#if message.role !== 'system'}
            <li
              class="flex justify-end mb-4"
              class:align-right={message.role === 'user'}
              class:align-left={message.role !== 'user'}
            >
              <div class="content bg-gray-100 rounded">
                <p>
                  {message.content}
                </p>
                <div class="user-image">
                  {#if message.role === 'assistant'}
                    <img src={ChatGPTLogo} alt={'Chat message from ChatGPT'} />
                  {:else if message.role === 'user'}
                    <img src={profilePicture} alt={`Chat message from user`} />
                  {/if}
                </div>
              </div>
            </li>
          {/if}
        {/each}
        {#if loading}
          <li class="flex justify-end mb-4 mt-8 align-left">
            <Spinner />
          </li>
        {/if}
      </ul>
    </div>
  </div>
{/if}

<style lang="scss">
  ul {
    li {
      .content {
        padding: 0.5rem 1rem;
        // background: rgba(255, 255, 255, 0.05);
        // border-radius: 15px;
        max-width: 80%;
        text-align: right;
        position: relative;

        .user-image {
          position: absolute;
          right: 0;
          left: auto;
          bottom: 0;
          width: 1.5rem;
          height: 1.5rem;

          img {
            border-radius: 100%;
            translate: 50% 50%;
          }
        }
      }

      &.align-left {
        flex-direction: row-reverse;

        .content {
          text-align: left;

          .user-image {
            left: 0;
            right: auto;

            img {
              translate: -50% 50%;
            }
          }
        }
      }
    }
  }
</style>
