import { MeetingDataType } from "@/types/types";
import axios from "axios";
import { toast } from "react-toastify";
const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const createMeeting = async (token: string, formData:MeetingDataType, participentId: string, postId: String)=>{
    try {
        const reponse = await axios.post(`${API_URI}/api/meeting/create-meeting`, {...formData, userId:participentId,postId},{ 
            headers:{Authorization:`Bearer ${token}`}
        })
        return reponse.data
    } catch (error) {
        toast.error("unable to create meeting link. Try again")
    }
}

export const getMeetingDatas = async (token: string, status : number = 0)=>{
    try {
        const response = await axios.get(`${API_URI}/api/meeting/get-meeting-data`, {
            params: { status },
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(response)
        return response.data
    } catch (error) {
        console.log("error while getting meeting data",error)
    }
}