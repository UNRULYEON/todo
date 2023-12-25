import { useQuery } from '@tanstack/react-query';
import { axios } from '@/api';
import { LaneType } from '@/types';

export const getAll = (
  options?: Partial<Parameters<typeof useQuery<LaneType[]>>[0]>
) => {
  const { data, isLoading, error, refetch } = useQuery<LaneType[]>({
    queryKey: ['lanes'],
    queryFn: () => axios.get(`/api/lanes`).then((res) => res.data),
    ...options,
  });

  return {
    getLanes: refetch,
    lanes: data,
    isLoadingLanes: isLoading,
    errorLoadingLanes: error,
  };
};
