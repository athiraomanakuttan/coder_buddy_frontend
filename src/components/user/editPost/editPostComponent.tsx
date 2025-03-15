'use client'
import { X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { PostType, TechnologyType } from "@/types/types";
import { toast } from 'react-toastify';
import { updatePost, getAllTechnology } from '@/app/services/user/userApi';
import { postValidation } from '@/app/utils/validation';
import Image from 'next/image';

interface CreatePostModalProps {
  postdata: PostType
  setEditPostStatus: React.Dispatch<React.SetStateAction<boolean>>
  getPostData: (postStatus?: number | null, page?: number) => Promise<void>
}

const EditPostModal: React.FC<CreatePostModalProps> = ({ 
  postdata,
  setEditPostStatus,
  getPostData
}) => {
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allTechnology, setAllTechnology] = useState<TechnologyType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<PostType>({
    _id: "",
    title: "",
    description: "",
    technologies: [""],
    uploads: "",
  });

  useEffect(() => {
    setFormData(postdata);
    getTechnology();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const validate = postValidation(formData);
      if (!validate.status) {
        toast.error(validate.message);
        return;
      }
      let submissionData = {
        ...formData
      };
      if(fileInput){
        submissionData = {
          ...formData,
        uploads: fileInput
        }
      }
      
      console.log("formData",formData)
      console.log("submissionData",submissionData)
      const response = await updatePost(submissionData);
      if (response) {
        toast.success("Post updated successfully");
        setEditPostStatus(false);
        getPostData(0);
      }
    } catch (error) {
      console.error("Post submission error:", error);
      toast.error("Unable to update the post");
    } finally {
      setIsLoading(false);
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

  const getTechnology = async () => {
    try {
      const response = await getAllTechnology();
      if (response) {
        setAllTechnology(response.data);
      }
    } catch (error) {
      console.error("Error fetching technologies:", error);
      toast.error("Failed to load technologies");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] relative">
        <button 
          onClick={() => setEditPostStatus(false)} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl mb-4 text-center">Edit Post</h2>
        
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
            <div className="relative">
              <input 
                type="text" 
                className="w-full border rounded p-2"
                placeholder="Search technologies..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              {searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {allTechnology
                    .filter(tech => 
                      tech?.title!.toLowerCase().includes(searchTerm.toLowerCase()) &&
                      !formData.technologies.includes(`#${tech.title}`)
                    )
                    .map((tech, id) => (
                      <div
                        key={id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          const newTech = `#${tech.title}`;
                          if (!formData.technologies.includes(newTech)) {
                            setFormData({
                              ...formData,
                              technologies: [...formData.technologies.filter(t => t !== ""), newTech]
                            });
                          }
                          setSearchTerm('');
                        }}
                      >
                        {tech.title}
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.technologies
                .filter(tech => tech !== "") // Filter out empty strings
                .map((tech, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedTechs = formData.technologies.filter(t => t !== tech);
                      setFormData({...formData, technologies: updatedTechs});
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Upload Image</label>
            <input 
              type="file" 
              onChange={handleFileChange}
              className="w-full border rounded p-2" 
              accept="image/jpeg,image/png,image/gif,image/webp"
            />
            {previewUrl ? (
              <div className="mt-2 flex items-center">
                <Image 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded mr-2"
                  width={100}
                  height={100}
                />
                <button 
                  type="button"
                  onClick={handleClearFile}
                  className="text-red-500 hover:text-red-700"
                >
                  Clear
                </button>
              </div>
            ) : formData.uploads ? (
              <div className="mt-2 flex items-center">
                <Image 
                  src={formData.uploads as string} 
                  alt="Current Image" 
                  className="w-20 h-20 object-cover rounded mr-2"
                  width={100}
                  height={100}
                />
                <span className="text-gray-500">Current image</span>
              </div>
            ) : null}
          </div>

          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={() => setEditPostStatus(false)}
              className="border rounded px-4 py-2 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-primarys text-white rounded px-4 py-2 hover:bg-green-600"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;