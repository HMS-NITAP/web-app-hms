import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setSignUpData } from '../../reducers/slices/AuthSlice';
import { sendOTP } from '../../services/operations/AuthAPI';
import { AccountType } from '../../static/AccountType';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import MainButton from '../../components/common/MainButton';

const Signup = () => {
  const { control, setValue, handleSubmit, formState: { errors } } = useForm();
  const [accountType, setAccountType] = useState('');
  const [secureText1, setSecureText1] = useState(true);
  const [secureText2, setSecureText2] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setValue("email", "");
    setValue("password", "");
    setValue("confirmPassword", "");
    setAccountType("");
  }, [setValue]);

  const handleRadioPress = (value) => {
    setAccountType(value);
  };

  const handlePress = () => {
    navigate("/login");
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Both passwords are not Matching");
    } else {
      const signupData = { ...data, accountType };
      alert("Please wait...");
      await dispatch(setSignUpData(signupData));
      await dispatch(sendOTP(data.email, navigate, { show: alert }));
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-6 bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email ID<span className="text-red-500 text-xs">*</span>:
          </label>
          <Controller
            control={control}
            name="email"
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-400"
                placeholder="Enter your college Email ID"
                {...field}
              />
            )}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">Email is required.</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password<span className="text-red-500 text-xs">*</span>:
          </label>
          <Controller
            control={control}
            name="password"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <input
                  type={secureText1 ? "password" : "text"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-400"
                  placeholder="Enter your password"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setSecureText1(!secureText1)}
                  className="absolute top-9 right-3 text-gray-500"
                >
                  {secureText1 ? <FaEyeSlash /> : <FaEye />}
                </button>
              </>
            )}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">Password is required.</p>}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password<span className="text-red-500 text-xs">*</span>:
          </label>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <input
                  type={secureText2 ? "password" : "text"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-black placeholder-gray-400"
                  placeholder="Re-enter your password"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setSecureText2(!secureText2)}
                  className="absolute top-9 right-3 text-gray-500"
                >
                  {secureText2 ? <FaEyeSlash /> : <FaEye />}
                </button>
              </>
            )}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">Please confirm your password.</p>}
        </div>

        {/* Account Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type<span className="text-red-500 text-xs">*</span>:
          </label>
          <div className="flex flex-wrap gap-4">
            {AccountType.map((account, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={account.value}
                  checked={accountType === account.value}
                  onChange={() => handleRadioPress(account.value)}
                  className="form-radio text-blue-600"
                />
                <span className="text-sm text-gray-800">{account.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <MainButton text="Sign Up" type="submit" />
        </div>
      </form>

      <p
        className="mt-6 text-center text-sm text-blue-600 cursor-pointer hover:underline"
        onClick={handlePress}
      >
        Already have an Account? Click Here
      </p>
    </div>
  );
};

export default Signup;
