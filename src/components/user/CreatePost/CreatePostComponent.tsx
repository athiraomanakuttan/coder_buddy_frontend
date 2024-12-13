'use client'
import { X } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { PostType } from "@/types/types";
import {parseSkills} from '@/app/utils/skillUtils'
import { toast } from 'react-toastify';
import { addPost } from '@/app/services/userApi';
interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: PostType) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose,
  onCreatePost ,
}) => {
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [uploads, setUploads] = useState('');
  const [formData, setFormData]= useState<PostType>({
    title:"",
    description:"",
    technologies:[],
    uploads:""
  })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTechnologies = parseSkills(technologies)
    setFormData({...formData,"technologies":parsedTechnologies})
    const token = localStorage.getItem("userAccessToken") as string
    const response =  await addPost(token, formData);
    if(response.status)
      toast.success(response.message)
    onClose();
  };
    const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
          if (!allowedTypes.includes(file.type)) {
            toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WEBP).");
            return;
          }
          setFormData({
            ...formData,
            uploads: file  
          });  
        }
      };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] relative">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl mb-4 text-center">Create New Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData,"title":e.target.value})}
              className="w-full border rounded p-2" 
              placeholder="Enter post title"
              required 
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData,"description":e.target.value})}
              className="w-full border rounded p-2 h-24" 
              placeholder="Enter post description"
              required 
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Technologies</label>
            <input 
              type="text" 
              value={technologies}
              onChange={(e)=>setTechnologies(e.target.value)}
              className="w-full border rounded p-2" 
              placeholder="React Node.js MongoDB "
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Uploads</label>
            <input 
              type="file" 
              value={uploads}
              onChange={handleProfilePictureChange}
              className="w-full border rounded p-2" 
              placeholder="Optional upload link"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={onClose}
              className="border rounded px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button type="submit" 
              className="bg-primarys text-white rounded px-4 py-2 hover:bg-green-600"> Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;