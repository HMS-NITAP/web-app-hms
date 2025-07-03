import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchHostelBlockRooms, fetchHostelBlockNames } from '../../services/operations/CommonAPI';
import { setRegistrationStep } from '../../reducers/slices/AuthSlice';
import { createStudentAccount } from '../../services/operations/AuthAPI';

const RoomAllotment = () => {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [hostelBlocks, setHostelBlocks] = useState(null);
  const [hostelBlockRooms, setHostelBlockRooms] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floorRooms, setFloorRooms] = useState(null);
  const [selectedCot, setSelectedCot] = useState(null);
  const [submitDetails, setSubmitDetails] = useState({ roomNo: null, floorNo: null, blockName: null, cotNo: null });
  const [floorCount, setFloorCount] = useState(null);

  const dispatch = useDispatch();
  const { registrationData } = useSelector((state) => state.Auth);

  const floorsArray = floorCount !== null ? Array.from({ length: floorCount + 1 }, (_, index) => ({ id: index })) : [];

  const fetchHostelBlocks = async () => {
    const response = await dispatch(fetchHostelBlockNames(toast));
    if (!registrationData) return;
    if (response && response.length > 0) {
      const filteredBlocks = response.filter(
        (block) => block?.gender === registrationData?.gender && block?.year === registrationData?.year
      );
      setHostelBlocks(filteredBlocks);
    }
  };

  const fetchRooms = async () => {
    setIsButtonDisabled(true);
    setSelectedCot(null);
    const filterData = hostelBlocks.filter((block) => block.id === selectedBlock);
    const floors = parseInt(filterData[0].floorCount);
    setFloorCount(floors);
    const response = await dispatch(fetchHostelBlockRooms(selectedBlock, toast));
    setHostelBlockRooms(response);
    setSubmitDetails({
      blockName: filterData[0].name,
      cotNo: null,
      floorNo: null,
      roomNo: null,
    });
    setIsButtonDisabled(false);
  };

  useEffect(() => {
    if (selectedBlock) {
      fetchRooms();
    }
    // eslint-disable-next-line
  }, [selectedBlock]);

  useEffect(() => {
    const filterRoomsFloorWise = () => {
      if (!hostelBlockRooms) return;
      const filterRooms = hostelBlockRooms.filter((room) => room?.floorNumber === selectedFloor);
      setFloorRooms(filterRooms);
    };
    filterRoomsFloorWise();
  }, [selectedFloor, hostelBlockRooms]);

  useEffect(() => {
    fetchHostelBlocks();
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  const selectCot = (cot, room) => {
    if (cot?.status === 'BOOKED' || cot?.status === 'BLOCKED') return;
    setSelectedCot(cot?.id);
    setSubmitDetails((prevDetails) => ({
      ...prevDetails,
      cotNo: cot?.cotNo,
      roomNo: room?.roomNumber,
      floorNo: room?.floorNumber,
    }));
    setModalVisible(true);
  };

  const cancelHandler = () => {
    setModalVisible(false);
    setSelectedCot(null);
  };

  const handleSubmit = async () => {
    if (!registrationData) return;
    setIsButtonDisabled(true);
    const formdata = new FormData();
    formdata.append('email', registrationData?.email);
    formdata.append('password', registrationData?.password);
    formdata.append('confirmPassword', registrationData?.confirmPassword);
    formdata.append('name', registrationData?.name);
    formdata.append('regNo', registrationData?.regNo);
    formdata.append('rollNo', registrationData?.rollNo);
    formdata.append('year', registrationData?.year);
    formdata.append('branch', registrationData?.branch);
    formdata.append('gender', registrationData?.gender);
    formdata.append('pwd', registrationData?.pwd);
    formdata.append('community', registrationData?.community);
    formdata.append('aadhaarNumber', registrationData?.aadhaarNumber);
    formdata.append('dob', registrationData?.dob);
    formdata.append('bloodGroup', registrationData?.bloodGroup);
    formdata.append('fatherName', registrationData?.fatherName);
    formdata.append('motherName', registrationData?.motherName);
    formdata.append('phone', registrationData?.phone);
    formdata.append('parentsPhone', registrationData?.parentsPhone);
    formdata.append('emergencyPhone', registrationData?.emergencyPhone);
    formdata.append('address', registrationData?.address);
    formdata.append('hostelBlockId', selectedBlock);
    formdata.append('cotId', selectedCot);
    formdata.append('image', registrationData?.image);
    if (registrationData?.instituteFeeReceipt) {
      formdata.append('instituteFeeReceipt', registrationData.instituteFeeReceipt);
    }
    formdata.append('hostelFeeReceipt', registrationData?.hostelFeeReceipt);
    formdata.append('paymentMode', registrationData?.paymentMode);
    formdata.append('paymentDate', registrationData?.paymentDate);
    formdata.append('amountPaid', registrationData?.amountPaid);
    const response = await dispatch(createStudentAccount(formdata, toast));
    if (response) {
      setModalVisible(false);
      await dispatch(setRegistrationStep(4));
    } else {
      toast('Refresh the page from the above icon to check if the room is already booked by someone else.', { icon: '⚠️' });
      setModalVisible(false);
    }
    setIsButtonDisabled(false);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {loading ? (
        <div>
          <span className="font-extrabold text-lg">Data Loading...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-2">
          {(!hostelBlocks || hostelBlocks.length === 0) ? (
            <div className="bg-[#ff928b] justify-center rounded-2xl mx-auto px-4 py-4">
              <span className="text-center text-base text-black font-extrabold block">
                No Hostel Blocks Alloted as per your Requirements.
              </span>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-5">
              <span className="font-semibold text-black text-base">Select Block :</span>
              <div className="flex flex-row flex-wrap gap-2 max-w-[70%]">
                {hostelBlocks?.map((hostel, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedBlock(hostel.id)}
                    className={`px-3 py-2 rounded-lg border ${
                      selectedBlock === hostel?.id ? 'bg-[#b5e48c] border-transparent' : 'bg-white border-black'
                    } font-bold`}
                    disabled={isButtonDisabled}
                  >
                    {hostel?.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {floorCount && (
            <div className="flex flex-row items-center gap-5">
              <span className="font-semibold text-black text-base">Select Floor :</span>
              <div className="flex flex-row flex-wrap gap-2 max-w-[70%]">
                {floorsArray?.map((floor, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFloor(floor?.id)}
                    className={`px-4 py-1 rounded-full border ${
                      selectedFloor === floor?.id ? 'bg-[#b5e48c] border-transparent' : 'bg-white border-black'
                    } font-bold`}
                    disabled={isButtonDisabled}
                  >
                    {floor?.id}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedBlock && selectedFloor !== null && (
            <div className="w-[90%] flex flex-row justify-end items-center mx-auto">
              <button type="button" disabled={isButtonDisabled} onClick={fetchRooms} className="text-[#003049] text-xl">
                &#x21bb;
              </button>
            </div>
          )}

          {(!floorRooms || floorRooms.length === 0) ? (
            <div className='w-full text-center'>
              <span className="text-red-600 text-center text-base font-semibold">No Rooms Are Present With This Requirements</span>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4 justify-center items-center">
              {floorRooms.map((room, index) => (
                <div
                  key={index}
                  className="w-[90%] border border-dashed border-black rounded-xl flex flex-col gap-4 justify-center items-center px-4 py-4"
                >
                  <span className="text-center font-extrabold text-lg text-[#1b263b]">Room {room?.roomNumber}</span>
                  <div className="flex flex-row flex-wrap gap-2 justify-center items-center">
                    {room.cots.map((cot, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectCot(cot, room)}
                        className={`border border-dotted border-black rounded-lg px-3 py-2 font-semibold text-base ${
                          selectedCot === cot?.id
                            ? 'bg-yellow-300'
                            : cot?.status === 'AVAILABLE'
                            ? 'bg-transparent'
                            : 'bg-gray-400'
                        }`}
                        disabled={cot?.status !== 'AVAILABLE' || isButtonDisabled}
                      >
                        Cot {cot?.cotNo}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 w-[90vw] max-w-md">
            <span className="text-lg text-gray-600 text-center">
              Verify your selected Room Details and submit your Application
            </span>
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold text-black">
                Block Name : <span className="font-normal">{submitDetails?.blockName}</span>
              </span>
              <span className="font-semibold text-black">
                Floor No : <span className="font-normal">{submitDetails?.floorNo}</span>
              </span>
              <span className="font-semibold text-black">
                Room No : <span className="font-normal">{submitDetails?.roomNo}</span>
              </span>
              <span className="font-semibold text-black">
                Cot No : <span className="font-normal">{submitDetails?.cotNo}</span>
              </span>
            </div>
            <div className="flex flex-row gap-4 w-full">
              <button
                disabled={isButtonDisabled}
                className={`flex-1 bg-[#76c893] py-2 rounded text-white font-bold ${isButtonDisabled ? 'opacity-50' : ''}`}
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                disabled={isButtonDisabled}
                className={`flex-1 bg-gray-500 py-2 rounded text-white font-bold ${isButtonDisabled ? 'opacity-50' : ''}`}
                onClick={cancelHandler}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAllotment;