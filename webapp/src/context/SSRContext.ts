import { createContext } from 'react'

export const SSRContext = createContext<{
  /**
   * Whether the current rendering is being done on the server or on the client
   * side. Will be `true` on the server, but `false` on the client once
   * hydration is done.
   *
   * This can be useful as some things should only be interactable on the client
   * side (e.g., buttons and text inputs can be disabled on the server).
   */
  isSSR: boolean
}>({
  isSSR: false,
})
