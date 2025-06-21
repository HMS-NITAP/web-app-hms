import React from 'react';

const MainButton = ({ 
  text, 
  textColor = '#000000', 
  backgroundColor = '#ffb703', 
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
        ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
      `}
      style={{
        backgroundColor: backgroundColor,
        color: textColor
      }}
    >
      {text}
    </button>
  );
};

export default MainButton;
