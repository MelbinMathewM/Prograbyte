import { useNavigate } from "react-router-dom";
import Progress from "../../components/ui/progress";
import { CoursePurchaseProps } from "../../types/course";

const CoursePurchaseSection: React.FC<CoursePurchaseProps> = ({ course,enrolledCourses, isDark, isInWishlist, handleWishlistClick }) => {
    const navigate = useNavigate();

    console.log(enrolledCourses,'hgg')

    const isPurchased = enrolledCourses && Array.isArray(enrolledCourses) 
    ? enrolledCourses.some(enrolled => enrolled._id === course?._id) 
    : false;


    return (
        <div className="col-span-3 md:col-span-1">
            <div className={`shadow-xl p-6 rounded-2xl border sticky top-20 transition-all backdrop-blur-lg ${isDark ? "bg-gray-900/70 text-white border-gray-800" : "bg-white/60 border-gray-100 text-gray-900"}`}>
                
                <h3 className="text-xl font-semibold mb-3 text-center">{isPurchased ? "Your Course Progress" : "Get the course today"}</h3>
                
                {isPurchased ? (
                    // If purchased, show progress
                    <div className="flex flex-col items-center">
                        <p className="text-lg mb-2">{course?.progress}% Completed</p>
                        <Progress value={course.progress || 0} className="w-full h-3 bg-gray-300 rounded-lg" />
                        <button className="mt-4 w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-500 transition">
                            Continue Learning 🚀
                        </button>
                    </div>
                ) : (
                    // If not purchased, show purchase options
                    <>
                        {/* Course Options Dropdown */}
                        <select className={`w-full p-2 border rounded-lg mb-3 ${isDark ? "bg-gray-800 text-gray-300 border-gray-600" : "text-gray-600 border-gray-300"}`}>
                            <option>Choose Course Option</option>
                            <option>Video classes</option>
                            <option>Video + Live classes</option>
                        </select>

                        {/* Pricing */}
                        <div className="text-2xl font-bold text-red-500 text-center">
                            ₹{course?.price} <span className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"} line-through`}>₹999</span> <span className="text-white">only</span>
                        </div>

                        {/* Buy Course Button */}
                        <button onClick={() => navigate(`/checkout/${course?._id}`)} className="w-full bg-red-700 text-white py-2 mt-3 rounded-lg font-semibold hover:bg-red-600 transition">
                            Get Course 🚀
                        </button>

                        {/* Wishlist Button */}
                        <button onClick={handleWishlistClick} className={`w-full mt-2 font-semibold transition ${isDark ? "text-red-400 hover:text-red-300" : "text-red-700 hover:text-red-600"}`}>
                            {isInWishlist ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CoursePurchaseSection;
