import { useNavigate } from "react-router-dom";
import Progress from "@/components/ui/progress";
import { CoursePurchaseProps } from "@/types/course";

const CoursePurchaseSection: React.FC<CoursePurchaseProps> = ({ course, enrolledCourses, isDark, isInWishlist, handleWishlistClick }) => {
    const navigate = useNavigate();

    const enrolledCourse = enrolledCourses?.courses?.find((enrolled) => enrolled.courseId._id === course?._id);

    const isPurchased = !!enrolledCourse;
    const progress = enrolledCourse?.completionStatus || 0;

    return (
        <div className="col-span-3 md:col-span-1">
            <div className={`shadow-2xl p-6 rounded-sm border sticky top-20 transition-all backdrop-blur-lg ${isDark ? "bg-gray-900/80 text-white border-gray-700" : "bg-white/80 border-gray-200 text-gray-900"}`}>
                
                <h3 className="text-2xl font-bold mb-4 text-center">
                    {isPurchased ? "Your Course Progress" : "Get the course today"}
                </h3>

                {isPurchased ? (
                    <div className="flex flex-col items-center">
                        <p className="text-lg mb-2 font-medium">{progress}% Completed</p>
                        <Progress value={progress} isDark={isDark} />
                        <button 
                            className="mt-5 w-full py-3 rounded-lg text-gray-500 font-semibold"
                            onClick={() => navigate(`/courses/${course?._id}`)}
                        >
                            Continue Learning
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Course Options Dropdown */}
                        <select className={`w-full p-3 border rounded-lg mb-4 ${isDark ? "bg-gray-800 text-gray-300 border-gray-600" : "text-gray-700 border-gray-300"}`}>
                            <option>Choose Course Option</option>
                            <option>Video classes</option>
                            <option>Video + Live classes</option>
                        </select>

                        {/* Pricing */}
                        <div className="text-2xl font-bold text-blue-500 text-center flex flex-col items-center">
                            <span className="relative">
                                ₹{course?.price} 
                                <span className={`text-lg ml-2 ${isDark ? "text-gray-400" : "text-gray-500"} line-through`}>₹999</span>
                            </span>
                            <span className="text-base font-semibold text-gray-400">Limited Offer</span>
                        </div>

                        {/* Buy Course Button */}
                        <button onClick={() => navigate(`/checkout/${course?._id}`)} className={`w-full border py-3 mt-4 rounded-lg font-semibold ${isDark ? "text-white hover:text-blue-500" : "hover:text-blue-500"} cursor-pointer`}>
                            Get Course
                        </button>

                        {/* Wishlist Button */}
                        <button onClick={handleWishlistClick} className={`w-full mt-3 py-2 rounded-lg font-semibold cursor-pointer ${isDark ? "text-white hover:text-blue-500" : "hover:text-blue-600"}`}>
                            {isInWishlist ? "💙 Remove from Wishlist" : "🤍 Add to Wishlist"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CoursePurchaseSection;
