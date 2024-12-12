'use client'
import Navbar from "@/components/user/Navbar/Navbar"
import Post from '@/components/user/Post/PostComponent'
import { PlusCircle} from 'lucide-react'
import { PostType } from "@/types/types";
import { useState } from "react";
const postPage = () => {

  const [postData,setPostData]= useState<PostType[]>([
    {
      title: 'Post 1',
      description: 'This is the first post.',
      uploads: '#dddddddddddddddddd',
      technologies: ['React', 'Node.js', 'MongoDB'],
      comments: [{expert_id:"ssss", comment:'Awesome!', uploaded_time:"date and time" , expert_name:"name", expert_image_url:"../images/expert_profile_pic.jpg"}]
    },
    {
      title: 'Post 1',
      description: 'This is the first post.',
      uploads: '#dddddddddddddddddd',
      technologies: ['React', 'Node.js', 'MongoDB'],
      comments: [{expert_id:"ssss", comment:'Awesome!', uploaded_time:"date and time",  expert_name:"name", expert_image_url:"../images/expert_profile_pic.jpg"},
        {expert_id:"ssss", comment:'Awesome!', uploaded_time:"date and time",  expert_name:"name", expert_image_url:"../images/expert_profile_pic.jpg"},
        {expert_id:"ssss", comment:'Awesome!', uploaded_time:"date and time",  expert_name:"name", expert_image_url:"../images/expert_profile_pic.jpg"},
        {expert_id:"ssss", comment:'Awesome!', uploaded_time:"date and time",  expert_name:"name", expert_image_url:"../images/expert_profile_pic.jpg"}
      ]
    },
  ])

  return (
    <div>
      <div className=" m-0 p-0 flex">
      <div className=" p-0 m-0">
        <Navbar />
      </div>
      <div className="border w-100">
        <div className="container p-5">
            <h1 className="text-3xl">Post</h1>
            <div className="flex justify-end gap-2 mb-2">
                <button className="border rounded pr-3 pl-3 pt-2 pb-2 bg-yellow-400 text-white cursor-pointer">Active</button>
                <button className="border rounded pr-3 pl-3 pt-2 pb-2 bg-green-400 text-white cursor-pointer">Resolved</button>
                <button className="border rounded pr-3 pl-3 pt-2 pb-2 bg-red-400 text-white cursor-pointer">Closed</button>
                <button className="border rounded pr-3 pl-3 pt-2 pb-2 cursor-pointer"><PlusCircle /></button>
            </div>
            <div className="post">
            {postData.map((post : PostType, index : number) => (
          <Post key={index} postdata={post} role="user" />
        ))}
            </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default postPage
