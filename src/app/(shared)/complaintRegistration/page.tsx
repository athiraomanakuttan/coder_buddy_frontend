"use client";

import Navbar from "@/components/user/Navbar/Navbar";
import ExpertNavbar from "@/components/expert/Navbar/Navbar";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ConcernComponent from "@/components/shared/concernComponent";
import { ConcernDataType, MessageType } from "@/types/types";
import { addConernComment, getUserConcernData } from "@/app/services/shared/concernApi";
import Link from "next/link";

const ComplaintRegistration = () => {
  const isExpert = localStorage.getItem("isExpert") || "";
  const token = (localStorage.getItem("userAccessToken") as string) || "";
  const [status, setStatus] = useState(0);
  const [concernModel, setConcernModel] = useState(false);
  const [concernData, setConcernData] = useState<ConcernDataType[]>([]);
  const [selectedConcern, setSelectedConcern] = useState<ConcernDataType | null>(null);
  const [comment, setComment] = useState("");

  const getConcernData = async () => {
    const response = await getUserConcernData(token, status);
    if (response) setConcernData(response.data);
  };

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

        // Update state immediately to show the new message
        setSelectedConcern({
          ...selectedConcern,
          message: [...(selectedConcern.message || []), newMessage],
        });

        setComment("");
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="p-0 m-0">{isExpert ? <ExpertNavbar /> : <Navbar />}</div>
      <div className="flex flex-1">
        {/* Left Side: Concern List */}
        <div className={`p-4 border-r overflow-y-auto ${selectedConcern ? "w-1/2" : "w-full"}`}>
          <div className="flex justify-end gap-3 mb-4">
            <button
              className={`border p-2 rounded ${status === 0 ? "bg-sky-300" : "bg-yellow-50"}`}
              onClick={() => setStatus(0)}
            >
              Open
            </button>
            <button
              className={`border p-2 rounded ${status === 1 ? "bg-sky-300" : "bg-yellow-50"}`}
              onClick={() => setStatus(1)}
            >
              Closed
            </button>
            <button className="border p-2 rounded" onClick={() => setConcernModel(true)}>
              <Plus />
            </button>
          </div>

          {concernData.length === 0 ? (
            <p className="text-gray-500 text-center">No records found</p>
          ) : (
            concernData.map((concern) => (
              <div
                key={concern._id}
                className="p-4 border rounded-lg shadow mb-4 cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedConcern(concern)}
              >
                <h3 className="font-semibold text-lg">{concern.title}</h3>
                <p className="text-gray-600">
                  {concern.description.length > 50
                    ? concern.description.slice(0, 50) + "..."
                    : concern.description}
                </p>
                <p className="text-sm text-gray-500">Status: {concern.status === 0 ? "Open" : "Closed"}</p>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Chat Section (Visible only when a concern is selected) */}
        {selectedConcern && (
          <div className="w-1/2 p-4 flex flex-col">
            <h2 className="text-xl font-semibold">{selectedConcern.title}</h2>
            <p className="text-gray-600 mb-4">{selectedConcern.description}</p>
            {selectedConcern.video && (
              <Link href={selectedConcern.video} target="_blank" className="text-blue-500 mb-4">
                View Attachment
              </Link>
            )}
            {/* Chat Messages */}
            <div className="flex flex-col flex-grow overflow-y-auto border p-4 rounded-lg bg-gray-100">
              {selectedConcern.message && selectedConcern.message.length > 0 ? (
                selectedConcern.message.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 my-1 rounded-lg ${
                      msg.userType === "expert"
                        ? "bg-blue-300 self-end"
                        : msg.userType === "admin"
                        ? "bg-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <span className="text-xs text-gray-500">{new Date(msg.dateAndTime).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No messages yet.</p>
              )}
            </div>

            {/* Show Input Box only when status === 0 */}
            {selectedConcern.status === 0 && (
              <div className="mt-4 flex">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="Type your message..."
                />
                <button onClick={handleCommentSend} className="ml-2 bg-blue-500 text-white p-2 rounded-lg">
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
