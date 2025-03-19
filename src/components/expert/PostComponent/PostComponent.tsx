'use client'
import { addComment, deleteComment } from "@/app/services/expert/expertApi";
import {  PostType } from "@/types/types";
import { Calendar, MessageSquare, Paperclip , Send, Tag, Trash } from "lucide-react";
import { useState } from "react";
import {toast} from 'react-toastify'

interface PostComponentProps {
  postdata: PostType;
  role?: string;
  getPostData:(page?: number) => Promise<void>
}

const PostComponent: React.FC<PostComponentProps> = ({ postdata, getPostData }) => {
  const [comment, setComment] = useState<string>("");
  const { _id, title, description, uploads, technologies, comments } =
    postdata;
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
  const response =   await addComment(comment, postId)
  if(response){
    getPostData();
    setComment("")
  }
    toast.success(response.message)
 }
const handleCommentDelete = async (commentId : string, expertId : string ,  postId :  string) => {
    const response = await deleteComment({commentId,expertId,postId})
    if(response){
      toast.success(response.message)
    getPostData()}
}
  
  return (
    <div className="max-w-6xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Details Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-4 border-b">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center shadow-sm"
                    >
                      <Tag className="w-4 h-4 mr-1" />
                      {tech}
                    </span>
                  ))}
                </div>
                
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
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors mt-4 w-fit"
                  >
                    <Paperclip className="w-5 h-5" />
                    <span>View Attachment</span>
                  </a>
                )}
              </div>
            </div>
    
            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col border border-gray-100">
              <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="font-semibold text-gray-800">Comments</h2>
                </div>
                <span className="text-sm text-gray-500">
                  {comments?.length || 0} {comments?.length === 1 ? 'comment' : 'comments'}
                </span>
              </div>
              
              <div className="flex-grow overflow-y-auto p-4 max-h-96">
                {comments && comments.length > 0 && comments[0]?.comment ? (
                  comments.map((comment, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="rounded-lg bg-gray-50 p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={comment.expert_image_url || "https://res.cloudinary.com/dicelwy0k/image/upload/v1734162966/k1hkdcipfx9ywadit4lr.png"}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                              alt="Expert profile"
                            />
                            <div>
                              <h3 className="font-medium text-gray-800">
                                {comment.expertName || "Expert"}
                              </h3>
                              <span className="text-gray-500 text-xs flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(comment.date!).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {expertId === comment.expertId && (
                            <button 
                              onClick={() => handleCommentDelete(comment._id!, expertId, _id!)}
                              className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                              aria-label="Delete comment"
                              title="Delete comment"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 break-words">{comment.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                    <MessageSquare className="w-16 h-16 mb-3 text-gray-200" />
                    <p className="font-medium">No comments yet</p>
                    <p className="text-sm">Be the first to leave feedback!</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    placeholder="Add your comment..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button 
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors flex items-center shadow"
                    onClick={() => handleCommenting(_id)}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default PostComponent;
