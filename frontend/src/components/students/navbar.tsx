import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/user-context";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";

const StudentNavbar = () => {
  const context = useContext(UserContext);

  const { isAuth, user } = context || {};
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/70 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold italic text-red-600">
          Prograbyte
        </Link>

        {/* Navigation Links (Desktop) */}
        <ul className="flex space-x-6 hidden md:flex">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) =>
                `text-lg font-semibold transition-colors duration-300 ${
                  isActive ? "text-red-600" : "text-gray-800 hover:text-red-500"
                }`
              }>
              Home
            </NavLink>
          </li>
          {["Courses", "Blog"].map((item) => (
            <li key={item}>
              <NavLink 
                to={`/${item.toLowerCase()}`} 
                className={({ isActive }) =>
                  `text-lg font-semibold transition-colors duration-300 ${
                    isActive ? "text-red-600" : "text-gray-800 hover:text-red-500"
                  }`
                }>
                {item}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth Section (Desktop) */}
        <div className="flex items-center space-x-6 hidden md:flex">
          {isAuth && user ? (
            <>
              <NavLink 
                to="/profile" 
                className={({ isActive }) =>
                  `text-lg font-semibold text-gray-800 hover:text-red-500 transition flex items-center ${isActive ? "text-red-600" : ""}`
                }>
                <FaUserCircle className="mr-2" />
              </NavLink>
              <NavLink 
                to="/cart" 
                className={({ isActive }) =>
                  `text-lg font-semibold text-gray-800 hover:text-red-500 transition flex items-center ${isActive ? "text-red-600" : ""}`
                }>
                <FaShoppingCart className="mr-2" />
              </NavLink>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-red-500 text-red-600 bg-white font-bold hover:text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                Login
              </Link>
              <Link to="/signup" className="bg-red-500 text-red-600 bg-white font-bold px-4 py-2 hover:text-white rounded-md hover:bg-red-600 transition">
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMobileMenu} 
            className="text-gray-800 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 right-0 w-full bg-white shadow-md rounded-md md:hidden">
            <ul className="flex flex-col space-y-4 py-4 px-6">
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) =>
                    `text-lg font-semibold transition-colors duration-300 ${
                      isActive ? "text-red-600" : "text-gray-800 hover:text-red-500"
                    }`
                  }>
                  Home
                </NavLink>
              </li>
              {["Courses", "Blog"].map((item) => (
                <li key={item}>
                  <NavLink 
                    to={`/${item.toLowerCase()}`} 
                    className={({ isActive }) =>
                      `text-lg font-semibold transition-colors duration-300 ${
                        isActive ? "text-red-600" : "text-gray-800 hover:text-red-500"
                      }`
                    }>
                    {item}
                  </NavLink>
                </li>
              ))}
              {isAuth && user ? (
                <>
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) =>
                      `text-lg font-semibold text-gray-800 hover:text-red-500 transition flex items-center ${isActive ? "text-red-600" : ""}`
                    }>
                    <FaUserCircle className="mr-2" />
                    Profile
                  </NavLink>
                  <NavLink 
                    to="/cart" 
                    className={({ isActive }) =>
                      `text-lg font-semibold text-gray-800 hover:text-red-500 transition flex items-center ${isActive ? "text-red-600" : ""}`
                    }>
                    <FaShoppingCart className="mr-2" />
                    Cart
                  </NavLink>
                </>
              ) : (
                <>
                  <Link to="/login" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                    Signup
                  </Link>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default StudentNavbar;
