'use client'

import { getMeetingDatas } from "@/app/services/shared/meetingApi"
import ListComponent from "@/components/shared/ListComponent"
import Navbar from "@/components/expert/Navbar/Navbar"
import { MeetingDataType } from "@/types/types"
import { useEffect, useState } from "react"

const meetingPage = () => {
    const [meetingDetails,setMeetingDetails] = useState<MeetingDataType[]>([])
    const [status,setStatus]= useState(0)
    const heading = ["title", "meetingDate","postId"]
    const token = localStorage.getItem("userAccessToken") as string
    const getMeetingData = async ()=>{
        const response =  await getMeetingDatas(token , status)
        if(response)
            setMeetingDetails(response.data)
    }
    
    useEffect(()=>{
        getMeetingData();
    },[status])
  return (
    <div className=" m-0 p-0 flex">
      <div className=" p-0 m-0">
        <Navbar />
      </div>
      <div className="border w-100 p-3">
    {meetingDetails.length === 0 ?(status === 0 ?<> No Scheduled Meetings </> :<> No Meeting history </>):<><ListComponent headings={heading} listData={meetingDetails} role="expert" /></>}

        </div>
        </div>

    
  )
}

export default meetingPage
