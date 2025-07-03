import React from 'react';
import MainButton from './MainButton';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setRegistrationData, setRegistrationStep } from '../../reducers/slices/AuthSlice';

const AwaitingConfirmation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { registrationData } = useSelector((state) => state.Auth);

  const handleDone = () => {
    dispatch(setRegistrationData(null));
    dispatch(setRegistrationStep(1));
    navigate('/login');
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <h2 className="text-2xl font-extrabold text-black">Application Submitted!</h2>
      <div className="md:w-[50%] w-full bg-green-100 rounded-2xl p-4 mb-6">
        <p className="text-center text-base text-black">
          Your hostel registration application has been successfully submitted to the hostel office and is currently under review.
          You will receive a confirmation email at your institute email address,{' '}
          <span className="font-bold">{registrationData?.email}</span>, once all details have been validated.
          You will be able to log in once your details are verified. Thank you for your patience.
        </p>
      </div>
      <MainButton text="Done" onPress={handleDone} />
    </div>
  );
};

export default AwaitingConfirmation;
