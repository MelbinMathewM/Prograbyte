import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBlogs } from "@/api/blog";
import toast from "react-hot-toast";
import { Blog } from "@/types/blog";

interface PublicProfileBlogsProps {
  userId: string;
  isDark: boolean;
}

export default function PublicProfileBlogs({ userId, isDark }: PublicProfileBlogsProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;

  const fetchBlogs = async () => {
    try {
      const res = await getMyBlogs(userId);
      setBlogs(res.blogs);
    } catch (err) {
      toast.error("Failed to load blogs");
    }
  };

  useEffect(() => {
    if (userId) fetchBlogs();
  }, [userId]);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const paginatedBlogs = blogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);

  return (
    <div className={`mt-6 shadow-md rounded-lg p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <h3 className="text-xl font-semibold mb-4">Blogs</h3>

      {paginatedBlogs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {paginatedBlogs.map((blog) => (
            <div
              key={blog._id}
              className={`relative rounded-md shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl ${isDark ? "bg-gray-700" : "bg-white"}`}
            >
              {/* Blog Image */}
              <div className="relative">
                <img src={blog?.image} alt="Blog" className="w-full object-cover" />
              </div>

              {/* Blog Content */}
              <div className="p-4">
                <Link
                  to={`/blog/${blog._id}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {blog.title}
                </Link>
                <p className={`mt-2 line-clamp-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {blog.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>No blogs posted yet.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow 
            ${isDark ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-700"} 
            disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Prev
          </button>

          <span className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow 
            ${isDark ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-700"} 
            disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
