'use client'
import { getadminexpertMeeting, verificationMeeting } from "@/app/services/expert/meetingApi";
import Navbar from "@/components/expert/Navbar/Navbar";
import { ExpertMeetingType, NewMeetingType } from "@/types/types";
import { useEffect, useState } from "react";
import { Video } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useAuthStore from "@/store/authStore";

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
  }, []);

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
    <div className="m-0 p-0 flex">
      <div className="p-0 m-0">
        <Navbar />
      </div>
      <div className="border w-100">
        {varified === "1" || varified === 1 ? (
          <div className="container mt-5 flex justify-evenly">
            <div className="border pl-10 pr-10 pt-3 pb-3 text-center">
              <h5>total post</h5>
              <h1>10</h1>
            </div>
            <div className="border pl-10 pr-10 pt-3 pb-3 text-center">
              <h5>total post</h5>
              <h1>10</h1>
            </div>
            <div className="border pl-10 pr-10 pt-3 pb-3 text-center">
              <h5>total post</h5>
              <h1>10</h1>
            </div>
            <div className="border pl-10 pr-10 pt-3 pb-3 text-center">
              <h5>total post</h5>
              <h1>10</h1>
            </div>
            <div className="border pl-10 pr-10 pt-3 pb-3 text-center">
              <h5>total post</h5>
              <h1>10</h1>
            </div>
          </div>
        ) : (
          <div className="m-5 p-5">
            {meetingData ? (
              <div className="border rounded flex-row p-3">
                <h1 className="text-2xl text-secondarys mb-3">Scheduled Meeting</h1>
                <div className="flex mb-3 gap-5">
                  <p className="text-secondarys">Host</p> : <p>ADMIN</p>
                </div>
                <div className="flex mb-3 gap-5">
                  <p className="text-secondarys">Title</p> : <p>{meetingData.title}</p>
                </div>
                <div className="flex mb-3 gap-5">
                  <p className="text-secondarys">Date</p> : <p>{meetingData.dateTime}</p>
                </div>
                <div className="flex mb-5 gap-5">
                  <p className="text-secondarys">Meeting Id</p> : <p>{meetingData.meetingId}</p>
                </div>
                <button
                  onClick={handleJoinMeeting}
                  disabled={isJoining}
                  className="bg-secondarys border rounded pl-3 pr-3 pt-2 pb-2 text-white flex items-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  <Video size={20} />
                  {isJoining ? 'Joining...' : 'Join Meeting'}
                </button>
              </div>
            ) : (
              <div>
                Welcome to <span className="text-secondarys text-xl">Coder Buddy!</span> To
                activate your account, please ensure your profile is up-to-date. Once
                updated, we'll schedule your verification meeting and notify you of the
                time and date. Thank you for{' '}
                <span className="text-secondarys text-xl">joining us!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;