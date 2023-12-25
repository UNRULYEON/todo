import { useQuery } from '@tanstack/react-query';
import { axios } from '@/api';
import { LaneTaskType } from '@/types';

export type LaneTaskApiType = {
  id: string;
  previousTaskId: string;
};

export const getTasks = (
  id?: string,
  options?: Partial<Parameters<typeof useQuery<LaneTaskType[]>>[0]>
) => {
  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery<
    LaneTaskType[]
  >({
    queryKey: ['lane', id, 'tasks'],
    queryFn: () =>
      axios.get<LaneTaskApiType[]>(`/api/lanes/${id}/tasks`).then((res) => {
        const unsorted = res.data;

        const head = unsorted.findIndex((task) => task.previousTaskId === null);

        if (head === -1)
          return unsorted.map<LaneTaskType>((task) => ({
            id: task.id,
          }));

        const sorted = [unsorted[head]];

        for (let i = 0; i < unsorted.length; i++) {
          const next = unsorted.find(
            (task) => task.previousTaskId === sorted[i].id
          );

          if (!next) break;

          sorted.push(next);
        }

        const mapped = sorted.map<LaneTaskType>((task) => ({
          id: task.id,
        }));

        return mapped;
      }),
    ...options,
  });

  return {
    getLaneTasks: refetch,
    laneTasks: data,
    isLoadingLaneTask: isLoading,
    errorLoadingLaneTask: error,
    laneTasksUpdatedAt: dataUpdatedAt,
  };
};
