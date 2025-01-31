'use client'
import { createConcern, getMeetingData, getUserData } from "@/app/services/shared/concernApi";
import { concernValidation } from "@/app/utils/validation";
import { concernFormDataType, concernMeetingType, concernUserType, ParticipantInfo } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
interface ConcernType {
  setConcernModel: React.Dispatch<React.SetStateAction<boolean>>;
  isExpert: string;
}

const ConcernComponent = ({ setConcernModel, isExpert }: ConcernType) => {
    const [formData, setFormData] =  useState<concernFormDataType>({title: "",
        description:"",
        userId: "",
        meetingId:""})
    const [userData,setUserData]= useState<ParticipantInfo[]>([])
    const [meetingData, setMeetingData]= useState<concernMeetingType[]>([])
    const [selectedUser, setSelectedUser]= useState("")
    const [selectedMeeting, setSelectedMeeting] = useState("")

    const token = localStorage.getItem("userAccessToken") as string || ""

    const getUserDetails = async ()=>{
        let response = await getUserData(token)
        if(response){
            setUserData(response)
        }
    }

const getMeetingDetails =  async ()=>{
    const response =  await getMeetingData(token, selectedUser)
    if(response)
        setMeetingData(response.data)
}

const handleSubmit = async ()=>{
    const isValid = concernValidation(formData)
    if(!isValid.status){
        toast.error(isValid.message)
        return
    }
    setFormData({...formData, "meetingId":selectedMeeting, "userId": selectedUser}) 
    const response =  await createConcern(token,formData)
    if(response)
    {    toast.success("concern created sucessfully")
        setConcernModel(false)
    }

}
    
useEffect(()=>{
    getUserDetails()
},[])

useEffect(()=>{
if(selectedUser)
    getMeetingDetails()
},[selectedUser])

  return(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">Do you have a concern ? </h2>
        <div>
          <label>Title</label>
          <input
            type="text"
            placeholder="title"
            className="border rounded w-100 p-2 mb-3"
            value={formData?.title}
            onChange={(e)=>{setFormData({...formData,["title"]:e.target.value})}}
          />
          <label>Description</label>
          <textarea
            placeholder="Detailed concern"
            className="border rounded w-100 p-2 mb-3 row-span-9"
            value={formData?.description}
            onChange={(e)=>{setFormData({...formData,["description"]:e.target.value})}}
          ></textarea>

          {isExpert ? (
            <label htmlFor=""> select user</label>
          ) : (
            <label htmlFor="">select Expert</label>
          )}
          <select className="border rounded w-100 p-2 mb-3" onChange={(e)=>setSelectedUser(e.target.value)}>
            <option > choose a user </option>
            {userData.map((user:ParticipantInfo)=>(
                <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>

          <label htmlFor="">select Meeting</label>
          <select className="border rounded w-100 p-2 mb-3" onChange={(e)=>setSelectedMeeting(e.target.value)}>
            <option value="">Select a meeting</option>
            { meetingData.map((meeting:concernMeetingType)=>(
                <option key={meeting._id} value={meeting._id}>{meeting.title}</option>
            )) }
          </select>

          <input type="file" className="border rounded w-100 p-2 mb-3" />
        </div>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 border rounded-lg hover:bg-blue-600 transition"
            onClick={() => setConcernModel(false)}
          >
            Close
          </button>

          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConcernComponent;
