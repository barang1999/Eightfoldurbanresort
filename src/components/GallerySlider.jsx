import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import GalleryModal from './GalleryModal';
import GalleryModalMobile from './GalleryModalMobile';

const NextArrow = ({ onClick }) => (
  <div
    className="slick-arrow slick-next z-20 right-6 md:right-10 top-1/2 transform -translate-y-1/2 absolute cursor-pointer"
    onClick={onClick}
  >
    <div className="w-8 h-8 rounded-full border border-[#a28e68] flex items-center justify-center bg-white opacity-50">
      <span className="text-black text-base font-light">{'>'}</span>
    </div>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="slick-arrow slick-prev z-20 left-6 md:left-10 top-1/2 transform -translate-y-1/2 absolute cursor-pointer"
    onClick={onClick}
  >
    <div className="w-8 h-8 rounded-full border border-[#a28e68] flex items-center justify-center bg-white opacity-50">
      <span className="text-black text-base font-light">{'<'}</span>
    </div>
  </div>
);

const images = [
  '/gallery1.jpg',
  '/gallery2.jpg',
  '/gallery3.jpg',
  '/gallery4.jpg'
];

const GallerySlider = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .slick-prev::before,
      .slick-next::before {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <div className="relative">
      <Slider {...settings}>
        {images.map((src, i) => (
          <div key={i}>
            <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-[500px] object-cover" />
          </div>
        ))}
      </Slider>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <button
          className="bg-white text-gray-800 px-6 py-2 rounded shadow-md"
          onClick={() => setIsModalOpen(true)}
        >
          See All Photos
        </button>
      </div>
      {typeof window !== 'undefined' && window.innerWidth < 768 ? (
        <GalleryModalMobile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      ) : (
        <GalleryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default GallerySlider;