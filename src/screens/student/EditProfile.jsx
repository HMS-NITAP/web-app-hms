import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { editStudentProfile } from '../../services/operations/StudentAPI';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const branchOptions = ['CSE', 'ECE', 'EEE', 'MECH', 'BIOTECH', 'CIVIL', 'METALLURGY'];
  const genderOptions = ['M', 'F'];
  const hostellerOptions = [
    { label: "True", value: true },
    { label: "False", value: false },
  ];

  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const submitHandler = async (data) => {
    await dispatch(editStudentProfile(data, token, toast));
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <form className="w-full max-w-xl flex flex-col gap-5" onSubmit={handleSubmit(submitHandler)}>
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Name <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your name" />
            )}
            name="name"
            defaultValue=""
          />
          {errors.name && <span className="text-red-600 text-sm">Name is required.</span>}
        </div>
        {/* Registration No */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Registration No <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Registration Number" />
            )}
            name="regNo"
            defaultValue=""
          />
          {errors.regNo && <span className="text-red-600 text-sm">Registration Number is required.</span>}
        </div>
        {/* Roll No */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Roll No <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Roll Number" />
            )}
            name="rollNo"
            defaultValue=""
          />
          {errors.rollNo && <span className="text-red-600 text-sm">Roll Number is required.</span>}
        </div>
        {/* Year */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Year <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <select {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black">
                <option value="">Select Year</option>
                {yearOptions.map((year, idx) => (
                  <option key={idx} value={year}>{year}</option>
                ))}
              </select>
            )}
            name="year"
            defaultValue=""
          />
          {errors.year && <span className="text-red-600 text-sm">Year is required.</span>}
        </div>
        {/* Branch */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Branch <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <select {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black">
                <option value="">Select Branch</option>
                {branchOptions.map((branch, idx) => (
                  <option key={idx} value={branch}>{branch}</option>
                ))}
              </select>
            )}
            name="branch"
            defaultValue=""
          />
          {errors.branch && <span className="text-red-600 text-sm">Branch is required.</span>}
        </div>
        {/* Gender */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Gender <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <select {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black">
                <option value="">Select Gender</option>
                {genderOptions.map((gender, idx) => (
                  <option key={idx} value={gender}>{gender === 'M' ? 'Male' : 'Female'}</option>
                ))}
              </select>
            )}
            name="gender"
            defaultValue=""
          />
          {errors.gender && <span className="text-red-600 text-sm">Gender is required.</span>}
        </div>
        {/* Community */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Community <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Community" />
            )}
            name="community"
            defaultValue=""
          />
          {errors.community && <span className="text-red-600 text-sm">Community is required.</span>}
        </div>
        {/* Aadhar Number */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Aadhar Number <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Aadhaar Number" />
            )}
            name="aadharNumber"
            defaultValue=""
          />
          {errors.aadharNumber && <span className="text-red-600 text-sm">Aadhar Number is required.</span>}
        </div>
        {/* DOB */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            DOB <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} type="date" className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="YYYY-MM-DD" />
            )}
            name="dob"
            defaultValue=""
          />
          {errors.dob && <span className="text-red-600 text-sm">DOB is required.</span>}
        </div>
        {/* Blood Group */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Blood Group <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Blood Group" />
            )}
            name="bloodGroup"
            defaultValue=""
          />
          {errors.bloodGroup && <span className="text-red-600 text-sm">Blood Group is required.</span>}
        </div>
        {/* Father Name */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Father Name <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Father Name" />
            )}
            name="fatherName"
            defaultValue=""
          />
          {errors.fatherName && <span className="text-red-600 text-sm">Father Name is required.</span>}
        </div>
        {/* Mother Name */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Mother Name <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Mother Name" />
            )}
            name="motherName"
            defaultValue=""
          />
          {errors.motherName && <span className="text-red-600 text-sm">Mother Name is required.</span>}
        </div>
        {/* Contact Number */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Contact Number <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Contact number" />
            )}
            name="phone"
            defaultValue=""
          />
          {errors.phone && <span className="text-red-600 text-sm">Contact Number is required.</span>}
        </div>
        {/* Parent Contact Number */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Parent Contact Number <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Parent Contact Number" />
            )}
            name="parentsPhone"
            defaultValue=""
          />
          {errors.parentsPhone && <span className="text-red-600 text-sm">Parent Contact Number is required.</span>}
        </div>
        {/* Emergency Phone */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Emergency Phone <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Emergency Contact" />
            )}
            name="emergencyPhone"
            defaultValue=""
          />
          {errors.emergencyPhone && <span className="text-red-600 text-sm">Emergency Contact is required.</span>}
        </div>
        {/* Address */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Address <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Address" />
            )}
            name="address"
            defaultValue=""
          />
          {errors.address && <span className="text-red-600 text-sm">Address is required.</span>}
        </div>
        {/* Is Hosteller */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Is Hosteller? <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <select {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black">
                <option value="">Select</option>
                {hostellerOptions.map((option, idx) => (
                  <option key={idx} value={option.value}>{option.label}</option>
                ))}
              </select>
            )}
            name="isHosteller"
            defaultValue={false}
          />
          {errors.isHosteller && <span className="text-red-600 text-sm">This is required.</span>}
        </div>
        {/* Cot Number */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Cot Number <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter Cot Number" />
            )}
            name="cotNo"
            defaultValue=""
          />
          {errors.cotNo && <span className="text-red-600 text-sm">Cot Number is required.</span>}
        </div>
        {/* Floor No */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Floor No <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Floor Number" />
            )}
            name="floorNo"
            defaultValue=""
          />
          {errors.floorNo && <span className="text-red-600 text-sm">Floor Number is required.</span>}
        </div>
        {/* Room No */}
        <div className="flex flex-col gap-1">
          <label className="font-medium text-black">
            Room No <span className="text-xs text-red-600">*</span> :
          </label>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your Room Number" />
            )}
            name="roomNo"
            defaultValue=""
          />
          {errors.roomNo && <span className="text-red-600 text-sm">Room Number is required.</span>}
        </div>
        <button type="submit" className="w-full py-3 rounded-xl font-bold text-lg text-black bg-[#b5e48c] mt-2">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditProfile;