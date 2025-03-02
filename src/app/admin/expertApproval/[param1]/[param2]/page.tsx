'use client';
import React, { useState, useEffect } from 'react';
import {toast} from 'react-toastify'
import { useParams, useRouter } from 'next/navigation';
import { changeExpert } from '@/app/services/admin/meetingApi';
const Page = () => {
  
  const {param1,param2} = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter()
  const [token,setToken] = useState("")

  useEffect(() => {
    setToken(localStorage.getItem("userAccessToken") || "")
    setIsModalOpen(true);
  }, []);

  const handleApprove = async (experId: string , meetingId : string) => {
    if(!experId){
      toast.error("expert id is empty please try again");
      return;
    }
    const response =  await changeExpert(token , experId , meetingId,"1")
    if(response){
      toast.success(response.message)
      router.push('/admin/dashboard')
    }
    setIsModalOpen(false);
  };

  const handleReject = async (expertId: string | undefined, meetingId : string) => {
    if(!expertId){
      toast.error("expert id is missing");
      return;
    }
      const response =  await changeExpert(token,expertId,meetingId,"0")
      if(response){
        toast.success("Expert Rejected");
        router.push('/admin/dashboard')
      }
  };
  
  const handleCancel = ()=>{
    router.push('/admin/meeting/meetingList')
  }

  return (
    <div className="flex justify-evenly items-center">
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            padding: "20px",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <h2>You completed the meeting with the expert. Update Expert Status</h2>
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              onClick={handleCancel}
              style={{
                padding: "10px 20px",
                color: "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              className='border'
            >
              Cancel
            </button>


            <button
              onClick={()=>handleApprove(param1 as string, param2 as string)}
              style={{
                padding: "10px 20px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Approve
            </button>


            <button
              onClick={()=>handleReject(param1 as string,param2 as string)}
              style={{
                padding: "10px 20px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Overlay to prevent interactions outside modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        ></div>
      )}
    </div>
  );
};

export default Page;
