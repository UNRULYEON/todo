import { ReactNode } from 'react';

type ItemActionsProps = {
  children: ReactNode;
};

const ItemActions = ({ children }: ItemActionsProps) => {
  return <div className="mt-4">{children}</div>;
};

export default ItemActions;
