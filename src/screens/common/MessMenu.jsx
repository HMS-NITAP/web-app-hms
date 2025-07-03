import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentSessionMessMenu } from '../../services/operations/CommonAPI';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const getCurrentSession = () => {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= 0 && currentHour < 10) {
    return 'Breakfast';
  } else if (currentHour >= 10 && currentHour < 15) {
    return 'Lunch';
  } else if (currentHour >= 15 && currentHour < 18) {
    return 'Snacks';
  } else {
    return 'Dinner';
  }
};

const MessMenu = () => {
  const [currentDay, setCurrentDay] = useState('');
  const [currentSession, setCurrentSession] = useState('');
  const [currentItems, setCurrentItems] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await dispatch(fetchCurrentSessionMessMenu(currentDay, currentSession, toast));
    setCurrentItems(response);
  };

  useEffect(() => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = days[now.getDay()];
    const session = getCurrentSession();

    setCurrentDay(currentDayName);
    setCurrentSession(session);
  }, []);

  useEffect(() => {
    if (currentDay && currentSession) {
      fetchData();
    }
  }, [currentDay, currentSession]);

  const navigateToMenu = () => {
    navigate('/detailed-mess-menu');
  };

  return (
    <div className="w-full h-full flex flex-col items-center py-6 px-4 space-y-4">
      <h1 className="text-2xl font-bold text-black">Today's Menu</h1>
      <p className="text-lg font-semibold text-gray-700">{currentDay}</p>
      <p className="text-lg font-semibold text-gray-700">{currentSession}</p>

      {currentItems && (
        <div className="mt-4 md:w-[70%] w-full flex md:flex-row flex-col gap-[2rem] justify-center items-center flex-wrap">
          {currentItems.map((item, index) => (
            <div key={index} className="bg-green-100 md:w-[200px] w-[90%] text-center font-semibold rounded-lg p-3 text-gray-800 shadow-sm">
              {item}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={navigateToMenu}
        className="mt-6 cursor-pointer bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 text-white px-6 py-3 rounded-lg font-semibold"
      >
        View Full Menu
      </button>
    </div>
  );
};

export default MessMenu;
