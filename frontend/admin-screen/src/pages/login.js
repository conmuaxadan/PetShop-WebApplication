import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import authService from "../service/auth-service";


const LoginPage = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser();

    const handleInputChange = (e) => {
        console.log('Input changed:', e.target.name, e.target.value); // Debug
        const { name, value, type, checked } = e.target;
        setCredentials({
            ...credentials,
            [name]: type === 'checkbox' ? checked : value,
        });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!credentials.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!credentials.password) {
            newErrors.password = 'Password is required';
        } else if (credentials.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailPasswordLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        setErrors({});
        try {
            const response = await authService.login(credentials.email,credentials.password);
            if (response.authenticated) {
                const decoded = jwtDecode(response.token);

                const user = {
                    id_user: decoded.id_user,
                    username: decoded.sub,
                    email: decoded.email,
                    avatar: decoded.picture,
                    token: response.token,
                };
                login(user);
                setLoginSuccess(true);
                toast.success('Đăng nhập thành công!', { position: 'top-right' });
                setTimeout(() => navigate('/dashboard'), 1000);
            } else {
                throw new Error('Sai email hoặc mật khẩu');
            }
        } catch (error) {
            setErrors({ general: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.' });
            toast.error(error.message || 'Đăng nhập thất bại', { position: 'top-right' });
        } finally {
            setIsLoading(false);
        }
    };

    if (loginSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Login Successful!</h2>
                    <p className="text-gray-600 mb-6">You have successfully logged in.</p>
                    <button
                        onClick={() => setLoginSuccess(false)}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>
                <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
                    {errors.general && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {errors.general}
                        </div>
                    )}
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={credentials.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                checked={credentials.rememberMe}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <Mail className="w-5 h-5 mr-2" />
                                Sign in with Email
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;