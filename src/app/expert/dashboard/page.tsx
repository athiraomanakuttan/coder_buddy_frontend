'use client'

import { getadminexpertMeeting, } from "@/app/services/expert/meetingApi";
import Navbar from "@/components/expert/Navbar/Navbar";
import { ExpertMeetingType,  } from "@/types/types";
import { useEffect, useState } from "react";
import { Video } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useAuthStore from "@/store/authStore";
import MeetingMonthlyReport from "@/components/shared/MeetingMonthlyReport";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const setUserAuth = useAuthStore(state => state.setUserAuth);

  useEffect(() => {
    if ( session?.user && status === "authenticated") {
      console.log("session.user",session?.user?.userData)
      setUserAuth(session?.user?.userData, session?.user?.access || '');
      localStorage.setItem("isVerified",session.user?.userData?.isVerified || 0)
      localStorage.setItem("isExpert","1")
      document.cookie = `accessToken=${session?.user?.access}; path=/; max-age=${60 * 60}; SameSite=Lax`;
      setVarified(session?.user?.userData?.isVerified || 0)
    }
  }, [session, status, setUserAuth]);
  const isVarified = localStorage.getItem("isVerified");
  const token = localStorage.getItem("userAccessToken") as string;
  const [varified, setVarified] = useState<string | number | null>(isVarified);
  const [meetingData, setMeetingData] = useState<ExpertMeetingType | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter()

  useEffect(() => {
    if (isVarified === '0' ) {
      getMeetingDetails();
    }
  }, [isVarified]);

  // To get the verification meeting details with admin
  const getMeetingDetails = async () => {
    const response = await getadminexpertMeeting(token);
    console.log("response")
    if (response) {
      setMeetingData(response.data);
    }
  };

  // Handle joining the meeting
  const handleJoinMeeting = async () => {
    if (!meetingData?._id) {
      console.error('Meeting ID not found');
      return;
    } 
      
        // localStorage.setItem("currentMeeting",meetingsData)
        router.push(`/videoCall/${meetingData?.meetingId}`)
      
      setIsJoining(false);
     
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar/Navbar */}
      <div className=" bg-white shadow-lg border-r">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {varified === "1" || varified === 1 ? (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg shadow-md border p-6 text-center"
                >
                  <h5 className="text-gray-500 text-sm font-medium mb-2">
                    Total Posts
                  </h5>
                  <h1 className="text-3xl font-bold text-gray-800">10</h1>
                </div>
              ))}
            </div>

            {/* Monthly Report Section */}
            <MeetingMonthlyReport />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            {meetingData ? (
              <div className="bg-white rounded-lg shadow-lg border p-8 w-full max-w-lg">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                  Scheduled Meeting
                </h1>

                {/* Meeting Details */}
                <div className="space-y-4">
                  {[
                    { label: "Host", value: "ADMIN" },
                    { label: "Title", value: meetingData.title },
                    { label: "Date", value: meetingData.dateTime },
                    { label: "Meeting ID", value: meetingData.meetingId },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-600 font-medium">{label}</span>
                      <span className="text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Join Button */}
                <button
                  onClick={handleJoinMeeting}
                  disabled={isJoining}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Video size={20} />
                  {isJoining ? "Joining..." : "Join Meeting"}
                </button>
              </div>
            ) : (
              <div className="text-center bg-white p-10 rounded-lg shadow-md max-w-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Welcome to <span className="text-blue-600">Coder Buddy!</span>
                </h2>
                <p className="text-gray-600">
                  To activate your account, please ensure your profile is
                  up-to-date. Once updated, we’ll schedule your verification
                  meeting and notify you. Thank you for{" "}
                  <span className="text-blue-600 font-medium">joining us!</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;