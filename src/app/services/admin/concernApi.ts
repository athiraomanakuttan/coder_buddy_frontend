import { toast } from "react-toastify";
import axiosInstance from "./adminAxiosInstance";

export const getConcerns =  async (status: number = 0,page: number = 1, limit : number = 10)=>{
    console.log("page",page)
    try {
        const response =  await axiosInstance.get(`/api/admin/get-concern-data`,{
            params:{status,page, limit}
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getUserProfile = async ( userId: string)=>{
    try {
        const response = await axiosInstance.get(`/api/admin/get-user-profile/${userId}`)
        return response.data;
    } catch (error) {
        console.log("error while fetching data",error)
        toast.error("Error fetching  profile") 
    }
}

export const updateUserConcern = async ( concernId: string, status:number)=>{
    try {
        const response = await axiosInstance.put(`/api/admin/update-concern-status`,{concernId,status})
        return response.data
    } catch (error) {
        console.log("unable to update the status. Try again",error)
    }
}