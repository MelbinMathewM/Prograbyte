interface ProgressProps {
    value: number; // Progress percentage (0 - 100)
    className?: string; // Additional styles if needed
}

const Progress: React.FC<ProgressProps> = ({ value, className = "" }) => {
    return (
        <div className={`w-full bg-gray-300 rounded-full overflow-hidden ${className}`}>
            <div 
                className="h-3 bg-green-500 transition-all duration-300" 
                style={{ width: `${value}%` }} 
            />
        </div>
    );
};

export default Progress;
