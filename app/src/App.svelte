<script lang="ts">
  import ChatList from './components/ChatList.svelte'
  import UserBlock from './components/UserBlock.svelte'
  import Login from './components/Login.svelte'
  import { user } from './hooks/stores'
  import { onMount } from 'svelte'
  import { makeApiCall } from './hooks/apiCalls'
  import { activeConversation } from './hooks/stores'
  import Header from './components/Header.svelte'
  import Conversation from './components/Conversation/Conversation.svelte'
  import Spinner from './components/Spinner.svelte'

  const LOCALSTORAGE_SESSION_TOKEN_KEY = 'userSessionToken'
  const LOCALSTORAGE_USER_ID = 'userId'
  let loading: boolean = true

  type Credentials = {
    userSessionToken: string
    userId: number
  }

  const getCredentialsFromStorage = (): Credentials => {
    const storedToken: string = localStorage.getItem(
      LOCALSTORAGE_SESSION_TOKEN_KEY
    )
    const storedUserId: number = parseInt(
      localStorage.getItem(LOCALSTORAGE_USER_ID)
    )
    return { userSessionToken: storedToken, userId: storedUserId }
  }

  const getCredentialsFromUrlParamters = async (): Promise<Credentials> => {
    const urlParams = new URLSearchParams(window.location.search)
    const userId = parseInt(urlParams.get('user_id'))
    const token = urlParams.get('token')
    if (userId === null || token === null) {
      throw new Error('Invalid URL parameters')
    }
    const data = await makeApiCall({
      apiFunction: 'link_login',
      content: { user_id: userId, login_token: token },
    })
    return {
      userSessionToken: data['session_token'],
      userId: parseInt(data['user_id']),
    }
  }

  onMount(async () => {
    let credentials: Credentials = getCredentialsFromStorage()

    if (credentials.userSessionToken !== null && credentials.userId !== null) {
      user.set({
        userId: credentials.userId,
        userSessionToken: credentials.userSessionToken,
      })
    } else {
      try {
        credentials = await getCredentialsFromUrlParamters()
        localStorage.setItem(
          LOCALSTORAGE_SESSION_TOKEN_KEY,
          credentials.userSessionToken
        )
        localStorage.setItem(
          LOCALSTORAGE_USER_ID,
          credentials.userId.toString()
        )
        window.location.href = window.location.origin
      } catch (e) {}
    }
    loading = false
  })
</script>

{#if loading}
  <div class="flex items-center justify-center h-full">
    <Spinner />
  </div>
{:else if $user === undefined || (!$user.userSessionToken && !$user.userId)}
  <Login />
{:else}
  <div class="lg:hidden mt-8 p-4 text-center">
    <p>This device screen is too small. Please use a larger screen.</p>
  </div>
  <div class="hidden lg:block h-screen">
    <Header />
    <div class="flex flex-col lg:flex-row pt-16 md:pt-20 h-screen">
      <div class="shadow lg:w-1/5">
        <div class="mb-4">
          <h1 class="ml-4 px-4 my-6 text-4xl text-gradient font-semibold">
            Conversations
          </h1>
          <hr class="mx-4 mb-4 border-gray-100" />
          <ChatList />
        </div>
        <div
          class="border-t hidden lg:block border-gray-100 bottom-0 absolute w-1/5"
        >
          <UserBlock />
        </div>
      </div>
      <div class="md:w-4/5 w-11/12 h-full overflow-hidden">
        {#if $activeConversation}
          <Conversation />
        {:else}
          <div class="pt-24">
            <p class="text-center">
              Please select a conversation or start a new one!
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
