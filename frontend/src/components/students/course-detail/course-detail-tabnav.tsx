import { useContext, useEffect, useRef, useState } from "react";
import AccordionItem from "@/components/ui/accordian-item";
import Accordion from "@/components/ui/accordian";
import { Link } from "react-router-dom";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/api/wishlist";
import { UserContext } from "@/contexts/user-context";
import toast from "react-hot-toast";
import CoursePurchaseSection from "@/components/students/course-detail/course-detail-purchasetab";
import { fetchEnrolledCourse, fetchReviews, fetchTopicsByCourse } from "@/api/course";
import { Course, EnrolledCourses, IRating, IReview, Topic, Topics } from "@/types/course";
import { getUserData } from "@/api/profile";

const TabNav = ({ course, isDark }: { course: Course | null, isDark: boolean }) => {

    const [topicsMain, setTopicsMain] = useState<Topics | null>(null);
    const [topics, setTopics] = useState<Topic[]>([])
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [activeTab, setActiveTab] = useState("about");
    const [tutor, setTutor] = useState<{ name: string; username: string } | null>(null);
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        Basic: false,
        Intermediate: false,
        Advanced: false,
    });
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourses | null>(null);
    const [reviewData, setReviewData] = useState<IReview[]>([]);
    const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

    const { user } = useContext(UserContext) ?? {};

    const toggleSection = (level: string) => {
        setOpenSections(prev => ({ ...prev, [level]: !prev[level] }));
    };

    useEffect(() => {
        const fetchTopics = async () => {
            if (!course) return;
            try {
                const response = await fetchTopicsByCourse(course?._id);
                setTopicsMain(response.topicList);
                setTopics(response.topicList.topics);
            } catch (err) {
                console.error("Error fetching topics");
            }
        };
        fetchTopics();
    }, [course]);

    useEffect(() => {
        if (!user?.id) return;
        const fetchEnrolled = async () => {
            try {
                const response = await fetchEnrolledCourse(user?.id);
                console.log(response, 'hii');

                const courseIds = response.enrolledCourses;

                setEnrolledCourses(courseIds);
            } catch (err) {
                console.error("error fetching enrolled courses")
            }
        }
        fetchEnrolled();
    }, [user?.id])

    useEffect(() => {
        if (!user?.id) return;
        const fetchWishlist = async () => {
            try {
                const wishlist = await getWishlist(user?.id);
                setIsInWishlist(wishlist.items.some((item: any) => item._id === course?._id));
            } catch (error) {
                console.error("Error fetching wishlist", error);
            }
        };
        fetchWishlist();
    }, [course?._id, user?.id]);

    useEffect(() => {
        const fetchTutor = async () => {
            try {
                console.log('fdf')
                const data = await getUserData(course?.tutor_id as string);
                console.log(data, 'hh')
                setTutor({
                    name: data.user.name,
                    username: data.user.username,
                });
            } catch (error) {
                console.error("Error fetching tutor details:", error);
            }
        };

        if (course?.tutor_id) fetchTutor();
    }, [course]);

    const handleWishlistClick = async () => {
        try {
            if (isInWishlist) {
                const response = await removeFromWishlist(user?.id as string, course?._id as string);
                toast.success(response.message);
                setIsInWishlist(false);
            } else {
                const response = await addToWishlist(user?.id as string, course?._id as string);
                toast.success(response.message);
                setIsInWishlist(true);
            }
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

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await fetchReviews(course?._id as string);
                setReviewData(response.reviews.reviews);

                // Fetch user details
                const userDetails: { [key: string]: string } = {};
                await Promise.all(response.reviews.reviews.map(async (review: IReview) => {
                    if (!usernames[review.userId]) {
                        const res = await getUserData(review.userId);
                        userDetails[review.userId] = res.user.username;
                    }
                }));

                setUsernames((prev) => ({ ...prev, ...userDetails }));
            } catch (err: any) {
                console.error(err.response?.data?.error || err.message);
            }
        };
        if (course?._id) fetchRatings();
    }, [course])

    const categorizedTopics = {
        Basic: topics.filter(topic => topic.level === "Basic"),
        Intermediate: topics.filter(topic => topic.level === "Intermediate"),
        Advanced: topics.filter(topic => topic.level === "Advanced"),
    };

    console.log(categorizedTopics, 'cattop')

    return (
        <div className={`grid grid-cols-3 shadow-lg rounded p-3 gap-8 mx-auto mt-8 ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            {/* Left - Main Content */}
            <div className={`col-span-3 md:col-span-2 p-4 rounded-sm border ${isDark ? "border-gray-700" : "border-gray-100"} `}>
                {/* Tab Navigation */}
                <div className={`border-b shadow-lg flex gap-3 ${isDark ? "border-gray-800" : "border-gray-300"}`}>
                    {["about", "content", "reviews"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 text-lg flex px-3 items-center justify-center font-semibold transition
                            ${activeTab === tab
                                    ? "text-blue-500 border-b-2 border-blue-500 hover:text-blue-600 hover:border-blue-600"
                                    : isDark
                                        ? "text-gray-400 hover:text-gray-300"
                                        : "text-gray-500 hover:text-gray-600"
                                }`}
                        >
                            {tab === "about" ? "About" : tab === "content" ? "Course" : "Reviews"}
                        </button>
                    ))}
                </div>

                {/* Tabs Content */}
                <div className="mt-6">
                    {activeTab === "about" && (
                        <div>
                            <h2 className="text-2xl font-semibold italic">About the course</h2>
                            <p className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{course?.description}</p>
                            <Accordion isDark={isDark}>
                                <AccordionItem title="Tutor Details" isDark={isDark}>
                                    {tutor ? (
                                        <div className="flex items-center gap-4 mt-3 ms-3">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor?.username || "User"}`} alt={tutor.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <h3 className="text-lg font-semibold">{tutor.name}</h3>
                                                <p className="text-gray-500">
                                                    <Link to={`/blog/profile/${tutor.username}`} className="hover:text-blue-500 text-gray-500">
                                                        @{tutor.username}
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Loading tutor details...</p>
                                    )}
                                </AccordionItem>
                            </Accordion>
                        </div>

                    )}

                    {activeTab === "content" && (
                        <div>
                            <h2 className="text-2xl font-semibold">Course Content</h2>
                            <p className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Topics covered in this course:</p>
                            <div className="mt-4">
                                {Object.entries(categorizedTopics).map(([level, topicItems]) => (
                                    <div key={level} className={`mt-2 border rounded-lg ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                                        {/* Dropdown Header */}
                                        <button
                                            className={`w-full px-4 py-2 flex justify-between items-center font-semibold rounded-sm transition duration-300 cursor-pointer 
                                                    ${isDark
                                                    ? "outline outline-gray-700 text-gray-300 hover:bg-gray-700 hover:outline-gray-400"
                                                    : "outline outline-blue-100 text-blue-500 hover:outline-blue-500"
                                                }`}
                                            onClick={() => toggleSection(level)}
                                        >

                                            {level}
                                            <span className={`transform transition-transform ${openSections[level] ? "rotate-180" : ""}`}>
                                                ▼
                                            </span>
                                        </button>
                                        {/* Dropdown Content */}
                                        {openSections[level] && (
                                            <div className={`p-4 rounded-sm shadow-md ${isDark ? "bg-gray-850" : "bg-white"}`}>
                                                {topicItems.length > 0 ? (
                                                    <TopicList topicsItems={topicItems} courseId={course?._id as string} courseName={course?.title as string} isDark={isDark} topicsId={topicsMain?._id as string} />
                                                ) : (
                                                    <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>No topics available</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="space-y-6">
                            {reviewData.length > 0 ? (
                                reviewData.map((review) => (
                                    <div
                                        key={review._id}
                                        className={`flex items-start gap-4 p-4 border rounded-lg shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}
                                    >
                                        {/* User Avatar */}
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "text-gray-400 bg-gray-700" : "text-gray-700 bg-gray-300"} font-semibold`}>
                                            {usernames[review.userId] ? usernames[review.userId][0].toUpperCase() : "U"}
                                        </div>

                                        {/* Review Content */}
                                        <div className="flex flex-col flex-grow">
                                            <p className={`font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                                                {usernames[review.userId] || "Unknown User"}
                                            </p>
                                            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{review.review}</p>

                                            {/* Star Rating */}
                                            <div className="mt-2 flex items-center gap-1 text-yellow-500">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <span key={i}>
                                                        {i < review.rating ? "⭐" : "☆"}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-6">No reviews yet. Be the first to leave a review! 🎉</p>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* Right - Fixed Payment Section */}
            <CoursePurchaseSection
                course={course!}
                enrolledCourses={enrolledCourses as EnrolledCourses}
                isDark={isDark}
                isInWishlist={isInWishlist}
                handleWishlistClick={handleWishlistClick}
            />

        </div>
    );
};


const TopicList = ({ topicsItems, courseId, courseName, isDark, topicsId }: { topicsItems: Topic[], courseId: string, courseName: string, isDark: boolean, topicsId: string }) => {
    return (
        <ul className={`grid grid-cols-1 md:grid-cols-2 gap-4 list-none ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {topicsItems.map((topic) => (
                <TopicItem key={topic._id} topic={topic} courseId={courseId} courseName={courseName} isDark={isDark} topicsId={topicsId} />
            ))}
        </ul>
    );
};

const TopicItem = ({ topic, courseId, courseName, isDark, topicsId }: { topic: Topic, courseId: string, courseName: string, isDark: boolean, topicsId: string }) => {
    const titleRef = useRef<HTMLSpanElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const checkOverflow = () => {
        setTimeout(() => {
            if (titleRef.current && containerRef.current) {
                setIsOverflowing(titleRef.current.scrollWidth > containerRef.current.clientWidth);
            }
        }, 0);
    };

    useEffect(() => {
        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [topic.title]);

    return (
        <li className={`py-3 px-4 shadow-md rounded-sm flex justify-between items-center border transition
            ${isDark ? "bg-gray-900 border-gray-600 hover:shadow-lg" : "bg-white border-gray-200 hover:shadow-lg"}`}>

            <div ref={containerRef} className="relative overflow-hidden">
                <span
                    ref={titleRef}
                    className={`text-lg font-semibold inline-block transition-all 
                        ${isDark ? "text-gray-200" : "text-gray-800"}
                        ${isOverflowing ? "animate-marquee" : ""}`}
                >
                    {topic.title}
                </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 ms-2">
                {topic.notes_url && (
                    <Link
                        to={`/courses/${courseName}/topics/${topicsId}/notes/${topic._id}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition
                        ${isDark ? "bg-green-500 hover:bg-green-600 text-white" : "bg-green-400 hover:bg-green-600 text-white"}`}
                    >
                        📄
                    </Link>
                )}
                <Link
                    to={`/courses/${courseName}/topics/${topicsId}/video/${topic._id}?courseId=${courseId}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition
                        ${isDark ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-400 hover:bg-blue-600 text-white"}`}
                >
                    🎥
                </Link>

            </div>
        </li>
    );
};

export default TabNav;
