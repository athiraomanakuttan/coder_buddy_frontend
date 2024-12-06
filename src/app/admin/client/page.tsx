'use client'
import { getUserDetails, userStatusChange } from "@/app/services/adminApi"
import Navbar from "@/components/admin/navbar/Navbar"
import TableComponent from "@/components/admin/TableComponent/TableComponent"
import { UserProfileType } from "@/types/types"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
const clientListpage = () => {
    const [userData, setUserData]= useState<UserProfileType[]>()


    const changeUserStatus = async (id : string , status:string) =>{
      if(!id){  toast.error("unable to change the status. please try again");
        return;
      }
    const token = localStorage.getItem("userAccessToken") as string
      const response = await userStatusChange(id,status,token)
      if(response)
        toast.success("user status status changed")
      getUserData()

    }
    const getUserData = async ()=>{
        try {
            const token = localStorage.getItem('userAccessToken') || ""
            const response =  await getUserDetails(token as string)
            console.log(response.data)
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
        <TableComponent 
        headings={['first_name', 'last_name', 'email','experiance','skills']} 
        valueList={userData} 
        role ="user"
        functions = {changeUserStatus}
/>
        </div>
      </div>
  )
}

export default clientListpage
