import { MeetingDataType } from "@/types/types";
import axios from "axios";
import { toast } from "react-toastify";
const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const createMeeting = async (token: string, formData:MeetingDataType, participentId: string)=>{
    try {
        const reponse = await axios.post(`${API_URI}/api/meeting/create-meeting`, {...formData, userId:participentId},{ 
            headers:{Authorization:`Bearer ${token}`}
        })
        return reponse.data
    } catch (error) {
        toast.error("unable to create meeting link. Try again")
    }
}
