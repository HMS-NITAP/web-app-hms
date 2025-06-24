import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainButton from '../../components/common/MainButton';

const ResetPasswordSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-32 px-4">
      <div className="w-full flex flex-col items-center justify-center gap-6 mb-12">
        <p className="text-xl font-semibold text-center text-gray-800 px-4">
          The password linked to your HMS account has been successfully reset.
        </p>
        <p className="text-lg font-semibold text-center text-green-700 px-4">
          Please log in to your account with the new credentials.
        </p>
      </div>
      <MainButton text="Login" onPress={() => navigate('/login')} />
    </div>
  );
};

export default ResetPasswordSuccess;
