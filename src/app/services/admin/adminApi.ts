import { basicType, ErrorResponse } from "@/types/types";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import axiosInstance from "./adminAxiosInstance";
const API_URL = process.env.NEXT_PUBLIC_API_URI

export const  signupPost=async (data:basicType)=>{
    try {
        const response =  await axios.post(`${API_URL}/api/admin/login`,data)
        console.log(response)
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

export const getUserDetails = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axiosInstance.get(`/api/admin/user-details?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details', error);
        throw error;
    }
}


export const getexpertDetails = async (expertState: number , page: number = 1, limit: number = 10 ) => {
    try {
        const response = await axiosInstance.get(`/api/admin/expert-details`, {
            params: {
                status: expertState ,
                page,
                limit
            },
        })
        
        return response.data
    } catch (error) {
        console.error("Error fetching user details", error)
    }
}

export const userStatusChange = async (id:string, status: number)=>{
    if(!id || status=== undefined){
        toast.error("unable to change the user status")
        return;
    }
    try {
        const response = await axiosInstance.put(`/api/admin/changeUserStatus`,{ id,status}
        )
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

export const getExpertsProfile  = async (id: string)=>{
    if(!id){
        toast.error("id is empty please try once more");
        return
    }
    try {
        const response =  await axiosInstance.get(`/api/admin/get-expert/${id}`)
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
export const rejectExpertRequest =  async (expertId:string ) =>{
    
    try {
        const response = await axiosInstance.put(`/api/admin/reject-expert`,{id:expertId})
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

// enable and desible expert

export const changeExpertStatus = async (expertId: string, status: number) => {
    try {
            const response = await axiosInstance.put(`/api/admin/change-expert-status`,{expertId, status})
            return response.data;
    } catch (error) {
        console.log(error)
        toast.error("unable to change the expert status.")
    }
}

export const getProfitData = async ( year: number)=>{
    try {
        const response = await axiosInstance.get(`/api/admin/get-profit-report`,{
            params:{year},
           
        })
        return response.data;
    } catch (error) {
        console.log("error while getting report", error)
    }
}

export const getAdminDashboardData = async ()=>{
    try {
        const response = await axiosInstance.get(`/api/admin/get-dasboard-data`)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getWalletDetails  = async ()=>{
    try {
        const response = await axiosInstance.get(`/api/admin/get-wallet-data`)
        return response.data
    } catch (error) {
        console.log(error)
    }
}