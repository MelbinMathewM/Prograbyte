import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NavbarPart = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <nav className="fixed w-full bg-primary text-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                {/* Brand Name */}
                <Link to="/" className="text-2xl md:text-3xl italic font-bold">
                    Prograbyte
                </Link>

                {/* Desktop Menu (Hidden on small screens) */}
                <div className="hidden md:flex md:items-center md:space-x-6">
                    {[
                        { name: "Dashboard", path: "/admin/dashboard" },
                        { name: "Categories", path: "/admin/categories" },
                        { name: "Tutors", path: "/tutors" },
                        { name: "Offers", path: "/offers" },
                        { name: "Coupons", path: "/admin/coupons" },
                        { name: "Blog", path: "/blog" },
                        { name: "Profile", path: "/profile" },
                    ].map(({ name, path }) => (
                        <Link
                            key={name}
                            to={path}
                            className={`hover:text-gray-300 transition ${
                                isActive(path) ? "font-bold text-lg" : ""
                            }`}
                        >
                            {name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-primary text-white py-2 px-4">
                    {[
                        { name: "Dashboard", path: "/admin/dashboard" },
                        { name: "Categories", path: "/admin/categories" },
                        { name: "Tutors", path: "/tutors" },
                        { name: "Offers", path: "/offers" },
                        { name: "Coupons", path: "/admin/coupons" },
                        { name: "Blog", path: "/blog" },
                        { name: "Profile", path: "/profile" },
                    ].map(({ name, path }) => (
                        <Link
                            key={name}
                            to={path}
                            className={`block py-3 border-b border-gray-600 last:border-none hover:bg-secondary transition ${
                                isActive(path) ? "font-bold text-lg" : ""
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default NavbarPart;
