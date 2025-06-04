import React, { useState, useEffect, useRef } from "react";

const images = [
  "/assets/photo5.png",
  "/assets/photo4.png",
  "/assets/photo1.png",
  "/assets/photo2.png",
  "/assets/photo3.png",
];

const ImageFix = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const autoPlayRef = useRef(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // احتساب عرض الحاوية عند تغيير حجم الشاشة
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Nächster Slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Vorheriger Slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // AutoPlay-Funktion
  useEffect(() => {
    autoPlayRef.current = setInterval(nextSlide, 8000);
    return () => clearInterval(autoPlayRef.current);
  }, []);

  // Stoppe AutoPlay
  const stopAutoPlay = () => clearInterval(autoPlayRef.current);

  // Starte AutoPlay
  const startAutoPlay = () => {
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(nextSlide, 8000);
  };

  return (
    <>
      {/* Bildvorschau (Zoom) */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Zoomed"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg object-contain"
          />
        </div>
      )}

      {/* Karussell */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[1000px] mx-auto overflow-hidden mt-5 mb-5"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={src}
                alt={`Image ${index + 1}`}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setSelectedImage(src)}
                style={{ 
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '16/9', // يمكنك تعديل هذه النسبة حسب احتياجاتك
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all"
          onClick={() => {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
          }}
        >
          &#10094;
        </button>
        <button
          className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all"
          onClick={() => {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
          }}
        >
          &#10095;
        </button>
      </div>
    </>
  );
};

export default ImageFix;