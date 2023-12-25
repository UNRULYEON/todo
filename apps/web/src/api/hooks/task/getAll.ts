import { useQuery } from '@tanstack/react-query';
import { axios } from '@/api';
import { TaskType } from '@/types';

export const getAll = (
  options?: Partial<Parameters<typeof useQuery<TaskType[]>>[0]>
) => {
  const { data, isLoading, error, refetch } = useQuery<TaskType[]>({
    queryKey: ['tasks'],
    queryFn: () => axios.get(`/api/tasks`).then((res) => res.data),
    ...options,
  });

  return {
    getTasks: refetch,
    tasks: data,
    isLoadingTasks: isLoading,
    errorLoadingTasks: error,
  };
};
