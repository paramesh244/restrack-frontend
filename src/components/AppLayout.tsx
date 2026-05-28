import { ReactNode } from 'react';
import Sidebar, { MobileHeader } from '@/components/Sidebar';
import ErrorBoundary from '@/components/ErrorBoundary';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto bg-background px-4 py-4 md:px-6 md:py-6">
          <ErrorBoundary catchAsyncErrors>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
