import { ErrorResponse } from "@/types/types";
import axios, { AxiosError } from "axios";
import {toast} from 'react-toastify'
const API_URL =  process.env.NEXT_PUBLIC_API_URI


export const getadminexpertMeeting = async (token: string)=>{
    try {
        const response =  await axios.get(`${API_URL}/api/expert/admin-meeting`,{
            headers:{ Authorization:`Bearer ${token}`}
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

export  const verificationMeeting = async (meetingId:string)=>{
    try {
        const response =  await axios.post(`${API_URL}/api/expert/meetings/join`,{meetingId},)
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