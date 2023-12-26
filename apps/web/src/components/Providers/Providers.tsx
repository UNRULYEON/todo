import { ReactNode, Suspense, lazy, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { LanesProvider, ThemeProvider } from '@/components';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api';
import { Environment } from '@/constants';

const ReactQueryDevtools = lazy(async () =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (module) => ({ default: module.ReactQueryDevtools })
  )
);

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

type ProvidersProps = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  const navigate = useNavigate();
  const [showDevtools, setShowDevtools] = useState(
    (import.meta.env.MODE as Environment) !== Environment.PRODUCTION
  );

  useEffect(() => {
    // @ts-expect-error - toggleDevtools doesn't exist on window
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <LanesProvider>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider
          publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
          navigate={(to) => navigate(to)}
        >
          <ThemeProvider defaultTheme="dark" storageKey="todo">
            {children}
          </ThemeProvider>
        </ClerkProvider>

        {showDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtools />
          </Suspense>
        )}
      </QueryClientProvider>
    </LanesProvider>
  );
};

export default Providers;
