import React from 'react';

interface ProgressBarProps {
  currentPart: number;
  totalParts: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentPart, totalParts }) => {
  const progressPercentage = ((currentPart) / totalParts) * 100;

  return (
    <div className="w-full mb-6">
      <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-secondarys h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        {[...Array(totalParts)].map((_, index) => (
          <span 
            key={index} 
            className={`
              ${index < currentPart ? 'text-secondarys' : 'text-gray-400'}
              transition-colors duration-300
            `}
          >
            Step {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;