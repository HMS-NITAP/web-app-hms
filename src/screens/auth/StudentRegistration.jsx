import React from 'react';
import { useSelector } from 'react-redux';
import MainButton from '../../components/common/MainButton';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import StudentRegistrationForm from '../../components/common/StudentRegistrationForm';
import OtpVerification from '../../components/common/OtpVerification';
import RoomAllotment from '../../components/common/RoomAllotment';
import AwaitingConfirmation from '../../components/common/AwaitingConfirmation';

const StudentRegistration = () => {
  const { registrationStep } = useSelector((state) => state.Auth);

  return (
    <div className="w-full overflow-y-auto py-6 flex flex-col items-center">
      <ProgressIndicator />

      <div className="w-[95%] my-5 flex flex-col items-center border-0 rounded-lg px-0 py-0">
        {registrationStep === 1 && <StudentRegistrationForm />}
        {registrationStep === 2 && <OtpVerification />}
        {registrationStep === 3 && <RoomAllotment />}
        {registrationStep === 4 && <AwaitingConfirmation />}
      </div>

      {/* 
      <div className="mt-10 flex flex-row justify-center gap-5">
        {registrationStep > 1 && registrationStep < 5 && (
          <MainButton text="Back" onPress={handleBack} />
        )}
        {registrationStep < 5 && (
          <MainButton text="Next" onPress={handleNext} />
        )}
      </div>
      */}
    </div>
  );
};

export default StudentRegistration;
