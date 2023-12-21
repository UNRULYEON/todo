import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/utils';

type BaseProps = {
  children: ReactNode;
};

const h1 = ({
  children,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'h1'>) => (
  <h1
    className={cn(
      'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      className
    )}
    {...rest}
  >
    {children}
  </h1>
);

const h2 = ({
  children,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'h2'>) => (
  <h2
    className={cn(
      'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      className
    )}
    {...rest}
  >
    {children}
  </h2>
);

const h3 = ({
  children,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'h3'>) => (
  <h3
    className={cn(
      'scroll-m-20 text-2xl font-semibold tracking-tight',
      className
    )}
    {...rest}
  >
    {children}
  </h3>
);

const h4 = ({
  children,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'h4'>) => (
  <h4
    className={cn(
      'scroll-m-20 text-xl font-semibold tracking-tight',
      className
    )}
    {...rest}
  >
    {children}
  </h4>
);

const p = ({
  children,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
    {...rest}
  >
    {children}
  </p>
);

const blockquote = ({
  children,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'blockquote'>) => (
  <blockquote
    className={cn('mt-6 border-l-2 pl-6 italic', className)}
    {...rest}
  >
    {children}
  </blockquote>
);

const list = {
  ordered: ({
    children,
    className,
    ...rest
  }: BaseProps & ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className={cn('my-6 ml-6 list-decimal [&>li]:mt-2', className)}
      {...rest}
    >
      {children}
    </ol>
  ),
  unordered: ({
    children,
    className,
    ...rest
  }: BaseProps & ComponentPropsWithoutRef<'ul'>) => (
    <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)} {...rest}>
      {children}
    </ul>
  ),
  item: ({
    children,
    className,
    ...rest
  }: BaseProps & ComponentPropsWithoutRef<'li'>) => (
    <li className={cn('list-item', className)} {...rest}>
      {children}
    </li>
  ),
};

const code = ({
  children,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'code'>) => (
  <code
    className={cn(
      'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      className
    )}
    {...rest}
  >
    {children}
  </code>
);

const lead = ({
  children,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'p'>) => (
  <p className={cn('text-xl text-muted-foreground', className)} {...rest}>
    {children}
  </p>
);

const large = ({
  children,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('text-lg font-semibold', className)} {...rest}>
    {children}
  </div>
);

const small = ({
  children,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'small'>) => (
  <small
    className={cn('text-sm font-medium leading-none', className)}
    {...rest}
  >
    {children}
  </small>
);

const muted = ({
  children,
  className,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<'p'>) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...rest}>
    {children}
  </p>
);

export default {
  h1,
  h2,
  h3,
  h4,
  p,
  blockquote,
  list,
  code,
  lead,
  large,
  small,
  muted,
};
