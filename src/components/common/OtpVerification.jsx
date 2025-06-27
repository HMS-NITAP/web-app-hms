import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../../services/operations/AuthAPI';
import { setRegistrationStep } from '../../reducers/slices/AuthSlice';
import toast from 'react-hot-toast';
import MainButton from './MainButton';

const OtpVerification = () => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { registrationData } = useSelector((state) => state.Auth);

  const submitHandler = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Enter a valid 6-digit OTP.');
      return;
    }

    const formData = new FormData();
    formData.append('email', registrationData?.email);
    formData.append('password', registrationData?.password);
    formData.append('confirmPassword', registrationData?.confirmPassword);
    formData.append('otp', otp);

    setIsButtonDisabled(true);
    const response = await dispatch(verifyOtp(formData, toast));
    if (response) {
      dispatch(setRegistrationStep(3));
    }
    setIsButtonDisabled(false);
  };

  const handleInputChange = (e, index) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    const newOtp = otp.split('');
    newOtp[index] = val;
    setOtp(newOtp.join('').slice(0, 6));
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="w-full bg-yellow-100 rounded-xl px-6 py-4 text-center text-black">
        <p className="text-base">
          Please enter the OTP sent to your institute email ID,{' '}
          <span className="font-semibold">{registrationData?.email}</span>, to complete verification.
        </p>
      </div>

      <div className="w-full flex flex-col items-center gap-10">
        <div className="flex justify-center gap-2">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={otp[index] || ''}
              onChange={(e) => handleInputChange(e, index)}
              className="w-10 h-12 text-center text-black border border-gray-400 rounded-lg text-lg"
            />
          ))}
        </div>

        <MainButton
          isButtonDisabled={isButtonDisabled}
          text="Submit"
          onPress={submitHandler}
          backgroundColor="#eddea4"
        />
      </div>
    </div>
  );
};

export default OtpVerification;
