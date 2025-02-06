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
        toast.error("unable to get the tickets. Try again")
    }
}