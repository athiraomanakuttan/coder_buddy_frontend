"use client";

import Navbar from "@/components/user/Navbar/Navbar";
import ExpertNavbar from "@/components/expert/Navbar/Navbar";
import { Plus } from "lucide-react";
import { useState } from "react";
import ConcernComponent from "@/components/shared/concernComponent";

const ComplaintRegistration = () => {
  const isExpert = localStorage.getItem("isExpert") || "";
  const [status, setStatus] =  useState(0)
  const [concernModel, setConcernModel] = useState(false)
  return (
    <div className=" m-0 p-0 flex">
      <div className=" p-0 m-0">{isExpert ? <ExpertNavbar /> : <Navbar />}</div>
      <div className="border w-100">
      <div className="flex justify-end gap-3 m-5">
               <button className={`${status === 0 ? "bg-sky-300" : "bg-yellow-50"} border p-2 rounded `} onClick={()=>setStatus(0)}>Open</button>
               <button className={`${status === 1 ? "bg-sky-300": "bg-yellow-50"} border p-2 rounded `} onClick={()=>setStatus(1)}>closed</button>
               <button className="border p-2 rounded " onClick={()=> setConcernModel(true)}><Plus /></button>
            </div>
        <div className="container mt-5 flex justify-evenly">
            
        </div>
      </div>
      { concernModel && <ConcernComponent setConcernModel={setConcernModel} isExpert={isExpert}/>}
    </div>
  );
};

export default ComplaintRegistration;
