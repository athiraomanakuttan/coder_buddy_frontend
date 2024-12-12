import { CommentType, PostType } from "@/types/types";
import { Paperclip } from "lucide-react";

interface PostComponentProps {
  postdata: PostType;
  role: string
}

const PostComponent: React.FC<PostComponentProps> = ({ postdata, role }) => {
  const { title, description, uploads, technologies, comments } = postdata;

  return ( 
    <div className="border-gray-300 rounded-md mb-2">
      <div className="container">
        <div className="flex gap-1">
          <div className="w-1/2 border rounded p-4 h-[200px]"> 
            <div className="h-full overflow-auto"> 
              <h1 className="text-2xl text-primarys mb-1">{title}</h1>
              <p className="mb-1">{description}</p>
              <div className="flex gap-3 text-secondarys">
                {technologies.map((tech: string, index: number) => (
                  <p key={index}>{tech}</p>
                ))}
              </div>
              <div className="flex gap-2 justify-end mt-auto">
                {role === "user" && (
                  <div className="flex gap-2 justify-end">
                    <button className="rounded border-primarys pl-3 pr-3 pb-1 pt-1">Resolved</button>
                    <button className="border rounded pl-3 pr-3 pb-1 pt-1 bg-primarys text-white">Close</button>
                  </div>
                )}
                <button><Paperclip className="text-lg text-secondarys"/></button>
              </div>
            </div>
          </div>
          <div className="w-1/2 border rounded h-[200px] overflow-auto"> 
            <div className="p-4">
              {comments.map((comment: CommentType, index: number) => (
                <div key={index} className="mb-2">
                  <div className="border rounded p-2">
                    <div className="flex items-center justify-between mb-2"> 
                      <div className="flex items-center gap-2"><img 
                        src={comment.expert_image_url} 
                        alt={comment.expert_name} 
                        className="w-10 h-10 rounded-full"
                      />
                      <h1 className="font-semibold">{comment.expert_name}</h1></div>
                      <> <p className="text-gray-400">{comment.uploaded_time}</p></>
                    </div>
                    <p>{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;