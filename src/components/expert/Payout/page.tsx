'use client'
import { expertPayOut } from "@/app/services/expert/paymentApi"
import { payoutValidation } from "@/app/utils/validation"
import { useState } from "react"
import { toast } from "react-toastify"
interface PayoutModalType{
    setIsModalOpen :  React.Dispatch<React.SetStateAction<boolean>>
    balance : number
}
const PayoutModal = ({setIsModalOpen,balance}: PayoutModalType) => {
    const [payoutAmount,setPayoutAmount] = useState("")
    const [payoutUPI,setPayoutUPI] = useState("")
    const handlePayout = async ()=>{
        const isValid = payoutValidation(payoutUPI, balance, Number(payoutAmount))
        if(!isValid.status){
            toast.error(isValid.message)
            return
        }
        const response = await expertPayOut( payoutAmount, payoutUPI)
        if(response){
           toast.success("payment initiated sucessfully")
           setIsModalOpen(false)
        }
    }
  return (
    
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Enter Withdrawal Amount</h2>
      
            <input
              type="number"
              className="w-full p-2 border rounded focus:outline-none"
              placeholder="Enter amount"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none mt-2"
              placeholder="Enter UPI ID"
              value={payoutUPI}
              onChange={(e) => setPayoutUPI(e.target.value)}
            />
      
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePayout}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Withdrow
              </button>
            </div>
          </div>
        </div>
      )}
      
 

export default PayoutModal
