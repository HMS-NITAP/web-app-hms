import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createAnnouncement } from '../../services/operations/OfficialAPI';
import toast from 'react-hot-toast';

const CreateAnnouncement = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);
  const [file, setFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
          <label className="text-sm font-medium text-gray-800">Select Document to Upload</label>
          <input
            type="file"
            accept="*"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-gray-700"
          />
          {file && <p className="text-sm text-green-700 font-semibold">{file.name}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-start">
          <button
            type="submit"
            disabled={isButtonDisabled}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            Create Announcement
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
