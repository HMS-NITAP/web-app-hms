import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchStudentMessReceipts } from '../../services/operations/StudentAPI';

const MessReceiptsHistory = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const [receipts, setReceipts] = useState([]);
  const [dateFormat, setDateFormat] = useState('');

  const findDate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' };
    setDateFormat(now.toLocaleDateString('en-CA', options).split('-').reverse().join('-'));
  };

  const fetchData = async () => {
    const response = await dispatch(fetchStudentMessReceipts(token, toast));
    setReceipts(response || []);
  };

  useEffect(() => {
    findDate();
    fetchData();
  }, []);

  return (
    <div className="w-full min-h-screen px-6 py-10 flex flex-col items-center bg-gray-50">
      <h2 className="text-xl font-semibold text-center text-black mb-6">Today's Mess Receipts</h2>
      <div className="w-full max-w-3xl flex flex-col gap-5">
        {receipts.length > 0 ? (
          receipts.map((receipt, index) => {
            const session = Object.keys(receipt)[0];
            const messHallName = receipt[session]?.messHallName;
            return (
              <div
                key={index}
                className="w-full border border-black rounded-lg p-5 bg-white shadow-sm"
              >
                <p className="text-base text-black font-medium mb-1">
                  Date: <span className="font-semibold">{dateFormat}</span>
                </p>
                <p className="text-base text-black font-medium mb-1">
                  Session: <span className="font-semibold">{session}</span>
                </p>
                <p className="text-base text-black font-medium">
                  Mess Hall: <span className="font-semibold">{messHallName}</span>
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">No receipts found for today.</p>
        )}
      </div>
    </div>
  );
};

export default MessReceiptsHistory;
