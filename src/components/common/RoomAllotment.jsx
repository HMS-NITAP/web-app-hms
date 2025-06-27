import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHostelBlockRooms, fetchHostelBlockNames } from '../../services/operations/CommonAPI';
import { createStudentAccount } from '../../services/operations/AuthAPI';
import { setRegistrationStep } from '../../reducers/slices/AuthSlice';
import toast from 'react-hot-toast';
import { FaArrowsRotate } from 'react-icons/fa6';

const RoomAllotmentWeb = () => {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [hostelBlockRooms, setHostelBlockRooms] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floorRooms, setFloorRooms] = useState([]);
  const [selectedCot, setSelectedCot] = useState(null);

  const [submitDetails, setSubmitDetails] = useState({ roomNo: null, floorNo: null, blockName: null, cotNo: null });
  const [floorCount, setFloorCount] = useState(null);

  const dispatch = useDispatch();
  const { registrationData } = useSelector((state) => state.Auth);

  useEffect(() => {
    const fetchBlocks = async () => {
      const response = await dispatch(fetchHostelBlockNames(toast));
      if (registrationData && response?.length > 0) {
        const filtered = response.filter(
          (block) => block.gender === registrationData.gender && block.year === registrationData.year
        );
        setHostelBlocks(filtered);
      }
      setLoading(false);
    };
    fetchBlocks();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedBlock) return;
      setIsButtonDisabled(true);
      setSelectedCot(null);
      const block = hostelBlocks.find((b) => b.id === selectedBlock);
      setFloorCount(parseInt(block.floorCount));
      const response = await dispatch(fetchHostelBlockRooms(selectedBlock, toast));
      setHostelBlockRooms(response);
      setSubmitDetails({ blockName: block.name, cotNo: null, floorNo: null, roomNo: null });
      setIsButtonDisabled(false);
    };
    fetchRooms();
  }, [selectedBlock]);

  useEffect(() => {
    if (!selectedFloor || !hostelBlockRooms.length) return;
    const filtered = hostelBlockRooms.filter((room) => room.floorNumber === selectedFloor);
    setFloorRooms(filtered);
  }, [selectedFloor, hostelBlockRooms]);

  const selectCot = (cot, room) => {
    if (cot.status === 'BOOKED' || cot.status === 'BLOCKED') return;
    setSelectedCot(cot.id);
    setSubmitDetails((prev) => ({
      ...prev,
      cotNo: cot.cotNo,
      roomNo: room.roomNumber,
      floorNo: room.floorNumber,
    }));
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!registrationData) return;
    setIsButtonDisabled(true);
    const formdata = new FormData();
    for (let key in registrationData) {
      if (key === 'image' || key === 'instituteFeeReceipt' || key === 'hostelFeeReceipt') {
        const file = registrationData[key]?.[0];
        if (file) formdata.append(key, file);
      } else {
        formdata.append(key, registrationData[key]);
      }
    }
    formdata.append('hostelBlockId', selectedBlock);
    formdata.append('cotId', selectedCot);

    const response = await dispatch(createStudentAccount(formdata, toast));
    if (response) {
      setModalVisible(false);
      await dispatch(setRegistrationStep(4));
    } else {
      toast.error('Refresh the page to check if the room is already booked.');
      setModalVisible(false);
    }
    setIsButtonDisabled(false);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {loading ? (
        <p className="font-bold text-lg">Data Loading...</p>
      ) : (
        <>
          {hostelBlocks.length === 0 ? (
            <div className="bg-red-200 rounded-xl px-6 py-4">
              <p className="text-center font-bold text-black">
                No Hostel Blocks Allotted as per your Requirements.
              </p>
            </div>
          ) : (
            <div className="w-full max-w-4xl">
              <p className="font-semibold text-black">Select Block :</p>
              <div className="flex flex-wrap gap-3 mt-2">
                {hostelBlocks.map((block, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedBlock(block.id)}
                    className={`px-3 py-2 rounded-lg border ${
                      selectedBlock === block.id ? 'bg-lime-300' : 'bg-white border-black'
                    }`}
                  >
                    {block.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {floorCount !== null && (
            <div className="w-full max-w-4xl">
              <p className="font-semibold text-black">Select Floor :</p>
              <div className="flex flex-wrap gap-3 mt-2">
                {Array.from({ length: floorCount + 1 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedFloor(i)}
                    className={`px-4 py-1 rounded-full border ${
                      selectedFloor === i ? 'bg-lime-300' : 'bg-white border-black'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedBlock && selectedFloor !== null && (
            <div className="w-[90%] flex justify-end">
              <button onClick={() => setSelectedBlock(selectedBlock)} disabled={isButtonDisabled}>
                <FaArrowsRotate className="text-blue-900 text-xl" />
              </button>
            </div>
          )}

          {floorRooms.length === 0 ? (
            <p className="text-red-500 font-semibold text-base">
              No Rooms Are Present With This Requirements
            </p>
          ) : (
            <div className="w-full flex flex-col gap-6 items-center">
              {floorRooms.map((room, index) => (
                <div
                  key={index}
                  className="w-[90%] border-dashed border-2 border-black rounded-xl px-6 py-4 flex flex-col items-center gap-4"
                >
                  <p className="text-lg font-bold text-slate-900">Room {room.roomNumber}</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {room.cots.map((cot, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectCot(cot, room)}
                        className={`px-3 py-2 rounded-lg border-dotted border ${
                          selectedCot === cot.id
                            ? 'bg-yellow-300'
                            : cot.status === 'AVAILABLE'
                            ? 'bg-white'
                            : 'bg-gray-300'
                        }`}
                      >
                        Cot {cot.cotNo}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {modalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                <p className="text-center font-semibold text-lg mb-4">
                  Verify Room Details and Submit
                </p>
                <div className="space-y-2 text-black">
                  <p>
                    <span className="font-bold">Block Name:</span> {submitDetails.blockName}
                  </p>
                  <p>
                    <span className="font-bold">Floor No:</span> {submitDetails.floorNo}
                  </p>
                  <p>
                    <span className="font-bold">Room No:</span> {submitDetails.roomNo}
                  </p>
                  <p>
                    <span className="font-bold">Cot No:</span> {submitDetails.cotNo}
                  </p>
                </div>
                <div className="flex justify-end mt-4 gap-4">
                  <button
                    disabled={isButtonDisabled}
                    onClick={handleSubmit}
                    className="bg-green-400 px-4 py-2 rounded-xl text-black font-bold disabled:opacity-50"
                  >
                    Submit
                  </button>
                  <button
                    disabled={isButtonDisabled}
                    onClick={() => setModalVisible(false)}
                    className="bg-red-300 px-4 py-2 rounded-xl text-black font-bold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RoomAllotmentWeb;
