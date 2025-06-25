import React, { useEffect, useState } from 'react';
import OTPInput from 'react-otp-input';
import MainButton from '../../components/common/MainButton';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../../services/operations/AuthAPI';
import { useNavigate } from 'react-router-dom';

const OtpInput = () => {
  const [otp, setOTP] = useState('');
  const { signUpData } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signUpData) {
      navigate('/signup');
    }
  }, [signUpData, navigate]);

  const handleChange = (otp) => setOTP(otp);

  const submitHandler = () => {
    dispatch(signUp(signUpData, otp, navigate));
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center px-4 pt-20">
      <div className="w-full max-w-md">
        <p className="text-lg font-semibold text-gray-700 text-center">
          Enter the OTP received in your Email ID to complete verification of your account.
        </p>

        <div className="flex justify-center mt-6">
          <OTPInput
            value={otp}
            onChange={handleChange}
            numInputs={6}
            inputStyle="border border-gray-400 rounded-md w-10 h-12 mx-1 text-center text-lg text-black"
            containerStyle="flex justify-center"
          />
        </div>

        <div className="mt-10 flex justify-center">
          <MainButton text="Submit" onPress={submitHandler} backgroundColor="bg-teal-300" />
        </div>
      </div>
    </div>
  );
};

export default OtpInput;
