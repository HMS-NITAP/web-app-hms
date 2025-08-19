import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { acceptRegistrationApplication } from '../../services/operations/AdminAPI';
import MainButton from '../common/MainButton'


const FirstYearStudentApplicationCard = ({ application, toast, token, fetchData }) => {
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const acceptHandler = async () => {
    setIsButtonDisabled(true);
    let formdata = new FormData();
    formdata.append("userId", application?.id);
    // await dispatch(acceptRegistrationApplication(formdata, token, toast));
    fetchData();
    setAcceptModalVisible(false);
    setIsButtonDisabled(false);
  };

  return (
    <div className={`md:w-[48%] w-full border 'border-black' rounded-xl p-4 flex flex-col gap-4 bg-white`}>
      <div className='w-full flex flex-col gap-[1rem] md:flex-row flex-wrap'>
        <div className="md:w-[48%] w-full text-sm text-gray-800">
            <p><strong>Name: </strong> {application?.instituteStudent?.name}</p>
            <p><strong>Roll No: </strong> {application?.instituteStudent?.rollNo}</p>
            <p><strong>Reg. No: </strong> {application?.instituteStudent?.regNo}</p>
        </div>

        <div className="md:w-[48%] w-full text-sm text-gray-800">
          <p><strong>Branch: </strong> {application?.instituteStudent?.branch}</p>
        </div>
      </div>

      <div className='w-full flex flex-col gap-[1rem] md:flex-row flex-wrap'>
        <div className="md:w-[48%] w-full text-sm text-gray-800">
          <p><strong>Amount:</strong> {application?.instituteStudent?.amountPaid}</p>
        </div>
      </div>


      <div className="flex justify-evenly mt-2">
        <MainButton text="ALLOT ROOM" backgroundColor="bg-green-500" textColor='text-white' onPress={() => setAcceptModalVisible(true)} />
      </div>

      {acceptModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-6 md:w-full w-[90%] max-w-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
            <h2 className="text-xl font-semibold text-center mb-4">Accept Application</h2>
            <div className="flex justify-evenly mt-4">
              <MainButton text="Allot" backgroundColor="bg-green-500" textColor='text-white' isButtonDisabled={isButtonDisabled} onPress={acceptHandler} />
              <MainButton text="Cancel" backgroundColor="bg-gray-300" textColor='text-black' isButtonDisabled={isButtonDisabled} onPress={() => setAcceptModalVisible(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default FirstYearStudentApplicationCard