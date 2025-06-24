import React from 'react';

const MainButton = ({
  text,
  textColor = 'text-black',
  backgroundColor = 'bg-yellow-400',
  onPress,
  isButtonDisabled = false
}) => {
  return (
    <button
      onClick={onPress}
      disabled={isButtonDisabled}
      className={`
        px-5 py-3 rounded-xl font-bold 
        flex justify-center items-center 
        transition-opacity duration-200
        ${backgroundColor} ${textColor}
        ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
      `}
    >
      {text}
    </button>
  );
};

export default MainButton;
