import { ReactNode } from 'react';

type ItemHeaderProps = {
  children: ReactNode;
};

const ItemHeader = ({ children }: ItemHeaderProps) => {
  return <div className="">{children}</div>;
};

export default ItemHeader;
