import React, { useState } from 'react';

const AnimatedCardHostelBlock = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleCard = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`w-full max-w-xl border border-black rounded-xl bg-white overflow-hidden shadow-lg transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-40'} relative`}>
      {/* Header */}
      <div className="flex items-center gap-4 p-3">
        {/* Image */}
        <div className="w-20 h-20 rounded-full overflow-hidden flex justify-center items-center relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover"
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Header Text */}
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-gray-700">Name: <span className="text-black">{data.name}</span></h2>
          <p className="text-gray-600 font-semibold">Room Type: <span className="text-black">{data.roomType}</span></p>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-3 py-4">
          <p className="text-base font-bold text-[#051923]">Capacity: <span className="font-bold">{data.capacity} students</span></p>
          <p className="text-base font-bold text-[#051923]">Floor Count: <span className="font-bold">{data.floorCount === "2" ? "G+2" : "G+4"}</span></p>
          <p className="text-base font-semibold text-black">Year Assigned to: <span className="font-medium">{data.year}</span></p>

          {/* Wardens */}
          {data?.wardens?.length === 0 ? (
            <p className="text-center font-bold text-[#c1121f] mt-2">No Warden Assigned</p>
          ) : (
            <div className="mt-3">
              <p className="text-lg font-extrabold text-[#14213d] mb-2">Warden(s):</p>
              {data.wardens.map((warden, index) => (
                <p key={index} className="text-base font-bold text-[#003554]">
                  {index + 1}) {warden.name} (+91 {warden.phone})
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <div className="absolute bottom-0 left-0 w-full">
        <button
          onClick={toggleCard}
          className="w-full bg-[#415a77] text-white font-bold py-2 rounded-b-xl hover:bg-[#324c6e] transition"
        >
          {isExpanded ? 'Hide Info' : 'More Info'}
        </button>
      </div>
    </div>
  );
};

export default AnimatedCardHostelBlock;
