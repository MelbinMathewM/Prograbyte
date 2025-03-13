import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Loader = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    
    
    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500); 
        return () => clearTimeout(timeout);
    }, [location]);

    return (
        loading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="flex items-center space-x-3 text-white">
                    <LoaderCircle className="animate-spin" size={32} />
                    <span className="text-lg">Loading...</span>
                </div>
            </div>
        )
    );
};

export default Loader;
