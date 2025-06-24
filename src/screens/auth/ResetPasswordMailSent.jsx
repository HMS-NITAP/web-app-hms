import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainButton from '../../components/common/MainButton';

const ResetPasswordMailSent = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-32 px-4">
      <div className="w-full flex flex-col items-center justify-center gap-6 mb-12">
        <p className="text-xl font-semibold text-center text-gray-800">
          We've sent you an email with a link to reset your password and further instructions.
        </p>
        <p className="text-lg font-semibold text-center text-red-700">
          Please check your email inbox.
        </p>
      </div>
      <MainButton
        text="Set New Password"
        onPress={() => navigate('/reset-password')}
      />
    </div>
  );
};

export default ResetPasswordMailSent;
