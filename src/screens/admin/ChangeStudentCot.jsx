import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCotsForChangeCotOption, swapOrExchangeCot } from '../../services/operations/AdminAPI';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ChangeStudentCot = () => {
  // For react-router-dom v6+
  const { currentCotId, userId } = useParams();
  const navigate = useNavigate();

  const [completeData, setCompleteData] = useState(null);
  const [selectedHostelBlock, setSelectedHostelBlock] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedHostelBlockRooms, setSelectedHostelBlockRooms] = useState(null);
  const [floorRooms, setFloorRooms] = useState(null);
  const [selectedCot, setSelectedCot] = useState({
    roomNo: null,
    floorNo: null,
    blockName: null,
    cotNo: null,
    status: null,
    changeToCotId: null,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [floorCount, setFloorCount] = useState(null);
  const floorsArray = floorCount !== null ? Array.from({ length: floorCount + 1 }, (_, index) => ({ id: index })) : [];

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  useEffect(() => {
    if (selectedHostelBlock) {
      setSelectedFloor(null);
      setFloorCount(null);
      setSelectedHostelBlockRooms(null);
      setFloorRooms(null);
      const selectedHostelBlockData = completeData?.filter((block) => block?.id === selectedHostelBlock);
      setSelectedCot({
        blockName: selectedHostelBlockData[0]?.name,
        cotNo: null,
        changeToCotId: null,
        floorNo: null,
        roomNo: null,
        status: null,
      });
      setSelectedHostelBlockRooms(selectedHostelBlockData[0]?.rooms);
      setFloorCount(parseInt(selectedHostelBlockData[0]?.floorCount));
    }
    // eslint-disable-next-line
  }, [selectedHostelBlock]);

  const fetchData = async () => {
    setFloorRooms(null);
    setSelectedCot({
      blockName: null,
      cotNo: null,
      changeToCotId: null,
      floorNo: null,
      roomNo: null,
      status: null,
    });
    setFloorCount(null);
    setSelectedFloor(null);
    setCompleteData(null);
    setSelectedHostelBlockRooms(null);
    setSelectedHostelBlock(null);
    if (!currentCotId || !userId) {
      toast.error('Data is Missing');
      return;
    }
    const response = await dispatch(fetchCotsForChangeCotOption(userId, token, toast));
    setCompleteData(response);
  };

  useEffect(() => {
    if (!selectedHostelBlockRooms || selectedFloor === null) return;
    const filterRooms = selectedHostelBlockRooms.filter((room) => room?.floorNumber === selectedFloor);
    setFloorRooms(filterRooms);
  }, [selectedFloor, selectedHostelBlockRooms]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [token, dispatch]);

  const cancelHandler = () => {
    setIsModalVisible(false);
    setSelectedCot((prevDetails) => ({
      ...prevDetails,
      changeToCotId: null,
      cotNo: null,
      roomNo: null,
      floorNo: null,
      status: null,
    }));
  };

  const selectCot = (cot, room) => {
    if (cot?.status === 'BLOCKED') {
      toast.error('Cannot Change BLOCKED Cot');
      return;
    }
    setSelectedCot((prevDetails) => ({
      ...prevDetails,
      changeToCotId: cot?.id,
      cotNo: cot?.cotNo,
      roomNo: room?.roomNumber,
      floorNo: room?.floorNumber,
      status: cot?.status,
    }));
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    setIsButtonDisabled(true);
    await dispatch(swapOrExchangeCot(currentCotId, selectedCot?.changeToCotId, token, toast));
    setIsModalVisible(false);
    setIsButtonDisabled(false);
    setSelectedCot({
      blockName: null,
      cotNo: null,
      changeToCotId: null,
      floorNo: null,
      roomNo: null,
      status: null,
    });
    navigate('/admin/manage-student-accounts');
    setIsButtonDisabled(false);
  };

  return (
    <div className="w-full flex flex-col justify-center items-start px-4 py-6 gap-4">
      {completeData &&
        (completeData?.length === 0 ? (
          <div className="text-center text-base font-medium text-gray-500">No Hostel Blocks Found</div>
        ) : (
          <div className="flex flex-row items-center gap-5">
            <span className="font-semibold text-black text-base">Select Block :</span>
            <div className="flex flex-row flex-wrap gap-2 max-w-[70%]">
              {completeData?.map((hostel, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedHostelBlock(hostel?.id)}
                  className={`px-3 py-2 rounded-lg border font-bold ${
                    selectedHostelBlock === hostel?.id ? 'bg-[#b5e48c] border-transparent' : 'bg-white border-black'
                  }`}
                  disabled={isButtonDisabled}
                >
                  {hostel?.name}
                </button>
              ))}
            </div>
          </div>
        ))}

      {completeData && floorCount && (
        <div className="flex flex-row items-center gap-5">
          <span className="font-semibold text-black text-base">Select Floor :</span>
          <div className="flex flex-row flex-wrap gap-2 max-w-[70%]">
            {floorsArray?.map((floor, index) => (
              <button
                key={index}
                onClick={() => setSelectedFloor(floor?.id)}
                className={`px-4 py-1 rounded-full border font-bold ${
                  selectedFloor === floor?.id ? 'bg-[#b5e48c] border-transparent' : 'bg-white border-black'
                }`}
                disabled={isButtonDisabled}
              >
                {floor?.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedHostelBlock && selectedFloor !== null && (
        <div className="w-full flex flex-row justify-end items-center mx-auto">
          <button
            type="button"
            disabled={isButtonDisabled}
            onClick={fetchData}
            className="text-[#003049] text-xl"
            title="Refresh"
          >
            &#x21bb;
          </button>
        </div>
      )}

      {selectedHostelBlock && selectedFloor !== null && floorRooms && (
        <div className="w-full flex flex-col gap-4 justify-center items-center">
          {floorRooms.map((room, index) => (
            <div
              key={index}
              className="w-full border border-dashed border-black rounded-xl flex flex-col gap-4 justify-center items-center px-4 py-4"
            >
              <span className="text-center font-extrabold text-lg text-[#1b263b]">
                Room {room?.roomNumber}
              </span>
              <div className="flex flex-col w-[90%] justify-center items-center flex-wrap gap-3">
                {room.cots.map((cot, idx) => (
                  <div
                    key={idx}
                    className="flex flex-row justify-between items-center gap-2 w-full mx-auto"
                  >
                    <div
                      className={`border border-dotted border-black rounded-lg px-3 py-2 w-[40%] text-center font-semibold text-base ${
                        selectedCot?.changeToCotId === cot?.id
                          ? 'bg-yellow-300'
                          : cot?.status === 'AVAILABLE'
                          ? 'bg-transparent'
                          : 'bg-gray-400'
                      }`}
                    >
                      Cot {cot?.cotNo} ({cot?.status})
                    </div>
                    <button
                      onClick={() => selectCot(cot, room)}
                      className={`flex flex-col justify-center items-center w-[40%] rounded-lg border border-black px-3 py-3 font-semibold ${
                        cot?.status === 'AVAILABLE'
                          ? 'bg-green-600 text-white'
                          : cot?.status === 'BOOKED'
                          ? 'bg-yellow-400 text-black'
                          : 'bg-red-600 text-white'
                      }`}
                      disabled={cot?.status === 'BLOCKED' || isButtonDisabled}
                    >
                      {cot?.status === 'BLOCKED'
                        ? '---'
                        : cot?.status === 'AVAILABLE'
                        ? 'Swap'
                        : 'Exchange'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 w-[90vw] max-w-md">
            <span className="text-lg text-gray-600 text-center">
              {selectedCot?.status === 'BOOKED'
                ? 'Swap the cot of selected student with the one at below mentioned cot'
                : 'Move the selected student to the below mentioned vacant cot'}
            </span>
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold text-black">
                Block Name : <span className="font-normal">{selectedCot?.blockName}</span>
              </span>
              <span className="font-semibold text-black">
                Floor No : <span className="font-normal">{selectedCot?.floorNo}</span>
              </span>
              <span className="font-semibold text-black">
                Room No : <span className="font-normal">{selectedCot?.roomNo}</span>
              </span>
              <span className="font-semibold text-black">
                Cot No : <span className="font-normal">{selectedCot?.cotNo}</span>
              </span>
            </div>
            <div className="flex flex-row gap-4 w-full">
              <button
                disabled={isButtonDisabled}
                className={`flex-1 bg-[#76c893] py-2 rounded text-white font-bold ${
                  isButtonDisabled ? 'opacity-50' : ''
                }`}
                onClick={handleSubmit}
              >
                {selectedCot?.status === 'AVAILABLE' ? 'Swap' : 'Move'}
              </button>
              <button
                disabled={isButtonDisabled}
                className={`flex-1 bg-gray-500 py-2 rounded text-white font-bold ${
                  isButtonDisabled ? 'opacity-50' : ''
                }`}
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

export default ChangeStudentCot;