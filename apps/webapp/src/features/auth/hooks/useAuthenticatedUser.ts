import { useContext } from 'react'

import { AuthenticatedUserContext } from '../context/AuthenticatedUserContext'

export const useAuthenticatedUser = () => {
  return useContext(AuthenticatedUserContext)
}
