import React from "react";

interface DropdownItemProps {
    icon: React.ComponentType<{ size?: number }>;
    title: string;
    onClick: () => void;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ icon: Icon, title, onClick }) => {
    return (
        <li
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer text-gray-700"
            onClick={onClick}
        >
            {Icon && <Icon size={18} />}
            <span>{title}</span>
        </li>
    );
};

export default DropdownItem;