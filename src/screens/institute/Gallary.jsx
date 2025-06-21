import React, { useEffect } from "react";
import img1 from "../../assets/gallary/img1.jpg";
import img2 from "../../assets/gallary/img2.jpg";
import img3 from "../../assets/gallary/img6.jpg";

const images = [img1, img2, img3];

const Gallery = () => {

  return (
    <div className="flex flex-wrap justify-center items-center gap-6 px-4 py-6 w-full">
      {images.map((img, index) => (
        <div key={index} className="w-full sm:w-[48%] md:w-[30%] flex justify-center">
          <img
            src={img}
            alt={`Gallery-${index}`}
            className="w-full h-[350px] object-contain rounded-xl"
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
