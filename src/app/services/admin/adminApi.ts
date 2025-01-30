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

export const getUserDetails = async (token: string, page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/user-details?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error fetching user details', error);
        throw error;
    }
}


export const getexpertDetails = async (token: string,expertState: number , page: number = 1, limit: number = 10 ) => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/expert-details`, {
            
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                status: expertState ,
                page,
                limit
            },
            withCredentials: true,
        })
        
        return response.data
    } catch (error) {
        console.error("Error fetching user details", error)
    }
}

export const userStatusChange = async (id:string, status: string,token: string)=>{
    if(!id || status=== undefined){
        toast.error("unable to change the user status")
        return;
    }
    try {
        const response = await axios.put(`${API_URL}/api/admin/changeUserStatus`,{ id,status},{
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        }
        )
        return response.data
    } catch (error:any) {
        console.log(error)
        if(error.status)
            toast.error(error.response.data.message)
    }
}

export const getExpertsProfile  = async (id: string, token : string)=>{
    if(!id){
        toast.error("id is empty please try once more");
        return
    }
    try {
        const response =  await axios.get(`${API_URL}/api/admin/get-expert/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return response.data
    } catch (error:any) {
       console.log(error.response.message)
    }
}
export const rejectExpertRequest =  async (expertId:string , token: string) =>{
    if(!token){
        toast.error("not able to  reject request. Try again!")
        return;
    }
    try {
        const response = await axios.put(`${API_URL}/api/admin/reject-expert`,{id:expertId},{
            headers:{
                Authorization: `Bearer ${token}`
            }})
        return response.data
    } catch (error:any) {
        if(error.status)
            toast.error(error.response.data.message)
    }
}

// enable and desible expert

export const changeExpertStatus = async (token: string, expertId: string, status: number) => {
    try {
            const response = await axios.put(`${API_URL}/api/admin/change-expert-status`,{expertId, status},
                { headers : {Authorization : `Bearer ${token}`}}
            )
            return response.data;
    } catch (error) {
        toast.error("unable to change the expert status.")
    }
}