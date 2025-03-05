'use client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { verificationMeeting } from '@/app/services/expert/meetingApi';
import VideoCallUI from '@/components/VideoComponent/VideoCallUI';

export default function VideoCallPage() {
  const router = useRouter()
  const params = useParams(); 
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin,setIsAdmin]= useState("")
  const [expertId,setExpertId]=useState("")
  const [meetingData, setMeetingData] = useState<{
    _id: string;
    meetingId: string;
  } | null>(null);

  // const redirectUser = ()=>{
  //   if(isAdmin)
  //     router.push(`/admin/expertApproval/${expertId}/${meetingData?.meetingId}`)
  //   else
  //   router.push('/expert/dashboard')
    
  // }
  useEffect(()=>{
    setIsAdmin(localStorage.getItem("isAdmin") || "")
  },[])
  useEffect(() => {
    const validateMeeting = async () => {
      try {
        const id = params.id; 
        if (!id) {
          return;
        }
        
        const response = await verificationMeeting(id as string);
        
        if (!response.status) {
          return;
        }
        else 
        setExpertId(response?.data?.userId || "")
        
        setMeetingData({ _id: id as string, meetingId: id as string });
        setIsAuthorized(true);
      } catch (error) {
        console.error('Meeting validation failed:', error);
        
       
      }
    };
    
    validateMeeting();
  }, [params]); // Add params as a dependency
    
  const handleCallEnd = () => {
     
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