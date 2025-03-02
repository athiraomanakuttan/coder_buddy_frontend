'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Create a loading component to show while the dashboard is loading
const DashboardLoading = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg font-medium text-gray-700">Loading dashboard...</p>
    </div>
  </div>
)

// Import the actual Dashboard component dynamically with SSR disabled
const ClientDashboard = dynamic(
  () => import('@/components/user/dashboard/DashboardContent'),
  { 
    ssr: false,
    loading: () => <DashboardLoading />
  }
)

// Wrapper component that is exported from this file
export default function Dashboard() {
  return <ClientDashboard />
}