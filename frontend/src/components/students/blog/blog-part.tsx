import { useState, useContext, useEffect } from "react";
import {
  FaUserPlus,
  FaPlus,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { UserContext } from "@/contexts/user-context";
import { useTheme } from "@/contexts/theme-context";
import { addPost, getPosts } from "@/api/blog";
import { Blog } from "@/types/blog";
import { User } from "@/types/user";
import AddBlogModal from "./add-blog";
import BlogList from "./blog-list";

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
      await addPost(formData);
      fetchBlogs();
      setIsLoading(false);
      clearModalData();
    } catch (err: any) {
      console.error("Failed to add post:", err.response?.data?.error || err.message);
    }
  };

  return (
    <div
      className={`p-8 min-h-screen flex gap-8 ${isDark ? "bg-black text-gray-200" : "bg-white text-gray-900"} font-medium`}
    >
      {/* Left Side - Blog Section */}
      <div className="w-full max-w-5xl">

        <div className="flex justify-end mb-8">
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm"
          >
            <FaPlus /> Add Blog
          </button>
        </div>

        {/* Blog List */}
        <BlogList userId={user?.id as string} username={user?.username as string} isDark={isDark} blogs={blogs} setBlogs={setBlogs}/>
      </div>

      {/* Right Side - Profile Section */}
      <motion.div
        className={`w-80 p-6 rounded-xl border h-fit sticky top-20 ${isDark ? "border-gray-700 bg-gray-900 text-gray-200" : "border-gray-300 bg-gray-50 text-gray-800"}`}
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
          <h3 className="text-lg font-semibold">{userData?.username || "Alex Johnson"}</h3>
          <p className="mt-1 text-xs text-gray-500">Full Stack Developer</p>

          <div className="flex justify-between w-full mt-6 text-center text-sm">
            <div>
              <p className="font-bold">150</p>
              <p className="text-gray-500">Friends</p>
            </div>
            <div>
              <p className="font-bold">35</p>
              <p className="text-gray-500">Posts</p>
            </div>
            <div>
              <p className="font-bold">22</p>
              <p className="text-gray-500">Followers</p>
            </div>
          </div>

          <button className="mt-6 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm">
            <FaUserPlus /> Add Friend
          </button>
        </div>
      </motion.div>

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
