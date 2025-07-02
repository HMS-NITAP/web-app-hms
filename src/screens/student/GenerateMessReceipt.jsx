import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchMessHallsAndStudentGender, generateMessSessionReceipt } from '../../services/operations/StudentAPI';
import MainButton from '../../components/common/MainButton';
import { useNavigate } from 'react-router-dom';

const GenerateMessReceipt = ({ }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.Auth);

  const [messHalls, setMessHalls] = useState(null);
  const [selectedMessHallName, setSelectedMessHallName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [displaySession, setDisplaySession] = useState('');

  const findSession = () => {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' };
    const localDate = now.toLocaleDateString('en-CA', options).split('/').reverse().join('-');

    setCurrentDate(localDate);
    setSessionDate(localDate);

    const hour = now.getHours();
    if (hour < 10) setDisplaySession('Breakfast');
    else if (hour < 15) setDisplaySession('Lunch');
    else if (hour < 18) setDisplaySession('Snacks');
    else setDisplaySession('Dinner');
  };

  const fetchData = async () => {
    const response = await dispatch(fetchMessHallsAndStudentGender(token, toast));
    if (response) {
      const filtered = response.messHalls.filter(
        (mess) => mess.gender === response.studentDetails.gender
      );
      setMessHalls(filtered);
      setLoading(false);
    }
  };

  useEffect(() => {
    findSession();
    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedMessHallName) {
      toast.error('Select a Mess Hall');
      return;
    }
    if (!sessionDate || !displaySession) {
      toast.error('Something went wrong with date/session');
      return;
    }

    setIsButtonDisabled(true);

    const formData = new FormData();
    formData.append('session', displaySession);
    formData.append('date', sessionDate);
    formData.append('messHallName', selectedMessHallName);

    const response = await dispatch(generateMessSessionReceipt(formData, token, toast));
    if (response) {
      navigate('/student/mess-receipt-history');
    }

    setIsButtonDisabled(false);
  };

  return (
    <div className="w-full px-4 py-6 flex flex-col items-center">
      {loading ? (
        <p className="text-black font-bold text-center text-lg">Please Wait...</p>
      ) : (
        <div className="w-full max-w-xl flex flex-col gap-6">
          <div className="bg-green-100 p-4 rounded-lg text-center text-black text-sm">
            Please select the Mess Hall where you would like to have your meals for this session. Once the receipt is generated, you will be able to avail meals for this session only at your selected Mess Hall, and only once.
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-black font-medium">
              Mess Hall <span className="text-red-500 text-sm">*</span>
            </label>
            <select
              value={selectedMessHallName}
              onChange={(e) => setSelectedMessHallName(e.target.value)}
              className="border border-gray-400 rounded px-4 py-2 text-black"
            >
              <option value="">Select Mess Hall</option>
              {messHalls?.map((hall, index) => (
                <option key={index} value={hall.hallName}>
                  {hall.hallName}
                </option>
              ))}
            </select>
          </div>

          <div className="text-black text-sm space-y-1">
            <p>
              <strong>Date:</strong> <span className="text-gray-600">{currentDate}</span>
            </p>
            <p>
              <strong>Session:</strong> <span className="text-gray-600">{displaySession}</span>
            </p>
          </div>

          <MainButton
            text="Generate"
            isButtonDisabled={isButtonDisabled}
            onPress={handleGenerate}
          />
        </div>
      )}
    </div>
  );
};

export default GenerateMessReceipt;
