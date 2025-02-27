'use client'

import { basicType } from "@/types/types";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { toast } from "react-toastify";
import useAuthStore from "@/store/authStore";
import { signupValidation } from "@/app/utils/validation";
import { signupPost } from "@/app/services/admin/adminApi";
import Image from "next/image";

const AdminLogin = () => {
  const {setUserAuth} = useAuthStore()
  const router = useRouter()
  const [isLoading,setIsLoading] = useState(false)
  const [formData,steFormData]= useState<basicType>({
    email:"",
    password:""
  })
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    const validation = signupValidation(formData)
    if(!validation.status)
    {
      toast.error(validation.message)
      setIsLoading(false)
      return;
    }
    try { 
      const response = await signupPost(formData)
      if(response.status)
      {
        setUserAuth(
          { email: formData.email }, 
          response.accessToken 
        )
        toast.success(response.message)
        localStorage.setItem("isAdmin","1")
        router.push('/admin/dashboard')
      }
    } catch (error) {
      console.log("error occured when fetching data", error);
    }
    finally{
      setIsLoading(false)
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
                <input type="submit" value={isLoading ? "Logining in" : "Login"}  className="w-100 bg-adminprimary p-2 mb-7 text-white" disabled={isLoading} />
                
              </form>
              <div className="flex justify-between mb-7">
          </div>
            </div>
          </div>
          <div className="col-5 d-none d-md-inline pt-5">
            <Image src="/images/admin-login.jpg" alt="" className="mx-auto border" width={400} height={400}  />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
