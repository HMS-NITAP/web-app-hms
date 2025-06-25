import React, {  useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setRegistrationData, setRegistrationStep } from '../../reducers/slices/AuthSlice';
import { sendOtpToStudent } from '../../services/operations/AuthAPI';

const MAX_FILE_SIZE = 250 * 1024;

const StudentRegistrationForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const [imageResponse, setImageResponse] = useState(null);
  const [hostelFeeReceipt, setHostelFeeReceipt] = useState(null);
  const [instituteFeeReceipt, setInstituteFeeReceipt] = useState(null);
  const [dob, setDob] = useState(null);
  const [paymentDate, setPaymentDate] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleFileChange = (e, setter, limitKB = 250) => {
    const file = e.target.files[0];
    if (file && file.size > limitKB * 1024) {
      alert(`File size should not exceed ${limitKB}KB.`);
      return;
    }
    setter(file);
  };

  const onSubmit = async (data) => {
    if (!data.email.endsWith('@student.nitandhra.ac.in')) {
      alert('Use institute email ID');
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    if (!imageResponse || !hostelFeeReceipt || !dob || !paymentDate) {
      alert('Please complete all required fields including uploads and dates');
      return;
    }

    const registrationData = {
      ...data,
      dob,
      paymentDate,
      image: imageResponse,
      hostelFeeReceipt,
      instituteFeeReceipt,
    };

    setIsButtonDisabled(true);
    await dispatch(setRegistrationData(registrationData));
    const response = await dispatch(sendOtpToStudent(data.email));
    if (response) dispatch(setRegistrationStep(2));
    setIsButtonDisabled(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col gap-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Student Registration Form</h2>

      <div>
        <label className="block font-medium">Student Name *</label>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field }) => <input {...field} className="input" placeholder="Enter name" />}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Institute Email *</label>
        <Controller
          name="email"
          control={control}
          rules={{ required: 'Email is required' }}
          render={({ field }) => <input {...field} className="input" placeholder="Enter email" />}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Password *</label>
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field }) => <input type="password" {...field} className="input" placeholder="Enter password" />}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block font-medium">Confirm Password *</label>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: 'Confirmation required' }}
            render={({ field }) => <input type="password" {...field} className="input" placeholder="Confirm password" />}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <div>
        <label className="block font-medium">Date of Birth *</label>
        <DatePicker
          selected={dob}
          onChange={(date) => setDob(date)}
          dateFormat="yyyy-MM-dd"
          className="input"
          maxDate={new Date()}
          placeholderText="Select DOB"
        />
      </div>

      <div>
        <label className="block font-medium">Payment Date *</label>
        <DatePicker
          selected={paymentDate}
          onChange={(date) => setPaymentDate(date)}
          dateFormat="yyyy-MM-dd"
          className="input"
          placeholderText="Select payment date"
        />
      </div>

      <div>
        <label className="block font-medium">Profile Image (Max 250KB) *</label>
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setImageResponse)} />
        {imageResponse && <p className="text-green-600">{imageResponse.name}</p>}
      </div>

      <div>
        <label className="block font-medium">Hostel Fee Receipt (PDF, Max 250KB) *</label>
        <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, setHostelFeeReceipt)} />
        {hostelFeeReceipt && <p className="text-green-600">{hostelFeeReceipt.name}</p>}
      </div>

      <div>
        <label className="block font-medium">Institute Fee Receipt (PDF, Max 250KB)</label>
        <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, setInstituteFeeReceipt)} />
        {instituteFeeReceipt && <p className="text-green-600">{instituteFeeReceipt.name}</p>}
      </div>

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        disabled={isButtonDisabled}
      >
        Submit
      </button>
    </form>
  );
};

export default StudentRegistrationForm;
