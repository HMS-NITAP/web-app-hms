import React, { useState } from 'react';

const AnimatedCardPerson = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCard = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`w-full border border-black rounded-lg bg-white shadow-md overflow-hidden transition-all duration-200 ${
        isExpanded ? 'h-auto' : 'h-[140px]'
      } relative mb-4`}
    >
      {/* Header Section */}
      <div className="flex items-center p-3 gap-3">
        <img
          src={data.image}
          alt={data.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-black">{data.name}</h3>
          <p className="text-gray-600 text-sm font-medium">{data.designation}</p>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 py-3 flex flex-col gap-2 text-gray-700 text-[16px]">
          <p><span className="font-semibold text-black">Full Name:</span> {data.name}</p>

          {data.email && (
            <p>
              <span className="font-semibold text-black">Email:</span>{' '}
              <a href={`mailto:${data.email}`} className="text-blue-600 underline">
                {data.email}
              </a>
            </p>
          )}

          {data.phone && (
            <p>
              <span className="font-semibold text-black">Phone:</span>{' '}
              <a href={`tel:${data.phone}`} className="text-blue-600 underline">
                {data.phone}
              </a>
            </p>
          )}

          {data.linkedIn && (
            <p>
              <span className="font-semibold text-black">LinkedIn:</span>{' '}
              <a href={data.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {data.linkedIn}
              </a>
            </p>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <div className="absolute bottom-0 w-full">
        <button
          onClick={toggleCard}
          className="w-full bg-[#415a77] text-white py-2 text-sm font-bold rounded-b-lg"
        >
          {isExpanded ? 'Hide Info' : 'More Info'}
        </button>
      </div>
    </div>
  );
};

export default AnimatedCardPerson;
