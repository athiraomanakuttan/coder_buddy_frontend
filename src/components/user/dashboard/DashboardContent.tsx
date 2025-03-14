'use client'

import { useEffect, useState } from "react";
import Navbar from "../../../components/user/Navbar/Navbar";
import { useSession } from "next-auth/react";
import useAuthStore from "@/store/authStore";
import PostReportPage from "@/components/user/PostReport/page";
import { Activity, BookAudio, BookOpen, Video } from "lucide-react";
import { getUserDashboardStatus } from "@/app/services/user/userApi";
import { DashboardStatusType } from "@/types/types";

const DashboardContent = () => {
  const { data: session, status } = useSession();
  const setUserAuth = useAuthStore((state) => state.setUserAuth);
  const [stats, setstats] = useState<DashboardStatusType>({
    totalPost: 0,
    resolvedPost: 0,
    pendingPost: 0,
    totalMeetings: 0,
    scheduledMeeting: 0,
  });
  
  const getDashboardStatus = async () => {
    
    try {
      const response = await getUserDashboardStatus();
      if (response) setstats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard status:", error);
    }
  };

  useEffect(() => {
    if (session?.user && status === "authenticated") {
      setUserAuth(session.user.userData, session.user.access || "");
      document.cookie = `accessToken=${session.user.access}; path=/; max-age=${
        60 * 60
      }; SameSite=Lax`;
    }
    
    // No need to check for isClient since this component only runs on client
   
      getDashboardStatus();
    
  }, [session, status, setUserAuth]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <div className="flex-none">
        <Navbar />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
            Dashboard Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
              <div className="space-y-1">
                <div className="flex gap-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.totalPost}
                  </h3>
                  <Activity className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-xl text-primarys">Total issues</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
              <div className="space-y-1">
                <div className="flex gap-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.resolvedPost}
                  </h3>
                  <BookAudio className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-xl text-primarys">Resolved issues</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
              <div className="space-y-1">
                <div className="flex gap-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.pendingPost}
                  </h3>
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-xl text-primarys">Pending Issues</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
              <div className="space-y-1">
                <div className="flex gap-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.totalMeetings}
                  </h3>
                  <Video className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-xl text-primarys">Meetings Taken</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
              <div className="space-y-1">
                <div className="flex gap-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.scheduledMeeting}
                  </h3>
                  <Video className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-sm text-primarys">Scheduled Meetings</span>
                </p>
              </div>
            </div>
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

export default DashboardContent;