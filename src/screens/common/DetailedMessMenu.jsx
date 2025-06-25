import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDetailedMessMenu } from '../../services/operations/CommonAPI';
import { toast } from 'react-toastify';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const meals = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

const getCurrentSession = () => {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= 0 && currentHour < 10) return 'Breakfast';
  else if (currentHour >= 10 && currentHour < 15) return 'Lunch';
  else if (currentHour >= 15 && currentHour < 18) return 'Snacks';
  else return 'Dinner';
};

const DetailedMessMenu = () => {
  const [selectedDay, setSelectedDay] = useState(days[new Date().getDay()]);
  const [mealPeriod, setMealPeriod] = useState(getCurrentSession());
  const [detailedMessMenu, setDetailedMessMenu] = useState(null);
  const [menu, setMenu] = useState(null);

  const dispatch = useDispatch();

  const fetchData = async () => {
    const response = await dispatch(fetchDetailedMessMenu(toast));
    setDetailedMessMenu(response);
  };

  useEffect(() => {
    setSelectedDay(days[new Date().getDay()]);
    setMealPeriod(getCurrentSession());
    fetchData();
  }, []);

  useEffect(() => {
    if (detailedMessMenu && selectedDay && mealPeriod) {
      setMenu(detailedMessMenu[selectedDay]?.[mealPeriod]);
    }
  }, [selectedDay, mealPeriod, detailedMessMenu]);

  return (
    <div className="w-full flex flex-col items-center px-4 py-6 gap-8">
      {/* Day Selection */}
      <div className="w-full">
        <p className="text-lg font-bold text-black mb-2">Select Day :</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                selectedDay === day ? 'bg-blue-900 text-white' : 'bg-lime-300 text-black'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Selection */}
      <div className="w-full">
        <p className="text-lg font-bold text-black mb-2">Select Meal Session :</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {meals.map((meal, index) => (
            <button
              key={index}
              onClick={() => setMealPeriod(meal)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                mealPeriod === meal ? 'bg-blue-900 text-white' : 'bg-lime-300 text-black'
              }`}
            >
              {meal}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="w-full">
        <p className="text-lg font-semibold text-black mb-2">Menu Items :</p>
        <div className="space-y-3">
          {menu && menu.length > 0 ? (
            menu.map((menuItem, index) => (
              <div
                key={index}
                className="w-full bg-green-100 border border-black rounded-xl px-4 py-3 text-center text-base text-black font-medium shadow"
              >
                {menuItem}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No items available for this selection.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedMessMenu;
