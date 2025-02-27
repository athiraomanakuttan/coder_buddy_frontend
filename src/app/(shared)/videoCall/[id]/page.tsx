'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { verificationMeeting } from '@/app/services/expert/meetingApi';
import VideoCallUI from '@/components/VideoComponent/VideoCallUI';

export default function VideoCallPage() {
  const params = useParams(); // Move this to top level
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [meetingData, setMeetingData] = useState<{
    _id: string;
    meetingId: string;
  } | null>(null);

  useEffect(() => {
    const validateMeeting = async () => {
      try {
        const id = params.id; 
        if (!id) {
          return;
        }
        
        const response = await verificationMeeting(id as string);
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
      onCallEnd={handleCallEnd}
      />
    </div>
  );
}