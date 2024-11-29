'use client'
import { signupPost } from "@/app/services/expertApi";
import { signupValidation } from "@/app/utils/validation";
import { basicType } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const signup = ()=>{
  const router = useRouter()
  const [formData, setFormData]= useState<basicType>({
    email:"",
    password:""
  })
  const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const validation = signupValidation(formData)
    if(!validation.status){
      toast.error(validation.message)
      return;
    }
    try {
      const response =  await signupPost(formData)
      console.log(response)
      if(response.data.status){
        const data = response.data;
        toast.success(data.message)
        localStorage.setItem('email', data.data.email)
        localStorage.setItem('otp', data.data.otp)
        router.push('/expert/otp')
      }
      else
      toast.error(response.data.message)

    } catch (error) {
      
    }
  }
return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-7 p-5  col-sm-12">
            <div className="inner-div border rounded pr-5 pl-5 pt-14 pb-10">
              <form onSubmit={handleFormSubmit}>
                <h1 className="text-center text-3xl mb-3">Sign Up</h1>
                <input
                  type="email"
                  placeholder="Enter your email id"
                  className="border rounded w-100 p-2 mb-3"
                  value={formData.email}
                  onChange={(e)=>setFormData({...formData,email:e.target.value})}
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="border rounded w-100 p-2 mb-3"
                  value={formData.password}
                  onChange={(e)=>setFormData({...formData,password:e.target.value})}
                />
                <input type="submit" value="Register"  className="w-100 bg-secondarys p-2 mb-3 text-white"  />
                <button className="border-black border rounded w-100 p-2 mb-3" >
                    <img src="/icons/g-icon.png" alt=""  className="d-inline m-1"/>
                     Sign up with google </button>
              </form>
              <div className="flex justify-end">
            <p className="custom-link mb-8">Already have an account? <Link href='/expert/login'  className="custom-link">Sign In</Link></p>
          </div>
            </div>
          </div>
          <div className="col-5 d-none d-md-inline pt-5 ">
            <div className="inner-div border rounded ">
              <img src="/images/expert_login.png" alt="" className="mx-auto" />
            </div>
          </div>
          
        </div>
      </div>
    </>
)
}

export default signup;