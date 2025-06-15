import React from 'react';



interface DescriptionProps {
  product:any;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Description: React.FC<DescriptionProps> = ({ product, activeTab, onTabChange }) => {
  return (
    <div className="border-t border-gray-200">
      <div className="flex border-b border-gray-200">
        <button
          className={`px-6 py-4 font-medium text-sm focus:outline-none whitespace-nowrap cursor-pointer ${
            activeTab === 'description'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('description')}
        >
          Mô tả
        </button>
        <button
          className={`px-6 py-4 font-medium text-sm focus:outline-none whitespace-nowrap cursor-pointer ${
            activeTab === 'info'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('info')}
        >
          Thông tin sản phẩm
        </button>
        <button
          className={`px-6 py-4 font-medium text-sm focus:outline-none whitespace-nowrap cursor-pointer ${
            activeTab === 'guide'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('guide')}
        >
          Hướng dẫn
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="prose max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Thương hiệu</h3>
                <p className="text-gray-700">{product.brand}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Xuất xứ</h3>
                <p className="text-gray-700">{product.origin}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Danh mục</h3>
                <p className="text-gray-700">{product.category}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Đóng gói</h3>
                <p className="text-gray-700">{product.packaging}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="prose max-w-none">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cách sử dụng</h3>
              <p className="text-gray-700">{product.usage}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Cách bảo quản</h3>
              <p className="text-gray-700">{product.storage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Description;