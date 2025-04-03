import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";

const AccordionItem = ({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex justify-between items-center p-4 font-medium transition
                    ${isDark ? "bg-gray-800 text-gray-200 hover:bg-gray-700" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}
                `}
            >
                {title}
                <FaChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                exit={{ height: 0, opacity: 0 }}
                className={`overflow-hidden border-t transition-all
                    ${isDark ? "bg-gray-900 text-gray-300 border-gray-700" : "bg-white text-gray-900 border-gray-200"}
                `}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default AccordionItem;
