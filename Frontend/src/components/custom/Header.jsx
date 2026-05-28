import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/logo.svg";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";

function Header({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.statusCode == 200) {
        dispatch(addUserData(""));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setMenuOpen(false);
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return "";
    const name = user.fullName || user.email || "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        id="printHeader"
        className="flex justify-between px-5 sm:px-10 py-4 shadow-sm sticky top-0 z-50 glass-nav items-center"
      >
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="logo" width={90} height={90} />
        </Link>

        {/* Desktop nav */}
        {user ? (
          <div className="hidden sm:flex items-center gap-3">
            {/* User avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
              {getInitials()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <LayoutDashboard className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
            <Button
              size="sm"
              onClick={handleLogout}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="hidden sm:block">
            <Link to="/auth/sign-in">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
                Get Started
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden fixed top-[65px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg px-5 py-4 flex flex-col gap-3"
          >
            {user ? (
              <>
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {getInitials()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {user.fullName || user.email}
                  </span>
                </div>
                <button
                  onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}
                  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium py-2 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium py-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <Link to="/auth/sign-in" onClick={() => setMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                  Get Started
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
