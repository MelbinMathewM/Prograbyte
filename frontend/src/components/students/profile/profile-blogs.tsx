import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import { getMyBlogs, updateBlog, deleteBlog } from "@/api/blog";
import toast from "react-hot-toast";
import { Blog } from "@/types/blog";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";

interface ProfileBlogsSectionProps {
    userId: string;
    isDark: boolean;
}

export default function ProfileBlogsSection({ userId, isDark }: ProfileBlogsSectionProps) {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 4;
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);

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

    const openEditModal = (blog: Blog) => {
        setEditingBlog(blog);
        setEditTitle(blog.title);
        setEditContent(blog.content);
        setEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editingBlog) return;
        try {
            await updateBlog(editingBlog._id, {
                title: editTitle,
                content: editContent,
            });
            toast.success("Blog updated");
            setEditModalOpen(false);
            fetchBlogs();
        } catch (err) {
            toast.error("Failed to update blog");
        }
    };

    const openDeleteConfirm = (blog: Blog) => {
        setDeletingBlog(blog);
        setDeleteConfirm(true);
    };

    const handleDeleteBlog = async () => {
        if (!deletingBlog) return;
        try {
            await deleteBlog(deletingBlog._id);
            toast.success("Blog deleted");
            setDeleteConfirm(false);
            fetchBlogs();
        } catch (err) {
            toast.error("Failed to delete blog");
        }
    };

    const totalPages = Math.ceil(blogs.length / blogsPerPage);
    const paginatedBlogs = blogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);

    return (
        <div className={`mt-6 shadow-md rounded-lg p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-xl font-semibold mb-4">My Blogs</h3>

            {paginatedBlogs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {paginatedBlogs.map((blog) => (
                        <div 
                        key={blog._id} 
                        className={`relative rounded-md shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl ${isDark ? "bg-gray-700" : "bg-white"}`}
                      >
                        {/* Blog Image with Action Buttons */}
                        <div className="relative">
                          <img src={blog?.image} alt="Blog" className="w-full object-cover" />
                      
                          {/* Edit & Delete Buttons */}
                          <div className="absolute top-2 right-2 flex gap-2">
                            {/* Edit Button */}
                            <div className="relative group cursor-pointer">
                              <button 
                                onClick={() => openEditModal(blog)} 
                                className="bg-white p-1 rounded-full shadow hover:bg-blue-100"
                              >
                                <Pencil size={18} className="text-blue-500" />
                              </button>
                              <div className="absolute top-10 left-2/5 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap z-50">
                                Edit
                              </div>
                            </div>
                      
                            {/* Delete Button */}
                            <div className="relative group cursor-pointer">
                              <button 
                                onClick={() => openDeleteConfirm(blog)} 
                                className="bg-white p-1 rounded-full shadow hover:bg-red-100"
                              >
                                <Trash size={18} className="text-red-500" />
                              </button>
                              <div className="absolute top-10 left-2/5 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap z-50">
                                Delete
                              </div>
                            </div>
                          </div>
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
                        className={`flex items-center gap-2 px-4 py-2 rounded-sm shadow 
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
                        className={`flex items-center gap-2 px-4 py-2 rounded-sm shadow 
                        ${isDark ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-700"} 
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Edit Modal */}
            {editModalOpen && editingBlog && (
                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent className={`${isDark ? "bg-gray-800 text-white" : "bg-white text-black"} max-w-lg`}>
                        <DialogHeader>
                            <DialogTitle className={`${isDark ? "text-grey-200" : "text-black"}`}>Edit Blog</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium">Title</label>
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className={`w-full p-2 rounded ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Content</label>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows={4}
                                    className={`w-full p-2 rounded ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}
                                />
                            </div>
                        </div>
                        <p className="text-gray-400">*Cannot edit blog images</p>

                        <DialogFooter className="mt-6">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}


            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm}
                onClose={() => setDeleteConfirm(false)}
                onConfirm={handleDeleteBlog}
                title="Confirm Delete"
                message="Are you sure you want to delete this blog?"
                confirmText="Delete"
                cancelText="Cancel"
                isDark={isDark}
            />
        </div>
    );
}
