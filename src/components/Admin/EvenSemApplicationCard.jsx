import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  acceptEvenSemRegistrationApplication,
  rejectEvenSemRegistrationApplication
} from '../../services/operations/AdminAPI';
import { Students } from '../../static/IndisciplinaryStudents';
import MainButton from '../common/MainButton';

const EvenSemApplicationCard = ({ application, token, fetchData }) => {
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const dispatch = useDispatch();

  const acceptHandler = async () => {
    setIsButtonDisabled(true);
    const formdata = new FormData();
    formdata.append('userId', application?.id);
    await dispatch(acceptEvenSemRegistrationApplication(formdata, token, toast));
    fetchData();
    setAcceptModalVisible(false);
    setIsButtonDisabled(false);
  };

  const rejectHandler = async (data) => {
    setIsButtonDisabled(true);
    const formdata = new FormData();
    formdata.append('userId', application?.id);
    formdata.append('remarks', data?.remarks);
    await dispatch(rejectEvenSemRegistrationApplication(formdata, token, toast));
    fetchData();
    setRejectModalVisible(false);
    setIsButtonDisabled(false);
    reset();
  };

  const student = application?.instituteStudent;
  const isIndisciplinary = Students.includes(student?.rollNo);

  return (
    <div className={`md:w-[48%] flex flex-col gap-[1rem] w-full border rounded-xl p-4 ${isIndisciplinary ? 'border-red-500' : 'border-black'}`}>
      <div className="flex justify-center gap-4 items-center">
        <div className="w-[6rem] h-[6rem] rounded-full overflow-hidden relative">
          <img
            src={student?.image}
            alt="student"
            className="w-full h-full rounded-full object-cover"
          /> 
        </div> 
      </div>

      <div className='w-full flex flex-col gap-[1rem] md:flex-row flex-wrap'>
        <div className="md:w-[48%] w-full text-sm text-gray-800">
            <p className="text-base font-semibold text-black">Name: <span className="font-medium">{student?.name}</span></p>
            <p className="text-base font-semibold text-black">Roll No: <span className="font-medium">{student?.rollNo}</span></p>
            <p className="text-base font-semibold text-black">Reg. No: <span className="font-medium">{student?.regNo}</span></p>
            <p className="text-base font-semibold text-black">Gender: <span className="font-medium">{student?.gender === 'M' ? 'Male' : 'Female'}</span></p>
        </div>

        <div className="md:w-[48%] w-full text-sm text-gray-800">
          <p className="text-base font-semibold text-black">Email ID: <span className="font-medium">{application?.email}</span></p>
          <p className="text-base font-semibold text-black">Year: <span className="font-medium">{student?.year}</span></p>
          <p className="text-base font-semibold text-black">Branch: <span className="font-medium">{student?.branch}</span></p>
          <p className="text-base font-semibold text-black">Contact: <span className="font-medium">{student?.phone}</span></p>
        </div>
      </div>

      <div className='w-full flex flex-col gap-[1rem] md:flex-row flex-wrap'>
        <div className="md:w-[48%] w-full text-sm text-gray-800">
          <p className="text-base font-semibold text-black">Payment Mode: <span className="font-medium">{student?.paymentMode2}</span></p>
          <p className="text-base font-semibold text-black">Paid On: <span className="font-medium">{student?.paymentDate2}</span></p>
          <p className="text-base font-semibold text-black">Amount: <span className="font-medium">{student?.amountPaid2}</span></p>
          {student?.hostelFeeReceipt2 && (
            <p className="text-sm font-medium text-black">
              Even Sem Hostel Fee Receipt: <a href={student?.hostelFeeReceipt2} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Even Sem Receipt</a>
            </p>
          )}
        </div>

        <div className="md:w-[48%] w-full text-sm text-gray-800">
          <p className="text-base font-semibold text-black">Hostel Block: <span className="font-medium">{student?.hostelBlock?.name}</span></p>
          <p className="text-base font-semibold text-black">Room No: <span className="font-medium">{student?.cot?.room?.roomNumber}</span></p>
          <p className="text-base font-semibold text-black">Floor No: <span className="font-medium">{student?.cot?.room?.floorNumber}</span></p>
          <p className="text-base font-semibold text-black">Cot No: <span className="font-medium">{student?.cot?.cotNo}</span></p>
        </div>
      </div>


      {/* Buttons */}
      <div className="mt-4 flex justify-center items-center gap-[2rem]">
        <MainButton text="ACCEPT" backgroundColor="bg-green-500" textColor='text-white' onPress={() => setAcceptModalVisible(true)} />
        <MainButton text="REJECT" backgroundColor="bg-red-500" textColor='text-white' onPress={() => setRejectModalVisible(true)} />
      </div>

      {/* Reject Modal */}
      {rejectModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-6 md:w-full w-[90%] max-w-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
            <p className="text-lg font-semibold text-center text-black mb-4">Are you sure, this application will be rejected?</p>
            <p className="text-sm font-medium text-black mb-1">Reason for Rejection</p>
            <Controller
              name="remarks"
              control={control}
              defaultValue=""
              rules={{ required: 'Remarks is required.' }}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className="w-full border border-gray-400 rounded-lg p-2 text-black"
                  placeholder="Enter reason for rejection"
                />
              )}
            />
            {errors.remarks && <p className="text-red-600 text-sm mt-1">{errors.remarks.message}</p>}
            <div className="flex justify-evenly mt-4">
              <MainButton text="Reject" backgroundColor="bg-red-500" textColor='text-white' isButtonDisabled={isButtonDisabled} onPress={handleSubmit(rejectHandler)} />
              <MainButton text="Cancel" backgroundColor="bg-gray-300" textColor='text-black' isButtonDisabled={isButtonDisabled} onPress={() => setRejectModalVisible(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {acceptModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-6 md:w-full w-[90%] max-w-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
            <p className="text-lg font-semibold text-center text-black mb-4">Are you sure, this application will be accepted?</p>
            <div className="flex justify-evenly mt-4">
              <MainButton text="Accept" backgroundColor="bg-green-500" textColor='text-white' isButtonDisabled={isButtonDisabled} onPress={acceptHandler} />
              <MainButton text="Cancel" backgroundColor="bg-gray-300" textColor='text-black' isButtonDisabled={isButtonDisabled} onPress={() => setAcceptModalVisible(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvenSemApplicationCard;
