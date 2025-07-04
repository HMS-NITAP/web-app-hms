import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../services/operations/AuthAPI';
import { useNavigate } from 'react-router-dom';
import MainButton from '../../components/common/MainButton';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ResetPassword = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onSubmit = async (data) => {

    if(data.newPassword !== data.confirmNewPassword){
      toast.error("Passwords are not matching");
      return;
    }

    setIsButtonDisabled(true);

    await dispatch(resetPassword(
      data.token,
      data.newPassword,
      data.confirmNewPassword,
      navigate
    ));
    setIsButtonDisabled(false);
  };

  const [secureText1, setSecureText1] = useState(true);
  const [secureText2, setSecureText2] = useState(true);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start pt-20 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-8">
        <div className="flex flex-col gap-[0.25rem]">
          <label className="font-medium text-gray-800">
            Token <span className="text-red-600 text-sm">*</span>
          </label>
          <Controller
            control={control}
            name="token"
            rules={{ required: true }}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Token received in Email"
                className="w-full p-2 border border-gray-400 rounded-lg text-black"
              />
            )}
          />
          {errors.token && <p className="text-sm text-red-500">Token is required.</p>}
        </div>

        <div className="flex flex-col gap-[0.25rem] relative">
          <label className="font-medium text-gray-800">
            New Password <span className="text-red-600 text-sm">*</span>
          </label>
          <Controller
            control={control}
            name="newPassword"
            rules={{ required: true }}
            render={({ field }) => (
              <input
                {...field}
                type={secureText1 ? "password" : "text"}
                placeholder="Enter your New Password"
                className="w-full p-2 border border-gray-400 rounded-lg text-black"
              />
            )}
          />
          <button
              type="button"
              className="cursor-pointer absolute right-3 top-[55%] text-gray-400"
              onClick={() => setSecureText1(!secureText1)}
              >
              {secureText1 ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
          {errors.newPassword && <p className="text-sm text-red-500">New Password is required.</p>}
        </div>

        <div className="flex flex-col gap-[0.25rem] relative">
          <label className="font-medium text-gray-800">
            Confirm New Password <span className="text-red-600 text-sm">*</span>
          </label>
          <Controller
            control={control}
            name="confirmNewPassword"
            rules={{ required: true }}
            render={({ field }) => (
              <input
                {...field}
                type={secureText2 ? "password" : "text"}
                placeholder="Re-type your New Password"
                className="w-full p-2 border border-gray-400 rounded-lg text-black"
              />
            )}
          />
          <button
              type="button"
              className="cursor-pointer absolute right-3 top-[55%] text-gray-400"
              onClick={() => setSecureText2(!secureText2)}
              >
              {secureText2 ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
          {errors.confirmNewPassword && <p className="text-sm text-red-500">This field is required.</p>}
        </div>

        <div className="flex justify-center">
          <MainButton
            isButtonDisabled={isButtonDisabled}
            text="Reset Your Password"
            onPress={handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
