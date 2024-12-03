'use client'

import { basicType } from "@/types/types";
import { useRouter } from "next/navigation";
import {  useState,useEffect } from "react";
import { toast } from "react-toastify";
import useAuthStore from "@/store/authStore";
import { signupValidation } from "@/app/utils/validation";
import { signupPost } from "@/app/services/adminApi";

const adminLogin = () => {
  const {setUserAuth, isAuthenticated} = useAuthStore()
  const router = useRouter()
  useEffect(() => {
    // if (isAuthenticated) {
    //   route.push("/expert/dashboard");
    // }
  }, [isAuthenticated, router]);

  const [formData,steFormData]= useState<basicType>({
    email:"",
    password:""
  })
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = await signupValidation(formData)
    if(!validation.status)
    {
      toast.error(validation.message)
      return;
    }
    try { 
      const responce = await signupPost(formData)
      if(responce.status)
      {
        toast.success(responce.message)
        setUserAuth({email:formData.email},responce.data.accessToken)
        router.push('/admin/dashboard')
      }
    } catch (error) {
      
    }
  };
  

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-7 p-5  col-sm-12">
            <div className="inner-div border rounded pr-3 pl-3 pt-14 pb-10">
              <form onSubmit={handleFormSubmit}>
                <h1 className="text-center text-3xl mb-2">Sign In</h1>
                <input
                  type="email"
                  placeholder="Enter your email id"
                  className="border rounded w-100 p-2 mb-3"
                  value={formData.email}
                  onChange={(e)=>steFormData({...formData,email : e.target.value})}
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="border rounded w-100 p-2 mb-3"
                  value={formData.password}
                  onChange={(e)=>steFormData({...formData,password : e.target.value})}
                />
                <input type="submit" value="Login"  className="w-100 bg-adminprimary p-2 mb-7 text-white text-black"  />
                
              </form>
              <div className="flex justify-between mb-7">
          </div>
            </div>
          </div>
          <div className="col-5 d-none d-md-inline pt-5">
            <img src="/images/admin-login.jpg" alt="" className="mx-auto border" />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default adminLogin;
