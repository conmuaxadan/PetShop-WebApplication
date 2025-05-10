import React, { useState } from 'react';
import AddressCard from './AddressCard';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    memberSince: string;
    province: string;
    district: string;
    ward: string;
    hamlet: string;
    address: string;
    postalCode?: string;
    avatar?: any;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
}

interface ProfileCardProps {
    profile: ProfileData;
    isEditMode: boolean;
    onChange: (field: keyof ProfileData, value: string | File) => void;
    onSendPhoneOtp: () => void;
    onVerifyPhoneOtp: (otp: string) => void;
    onSendEmailOtp: () => void;
    onVerifyEmailOtp: (otp: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
                                                     profile,
                                                     isEditMode,
                                                     onChange,
                                                     onSendPhoneOtp,
                                                     onVerifyPhoneOtp,
                                                     onSendEmailOtp,
                                                     onVerifyEmailOtp,
                                                 }) => {
    const [phoneOtp, setPhoneOtp] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [otpRequested, setOtpRequested] = useState({ phone: false, email: false });
    const [isSendingOtp, setIsSendingOtp] = useState({ phone: false, email: false });
    const [isVerifyingOtp, setIsVerifyingOtp] = useState({ phone: false, email: false });

    const handleAddressChange = (field: string, value: string) => {
        onChange(field as keyof ProfileData, value);
    };

    const handleSendOtp = async (type: 'phone' | 'email') => {
        if (isSendingOtp[type]) return;
        setIsSendingOtp((prev) => ({ ...prev, [type]: true }));
        try {
            setOtpRequested((prev) => ({ ...prev, [type]: true }));
            if (type === 'phone') await onSendPhoneOtp();
            else await onSendEmailOtp();
        } finally {
            setIsSendingOtp((prev) => ({ ...prev, [type]: false }));
        }
    };

    const handleVerifyOtp = async (type: 'phone' | 'email', otp: string) => {
        if (otp.length !== 6 || isVerifyingOtp[type]) return;
        setIsVerifyingOtp((prev) => ({ ...prev, [type]: true }));
        try {
            if (type === 'phone') await onVerifyPhoneOtp(otp);
            else await onVerifyEmailOtp(otp);
            // Reset OTP state on success
            setOtpRequested((prev) => ({ ...prev, [type]: false }));
            if (type === 'phone') setPhoneOtp('');
            else setEmailOtp('');
        } finally {
            setIsVerifyingOtp((prev) => ({ ...prev, [type]: false }));
        }
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start mb-6">
                <div className="relative group">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                        {isEditMode ? (
                            <div className="flex flex-col items-center">
                                <img
                                    src={
                                        profile.avatar instanceof File
                                            ? URL.createObjectURL(profile.avatar)
                                            : profile.avatar || 'https://via.placeholder.com/100?text=Avatar'
                                    }
                                    alt="Avatar"
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) onChange('avatar', file);
                                    }}
                                    className="mt-1 text-xs"
                                />
                            </div>
                        ) : (
                            <img
                                src={profile.avatar || 'https://via.placeholder.com/100?text=Avatar'}
                                alt="Avatar"
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        )}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gray-100/10 blur-lg -z-10"></div>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {profile.firstName} {profile.lastName}
                    </h3>
                    <p className="text-gray-500 flex items-center">
                        <i className="ri-calendar-line mr-2"></i> Member since {profile.memberSince}
                    </p>
                </div>
            </div>

            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['lastName', 'firstName', 'email', 'phone'].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field === 'lastName'
                                    ? 'Last Name'
                                    : field === 'firstName'
                                        ? 'First Name'
                                        : field === 'email'
                                            ? 'Email'
                                            : 'Phone'}
                            </label>
                            <div className="flex items-center space-x-2">
                                {field === 'phone' ? (
                                    <div className="flex w-full">
                                        <span className="mt-1 px-2 py-1 border border-r-0 rounded-l-lg bg-gray-100 text-sm">+84</span>
                                        <input
                                            type="tel"
                                            value={profile.phone.replace(/^\+84/, '')}
                                            onChange={(e) => onChange('phone', `+84${e.target.value.replace(/^\+84/, '')}`)}
                                            disabled={!isEditMode}
                                            className={`mt-1 block w-full rounded-r-lg border px-2 py-1 text-sm shadow-sm ${
                                                isEditMode ? 'border-gray-300' : 'bg-gray-100 cursor-not-allowed'
                                            }`}
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type={field === 'email' ? 'email' : 'text'}
                                        value={profile[field as keyof ProfileData] || ''}
                                        onChange={(e) => onChange(field as keyof ProfileData, e.target.value)}
                                        disabled={!isEditMode}
                                        className={`mt-1 block w-full rounded-lg border px-2 py-1 text-sm shadow-sm flex-1 ${
                                            isEditMode ? 'border-gray-300' : 'bg-gray-100 cursor-not-allowed'
                                        }`}
                                    />
                                )}
                                {(field === 'email' || field === 'phone') && (
                                    <div className="flex flex-col">
                                        {field === 'email' && profile.isEmailVerified || field === 'phone' && profile.isPhoneVerified ? (
                                            <span className="text-green-500 text-sm flex items-center">
                        <CheckCircleIcon className="w-4 h-4 mr-1" /> Đã xác thực
                      </span>
                                        ) : (
                                            isEditMode && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSendOtp(field as 'phone' | 'email')}
                                                        disabled={isSendingOtp[field]}
                                                        className={`px-2 py-1 text-xs rounded text-white flex items-center ${
                                                            isSendingOtp[field] ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                                        }`}
                                                    >
                                                        {isSendingOtp[field] ? (
                                                            <svg className="animate-spin h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : null}
                                                        Gửi OTP
                                                    </button>
                                                    {otpRequested[field] && (
                                                        <div className="mt-1 flex flex-col space-y-1">
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Nhập OTP"
                                                                    value={field === 'phone' ? phoneOtp : emailOtp}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        if (field === 'phone') setPhoneOtp(value);
                                                                        else setEmailOtp(value);
                                                                        if (value.length === 6) {
                                                                            handleVerifyOtp(field as 'phone' | 'email', value);
                                                                        }
                                                                    }}
                                                                    className="px-2 py-1 border rounded text-sm"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleVerifyOtp(field as 'phone' | 'email', field === 'phone' ? phoneOtp : emailOtp)}
                                                                disabled={isVerifyingOtp[field]}
                                                                className={`px-2 py-1 text-xs rounded text-white flex items-center ${
                                                                    isVerifyingOtp[field] ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                                                }`}
                                                            >
                                                                {isVerifyingOtp[field] ? (
                                                                    <svg className="animate-spin h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                ) : null}
                                                                Xác thực
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <AddressCard
                        province={profile.province}
                        district={profile.district}
                        ward={profile.ward}
                        hamlet={profile.hamlet}
                        address={profile.address}
                        postalCode={profile.postalCode}
                        isEditMode={isEditMode}
                        onChange={handleAddressChange}
                    />
                </div>
            </form>
        </div>
    );
};

export default ProfileCard;