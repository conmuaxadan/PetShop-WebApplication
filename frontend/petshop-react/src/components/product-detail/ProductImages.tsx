import React from 'react';

interface ProductImagesProps {
  images: string[];
  currentImageIndex: number;
  isOrganic: boolean;
  productName: string;
  onImageChange: (index: number) => void;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  images,
  currentImageIndex,
  isOrganic,
  productName,
  onImageChange,
}) => {
  return (
    <div className="product-images">
      <div className="main-image mb-4 rounded-lg overflow-hidden bg-gray-100 h-96 relative">
        <img
          src={images[currentImageIndex]}
          alt={productName}
          className="w-full h-full object-cover object-top"
        />
        {isOrganic && (
          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            Hữu cơ
          </div>
        )}
      </div>
      <div className="thumbnails grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`h-24 rounded-md overflow-hidden cursor-pointer ${
              currentImageIndex === index ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onImageChange(index)}
          >
            <img
              src={image}
              alt={`${productName} - ảnh ${index + 1}`}
              className="w-full h-full object-cover object-top"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;