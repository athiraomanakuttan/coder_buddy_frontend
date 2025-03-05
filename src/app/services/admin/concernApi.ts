import axios from "axios";
import { toast } from "react-toastify";
const API_URL = process.env.NEXT_PUBLIC_API_URI

export const getConcerns =  async (token: string, status: number = 0,page: number = 1, limit : number = 10)=>{
    console.log("page",page)
    try {
        const response =  await axios.get(`${API_URL}/api/admin/get-concern-data`,{
            params:{status,page, limit},
            headers:{Authorization : `Bearer ${token}`}
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getUserProfile = async (token: string, userId: string)=>{
    try {
        const response = await axios.get(`${API_URL}/api/admin/get-user-profile/${userId}`,
            { headers : {Authorization : `Bearer ${token}`}}
        )
        return response.data;
    } catch (error) {
        console.log("error while fetching data",error)
        toast.error("Error fetching  profile")
    }
}

export const updateUserConcern = async (token: string, concernId: string, status:number)=>{
    try {
        const response = await axios.put(`${API_URL}/api/admin/update-concern-status`,{concernId,status},{headers:{Authorization: `Bearer ${token}`}})
        return response.data
    } catch (error) {
        console.log("unable to update the status. Try again",error)
    }
}