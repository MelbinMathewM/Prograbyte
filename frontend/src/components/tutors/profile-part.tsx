import { useCallback, useContext, useEffect, useState } from "react";
import { Award, BookOpen, ChevronLeft, ChevronRight, Upload, Wallet, Users, DollarSign, Edit2 } from "lucide-react";
import { useTheme } from "../../contexts/theme-context";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, updateProfileInfo } from "../../api/profile";
import { TutorContext } from "../../contexts/tutor-context";
import toast from "react-hot-toast";
import default_image from "/default-user.avif";
import CropImageModal from "../ui/crop-image-modal";
import TutorDetails from "./profile-tutor-details";
import { getCroppedImage } from "../../libs/imageCropper";
import SkillPart from "./profile-skill";
import { Profile, CroppedArea } from "../../types/user";

export default function TutorProfilePart() {
    const { theme } = useTheme();
    console.log(theme,'theme')
    const isDark = theme.includes("dark");

    const { tutor, logout } = useContext(TutorContext) ?? {};
    const [profile, setProfile] = useState<Profile>({
        _id: "",
        name: "",
        email: "",
        profileImage: null,
        bio: "",
        skills: [],
        role: "tutor",
        isEmailVerified: false
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [skills, setSkills] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!tutor?.id) return;
        fetchProfile();
    }, [tutor]);

    const fetchProfile = async () => {
        try {
            console.log(tutor, 'user')
            if (!tutor?.id) return;
            const res = await getProfile(tutor.id);
            setProfile(res);
            setSkills(res.skills);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to load profile");
        }
    };

    const updateProfile = async (field: string, value: string) => {
        try {
            const response = await updateProfileInfo(tutor?.id as string, { [field]: value });
            toast.success(response.message);
            setProfile((prev) => ({ ...prev, [field]: value }));
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to update field");
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

    const handleLogout = () => {
        if (logout) {
            logout();
        }
    };

    return (
        <div className={`min-h-screen p-6 ${isDark ? "bg-[#1c1e1f] text-white" : "bg-[#f7f8f9] text-[#333]"}`}>
            <nav className={`my-4 p-4 rounded text-sm flex items-center ${isDark ? "text-gray-300 bg-gray-700 shadow-lg" : "text-gray-600 bg-white shadow-lg"}`}>
                <Link to="/tutor/dashboard" className="hover:text-blue-500">Dashboard</Link>
                <ChevronRight size={16} />
                <span>Profile</span>
            </nav>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Profile</h2>
                <button onClick={() => navigate(-1)} className="px-4 py-2 flex items-center gap-2 rounded-md font-bold bg-blue-500 text-white hover:bg-blue-600">
                    <ChevronLeft size={16} /> Back
                </button>
            </div>

            <div className={`shadow-lg rounded-lg p-6 flex items-center space-x-6 ${isDark ? "bg-[#272928]" : "bg-[#ffffff]"}`}>
                <div className="relative">
                    <img src={profile?.profileImage || default_image} alt="Profile" className="w-28 h-28 rounded-full border-4 border-gray-300 object-cover" />
                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                        <Upload size={18} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold">{profile?.name}</h1>
                            <p className="text-gray-500">{profile?.username}</p>
                        </div>
                    </div>
                </div>
            </div>

            <CropImageModal modalOpen={modalOpen} setModalOpen={setModalOpen} imageSrc={imageSrc} crop={crop} setCrop={setCrop} zoom={zoom} setZoom={setZoom} onCropComplete={onCropComplete} getCroppedImage={handleCroppedImage} isDark={isDark} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <TutorDetails profile={profile} isDark={isDark} updateProfile={updateProfile} />
                <div className="col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                        {[{ label: "My Courses", icon: BookOpen, link: "/tutor/profile/my-courses" },
                        { label: "My Students", icon: Users, link: "/my-students" },
                        { label: "Earnings", icon: DollarSign, link: "/earnings" },
                        { label: "Wallet", icon: Wallet, link: "/wallet" },
                        { label: "Certificates", icon: Award, link: "/certificates" }].map((item, index) => (
                            <Link key={index} to={item.link} className={`p-4 flex flex-col items-center rounded-lg shadow-md transition ${isDark ? "bg-[#272928] hover:bg-gray-700 text-white" : "bg-[#ffffff] hover:bg-grey-200 text-gray-700 hover:bg-gray-200"}`}>
                                <item.icon size={28} />
                                <p className="mt-2 text-sm font-semibold">{item.label}</p>
                            </Link>
                        ))}
                    </div>
                    <SkillPart skills={skills} isDark={isDark} userId={profile?._id as string} setSkills={setSkills} />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md font-bold hover:bg-red-600">Logout</button>
            </div>
        </div>
    );
}