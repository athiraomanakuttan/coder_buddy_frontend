import axios from "axios";
import { toast } from "react-toastify";
const API_URI = process.env.NEXT_PUBLIC_API_URI;



export const getConversationList = async (token:string)=>{
    try {
        const response = await axios.get(`${API_URI}/api/chat/get-chat-list`,{
            headers:{Authorization:`Bearer ${token}`}
        })
        return response.data
    } catch (error) {
        console.log("error getting details of conversations")
    }
}