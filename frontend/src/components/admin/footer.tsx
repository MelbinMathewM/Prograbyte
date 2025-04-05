const FooterPart = () => {
    return (
        <footer className="bg-gray-950 text-white py-10">
            <div className="container mx-auto px-4">
                {/* Grid Layout for Footer Sections */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* Company Info */}
                    <div>
                        <h2 className="text-3xl font-bold mb-5 italic">Prograbyte</h2>
                        <p className="text-sm text-gray-400">
                            Codeon is an innovative e-learning platform providing high-quality courses and coding challenges.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className="text-lg font-bold mb-3">Quick Links</h2>
                        <ul className="text-sm text-gray-400 space-y-2">
                            <li><a href="#" className="hover:text-white">Home</a></li>
                            <li><a href="#" className="hover:text-white">Courses</a></li>
                            <li><a href="#" className="hover:text-white">Pricing</a></li>
                            <li><a href="#" className="hover:text-white">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h2 className="text-lg font-bold mb-3">Support</h2>
                        <ul className="text-sm text-gray-400 space-y-2">
                            <li><a href="#" className="hover:text-white">Help Center</a></li>
                            <li><a href="#" className="hover:text-white">FAQs</a></li>
                            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h2 className="text-lg font-bold mb-3">Follow Us</h2>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-blue-400"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="hover:text-blue-500"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="hover:text-pink-500"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="hover:text-blue-600"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4">
                    &copy; {new Date().getFullYear()} Prograbyte. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default FooterPart;
