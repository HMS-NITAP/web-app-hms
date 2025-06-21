import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
// import { login } from '../../services/operations/AuthAPI';
import { toast } from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import MainButton from '../../components/common/MainButton';
import { login } from '../../services/operations/AuthAPI';
import { useNavigate } from 'react-router-dom';

const Login = ({ }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [secureText, setSecureText] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsButtonDisabled(true);
    await dispatch(login(data.email, data.password, toast, navigate));
    setIsButtonDisabled(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-var(--header-height))] flex flex-col items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
      >
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

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  {secureText ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </div>
              </>
            )}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">Password is required.</p>
          )}
        </div>

        <div className="text-right">
          <span
            className="text-sm text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("Forgot Password")}
          >
            Forgot Password?
          </span>
        </div>

        <div>
          <MainButton
            text="Log In"
            onPress={handleSubmit(onSubmit)}
            isButtonDisabled={isButtonDisabled}
          />
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-700">
            Are you a student and haven't registered yet?{" "}
            <span
              className="text-blue-600 cursor-pointer font-semibold hover:underline"
              onClick={() => navigate("Student Registration")}
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
