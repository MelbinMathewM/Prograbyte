
const Accordion = ({ children, isDark }: { children: React.ReactNode, isDark: boolean }) => {
    return <div className={`space-y-2 mt-6 rounded-sm ${isDark ? "bg-gray-900" : "bg-white"}`}>{children}</div>;
};

export default Accordion;
