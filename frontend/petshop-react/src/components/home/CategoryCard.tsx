import React from 'react';

interface CategoryCardProps {
    id_category?: number; // Optional, from JSON
    name: string;
    image: any;
    description?: string; // Optional, not in JSON
    bgColor?: string; // Optional, with default
}

const CategoryCard: React.FC<CategoryCardProps> = ({
                                                       id_category,
                                                       name,
                                                       image,
                                                       description = 'Khám phá các sản phẩm chất lượng cao cho thú cưng.', // Default description in Vietnamese
                                                       bgColor = 'bg-white', // Default to white background
                                                   }) => {
    return (
        <div
            className={`${bgColor} rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => e.key === 'Enter' && console.log(`Clicked category ${id_category || name}`)} // Example action
        >
            <div className="h-40 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover object-top"
                />
            </div>
            <div className="p-4">
                <h3 className="font-medium text-lg truncate">{name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
            </div>
        </div>
    );
};

export default CategoryCard;