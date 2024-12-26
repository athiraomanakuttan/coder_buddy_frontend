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

export const getMeetingDetails = async (token : string , page : number , status :  number) =>{
    if(!token){
        toast.error("Not authorized try again")
        return
    }
    try {
            const response =  await axios.post(`${API_URL}/api/admin/get-meeting-details`,{page,status},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            return response.data
    } catch (error:any) {
            console.log(error)
    }
}

export const approveExpert =  async (token:string, expertId:string)=>{
    try {
        const response =  await axios.put(`${API_URL}/api/admin/approve-expert`,{expertId},{ 
            headers:{ Authorization:`Bearer ${token}`}
        })
        return response.data;
    } catch (error:any) {
        if(error.response){
            toast.error(error?.response?.data?.message)
        }
    }
}