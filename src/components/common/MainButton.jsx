import React from 'react';

const MainButton = ({
  text,
  textColor = 'text-black',
  backgroundColor = 'bg-yellow-400',
  onPress,
  isButtonDisabled = false,
  width = 'w-auto',
}) => {
  return (
    <button
      onClick={onPress}
      disabled={isButtonDisabled}
      className={`cursor-pointer
        px-5 py-3 rounded-xl font-bold 
        flex justify-center items-center 
        hover:scale-105 transition-all duration-200
        ${backgroundColor} ${textColor} ${width}
        ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
      `}
    >
      {text}
    </button>
  );
};

export default MainButton;
