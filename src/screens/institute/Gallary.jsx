import React from 'react';
import image1 from '../../assets/gallary/img1.jpg';
import image2 from '../../assets/gallary/img2.jpg';
import image3 from '../../assets/gallary/img6.jpg';

const Gallery = () => {
  const images = [image1, image2, image3];

  return (
    <div className="w-full px-4 py-8 flex flex-wrap justify-center gap-6">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          loading="lazy"
          alt={`gallery-${index}`}
          className="w-[300px] object-contain rounded-xl shadow-md"
        />
      ))}
    </div>
  );
};

export default Gallery;
