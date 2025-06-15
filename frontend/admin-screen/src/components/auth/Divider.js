import React from 'react';

const Divider = () => {
  return (
    <div className="flex items-center my-4">
      <div className="flex-grow h-px bg-gray-300"></div>
      <span className="px-4 text-sm text-gray-500">or</span>
      <div className="flex-grow h-px bg-gray-300"></div>
    </div>
  );
};

export default Divider;