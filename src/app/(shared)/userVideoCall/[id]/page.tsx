'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import VideoCallUI from '@/components/VideoComponent/VideoCallUI';
import { meetingVerification } from '@/app/services/shared/meetingApi';

export default function VideoCallPage() {
  const params = useParams(); 
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [meetingData, setMeetingData] = useState<{
    _id: string;
    meetingId: string;
  } | null>(null);
  const token = localStorage.getItem("userAccessToken") as string
  useEffect(() => {
    const validateMeeting = async () => {
      try {
        
        const id = params.id as string; 
        console.log("Id", token)
        if (!id) 
          return;
        
        const response = await meetingVerification(token, id)
        console.log("response", response);
        if (!response.status) {
          return;
        }
        
        setMeetingData({ _id: id as string, meetingId: id as string });
        setIsAuthorized(true);
      } catch (error) {
        console.error('Meeting validation failed:', error);
        // router.push('/expert/dashboard');
      }
    };
    
    validateMeeting();
  }, [params]); // Add params as a dependency
    
  const handleCallEnd = () => {
    // router.push('/dashboard');
  };

  if (!isAuthorized || !meetingData) {
    return <div>Validating meeting access...</div>;
  }

  return (
    <div>
      {/* <VideoCall 
        roomId={`${meetingData._id}-${meetingData.meetingId}`}
        onCallEnd={handleCallEnd}
      /> */}
      <VideoCallUI 
      roomId={`${meetingData._id}-${meetingData.meetingId}`}
      meetingId={`${meetingData.meetingId}`}
      onCallEnd={handleCallEnd}
      />
    </div>
  );
}