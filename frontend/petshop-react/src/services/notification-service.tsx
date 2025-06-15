import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { toast } from 'react-toastify';

interface NotificationResponse {
    status: number;
    data: {
        code?: number;
        message?: string;
    };
}

class NotificationService {
    private api: AxiosInstance;
    private readonly baseURL: string = 'http://localhost:8888/api/v1/notifications';

    constructor() {
        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        this.api.interceptors.request.use(
            (config) => {
                const token = this.getUserToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    private getUserToken(): string | null {
        try {
            const user: { token?: string } = JSON.parse(localStorage.getItem('user') || '{}');
            return user.token || null;
        } catch (error) {
            console.error('Failed to parse user from localStorage:', error);
            return null;
        }
    }

    private getUserId(): string | null {
        try {
            const user: { id_user?: string } = JSON.parse(localStorage.getItem('user') || '{}');
            return user.id_user || null;
        } catch (error) {
            console.error('Failed to parse user from localStorage:', error);
            return null;
        }
    }

    private showToast(message: string, type: 'success' | 'error' = 'error') {
        const toastOptions = { position: 'top-right' as const };
        if (type === 'success') {
            toast.success(message, toastOptions);
        } else {
            toast.error(message, toastOptions);
        }
    }

    async sendPhoneOtp(phone: string): Promise<boolean> {
        if (!phone || !/^\+?\d{10,15}$/.test(phone)) {
            this.showToast('Số điện thoại không hợp lệ!');
            return false;
        }
        try {
            const response: NotificationResponse = await this.api.post('/send-confirm-phone-otp', { phone });
            if (response.status === 200) {
                this.showToast('OTP đã được gửi!', 'success');
                return true;
            } else {
                this.showToast(response.data.message || 'Lỗi khi gửi OTP!');
                return false;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi gửi OTP!';
            console.error('Error in sendPhoneOtp:', error);
            this.showToast(errorMessage);
            return false;
        }
    }

    async sendEmailOtp(email: string): Promise<boolean> {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this.showToast('Email không hợp lệ!');
            return false;
        }
        try {
            this.showToast('OTP đã được gửi!', 'success');
            const response: NotificationResponse = await this.api.post('/send-confirm-email-otp', { email });
            if (response.status === 200) {
                return true;
            } else {
                this.showToast(response.data.message || 'Lỗi khi gửi OTP!');
                return false;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi gửi OTP!';
            console.error('Error in sendEmailOtp:', error);
            this.showToast(errorMessage);
            return false;
        }
    }

    async verifyPhoneOtp(phone: string, otp: string): Promise<boolean> {
        if (!phone || !otp) {
            this.showToast('Vui lòng cung cấp số điện thoại và OTP!');
            return false;
        }
        try {
            const userId = this.getUserId();
            if (!userId) {
                this.showToast('Không tìm thấy thông tin người dùng!');
                return false;
            }
            const response: NotificationResponse = await this.api.post(`/verify-confirm-phone-otp/${userId}`, { phone, otp });
            if (response.status === 200 && response.data?.code === 1000) {
                this.showToast('Xác thực OTP thành công!', 'success');
                return true;
            } else {
                this.showToast('OTP không hợp lệ!');
                return false;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi xác thực OTP!';
            console.error('Error in verifyPhoneOtp:', error);
            this.showToast(errorMessage);
            return false;
        }
    }

    async verifyEmailOtp(email: string, otp: string): Promise<boolean> {
        if (!email || !otp) {
            this.showToast('Vui lòng cung cấp email và OTP!');
            return false;
        }
        try {
            const userId = this.getUserId();
            if (!userId) {
                this.showToast('Không tìm thấy thông tin người dùng!');
                return false;
            }
            const response: NotificationResponse = await this.api.post(`/verify-confirm-email-otp/${userId}`, { email, otp });
            if (response.status === 200 && response.data?.code === 1000) {
                this.showToast('Xác thực OTP thành công!', 'success');
                return true;
            } else {
                this.showToast('OTP không hợp lệ!');
                return false;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi xác thực OTP!';
            console.error('Error in verifyEmailOtp:', error);
            this.showToast(errorMessage);
            return false;
        }
    }

    async sendForgotPasswordOtp(email: string): Promise<boolean> {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this.showToast('Email không hợp lệ!');
            return false;
        }
        try {
            const response: NotificationResponse = await this.api.post('/send-forgot-password-email-otp', { email });
            if (response.status === 200) {
                this.showToast('OTP đặt lại mật khẩu đã được gửi!', 'success');
                return true;
            } else {
                this.showToast(response.data.message || 'Lỗi khi gửi OTP đặt lại mật khẩu!');
                return false;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi gửi OTP đặt lại mật khẩu!';
            console.error('Error in sendForgotPasswordOtp:', error);
            this.showToast(errorMessage);
            return false;
        }
    }

    async verifyForgotPasswordOtp(email: string, otp: string): Promise<boolean> {
        if (!email || !otp) {
            this.showToast('Vui lòng cung cấp email và OTP!');
            return false;
        }
        try {
            const response: NotificationResponse = await this.api.post('/verify-forgot-password-email-otp', { email, otp });
            if (response.status === 200 && response.data?.code === 1000) {
                this.showToast('Xác thực OTP đặt lại mật khẩu thành công!', 'success');
                return true;
            } else {
                this.showToast('OTP không hợp lệ!');
                return false;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi xác thực OTP đặt lại mật khẩu!';
            console.error('Error in verifyForgotPasswordOtp:', error);
            this.showToast(errorMessage);
            return false;
        }
    }

    async updatePassword(newPassword: string, otp: string): Promise<boolean> {
        if (!newPassword || !otp) {
            this.showToast('Vui lòng cung cấp mật khẩu mới và OTP!');
            return false;
        }
        try {
            const response: NotificationResponse = await this.api.post('/update-password', { newPassword, otp });
            if (response.status === 200 && response.data?.code === 1000) {
                this.showToast('Mật khẩu đã được cập nhật thành công!', 'success');
                return true;
            } else {
                this.showToast('Cập nhật mật khẩu thất bại!');
                return false;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi cập nhật mật khẩu!';
            console.error('Error in updatePassword:', error);
            this.showToast(errorMessage);
            return false;
        }
    }
}

export default new NotificationService();