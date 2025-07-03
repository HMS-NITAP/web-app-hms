import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCotsInRooms } from '../../services/operations/AdminAPI';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CotDetails = () => {
  const [cotDetails, setCotDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);
  const location = useLocation();
  const { roomId } = location.state;

  const fetchData = async () => {
    if (roomId) {
      setCotDetails(null);
      const response = await dispatch(fetchCotsInRooms(roomId, token, toast));
      setCotDetails(response);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roomId, token]);

  return (
    <div className="w-full flex flex-col items-center justify-start py-[2rem] px-4">
      {cotDetails && (
        <div className="w-full flex flex-col items-center justify-center gap-[0.5rem]">
          <h2 className="text-center text-black font-bold text-2xl">Room - {cotDetails.roomNumber}</h2>
          <p className="text-center text-black text-lg font-semibold">Floor - {cotDetails.floorNumber}</p>

          <div className="w-full flex md:flex-row flex-wrap flex-col items-center justify-center gap-6 mt-6">
            {cotDetails?.cots?.map((cot, index) => (
              <div key={index} className="md:w-[45%] w-full border border-black border-dashed rounded-xl p-4">
                <h3 className="text-center text-black font-medium text-lg">
                  Cot No: <span className="text-gray-600">{cot.cotNo} ({cot.status})</span>
                </h3>

                {cot.status !== 'AVAILABLE' && (
                  <div className="flex flex-col items-center gap-4 mt-5">
                    {cot?.student?.image && (
                      <>
                        {isLoading && <p className="text-blue-600">Loading Image...</p>}
                        <img
                          src={cot.student.image}
                          alt="Student"
                          className="w-24 h-24 rounded-full object-cover"
                          onLoadStart={() => setIsLoading(true)}
                          onLoad={() => setIsLoading(false)}
                        />
                      </>
                    )}

                    <div className="w-full text-center text-[1rem] font-medium text-black flex flex-col gap-1">
                      <p>Name: <span className="text-gray-700">{cot.student.name}</span></p>
                      <p>Reg No: <span className="text-gray-700">{cot.student.regNo}</span></p>
                      <p>Roll No: <span className="text-gray-700">{cot.student.rollNo}</span></p>
                      <p>Gender: <span className="text-gray-700">{cot.student.gender === 'M' ? 'Male' : 'Female'}</span></p>
                      <p>DOB: <span className="text-gray-700">{cot.student.dob}</span></p>
                      <p>Year: <span className="text-gray-700">{cot.student.year}</span></p>
                      <p>Branch: <span className="text-gray-700">{cot.student.branch}</span></p>
                      <p>Aadhaar Number: <span className="text-gray-700">{cot.student.aadhaarNumber}</span></p>
                      <p>Contact No: <span className="text-gray-700">{cot.student.phone}</span></p>
                      <p>Address: <span className="text-gray-700">{cot.student.address}</span></p>
                      <p className="mt-2">
                        Fee Receipt:{' '}
                        <a
                          href={cot.student.hostelFeeReceipt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-semibold underline"
                        >
                          CLICK HERE
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CotDetails;
