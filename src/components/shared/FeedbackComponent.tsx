import React from 'react';
import { StarIcon } from 'lucide-react';
import { RatingData } from '@/types/types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackData: RatingData | null;
}

const FeedbackModal = ({ isOpen, onClose, feedbackData }: FeedbackModalProps) => {
  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            className={`w-5 h-5 ${
              index < rating 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Meeting Feedback
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {feedbackData ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Meeting Rating</span>
                  {renderStars(feedbackData.meetingRating)}
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${(feedbackData.meetingRating / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Participant Behavior</span>
                  {renderStars(feedbackData.participantBehavior)}
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${(feedbackData.participantBehavior / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-medium text-gray-700">Feedback Comments</span>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {feedbackData.feedback || "No written feedback provided."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <StarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Feedback Yet
              </h3>
              <p className="text-gray-500">
                This meeting hasn't received any feedback yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;