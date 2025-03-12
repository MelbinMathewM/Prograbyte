import { useCallback, useContext, useEffect, useState } from "react";
import { Award, BookOpen, ChevronLeft, ChevronRight, Heart, Plus, Settings, Upload, Wallet, X } from "lucide-react";
import { useTheme } from "../../contexts/theme-context";
import { Link, useNavigate } from "react-router-dom";
import { addSkill, deleteSkill, editSkill, getProfile, updateProfileInfo } from "../../api/profile";
import { UserContext } from "../../contexts/user-context";
import toast from "react-hot-toast";
import default_image from "/default-user.avif";
import CropImageModal from "../ui/crop-image-modal";
import UserDetails from "./profile-user-details";
import { getCroppedImage } from "../../libs/imageCropper";

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
    const [newSkill, setNewSkill] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);
    const [editingSkill, setEditingSkill] = useState<{ oldSkill: string; newSkill: string } | null>(null);
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
        }
    };

    const updateProfile = async (field: string, value: string) => {
        try {
            const response = await updateProfileInfo(user?.id as string, { [field]: value });
            toast.success(response.message);
            setProfile((prev) => ({ ...prev, [field]: value }));
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.error || "Failed to update field");
            } else if (error.request) {
                console.error("No response from server. Please try again.");
            } else {
                console.error("An unexpected error occurred. Please try again.");
            }
        }
    };

    const handleAddSkill = async () => {
        if (!profile || !newSkill.trim()) return;
        try {
            const response = await addSkill(profile._id as string, newSkill);
            if (response.error) throw new Error(response.error);

            setProfile({ ...profile, skills: response.skills });
            setNewSkill("");
            toast.success(response.message);
        } catch (error: any) {
            toast.error(error.response.data.error);
        }
    };

    const handleRemoveSkill = async (skill: string) => {
        if (!profile) return;
        console.log('jiii')
        try {
            const response = await deleteSkill(profile._id as string, skill);
            if (response.error) throw new Error(response.error);

            setProfile({ ...profile, skills: response.skills });
            toast.success(response.message);
        } catch (error: any) {
            toast.error(error.response.data.error);
        }
    };

    const handleEditSkill = async () => {
        if (!profile || !editingSkill) return;
        try {
            const response = await editSkill(profile._id as string, editingSkill.oldSkill, editingSkill.newSkill);
            if (response.error) throw new Error(response.error);

            setProfile({ ...profile, skills: response.skills });
            setEditingSkill(null);
            toast.success(response.message);
        } catch (error: any) {
            toast.error(error.response.data.error);
        }
    };

    const { logout } = useContext(UserContext) || {};

    const handleLogout = () => {
        if (logout) {
            logout();
        }
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

    const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            const croppedImage = await getCroppedImage(imageSrc, croppedAreaPixels);
            await updateProfile("profileImage", croppedImage as string);
            setProfile((prev) => ({ ...prev, profileImage: croppedImage }));
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
                    src={profile?.profileImage || default_image}
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
            getCroppedImage={handleCroppedImage}
            isDark={isDark}
        />



        {/* User Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <UserDetails profile={profile} isDark={isDark} updateProfile={updateProfile} />
            <div className="col-span-1 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Profile Navigation Buttons */}
                    <div className="col-span-1 md:col-span-3">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { label: "My Courses", icon: BookOpen, link: "/my-courses" },
                                { label: "Wishlist", icon: Heart, link: "/wishlist" },
                                { label: "Wallet", icon: Wallet, link: "/wallet" },
                                { label: "Certificates", icon: Award, link: "/certificates" },
                                { label: "Settings", icon: Settings, link: "/settings" },
                            ].map((item, index) => (
                                <a key={index} href={item.link} className={`p-3 flex flex-col items-center justify-center rounded-lg shadow-md transition-all 
                                    ${isDark ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                                    <item.icon size={24} />
                                    <p className="mt-1 text-sm">{item.label}</p>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className={`p-6 col-span-1 md:col-span-3 rounded-lg shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
                        <h2 className={`text-xl font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-700"}`}>Skills</h2>
                        <div className="flex flex-wrap gap-3">
                            {profile?.skills.map((skill, index) => (
                                <div key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center">
                                    {skill}
                                    <X className="ml-2 cursor-pointer" size={14} onClick={() => handleRemoveSkill(skill)} />
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
                            <button className="bg-blue-500 text-white p-2 ml-2 rounded-lg flex items-center" onClick={handleAddSkill}>
                                <Plus size={16} className="mr-1" /> Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div className="mt-6">
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md">Logout</button>
        </div>
    </div>
);
}