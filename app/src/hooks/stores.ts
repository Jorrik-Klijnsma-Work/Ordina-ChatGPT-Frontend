import { writable } from 'svelte/store'
import type { ConversationType, UserType } from '../components/types'

export const chats = writable<ConversationType[]>()
export const activeConversation = writable<ConversationType>()
export const user = writable<UserType | undefined>()
