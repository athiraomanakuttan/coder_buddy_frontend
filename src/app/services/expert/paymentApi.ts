import { toast } from "react-toastify";
import axiosInstance from "./expertAxiosInstance";

export const paymentCreation = async (title:string,amount:string|number,userId:string,selectedPostId : string)=>{
    try {
        const responce =  await axiosInstance.post(`/api/expert/create-payment-link`,{title,amount,userId,postId:selectedPostId})
        return responce.data
    } catch (error) {
        console.log(error)
        toast.error("Unable to create payment link. Try again")
    }
}

export const getExpertWalletData = async ()=>{
    try {
        const responce = await axiosInstance.get(`/api/wallet/get-wallet`)
        return responce.data
    } catch (error) {
        console.log(error)
    }
}

export const expertPayOut = async (amount: string, UPIid: string)=>{
    try {
        const responce = await axiosInstance.post(`/api/wallet/expert-payout`,{amount, UPIid})
        return responce.data
    } catch (error) {
        console.log(error)
        toast.error("unable to withdrow the amount. Try again")
    }
}