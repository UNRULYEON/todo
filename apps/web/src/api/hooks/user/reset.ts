import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';

export const reset = (
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
    mutationKey: ['reset-user'],
    mutationFn: () => axios.get(`/api/user/reset`).then((res) => res.data),
    ...options,
  });

  return {
    resetUser: mutateAsync,
    isResettingUser: isPending,
    errorResettingUser: isError,
  };
};
