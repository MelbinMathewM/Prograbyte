import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicProfile, getProfile } from "@/api/profile";
import default_image from "/default-user.avif";
import { BlogProfile } from "@/types/blog";
import { useTheme } from "@/contexts/theme-context";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Profile } from "@/types/user";
import PublicProfileBlogs from "./public-profile-blogs";

export default function PublicProfilePage() {
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";
    const { username } = useParams<{ username: string }>();
    const [blogProfile, setBlogProfile] = useState<BlogProfile | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (username) fetchBlogProfile();
    }, [username]);

    useEffect(() => {
        if (blogProfile?._id) fetchDetailedProfile(blogProfile._id);
    }, [blogProfile]);

    const fetchBlogProfile = async () => {
        try {
            const res = await getPublicProfile(username as string);
            setBlogProfile(res.profile);
        } catch (err) {
            console.error("Failed to load public profile");
        }
    };

    const fetchDetailedProfile = async (userId: string) => {
        try {
            const res = await getProfile(userId);
            setProfile(res);
        } catch (err) {
            console.error("Failed to load detailed profile");
        }
    };

    if (!blogProfile || !profile) {
        return <div className={`p-6 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading...</div>;
    }

    return (
        <div className={`min-h-screen p-6 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
            {/* Breadcrumb */}
            <nav className={`${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-500"} p-6 rounded mb-4 flex items-center`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <Link to="/blog" className="font-bold hover:text-blue-500">Blog</Link>
                <ChevronRight size={16} />
                <span>Profile</span>
            </nav>

            {/* Header */}
            <div className="flex w-full sm:mx-auto justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Blog Profile</h2>
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"}`}
                >
                    <ChevronLeft size={16} /> Back
                </button>
            </div>

            {/* Profile Section */}
            <div className={`shadow-md rounded-lg p-6 flex items-center space-x-6 w-full ${isDark ? "bg-gray-850 border border-gray-700" : "bg-white"}`}>
                <img
                    src={profile?.profileImage || default_image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                />
                <div>
                    <h1 className="text-2xl font-semibold">{profile?.name}</h1>
                    <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>@{blogProfile.username}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-6">
                <div className={`shadow-md rounded-lg p-4 text-center ${isDark ? "bg-gray-850 border border-gray-700" : "bg-white"}`}>
                    <p className="text-xl font-bold">{blogProfile.followers.length}</p>
                    <span className="text-sm text-gray-500">Followers</span>
                </div>
                <div className={`shadow-md rounded-lg p-4 text-center ${isDark ? "bg-gray-850 border border-gray-700" : "bg-white"}`}>
                    <p className="text-xl font-bold">{blogProfile.following.length}</p>
                    <span className="text-sm text-gray-500">Following</span>
                </div>
                <div className={`shadow-md rounded-lg p-4 text-center ${isDark ? "bg-gray-850 border border-gray-700" : "bg-white"}`}>
                    <p className="text-xl font-bold">{blogProfile.totalPosts}</p>
                    <span className="text-sm text-gray-500">Posts</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-start">
                {/* Bio */}
                {profile?.bio && (
                    <div className={`shadow-md rounded-lg p-6 mt-6 ${isDark ? "bg-gray-850 border border-gray-700" : "bg-white"}`}>
                        <h3 className="text-xl font-semibold mb-2">Bio</h3>
                        <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>{profile.bio}</p>
                    </div>
                )}

                {/* Skills */}
                {profile?.skills?.length > 0 && (
                    <div className={`shadow-md rounded-lg p-6 mt-6 ${isDark ? "bg-gray-850 border border-gray-700" : "bg-white"}`}>
                        <h3 className="text-xl font-semibold mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-3">
                            {profile.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? "bg-gray-700 text-gray-200" : "bg-blue-100 text-blue-800"}`}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-start">
                {/* Followers */}
                <div className={`shadow-md rounded-lg p-6 mt-6 ${isDark ? "bg-gray-850 border border-gray-700" : "bg-white"}`}>
                    <h3 className="text-xl font-semibold mb-4">Followers</h3>
                    {blogProfile.followers.length ? (
                        <div className="flex flex-wrap gap-4">
                            {blogProfile.followers.map((follower: any) => (
                                <Link
                                    key={follower._id}
                                    to={`/profile/${follower.username}`}
                                    className={`px-4 py-2 rounded-lg ${isDark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-blue-200 text-blue-900 hover:bg-blue-300"}`}
                                >
                                    @{follower.username}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>No followers yet.</p>
                    )}
                </div>

                {/* Following */}
                <div className={`shadow-md rounded-lg p-6 mt-6 ${isDark ? "bg-gray-850 border border-gray-700" : "bg-white"}`}>
                    <h3 className="text-xl font-semibold mb-4">Following</h3>
                    {blogProfile.following.length ? (
                        <div className="flex flex-wrap gap-4">
                            {blogProfile.following.map((follow: any) => (
                                <Link
                                    key={follow._id}
                                    to={`/profile/${follow.username}`}
                                    className={`px-4 py-2 rounded-lg ${isDark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-green-200 text-green-900 hover:bg-green-300"}`}
                                >
                                    @{follow.username}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>Not following anyone yet.</p>
                    )}
                </div>
            </div>

            {/* Posts */}
            <div className={`shadow-md rounded-lg p-6 mt-6 ${isDark ? "bg-gray-850 border border-gray-700" : "bg-white"}`}>
                <h3 className="text-xl font-semibold mb-4">Posts</h3>
                <PublicProfileBlogs userId={blogProfile._id} isDark={isDark} />
            </div>
        </div>
    );
}
