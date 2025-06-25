import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../services/operations/AuthAPI';
import { toast } from 'react-toastify';
import MainButton from '../../components/common/MainButton';
import { useNavigate } from 'react-router-dom';

const LogoutModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.Profile);

  const logOutHandler = async () => {
    await dispatch(logout(navigate, toast));
  };

  const goBackHandler = () => {
    if (user.accountType === 'STUDENT') {
      navigate('/student-dashboard');
    } else if (user.accountType === 'OFFICIAL') {
      navigate('/create-announcement');
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 px-4 py-10">
      <p className="text-xl font-bold text-black text-center">
        Do you want to logout from your Account?
      </p>

      <div className="flex gap-4 justify-center items-center">
        <MainButton text="Continue" onClick={logOutHandler} />
        <MainButton text="Go Back" backgroundColor="#57cc99" onClick={goBackHandler} />
      </div>
    </div>
  );
};

export default LogoutModal;
