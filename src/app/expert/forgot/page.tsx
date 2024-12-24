'use client'

import { forgotPssword } from "@/app/services/expert/expertApi";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const forgotPassword = ()=>{
    const router =  useRouter()
    const [email,setEmal]= useState<string>("")
    const handleFormSubmit =  async (e:React.FormEvent<HTMLElement>)=>{
        e.preventDefault()
        if(!email){
            toast.error("email is required")
            return
        }
        const response =  await forgotPssword(email)
        if(response)
        {
            localStorage.setItem('email',response.data.email)
            localStorage.setItem('otp',response.data.otp)
            toast.success(response.message)
            router.push('/expert/forgototp')
        }

    }
    return(
        <>
        <div className="container">
            <div className="row pt-24">
                <div className="col-6 mx-auto border p-5">
                    <h3 className="text-center">Forgot Password?</h3>
                   <form onSubmit={handleFormSubmit}>
                   <input
                  type="text"
                  placeholder="Enter your email id"
                  className="border rounded w-100 p-2 mb-3 mt-3"
                  value={email}
                  onChange={(e)=>setEmal(e.target.value)}
                />
                <input type="submit" value="Send OTP"  className="w-100 bg-secondarys p-2 mb-3 text-white"  />
                   </form>
                
                </div>
            </div>
        </div>
        </>
    )
}

export default forgotPassword;