import { useNavigate } from "react-router-dom";
import Progress from "@/components/ui/progress";
import { CoursePurchaseProps } from "@/types/course";
import { Heart, HeartOff, IndianRupee, ShoppingCart } from "lucide-react";

const CoursePurchaseSection: React.FC<CoursePurchaseProps> = ({ course, enrolledCourses, isDark, isInWishlist, handleWishlistClick }) => {
    const navigate = useNavigate();

    const enrolledCourse = enrolledCourses?.courses?.find((enrolled) => enrolled.courseId._id === course?._id);
    const isPurchased = !!enrolledCourse;
    const progress = enrolledCourse?.completionStatus || 0;

    const discountedPrice = course?.offer
        ? Math.floor((course.price - (course.price * course.offer.discount) / 100))
        : null;

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
                        {/* Pricing */}
                        <div className="text-2xl font-bold text-blue-500 text-center flex flex-col items-center">
                            {course?.offer ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600 flex items-center text-2xl font-semibold">
                                            <IndianRupee size={18} /> {discountedPrice}
                                        </span>
                                        <span className={`text-gray-400 line-through text-lg flex items-center`}>
                                            <IndianRupee size={16} /> {course.price}
                                        </span>
                                    </div>
                                    <span className="text-sm text-yellow-600 font-semibold">
                                        {course.offer.discount}% OFF
                                    </span>
                                </>
                            ) : (
                                <div className="flex items-center">
                                    <IndianRupee size={18} /> {course?.price}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-4 justify-center">
                            {/* Buy Course Button */}
                            <div className="relative group">
                                <button
                                    onClick={() => navigate(`/checkout/${course?._id}`)}
                                    className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${isDark ? "text-white hover:text-blue-500" : "hover:text-blue-500"
                                        } cursor-pointer`}
                                >
                                    <ShoppingCart size={18} />
                                    Get Course
                                </button>

                                {/* Custom Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-sm px-3 py-1 rounded shadow-lg z-10 whitespace-nowrap">
                                    Buy this course now!
                                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-800 rotate-45"></div>
                                </div>
                            </div>

                            <div className="relative group">
                                <button
                                    onClick={handleWishlistClick}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition ${isDark ? "text-white hover:text-blue-500" : "hover:text-blue-600"
                                        } cursor-pointer`}
                                >
                                    {isInWishlist ? <HeartOff size={18} className="text-blue-500" /> : <Heart size={18} className="text-blue-600" />}
                                </button>

                                {/* Custom Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-sm px-3 py-1 rounded shadow-lg z-10 whitespace-nowrap">
                                    {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-800 rotate-45"></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CoursePurchaseSection;
