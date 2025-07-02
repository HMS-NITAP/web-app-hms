import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MainButton from '../../components/common/MainButton';
import { CreateOutingApplication } from '../../services/operations/StudentAPI';

const OutingApplication = () => {
  const [type, setType] = useState('Local');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.Auth);

  const { control, handleSubmit, formState: { errors } } = useForm();

  const submitHandler = async (data) => {
    if (!fromDate || !toDate || new Date(toDate) < new Date(fromDate) || new Date(fromDate) < new Date()) {
      toast.error('Invalid Dates Selected');
      return;
    }

    setIsButtonDisabled(true);

    const formData = new FormData();
    formData.append('type', type);
    formData.append('from', new Date(fromDate).toISOString());
    formData.append('to', new Date(toDate).toISOString());
    formData.append('purpose', data.purpose);
    formData.append('placeOfVisit', data.placeOfVisit);

    const response = await dispatch(CreateOutingApplication(formData, token, toast));
    if (response) {
      navigate('/application-history');
    }

    setIsButtonDisabled(false);
  };

  return (
    <div className="w-full flex justify-center min-h-screen py-10 bg-white">
      <form onSubmit={handleSubmit(submitHandler)} className="w-full max-w-xl flex flex-col gap-8 px-4">
        
        {/* Outing Type */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-black">Outing Type <span className="text-red-500">*</span>:</label>
          <div className="flex w-full border border-black rounded overflow-hidden">
            <button type="button" className={`w-1/2 py-2 ${type === 'Local' ? 'bg-yellow-300' : 'bg-white'}`} onClick={() => setType('Local')}>Local</button>
            <button type="button" className={`w-1/2 py-2 ${type === 'NonLocal' ? 'bg-yellow-300' : 'bg-white'}`} onClick={() => setType('NonLocal')}>Non Local</button>
          </div>
        </div>

        {/* Place of Visit */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-medium">Place of Visit <span className="text-red-500">*</span>:</label>
          <Controller
            name="placeOfVisit"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Enter your Place of Visit"
                className="w-full border border-gray-400 rounded px-4 py-2 text-black"
                {...field}
              />
            )}
          />
          {errors.placeOfVisit && <p className="text-red-500 text-sm">Place of Visit is required.</p>}
        </div>

        {/* Purpose */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-medium">Purpose <span className="text-red-500">*</span>:</label>
          <Controller
            name="purpose"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Enter your Purpose"
                className="w-full border border-gray-400 rounded px-4 py-2 text-black"
                {...field}
              />
            )}
          />
          {errors.purpose && <p className="text-red-500 text-sm">Purpose is required.</p>}
        </div>

        {/* From Date */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-medium">From Date <span className="text-red-500">*</span>:</label>
          <input
            type={type === 'Local' ? 'time' : 'datetime-local'}
            className="w-full border border-gray-400 rounded px-4 py-2 text-black"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            min={new Date().toISOString().slice(0, type === 'Local' ? 10 : 16)}
            max={type === 'Local' ? new Date().toISOString().slice(0, 10) + 'T22:00' : undefined}
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-medium">To Date <span className="text-red-500">*</span>:</label>
          <input
            type={type === 'Local' ? 'time' : 'datetime-local'}
            className="w-full border border-gray-400 rounded px-4 py-2 text-black"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={new Date().toISOString().slice(0, type === 'Local' ? 10 : 16)}
            max={type === 'Local' ? new Date().toISOString().slice(0, 10) + 'T22:00' : undefined}
          />
        </div>

        {/* Submit Button */}
        <div>
          <MainButton text="Apply" isButtonDisabled={isButtonDisabled} onPress={handleSubmit(submitHandler)} />
        </div>

      </form>
    </div>
  );
};

export default OutingApplication;
