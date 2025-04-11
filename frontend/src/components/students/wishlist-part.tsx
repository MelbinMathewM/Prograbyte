import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { FaTrash, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/theme-context";
import { getWishlist, removeFromWishlist } from "@/api/wishlist";
import { UserContext } from "@/contexts/user-context";
import toast from "react-hot-toast";
import { Wishlist } from "@/types/user";

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useContext(UserContext) ?? {};
    
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("default");
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    useEffect(() => {
        if (!user?.id) return;
        const fetchWishlist = async () => {
            setLoading(true);
            try {
                const response = await getWishlist(user.id);
                console.log(response);
                setWishlist(response);
                setError(null);
            } catch (error) {
                console.error("Error fetching wishlist", error);
                setError("Failed to load wishlist.");
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, [user?.id]);

    const handleCourseDetails = (courseId : string) => {
        navigate(`/courses/${courseId}`);
    }

    // Remove Course from Wishlist
    const handleRemoveFromWishlist = async (id: string) => {
        try {
            await removeFromWishlist(user?.id as string, id);
            setWishlist((prev) => {
                if (!prev) return null;
                return { ...prev, items: prev.items.filter((item) => item._id !== id) };
            });
        } catch (error: any) {
            if (error.response) {
                const backendMessage = error.response.data.error || "An error occurred";
                toast.error(backendMessage);
            } else if (error.request) {
                toast.error("Server is not responding. Please try again later.");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    };


    // Filter and Sort Logic
    const filteredWishlist = wishlist?.items
        ?.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === "price-asc") return a.price - b.price;
            if (sortOrder === "price-desc") return b.price - a.price;
            if (sortOrder === "title-asc") return a.title.localeCompare(b.title);
            if (sortOrder === "title-desc") return b.title.localeCompare(a.title);
            return 0;
        }) ?? [];

    return (
        <div className={`min-h-screen p-6 ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
            <nav className={`p-6 rounded mb-4 text-sm flex items-center ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-500"}`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <span>Wishlist</span>
            </nav>

            <div className="flex w-full sm:max-w-6xl sm:mx-auto justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Wishlist</h2>
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${
                        isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"
                    }`}
                >
                    <ChevronLeft size={16} />
                    Back
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading wishlist...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full sm:max-w-6xl sm:mx-auto">
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

                        <div className="mb-4 flex">
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

                    {/* Middle Section - Wishlist Items */}
                    <div className={`md:col-span-3 p-6 rounded-lg shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
                        <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
                        {filteredWishlist.length === 0 ? (
                            <p className="text-center text-gray-500">No courses found.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredWishlist.map((item) => (
                                    <div key={item._id} className={`p-4 rounded-lg shadow-md flex items-center justify-between ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                                        <div className="flex items-center space-x-4">
                                            <img src={item.poster_url} alt={item.title} className="w-20 h-20 rounded-lg object-cover" onClick={() => handleCourseDetails(item._id)}/>
                                            <div>
                                                <h2 className="text-lg font-semibold">{item.title}</h2>
                                                <p className="font-bold text-red-500">${item.price}</p>
                                            </div>
                                        </div>

                                        <button onClick={() => handleRemoveFromWishlist(item._id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                                            <FaTrash size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
