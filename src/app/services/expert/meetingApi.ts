import axios from "axios";

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