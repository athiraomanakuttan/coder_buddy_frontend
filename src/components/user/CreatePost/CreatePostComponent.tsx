'use client'
import { X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { PostType } from "@/types/types";
import { parseSkills } from '@/app/utils/skillUtils'
import { toast } from 'react-toastify';
import { addPost } from '@/app/services/user/userApi';
import { postValidation } from '@/app/utils/validation';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose,
}) => {
  const [technologies, setTechnologies] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<PostType>({
    title: "",
    description: "",
    technologies: [""],
    uploads: "",
    status : 0
  })
  useEffect(()=>{
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    
    if (user?.id ) {
      setFormData(prevData => ({
        ...prevData,
        userId: user.id ? user.id : user._id
      }));
    }
  },[])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validate =  postValidation(formData);
      if(!validate.status){
        toast.error(validate.message)
        return;
      }
      setFormData({...formData,
        'uploads':fileInput,
      })
      if(!formData.userId)
      {
        const userString = localStorage.getItem("user"); 
      const user = userString ? JSON.parse(userString) : undefined; 
      setFormData({...formData,
        'userId' : user?.id ? user?.id : user?._id
      })
      }
      const token = localStorage.getItem("userAccessToken") as string

      const response = await addPost(token, formData);
      
      if(response.status) {
        toast.success(response.message);
        setFormData({
          title: "",
          description: "",
          technologies: [],
          uploads: "",
          status: 1
        });
        setTechnologies('');
        setFileInput(null);
        setPreviewUrl(null);
        onClose();
      } else {
        toast.error(response.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Post submission error:", error);
      toast.error("An error occurred while creating the post");
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WEBP).");
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size should not exceed 5MB.");
        return;
      }

      // Set file and create preview
      setFileInput(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearFile = () => {
    setFileInput(null);
    setPreviewUrl(null);
  };
const handleTechnologies = (e: ChangeEvent<HTMLInputElement>)=>{
  setTechnologies(e.target.value)
  setFormData({...formData,'technologies':parseSkills(e.target.value)})
}

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
        
        <form onSubmit={handleSubmit} encType='multipart/form-data' className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border rounded p-2" 
              placeholder="Enter post title"
              required 
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              onChange={handleTechnologies}
              className="w-full border rounded p-2" 
              placeholder="React Node.js MongoDB"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Upload Image</label>
            <input 
              type="file" 
              onChange={handleFileChange}
              className="w-full border rounded p-2" 
              accept="image/jpeg,image/png,image/gif,image/webp"
            />
            {previewUrl && (
              <div className="mt-2 flex items-center">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded mr-2" 
                />
                <button 
                  type="button"
                  onClick={handleClearFile}
                  className="text-red-500 hover:text-red-700"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={onClose}
              className="border rounded px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-primarys text-white rounded px-4 py-2 hover:bg-green-600"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;