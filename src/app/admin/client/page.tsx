'use client'
import { getUserDetails } from "@/app/services/adminApi"
import Navbar from "@/components/admin/navbar/Navbar"
import TableComponent from "@/components/admin/TableComponent/TableComponent"
import { UserProfileType } from "@/types/types"
import { useEffect, useState } from "react"
const clientListpage = () => {
    const [userData, setUserData]= useState<UserProfileType[]>()
    const getUserData = async ()=>{
        try {
            const token = localStorage.getItem('userAccessToken') || ""
            const response =  await getUserDetails(token as string)
            if(response.status)
                setUserData(response.data)
        } catch (error) {
            console.log("error fetching userData")
        }
    }
    useEffect(()=>{
        getUserData();
    },[])
  return (
    <div className="m-0 p-0 flex">
        <div className="p-0 m-0">
          <Navbar />
        </div>
        <div className="w-100 border p-8">
            <TableComponent headings={["name","age"]} valueList={userData}/>
        </div>
      </div>
  )
}

export default clientListpage
