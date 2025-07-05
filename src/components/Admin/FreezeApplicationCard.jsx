import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { confirmFreezeRegistrationApplication, deleteFreezedRegistrationApplication } from '../../services/operations/AdminAPI';
import { Students } from '../../static/IndisciplinaryStudents';
import MainButton from '../common/MainButton';
import { Controller, useForm } from 'react-hook-form';

const FreezeApplicationCard = ({ application, toast, token, fetchData }) => {
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  const acceptHandler = async () => {
    setIsButtonDisabled(true);
    const formdata = new FormData();
    formdata.append('userId', application?.id);
    await dispatch(confirmFreezeRegistrationApplication(formdata, token, toast));
    fetchData();
    setAcceptModalVisible(false);
    setIsButtonDisabled(false);
  };

  const deleteHandler = async(data) => {
    setIsButtonDisabled(true);
    let formdata = new FormData();
    formdata.append("userId", application?.id);
    formdata.append("remarks", data?.remarks);
    await dispatch(deleteFreezedRegistrationApplication(formdata, token, toast));
    fetchData();
    setDeleteModalVisible(false);
    setIsButtonDisabled(false);
  }

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
          <p className="text-base font-semibold text-black">Payment Mode: <span className="font-medium">{student?.paymentMode}</span></p>
          <p className="text-base font-semibold text-black">Paid On: <span className="font-medium">{student?.paymentDate}</span></p>
          <p className="text-base font-semibold text-black">Amount: <span className="font-medium">{student?.amountPaid}</span></p>
          {student?.instituteFeeReceipt && (
            <p className="text-sm font-medium text-black">
              Institute Fee: <a href={student?.instituteFeeReceipt} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Click Here</a>
            </p>
          )}
          {student?.hostelFeeReceipt && (
            <p className="text-sm font-medium text-black">
              Hostel Fee: <a href={student?.hostelFeeReceipt} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Click Here</a>
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

      {/* Accept Button */}
      <div className="mt-4 flex justify-center gap-[2rem]">
        <MainButton text="ACCEPT" backgroundColor="bg-green-500" textColor='text-white' onPress={() => setAcceptModalVisible(true)} />
        <MainButton text="DELETE" backgroundColor="bg-red-500" textColor='text-white' onPress={() => setDeleteModalVisible(true)} />
      </div>

      {/* Modal */}
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

      {deleteModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-6 md:w-full w-[90%] max-w-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
            <p className="text-lg font-semibold text-center text-black mb-4">Are you sure, this application will be deleted.</p>
            <div className="flex justify-evenly mt-4">
              <MainButton text="Delete" backgroundColor="bg-red-500" textColor='text-white' isButtonDisabled={isButtonDisabled} onPress={deleteHandler} />
              <MainButton text="Cancel" backgroundColor="bg-gray-300" textColor='text-black' isButtonDisabled={isButtonDisabled} onPress={() => setDeleteModalVisible(false)} />
            </div>
          </div>
        </div>
      )}

      {deleteModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-6 md:w-full w-[90%] max-w-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
            <h2 className="text-xl font-semibold text-center mb-4">Delete Freezed Application</h2>
            <label className="block mb-1 text-sm font-medium">Reason for Rejection</label>
            <Controller
              control={control}
              name="remarks"
              rules={{ required: true }}
              render={({ field }) => (
                <textarea {...field} className="w-full border rounded p-2" rows={2} placeholder="Enter reason for rejection" />
              )}
            />
            {errors.remarks && <p className="text-red-500 text-sm mt-1">Remarks is required.</p>}
            <div className="flex justify-evenly mt-4">
              <MainButton text="Delete" backgroundColor="bg-red-500" textColor='text-white' isButtonDisabled={isButtonDisabled} onPress={handleSubmit(deleteHandler)} />
              <MainButton text="Cancel" backgroundColor="bg-gray-300" textColor='text-black' isButtonDisabled={isButtonDisabled} onPress={() => setDeleteModalVisible(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreezeApplicationCard;
