import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { sendResetPasswordEmail } from '../../services/operations/AuthAPI';
import { useNavigate } from 'react-router-dom';
import MainButton from '../../components/common/MainButton';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onSubmit = async (data) => {
    setIsButtonDisabled(true);
    await dispatch(sendResetPasswordEmail(data.email, navigate, toast));
    setIsButtonDisabled(false);
  };

  return (
    <div className="w-full h-full flex justify-start md:justify-center md:mt-0 mt-[5rem] items-center flex-col px-4">
      <div className='max-w-[800px] px-[1rem] py-[1rem] rounded-2xl text-black bg-green-100 text-center'>
        To regain access to your account, please enter your registered institute email ID. We'll send you the instructions to reset your password and get you back on track in no time.
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md flex flex-col justify-center items-start gap-10 my-[2rem]"
      >
        {/* Email Input */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-base font-medium text-black">
            Email ID<span className="text-red-500 text-xs">*</span> :
          </label>
          <Controller
            control={control}
            name="email"
            defaultValue=""
            rules={{ required: 'Email ID is required.' }}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Enter your Institute Email ID"
                className="w-full px-4 py-2 border border-gray-400 rounded-lg text-black placeholder-gray-400"
              />
            )}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-center">
          <MainButton
            text="Send Reset Password Link"
            onPress={handleSubmit(onSubmit)}
            isButtonDisabled={isButtonDisabled}
          />
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
