import { useState, useRef, useEffect } from "react";
import { Check, CheckCircle2, Pencil, ShieldAlert } from "lucide-react";
import { UserDetailsProps } from "../../types/user";

const UserDetails: React.FC<UserDetailsProps> = ({ profile, isDark, updateProfile }) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [updatedValue, setUpdatedValue] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const checkRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current && !inputRef.current.contains(event.target as Node) &&
                checkRef.current && !checkRef.current.contains(event.target as Node)
            ) {
                setTimeout(() => setEditingField(null), 100);
            }
        };

        if (editingField) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [editingField]);

    const handleEmailVerification = () => {
        console.log("Trigger email verification");
    };

    return (
        <div className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-700"}`}>User Details</h2>
            <div className="space-y-4">
                {[
                    { label: "Name", key: "name", value: profile?.name },
                    { label: "Email", key: "email", value: profile?.email },
                    { label: "Username", key: "username", value: profile?.username || "N/A" },
                    { label: "Bio", key: "bio", value: profile?.bio || "No bio yet" },
                ].map((item) => (
                    <div key={item.key} className={`flex justify-between items-center p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                        <div className="w-full me-2">
                            <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}>{item.label}</p>
                            {editingField === item.key ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={updatedValue}
                                        onChange={(e) => setUpdatedValue(e.target.value)}
                                        autoFocus
                                        className={`w-full p-2 shadow-md rounded focus:outline-none ${isDark ? "bg-gray-800" : "bg-white" } focus:border-gray-400 transition duration-300`}
                                    />
                                </div>
                            ) : (
                                <p className="font-medium">{item.value}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {item.key === "email" && (
                                profile.isEmailVerified ? (
                                    <div className="relative group cursor-pointer">
                                        <CheckCircle2 className="text-blue-500 me-1" size={18} />
                                        <div
                                            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap"
                                        >
                                            Verified
                                        </div>
                                    </div>
                                    
                                ) : (
                                    <div
                                        className="relative group cursor-pointer"
                                        onClick={handleEmailVerification}
                                    >
                                        <div className="text-red-500 shadow-md transition duration-300">
                                            <ShieldAlert size={18} className="text-red-500 hover:text-red-600 me-1" />
                                        </div>
                                        <div
                                            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap"
                                        >
                                            Verify
                                        </div>
                                    </div>
                                )
                            )}

                            {editingField === item.key ? (
                                <div className="relative group cursor-pointer">
                                    <div ref={checkRef}>
                                        <Check
                                            className="text-green-500"
                                            size={18}
                                            onClick={() => {
                                                if (updatedValue.trim() && updatedValue !== item.value) {
                                                    updateProfile(item.key, updatedValue);
                                                }
                                                setEditingField(null);
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap"
                                    >
                                        Save
                                    </div>
                                </div>
                            ) : (
                                <div className="relative group cursor-pointer">
                                    <Pencil
                                        className={`${isDark ? "text-gray-300" : "text-gray-500"}`}
                                        size={16}
                                        onClick={() => {
                                            setEditingField(item.key);
                                            setUpdatedValue(item.value);
                                        }}
                                    />
                                    <div
                                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap"
                                    >
                                        Edit
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDetails;
