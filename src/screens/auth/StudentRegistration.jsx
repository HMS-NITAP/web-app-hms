import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import StudentRegistrationForm from '../../components/common/StudentRegistrationForm';
import OtpVerification from '../../components/common/OtpVerification';
import RoomAllotment from '../../components/common/RoomAllotment';
import AwaitingConfirmation from '../../components/common/AwaitingConfirmation';
import MainButton from '../../components/common/MainButton';

const StudentRegistration = () => {
  const { registrationStep } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();

  return (
    <div className="w-full flex flex-col items-center py-5 px-2">
      <ProgressIndicator />

      <div className="w-[95%] my-5 flex flex-col items-center">
        {registrationStep === 1 && <StudentRegistrationForm />}
        {registrationStep === 2 && <OtpVerification />}
        {registrationStep === 3 && <RoomAllotment />}
        {registrationStep === 4 && <AwaitingConfirmation />}
      </div>

      {/* <div className="flex flex-row justify-center gap-5 mt-10">
        {registrationStep > 1 && registrationStep < 5 && (
          <MainButton text="Back" onClick={handleBack} />
        )}
        {registrationStep < 5 && (
          <MainButton text="Next" onClick={handleNext} />
        )}
      </div> */}
     
    </div>
  );
};

export default StudentRegistration;
