import React, { useState } from 'react';

const AnimatedCardHostelBlock = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleCard = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full md:w-[350px] border border-black rounded-xl bg-white my-4 shadow-lg overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 p-4">
        <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent animate-spin rounded-full" />
            </div>
          )}
          <img
            src={data.image}
            alt="hostel"
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-gray-600 font-bold text-lg">
            Name : <span className="text-black font-semibold">{data.name}</span>
          </p>
          <p className="text-gray-600 font-semibold text-sm">
            Room Type : <span className="text-black">{data.roomType}</span>
          </p>
        </div>
      </div>

      {/* Details Section */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[500px]' : 'max-h-0'
        }`}
      >
        <div className="px-4 pb-6 flex flex-col gap-3">
          <p className="font-bold text-[#051923] text-base">
            Capacity : <span className="text-[#051923] font-bold">{data.capacity} students</span>
          </p>
          <p className="font-bold text-[#051923] text-base">
            Floor Count :{' '}
            <span className="text-[#051923] font-bold">{data.floorCount === '2' ? 'G+2' : 'G+4'}</span>
          </p>
          <p className="text-black font-semibold text-base">
            Year Assigned to :{' '}
            <span className="text-black font-medium text-sm">{data.year}</span>
          </p>
          

          {data?.wardens.length === 0 ? (
            <p className="text-center font-bold text-red-700 text-sm">No Warden Assigned</p>
          ) : (
            <div className="mt-2">
              <p className="text-[#14213d] text-base font-extrabold mb-2">Warden(s):</p>
              {data?.wardens.map((warden, index) => (
                <p key={index} className="text-[#003554] text-sm font-bold">
                  {index + 1}) {warden.name} ( +91 {warden.phone} )
                </p>
              ))}
            </div>
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

export default AnimatedCardHostelBlock;
