import { Frown } from "lucide-react";

const NoData = ({ message, entity }: { message?: string; entity: string }) => {
    return (
        <div className="flex flex-col items-center justify-center flex-1 h-full mt-12 pt-12 text-gray-500">
            <Frown size={48} className="mb-4 text-gray-400 animate-pulse" />
            <p className="text-xl font-semibold">{message || `No ${entity} found.`}</p>
        </div>
    );
};

export default NoData;
