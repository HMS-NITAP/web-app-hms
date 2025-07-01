import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createAnnouncement } from '../../services/operations/OfficialAPI';
import MainButton from '../../components/common/MainButton';
import { toast } from 'react-hot-toast';

const CreateAnnouncement = () => {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
  const { token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const [fileResponse, setFileResponse] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onSubmit = async (data) => {
    setIsButtonDisabled(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("textContent", data.textContent);

    if (fileResponse) {
      formData.append("file", fileResponse);
    }

    const result = await dispatch(createAnnouncement(formData, token, toast));

    if (result?.success) {
      toast.success('Announcement Created Successfully');
      setValue("title", "");
      setValue("textContent", "");
      setFileResponse(null);
    } else {
      toast.error('Failed to create announcement');
    }

    setIsButtonDisabled(false);
  };

  const handleFileChange = (e) => {
    setFileResponse(e.target.files[0]);
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="pt-16 pb-8 w-[90%] flex flex-col gap-8"
        encType="multipart/form-data"
      >
        {/* Title */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-base font-medium text-black">
            Title<span className="text-red-500 text-xs">*</span>:
          </label>
          <Controller
            control={control}
            name="title"
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Enter Title"
                {...field}
                className="w-full p-2 border border-gray-400 rounded text-black"
              />
            )}
          />
          {errors.title && <span className="text-red-500 text-sm">Title is required.</span>}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-base font-medium text-black">
            Description<span className="text-red-500 text-xs">*</span>:
          </label>
          <Controller
            control={control}
            name="textContent"
            rules={{ required: true }}
            render={({ field }) => (
              <textarea
                placeholder="Enter Announcement Description"
                {...field}
                rows={5}
                className="w-full p-2 border border-gray-400 rounded text-black"
              />
            )}
          />
          {errors.textContent && <span className="text-red-500 text-sm">Description is required.</span>}
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-base font-medium text-black">Select Document to Upload:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
          />
          {fileResponse && (
            <div className="mt-2 text-black font-semibold">
              {fileResponse.name}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex w-full">
          <MainButton
            isButtonDisabled={isButtonDisabled}
            text="Create Announcement"
            onPress={handleSubmit(onSubmit)}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
