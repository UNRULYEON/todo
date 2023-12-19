import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';

type Lane = {
  id: string;
  name: string;
  color: string;
};

type UpdateLane = Omit<Lane, 'id'>;

export const update = (
  id?: string,
  options?: Partial<
    Parameters<typeof useMutation<Lane, Error, Partial<UpdateLane>, unknown>>[0]
  >
) => {
  const { mutateAsync, isPending, isError } = useMutation<
    Lane,
    Error,
    Partial<UpdateLane>,
    unknown
  >({
    mutationKey: ['lane', id],
    mutationFn: (updatedUser) =>
      axios.patch(`/api/lanes/${id}`, updatedUser).then((res) => res.data),
    ...options,
  });

  return {
    updateLane: mutateAsync,
    isUpdatingLane: isPending,
    errorUpdatingLane: isError,
  };
};
