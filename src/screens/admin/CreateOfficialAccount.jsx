import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { createOfficialAccount } from '../../services/operations/AdminAPI';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const CreateOfficialAccount = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [secureText, setSecureText] = useState(true);
  const [selectedGender, setSelectedGender] = useState('M');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const submitHandler = async (data) => {
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('name', data.name);
    formData.append('designation', data.designation);
    formData.append('gender', selectedGender);
    formData.append('phone', data.phone);
    await dispatch(createOfficialAccount(formData, token, toast));
    reset();
    setIsButtonDisabled(false);
  };

  return (
    <div className="w-full flex flex-col items-center py-10">
      <div className="md:w-[40%] w-[90%] bg-green-100 rounded-2xl p-4 mb-6">
        <p className="text-center font-semibold text-base text-black">
          Create the official (warden/caretaker) accounts here, share the respective email IDs and passwords with them, and assign hostel blocks if required.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="md:w-[50%] w-[95%] flex flex-col gap-6"
      >
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black">
            Official Email ID <span className="text-red-500">*</span> :
          </label>
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Enter Email ID"
                className="border border-gray-400 px-3 py-2 rounded-md text-black"
              />
            )}
          />
          {errors.email && (
            <span className="text-sm text-red-500">Official Email ID is required.</span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-sm font-medium text-black">
            Password <span className="text-red-500">*</span> :
          </label>
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type={secureText ? 'password' : 'text'}
                  placeholder="Enter a Password"
                  className="border border-gray-400 px-3 py-2 rounded-md text-black w-full"
                />
                <span
                  className="absolute right-3 top-[55%] text-gray-500 cursor-pointer"
                  onClick={() => setSecureText(!secureText)}
                >
                  {secureText ? <FaEyeSlash /> : <FaEye />}
                </span>
              </>
            )}
          />
          {errors.password && (
            <span className="text-sm text-red-500">Password is required.</span>
          )}
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black">
            Name <span className="text-red-500">*</span> :
          </label>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter official name"
                className="border border-gray-400 px-3 py-2 rounded-md text-black"
              />
            )}
          />
          {errors.name && <span className="text-sm text-red-500">Name is required.</span>}
        </div>

        {/* Designation */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black">
            Designation <span className="text-red-500">*</span> :
          </label>
          <Controller
            name="designation"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter designation"
                className="border border-gray-400 px-3 py-2 rounded-md text-black"
              />
            )}
          />
          {errors.designation && (
            <span className="text-sm text-red-500">Designation is required.</span>
          )}
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black">
            Gender <span className="text-red-500">*</span> :
          </label>
          <Controller
            name="gender"
            control={control}
            defaultValue="M"
            render={({ field: { onChange } }) => (
              <div className="flex gap-8 mt-1 md:ml-[2rem] ml-[6rem]">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="M"
                    checked={selectedGender === 'M'}
                    onChange={() => {
                      setSelectedGender('M');
                      onChange('M');
                    }}
                  />
                  <span className="text-black font-semibold">M</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="F"
                    checked={selectedGender === 'F'}
                    onChange={() => {
                      setSelectedGender('F');
                      onChange('F');
                    }}
                  />
                  <span className="text-black font-semibold">F</span>
                </label>
              </div>
            )}
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black">
            Phone Number <span className="text-red-500">*</span> :
          </label>
          <Controller
            name="phone"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="1234567890"
                className="border border-gray-400 px-3 py-2 rounded-md text-black"
              />
            )}
          />
          {errors.phone && (
            <span className="text-sm text-red-500">Phone Number is required.</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`bg-yellow-400 text-white py-2 px-4 rounded-md transition-all duration-200 cursor-pointer font-semibold ${
            isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500'
          }`}
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateOfficialAccount;
