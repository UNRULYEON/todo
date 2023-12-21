import { ReactNode } from 'react';

type ItemProps = {
  children: ReactNode;
};

const Item = ({ children }: ItemProps) => {
  return <div>{children}</div>;
};

export default Item;
