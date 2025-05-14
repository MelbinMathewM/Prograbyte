import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { UserContext } from "@/contexts/user-context";
import { useTheme } from "@/contexts/theme-context";
import { addPost, getBlogProfile, getPosts } from "@/api/blog";
import { Blog, BlogProfile } from "@/types/blog";
import { User } from "@/types/user";
import AddBlogModal from "@/components/students/blog/add-blog";
import BlogList from "@/components/students/blog/blog-list";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AddComment, Chat } from "@mui/icons-material";
import Breadcrumb from "../breadcrumb";
import HeaderWithBack from "../header-back";

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
  }, [userData]);

  const fetchBlogProfile = async () => {
    if (!userData?.id) return;
    try {
      const response = await getBlogProfile(userData?.id as string);
      console.log(response.profile, 'hsiu')
      setBlogProfile(response.profile);
    } catch (err: any) {
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
      const response = await addPost(formData);
      toast.success(response.message);
      setBlogs((prev) => [...prev, response.blog]);
      setIsLoading(false);
      clearModalData();
    } catch (err: any) {
      console.error("Failed to add post:", err?.error || err.message);
    }
  };

  return (
    <div className={`p-8 min-h-screen ${isDark ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"} font-medium`}>

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        isDark={isDark}
        items={[
          { label: "Home", to: "/home" },
          { label: "Blog" },
        ]}
      />

      {/* Title and Back Button */}
      <HeaderWithBack
        title="Blog"
        isDark={isDark}
      />

      {/* Toggle Profile on small screens */}
      <div className="sm:hidden mb-4 flex w-full gap-4">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className={`px-4 py-2 rounded-md font-bold w-full ${isDark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white shadow-md hover:bg-gray-100 text-gray-800"}`}
        >
          {showProfile ? "Hide Profile" : "Show Profile"}
        </button>

        <div className="flex w-full gap-2">
          <button
            onClick={() => setAddModalOpen(true)}
            className="cursor-pointer flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-bold justify-center w-3/4"
          >
            <AddComment /> Blog
          </button>

          <button
            onClick={() => navigate('/blog/chat')}
            className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-bold w-1/4 flex justify-center items-center"
          >
            <Chat />
          </button>
        </div>

      </div>

      {showProfile && (
        <div className="sm:hidden mb-4 p-4 rounded-sm border shadow-md">
          <div className="flex flex-col items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${userData?.username || "User"}&background=random`}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border mb-4"
            />
            <h3 className="text-lg font-semibold">{blogProfile?.username || "Alex Johnson"}</h3>

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
              src={`https://ui-avatars.com/api/?name=${userData?.username || "User"}&background=random`}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border mb-4"
            />

            <h3 className="text-lg font-semibold">{blogProfile?.username || "Alex Johnson"}</h3>

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

            <div className="flex w-full gap-1 mt-2">
              <button
                onClick={() => setAddModalOpen(true)}
                className="cursor-pointer flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-sm font-bold justify-center w-3/4"
              >
                <AddComment /> Blog
              </button>

              <button
                onClick={() => navigate('/blog/chat')}
                className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-sm font-bold w-1/4 flex justify-center items-center"
              >
                <Chat />
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
