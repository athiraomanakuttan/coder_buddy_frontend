import { ChatType } from "@/types/types"
import { useEffect, useState } from "react"

const useGetConversations = () => {
  const [loading,setLoading]= useState<boolean>(false)
  const [onversations,setConversations] = useState<ChatType | null>(null)
  useEffect(()=>{
    
  },[])

}

export default useGetConversations
