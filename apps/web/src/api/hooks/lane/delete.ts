import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';

export const deleteLane = (
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
    mutationKey: ['lane', id],
    mutationFn: () => axios.delete(`/api/lanes/${id}`).then((res) => res.data),
    ...options,
  });

  return {
    createLane: mutateAsync,
    isCreatingLane: isPending,
    errorCreatingLane: isError,
  };
};
