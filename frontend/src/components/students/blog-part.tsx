import { useState, useContext, useEffect } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaCommentDots,
  FaUserPlus,
  FaPlus,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { UserContext } from "@/contexts/user-context";
import { User } from "@/types/user";
import { addPost, getPosts } from "@/api/blog";
import { useTheme } from "@/contexts/theme-context";
import { Blog } from "@/types/blog";

const BlogPart = () => {
  const { user } = useContext(UserContext) ?? {};
  const { theme } = useTheme();
  const isDark = theme === "dark-theme";

  const [userData, setUserData] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", content: "" });

  // Set user data when user context changes
  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  // Fetch blogs from API
  const getBlogs = async () => {
    try {
      const response = await getPosts();
      setBlogs(response.blogs);
    } catch (err: any) {
      console.error("Failed to fetch blogs:", err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const toggleLike = (id: string) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((likeId) => likeId !== id) : [...prev, id]
    );
  };

  const handleAddBlog = async () => {
    if (!newBlog.title || !newBlog.content) return;

    const blogData = {
      user_id: userData?.id as string,
      title: newBlog.title,
      content: newBlog.content,
      username: userData?.username || "Unknown",
    };

    try {
      const response = await addPost(blogData);
      setBlogs([response.post, ...blogs]);
      setNewBlog({ title: "", content: "" });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to add post:", err.response?.data?.error || err.message);
    }
  };

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-4 gap-8 p-8 min-h-screen ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200"
          : "bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-gray-800"
      }`}
    >
      {/* Blog List */}
      <div className="lg:col-span-3 space-y-8 max-h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-indigo-300 relative">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`mb-6 ${
            isDark ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"
          } text-white px-6 py-3 rounded-xl transition flex items-center gap-2`}
        >
          <FaPlus /> Add Blog
        </button>

        {blogs.map((blog) => (
          <motion.div
            key={blog._id}
            className={`p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all ${
              isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4 mb-4">
              {blog?.images && (
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.images}`}
                  alt={blog.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-bold">{blog.title}</h2>
                <p className="text-sm text-gray-500">By {blog.username}</p>
              </div>
            </div>
            <p className="mb-6 leading-relaxed">{blog.content}</p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => toggleLike(blog._id)}
                className={`flex items-center gap-2 ${
                  liked.includes(blog._id) ? "text-red-500" : "text-gray-400"
                } hover:text-red-500`}
              >
                {liked.includes(blog._id) ? <FaHeart /> : <FaRegHeart />}
                <span>{liked.includes(blog._id) ? "Liked" : "Like"}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500">
                <FaCommentDots />
                <span>12 Comments</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Profile */}
      <motion.div
        className={`p-8 rounded-3xl shadow-lg h-fit sticky top-8 ${
          isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        }`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || "User"}`}
            alt="User"
            className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-indigo-200"
          />

          <h3 className="text-2xl font-semibold">
            {userData?.username || "Alex Johnson"}
          </h3>
          <p className="text-gray-500 mb-6">Full Stack Developer</p>

          <div className="flex justify-between w-full text-center mb-6">
            <div>
              <p className="text-xl font-bold">150</p>
              <p className="text-sm">Friends</p>
            </div>
            <div>
              <p className="text-xl font-bold">35</p>
              <p className="text-sm">Posts</p>
            </div>
            <div>
              <p className="text-xl font-bold">22</p>
              <p className="text-sm">Followers</p>
            </div>
          </div>

          <button
            className={`flex items-center gap-2 ${
              isDark ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"
            } text-white px-6 py-3 rounded-xl transition`}
          >
            <FaUserPlus /> Add Friend
          </button>
        </div>
      </motion.div>

      {/* Add Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-8 rounded-3xl w-full max-w-lg shadow-xl ${
              isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">Add New Blog</h2>

            <input
              type="text"
              placeholder="Blog Title"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              className={`w-full mb-4 p-4 border rounded-xl ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                  : "text-black focus:ring-indigo-300"
              } focus:outline-none focus:ring-2`}
            />
            <textarea
              placeholder="Content"
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
              className={`w-full mb-6 p-4 border rounded-xl h-32 focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                  : "text-black focus:ring-indigo-300"
              }`}
            ></textarea>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-6 py-3 rounded-xl transition ${
                  isDark
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddBlog}
                className={`px-6 py-3 rounded-xl transition ${
                  isDark ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"
                } text-white`}
              >
                Add Blog
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BlogPart;
