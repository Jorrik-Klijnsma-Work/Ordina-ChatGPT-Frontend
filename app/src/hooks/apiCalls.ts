import type { ConversationRequestType, DeleteConversationRequestType } from "../components/types";
import { user } from "./stores";

const baseUrl: string =
  'https://mk-chatgpt-backend-ordina.azurewebsites.net/api/'

type RequestEmailType = { 'email': string }
type LinkLoginType = { user_id: number; login_token: string }

type UpdateUserConversationType = {
  user_id: number
  session_token: string
  conversation_id: string
}
type GetUserConversationType = { user_id: number; session_token: string }

type MakeApiCallProps =
  | { apiFunction: 'request_login_email'; content: RequestEmailType }
  | { apiFunction: 'link_login'; content: LinkLoginType }
  | { apiFunction: 'my-conversations'; content: GetUserConversationType }
  | { apiFunction: 'update-conversations'; content: UpdateUserConversationType }
  | { apiFunction: 'create-conversation'; content: ConversationRequestType }
  | { apiFunction: 'request-chat-response', content: ConversationRequestType }
  | { apiFunction: 'delete-conversation', content: DeleteConversationRequestType }

export const makeApiCall = async (
  config: MakeApiCallProps
): Promise<any | boolean> => {
  const { apiFunction, content } = config

  // Make the API call
  const result = await fetch(`${baseUrl}${apiFunction}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(content),
  });

  // Check if the API call was successful
  if (!result.ok) {

    // Unauthorized call, log the user out
    if (result.status === 401) {
      localStorage.removeItem('userSessionToken')
      localStorage.removeItem('userId')
      user.set(undefined)
      window.location.href = '/'
    } else {
      throw new Error(`API call failed: ${result.status} ${result.statusText}`);
    }
  }

  const data = await result.json();
  if (data) {
    return data
  } else {
    return false
  }
}
