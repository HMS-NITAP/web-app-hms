import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Rating from 'react-rating';
import MainButton from '../../components/common/MainButton';
import { addEvenSemFeeReceipt, getStudentDashboardData } from '../../services/operations/StudentAPI';

const quotes = [
  "Wishing you a day filled with immense love, joy, and countless beautiful moments! May all your dreams come true on this special day! 🎉",
  "May your birthday be as extraordinary and wonderful as you are! Here's to celebrating you and the incredible person you are. Happy Birthday! 🎂",
  "Happy Birthday! May you enjoy every single moment of this special day, surrounded by love, laughter, and the people who matter most to you! 🎈",
  "Here's to a fantastic year ahead, filled with new adventures, growth, and endless possibilities! Cheers to your bright future and all the happiness it holds! 🍰",
  "Celebrate your special day in a special way, making memories that will last a lifetime! May your birthday be filled with all the joy and love your heart can hold! 🎁"
];

const MAX_FILE_SIZE = 250 * 1024;

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

const paymentOption = [
  { label: "NET BANKING", value: "NET_BANKING" },
  { label: "DEBIT CARD", value: "DEBIT_CARD" },
  { label: "CREDIT CARD", value: "CREDIT_CARD" },
  { label: "UPI", value: "UPI" },
  { label: "NEFT", value: "NEFT" },
  { label: "NEFT(Educational Loan)", value: "NEFT_Educational_Loan" },
  { label: "OTHER", value: "OTHER" },
];

const getRatingLabel = (rating) => {
  rating = parseFloat(rating);
  if (rating > 4 && rating <= 5) {
    return "Excellent";
  } else if (rating > 3 && rating <= 4) {
    return "Good";
  } else if (rating > 2 && rating <= 3) {
    return "Average";
  } else if (rating > 1 && rating <= 2) {
    return "Poor";
  } else if (rating > 0 && rating <= 1) {
    return "Bad";
  } else {
    return "Not Rated";
  }
};

const formatDate = (date) => {
  if (!date) return "NO DATE IS SELECTED";
  return new Date(date).toLocaleDateString();
};

const covertToLocalDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-CA');
};

const StudentDashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [evenSemFeeModal, setEvenSemFeeModal] = useState(false);
  const [hostelEvenSemFeeReceiptResponse, setHostelEvenSemFeeReceiptResponse] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [paymentMode2, setPaymentMode2] = useState('');
  const [paymentDate2, setPaymentDate2] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  // Birthday check
  const checkIsDob = (dobString) => {
    if (!dobString) return;
    const [_, birthMonth, birthDay] = dobString.split('-').map(Number);
    const now = Date.now();
    const currentDate = new Date(now);
    const date = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    if (birthDay === date && birthMonth === month) {
      setShowBirthdayModal(true);
    }
  };

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    const response = await dispatch(getStudentDashboardData(token, toast));
    if (response) {
      setDashboardData(response);
      if (response?.data?.dob) {
        checkIsDob(response?.data?.dob);
      }
    }
  }, [dispatch, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // File upload handler
  const pickUpHostelFeeReceipt = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds the limit of 250KB. Please select a smaller file.');
      return;
    }
    setHostelEvenSemFeeReceiptResponse([file]);
  };

  // Modal submit
  const submitModalHandler = async (data) => {
    if (!paymentMode2) {
      toast.error("Select Hostel Fee Payment Mode");
      return;
    } else if (!paymentDate2) {
      toast.error("Select Hostel Fee Payment Date");
      return;
    } else if (!hostelEvenSemFeeReceiptResponse) {
      toast.error("Upload Fee Receipt");
      return;
    }
    setIsButtonDisabled(true);
    let formData = new FormData();
    formData.append("evenSemHostelFeeReceipt", hostelEvenSemFeeReceiptResponse[0]);
    formData.append("amountPaid2", data?.amountPaid2);
    formData.append("paymentDate2", covertToLocalDate(paymentDate2));
    formData.append("paymentMode2", paymentMode2);
    await dispatch(addEvenSemFeeReceipt(formData, token, toast));
    setEvenSemFeeModal(false);
    setHostelEvenSemFeeReceiptResponse(null);
    setIsButtonDisabled(false);
    fetchData();
    reset();
    setPaymentMode2('');
    setPaymentDate2('');
  };

  const cancelModalHandler = () => {
    setHostelEvenSemFeeReceiptResponse(null);
    setEvenSemFeeModal(false);
    reset();
    setPaymentMode2('');
    setPaymentDate2('');
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col items-center py-4 px-2 md:px-8">
      {showBirthdayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Happy Birthday, {dashboardData?.data?.name}!</h2>
            <p className="text-center text-gray-800 mb-4">{getRandomQuote()}</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold" onClick={() => setShowBirthdayModal(false)}>Thank you!</button>
          </div>
        </div>
      )}

      {evenSemFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-6 md:w-full w-[90%] max-w-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
            <h2 className="text-xl font-bold text-center text-black mb-[1rem]">Upload Even Sem Hostel Fee Receipt</h2>
            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
              <MainButton text="Select File" onPress={() => document.getElementById('evenSemFileInput').click()} />
              <input
                id="evenSemFileInput"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={pickUpHostelFeeReceipt}
              />
              <div className="flex-1 text-center">
                {hostelEvenSemFeeReceiptResponse ? (
                  <span className="text-black font-semibold text-base">{hostelEvenSemFeeReceiptResponse[0].name}</span>
                ) : (
                  <span className="text-red-600 font-bold text-base">No File Selected</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-black">Hostel Fee Payment Mode <span className="text-red-500">*</span></label>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-black"
                value={paymentMode2}
                onChange={e => setPaymentMode2(e.target.value)}
              >
                <option value="">Select Your Payment Mode</option>
                {paymentOption.map((mode) => (
                  <option key={mode.value} value={mode.value}>{mode.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-black">Hostel Fee Payment Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2 text-black"
                value={paymentDate2}
                onChange={e => setPaymentDate2(e.target.value)}
                max={covertToLocalDate(new Date())}
              />
              <span className="font-semibold text-black">{formatDate(paymentDate2)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-black">Hostel Fee Payment Amount <span className="text-red-500">*</span></label>
              <Controller
                control={control}
                name="amountPaid2"
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-black"
                    placeholder="Enter amount paid"
                  />
                )}
                defaultValue=""
              />
              {errors.amountPaid2 && <span className="text-red-600 text-sm">Amount Paid is required.</span>}
            </div>
            <div className="flex flex-row gap-4 justify-center mt-2">
              <button
                disabled={isButtonDisabled}
                onClick={handleSubmit(submitModalHandler)}
                className={`px-6 py-2 rounded-lg font-semibold bg-lime-500 text-black ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-lime-600'}`}
              >Submit</button>
              <button
                disabled={isButtonDisabled}
                onClick={cancelModalHandler}
                className={`px-6 py-2 rounded-lg font-semibold bg-gray-300 text-black ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
        {!dashboardData ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="flex justify-center items-center mt-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-black text-lg font-bold">Please Wait...</p>
                </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
              <div className="flex-1 flex flex-col items-center bg-lime-100 rounded-xl p-4 shadow-md">
                <span className="font-bold text-lg text-gray-700 mb-1">Discipline Rating</span>
                <Rating
                  initialRating={parseFloat(dashboardData?.data?.disciplineRating) || 0}
                  readonly
                  emptySymbol={<span className="text-gray-300 text-2xl">★</span>}
                  fullSymbol={<span className="text-yellow-400 text-2xl">★</span>}
                />
                <span className="mt-2 text-black font-semibold">{getRatingLabel(dashboardData?.data?.disciplineRating)}</span>
                <span className="text-black font-bold">{dashboardData?.data?.disciplineRating}</span>
              </div>
              <div className="flex-1 flex flex-col items-center bg-lime-100 rounded-xl p-4 shadow-md">
                <span className="font-bold text-lg text-gray-700 mb-1">Outing Rating</span>
                <Rating
                  initialRating={parseFloat(dashboardData?.data?.outingRating) || 0}
                  readonly
                  emptySymbol={<span className="text-gray-300 text-2xl">★</span>}
                  fullSymbol={<span className="text-yellow-400 text-2xl">★</span>}
                />
                <span className="mt-2 text-black font-semibold">{getRatingLabel(dashboardData?.data?.outingRating)}</span>
                <span className="text-black font-bold">{dashboardData?.data?.outingRating}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              {isLoading && (
                <div className="w-24 h-24 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              )}
              <img
                src={dashboardData?.data?.image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
              />
              <span className="text-xl font-bold text-black">{dashboardData?.data?.name}</span>
            </div>

            <div className="flex flex-col items-center">
              {dashboardData?.data?.user?.status === "ACTIVE1" && !dashboardData?.data?.hostelFeeReceipt2 && (
                <MainButton onPress={() => setEvenSemFeeModal(true)} text={"Upload Even Sem Hostel Fee Receipt"} />
              )}
              {dashboardData?.data?.user?.status === "ACTIVE1" && dashboardData?.data?.hostelFeeReceipt2 && (
                <div className="text-green-600 font-bold text-lg text-center">Even Semester Registration Under Review</div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2">
              <span className="text-base font-semibold text-black">Reg No: {dashboardData?.data?.regNo}</span>
              <span className="text-base font-semibold text-black">Roll No: {dashboardData?.data?.rollNo}</span>
              <span className="text-base font-semibold text-black">Email: {dashboardData?.userData?.email}</span>
              <span className="text-base font-semibold text-black">Gender: {dashboardData?.data?.gender === "M" ? "Male" : "Female"}</span>
              <span className="text-base font-semibold text-black">DOB: {new Date(dashboardData?.data?.dob).toLocaleDateString()}</span>
              <span className="text-base font-semibold text-black">Year: {dashboardData?.data?.year}</span>
              <span className="text-base font-semibold text-black">Branch: {dashboardData?.data?.branch}</span>
              <span className="text-base font-semibold text-black">Blood Group: {dashboardData?.data?.bloodGroup}</span>
              <span className="text-base font-semibold text-black">Aadhaar Number: {dashboardData?.data?.aadhaarNumber}</span>
              <span className="text-base font-semibold text-black">Contact No: {dashboardData?.data?.phone}</span>
              <span className="text-base font-semibold text-black">Father's Name: {dashboardData?.data?.fatherName}</span>
              <span className="text-base font-semibold text-black">Mother's Name: {dashboardData?.data?.motherName}</span>
              <span className="text-base font-semibold text-black">Parents' Contact: {dashboardData?.data?.parentsPhone}</span>
              <span className="text-base font-semibold text-black">Emergency Contact: {dashboardData?.data?.emergencyPhone}</span>
              <span className="text-base font-semibold text-black">Address: {dashboardData?.data?.address}</span>
            </div>

            {/* Section: Hostel, Room, Mess, Payment */}
            <div className="flex flex-col md:flex-row gap-4 overflow-x-auto w-full p-[1rem]">
              {/* Hostel Details */}
              <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow-md p-4 flex flex-col gap-2">
                <span className="text-lg font-bold text-green-700 text-center">Hostel Details</span>
                <span className="text-base font-semibold text-black">Hostel Name: {dashboardData?.data?.hostelBlock?.name}</span>
                <span className="text-base font-semibold text-black">Capacity: {dashboardData?.data?.hostelBlock?.capacity}</span>
                <span className="text-base font-semibold text-black">Gender: {dashboardData?.data?.hostelBlock?.gender === "M" ? "Boys Hostel" : "Girls Hostel"}</span>
                <img src={dashboardData?.data?.hostelBlock?.image} alt="Hostel" className="w-full h-24 object-cover rounded-lg" />
              </div>
              {/* Room Details */}
              <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow-md p-4 flex flex-col gap-2">
                <span className="text-lg font-bold text-green-700 text-center">Room Details</span>
                <span className="text-base font-semibold text-black">Room Type: {dashboardData?.data?.hostelBlock?.roomType}</span>
                <span className="text-base font-semibold text-black">Room Number: {dashboardData?.data?.cot?.room?.roomNumber}</span>
                <span className="text-base font-semibold text-black">Floor Number: {dashboardData?.data?.cot?.room?.floorNumber}</span>
                <span className="text-base font-semibold text-black">Cot Number: {dashboardData?.data?.cot?.cotNo}</span>
              </div>
              {/* Mess Details */}
              <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow-md p-4 flex flex-col gap-2">
                <span className="text-lg font-bold text-green-700 text-center">Mess Details</span>
                {dashboardData?.data?.messHall ? (
                  <>
                    <span className="text-base font-semibold text-black">Mess Name: {dashboardData?.data?.messHall?.hallName}</span>
                    <span className="text-base font-semibold text-black">Capacity: {dashboardData?.data?.messHall?.capacity}</span>
                  </>
                ) : (
                  <span className="text-base font-semibold text-red-600">Mess Hall not assigned</span>
                )}
              </div>
              {/* Payment Details */}
              <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow-md p-4 flex flex-col gap-2">
                <span className="text-lg font-bold text-green-700 text-center">Payment Details</span>
                {dashboardData?.data?.hostelFeeReceipt && (
                  <a href={dashboardData?.data?.hostelFeeReceipt} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Odd Sem Hostel Fee Receipt</a>
                )}
                {dashboardData?.data?.hostelFeeReceipt2 && (
                  <a href={dashboardData?.data?.hostelFeeReceipt2} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Even Sem Hostel Fee Receipt</a>
                )}
              </div>
            </div>

            {/* Account Deletion Info */}
            <div className="my-4 mx-auto max-w-2xl text-center">
              <span className="text-gray-700">If you want to delete your account, please contact us on <a href="mailto:hmsnitap@gmail.com" className="text-blue-600 underline">hmsnitap@gmail.com</a> from your registered mail ID and reason for account deletion.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardScreen;