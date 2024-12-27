import axios from "axios";
import {toast} from 'react-toastify'
const API_URL =  process.env.NEXT_PUBLIC_API_URI


export const getadminexpertMeeting = async (token: string)=>{
    try {
        const response =  await axios.get(`${API_URL}/api/expert/admin-meeting`,{
            headers:{ Authorization:`Bearer ${token}`}
        })
        return response.data
    } catch (error:any) {
            console.log("error while getting data",error)
    }
}

export  const verificationMeeting = async (meetingId:string)=>{
    try {
        const response =  await axios.post(`${API_URL}/api/expert/meetings/join`,{meetingId},)
        return response.data
    } catch (error:any) {
        if(error?.response?.data){
            toast.error(error.response.data.message)
        }
    }
}