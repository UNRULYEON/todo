import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';

export const deleteTask = (
  id?: string,
  options?: Partial<
    Parameters<typeof useMutation<void, Error, void, unknown>>[0]
  >
) => {
  const { mutateAsync, isPending, isError } = useMutation<
    void,
    Error,
    void,
    unknown
  >({
    mutationKey: ['task', id],
    mutationFn: () => axios.delete(`/api/tasks/${id}`).then((res) => res.data),
    ...options,
  });

  return {
    deleteTask: mutateAsync,
    isDeletingTask: isPending,
    errorDeletingTask: isError,
  };
};
