import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const UserFooter = () => {
    return (
        <footer className="bg-gray-950 text-gray-300 py-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
                {/* Left: Logo and Tagline */}
                <div className="flex flex-col items-center md:items-start">
                    <img src="/prograbyte1.png" alt="Prograbyte Logo" className="h-10 mb-4" />
                    <p className="text-sm text-gray-400 max-w-sm">
                        Empowering your learning journey with expert-led courses and a vibrant community.
                    </p>
                </div>

                {/* Center: Navigation Links */}
                <div className="flex flex-col items-center">
                    <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/courses" className="hover:text-blue-400 transition">Courses</a></li>
                        <li><a href="/blogs" className="hover:text-blue-400 transition">Blogs</a></li>
                        <li><a href="/support" className="hover:text-blue-400 transition">Support</a></li>
                        <li><a href="/profile" className="hover:text-blue-400 transition">My Account</a></li>
                    </ul>
                </div>

                {/* Right: Social & Contact */}
                <div className="flex flex-col items-center md:items-end">
                    <h4 className="text-lg font-semibold text-white mb-3">Connect With Us</h4>
                    <div className="flex space-x-4 text-xl text-gray-400">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-500"><FaFacebookF /></a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-400"><FaTwitter /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-600"><FaLinkedinIn /></a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-400"><FaInstagram /></a>
                    </div>
                    <p className="text-sm mt-4">Email: support@prograbyte.com</p>
                    <p className="text-sm">Phone: +91 97478 27371</p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Prograbyte. All rights reserved.
            </div>
        </footer>
    );
};

export default UserFooter;
