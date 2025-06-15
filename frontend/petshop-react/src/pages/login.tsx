import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider, facebookProvider } from "../utils/firebase";
import { signInWithPopup, type UserCredential } from "firebase/auth";
import AuthService from "../services/auth-service";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../context/UserContext";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { toast } from "react-toastify";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";

// Define types for JWT decoded token
interface DecodedToken {
  id_user: string;
  sub: string;
  email: string;
  picture?: string;
}

// Define types for user data
interface User {
  id_user: string;
  username: string;
  email: string;
  avatar?: string;
  token: string;
}

// Define types for social login user data
interface SocialUser {
  username: string;
  email: string;
  phone: string | null;
  password: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  loginType: "google" | "facebook";
}

// Define types for AuthService response
interface AuthResponse {
  authenticated: boolean;
  token: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useUser();

  // Đăng nhập bằng tài khoản thường
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response: AuthResponse = await AuthService.login(email, password);
      if (response.authenticated) {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(response.token);
        const user: User = {
          id_user: decoded.id_user,
          username: decoded.sub,
          email: decoded.email,
          avatar: decoded.picture,
          token: response.token,
        };
        login(user);
        // if (rememberMe) {
        //   localStorage.setItem("user", JSON.stringify(user));
        // }
        navigate("/home");
      } else {
        toast.error("Mật khẩu không đúng", { position: "top-right" });
      }
    } catch (error: any) {
      toast.error(error.message || "Đăng nhập thất bại", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user.email) {
        toast.info("Tài khoản chưa xác thực email", { position: "top-right" });
        setIsLoading(false);
        return;
      }
      const [firstName, ...lastNameParts] = user.displayName?.split(" ") || ["", ""];
      const lastName = lastNameParts.join(" ");
      const socialUser: SocialUser = {
        username: user.displayName || "",
        email: user.email,
        phone: user.phoneNumber,
        password: user.uid,
        firstname: firstName,
        lastname: lastName,
        avatar: user.photoURL || undefined,
        loginType: "google",
      };
      const response: AuthResponse = await AuthService.loginSocial(socialUser);
      const decoded: DecodedToken = jwtDecode<DecodedToken>(response.token);
      const storedUser: User = {
        id_user: decoded.id_user,
        username: user.displayName || "",
        email: user.email,
        avatar: user.photoURL || undefined,
        token: response.token,
      };
      login(storedUser);
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
      navigate("/home");
    } catch (error: any) {
      toast.error(error.message || "Đăng nhập Google thất bại", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng nhập bằng Facebook
  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      const result: UserCredential = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      if (!user.email) {
        toast.info("Tài khoản chưa xác thực email", { position: "top-right" });
        setIsLoading(false);
        return;
      }
      const [firstName, ...lastNameParts] = user.displayName?.split(" ") || ["", ""];
      const lastName = lastNameParts.join(" ");
      const socialUser: SocialUser = {
        username: user.displayName || "",
        email: user.email,
        phone: user.phoneNumber,
        password: user.uid,
        firstname: firstName,
        lastname: lastName,
        avatar: user.photoURL || undefined,
        loginType: "facebook",
      };
      const response: AuthResponse = await AuthService.loginSocial(socialUser);
      const decoded: DecodedToken = jwtDecode<DecodedToken>(response.token);
      const storedUser: User = {
        id_user: decoded.id_user,
        username: user.displayName || "",
        email: user.email,
        avatar: user.photoURL || undefined,
        token: response.token,
      };
      login(storedUser);
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(storedUser));
      }
      navigate("/home");
    } catch (error: any) {
      toast.error(error.message || "Đăng nhập Facebook thất bại", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Left side - Login Form */}
        <div className="w-1/2 flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-8">Đăng nhập</h1>
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Địa chỉ email
                </label>
                <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Nhập địa chỉ email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Mật khẩu
                </label>
                <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-green-600 border-gray-300 rounded"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm text-blue-600 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-green-800 text-white py-3 rounded-md hover:bg-green-700 transition duration-200 whitespace-nowrap cursor-pointer ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {isLoading ? (
                    <svg
                        className="animate-spin h-5 w-5 mx-auto text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                      <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                      />
                      <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                      />
                    </svg>
                ) : (
                    "Đăng nhập"
                )}
              </button>
            </form>
            <div className="mt-8">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-300 w-full" />
                <div className="bg-gray-50 px-4 text-sm text-gray-500 absolute">Hoặc</div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                >
                  <FcGoogle className="text-lg mr-2" />
                  Đăng nhập với Google
                </button>
                <button
                    onClick={handleFacebookLogin}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                >
                  <FaFacebook className="text-lg mr-2 text-blue-600" />
                  Đăng nhập với Facebook
                </button>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Đăng ký
                </Link>
              </p>
            </div>
            <ForgotPasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
        {/* Right side - Illustration */}
        <div className="w-1/2 bg-gray-50 flex items-center justify-center p-12 relative">
          <div className="w-full h-full absolute overflow-hidden">
            <img
                src="https://readdy.ai/api/search-image?query=Adorable%20illustration%20of%20an%20orange%20tabby%20kitten%20and%20a%20beagle%20puppy%20sitting%20side%20by%20side%2C%20drawn%20in%20a%20cute%20sticker%20style%20with%20white%20outline.%20The%20illustration%20has%20a%20clean%20minimalist%20background%20with%20soft%20shadows%2C%20perfect%20for%20a%20pet-themed%20login%20page.%20The%20animals%20have%20expressive%20eyes%20and%20friendly%20expressions.&width=800&height=1024&seq=pet123&orientation=portrait"
                alt="Cute pets illustration"
                className="w-full h-full object-contain object-top"
            />
          </div>
        </div>
      </div>
  );
};

export default Login;