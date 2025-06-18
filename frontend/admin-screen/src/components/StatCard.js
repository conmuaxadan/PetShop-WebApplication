import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="p-4 bg-green-50 rounded-full">
          <Icon className="w-6 h-6 text-green-600" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;