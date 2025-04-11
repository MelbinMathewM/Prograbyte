import { useCallback, useContext, useEffect, useState } from "react";
import { Award, BookOpen, ChevronLeft, ChevronRight, Crown, Heart, Settings, Upload, Wallet } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, updateProfileInfo } from "@/api/profile";
import { UserContext } from "@/contexts/user-context";
import toast from "react-hot-toast";
import default_image from "/default-user.avif";
import CropImageModal from "@/components/ui/crop-image-modal";
import UserDetails from "@/components/students/profile/profile-user-details";
import { getCroppedImage } from "@/libs/imageCropper";
import SkillPart from "@/components/students/profile/profile-skill";
import { Profile, CroppedArea } from "@/types/user";
import ProfileBlogs from "@/components/students/profile/profile-blogs";


export default function ProfilePage() {


    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    const { user, logout } = useContext(UserContext) ?? {};
    const [userData, setUserData] = useState<{ id?: string; username?: string }>({});

    useEffect(() => {
        if (user) {
            setUserData({
                id: user.id,
                username: user.username
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
        isBlocked: false
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);
    const [skills, setSkills] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData.id === undefined) return;
        fetchProfile();
    }, [userData]);

    const fetchProfile = async () => {
        try {
            if (!userData.id) return;
            const response = await getProfile(userData.id);
            setProfile(response.user);
            setSkills(response.user.skills);
        } catch (error: any) {
            toast.error(error.error || "Failed to load profile");
        }
    };

    const updateProfile = async (field: string, value: string) => {
        try {
            const response = await updateProfileInfo(user?.id as string, { [field]: value });
            toast.success(response.message);
            if(field === "email"){
                setProfile((prev) => ({...prev, [field]: value, isEmailVerified: false}))
            }else{
                setProfile((prev) => ({ ...prev, [field]: value }));
            }
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
                    <ChevronLeft size={16} />
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
                    <div className="grid grid-cols-1 md:grid-cols-3 ">

                        {/* Profile Navigation Buttons */}
                        <div className="col-span-1 md:col-span-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 w-full">
                                {[
                                    { label: "My Courses", icon: BookOpen, link: "/profile/my-courses" },
                                    { label: "Wishlist", icon: Heart, link: "/wishlist" },
                                    { label: "Wallet", icon: Wallet, link: "/wallet" },
                                    { label: "Certificates", icon: Award, link: "/certificates" },
                                    { label: "Settings", icon: Settings, link: "/settings" },
                                    { label: "Premium", icon: Crown, link: "/profile/premium" }
                                ].map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.link}
                                        className={`p-2 flex flex-col items-center justify-center rounded-lg shadow-md transition-all 
                                        ${isDark ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                    >
                                        <item.icon size={24} />
                                        <p className="mt-1 text-sm">{item.label}</p>
                                    </Link>
                                ))}
                            </div>

                        </div>

                        {/* Skills Section */}
                        <div className="col-span-3 mt-6">
                            <SkillPart skills={skills} isDark={isDark} userId={profile?._id as string} setSkills={setSkills} />
                            <ProfileBlogs userId={userData.id as string} isDark={isDark} />
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