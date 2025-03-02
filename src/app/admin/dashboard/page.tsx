'use client'
import dynamic from 'next/dynamic';

// Create a loading component that shows while the dashboard is loading
const LoadingDashboard = () => (
  <div className="flex items-center justify-center min-h-screen">
    <p>Loading dashboard...</p>
  </div>
);

// Use dynamic import with ssr: false to completely skip server-side rendering
const DashboardComponent = dynamic(
  () => import('@/components/admin/dashboard/DashboardComponent'),
  { 
    ssr: false,
    loading: () => <LoadingDashboard />
  }
);

const DashboardPage = () => {
  return <DashboardComponent />;
};

export default DashboardPage;