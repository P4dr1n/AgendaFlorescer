import React, { createContext, useContext, useState } from "react"

interface User {
  nome: string
  email: string
  telefone: string
  senha: string
}

interface UserContextType {
  user: User
  setUser: (user: User) => void
  atualizarUsuario: (dadosAtualizados: Partial<User>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    nome: "Gabriel Marques",
    email: "gabriel@email.com",
    telefone: "(11) 99999-9999",
    senha: "123456",
  })

  const atualizarUsuario = (dadosAtualizados: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...dadosAtualizados }))
  }

  return (
    <UserContext.Provider value={{ user, setUser, atualizarUsuario }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser deve ser usado dentro de UserProvider")
  return context
}