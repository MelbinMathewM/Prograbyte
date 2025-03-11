import { useCallback, useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Plus, Upload, X } from "lucide-react";
import { useTheme } from "../../contexts/theme-context";
import { Link, useNavigate } from "react-router-dom";
import { TutorContext } from "../../contexts/tutor-context";
import { getProfile, updateProfileInfo } from "../../api/profile";
import { UserContext } from "../../contexts/user-context";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import default_image from "/default-user.avif";
import CropImageModal from "../ui/crop-image-modal";

Modal.setAppElement("#root");

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

interface CroppedArea {
    width: number;
    height: number;
    x: number;
    y: number;
}

export default function ProfilePage() {


    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    const { user } = useContext(UserContext) ?? {};
    const [userData, setUserData] = useState<{ id?: string; email?: string; name?: string }>({});

    useEffect(() => {
        if (user) {
            setUserData({
                id: user.id,
                email: user.email,
                name: user.name,
            });
        }
    }, [user]);


    const [profile, setProfile] = useState<Profile>({
        _id: "",
        name: "",
        email: "",
        username: "",
        profileImage: null,
        bio: "",
        skills: [],
        role: "",
        isEmailVerified: false,
        myCourses: [],
    });
    const [loading, setLoading] = useState(true);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [updatedValue, setUpdatedValue] = useState("");
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData.id === undefined) return;
        fetchProfile();
    }, [userData]);

    const fetchProfile = async () => {
        try {
            if (!userData.id) return;
            const res = await getProfile(userData.id);
            console.log(res, 'res')
            setProfile(res);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (field: string, value: string) => {
        try {
            const response = await updateProfileInfo(user?.id as string, { [field]: value });
            toast.success(response.message);
            setProfile((prev) => ({ ...prev, [field]: value }));
            setEditingField(null);
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.error || "Failed to update field");
            } else if (error.request) {
                toast.error("No response from server. Please try again.");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !profile.skills.includes(newSkill)) {
            setProfile({ ...profile, skills: [...profile.skills, newSkill] });
            setNewSkill("");
        }
    };

    const { logout } = useContext(TutorContext) || {};

    const handleLogout = () => {
        if (logout) {
            logout();
        }
    };

    const removeSkill = (skill: string) => {
        setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        const image = new Image();
        image.src = imageSrc;
        await new Promise((resolve) => (image.onload = resolve));

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        );

        const base64Image = canvas.toDataURL("image/jpeg");

        try {
            await updateProfile("profileImage", base64Image);
            setProfile((prev) => ({ ...prev, profileImage: base64Image }));
            setModalOpen(false);
        } catch (error) {
            setModalOpen(false);
        }
    };

    return (
        <div className={`min-h-screen p-6 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
            <nav className={`${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-500"} p-6 rounded mb-4 flex items-center`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <span>Profile</span>
            </nav>
            <div className="flex w-full sm:mx-auto justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Profile</h2>
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"}`}
                >
                    <ChevronLeft className="mt-1" size={16} />
                    Back
                </button>
            </div>
            {/* Profile Section */}
            <div className={`shadow-md rounded-lg p-6 flex items-center space-x-6 w-full ${isDark ? "bg-gray-800" : "bg-white"}`}>
                <div className="relative">
                    <img
                        src={croppedImage || profile?.profileImage || default_image}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                        <Upload size={16} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>
                <div>
                    <h1 className="text-2xl font-semibold">{profile?.name}</h1>
                    <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>{profile?.username || "No Username"}</p>
                </div>
            </div>

            {/* Crop Modal */}
            <CropImageModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                imageSrc={imageSrc}
                crop={crop}
                setCrop={setCrop}
                zoom={zoom}
                setZoom={setZoom}
                onCropComplete={onCropComplete}
                getCroppedImage={getCroppedImage}
                isDark={isDark}
            />



            {/* User Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
                    <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-700"}`}>User Details</h2>
                    <div className="space-y-4">
                        {[
                            { label: "Name", key: "name", value: profile?.name },
                            { label: "Email", key: "email", value: profile?.email },
                            { label: "Username", key: "username", value: profile?.username || "N/A" },
                            { label: "Bio", key: "bio", value: profile?.bio || "No bio yet" },
                        ].map((item, index) => (
                            <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                                <div>
                                    <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}>{item.label}</p>
                                    {editingField === item.key ? (
                                        <input
                                            type="text"
                                            value={updatedValue}
                                            onChange={(e) => setUpdatedValue(e.target.value)}
                                            onBlur={() => updateProfile(item.key, updatedValue)}
                                            autoFocus
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    ) : (
                                        <p className="font-medium">{item.value}</p>
                                    )}
                                </div>
                                <Pencil
                                    className={`${isDark ? "text-gray-300" : "text-gray-500"} cursor-pointer`}
                                    size={16}
                                    onClick={() => {
                                        setEditingField(item.key);
                                        setUpdatedValue(item.value);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Skills Section */}
                <div className={`p-6 col-span-1 md:col-span-2 rounded-lg shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
                    <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-700"}`}>Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {profile?.skills.map((skill, index) => (
                            <div key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center">
                                {skill}
                                <X className="ml-2 cursor-pointer" size={14} onClick={() => removeSkill(skill)} />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center">
                        <input
                            type="text"
                            placeholder="Add a skill"
                            className={`border rounded-lg p-2 flex-1 ${isDark ? "bg-gray-700 text-white border-gray-500" : ""}`}
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                        />
                        <button className="bg-blue-500 text-white p-2 ml-2 rounded-lg flex items-center" onClick={addSkill}>
                            <Plus size={16} className="mr-1" /> Add
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md">Logout</button>
            </div>
        </div>
    );
}