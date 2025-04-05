import { FaPlay, FaCheckCircle, FaChalkboardTeacher, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

const features = [
    {
        title: "Expert Instructors",
        desc: "Learn from top professionals in the field with real-world experience.",
        icon: <FaChalkboardTeacher />,
        image: "/images/expert-teacher.jpg",
    },
    {
        title: "Hands-on Projects",
        desc: "Gain practical experience with real-world projects and interactive learning.",
        icon: <FaCheckCircle />,
        image: "/images/hands-on.jpg",
    },
    {
        title: "Flexible Schedule",
        desc: "Learn at your own pace, anytime, anywhere, with lifetime access.",
        icon: <FaClock />,
        image: "/images/flexible-learning.jpg",
    },
];

const LandingPagePart = () => {

    return (
        <div className="bg-gray-50 text-gray-900">
            {/* Hero Section */}
            <header className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white text-center py-20 px-6">
                <motion.h1
                    className="text-5xl font-extrabold leading-tight"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Unlock Your Potential with Prograbyte
                </motion.h1>
                <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
                    Learn from industry experts, master in-demand skills, and build your future with the best online courses.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <a href="/register" className="bg-white text-red-500 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition">
                        Get Started
                    </a>
                    <a href="/login" className="flex items-center bg-transparent border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-red-500 transition">
                        <FaPlay className="mr-2" /> Login
                    </a>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-16 px-6 text-center">
                <h2 className="text-4xl font-bold mb-10 text-gray-900">Why Learn with <span className="text-blue-600 italic">Prograbyte?</span></h2>
                <div className="space-y-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={`flex flex-col-reverse md:flex-row items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                        >
                            {/* Text Section */}
                            <div className="md:w-1/2 text-left">
                                <div className="text-5xl text-blue-500 mb-4">{feature.icon}</div>
                                <h3 className="text-2xl font-semibold text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 mt-2 text-lg">{feature.desc}</p>
                            </div>

                            {/* Image Section */}
                            <div className="md:w-1/2">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="rounded-xl shadow-lg hover:scale-105 transition duration-300"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Tutor Registration Section */}
            <section className="py-16 px-6 text-center bg-white">
                <h2 className="text-3xl font-bold text-gray-900">Become an Instructor</h2>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                    Share your expertise, inspire students, and earn revenue by teaching online. Join Codeon as an instructor today!
                </p>
                <div className="mt-6 flex justify-center">
                    <a href="/tutor-register" className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition">
                        Apply Now
                    </a>
                </div>
            </section>


            {/* Testimonials Section */}
            <TestimonialCarousel />

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-8 px-6 text-center">
                <p>&copy; {new Date().getFullYear()} Codeon. All rights reserved.</p>
                <div className="mt-4 flex justify-center space-x-4">
                    <a href="/privacy" className="hover:underline">Privacy Policy</a>
                    <a href="/terms" className="hover:underline">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPagePart;

const TestimonialCarousel = () => {
    const testimonials = [
        { name: "Sarah M.", feedback: "Codeon helped me land my dream job!", image: "/images/user1.jpg" },
        { name: "John D.", feedback: "The best courses with expert instructors.", image: "/images/user2.jpg" },
        { name: "Lisa R.", feedback: "The hands-on projects were game-changers!", image: "/images/user3.jpg" },
    ];

    return (
        <section className="bg-gray-100 py-16 px-6 text-center">
            <h2 className="text-3xl font-bold mb-10">What Our Students Say</h2>
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="w-full max-w-3xl mx-auto"
            >
                {testimonials.map((testimonial, index) => (
                    <SwiperSlide key={index}>
                        <div className="p-6 rounded-lg bg-white shadow-md flex flex-col items-center text-center">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-20 h-20 rounded-full mb-4 object-cover border-2 border-red-500"
                            />
                            <p className="text-gray-700 italic">"{testimonial.feedback}"</p>
                            <h4 className="text-lg font-semibold mt-4 text-red-500">{testimonial.name}</h4>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};
