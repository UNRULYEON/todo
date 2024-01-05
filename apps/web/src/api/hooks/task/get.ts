import { useQuery } from '@tanstack/react-query';
import { axios } from '@/api';
import { TaskType } from '@/types';

export const get = (
  id?: string,
  options?: Partial<Parameters<typeof useQuery<TaskType>>[0]>
) => {
  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery<TaskType>(
    {
      queryKey: ['task', id],
      queryFn: () => axios.get(`/api/tasks/${id}`).then((res) => res.data),
      enabled: !!id,
      ...options,
    }
  );

  return {
    getTask: refetch,
    task: data,
    isLoadingTask: isLoading,
    errorLoadingTask: error,
    taskUpdatedAt: dataUpdatedAt,
  };
};
