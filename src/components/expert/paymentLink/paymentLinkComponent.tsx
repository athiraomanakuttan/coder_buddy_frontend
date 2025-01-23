import React, { useState } from "react";
import { formDataType } from "@/types/types";
interface modelInterface {
    showModal:boolean,
    setShowModal:React.Dispatch<React.SetStateAction<boolean>>,
    handleCreateMeetingLink: (formData: formDataType) => Promise<void>;
}

const PaymentLinkComponent = ({showModal,setShowModal,handleCreateMeetingLink}:modelInterface) => {
  
    const [formData,setFormData]= useState<formDataType>({
        title:"",
        amount:""
    })

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Link</h2>
            <div>
            <input
                  type="text"
                  placeholder="title"
                  className="border rounded w-100 p-2 mb-3"
                  value={formData.title}
                  onChange={(e)=>setFormData({...formData,"title":e.target.value})}
                />
                 <input
                  type="text"
                  placeholder="Enter payment amount"
                  className="border rounded w-100 p-2 mb-3"
                  value={formData.amount}
                  onChange={(e)=>setFormData({...formData,"amount":e.target.value})}
                />
            </div>
           <div className="flex justify-between">
           <button
              onClick={closeModal}
              className="px-4 py-2 border rounded-lg hover:bg-blue-600 transition"
            >
              Close
            </button>

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={()=>handleCreateMeetingLink(formData)}
            >
              Create Link
            </button>
           </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentLinkComponent;
