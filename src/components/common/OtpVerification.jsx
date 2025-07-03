import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OtpInput from 'react-otp-input';
import { verifyOtp } from '../../services/operations/AuthAPI';
import { setRegistrationStep } from '../../reducers/slices/AuthSlice';
import MainButton from './MainButton';
import toast from 'react-hot-toast';

const OtpVerification = () => {
  const dispatch = useDispatch();
  const { registrationData } = useSelector((state) => state.Auth);

  const [otp, setOtp] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const submitHandler = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Enter Correct OTP');
      return;
    }

    const formData = new FormData();
    if (!registrationData) return;

    formData.append('email', registrationData.email);
    formData.append('password', registrationData.password);
    formData.append('confirmPassword', registrationData.confirmPassword);
    formData.append('otp', otp);

    setIsButtonDisabled(true);
    const response = await dispatch(verifyOtp(formData, toast));
    if (response) {
      await dispatch(setRegistrationStep(3));
    }
    setIsButtonDisabled(false);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="mx-auto bg-[#e9edc9] rounded-2xl px-4 py-4">
        <p className="text-center text-[15px] text-black font-semibold">
          Please enter the OTP sent to your institute email ID,{' '}
          <span className="font-extrabold">{registrationData?.email}</span>, to complete the verification of your account.
        </p>
      </div>

      <div className="w-full flex flex-col items-center gap-10">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          inputStyle="text-center text-[2rem] border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          renderInput={(props) => (
            <input
              {...props}
            />
          )}
          containerStyle="flex justify-center gap-3"
        />

        <MainButton
          isButtonDisabled={isButtonDisabled}
          text="Submit"
          onPress={submitHandler}
        />
      </div>
    </div>
  );
};

export default OtpVerification;
