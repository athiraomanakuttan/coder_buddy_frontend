'use client'
import Navbar from "@/components/user/Navbar/Navbar"
import Post from '@/components/user/Post/PostComponent'
import { PlusCircle } from 'lucide-react'
import { PostType } from "@/types/types";
import CreatePostModal from '@/components/user/CreatePost/CreatePostComponent'
import { useEffect, useState } from "react";
import { getPostDetails, searchPost } from "@/app/services/user/userApi";

const PostPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postData, setPostData] = useState<PostType[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentStatus, setCurrentStatus] = useState<number | null>(null);
  const [query,setQuery] = useState<string>('')
  const [debouncingQuery,setDebouncingQuery] = useState<string>(query)
  const token = localStorage.getItem('userAccessToken') as string

  const getPostData = async (postStatus: number | null = null, page: number = 1) => {
    try {
      const response = await getPostDetails(token, {
        status: postStatus,
        page: page,
        limit: 5
      });
      if (response && response.data) {
        console.log(response)
        setPostData(response.data);
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
        setCurrentStatus(postStatus);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  }

  useEffect(() => {
    getPostData()
  }, [])

  const handlePageChange = (newPage: number) => {
    getPostData(currentStatus, newPage);
  }

  useEffect(()=>{
    const timer = setTimeout(()=>{
      setDebouncingQuery(query);
    },3000)
    return()=> clearTimeout(timer)
  },[query])

  useEffect(()=>{
    (async ()=>{
      console.log("inside of this function")
      if(debouncingQuery){
        const response =  await searchPost(token,debouncingQuery ,currentStatus)
        console.log("response",response)
        if(response)
        {
          setPostData(response.data)
        }
      }
    })()
    
  },[debouncingQuery])

  return (
    <div>
      <div className="m-0 p-0 flex">
        <div className="p-0 m-0">
          <Navbar />
        </div>
        <div className="border w-100 h-[100vh] overflow-auto">
          <div className="container p-5">
            <h1 className="text-3xl">Post</h1>
            <div className="flex justify-end gap-2 mb-2">
              <input type="text" placeholder="Search" className="border rounded pl-3 pr-3 " value={query} onChange={(e)=>setQuery(e.target.value)} />
              <button 
                className="border rounded pr-3 pl-3 pt-2 pb-2 cursor-pointer" 
                onClick={() => getPostData()}
              >
                All Post
              </button>
              <button 
                className="border rounded pr-3 pl-3 pt-2 pb-2 bg-[#F6AD55] text-white cursor-pointer" 
                onClick={() => getPostData(0)}
              >
                Active
              </button>
              <button 
                className="border rounded pr-3 pl-3 pt-2 pb-2 bg-[#68D391] text-white cursor-pointer" 
                onClick={() => getPostData(1)}
              >
                Resolved
              </button>
              <button 
                className="border rounded pr-3 pl-3 pt-2 pb-2 bg-[#FC8181] text-white cursor-pointer" 
                onClick={() => getPostData(2)}
              >
                Closed
              </button>
              <button 
                className="border rounded pr-3 pl-3 pt-2 pb-2 cursor-pointer"  
                onClick={() => setIsModalOpen(true)}
              >
                <PlusCircle />
              </button>
            </div>
            <div>
              {postData.length > 0 ? (
                <>
                  {postData.map((post: PostType, index: number) => (
                    <Post key={index} postdata={post} role="user" getPostData={getPostData} />
                  ))}
                  
                  {/* Pagination Controls */}
                  <div className="flex justify-center items-center mt-4 space-x-2">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <h1 className="text-2xl">No Post Yet</h1>
              )}
            </div>
          </div>
        </div>
      </div>
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default PostPage