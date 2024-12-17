import { postStatus } from "@/app/services/userApi";
import { CommentType, PostType } from "@/types/types";
import { Paperclip } from "lucide-react";
import { toast } from "react-toastify";

interface PostComponentProps {
  postdata: PostType;
  role: string;
}

const PostComponent: React.FC<PostComponentProps> = ({ postdata, role }) => {
  const { _id, title, description, uploads, technologies, comments, status } =
    postdata;
  const token = localStorage.getItem("userAccessToken") as string;
  const changePostStatus = async (postId: string, status: number) => {
    if (!postId || !status) {
      toast.error("unable to change the status");
      return;
    }
    const response = await postStatus(token, { postId, status });
    if (response) toast.success(response.message);
  };
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
  <>
    {status === 0 && (
      <div className="flex gap-2 justify-end">
        <button 
          className="rounded border border-primarys pl-3 pr-3 pb-1 pt-1" 
          onClick={() => changePostStatus(_id!, 1)}
        >
          Resolved
        </button>
        <button 
          className="border rounded pl-3 pr-3 pb-1 pt-1 bg-primarys text-white" 
          onClick={() => changePostStatus(_id!, 2)}
        >
          Close
        </button>
      </div>
    )}
    {status === 1 && (
      <><div className="w-3 h-3 rounded-full bg-green-500"> </div> <label htmlFor="">Resolved</label></>
    )}
    {status === 2 && (
      <><div className="w-3 h-3 rounded-full bg-red-500"></div> <label htmlFor="">Closed</label></>
    )}
  </>
)}
                <button>
                  <Paperclip className="text-lg text-secondarys" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-1/2 border rounded h-[200px] overflow-auto">
            <div className="p-4">
              {comments && comments.length ? (
                comments.map((comment: CommentType, index: number) => (
                  <div key={index} className="mb-2">
                    <div className="border rounded p-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={comment.expert_image_url}
                            alt={comment.expert_name}
                            className="w-10 h-10 rounded-full"
                          />
                          <h1 className="font-semibold">
                            {comment.expert_name}
                          </h1>
                        </div>
                        <>
                          {" "}
                          <p className="text-gray-400">
                            {comment.uploaded_time}
                          </p>
                        </>
                      </div>
                      <p>{comment.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No comments yet !</p>
              )}
              {}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
