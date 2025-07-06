import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainButton from "../../components/common/MainButton";
import { CreateOutingApplication } from "../../services/operations/StudentAPI";

const OutingApplicationWeb = () => {
  const [type, setType] = useState("Local");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.Auth);

  // For date/time, use string for input value
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm();

  // Helper to get today's date in YYYY-MM-DD format
  const getToday = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  // Helper to get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  // For "Local" mode, restrict to today and up to 22:00
  const getMaxTime = () => "22:00";

  // For "NonLocal", allow any future date/time
  const getMinDateTime = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  };

  // Validation and submission
  const submitHandler = async (data) => {
    let from, to;
    if (type === "Local") {
      // Local: only today, time only
      const today = getToday();
      from = new Date(`${today}T${fromDate}`);
      to = new Date(`${today}T${toDate}`);
      if (!fromDate || !toDate) {
        toast.error("Please select both From and To time.");
        return;
      }

      const now = new Date();

      if (from <= now || to <= now) {
        toast.error("From and To time must be greater than the current time.");
        return;
      }

      if (from > to) {
        toast.error("From time must be before To time.");
        return;
      }
      // Only allow up to 22:00
      if( from.getHours() > 22 || (from.getHours() === 22 && from.getMinutes() > 0) || to.getHours() > 22 || (to.getHours() === 22 && to.getMinutes() > 0)){
        toast.error("Time cannot be after 22:00.");
        return;
      }
    } else {
      // NonLocal: datetime-local
      if (!fromDate || !toDate) {
        toast.error("Please select both From and To date/time.");
        return;
      }
      from = new Date(fromDate);
      to = new Date(toDate);
      const now = new Date();
      if (from < now || to < now) {
        toast.error("Dates must be in the future.");
        return;
      }
      if (from > to) {
        toast.error("From date/time must be before To date/time.");
        return;
      }
    }

    setIsButtonDisabled(true);
    let formData = new FormData();
    formData.append('type', type);
    formData.append('from', from.toISOString());
    formData.append('to', to.toISOString());
    formData.append('purpose', data.purpose);
    formData.append('placeOfVisit', data.placeOfVisit);

    const response = await dispatch(CreateOutingApplication(formData, token, toast));
    if (response) {
      navigate("/student/application-history");
    }
    setIsButtonDisabled(false);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white">
      <form
        className="w-full max-w-lg mt-10 mb-10 bg-white rounded-xl shadow-lg p-8 flex flex-col gap-8"
        onSubmit={handleSubmit(submitHandler)}
      >
        {/* Outing Type */}
        <div className="flex flex-col gap-1 w-full">
          <label className="font-medium text-black">
            Outing Type <span className="text-xs text-red-600">*</span> :
          </label>
          <div className="flex w-full border border-black rounded-lg overflow-hidden">
            <button
              type="button"
              className={`w-1/2 py-2 font-semibold cursor-pointer transition-all duration-200 ${type === "Local" ? "bg-yellow-400 hover:bg-yellow-500" : "bg-white hover:bg-[#caf0f8]"} text-black`}
              onClick={() => setType("Local")}
            >
              Local
            </button>
            <button
              type="button"
              className={`w-1/2 py-2 font-semibold cursor-pointer transition-all duration-200 ${type === "NonLocal" ? "bg-yellow-400 hover:bg-yellow-500" : "bg-white hover:bg-[#caf0f8]"} text-black`}
              onClick={() => setType("NonLocal")}
            >
              Non Local
            </button>
          </div>
        </div>

        {/* Place of Visit */}
        <div className="flex flex-col gap-1 w-full">
          <label className="font-medium text-black">
            Place of visit <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            name="placeOfVisit"
            rules={{ required: true }}
            render={({ field }) => (
              <input
                {...field}
                className="w-full p-2 border border-gray-400 rounded-lg text-black"
                placeholder="Enter your Place of Visit"
              />
            )}
            defaultValue=""
          />
          {errors.placeOfVisit && <span className="text-red-600 text-sm">Place of Visit is required.</span>}
        </div>

        {/* Purpose */}
        <div className="flex flex-col gap-1 w-full">
          <label className="font-medium text-black">
            Purpose <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            name="purpose"
            rules={{ required: true }}
            render={({ field }) => (
              <input
                {...field}
                className="w-full p-2 border border-gray-400 rounded-lg text-black"
                placeholder="Enter your Purpose"
              />
            )}
            defaultValue=""
          />
          {errors.purpose && <span className="text-red-600 text-sm">Purpose is required.</span>}
        </div>

        {/* From Date/Time */}
        <div className="flex flex-col gap-1 w-full">
          <label className="font-medium text-black">
            Select From {type === "Local" ? "Time" : "Date & Time"} <span className="text-xs text-red-600">*</span> :
          </label>
          {type === "Local" ? (
            <input
              type="time"
              className="w-full p-2 border border-gray-400 rounded-lg text-black"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              min={getCurrentTime()}
              max={getMaxTime()}
              required
            />
          ) : (
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-400 rounded-lg text-black"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              min={getMinDateTime()}
              required
            />
          )}
        </div>

        {/* To Date/Time */}
        <div className="flex flex-col gap-1 w-full">
          <label className="font-medium text-black">
            Select To {type === "Local" ? "Time" : "Date & Time"} <span className="text-xs text-red-600">*</span> :
          </label>
          {type === "Local" ? (
            <input
              type="time"
              className="w-full p-2 border border-gray-400 rounded-lg text-black"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              min={fromDate || getCurrentTime()}
              max={getMaxTime()}
              required
            />
          ) : (
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-400 rounded-lg text-black"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              min={fromDate || getMinDateTime()}
              required
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-1 w-full">
          <MainButton
            isButtonDisabled={isButtonDisabled}
            text={"Apply"}
            onPress={handleSubmit(submitHandler)}
            backgroundColor="bg-yellow-500"
            textColor="text-black"
            width="w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default OutingApplicationWeb; 