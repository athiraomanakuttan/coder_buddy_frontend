import { ErrorResponse, NewMeetingType } from "@/types/types"
import axios, { AxiosError } from "axios";
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
    } catch (error ) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 400) {
              const errorData = error.response.data as ErrorResponse;
              toast.error(errorData.message);
            } else {
              toast.error("Unable to login. Try again");
            }
          } else {
            toast.error("An unexpected error occurred");
          }
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
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 400) {
              const errorData = error.response.data as ErrorResponse;
              toast.error(errorData.message);
            } else {
              toast.error("Unable to login. Try again");
            }
          } else {
            toast.error("An unexpected error occurred");
          }
    }
}

export const changeExpert =  async (token:string, expertId:string , meetingId :  string ,  status :  string)=>{
    try {
        const response =  await axios.put(`${API_URL}/api/admin/approve-expert`,{expertId,meetingId,status},{ 
            headers:{ Authorization:`Bearer ${token}`}
        })
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 400) {
              const errorData = error.response.data as ErrorResponse;
              toast.error(errorData.message);
            } else {
              toast.error("Unable to login. Try again");
            }
          } else {
            toast.error("An unexpected error occurred");
          }
    }
}