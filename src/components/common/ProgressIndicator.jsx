import React from 'react';
import { useSelector } from 'react-redux';
import { FaCheck } from 'react-icons/fa6';

const ProgressIndicator = () => {
  const { registrationStep } = useSelector((state) => state.Auth);

  const stepStyle = (stepNumber) => {
    const isCompleted = registrationStep > stepNumber;
    const isActive = registrationStep === stepNumber;

    return {
      circle: `w-10 h-10 rounded-full border-2 flex items-center justify-center 
               ${isCompleted ? 'bg-[#ee9b00] border-[#ee9b00]' : isActive ? 'border-[#ee9b00]' : 'border-black'}`,
      text: `text-sm font-semibold text-center 
             ${isCompleted || isActive ? 'text-[#ee9b00]' : 'text-black'}`,
      iconColor: isCompleted ? 'text-white' : isActive ? 'text-[#ee9b00]' : 'text-black'
    };
  };

  return (
    <div className="w-full my-5 flex justify-evenly items-start px-2">
      {[1, 2, 3].map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-[0.5rem]">
            <div className={stepStyle(step).circle}>
              {registrationStep > step ? (
                <FaCheck className="text-white" size={20} />
              ) : (
                <span className={`${stepStyle(step).iconColor} font-bold text-base`}>{step}</span>
              )}
            </div>
            <p className={stepStyle(step).text}>
              {step === 1 && 'Fill Details'}
              {step === 2 && 'Verify Email'}
              {step === 3 && 'Select Room'}
            </p>
          </div>
          {step < 3 && (
            <div
              className={`border-t-2 w-[25%] mt-5 border-dotted 
                          ${registrationStep > step ? 'border-[#ee9b00]' : 'border-black'}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressIndicator;
