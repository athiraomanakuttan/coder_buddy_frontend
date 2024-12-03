import { basicType, ExpertType } from "@/types/types";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = process.env.NEXT_PUBLIC_API_URI

export const  signupPost=async (data:basicType)=>{
    try {
        const response =  await axios.post(`${API_URL}/api/admin/login`,data)
        console.log(response)
        return response.data
    } catch (error: any) {
        if(error.response?.status === 400)
        toast.error(error.response?.data?.message)
        else
        toast.error("unable to login. try again")
    }
}

export const getUserDetails =  async (token : string)=>{
    try {
        const response =  await axios.get(`${API_URL}/api/admin/user-details`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        })
        return response.data
    } catch (error) {
        console.log("error fetchning user details", error)
    }
}