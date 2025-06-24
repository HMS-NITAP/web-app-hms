import React from 'react';
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa';

const StepCircle = ({ stepNumber, label, currentStep }) => {
  const isCompleted = currentStep > stepNumber;
  const isActive = currentStep === stepNumber;
  return (
    <div className="flex flex-col items-center gap-1 w-1/4">
      <div
        className={`flex justify-center items-center w-10 h-10 rounded-full border-2 
          ${isCompleted ? 'bg-yellow-500 border-yellow-500' : isActive ? 'border-yellow-500' : 'border-black'}`
        }
      >
        {isCompleted ? (
          <FaCheck className="text-white" size={18} />
        ) : (
          <span
            className={`font-bold text-[16px] ${
              isActive ? 'text-yellow-500' : 'text-black'
            }`}
          >
            {stepNumber}
          </span>
        )}
      </div>
      <span
        className={`text-center text-sm font-semibold w-4/5 ${
          isCompleted || isActive ? 'text-yellow-500' : 'text-black'
        }`}
      >
        {label}
      </span>
    </div>
  );
};

const ProgressIndicator = () => {
  const { registrationStep } = useSelector((state) => state.Auth);

  return (
    <div className="w-full my-5 flex flex-row justify-evenly items-start px-2">
      <StepCircle stepNumber={1} label="Fill Details" currentStep={registrationStep} />

      <div
        className={`border-t-2 w-[20%] mt-5 border-dotted ${
          registrationStep > 1 ? 'border-yellow-500' : 'border-black'
        }`}
      />

      <StepCircle stepNumber={2} label="Verify Email" currentStep={registrationStep} />

      <div
        className={`border-t-2 w-[20%] mt-5 border-dotted ${
          registrationStep > 2 ? 'border-yellow-500' : 'border-black'
        }`}
      />

      <StepCircle stepNumber={3} label="Select Room" currentStep={registrationStep} />
    </div>
  );
};

export default ProgressIndicator;
