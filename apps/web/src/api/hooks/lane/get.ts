import { useQuery } from '@tanstack/react-query';
import { axios } from '@/api';
import { LaneType } from '@/types';

export const get = (
  id?: string,
  options?: Partial<Parameters<typeof useQuery<LaneType>>[0]>
) => {
  const { data, isLoading, error, refetch } = useQuery<LaneType>({
    queryKey: ['lane', id],
    queryFn: () => axios.get(`/api/lanes/${id}`).then((res) => res.data),
    ...options,
  });

  return {
    getLane: refetch,
    lane: data,
    isLoadingLane: isLoading,
    errorLoadingLane: error,
  };
};
