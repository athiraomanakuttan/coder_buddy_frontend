"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import ExpertNavbar from "@/components/expert/Navbar/Navbar";
import Navbar from "@/components/user/Navbar/Navbar";
import { Star } from "lucide-react";
import { RatingData } from "@/types/types";
import { createRating } from "@/app/services/shared/RatingApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"



const RatingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isExpert = localStorage.getItem("isExpert") as string;
  const token = localStorage.getItem("userAccessToken") || ""
  const [meetingRating, setMeetingRating] = useState<number>(0);
  const [participantBehavior, setParticipantBehavior] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const router= useRouter()

  const handleSubmit = async ()=> {
    const ratingData: RatingData = { id, meetingRating, participantBehavior, feedback };
    const response = await createRating(token, ratingData)
    if(response){
        toast.success("Thank you for the Feedback")
        if(isExpert)
           router.push('/expert/dashboard')
        else
        router.push('/dashboard')
    }
  };

  const renderStars = (rating: number, setRating: React.Dispatch<React.SetStateAction<number>>): JSX.Element => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`cursor-pointer ${rating >= star ? "text-yellow-500" : "text-gray-300"}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="m-0 p-0 flex min-h-screen">
      <div className="p-0 m-0">{isExpert ? <ExpertNavbar /> : <Navbar />}</div>
      <div className="border w-full flex justify-center items-center p-5">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Rate Your Call</h2>
          <div className="mb-4">
            <p className="mb-2">Meeting Rating:</p>
            {renderStars(meetingRating, setMeetingRating)}
          </div>
          <div className="mb-4">
            <p className="mb-2">Participant Feedback:</p>
            {renderStars(participantBehavior, setParticipantBehavior)}
          </div>
          <div className="mb-4">
            <p className="mb-2">Additional Feedback:</p>
            <textarea
              className="w-full border p-2 rounded-md"
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts..."
            ></textarea>
          </div>
          <button onClick={handleSubmit} className="w-full bg-sky-400 hover:bg-blue-600 text-white py-2 rounded-md">Submit Rating</button>
        </div>
      </div>
    </div>
  );
};

export default RatingPage;
