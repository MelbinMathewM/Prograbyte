import { useContext, useEffect, useRef, useState } from "react";
import axiosInstance from "../../axios/axiosConfig";
import AccordionItem from "../ui/accordian-item";
import Accordion from "../ui/accordian";
import { useNavigate } from "react-router-dom";
import { addToWishlist, getWishlist, removeFromWishlist } from "../../api/wishlist";
import { UserContext } from "../../contexts/user-context";
import toast from "react-hot-toast";

interface Course {
    _id: string;
    title: string;
    description: string;
    tutor_id: string;
    category_id: { _id: string, name: string };
    price: number;
    rating: number | null;
    preview_video_urls: [string];
    poster_url: string;
    approval_status: "Pending" | "Approved" | "Rejected";
}

interface Topic {
    _id: string;
    course_id: string,
    title: string;
    level: "Basic" | "Intermediate" | "Advanced";
    video_url: string;
    notes_url: string;
}

const TabNav = ({ course, isDark }: { course: Course | null, isDark: boolean }) => {

    const [topics, setTopics] = useState<Topic[]>([]);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [activeTab, setActiveTab] = useState("about");
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        Basic: false,
        Intermediate: false,
        Advanced: false,
    });
    const navigate = useNavigate();
    const { user } = useContext(UserContext) ?? {};

    const toggleSection = (level: string) => {
        setOpenSections(prev => ({ ...prev, [level]: !prev[level] }));
    };

    useEffect(() => {
        const fetchTopics = async () => {
            if (!course) return;
            try {
                const response = await axiosInstance.get(`/course/topics/${course._id}`);
                setTopics(response.data);
            } catch (err) {
                console.error("Error fetching topics");
            }
        };
        fetchTopics();
    }, [course]);


    useEffect(() => {
        if (!user?.id) return;
        const fetchWishlist = async () => {
            try {
                const wishlist = await getWishlist(user?.id);
                setIsInWishlist(wishlist.items.includes(course?._id));
            } catch (error) {
                console.error("Error fetching wishlist", error);
            }
        };
        fetchWishlist();
    }, [course?._id, user?.id]);

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

    const categorizedTopics = {
        Basic: topics.filter(topic => topic.level === "Basic"),
        Intermediate: topics.filter(topic => topic.level === "Intermediate"),
        Advanced: topics.filter(topic => topic.level === "Advanced"),
    };

    return (
        <div className={`grid grid-cols-3 shadow-lg rounded p-3 gap-8 max-w-6xl mx-auto mt-8 ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            {/* Left - Main Content */}
            <div className="col-span-3 md:col-span-2">
                {/* Tab Navigation */}
                <div className={`border-b-2 shadow-lg rounded flex gap-4 ${isDark ? "border-gray-800" : "border-gray-300"}`}>
                    {["about", "content", "reviews"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 text-lg flex px-4 items-center justify-center font-semibold transition
                            ${activeTab === tab
                                    ? "text-red-500 border-b-2 border-red-500 hover:text-red-600 hover:border-red-600"
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
                                    <div className="flex items-center gap-4">
                                        <img src={course?.tutor_id} alt="Tutor" className="w-16 h-16 rounded-full" />
                                        <div>
                                            <h3 className="text-lg font-semibold">{course?.tutor_id}</h3>
                                            <p className="text-gray-600">{course?.tutor_id}</p>
                                        </div>
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        </div>

                    )}

                    {activeTab === "content" && (
                        <div>
                            <h2 className="text-2xl font-semibold">Course Content</h2>
                            <p className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Topics covered in this course:</p>
                            <div className="mt-4">
                                {Object.entries(categorizedTopics).map(([level, topics]) => (
                                    <div key={level} className={`mt-2 border rounded-lg ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                                        {/* Dropdown Header */}
                                        <button
                                            className={`w-full px-4 py-2 flex justify-between items-center font-semibold rounded-lg transition duration-300 cursor-pointer 
                                                    ${isDark
                                                    ? "outline outline-gray-600 text-gray-300 hover:bg-gray-700 hover:outline-gray-400"
                                                    : "outline outline-red-200 text-red-500 hover:outline-red-500 hover:bg-red-100"
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
                                            <div className={`p-4 rounded-b-lg shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
                                                {topics.length > 0 ? (
                                                    <TopicList topics={topics} courseName={course?.title as string} isDark={isDark} />
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
                </div>
            </div>

            {/* Right - Fixed Payment Section */}
            <div className={`col-span-3 md:col-span-1`}>
                <div className={`shadow-lg p-6 rounded-lg sticky top-20 ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                    <h3 className="text-xl font-semibold mb-3">Get the course today</h3>
                    {/* Course Options Dropdown */}
                    <select className={`w-full p-2 border rounded mb-3 ${isDark ? "bg-gray-700 text-gray-300 border-gray-600" : "text-gray-600 border-gray-300"}`}>
                        <option>Get course option</option>
                        <option>Video classes</option>
                        <option>Video + Live classes</option>
                    </select>
                    {/* Pricing */}
                    <div className="text-2xl font-bold text-red-500">
                        ₹{course?.price} <span className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"} line-through`}>₹999</span> <span className="text-white">only</span>
                    </div>
                    {/* Buttons */}
                    <button onClick={() => navigate(`/checkout/${course?._id}`)} className="w-full bg-red-700 text-white py-2 mt-3 rounded-lg font-semibold hover:bg-red-600">
                        Get Course
                    </button>
                    <button onClick={handleWishlistClick} className={`w-full mt-2 font-semibold ${isDark ? "text-red-400" : "text-red-700"}`}>
                        {isInWishlist ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
                    </button>
                </div>
            </div>
        </div>
    );
};


const TopicList = ({ topics, courseName, isDark }: { topics: Topic[], courseName: string, isDark: boolean }) => {
    return (
        <ul className={`grid grid-cols-1 md:grid-cols-2 gap-4 list-none ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {topics.map((topic) => (
                <TopicItem key={topic._id} topic={topic} courseName={courseName} isDark={isDark} />
            ))}
        </ul>
    );
};

const TopicItem = ({ topic, courseName, isDark }: { topic: Topic, courseName: string, isDark: boolean }) => {
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
        <li className={`py-3 px-4 shadow-md rounded-lg flex justify-between items-center border transition
            ${isDark ? "bg-gray-800 border-gray-600 hover:shadow-lg" : "bg-white border-gray-200 hover:shadow-lg"}`}>

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
                <a
                    href={`/courses/${courseName}/topics/video/${topic._id}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition
                        ${isDark ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-400 hover:bg-blue-600 text-white"}`}
                >
                    🎥
                </a>

                <a
                    href={`/courses/${courseName}/topics/notes/${topic._id}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition
                        ${isDark ? "bg-green-500 hover:bg-green-600 text-white" : "bg-green-400 hover:bg-green-600 text-white"}`}
                >
                    📄
                </a>
            </div>
        </li>
    );
};

export default TabNav;
