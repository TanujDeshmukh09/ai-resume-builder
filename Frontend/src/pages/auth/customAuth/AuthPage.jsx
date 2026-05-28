import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { loginUser, registerUser } from "@/Services/login";
import { Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignInSubmit = async (event) => {
    setSignInError("");
    event.preventDefault();
    const { email, password } = event.target.elements;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
      setSignInError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const data = { email: email.value, password: password.value };

    try {
      const user = await loginUser(data);
      if (user?.statusCode === 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      setSignInError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (event) => {
    setSignUpError("");
    event.preventDefault();
    const { fullname, email, password } = event.target.elements;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
      setSignUpError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const data = {
      fullName: fullname.value,
      email: email.value,
      password: password.value,
    };
    try {
      const response = await registerUser(data);
      if (response?.statusCode === 201) {
        // Auto-login using the credentials from state (not the event object)
        const loginData = { email: email.value, password: password.value };
        const loginResponse = await loginUser(loginData);
        if (loginResponse?.statusCode === 200) {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      setSignUpError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:bg-white focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-200 mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">AI Resume Builder</h1>
          <p className="text-gray-500 text-sm mt-1">Build. Refine. Shine.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tab toggle */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 pb-3 pt-4 flex justify-center items-center gap-2 text-sm font-semibold transition-all duration-300 ${
                !isSignUp
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <FaSignInAlt /> Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 pb-3 pt-4 flex justify-center items-center gap-2 text-sm font-semibold transition-all duration-300 ${
                isSignUp
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <FaUserPlus /> Sign Up
            </button>
          </div>

          {/* Forms */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {!isSignUp ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Welcome back 👋</h2>
                  <form onSubmit={handleSignInSubmit} className="space-y-4">
                    <div className={inputClass}>
                      <FaUser className="text-gray-400 shrink-0" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        className="outline-none w-full bg-transparent text-gray-700 text-sm"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                    </div>
                    <div className={inputClass}>
                      <FaLock className="text-gray-400 shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        required
                        className="outline-none w-full bg-transparent text-gray-700 text-sm"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full text-base py-3 rounded-xl justify-center"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </button>
                    {signInError && (
                      <p className="text-red-500 text-sm text-center">{signInError}</p>
                    )}
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Create your account ✨</h2>
                  <form onSubmit={handleSignUpSubmit} className="space-y-4">
                    <div className={inputClass}>
                      <FaUser className="text-gray-400 shrink-0" />
                      <input
                        type="text"
                        name="fullname"
                        placeholder="Full Name"
                        required
                        className="outline-none w-full bg-transparent text-gray-700 text-sm"
                      />
                    </div>
                    <div className={inputClass}>
                      <FaUser className="text-gray-400 shrink-0" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        className="outline-none w-full bg-transparent text-gray-700 text-sm"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                    </div>
                    <div className={inputClass}>
                      <FaLock className="text-gray-400 shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        required
                        className="outline-none w-full bg-transparent text-gray-700 text-sm"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full text-base py-3 rounded-xl justify-center"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
                    </button>
                    {signUpError && (
                      <p className="text-red-500 text-sm text-center">{signUpError}</p>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthPage;
