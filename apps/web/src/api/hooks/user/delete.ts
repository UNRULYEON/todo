import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';

export const deleteUser = (
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
    mutationKey: ['delete-user'],
    mutationFn: () => axios.get(`/api/user/delete`).then((res) => res.data),
    ...options,
  });

  return {
    deleteUser: mutateAsync,
    isDeletingUser: isPending,
    errorDeletingUser: isError,
  };
};
