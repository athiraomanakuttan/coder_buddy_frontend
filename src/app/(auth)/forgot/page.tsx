 'use client'
import { userForgotPassword } from "@/app/services/user/userApi"
 import { useState } from "react"
 import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
 const ForgotPassword = ()=>{
    const router = useRouter()
    const [email, setEmail] =  useState<string>("")
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement> )=>{
        e.preventDefault()
        
        
        const response = await userForgotPassword(email)
        if(response)
        {
            toast.success(response.message)
            localStorage.setItem("email",response?.data?.email)
            localStorage.setItem("otp",response?.data?.otp)
            router.push('/forgototp')
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
                  onChange={(e)=>setEmail(e.target.value)}
                />
                <input type="submit" value="Send OTP"  className="w-100 bg-primarys p-2 mb-3 text-white"  />
                    </form>
                
                </div>
            </div>
        </div>
        </>
    )
}

export default ForgotPassword;