<script lang="ts">
  import GptLogo from '../assets/ChatGPT_logo.svg'
  import type { MessagesType } from './types'

  export let personas: MessagesType[]
</script>

<div class="persona-wrapper">
  <div class="persona-label">
    <img src={GptLogo} alt="OrdinaGPT Logo" />
    <label for="persona-select"> Choose a persona: </label>
  </div>
  <select name="persona" id="persona-select">
    {#each personas as persona}
      <option value={persona.content}>persona.content</option>
    {/each}
  </select>
</div>

<style lang="scss">
  .persona-wrapper {
    min-width: 250px;
    max-width: 350px;
    width: 100%;

    .persona-label {
      display: flex;
      justify-content: flex-start;
      gap: 0.5rem;
      font-size: 0.75rem;
      margin-bottom: 0.5rem;

      img {
        width: 15px;
      }
    }

    select {
      font-size: 1rem;
      color: #ffffff;
      background: none;
      outline: none;
      border: none;
      width: 100%;
      border: 2px solid rgba(255, 255, 255, 0.3);
      padding: 0.5rem 1rem;
      padding-right: 2rem;
      border-radius: 0.25rem;
      background: url("data:image/svg+xml,<svg height='10px' width='10px' viewBox='0 0 16 16' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>")
        no-repeat;
      background-position: calc(100% - 0.75rem) center;
      -webkit-appearance: none;
      appearance: none;

      option {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
</style>
