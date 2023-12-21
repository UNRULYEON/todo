import { ReactNode } from 'react';

type PageProps = {
  children: ReactNode;
};

const Page = ({ children }: PageProps) => {
  return <div className="flex flex-col space-y-4">{children}</div>;
};

export default Page;
