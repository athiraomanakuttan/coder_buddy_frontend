import axios from "axios";
import { toast } from "react-toastify";
const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const  getPaymentsList = async (token: string, status: number, page: number = 1, count: number = 5)=>{
    if(!token){
        toast.error("session expired. Please login")
        return
    }
    try {
        const response =  await axios.get(`${API_URI}/api/payment/get-payments`,{
            params:{ status , page , count},
            headers:{Authorization:`Bearer ${token}`}
        })
        return response.data
    } catch (error) {
        console.log("error while fetching payemnt details", error)
    }
}



export const getPaymentById = async (token:string, paymentId: string)=>{
    try {
        const response  =  await axios.get(`${API_URI}/api/payment/get-payment-details/${paymentId}`,{headers:{Authorization:`Bearer ${token}`}})
        return response.data
    } catch (error) {
        console.log(error)
        toast.error("some thing went wrong. please try again")
    }
}

export const createOrder = async (token: string, amount:number| string,orderId:string)=>{
    try {
        const response = await axios.post(`${API_URI}/api/payment/create-order`,{ 
            amount,
            orderId
        },{headers:{Authorization:`Bearer ${token}`}})
        return response.data
    } catch (error) {
        console.log("unable to create order", error)
    }
}

export const verifyPayment = async (token: string, razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string, id:string) => {
    try {
        const response = await axios.post(`${API_URI}/api/payment/verify`, 
            { razorpay_payment_id, razorpay_order_id, razorpay_signature ,paymentId:id},
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return response.data // Ensure you're returning the data
    } catch (error) {
        console.error("error while payment verification", error)
        toast.error('Payment Verification Failed')
        return null
    }
}


export const getUserById  =  async (token: string,userId: string)=>{
    try {
      const responce =  await axios.get(`${API_URI}/api/expert/get-user-profile/${userId}`,{headers:{Authorization:`Bearer ${token}`}})
      return responce.data
    } catch (error) {
        console.log(error)
      toast.error("unable to fetch user data")
    }
  }