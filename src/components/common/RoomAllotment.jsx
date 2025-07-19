import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchHostelBlockRooms, fetchHostelBlockNames } from '../../services/operations/CommonAPI';
import { setRegistrationStep } from '../../reducers/slices/AuthSlice';
import { createStudentAccount } from '../../services/operations/AuthAPI';
import { FiRefreshCcw } from 'react-icons/fi';
import MainButton from './MainButton';

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
        (block) => ((block?.gender === registrationData?.gender) && (parseInt(block?.year) === registrationData?.year))
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
    if (selectedBlock) fetchRooms();
  }, [selectedBlock]);

  useEffect(() => {
    if (!hostelBlockRooms) return;
    const filtered = hostelBlockRooms.filter((room) => room?.floorNumber === selectedFloor);
    setFloorRooms(filtered);
  }, [selectedFloor, hostelBlockRooms]);

  useEffect(() => {
    fetchHostelBlocks();
    setLoading(false);
  }, []);

  const selectCot = (cot, room) => {
    if (cot?.status === 'BOOKED' || cot?.status === 'BLOCKED') return;
    setSelectedCot(cot?.id);
    setSubmitDetails({
      ...submitDetails,
      cotNo: cot?.cotNo,
      roomNo: room?.roomNumber,
      floorNo: room?.floorNumber,
    });
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
    Object.entries(registrationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formdata.append(key, value);
    });
    formdata.append('hostelBlockId', selectedBlock);
    formdata.append('cotId', selectedCot);

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
        <div className="flex justify-center items-center mt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-black text-lg font-bold">Please Wait...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-2">
          {!hostelBlocks?.length ? (
            <div className="bg-[#ff928b] justify-center rounded-2xl mx-auto px-4 py-4">
              <span className="text-center text-base text-black font-extrabold block">
                No Hostel Blocks Alloted as per your Requirements.
              </span>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-5">
              <span className="font-semibold text-black text-base">Select Block :</span>
              <div className="flex flex-row flex-wrap gap-2 max-w-[70%]">
                {hostelBlocks?.map((hostel) => (
                  <button
                    key={hostel.id}
                    onClick={() => setSelectedBlock(hostel.id)}
                    className={`px-3 py-2 rounded-lg cursor-pointer border font-bold ${
                      selectedBlock === hostel?.id ? 'bg-[#b5e48c] border-transparent' : 'bg-white border-black hover:bg-[#caf0f8]'
                    }`}
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
                {floorsArray.map((floor) => (
                  <button
                    key={floor.id}
                    onClick={() => setSelectedFloor(floor?.id)}
                    className={`px-4 py-2 rounded-full cursor-pointer border font-bold ${
                      selectedFloor === floor?.id ? 'bg-[#b5e48c] border-transparent' : 'bg-white border-black hover:bg-[#caf0f8]'
                    }`}
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
              <button type="button" disabled={isButtonDisabled} onClick={fetchRooms} className="cursor-pointer hover:rotate-180 hover:bg-[#caf0f8] transition-all duration-200 text-[#003049] text-xl p-[0.4rem] rounded-2xl border border-black">
                <FiRefreshCcw />
              </button>
            </div>
          )}

          {!floorRooms?.length ? (
            <div className='w-full text-center'>
              <span className="text-red-600 text-base font-semibold">No Rooms Are Present With This Requirements</span>
            </div>
          ) : (
            <div className="w-full flex md:flex-row flex-wrap flex-col gap-[1rem] justify-center items-center">
              {floorRooms.map((room, index) => (
                <div
                  key={index}
                  className="md:w-[24%] w-full border border-dashed border-black rounded-xl flex flex-col gap-4 justify-center items-center px-4 py-4"
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
                            ? 'bg-transparent hover:bg-[#caf0f8] transition-all duration-200 cursor-pointer'
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

      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-6 md:w-full w-[90%] max-w-md flex flex-col gap-[1rem]" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
            <div className="text-[1rem] bg-green-100 p-[0.5rem] rounded-[1rem] text-black font-semibold text-center">
              Please verify the selected hostel cot booking details provided below carefully. Once submitted, the booking cannot be changed, and no requests for modifications or reassignments will be entertained under any circumstances.
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold text-black">Block Name : <span className="font-normal">{submitDetails?.blockName}</span></span>
              <span className="font-semibold text-black">Floor No : <span className="font-normal">{submitDetails?.floorNo}</span></span>
              <span className="font-semibold text-black">Room No : <span className="font-normal">{submitDetails?.roomNo}</span></span>
              <span className="font-semibold text-black">Cot No : <span className="font-normal">{submitDetails?.cotNo}</span></span>
            </div>
            <div className="flex flex-row gap-[2rem] w-full justify-center items-center">
              <MainButton text={"Submit"} onPress={handleSubmit} isButtonDisabled={isButtonDisabled} backgroundColor='bg-green-500' textColor='text-white' />
              <MainButton text={"Cancel"} onPress={cancelHandler} isButtonDisabled={isButtonDisabled} backgroundColor='bg-gray-300' textColor='text-black' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAllotment;
