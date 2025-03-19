'use client'
import { postStatus } from "@/app/services/user/userApi";
import {  PostType } from "@/types/types";
import { Paperclip , PenLine, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import EditPostModal from "../editPost/editPostComponent";
import { formatDate } from "@/app/utils/dateUtils";

interface PostComponentProps {
  postdata: PostType;
  role: string;
  getPostData:(postStatus?: number | null, page?: number) => Promise<void>
}

const PostComponent: React.FC<PostComponentProps> = ({ postdata, role, getPostData }) => {
  const [editPostStatus, setEditPostStatus] =  useState(false)
  const { _id, title, description, technologies, comments, status , uploads} =
    postdata;
    
  const changePostStatus = async (postId: string, status: number) => {
    if (!postId || !status) {
      toast.error("unable to change the status");
      return;
    }
    const response = await postStatus( { postId, status });
    getPostData()
    if (response) toast.success(response.message);
  };

   
  return (
    <>
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
      <div className="p-1">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Column - Post Details */}
          <div className="w-full md:w-1/2 p-4 bg-gray-50 rounded-lg">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-primarys">{title}</h1>
                {status === 0 && (
                  <button 
                    className="text-gray-500 hover:text-primarys transition-colors" 
                    onClick={() => setEditPostStatus(true)}
                  >
                    <PenLine size={18} />
                  </button>
                )}
              </div>
              
              <p className="text-gray-700 mb-3">{description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {technologies.map((tech, index) => (
                  <span key={index} className="bg-blue-100 text-secondarys px-2 py-1 rounded-md text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {role === "user" && (
                    <>
                      {status === 0 && (
                        <div className="flex gap-2">
                          <button 
                            className="rounded border border-primarys px-3 py-1 text-primarys hover:bg-primarys hover:text-white transition-colors"
                            onClick={() => changePostStatus(_id!, 1)}
                          >
                            Resolve
                          </button>
                          <button 
                            className="rounded bg-primarys text-white px-3 py-1 hover:bg-blue-700 transition-colors"
                            onClick={() => changePostStatus(_id!, 2)}
                          >
                            Close
                          </button>
                        </div>
                      )}
                      {status === 1 && (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-green-600 font-medium">Resolved</span>
                        </div>
                      )}
                      {status === 2 && (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-red-600 font-medium">Closed</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
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
                      className="flex items-center text-secondarys hover:text-blue-700 transition-colors"
                    >
                      <Paperclip size={18} />
                    </a>
                  )}
                  
                  <button 
                    onClick={() => changePostStatus(_id!, -1)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Comments */}
          <div className="w-full md:w-1/2 p-4 border rounded-lg max-h-64 overflow-auto">
            <h2 className="font-semibold text-lg mb-3">Comments</h2>
            {comments && comments.length ? (
              comments.map((comment, index) => (
                <div key={index} className="mb-3 bg-white shadow-sm rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Link href={`/expertprofile/${comment.expertId}/${_id}`} className="flex items-center gap-2 hover:text-primarys">
                      <img
                        src={comment.expert_image_url || 'https://res.cloudinary.com/dicelwy0k/image/upload/v1734162966/k1hkdcipfx9ywadit4lr.png'}
                        alt={comment.expert_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium">{comment.expert_name}</span>
                    </Link>
                    <p className="text-sm text-gray-400">
                      {comment?.uploaded_time && formatDate(comment?.uploaded_time)}
                    </p>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No comments yet!</div>
            )}
          </div>
        </div>
      </div>
    </div>
    {editPostStatus && <EditPostModal postdata={postdata} setEditPostStatus={setEditPostStatus} getPostData={getPostData}/>}
    </>
    
  );
};

export default PostComponent;
