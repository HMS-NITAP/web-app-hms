import React, { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createHostelComplaint } from '../../services/operations/StudentAPI';
import toast from 'react-hot-toast';

const RegisterComplaint = () => {
  const dropdownOptions = [
    'General', 'Food Issues', 'Electrical', 'Civil', 'Room Cleaning',
    'Restroom Cleaning', 'Network Issue', 'Indisciplinary', 'Discrimination',
    'Harassment', 'Damage to Property'
  ];

  const [category, setCategory] = useState('');
  const [fileResponse, setFileResponse] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    if (!category) {
      toast.error("Select a Category");
      return;
    }
    if (data?.about === "") {
      toast.error("Give description of complaint");
      return;
    }

    setIsButtonDisabled(true);
    let formData = new FormData();
    formData.append("category", category);
    formData.append("about", data?.about);
    if (fileResponse) {
      formData.append("file", fileResponse);
    }
    const response = await dispatch(createHostelComplaint(formData, token, toast));
    if (response) {
      setCategory(null);
      setFileResponse(null);
      reset();
    }
    setIsButtonDisabled(false);
  };

  const pickUpFile = useCallback(async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileResponse(file);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[90%] md:w-[60%] flex flex-col gap-8">

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-800">
            Category<span className="text-red-500 text-sm">*</span>:
          </label>
          <select
            className="border border-gray-400 rounded px-3 py-2 text-black"
            onChange={(e) => setCategory(e.target.value)}
            value={category || ""}
          >
            <option value="" disabled>Pick A Category</option>
            {dropdownOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-800">
            Description<span className="text-red-500 text-sm">*</span>:
          </label>
          <Controller
            control={control}
            name="about"
            rules={{ required: true }}
            render={({ field }) => (
              <textarea
                {...field}
                className="border border-gray-400 rounded px-3 py-2 text-black"
                placeholder="Enter the Description about the Complaint"
                rows={4}
              />
            )}
          />
          {errors.about && <span className="text-red-600 text-sm">Description is required.</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-800">Select Document to Upload:</label>
          <input type="file" onChange={pickUpFile} />
          {fileResponse && (
            <span className="text-black font-semibold mt-1">{fileResponse.name}</span>
          )}
        </div>

        <button
          type="submit"
          className={`px-5 py-2 rounded text-white font-bold ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={isButtonDisabled}
        >
          Generate Complaint
        </button>

      </form>
    </div>
  );
};

export default RegisterComplaint;
