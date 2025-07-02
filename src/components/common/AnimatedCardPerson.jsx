import React, { useState } from 'react';

const AnimatedCardPerson = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCard = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full md:w-[350px] border border-black rounded-xl bg-white my-4 shadow-lg overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 p-4">
        <img
          src={data.image}
          alt="person"
          className="w-20 h-20 object-cover rounded-full"
        />
        <div className="flex flex-col">
          <p className="text-black font-bold text-lg">{data.name}</p>
          <p className="text-gray-600 text-sm font-semibold">{data.designation}</p>
        </div>
      </div>

      {/* Details */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[400px]' : 'max-h-0'
        }`}
      >
        <div className="px-4 pb-6 flex flex-col gap-3 text-sm text-gray-700">
          <p className="text-gray-700 text-[15px] font-semibold">
            Full Name: <span className="text-black">{data.name}</span>
          </p>
          {data.email && (
            <p>
              Email:{' '}
              <a
                href={`mailto:${data.email}`}
                className="text-blue-600 underline"
              >
                {data.email}
              </a>
            </p>
          )}
          {data.phone && (
            <p>
              Phone:{' '}
              <a
                href={`tel:${data.phone}`}
                className="text-blue-600 underline"
              >
                {data.phone}
              </a>
            </p>
          )}
          {data.linkedIn && (
            <p>
              LinkedIn:{' '}
              <a
                href={data.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {data.linkedIn}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <div className="w-full">
        <button
          onClick={toggleCard}
          className="cursor-pointer w-full py-2 bg-[#415a77] text-white font-bold text-center rounded-b-xl hover:bg-[#33475b] transition"
        >
          {isExpanded ? 'Hide Info' : 'More Info'}
        </button>
      </div>
    </div>
  );
};

export default AnimatedCardPerson;
