'use client'
import { signinPost } from "@/app/services/expert/expertApi";
import { signupValidation } from "@/app/utils/validation";
import { basicType } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {  useState,useEffect } from "react";
import { toast } from "react-toastify";
import useAuthStore from "@/store/authStore";
import {  signIn } from "next-auth/react"


const userLogin = () => {
  const {setUserAuth, isAuthenticated} = useAuthStore()
  const route = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    // if (isAuthenticated) {
    //   route.push("/expert/dashboard");
    // }
  }, [isAuthenticated, route]);

  const [formData,steFormData]= useState<basicType>({
    email:"",
    password:""
  })
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validate = signupValidation(formData);
    if (validate.status) {
        const response: any = await signinPost(formData.email, formData.password);
        
        if (response) {
          localStorage.setItem("isVerified",response?.data?.existExpert?.isVerified)
          toast.success("Successfully logged in");
          setUserAuth(response.data.existExpert,response.data.accessToken) 
          route.push('/expert/dashboard');
        } 
      
    } else {
      toast.error(validate.message);
    }};

    const handleGoogleSignIn = async () => {
      setIsLoading(true)
      try {
        const result = await signIn('google-expert', {
          redirect: false,
          callbackUrl: '/expert/dashboard'
        });
    
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
                <input type="submit" value="Login"  className="w-100 bg-secondarys p-2 mb-3 text-white"  />
                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="border-black border rounded w-100 p-2 mb-3 flex items-center justify-center"
                >
                  <img 
                    src="/icons/g-icon.png" 
                    alt="Google Icon" 
                    className="d-inline m-1 mr-2"
                  />
                  {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </button>
              </form>
              <div className="flex justify-between mb-7">
            <Link href='/expert/forgot' className="custom-link" >forgot password</Link>
            <p className="custom-link">Don't have an account yet ? <Link href='/expert/signup'  className="custom-link">Register Now</Link></p>
          </div>
            </div>
          </div>
          <div className="col-5 d-none d-md-inline pt-5">
            <img src="/images/expert_login.png" alt="" className="mx-auto border" />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default userLogin;
