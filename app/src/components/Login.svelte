<script lang="ts">
  import { makeApiCall } from '../hooks/apiCalls'
  import ordinaLogo from '../assets/ordina_logo.png'
  import Spinner from './Spinner.svelte'

  let error: string | undefined = undefined
  let message: string | undefined = undefined
  let email: string
  let loading: boolean = false

  const login = async () => {
    // Show the loading spinner
    loading = true

    // Check if the email is valid
    if (email) {
      // Make the api call to generate a login link
      try {
        await makeApiCall({
          apiFunction: 'request_login_email',
          content: { email },
        })
        email = ''
        message = 'Check your email for a magic link.'
      } catch (e) {
        error = e.message
      } finally {
        loading = false
      }
    } else {
      error = 'Not a valid email address.'
    }
  }
</script>

<div
  class="h-full bg-gradient-to-tl from-orange-500 to-yellow-400 w-full py-16 px-4"
>
  <div class="flex flex-col items-center justify-center">
    <div class="bg-white shadow rounded lg:w-1/3 md:w-1/2 w-full p-10 mt-16">
      <img src={ordinaLogo} alt="logo" class="w-72 mx-auto mb-16" />
      {#if !message}
        <p class="text-2xl leading-6 text-gray-800">
          Fill in your email address
        </p>
        <p class="mb-8 mt-4 text-gray-600">
          You will get an email with a link in your email. Its a one time login
          link.
        </p>
      {/if}

      <form on:submit|preventDefault={login}>
        {#if !message}
          <div>
            <label for="email" class="text-gray-800 cursor-pointer">
              Email
            </label>
            <input
              id="email"
              disabled={loading}
              aria-labelledby="email"
              bind:value={email}
              type="email"
              placeholder="Your email..."
              required={true}
              class="border-t text-gray-800 py-3 w-full pl-3 mt-2"
            />
            <p
              class="text-gray-600 text-sm mt-2 text-right italic font-semibold"
            >
              Your email should end with an allowed domain.
            </p>
          </div>
        {/if}
        {#if error}
          <p class="text-red-500 text-sm mt-2 p-2 px-4 italic font-semibold">
            {error}
          </p>
        {/if}
        <div class="mt-8">
          {#if !message}
            <button
              disabled={loading}
              class="rounded-full text-white bg-orange-500 border hover:bg-orange-600 py-4 w-full disabled:bg-gray-300"
              type="submit"
              >{#if loading}<span
                  class="w-full items-center justify-center flex"
                  ><Spinner /></span
                >{:else}Get magic link{/if}</button
            >
          {/if}
          {#if message}
            <p
              class="text-gray-600 text-sm mt-2 p-2 px-4 text-center font-semibold"
            >
              {message}
            </p>
          {/if}
        </div>
      </form>
    </div>
  </div>
</div>
