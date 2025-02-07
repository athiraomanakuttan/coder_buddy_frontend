import React, { useState } from "react";
import {  MeetingDataType } from "@/types/types";
interface modelInterface {
    showMeetingModel:boolean,
    setShowMeetingModel:React.Dispatch<React.SetStateAction<boolean>>,
    handleCreateMeeting: (formData: MeetingDataType) => Promise<void>;
}

const MeetingLinkComponent = ({showMeetingModel,setShowMeetingModel,handleCreateMeeting}:modelInterface) => {
  
    const [formData,setFormData]= useState<MeetingDataType>({
      _id:"",
      title:"",
      meetingDate:"",
      postId: "",
      userId: "",
      expertId :  ""
    })

  const closeModal = () => {
    setShowMeetingModel(false);
  };

  return (
    <>
      {showMeetingModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">Meeting Link</h2>
            <div>
            <input
                  type="text"
                  placeholder="title"
                  className="border rounded w-100 p-2 mb-3"
                  value={formData.title}
                  onChange={(e)=>setFormData({...formData,"title":e.target.value})}
                />
                 <input
                  type="datetime-local"
                  className="border rounded w-100 p-2 mb-3"
                  
                  onChange={(e)=>setFormData({...formData,"meetingDate":e.target.value})}
                />
            </div>
           <div className="flex justify-between">
           <button
              onClick={closeModal}
              className="px-4 py-2 border rounded-lg hover:bg-blue-600 transition"
            >
              Close
            </button>

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={()=>handleCreateMeeting(formData)}
            >
              Create Link
            </button>
           </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MeetingLinkComponent;
