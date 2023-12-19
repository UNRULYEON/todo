import { useLane } from '@/api';
import { hexToRgba } from '@/utils';

const DEFAULT_COLOR = '#808080';

type LaneProps = {
  id: string;
};

const Lane = ({ id }: LaneProps) => {
  const { lane } = useLane.get(id);

  return (
    <div className="flex flex-col">
      {lane && (
        <>
          <div className="flex">
            <div
              className={`pl-2 pr-3 py-1 rounded-full flex flex-row items-center gap-2`}
              style={{
                backgroundColor: hexToRgba(
                  lane.color ?? DEFAULT_COLOR,
                  0.3
                ).toString(),
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: hexToRgba(
                    lane.color ?? DEFAULT_COLOR
                  ).toString(),
                }}
              />
              <span className="font-bold">{lane.name}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Lane;
