import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createAnnouncement } from '../../services/operations/OfficialAPI';
import toast from 'react-hot-toast';
import { MAX_ANNOUNCEMENT_FILE_SIZE } from '../../config/config';

const CreateAnnouncement = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);
  const [file, setFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  function pickUpFile(e) {
      const file = e.target.files[0];
      if (file) {
          if (file.size > MAX_ANNOUNCEMENT_FILE_SIZE) {
              toast('File size exceeds the limit of 5 MB. Please select a smaller file.', { icon: '⚠️' });
          } else {
              setFile(file);
          }
      }
  }

  const onSubmit = async (data) => {
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('textContent', data.textContent);
    if (file) {
      formData.append('file', file);
    }

    await dispatch(createAnnouncement(formData, token, toast));
    reset();
    setFile(null);
    setIsButtonDisabled(false);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-10 pb-6 px-4">

      <div className="md:w-[60%] w-full bg-green-100 rounded-2xl p-4 mb-6">
        <p className="text-center font-semibold text-base text-black">
          If you're experiencing any issues in the hostels, feel free to raise a complaint ticket here. Just provide the necessary details, and our team will look into it as soon as possible to ensure a quick resolution.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl flex flex-col gap-8">
        
        {/* Title Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800">
            Title <span className="text-red-500 text-xs">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Title"
            {...register('title', { required: true })}
            className="border border-gray-300 rounded-md px-3 py-2 text-black"
          />
          {errors.title && <p className="text-xs text-red-500">Title is required.</p>}
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800">
            Description <span className="text-red-500 text-xs">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Enter Announcement Description"
            {...register('textContent', { required: true })}
            className="border border-gray-300 rounded-md px-3 py-2 text-black"
          />
          {errors.textContent && <p className="text-xs text-red-500">Description is required.</p>}
        </div>

        {/* File Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800">Select Document to Upload (Optional)</label>
          <input
            type="file"
            accept="*"
            onChange={pickUpFile}
            className="max-w-[250px] px-[1rem] py-2 bg-blue-500 text-white font-semibold rounded-md cursor-pointer transition-transform duration-200 hover:scale-105"
          />
          {file && <p className="text-sm text-green-700 font-semibold">File name : {file.name}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`bg-yellow-400 cursor-pointer hover:scale-105 transition-all duration-200 text-black px-6 py-2 rounded-md font-semibold ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            Create Announcement
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
