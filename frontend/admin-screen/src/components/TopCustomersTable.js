import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom tick for XAxis to truncate long names
const CustomTick = ({ x, y, payload }) => {
    const name = payload.value;
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={-10}
                y={-5}
                dy={16}
                textAnchor="middle"
                fill="#6B7280"
                fontSize={12}
                transform="rotate(-45)"
            >
                {name.length > 10 ? `${name.slice(0, 10)}...` : name}
            </text>
        </g>
    );
};

// Formatter for VND with m (millions) and b (billions)
const formatVND = (value) => {
    if (value >= 1000_000_000) {
        const billions = value / 1_000_000_000;
        return `${billions.toFixed(1).replace(/\.0$/, '')}b`;
    } else if (value >= 1_000_000) {
        const millions = value / 1_000_000;
        return `${millions.toFixed(1).replace(/\.0$/, '')}m`;
    }
    return `${value.toLocaleString('vi-VN')}₫`;
};

const TopCustomersChart = ({ customers }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Top Khách Hàng Theo Chi Tiêu</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={customers}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 15, // Space for rotated labels
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            tick={<CustomTick />}
                            interval={0} // Show all labels
                        />
                        <YAxis
                            tick={{ fill: '#6B7280' }}
                            tickFormatter={formatVND}
                        />
                        <Tooltip
                            formatter={(value) => [formatVND(value), 'Tổng Chi Tiêu']}
                        />
                        <Bar dataKey="totalSpent" fill="#059669" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TopCustomersChart;