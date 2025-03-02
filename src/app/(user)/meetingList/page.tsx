'use client'

import { getMeetingDatas } from "@/app/services/shared/meetingApi"
import ListComponent from "@/components/shared/ListComponent"
import Navbar from "@/components/user/Navbar/Navbar"
import { useLocalStorage } from "@/Hooks/useLocalStorage"
import { MeetingDataType } from "@/types/types"
import { useEffect, useState } from "react"

const MeetingPage = () => {
    const [meetingDetails,setMeetingDetails] = useState<MeetingDataType[]>([])
    const [meetingStatus,setMeetingStatus]= useState(0)
    const heading = ["title", "meetingDate","postId"]
    const [token] = useLocalStorage("userAccessToken","")
    const [pagination, setPagination] = useState({
      currentPage: 1,
      totalPages: 0,
      totalRecords: 0,
      limit: 5,
  });

    const getMeetingData = async (page:number)=>{
        const response =  await getMeetingDatas(token , meetingStatus, page )
        if(response)
        {   
          setMeetingDetails(response.data.meetingData)
          const totalPages = Math.ceil(response.data.dataCount / 5)
          setPagination({...pagination,totalPages,totalRecords:response.data.dataCount,limit:5,currentPage:page})
        }
    }
    const handlePageChange = (newPage: number) => {
      console.log("new page", newPage);
      getMeetingData(newPage);
  };

    
    useEffect(()=>{
        getMeetingData(1);
    },[meetingStatus])
  return (
    <div className=" m-0 p-0 flex">
      <div className=" p-0 m-0">
        <Navbar />
      </div>
      <div className="border w-100 p-3">
        <div className="flex justify-end mb-2 gap-3">
              <button className={`${meetingStatus ? "bg-transparent" : "bg-sky-300 "} pl-4 pr-4 pt-2 pb-2 border rounded`}  onClick={() =>setMeetingStatus(0)}>Scheduled</button>
              <button className={`${meetingStatus ? "bg-sky-300" : "bg-transparent "} pl-4 pr-4 pt-2 pb-2 border rounded`} onClick={() =>setMeetingStatus(1)}>History</button>
        </div>

    {meetingDetails.length === 0 ?(meetingStatus === 0 ?<> No Scheduled Meetings </> :<> No Meeting history </>):
    <><ListComponent headings={heading} listData={meetingDetails} role="user" meetingStatus={meetingStatus} /></>}

<div className="flex justify-end items-end mt-4 space-x-4 mb-2">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="px-4 py-2 bg-primarys text-white rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span>
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="px-4 py-2 bg-primarys text-white rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
        </div>
        </div>

    
  )
}

export default MeetingPage
