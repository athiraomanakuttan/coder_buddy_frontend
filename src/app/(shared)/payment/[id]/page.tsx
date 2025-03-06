'use client'

import { createOrder, getPaymentById, verifyPayment } from "@/app/services/shared/paymentApi"
import Navbar from "@/components/user/Navbar/Navbar"
import { PaymentType, RazorpayOptions, RazorpayOrderResponse, RazorpayResponse } from "@/types/types"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"


const PaymentCompnent = () => {
    const {id} = useParams()
    const router = useRouter()
    const [paymentDetails,setPaymentDetails] =  useState<PaymentType>()
    const [token,setToken]= useState("")

    useEffect(()=>{
        setToken(localStorage.getItem("userAccessToken") || "")
    },[])
    const initiateRazorpayPayment = async () => {
        try {
            if(!paymentDetails){
                toast.error("amount is not valid");
                return
            }

            const response: RazorpayOrderResponse = await createOrder(token, paymentDetails.amount, id as string)

            const options : RazorpayOptions  = {
                key: response.key,
                amount: response.amount,
                currency: "INR",
                name: "Your Company Name",
                description: paymentDetails.title,
                order_id: response.id,
                handler: async (response: RazorpayResponse) => {
                    const res = await verifyPayment(
                        token, 
                        response.razorpay_payment_id, 
                        response.razorpay_order_id,
                        response.razorpay_signature,
                        id as string
                    )
                    // Add error handling and success/failure toast
                    if (res?.status === 'success') {
                        toast.success('Payment Verified Successfully');
                        router.push('/payment')
                        // Redirect or perform next action
                    } else {
                        toast.error('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: "Customer Name",
                    email: "customer@example.com",
                    contact: "9999999999"
                }
            }
            console.log("options",options)
            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.error("Payment initiation failed", error)
        }
    }


     

    useEffect(()=>{
       
        const getPayementDetails = async ()=>{
            const response =  await getPaymentById(token,id as string)
            if(!response.data){
                toast.error("invalid paymentId")
                return
            }
            setPaymentDetails(response.data)
            const script = document.createElement('script')
                script.src = 'https://checkout.razorpay.com/v1/checkout.js'
                script.async = true
                document.body.appendChild(script)
    
        }
        
        if(!id || !token){
            toast.error("payment is empty")
            return
        }
        else
        getPayementDetails()

        
    },[id,token])
  return (

    <div className=" m-0 p-0 flex">
      <div className=" p-0 m-0">
        {  <Navbar />}
      </div>
      <div className="border w-100">
        <div className="container pt-5">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4">
    <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Details</h2>
        <p className="text-gray-600 mb-4">Complete your transaction</p>
    </div>
    
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">
                ₹{paymentDetails?.amount || 0}
            </span>
        </div>
    </div>

    <button 
        onClick={initiateRazorpayPayment} 
        className="w-full bg-primarys text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
    >
        Continue Payment
    </button>
            </div>
            </div>
            </div>
        </div>
    
  )
}

export default PaymentCompnent
