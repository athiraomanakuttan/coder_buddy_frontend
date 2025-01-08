'use client'
import { getExpertProfile } from '@/app/services/user/userApi'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const profilePage = () => {
    const {id} = useParams()
    const token = localStorage.getItem("userAccessToken") as string
    useEffect(()=>{
        ( async ()=>{
            const response = await getExpertProfile(token , String(id))
            if(response)
            {
                console.log(response)
            }
        })()
    },[])
  return (
    <div>
      
    </div>
  )
}

export default profilePage
