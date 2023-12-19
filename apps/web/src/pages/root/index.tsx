import { useLane } from '@/api';
import { Lane } from '@/components';

const RootPage = () => {
  const { lanes } = useLane.getAll();

  return (
    <div className="grid grid-cols-4 gap-3">
      {lanes
        ?.filter((l) => !['Backlog', 'Archive'].includes(l.name))
        .map((lane) => <Lane key={lane.id} id={lane.id} />)}
    </div>
  );
};

export default RootPage;
