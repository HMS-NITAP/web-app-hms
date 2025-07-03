import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import MainButton from '../../components/common/MainButton';
import { login } from '../../services/operations/AuthAPI';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm();
  const [secureText, setSecureText] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onSubmit = async (data) => {
    setIsButtonDisabled(true);
    await dispatch(login(data.email, data.password, toast, navigate));
    setIsButtonDisabled(false);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email ID <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="email"
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
              <input
                type="email"
                placeholder="Enter your Institute Email ID"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                {...field}
              />
            )}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">Email ID is required.</p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="password"
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
              <>
                <input
                  type={secureText ? "password" : "text"}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  {...field}
                />
                <div
                  className="absolute right-3 top-9 cursor-pointer text-gray-400"
                  onClick={() => setSecureText(!secureText)}
                >
                  {secureText ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </div>
              </>
            )}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">Password is required.</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <span
            className="text-sm text-blue-500 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </div>

        {/* Submit Button */}
        <div className='w-full flex justify-center'>
          <MainButton
            text="Log In"
            type="submit"
            isButtonDisabled={isButtonDisabled}
            width='w-full'
          />
        </div>

        {/* Register Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-700">
            Are you a student and haven't registered yet?{" "}
            <span
              className="text-blue-500 cursor-pointer font-semibold hover:underline"
              onClick={() => navigate("/student-registration")}
            >
              Click here to register!
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
