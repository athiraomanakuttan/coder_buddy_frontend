import axios from "axios";
import { headers } from "next/headers";
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

export const getUserChat = async (chatId:string, token:string | null)=>{
    if(!token || !chatId){
        return null;
    }
    try {
        const response = await axios.get(`${API_URI}/api/chat/${chatId}`,{ headers:{Authorization:`Bearer ${token}`}})
        return response.data
    } catch (error) {
        toast.error("Unable to load chat try again ");
    }
}

export const newMessage = async (token : string | null, receiverId:string,message:string , chatId:string | null )=>{
    try {
        if(!token){
        toast.error("Token expired. Please LogIn")
        return
        }
        const response = await axios.post(`${API_URI}/api/chat/new-chat`,{receiverId,message,chatId},{
            headers:{Authorization:`Bearer ${token}`}
        })
        
        return response.data
    } catch (error) {
        console.log("error while adding new chat",error)
        toast.error("error while adding new chat. Try Again!")
    }
}