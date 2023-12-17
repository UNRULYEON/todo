import { useQuery } from '@tanstack/react-query';
import { axios } from '@/api';

type Lane = {
  id: string;
  name: string;
};

export const getAll = (
  options?: Partial<Parameters<typeof useQuery<Lane[]>>[0]>
) => {
  const { data, isLoading, error, refetch } = useQuery<Lane[]>({
    queryKey: ['lanes'],
    queryFn: () => axios.get(`/api/lanes/`).then((res) => res.data),
    ...options,
  });

  return {
    getLanes: refetch,
    lanes: data,
    isLoadingLanes: isLoading,
    errorLoadingLanes: error,
  };
};
