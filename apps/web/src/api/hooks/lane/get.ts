import { useQuery } from '@tanstack/react-query';
import { axios } from '@/api';

type Lane = {
  id: string;
  name: string;
};

export const get = (
  id?: string,
  options?: Partial<Parameters<typeof useQuery<Lane>>[0]>
) => {
  const { data, isLoading, error, refetch } = useQuery<Lane>({
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
