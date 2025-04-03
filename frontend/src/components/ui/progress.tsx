interface ProgressProps {
    value: number;
    isDark: boolean;
}

const Progress: React.FC<ProgressProps> = ({ value, isDark }) => {
    let progressColor = "bg-red-500";
    
    if (value >= 33 && value < 66) {
        progressColor = "bg-yellow-500";
    } else if (value >= 66 && value < 100) {
        progressColor = "bg-green-500";
    } else if (value === 100) {
        progressColor = "bg-blue-500";
    }

    const textColor = value < 50 ? "text-gray-800" : "text-white";
    const bgColor = isDark ? "bg-gray-700" : "bg-gray-300";

    return (
        <div className={`w-full ${bgColor} rounded-full overflow-hidden relative`}> 
            <div 
                className={`h-3 transition-all duration-300 ${progressColor}`} 
                style={{ width: `${value}%` }}
            />
            <span className={`absolute inset-0 flex justify-center items-center text-xs font-bold ${textColor}`}>
                {value}%
            </span>
        </div>
    );
};

export default Progress;