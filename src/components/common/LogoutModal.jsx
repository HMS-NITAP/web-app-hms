import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../services/operations/AuthAPI';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import MainButton from './MainButton';

const LogoutModal = ({ logoutModalVisible, setLogoutModalVisible }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    dispatch(logout(toast, navigate));
    setLogoutModalVisible(false);
  };

  const handleCancelLogout = () => {
    setLogoutModalVisible(false);
  };

  if (!logoutModalVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-6 md:w-full w-[90%] max-w-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
        <p className="text-lg font-semibold text-center text-black mb-6">
          Do you want to log out?
        </p>
        <div className="flex justify-center gap-[2rem]">
          <MainButton text="Yes" backgroundColor="bg-green-500" textColor='text-white' onPress={handleConfirmLogout} />
          <MainButton text="No" backgroundColor="bg-gray-300" textColor='text-black' onPress={handleCancelLogout} />
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;