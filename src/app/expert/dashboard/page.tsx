"use client";

import { getadminexpertMeeting } from "@/app/services/expert/meetingApi";
import Navbar from "@/components/expert/Navbar/Navbar";
import { ExpertDashbordType, ExpertMeetingType } from "@/types/types";
import { useEffect, useState } from "react";
import { Star, Video, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useAuthStore from "@/store/authStore";
import MeetingMonthlyReport from "@/components/shared/MeetingMonthlyReport";
import { getExpertDashboardData } from "@/app/services/expert/expertApi";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const setUserAuth = useAuthStore((state) => state.setUserAuth);
  const [dashbordStatus, setDashbordStatus] = useState<ExpertDashbordType>({
    meetingRating:0,
    scheduledMeeting:0,
    totalMeetings:0,
    walletBalance:0
  })

  useEffect(() => {
    if (session?.user && status === "authenticated") {
      console.log("session.user", session?.user?.userData);
      setUserAuth(session?.user?.userData, session?.user?.access || "");
      localStorage.setItem(
        "isVerified",
        session.user?.userData?.isVerified || 0
      );
      localStorage.setItem("isExpert", "1");
      document.cookie = `accessToken=${
        session?.user?.access
      }; path=/; max-age=${60 * 60}; SameSite=Lax`;
      setVarified(session?.user?.userData?.isVerified || 0);
    }
  }, [session, status, setUserAuth]);
  const isVarified = localStorage.getItem("isVerified");
  const token = localStorage.getItem("userAccessToken") as string;
  const [varified, setVarified] = useState<string | number | null>(isVarified);
  const [meetingData, setMeetingData] = useState<ExpertMeetingType | null>(
    null
  );
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isVarified === "0") {
      getMeetingDetails();
    }
  }, [isVarified]);

  // To get the verification meeting details with admin
  const getMeetingDetails = async () => {
    const response = await getadminexpertMeeting(token);
    console.log("response");
    if (response) {
      setMeetingData(response.data);
    }
  };

  // Handle joining the meeting
  const handleJoinMeeting = async () => {
    if (!meetingData?._id) {
      console.error("Meeting ID not found");
      return;
    }

    // localStorage.setItem("currentMeeting",meetingsData)
    router.push(`/videoCall/${meetingData?.meetingId}`);

    setIsJoining(false);
  };

  useEffect(()=>{
    const getExpertStatus = async ()=>{
      const response = await getExpertDashboardData(token)
      if(response)
        setDashbordStatus(response.data) 
    }
    getExpertStatus()
  },[])

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
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mb-8">
      {/* Total Meetings */}
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
        <div className="space-y-1">
          <div className="flex gap-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {dashbordStatus.totalMeetings}
            </h3>
            <Video className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">
            <span className="text-xl text-primarys">
              Total meetings
            </span>
          </p>
        </div>
      </div>

      {/* Scheduled Meetings */}
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
        <div className="space-y-1">
          <div className="flex gap-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {dashbordStatus.scheduledMeeting}
            </h3>
            <Video className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">
            <span className="text-xl text-primarys">
              Scheduled Meetings
            </span>
          </p>
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
        <div className="space-y-1">
          <div className="flex gap-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {dashbordStatus.walletBalance}
            </h3>
            <Wallet className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">
            <span className="text-xl text-primarys">
              Wallet Balance
            </span>
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
        <div className="space-y-1">
          <div className="flex gap-4">
            <h3 className="text-2xl font-bold text-gray-900">
              {dashbordStatus.meetingRating}
            </h3>
            <Star className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">
            <span className="text-xl text-primarys">
              Rating
            </span>
          </p>
        </div>
      </div>
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
