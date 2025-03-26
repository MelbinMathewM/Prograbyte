import { useState, useContext, useEffect } from "react";
import {
  FaUserPlus,
  FaPlus,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { UserContext } from "@/contexts/user-context";
import { useTheme } from "@/contexts/theme-context";
import { addPost, getBlogProfile, getPosts } from "@/api/blog";
import { Blog, BlogProfile } from "@/types/blog";
import { User } from "@/types/user";
import AddBlogModal from "./add-blog";
import BlogList from "./blog-list";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BlogPart = () => {
  const { user } = useContext(UserContext) ?? {};
  const { theme } = useTheme();
  const isDark = theme === "dark-theme";

  const [userData, setUserData] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState(false);
  const [blogProfile, setBlogProfile] = useState<BlogProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  const fetchBlogs = async () => {
    try {
      const response = await getPosts();
      setBlogs(response.blogs);
    } catch (err: any) {
      console.error("Failed to fetch blogs:", err.response?.data?.error || err.message);
    }
  };

  const clearModalData = () => {
    setNewTitle("");
    setNewContent("");
    setNewImage(null);
    setAddModalOpen(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    fetchBlogProfile();
  },[userData]);

  const fetchBlogProfile = async () => {
    if(!userData?.id) return;
    try{
      const response = await getBlogProfile(userData?.id as string);
      console.log(response.profile,'hsiu')
      setBlogProfile(response.profile);
    }catch(err: any){
      console.error("Failed to fetch blog profile:", err.response?.data?.error || err.message);
    }
  };

  const handleAddBlog = async () => {

    if (!newTitle || !newContent) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("user_id", userData?.id || "");
    formData.append("title", newTitle);
    formData.append("content", newContent);
    formData.append("username", userData?.username || "Unknown");
    if (newImage) formData.append("image", newImage);

    try {
      await addPost(formData, user?.id as string);
      fetchBlogs();
      setIsLoading(false);
      clearModalData();
    } catch (err: any) {
      console.error("Failed to add post:", err.response?.data?.error || err.message);
    }
  };

  return (
    <div className={`p-8 min-h-screen ${isDark ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"} font-medium`}>

      {/* Breadcrumb / Navbar */}
      <nav className={`${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-500"} p-6 rounded mb-8 flex items-center`}>
        <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
        <ChevronRight size={16} />
        <span>Blog</span>
      </nav>

      {/* Blog Header */}
      <div className="flex w-full sm:mx-auto justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Blog</h2>
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"}`}
        >
          <ChevronLeft size={16} />
          Back
        </button>
      </div>

      {/* Toggle Profile on small screens */}
      <div className="sm:hidden mb-4 flex w-full gap-4">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className={`px-4 py-2 rounded-md font-bold w-full ${isDark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white shadow-md hover:bg-gray-100 text-gray-800"}`}
        >
          {showProfile ? "Hide Profile" : "Show Profile"}
        </button>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-bold w-full justify-center"
        >
          <FaPlus /> Add Blog
        </button>
      </div>

      {showProfile && (
        <div className="sm:hidden mb-4 p-4 rounded-sm border shadow-md">
          <div className="flex flex-col items-center">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || "User"}`}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border mb-4"
            />
            <h3 className="text-lg font-semibold">{blogProfile?.username || "Alex Johnson"}</h3>
            <p className="mt-1 text-xs text-gray-500">Full Stack Developer</p>

            <div className="flex justify-between w-full mt-6 text-center text-sm">
              <div>
                <p className="font-bold">{blogProfile?.following.length}</p>
                <p className="text-gray-500">Following</p>
              </div>
              <div>
                <p className="font-bold">{blogProfile?.totalPosts}</p>
                <p className="text-gray-500">Posts</p>
              </div>
              <div>
                <p className="font-bold">{blogProfile?.followers.length}</p>
                <p className="text-gray-500">Followers</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-8 flex-col sm:flex-row">

        {/* Blog List */}
        <div className="w-full max-w-5xl">
          <BlogList userId={user?.id as string} username={user?.username as string} isDark={isDark} blogs={blogs} setBlogs={setBlogs} />
        </div>

        <motion.div
          className={`hidden sm:block w-80 p-6 rounded-sm border h-fit sticky top-20 ${isDark ? "border-gray-700 bg-gray-900 text-gray-200" : "border-gray-300 bg-gray-50 text-gray-800"}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col items-center">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || "User"}`}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border mb-4"
            />
            <h3 className="text-lg font-semibold">{blogProfile?.username || "Alex Johnson"}</h3>
            <p className="mt-1 text-xs text-gray-500">Full Stack Developer</p>

            <div className="flex justify-between w-full mt-6 text-center text-sm">
              <div>
                <p className="font-bold">{blogProfile?.following.length}</p>
                <p className="text-gray-500">Following</p>
              </div>
              <div>
                <p className="font-bold">{blogProfile?.totalPosts}</p>
                <p className="text-gray-500">Posts</p>
              </div>
              <div>
                <p className="font-bold">{blogProfile?.followers.length}</p>
                <p className="text-gray-500">Followers</p>
              </div>
            </div>

            <div className="flex justify-end mt-4 w-full">
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm w-full justify-center"
              >
                <FaPlus /> Add Blog
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Blog Modal */}
      <AddBlogModal
        isOpen={addModalOpen}
        onClose={clearModalData}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newContent={newContent}
        setNewContent={setNewContent}
        setNewImage={setNewImage}
        handleAddBlog={handleAddBlog}
        isDark={isDark}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BlogPart;
