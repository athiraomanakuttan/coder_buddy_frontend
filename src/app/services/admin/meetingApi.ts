import { ErrorResponse, NewMeetingType } from "@/types/types"
import  { AxiosError } from "axios";
import { toast } from "react-toastify"
import axiosInstance from "./adminAxiosInstance";

const API_URL = process.env.NEXT_PUBLIC_API_URI

export const createMeetingLink = async (data: NewMeetingType)=>{
    
    try {
        const response =  await axiosInstance.post(`${API_URL}/api/admin/create-meeting-link`,data)
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

export const getMeetingDetails = async (page : number , status :  number) =>{
    
    try {
            const response =  await axiosInstance.post(`${API_URL}/api/admin/get-meeting-details`,{page,status})
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

export const changeExpert =  async (expertId:string , meetingId :  string ,  status :  string)=>{
    try {
        const response =  await axiosInstance.put(`${API_URL}/api/admin/approve-expert`,{expertId,meetingId,status})
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