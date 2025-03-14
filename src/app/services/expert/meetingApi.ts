import { ErrorResponse } from "@/types/types";
import { AxiosError } from "axios";
import {toast} from 'react-toastify'
import axiosInstance from "./expertAxiosInstance";

export const getadminexpertMeeting = async ()=>{
    try {
        const response =  await axiosInstance.get(`/api/expert/admin-meeting`)
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
        const response =  await axiosInstance.post(`/api/expert/meetings/join`,{meetingId},)
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