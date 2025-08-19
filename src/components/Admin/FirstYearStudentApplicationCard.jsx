import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MainButton from '../common/MainButton'
import { fetchHostelBlockNames, fetchHostelBlockRooms } from '../../services/operations/CommonAPI';
import { FiRefreshCcw } from 'react-icons/fi';
import { allotRoomForStudentFirstYear } from '../../services/operations/AdminAPI';

const FirstYearStudentApplicationCard = ({ application, toast, token, fetchData }) => {
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const resetAllotmentState = () => {
      setSelectedBlock(null);
      setSelectedFloor(null);
      setSelectedCot(null);
      setHostelBlockRooms(null);
      setFloorRooms(null);
      setFloorCount(null);
      setSubmitDetails({ roomNo: null, floorNo: null, blockName: null, cotNo: null });
  };

  const acceptHandler = async () => {
    if(!selectedCot){
      toast.error("Please select a cot to allot the room.");
      return;
    }
    setIsButtonDisabled(true);
    let formdata = new FormData();
    formdata.append('cotId', selectedCot);
    formdata.append('studentId', application?.instituteStudent?.id);
    const response = await dispatch(allotRoomForStudentFirstYear(formdata, token, toast));
    if(response){
      const fileUrl = response; 
      window.open(fileUrl, "_blank");
    }
    fetchData();
    resetAllotmentState();
    setAcceptModalVisible(false);
    setIsButtonDisabled(false);
  };

  const floorsArray = floorCount !== null ? Array.from({ length: floorCount + 1 }, (_, index) => ({ id: index })) : [];
  
  const fetchHostelBlocks = async () => {
      const response = await dispatch(fetchHostelBlockNames(toast));
      if (response && response.length > 0) {
        const filteredBlocks = response.filter(
          (block) => ((block?.gender == application?.instituteStudent?.gender) && (parseInt(block?.year) == application?.instituteStudent?.year))
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
      // setModalVisible(true);
  };

  return (
    <div className={`md:w-[30%] w-full border 'border-black' rounded-xl p-4 flex flex-col gap-4 bg-white`}>
      <div className='w-full flex flex-col gap-[1rem] md:flex-row flex-wrap'>
        <p><strong>Name: </strong> {application?.instituteStudent?.name}</p>
        <p><strong>Roll No: </strong> {application?.instituteStudent?.rollNo}</p>
        <p><strong>Reg. No: </strong> {application?.instituteStudent?.regNo}</p>
        <p><strong>Branch: </strong> {application?.instituteStudent?.branch}</p>
        <p><strong>Year: </strong> {application?.instituteStudent?.year}</p>
        <p><strong>Gender: </strong> {application?.instituteStudent?.gender === "M" ? "Male" : "Female"}</p>
        <p><strong>Hostel Fee Amount Paid: </strong> {application?.instituteStudent?.amountPaid}</p>
      </div>
      <div className="flex justify-evenly mt-2">
        <MainButton text="ALLOT ROOM" backgroundColor="bg-green-500" textColor='text-white' onPress={() => setAcceptModalVisible(true)} />
      </div>

      {acceptModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm ">
          <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-6 w-[90%] max-h-[90vh] overflow-y-auto" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
            <h2 className="text-xl font-semibold text-center mb-4">Room Allotment</h2>
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
                </div>
            <div className="flex justify-evenly mt-4">
              <MainButton text="Allot" backgroundColor="bg-green-500" textColor='text-white' isButtonDisabled={isButtonDisabled} onPress={acceptHandler} />
              <MainButton 
                text="Cancel" 
                backgroundColor="bg-gray-300" 
                textColor='text-black' 
                isButtonDisabled={isButtonDisabled} 
                onPress={() => {
                    resetAllotmentState(); 
                    setAcceptModalVisible(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default FirstYearStudentApplicationCard