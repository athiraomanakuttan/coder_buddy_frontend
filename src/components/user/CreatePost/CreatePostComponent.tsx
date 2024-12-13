'use client'
import { X } from 'lucide-react';
import { useState } from 'react';
import { PostType } from "@/types/types";

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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [uploads, setUploads] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPost: PostType = {
      title,
      description,
      uploads: uploads || '#',
      technologies: technologies 
        ? technologies.split(',').map(tech => tech.trim())
        : [],
      comments: []
    };

    onCreatePost(newPost);
    onClose();
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2" 
              placeholder="Enter post title"
              required 
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              onChange={(e) => setTechnologies(e.target.value)}
              className="w-full border rounded p-2" 
              placeholder="React Node.js MongoDB "
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Uploads</label>
            <input 
              type="text" 
              value={uploads}
              onChange={(e) => setUploads(e.target.value)}
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