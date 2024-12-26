'use client';
import React, { useState, useEffect } from 'react';
import {toast} from 'react-toastify'
import { useParams, useRouter } from 'next/navigation';
import { rejectExpertRequest } from '@/app/services/admin/adminApi';
import { approveExpert } from '@/app/services/admin/meetingApi';
const Page = () => {
  
  const {id} = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter()
  const token = localStorage.getItem("userAccessToken") as string

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handleApprove = async (id: string) => {
    if(!id){
      toast.error("expert id is empty please try again");
      return;
    }
    const response =  await approveExpert(token , id)
    if(response){
      toast.success(response.message)
      router.push('/admin/dashboard')
    }
    setIsModalOpen(false);
  };

  const handleReject = async (id: string | undefined) => {
    if(!id){
      toast.error("expert id is missing");
      return;
    }
      const response =  await rejectExpertRequest(id, token)
      if(response){
        toast.success("Expert Rejected");
        router.push('/admin/dashboard')
      }
  };
  

  return (
    <div className="flex flex-col justify-center items-center">
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
              onClick={()=>handleApprove(id as string)}
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
              onClick={()=>handleReject(id as string)}
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
