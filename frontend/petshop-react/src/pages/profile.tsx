import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileService from '../services/profile-service';
import { toast } from 'react-toastify';
import NotificationService from "../services/notification-service.tsx";

interface Profile {
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
  postalCode: string;
  avatar?: any;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {

        const profileData = await ProfileService.getMyProfile();
        if (profileData) {
          setProfile({
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            memberSince: profileData.createAt || new Date().toLocaleDateString('en-US'),
            province: profileData.address?.province || '',
            district: profileData.address?.district || '',
            ward: profileData.address?.ward || '',
            hamlet: profileData.address?.hamlet || '',
            address: profileData.address?.address || '',
            postalCode: profileData.address?.postalCode || '',
            avatar: profileData.avatar || '', // Added avatar
          });
        }
      } catch (error) {
        toast.error('Không thể tải thông tin hồ sơ.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string | File) => {
    if (profile) {
      setProfile((prev) => prev && { ...prev, [field]: value });
    }
  };

  const toggleEdit = () => {
    setEditMode((prev) => !prev);
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user) {
        toast.error('Vui lòng đăng nhập để cập nhật hồ sơ.');
        return;
      }

      const formData = new FormData();
      formData.append('firstName', profile.firstName);
      formData.append('lastName', profile.lastName);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      if (profile.avatar instanceof File) {
        formData.append('avatar', profile.avatar);
      }

      const addressData = {
        province: profile.province,
        district: profile.district,
        ward: profile.ward,
        hamlet: profile.hamlet,
        address: profile.address,
        postalCode: profile.postalCode,
      };

      await Promise.all([
        ProfileService.updateProfile(user.id_user, formData),
        ProfileService.updateAddress(user.id_user, addressData),
      ]);

      setEditMode(false);
      toast.success('Thông tin đã được lưu!');
    } catch (error) {
      toast.error('Lỗi khi lưu thông tin hồ sơ.');
      console.error(error);
    }
  };
  const handleSendPhoneOtp = async () => {
    if (!profile) return;
    const phoneWithPrefix = `+84${profile.phone.replace(/^\+84/, '')}`;
    await NotificationService.sendPhoneOtp(phoneWithPrefix);
  };

  const handleVerifyPhoneOtp = async (otp: string) => {
    if (!profile  || otp.length !== 6) return;
    const phoneWithPrefix = `+84${profile.phone.replace(/^\+84/, '')}`;
     await NotificationService.verifyPhoneOtp(phoneWithPrefix, otp);

  };

  const handleSendEmailOtp = async () => {
    if (!profile) return;
    await NotificationService.sendEmailOtp(profile.email);
  };

  const handleVerifyEmailOtp = async (otp: string) => {
    if (!profile || otp.length !== 6) return;
    await NotificationService.verifyEmailOtp(profile.email, otp);

  };
  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Không tìm thấy thông tin hồ sơ.</div>;

  return (
      <div>
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg mt-12 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Thông tin cá nhân</h2>
            <div className="flex space-x-3">
              {isEditMode ? (
                  <>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 border-none bg-primary text-white rounded hover:bg-primary transition focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      Lưu
                    </button>
                    <button
                        onClick={toggleEdit}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      Hủy
                    </button>
                  </>
              ) : (
                  <button
                      onClick={toggleEdit}
                      className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition focus:ring-2 focus:ring-primary"
                  >
                    Chỉnh sửa
                  </button>
              )}
            </div>
          </div>

          <ProfileCard profile={profile} isEditMode={isEditMode} onChange={handleChange}
                       onSendPhoneOtp={handleSendPhoneOtp}
                       onVerifyPhoneOtp={handleVerifyPhoneOtp}
                       onSendEmailOtp={handleSendEmailOtp}
                       onVerifyEmailOtp={handleVerifyEmailOtp}/>
        </div>
      </div>
  );
};

export default Profile;