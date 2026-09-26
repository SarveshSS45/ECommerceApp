import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductImageGallery = ({ productName, images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const primaryIndex = images.findIndex((x) => x.isPrimary);

    setSelectedIndex(primaryIndex >= 0 ? primaryIndex : 0);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[550px] rounded-xl border bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-lg">
          No Image Available
        </span>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  const changeImage = (index) => {
    setFade(true);

    setTimeout(() => {
      setSelectedIndex(index);
      setFade(false);
    }, 120);
  };

  const previousImage = () => {
    const index =
      selectedIndex === 0
        ? images.length - 1
        : selectedIndex - 1;

    changeImage(index);
  };

  const nextImage = () => {
    const index =
      selectedIndex === images.length - 1
        ? 0
        : selectedIndex + 1;

    changeImage(index);
  };

  return (
    <div className="flex gap-5 w-full">

      {/* Thumbnails */}

      <div className="flex flex-col gap-3">

        {images.map((image, index) => (

          <img
            key={image.id}
            src={`https://localhost:7172${image.imageUrl}`}
            alt=""
            onClick={() => changeImage(index)}
            className={`

              w-20
              h-20
              rounded-xl
              object-cover
              cursor-pointer
              border-2
              transition-all
              duration-200

              ${
                selectedIndex === index
                  ? "border-blue-600 scale-105 shadow-md"
                  : "border-gray-300 hover:border-blue-400 hover:scale-105"
              }

            `}
          />

        ))}

      </div>

      {/* Main Image */}

      <div className="relative flex-1">

        <div className="border rounded-xl bg-white shadow-md p-5 overflow-hidden">

          <img
            src={`https://localhost:7172${currentImage.imageUrl}`}
            alt={productName}
            className={`
              w-full
              h-[550px]
              object-contain
              transition-all
              duration-300
              hover:scale-110
              cursor-zoom-in

              ${fade ? "opacity-0" : "opacity-100"}
            `}
          />

        </div>

        {/* Previous */}

        {images.length > 1 && (
          <button
            onClick={previousImage}
            className="absolute left-4 top-1/2 -translate-y-1/2
                       bg-white shadow-lg rounded-full p-3
                       hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>
        )}

        {/* Next */}

        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2
                       bg-white shadow-lg rounded-full p-3
                       hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>
        )}

      </div>

    </div>
  );
};

export default ProductImageGallery;