import React from "react";
import { UserPlus, LogIn, User, ClipboardList, LogOut } from "lucide-react";
import DropdownItem from "./DropdownItem";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const DropdownAccount: React.FC = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    return (
        <div className="dropdown relative">
            <ul
                tabIndex={0}
                className="dropdown-content absolute right-0 mt-2 w-52 bg-white rounded-md border border-gray-300 p-2 z-50"
            >
                {user ? (
                    <div>
                        <div className="flex items-center space-x-3 p-2">
                            <img
                                src={
                                    user.avatar ||
                                    "https://tse4.mm.bing.net/th?id=OIP.ggX8e6U3YzyhPvp8qGZtQwHaHa&pid=Api&P=0&h=180"
                                }
                                alt="Avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="font-bold text-black truncate max-w-[140px]">{user.username}</p>
                                <p className="text-sm text-gray-700 truncate max-w-[140px]">{user.email}</p>
                            </div>
                        </div>
                        <DropdownItem icon={User} title="Hồ sơ" onClick={() => navigate("/profile")} />
                        <DropdownItem
                            icon={ClipboardList}
                            title="Lịch sử đặt hàng"
                            onClick={() => navigate("/order-history")}
                        />
                        <DropdownItem
                            icon={LogOut}
                            title="Đăng xuất"
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                        />
                    </div>
                ) : (
                    <div>
                        <DropdownItem icon={LogIn} title="Đăng nhập" onClick={() => navigate("/login")} />
                        <DropdownItem icon={UserPlus} title="Đăng ký" onClick={() => navigate("/register")} />
                    </div>
                )}
            </ul>
        </div>
    );
};

export default DropdownAccount;