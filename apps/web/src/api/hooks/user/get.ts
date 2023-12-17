import { useQuery } from '@tanstack/react-query';
import { axios } from '@/api';

type User = {
  id: string;
  lanes: 0;
  onboarded: boolean;
  hasSeenOnboarding: boolean;
};

export const get = (
  options?: Partial<Parameters<typeof useQuery<User>>[0]>
) => {
  const { data, isLoading, error, refetch } = useQuery<User>({
    queryKey: ['user'],
    queryFn: () => axios.get('/api/auth/me').then((res) => res.data),
    ...options,
  });

  return {
    getUser: refetch,
    user: data,
    isLoadingUser: isLoading,
    errorLoadingUser: error,
  };
};
