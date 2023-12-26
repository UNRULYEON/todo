import { LaneTaskType } from '@/types';
import { ReactNode, createContext, useContext, useState } from 'react';

type LanesState = {
  lanes: Record<string, LaneTaskType[]>;
  addLane: (laneId: string, items: LaneTaskType[]) => void;
  moveTask: (
    sourceLaneId: string,
    targetLaneId: string,
    from: number,
    to: number
  ) => LanesState['lanes'];
};

const LanesContext = createContext<LanesState | undefined>(undefined);

type LanesProps = {
  children: ReactNode;
};

export const LanesProvider = ({ children }: LanesProps) => {
  const [lanes, setLanes] = useState<Record<string, LaneTaskType[]>>({});

  const handleAddLane: LanesState['addLane'] = (laneId, items) => {
    setLanes((lanes) => ({
      ...lanes,
      [laneId]: items ?? [],
    }));
  };

  const moveTask: LanesState['moveTask'] = (
    sourceLaneId,
    targetLaneId,
    from,
    to
  ) => {
    let temp: LanesState['lanes'] = {};

    if (sourceLaneId === targetLaneId) {
      const lane = lanes[sourceLaneId];

      const laneClone = [...lane];

      const [removed] = laneClone.splice(from, 1);
      laneClone.splice(to, 0, removed);

      temp = {
        ...lanes,
        [sourceLaneId]: laneClone,
      };
    } else {
      const sourceLane = lanes[sourceLaneId];
      const targetLane = lanes[targetLaneId];

      const sourceLaneClone = [...sourceLane];
      const targetLaneClone = [...targetLane];

      const [removed] = sourceLaneClone.splice(from, 1);
      targetLaneClone.splice(to, 0, removed);

      temp = {
        ...lanes,
        [sourceLaneId]: sourceLaneClone,
        [targetLaneId]: targetLaneClone,
      };
    }

    setLanes(() => temp);

    return temp;
  };

  return (
    <LanesContext.Provider
      value={{
        lanes,
        addLane: handleAddLane,
        moveTask,
      }}
    >
      {children}
    </LanesContext.Provider>
  );
};

export const useLanes = () => {
  const context = useContext(LanesContext);
  if (!context) throw new Error('useLanes must be used within a LanesProvider');

  return context;
};

export default LanesProvider;
