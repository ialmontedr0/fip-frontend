import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'

interface OptimisticOptions<TData, TVariables, TContext> {
  mutationFn: (variables: TVariables) => Promise<TData>
  keys: QueryKey[]
  optimisticUpdate?: (variables: TVariables, context: TContext) => void
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: unknown, variables: TVariables, context: TContext | undefined) => void
}

/**
 * useMutation con actualización optimista + rollback automático en error.
 * `optimisticUpdate` recibe las variables y un snapshot inicial que puedes
 * guardar para restaurar (usa setQueryData por key en `onMutate`).
 */
export function useOptimisticMutation<TData, TVariables, TContext = unknown>({
  mutationFn,
  keys,
  optimisticUpdate,
  onSuccess,
  onError,
}: OptimisticOptions<TData, TVariables, TContext>) {
  const qc = useQueryClient()

  return useMutation<TData, unknown, TVariables, TContext[]>({
    mutationFn,
    onMutate: async (variables) => {
      const snapshots = keys.map((key) => {
        const data = qc.getQueryData(key)
        qc.cancelQueries({ queryKey: key })
        return data
      })

      if (optimisticUpdate) {
        optimisticUpdate(variables, snapshots as unknown as TContext)
      }

      // Queries optimistas nunca deben quedarse stale mientras hay request en curso.
      return snapshots as TContext[]
    },
    onError: (error, variables, context) => {
      // Rollback de todos los snapshots
      if (context) {
        context.forEach((data, i) => {
          qc.setQueryData(keys[i], data)
        })
      }
      onError?.(error, variables, context as TContext | undefined)
    },
    onSuccess,
    onSettled: () => {
      keys.forEach((key) => qc.invalidateQueries({ queryKey: key }))
    },
  })
}
