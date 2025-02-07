'use client'
import Link from "next/link";
import { basicType } from "@/types/types";
import { useState } from "react";
import { signupValidation } from "@/app/utils/validation";
import { userSignup } from "@/app/services/user/userApi";
import {toast} from 'react-toastify'
import { useRouter } from "next/navigation";
import Image from "next/image";

const Signup = ()=>{
  const [formData,setFormData]= useState<basicType>({
    email:"",
    password:"" 
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const valiation = signupValidation(formData)
    if(valiation.status)
    {
      try {
        const response = await userSignup(formData);
        localStorage.setItem('email',response.email)
        localStorage.setItem('otp',response.otp)
        toast.success(response.message);
        router.push('/otp')
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      }

    }
    else{
      toast.error(valiation.message);
    }
  }

  //google signup
  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      document.cookie = `googleSignIn=true; path=/; max-age=${60 * 60}; SameSite=Lax`;
      const result = await signIn('google', { 
        redirect: false 
      })
  
      if (result?.error) {
        console.error('Google Sign-In Error:', result.error)
        toast.error('Google Sign-In failed')
        return
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }
return (
    <> 
      <div className="container">
        <div className="row">
          <div className="col-md-7 p-5  col-sm-12">
            <div className="inner-div border rounded pr-5 pl-5 pt-14 pb-10 ">
              <form onSubmit={handleFormSubmit}>
                <h2 className="text-center mb-3 text-3xl">Sign Up</h2>
                <input
                  type="email"
                  placeholder="Enter your email id"
                  className="border rounded w-100 p-2 mb-3"
                  value={formData.email}
                  name="email"
                  onChange={(e)=>setFormData({...formData,email:e.target.value})}
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="border rounded w-100 p-2 mb-3"
                  value={formData.password}
                  name="password"
                  onChange={(e)=>setFormData({...formData,password:e.target.value})}
                />
                <input type="submit" value="Register"  className="w-100 bg-primarys p-2 mb-3 text-white"  />
                <button 
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="border-black border rounded w-100 p-2 mb-3 flex items-center justify-center"
                >
                  <Image 
                    src="/icons/g-icon.png" 
                    alt="Google Icon" 
                    className="d-inline m-1 mr-2"
                  />
                  {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </button>
              </form>
              <div className="flex justify-end">
            <p className="custom-link">Already have an account? <Link href='/login'  className="custom-link">Sign In</Link></p>
          </div>
            </div>
          </div>
          <div className="col-5 d-none d-md-inline pt-5">
            <Image src="/images/user-login.png" alt="" className="mx-auto" />
          </div>
          
        </div>
      </div>
      
    </>
    
)
}

export default Signup;