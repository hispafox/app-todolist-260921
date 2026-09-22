import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { createUser, deleteUser, fetchUsers, updateUser } from '../api/usersApi'
import type { CreateUserPayload, UpdateUserPayload } from '../types/user'

const USERS_KEY = 'users'

export function useUsers() {
  return useQuery({
    queryKey: [USERS_KEY],
    queryFn: ({ signal }) => fetchUsers(signal),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [USERS_KEY] }),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [USERS_KEY] }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
