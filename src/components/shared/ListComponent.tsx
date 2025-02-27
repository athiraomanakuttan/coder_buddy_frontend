import { getMeetingFeedback } from "@/app/services/shared/meetingApi";
import {  formatDateAndTime } from "@/app/utils/dateUtils"
import { MeetingDataType, RatingData } from "@/types/types"
import Link from "next/link";
import { useState } from "react";
import FeedbackModal from "./FeedbackComponent";

interface ListDataType {
    headings: string[],
    listData: MeetingDataType[],
    role: string,
    meetingStatus : number
}

const ListComponent = ({ headings, listData , role, meetingStatus}: ListDataType) => {
  const token = localStorage.getItem("userAccessToken") || ""
  const [feedbackData, setFeedbackData]= useState<RatingData | null>(null)
  const [isOpen,setIsOpen] = useState(false)
  const renderCellContent = (item: MeetingDataType, heading: string) => {
    const value = item[heading as keyof MeetingDataType];
    
    if(heading === "createdAt" || heading === "updatedAt" || heading === "meetingDate") {
      return formatDateAndTime(value as string);
    }
    
    if(Array.isArray(value)) {
      return value.join(', ');
    }
    
    return value?.toString() || 'N/A';
  };

  const getMeetingReview = async (meetingId: string)=>{
    const response = await getMeetingFeedback(token,meetingId)
    if(response)
      setFeedbackData(response.data)
    setIsOpen(true)
  }

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-sky-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {headings.map((title, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3"
                >
                  {title}
                </th>
              ))}
              <th>Action</th>
              <th>Action</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listData && listData.length > 0 ? (
              listData.map((item, itemIndex) => (
                <tr 
                  key={itemIndex} 
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  {headings.map((heading, headingIndex) => (
                    <td 
                      key={headingIndex} 
                      className="px-6 py-4"
                    >
                      {renderCellContent(item, heading)}
                    </td>
                  ))}
                  <td><Link href={`/post/${item.postId}`}><label htmlFor="" className="hover:text-sky-300 hover:underline">View Post Details</label></Link></td>
                  <td> {role === "user" ? <Link href={`/expertprofile/${item.expertId}`} > <label htmlFor="" className="hover:text-sky-300 hover:underline">View Expert</label></Link>:  <Link href={`/expert/userProfile/${item.userId}`}>View User</Link>} </td>
                  <td>{meetingStatus=== 0 ? <Link href={`/userVideoCall/${item._id}`}><button className="p-2 bg-primarys text-white hover:bg-sky-300">Join Meeting</button></Link> : <button onClick={()=>getMeetingReview(item._id)} className="text-sky-500 hover:text-sky-700">View Rating</button>}</td>
                </tr>
              ))
              
            ) : (
              <tr>
                <td colSpan={headings.length} className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isOpen && <FeedbackModal feedbackData={feedbackData} isOpen onClose={()=>setIsOpen(false)}/>}
    </div>
  )
}

export default ListComponent