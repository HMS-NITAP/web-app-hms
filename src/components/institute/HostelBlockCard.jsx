import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaLinkedin } from 'react-icons/fa';

const HostelBlockCard = ({ data }) => {
  const [isTextActive, setIsTextActive] = useState(false);

  const handleToggleView = () => {
    setIsTextActive(!isTextActive);
  };

  return (
    <div className="w-full max-w-xl border border-black rounded-xl bg-white overflow-hidden shadow-lg relative">
      <img
        src={data?.image}
        alt={data?.blockName}
        className="w-full h-56 object-cover"
      />

      {!isTextActive && (
        <div className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-black">{data?.blockName}</h2>
            <p className="text-black font-medium">Room Type: {data?.roomType}</p>
            <p className="text-black font-medium">Capacity: {data?.capacity}</p>
          </div>
          <button
            onClick={handleToggleView}
            className="self-end text-blue-700 font-bold hover:underline"
          >
            Know More...
          </button>
        </div>
      )}

      {isTextActive && (
        <div className="absolute top-0 left-0 w-full h-full bg-white p-5 overflow-y-auto z-10">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-black">{data?.blockName}</h2>
              <p className="text-black font-medium">Room Type: {data?.roomType}</p>
              <p className="text-black font-medium">Capacity: {data?.capacity}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black">Warden Contact:</h3>
              <p className="text-gray-700">{data?.wardenName}</p>
              <p className="text-black">
                Phone:{' '}
                <a
                  href={`tel:${data?.wardenPhone}`}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <FaPhone /> {data?.wardenPhone}
                </a>
              </p>
              <p className="text-black">
                Email:{' '}
                <a
                  href={`mailto:${data?.wardenEmail}`}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <FaEnvelope /> {data?.wardenEmail}
                </a>
              </p>
              {data?.linkedIn && (
                <p className="text-black">
                  LinkedIn:{' '}
                  <a
                    href={data?.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FaLinkedin /> {data?.linkedIn}
                  </a>
                </p>
              )}
            </div>

            <div>
              <p className="text-black text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque imperdiet
                ultricies felis, sit amet commodo orci. Suspendisse potenti. Sed venenatis ligula
                eu nisl convallis, vitae euismod odio accumsan. Donec eget dignissim purus. Cras
                tincidunt metus et risus dictum, ut hendrerit sapien pharetra. Nullam auctor lectus
                ac arcu gravida, nec elementum lacus posuere. Nam vehicula lacus et ligula interdum,
                et posuere nunc luctus. Integer vulputate ligula nec velit ultricies, id viverra
                tortor volutpat. Aliquam erat volutpat. Phasellus dapibus justo non dui volutpat,
                nec fermentum lacus cursus. Ut a sagittis est. Vivamus et ipsum felis. Morbi vitae
                ante sit amet leo cursus pretium a ut nisl.
              </p>
            </div>

            <button
              onClick={handleToggleView}
              className="self-end text-red-600 font-bold hover:underline"
            >
              Know Less...
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelBlockCard;
