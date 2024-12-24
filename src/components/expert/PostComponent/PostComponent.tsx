'use client'
import { addComment, deleteComment } from "@/app/services/expertApi";
import { CommentType, PostType } from "@/types/types";
import { Paperclip , Trash } from "lucide-react";
import { useState } from "react";
import {toast} from 'react-toastify'

interface PostComponentProps {
  postdata: PostType;
  role: string;
  getPostData:(page?: number) => Promise<void>
}

const PostComponent: React.FC<PostComponentProps> = ({ postdata, role, getPostData }) => {
  const [comment, setComment] = useState<string>("");
  const { _id, title, description, uploads, technologies, comments, status } =
    postdata;
  const token = localStorage.getItem("userAccessToken") as string;
  const expertString= localStorage.getItem("user") 
  const expert =  expertString && JSON.parse(expertString)
  const expertId = expert._id
  console.log("expert", expertId)
 const handleCommenting = async (postId: string ="")=>{ 
  if(!postId){
    toast.error("unable to add comment. please try again")
    return
  }
  if(!comment){
    toast.error("comment field is required")
    return
  }
  const response =   await addComment(token,comment, postId)
  if(response){
    getPostData();
    setComment("")
  }
    toast.success(response.message)
 }
const handleCommentDelete = async (commentId : string, expertId : string ,  postId :  string) => {
    const response = await deleteComment(token,{commentId,expertId,postId})
    if(response){
      toast.success(response.message)
    getPostData()}
}
  
  return (
    <div className="border-gray-300 rounded-md mb-2">
      <div className="container">
        <div className="flex gap-1">
          <div className="w-1/2 border rounded p-4 h-[250px]">
            <div className="h-full overflow-auto">

              <h1 className="text-2xl text-primarys mb-1">{title}</h1>
              <p className="mb-1">{description}</p>
              <div className="flex gap-3 text-secondarys">
                {technologies.map((tech: string, index: number) => (
                  <p key={index}>{tech}</p>
                ))}
              </div>
              <div className="flex gap-2 justify-end mt-auto">
              
              <div className="flex gap-2 justify-end mt-auto">
              {uploads && (
  <a
    href={
      typeof uploads === "string"
        ? uploads
        : uploads instanceof File
        ? URL.createObjectURL(uploads)
        : undefined
    }
    download={
      typeof uploads === "string"
        ? uploads.split('/').pop() 
        : uploads instanceof File
        ? uploads.name 
        : undefined
    }
    target="_blank" 
    rel="noopener noreferrer" 
    className="flex items-center gap-1 text-secondarys"
  >
    <Paperclip className="text-lg" />
    <span>Download</span>
  </a>
)}
</div>  
              </div>
            </div>
          </div>
          <div className="w-1/2 border rounded h-[250px] overflow-auto">
            <div className="p-4">
              {comments && comments?.length && comments[0]?.comment ? (
                comments.map((comment: CommentType, index: number) => (
                  <div key={index} className="mb-2">
                    <div className="border rounded p-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={comment.expert_image_url ? comment.expert_image_url : "https://res.cloudinary.com/dicelwy0k/image/upload/v1734162966/k1hkdcipfx9ywadit4lr.png"}
                            className="w-10 h-10 rounded-full"
                          />
                          <h1 className="text-sm">
                            {comment.expertName ? comment.expertName : "expert"}
                          </h1>
                        </div>
                        <>
                        <p className="text-gray-400 text-sm">
                            {new Date(comment.date!).toISOString().split("T")[0]}
                        </p>
                        </>
                      </div>
                      <div className="flex justify-between">
                        <p>{comment.comment}</p>
                        { expertId === comment.expertId && ( <button onClick={()=>handleCommentDelete(comment._id!, expertId ,_id ! )}><Trash className="text-red-400" /></button>) }
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No comments yet !</p>
              )}
              {}
             <div className="flex gap-1">
             <input type="text" className="w-100 border rounded  mb-2 p-2" placeholder="Enter your comment" value={comment} onChange={(e)=>setComment(e.target.value)}/>
             <button className="border rounded bg-secondarys text-white " onClick={()=>{handleCommenting(_id)}}>Comment</button>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
