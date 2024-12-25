'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import VideoCall from '@/components/VideoComponent/VideoCall';
import { verificationMeeting } from '@/app/services/expert/meetingApi';

export default function VideoCallPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [meetingData, setMeetingData] = useState<{
    _id: string;
    meetingId: string;
  } | null>(null);

  useEffect(() => {
    const validateMeeting = async () => {
      try {
        const token = localStorage.getItem("userAccessToken");
        if (!token) {
          router.push('/login');
          return;
        }

        // Get meeting details from localStorage (set during handleJoinMeeting)
        const storedMeeting = localStorage.getItem('currentMeeting');
        console.log("storedMeeting",storedMeeting)
        if (!storedMeeting) {
        //   router.push('/dashboard');
          return;
        }
        const { _id, meetingId } = JSON.parse(storedMeeting);
        const response = await verificationMeeting(token,_id,meetingId)
        if(!response.status){
            return
        }
        setMeetingData({ _id, meetingId });
        setIsAuthorized(true);
      } catch (error) {
        console.error('Meeting validation failed:', error);
        // router.push('/dashboard');
      }
    };

    validateMeeting();
  }, [router]);

  const handleCallEnd = () => {
    localStorage.removeItem('currentMeeting');
    // router.push('/dashboard');
  };

  if (!isAuthorized || !meetingData) {
    return <div>Validating meeting access...</div>;
  }

  return (
    <div>
      <VideoCall 
        roomId={`${meetingData._id}-${meetingData.meetingId}`}
        onCallEnd={handleCallEnd}
      />
    </div>
  );
}