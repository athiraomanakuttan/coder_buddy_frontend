'use client'
import { createNewTechnology, UpdateTechnologies } from "@/app/services/admin/TechnologyApi"
import {  technologyValidation } from "@/app/utils/validation"
import { TechnologyType } from "@/types/types"
import { useState } from "react"
import { toast } from "react-toastify"
interface PayoutModalType{
    setIsModalOpen :  React.Dispatch<React.SetStateAction<boolean>>
    data ?:TechnologyType
}
const TechnologyModel = ({setIsModalOpen, data}: PayoutModalType) => {
    const [tech, setTech]= useState<string>(data?.title ?? "")
    const createTechnology = async ()=>{
        const validate = technologyValidation(tech)
        if(!validate.status){
            toast.error(validate.message)
            return
        }
        const response = await createNewTechnology( tech) 
        if(response) 
        {    toast.success("Technology created sucessfully")
             setIsModalOpen(false)
        }
    }
    const updateTechnology = async ()=>{
      const validate = technologyValidation(tech)
      if(!validate.status){
        toast.error(validate.message)
        return
    }
    const response = await UpdateTechnologies(data?._id ?? "",{title:tech})
    if(response)
    {
        toast.success("updated sucessfully")
      setIsModalOpen(false)
    }
    }
  return (
    
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Create Technology</h2>
            
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none mt-2"
              placeholder="Enter Technology"
              value={tech}
              onChange={(e)=> setTech(e.target.value)}
            />
      
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              {!data ? <button
                onClick={createTechnology}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
              : <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={updateTechnology} >Update</button>}
              
            </div>
          </div>
        </div>
      )}
      
 

export default TechnologyModel
