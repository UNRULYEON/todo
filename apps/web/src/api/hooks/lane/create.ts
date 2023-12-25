import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';
import { LaneType } from '@/types';

type NewLane = Omit<LaneType, 'id'>;

export const create = (
  options?: Partial<
    Parameters<typeof useMutation<LaneType, Error, NewLane, unknown>>[0]
  >
) => {
  const { mutateAsync, isPending, isError } = useMutation<
    LaneType,
    Error,
    NewLane,
    unknown
  >({
    mutationKey: ['create-lane'],
    mutationFn: (newLane) =>
      axios.post(`/api/lanes/`, newLane).then((res) => res.data),
    ...options,
  });

  return {
    createLane: mutateAsync,
    isCreatingLane: isPending,
    errorCreatingLane: isError,
  };
};
