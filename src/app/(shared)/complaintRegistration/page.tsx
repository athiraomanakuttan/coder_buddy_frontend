"use client";

import Navbar from "@/components/user/Navbar/Navbar";
import ExpertNavbar from "@/components/expert/Navbar/Navbar";
import { Cross, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ConcernComponent from "@/components/shared/concernComponent";
import { ConcernDataType, MessageType } from "@/types/types";
import { addConernComment, getUserConcernData } from "@/app/services/shared/concernApi";
import Link from "next/link";

const ComplaintRegistration = () => {
  const [isExpert,setIsExpert]= useState<string>("")
  const [token, setToken]= useState<string>("")
  const [status, setStatus] = useState(0);
  const [concernModel, setConcernModel] = useState(false);
  const [concernData, setConcernData] = useState<ConcernDataType[]>([]);
  const [selectedConcern, setSelectedConcern] = useState<ConcernDataType | null>(null);
  const [comment, setComment] = useState("");

  const getConcernData = async () => {
    const response = await getUserConcernData(token, status);
    if (response) setConcernData(response.data);
  };
  useEffect(()=>{
    setIsExpert(localStorage.getItem("isExpert") || "")
    setToken(localStorage.getItem("userAccessToken") || "")
  },[])

  useEffect(() => {
    getConcernData();
  }, [concernModel, status]);

  const handleCommentSend = async () => {
    if (selectedConcern && comment.trim()) {
      const meetingId = selectedConcern.concernMeetingId;
      const userType = isExpert ? "expert" : "user";
      const response = await addConernComment(token, comment, meetingId as string, userType);

      if (response) {
        const newMessage: MessageType = {
          message: comment,
          userType,
          dateAndTime: new Date(),
        };

        setSelectedConcern({
          ...selectedConcern,
          message: [...(selectedConcern.message || []), newMessage],
        });

        setComment("");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (Navbar) */}
      <div className="p-0 m-0 shadow-md bg-white">
        {isExpert ? <ExpertNavbar /> : <Navbar />}
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Panel - Concern List */}
        <div className={`p-6 border-r overflow-y-auto transition-all duration-300 ${selectedConcern ? "w-3/5" : "w-full"}`}>
          {/* Filter & Add Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  status === 0 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setStatus(0)}
              >
                Open
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  status === 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setStatus(1)}
              >
                Closed
              </button>
            </div>
            <button
              className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition"
              onClick={() =>{
                setSelectedConcern(null);
                setConcernModel(true)}}
            >
              <Plus />
            </button>
          </div>

          {/* Concern Grid List */}
          {concernData.length === 0 ? (
            <p className="text-gray-500 text-center">No records found</p>
          ) : (
            <div className={`grid gap-6 ${selectedConcern ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}>
              {concernData.map((concern) => (
                <div
                  key={concern._id}
                  className="p-4 bg-white border rounded-xl shadow-md cursor-pointer hover:bg-gray-50 transition-all hover:shadow-lg min-w-[200px]"
                  onClick={() => setSelectedConcern(concern)}
                >
                  <h3 className="font-semibold text-lg text-gray-900">{concern.title}</h3>
                  <p className="text-gray-600 mt-2">
                    {concern.description.length > 50
                      ? concern.description.slice(0, 50) + "..."
                      : concern.description}
                  </p>
                  <p
                    className={`text-sm mt-2 font-medium ${
                      concern.status === 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Status: {concern.status === 0 ? "Open" : "Closed"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel - Chat Section */}
        {selectedConcern && (
          <div className="w-full max-w-md p-6 flex flex-col bg-white shadow-md">
            <h2 className="text-2xl font-bold mb-2">{selectedConcern.title}</h2>
            <p className="text-gray-700 mb-4">{selectedConcern.description}</p>

            {selectedConcern.video && (
              <Link
                href={selectedConcern.video}
                target="_blank"
                className="text-blue-500 font-medium underline mb-4"
              >
                View Attachment
              </Link>
            )}

            {/* Chat Messages */}
            <div className="flex flex-col flex-grow overflow-y-auto border p-4 rounded-lg bg-gray-100 space-y-3">
              <div><Cross /> </div>
              {selectedConcern.message && selectedConcern.message.length > 0 ? (
                selectedConcern.message.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg shadow-sm w-fit max-w-xs ${
                      msg.userType === "expert"
                        ? "bg-blue-500 text-white self-end"
                        : msg.userType === "admin"
                        ? "bg-gray-200"
                        : "bg-gray-300"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <span className="text-xs text-gray-700 block mt-1">
                      {new Date(msg.dateAndTime).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No messages yet.</p>
              )}
            </div>

            {/* Message Input */}
            {selectedConcern.status === 0 && (
              <div className="mt-4 flex">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleCommentSend}
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {concernModel && <ConcernComponent setConcernModel={setConcernModel} isExpert={isExpert} />}
    </div>
  );
};

export default ComplaintRegistration;
