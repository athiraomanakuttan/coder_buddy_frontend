
import { Chat, concernFormDataType, ParticipantInfo } from "@/types/types";
import axios from "axios";
import { toast } from "react-toastify";
const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const getUserData = async (token: string)=>{
    try {
        const response = await axios.get(`${API_URI}/api/chat/get-chat-list`, { headers: { Authorization: `Bearer ${token}`}})
        const participants = response.data.data
  .map((chat: Chat) => ({
    id: chat.participant.id,
    name: chat.participant.name
  }))
  .filter((participant: ParticipantInfo, index: number, self: ParticipantInfo[]) =>
    index === self.findIndex((p) => p.id === participant.id)
  );
          console.log("participants",participants)
          return participants
    } catch (error) {
        console.log("error while fetching data", error)
        
    }
}

export const getMeetingData = async (token: string, userId: string)=>{
    try {
        const response = await axios.get(`${API_URI}/api/meeting/get-user-meetings`,{
            params:{ participentId : userId},
            headers:{ Authorization : `Bearer ${token}`}
        })
        return response.data
    } catch (error) {
        
    }
}


export const createConcern = async (token: string, data: concernFormDataType)=>{
    try {
        const response =  await axios.post(`${API_URI}/api/concern/create-concern`,{data}, {headers:{Authorization:`Bearer ${token}`}})
        return response.data
    } catch (error) {
        toast.error("something went wrong")
    }
}

export const getUserConcernData = async (token: string, status:number)=>{
    try {
        const response = await axios.get(`${API_URI}/api/concern/get-user-concern`,{
            params:{ status },
            headers:{Authorization:`Bearer ${token}`}
        })
        return response.data
    } catch (error) {
        console.log("unable to fetch data")
    }
}