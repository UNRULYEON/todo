import { ReactNode } from 'react';

type ItemsProps = {
  children: ReactNode;
};

const Items = ({ children }: ItemsProps) => {
  return (
    <div className="flex flex-col items-start space-y-8 mt-4 first:mt-0">
      {children}
    </div>
  );
};

export default Items;
