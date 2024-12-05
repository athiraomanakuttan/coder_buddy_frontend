'use client'
import React, { useState, useRef, KeyboardEvent, ClipboardEvent, createRef } from 'react';
import { toast } from 'react-toastify';
import { otpPost } from '@/app/services/expertApi';
import { useRouter } from 'next/navigation';

const GetOTP = () => {
  const [otp, setOTP] = useState<string[]>(new Array(6).fill(''));
  const router = useRouter()
  const inputRefs = useRef(
    Array(6).fill(null).map(() => createRef<HTMLInputElement>())
  );

  const handleChange = (index: number, value: string) => {
    const newValue = value.replace(/[^0-9]/g, '');
    const newOTP = [...otp];
    newOTP[index] = newValue;
    setOTP(newOTP);
    if (newValue && index < 5) {
      inputRefs.current[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number, 
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    const newOTP = pastedData.split('').map(char => 
      /[0-9]/.test(char) ? char : ''
    );

    setOTP(new Array(6).fill('').map((_, i) => newOTP[i] || ''));

    const lastPopulatedIndex = newOTP.filter(Boolean).length - 1;
    if (lastPopulatedIndex >= 0) {
      inputRefs.current[lastPopulatedIndex].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length === 6) {
      try {
        const storedOTP = localStorage.getItem("otp");
        const storedEmail = localStorage.getItem("email");
        if(!storedOTP ||  !storedEmail)
          toast.error('Invalid OTP. please  Try Again')
        else{
          const response = await otpPost(otpString, storedOTP, storedEmail)
          if(response)
          {
            toast.success("OTP verified successfully");
            localStorage.removeItem("otp")
            router.push('/expert/resetpassword')
          }
          else
          toast.error("invalid OTP try again")
        }
        
      } catch (error) {
        toast.error("something went wrong try again")
        console.log("error occured", error)
      }
    } else {
      toast.error('Please enter a complete 6-digit OTP')
    }
  };

  return (
    <div className="container">
      <div className="row pt-24">
        <div className="col-6 mx-auto border p-5 bg-slate-50">
          <h3 className="text-center">Enter the OTP</h3>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-evenly">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  ref={inputRefs.current[index]}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(e)}
                  className="border rounded p-2 mb-4 mt-3 w-10 text-center"
                  maxLength={1}
                  pattern="\d*"
                  inputMode="numeric"
                />
              ))}
            </div>
            <input
              type="submit"
              value="Verify OTP"
              className="w-100 bg-secondarys p-2 mb-3 text-white"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetOTP;