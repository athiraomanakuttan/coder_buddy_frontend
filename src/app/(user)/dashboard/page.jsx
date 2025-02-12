'use client'
import { useEffect } from "react";
import Navbar from "../../../components/user/Navbar/Navbar";
import {  useSession } from "next-auth/react";
import useAuthStore from "@/store/authStore";
import PostReportPage from "@/components/user/PostReport/page";
import { BarChart, Users, MessageSquare, TrendingUp, Activity } from "lucide-react";


const Dashboard = () => {

  const { data: session, status } = useSession();
  const setUserAuth = useAuthStore(state => state.setUserAuth);
  const stats = [
    {
      title: "Total Posts",
      value: "10",
      icon: MessageSquare,
      description: "Posts this month"
    },
    {
      title: "Active Users",
      value: "2,420",
      icon: Users,
      description: "↗️ 40% increase"
    },
    {
      title: "Engagement Rate",
      value: "85%",
      icon: BarChart,
      description: "↗️ 12% increase"
    },
    {
      title: "Growth",
      value: "+573",
      icon: TrendingUp,
      description: "New users this week"
    },
    {
      title: "Activity",
      value: "1,203",
      icon: Activity,
      description: "Actions today"
    }
  ];
  useEffect(() => {
    if (session?.user && status === "authenticated") {
      setUserAuth(session.user.userData, session.user.access || '');
      document.cookie = `accessToken=${session.user.access}; path=/; max-age=${60 * 60}; SameSite=Lax`;
    }
  }, [session, status, setUserAuth]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <div className="flex-none">
        <Navbar />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1  overflow-y-auto">
        <div className="p-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
            Dashboard Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <stat.icon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <PostReportPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
