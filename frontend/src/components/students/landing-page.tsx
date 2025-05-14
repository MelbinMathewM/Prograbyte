import { FaPlay, FaCheckCircle, FaChalkboardTeacher, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import expert_image from "/expert-teachers.png";
import live_streaming from "/live-streaming.png";

const features = [
    {
        title: "Expert Instructors",
        desc: "Learn from top professionals in the field with real-world experience.",
        icon: <FaChalkboardTeacher />,
        image: expert_image,
    },
    {
        title: "Live Streaming Classes",
        desc: "Join real-time interactive classes and get your doubts solved instantly.",
        icon: <FaPlay />,
        image: live_streaming,
    },
    {
        title: "Industry Recognized Certification",
        desc: "Receive certificates upon completion that are valued by employers.",
        icon: <FaCheckCircle />,
        image: "/images/certification.jpg", // Add this image
    },
    {
        title: "Tech Blogs & Community",
        desc: "Read and share technical articles, coding tips, and real-world experiences from developers around the globe.",
        icon: <FaCheckCircle />,
        image: "/images/community-blogs.jpg", // Add this image
    },
];


const LandingPagePart = ({ isDark = false }: { isDark?: boolean }) => {
    const bg = isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900";
    const sectionBg = isDark ? "bg-gray-800" : "bg-white";
    const primaryText = isDark ? "text-white" : "text-gray-900";
    const secondaryText = isDark ? "text-gray-400" : "text-gray-600";

    return (
        <div className={bg}>
            {/* Hero */}
            <header className="relative bg-gradient-to-r from-red-600 to-pink-500 text-white text-center py-24 px-6">
                <motion.h1
                    className="text-5xl font-extrabold leading-tight"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Unlock Your Potential with <span className="italic">Prograbyte</span>
                </motion.h1>
                <p className="mt-4 text-lg text-gray-100 max-w-2xl mx-auto">
                    Learn from industry experts, master in-demand skills, and build your future.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <a
                        href="/register"
                        className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition"
                    >
                        Get Started
                    </a>
                    <a
                        href="/login"
                        className="flex items-center border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-red-600 transition"
                    >
                        <FaPlay className="mr-2" /> Login
                    </a>
                </div>
            </header>

            {/* Features */}
            <section className={`py-20 px-6 ${sectionBg}`}>
                <h2 className={`text-4xl font-bold mb-12 text-center ${primaryText}`}>
                    Why Learn with <span className="text-blue-500 italic">Prograbyte?</span>
                </h2>
                <div className="space-y-20">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={`flex flex-col-reverse md:flex-row items-center gap-10 ${
                                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                            }`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="md:w-1/2 text-left">
                                <div className="text-5xl text-blue-500 mb-4">{feature.icon}</div>
                                <h3 className={`text-2xl font-semibold ${primaryText}`}>{feature.title}</h3>
                                <p className={`mt-2 text-lg ${secondaryText}`}>{feature.desc}</p>
                            </div>
                            <div className="md:w-1/2">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="rounded-sm hover:scale-105 transition duration-300"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Tutor CTA */}
            <section className={`py-20 px-6 text-center ${isDark ? "bg-gray-950" : "bg-gray-100"}`}>
                <h2 className={`text-3xl font-bold ${primaryText}`}>Become an Instructor</h2>
                <p className={`mt-4 max-w-xl mx-auto ${secondaryText}`}>
                    Share your expertise, inspire students, and earn revenue by teaching online.
                </p>
                <div className="mt-6">
                    <a
                        href="/tutor-register"
                        className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-700 transition"
                    >
                        Apply Now
                    </a>
                </div>
            </section>

            {/* Testimonials */}
            <TestimonialCarousel isDark={isDark} />

            {/* Footer */}
            <footer className={`${isDark ? "bg-gray-950 text-gray-400" : "bg-gray-900 text-gray-300"} py-10 px-6 text-center`}>
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

const TestimonialCarousel = ({ isDark }: { isDark: boolean }) => {
    const testimonials = [
        {
            name: "Sarah M.",
            feedback: "Codeon helped me land my dream job with real-world projects!",
            image: "/images/user1.jpg", // Replace with real testimonials or stock avatars
        },
        {
            name: "John D.",
            feedback: "The instructors are highly experienced and super helpful.",
            image: "/images/user2.jpg",
        },
        {
            name: "Lisa R.",
            feedback: "The flexible schedule and quality content were perfect for me.",
            image: "/images/user3.jpg",
        },
    ];

    return (
        <section className={`${isDark ? "bg-gray-800" : "bg-gray-100"} py-16 px-6 text-center`}>
            <h2 className={`text-3xl font-bold mb-10 ${isDark ? "text-white" : "text-gray-900"}`}>
                What Our Students Say
            </h2>
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="w-full max-w-3xl mx-auto"
            >
                {testimonials.map((testimonial, index) => (
                    <SwiperSlide key={index}>
                        <div className="p-6 rounded-lg bg-white dark:bg-gray-700 shadow-lg flex flex-col items-center text-center">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-20 h-20 rounded-full mb-4 object-cover border-2 border-red-500"
                            />
                            <p className="text-gray-700 dark:text-gray-200 italic">"{testimonial.feedback}"</p>
                            <h4 className="text-lg font-semibold mt-4 text-red-500">{testimonial.name}</h4>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};
