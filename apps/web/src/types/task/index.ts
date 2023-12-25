export type TaskType = {
  id: string;
  laneId: string;
  title: string;
  description: string | null;
  previousTaskId: string | null;
};
