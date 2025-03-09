import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { FaTrash, FaSearch, FaSort } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/theme-context";

const CartPage = () => {
    const [cart, setCart] = useState([
        { id: 1, title: "React Mastery", price: 49.99, image: "/images/react-course.jpg" },
        { id: 2, title: "Node.js for Beginners", price: 39.99, image: "/images/node-course.jpg" },
        { id: 3, title: "GraphQL Essentials", price: 29.99, image: "/images/graphql-course.jpg" },
        { id: 4, title: "Full-Stack JavaScript", price: 59.99, image: "/images/fullstack-course.jpg" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [priceFilter, setPriceFilter] = useState(100);
    const [sortOrder, setSortOrder] = useState("default");
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    // Remove Course from Cart
    const removeFromCart = (id: number) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    // Filter and Sort Logic
    const filteredCart = cart
        .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((item) => item.price <= priceFilter)
        .sort((a, b) => {
            if (sortOrder === "price-asc") return a.price - b.price;
            if (sortOrder === "price-desc") return b.price - a.price;
            if (sortOrder === "title-asc") return a.title.localeCompare(b.title);
            if (sortOrder === "title-desc") return b.title.localeCompare(a.title);
            return 0;
        });

    // Calculate Total Price
    const totalPrice = filteredCart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    return (
        <div className={`min-h-screen p-6 ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            <nav className={`p-6 rounded mb-4 text-sm flex items-center ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-500"}`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <span>Cart</span>
            </nav>

            <div className="flex w-full sm:max-w-8xl sm:mx-auto justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Cart</h2>
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${
                        isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"
                    }`}
                >
                    <ChevronLeft className="mt-1" size={16} />
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full sm:max-w-8xl sm:mx-auto">
                {/* Right Section - Filters & Sorting */}
                <div className={`md:col-span-1 p-6 rounded-lg shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
                    <h3 className="text-xl font-semibold mb-4">Filters & Sorting</h3>
                    <div className={`mb-4 flex items-center shadow-md hover:shadow-lg rounded-lg px-3 py-2 ${isDark ? "bg-gray-700 text-gray-200" : "bg-gray-50"}`}>
                        <FaSearch className="mr-2" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="bg-transparent outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="font-semibold">Price: ${priceFilter}</label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(Number(e.target.value))}
                            className="cursor-pointer w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <FaSort className="mb-2" />
                        <select
                            className={`border rounded-lg p-2 w-full ${isDark ? "bg-gray-700 text-gray-200" : "bg-gray-100"}`}
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="default">Sort By</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="title-asc">Title: A-Z</option>
                            <option value="title-desc">Title: Z-A</option>
                        </select>
                    </div>
                </div>

                {/* Middle Section - Cart Items */}
                <div className={`md:col-span-2 p-6 rounded-lg shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
                    <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                    {filteredCart.length === 0 ? (
                        <p className="text-center text-gray-500">No courses found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredCart.map((item) => (
                                <div key={item.id} className={`p-4 rounded-lg shadow-md flex items-center justify-between ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                                    <div className="flex items-center space-x-4">
                                        <img src={item.image} alt={item.title} className="w-20 h-20 rounded-lg object-cover" />
                                        <div>
                                            <h2 className="text-lg font-semibold">{item.title}</h2>
                                            <p className="font-bold text-red-500">${item.price}</p>
                                        </div>
                                    </div>

                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                                        <FaTrash size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Left Section - Checkout Summary */}
                <div className={`md:col-span-1 p-6 rounded-lg shadow-md h-fit ${isDark ? "bg-gray-800" : "bg-white"}`}>
                    <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                    <p className="text-lg font-bold text-red-500">Total: ${totalPrice}</p>
                    <a href="/checkout" className="mt-4 block bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition text-center">
                        Proceed to Checkout
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
