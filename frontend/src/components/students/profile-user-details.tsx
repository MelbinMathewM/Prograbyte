import { useState, useRef, useEffect } from "react";
import { Check, Pencil } from "lucide-react";

interface Profile {
    _id?: string;
    name: string;
    email: string;
    username?: string;
    profileImage: string | null;
    bio?: string;
    skills: string[];
    role: string;
    isEmailVerified: boolean;
    myCourses: any[];
}

interface UserDetailsProps {
    profile: Profile;
    isDark: boolean;
    updateProfile: (key: string, value: string) => void;
}

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
                        <div>
                            <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}>{item.label}</p>
                            {editingField === item.key ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={updatedValue}
                                        onChange={(e) => setUpdatedValue(e.target.value)}
                                        autoFocus
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                    <div ref={checkRef}>
                                        <Check
                                            className="text-green-500 cursor-pointer"
                                            size={18}
                                            onClick={() => {
                                                if (updatedValue.trim()) {
                                                    updateProfile(item.key, updatedValue);
                                                }
                                                setEditingField(null);
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="font-medium">{item.value}</p>
                            )}
                        </div>
                        {editingField !== item.key && (
                            <Pencil
                                className={`${isDark ? "text-gray-300" : "text-gray-500"} cursor-pointer`}
                                size={16}
                                onClick={() => {
                                    setEditingField(item.key);
                                    setUpdatedValue(item.value);
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDetails;
