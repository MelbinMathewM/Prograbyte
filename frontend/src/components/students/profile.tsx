import { useContext, useState } from "react";
import { UserContext } from "../../contexts/user-context";
import axiosInstance from "../../axios/axiosConfig";
import { Link } from "react-router-dom";
import { Camera, Pencil, LogOut } from "lucide-react";

const ProfilePart = () => {
    const context = useContext(UserContext);
    if (!context) return null;
    
    const { user, logout } = context;
    const [editing, setEditing] = useState(false);
    const [bio, setBio] = useState(user?.bio || "");
    const [profilePic, setProfilePic] = useState(user?.profilePic || "");
    const [name, setName] = useState(user?.name || "");

    const handleSave = async () => {
        try {
            await axiosInstance.patch("/user/profile", { name, bio, profilePic });
            setEditing(false);
        } catch (error) {
            console.error("Error updating profile", error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            try {
                const { data } = await axiosInstance.post("/user/upload-image", formData);
                setProfilePic(data.imageUrl);
            } catch (error) {
                console.error("Image upload failed", error);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-md text-gray-900 dark:text-white transition-all duration-300">
            {/* Profile Picture */}
            <div className="relative w-28 h-28 mx-auto mb-4">
                <img 
                    src={profilePic || "/default-avatar.png"} 
                    alt="Profile" 
                    className="rounded-full w-full h-full object-cover border-4 border-gray-300 dark:border-gray-700"
                />
                <label className="absolute bottom-2 right-2 bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-md">
                    <Camera size={18} />
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                </label>
            </div>

            {/* Name & Bio */}
            <div className="text-center">
                {editing ? (
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="border dark:border-gray-700 p-2 rounded-md w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                ) : (
                    <h2 className="text-2xl font-bold">{name}</h2>
                )}
                {editing ? (
                    <textarea 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                        className="border dark:border-gray-700 p-2 rounded-md w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                ) : (
                    <p className="text-gray-600 dark:text-gray-400">{bio || "No bio added yet."}</p>
                )}
            </div>

            {/* Edit & Save Buttons */}
            <div className="mt-4 flex justify-center gap-3">
                {editing ? (
                    <button 
                        onClick={handleSave} 
                        className="px-5 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg shadow-md hover:bg-green-600 dark:hover:bg-green-500 transition"
                    >
                        Save
                    </button>
                ) : (
                    <button 
                        onClick={() => setEditing(true)} 
                        className="px-5 py-2 bg-gray-700 dark:bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-800 dark:hover:bg-gray-700 transition flex items-center gap-2"
                    >
                        <Pencil size={18} /> Edit Profile
                    </button>
                )}
            </div>

            {/* Navigation Links */}
            <div className="mt-6 flex flex-col gap-3">
                <Link to="/wishlist" className="block p-3 bg-blue-500 dark:bg-blue-600 text-white text-center rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-500 transition">
                    Wishlist
                </Link>
                <Link to="/my-courses" className="block p-3 bg-blue-700 dark:bg-blue-800 text-white text-center rounded-lg shadow-md hover:bg-blue-800 dark:hover:bg-blue-700 transition">
                    My Courses
                </Link>
            </div>

            {/* Logout */}
            <button 
                onClick={logout} 
                className="mt-4 w-full bg-red-500 dark:bg-red-600 text-white py-3 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-red-600 dark:hover:bg-red-500 transition"
            >
                <LogOut size={18} />
                Logout
            </button>
        </div>
    );
};

export default ProfilePart;
