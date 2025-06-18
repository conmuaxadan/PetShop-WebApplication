import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

const SocialLoginButton = ({
  provider, 
  icon: Icon, 
  onClick 
}) => {
  const bgColor = provider === 'google' ? 'bg-white' : 'bg-[#1877F2]';
  const textColor = provider === 'google' ? 'text-gray-700' : 'text-white';
  const borderColor = provider === 'google' ? 'border-gray-300' : 'border-[#1877F2]';
  const hoverBg = provider === 'google' ? 'hover:bg-gray-50' : 'hover:bg-[#166FE5]';
  
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-full px-4 py-2.5 ${bgColor} ${textColor} ${borderColor} ${hoverBg} border rounded-lg transition-all duration-200 font-medium`}
    >
      <Icon className="w-5 h-5 mr-2" />
      <span>Continue with {providerName}</span>
    </button>
  );
};

export default SocialLoginButton;