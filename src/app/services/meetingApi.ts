import { NewMeetingType } from "@/types/types"
import axios from "axios";
import { toast } from "react-toastify"

const API_URL = process.env.NEXT_PUBLIC_API_URI

export const createMeetingLink = async (token : string , data: NewMeetingType)=>{
    if(!token){
        toast.error("session Timeout please login again");
        return
    }
    try {
        const response =  await axios.post(`${API_URL}/api/admin/create-meeting-link`,data,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return response.data
    } catch (error : any) {
        console.log(error)
        if(error.response)
            toast.error(error.response.data.message)
    }
    
}