import { useMutation } from '@tanstack/react-query';
import { axios } from '@/api';
import { LaneType } from '@/types';

type UpdateLane = Omit<LaneType, 'id'>;

export const update = (
  id?: string,
  options?: Partial<
    Parameters<
      typeof useMutation<LaneType, Error, Partial<UpdateLane>, unknown>
    >[0]
  >
) => {
  const { mutateAsync, isPending, isError } = useMutation<
    LaneType,
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
