import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getStudentDashboardData, addEvenSemFeeReceipt } from '../../services/operations/StudentAPI';
import { FaBirthdayCake } from 'react-icons/fa';
import { Rating } from 'react-rating';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.Auth);
  const { control, handleSubmit, formState: { errors }, reset } = useForm();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [file, setFile] = useState(null);
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const MAX_FILE_SIZE = 250 * 1024;

  const quotes = [
    "Wishing you a day filled with immense love, joy, and countless beautiful moments!",
    "May your birthday be as extraordinary as you are!",
    "Happy Birthday! Enjoy every moment of this special day!",
    "Cheers to your bright future and all the happiness it holds!",
    "Celebrate your special day in a special way!"
  ];

  const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

  const checkBirthday = (dobString) => {
    const [_, mm, dd] = dobString.split('-').map(Number);
    const today = new Date();
    if (today.getDate() === dd && today.getMonth() + 1 === mm) {
      setShowBirthdayModal(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getStudentDashboardData(token, toast));
      if (response?.data) {
        setDashboardData(response.data);
        checkBirthday(response.data.dob);
      }
    };
    fetchData();
  }, [dispatch, token]);

  const onSubmit = async (data) => {
    if (!paymentMode || !paymentDate || !file) {
      toast.error('All fields are required');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 250KB');
      return;
    }

    const formData = new FormData();
    formData.append('evenSemHostelFeeReceipt', file);
    formData.append('amountPaid2', data.amountPaid2);
    formData.append('paymentMode2', paymentMode);
    formData.append('paymentDate2', paymentDate);

    await dispatch(addEvenSemFeeReceipt(formData, token, toast));
    toast.success('Receipt uploaded successfully');
    reset();
    setFile(null);
  };

  return (
    <div className="p-4 w-full max-w-4xl mx-auto">
      {!dashboardData ? (
        <p className="text-center font-bold text-lg">Loading...</p>
      ) : (
        <div className="space-y-6">
          {showBirthdayModal && (
            <div className="bg-green-100 p-4 rounded shadow text-center">
              <FaBirthdayCake className="text-2xl mx-auto text-pink-600" />
              <p className="font-bold">Happy Birthday, {dashboardData.name}!</p>
              <p>{getRandomQuote()}</p>
              <button onClick={() => setShowBirthdayModal(false)} className="mt-2 text-sm text-blue-600 underline">Close</button>
            </div>
          )}

          <div className="text-center">
            <img src={dashboardData.image} alt="profile" className="mx-auto w-24 h-24 rounded-full" />
            <h2 className="font-bold text-xl mt-2 text-black">{dashboardData.name}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="font-semibold">Discipline Rating</p>
              <Rating readonly initialRating={parseFloat(dashboardData.disciplineRating)} />
              <p className="text-black font-bold">{dashboardData.disciplineRating}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <p className="font-semibold">Outing Rating</p>
              <Rating readonly initialRating={parseFloat(dashboardData.outingRating)} />
              <p className="text-black font-bold">{dashboardData.outingRating}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block font-medium text-black">Hostel Fee Payment Amount *</label>
              <Controller
                name="amountPaid2"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input type="number" {...field} className="mt-1 block w-full border px-3 py-2 rounded text-black" />
                )}
              />
              {errors.amountPaid2 && <p className="text-red-600 text-sm">Amount is required</p>}
            </div>

            <div>
              <label className="block font-medium text-black">Payment Mode *</label>
              <select onChange={(e) => setPaymentMode(e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded text-black">
                <option value="">Select Mode</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="UPI">UPI</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="NEFT">NEFT</option>
                <option value="NEFT_Educational_Loan">NEFT (Loan)</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-black">Payment Date *</label>
              <input type="date" onChange={(e) => setPaymentDate(e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded text-black" />
            </div>

            <div>
              <label className="block font-medium text-black">Upload Fee Receipt (PDF only, Max 250KB) *</label>
              <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="mt-1 block w-full text-black" />
              {file && <p className="text-sm text-green-600">{file.name}</p>}
            </div>

            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Submit</button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-6">
            For account deletion, mail us at <a href="mailto:hmsnitap@gmail.com" className="text-blue-600 underline">hmsnitap@gmail.com</a> from your registered ID.
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;