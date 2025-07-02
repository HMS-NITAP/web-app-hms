import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../services/operations/AuthAPI';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
      <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-6 w-full max-w-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
        <p className="text-lg font-semibold text-center text-black mb-6">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-between space-x-4">
          <button
            onClick={handleConfirmLogout}
            className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
          >
            Yes
          </button>
          <button
            onClick={handleCancelLogout}
            className="flex-1 cursor-pointer bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg font-medium"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;