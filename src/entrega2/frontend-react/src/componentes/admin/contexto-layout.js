import { createContext, useContext } from 'react'

export const ContextoLayoutAdmin = createContext({
  rodape: null,
  definirRodape: () => {},
  temaAdmin: 'bilhete-dourado',
  definirTemaAdmin: () => {},
})

export function useRodapeAdmin() {
  return useContext(ContextoLayoutAdmin)
}
