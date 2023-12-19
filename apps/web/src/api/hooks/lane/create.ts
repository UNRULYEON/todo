import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';

type Lane = {
  id: string;
  name: string;
  color: string;
};

type NewLane = Omit<Lane, 'id'>;

export const create = (
  options?: Partial<
    Parameters<typeof useMutation<Lane, Error, NewLane, unknown>>[0]
  >
) => {
  const { mutateAsync, isPending, isError } = useMutation<
    Lane,
    Error,
    NewLane,
    unknown
  >({
    mutationKey: ['create-lane'],
    mutationFn: (updatedUser) =>
      axios.post(`/api/lanes/`, updatedUser).then((res) => res.data),
    ...options,
  });

  return {
    createLane: mutateAsync,
    isCreatingLane: isPending,
    errorCreatingLane: isError,
  };
};
