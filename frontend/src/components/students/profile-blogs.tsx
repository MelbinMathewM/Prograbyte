import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, X, Trash } from "lucide-react";
import { getMyBlogs, updateBlog, deleteBlog } from "../../api/blog";
import toast from "react-hot-toast";
import { Blog } from "@/types/blog";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ConfirmDialog from "../ui/confirm-dialog";

interface ProfileBlogsSectionProps {
    userId: string;
    isDark: boolean;
}

export default function ProfileBlogsSection({ userId, isDark }: ProfileBlogsSectionProps) {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 4; // 4 per page (2 per row in md)
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editImages, setEditImages] = useState<string[]>([]);

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
        setEditImages(blog.images || []);
        setEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editingBlog) return;
        try {
            await updateBlog(editingBlog._id, {
                title: editTitle,
                content: editContent,
                images: editImages,
            });
            toast.success("Blog updated");
            setEditModalOpen(false);
            fetchBlogs();
        } catch (err) {
            toast.error("Failed to update blog");
        }
    };

    const handleRemoveImage = (index: number) => {
        setEditImages((prev) => prev.filter((_, i) => i !== index));
    };

    const openDeleteConfirm = (blog: Blog) => {
        setDeletingBlog(blog);
        setDeleteConfirm(true);
    };

    const handleDeleteBlog = async () => {
        if (!deletingBlog) return;
        try {
            await deleteBlog(userId, deletingBlog._id);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedBlogs.map((blog) => (
                        <div key={blog._id} className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                            <div className="flex justify-between items-center">
                                <Link to={`/blog/${blog._id}`} className="text-lg font-semibold hover:underline">{blog.title}</Link>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(blog)}>
                                        <Pencil size={20} className="text-blue-500 hover:text-blue-700" />
                                    </button>
                                    <button onClick={() => openDeleteConfirm(blog)}>
                                        <Trash size={20} className="text-red-500 hover:text-red-700" />
                                    </button>
                                </div>
                            </div>
                            <p className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{blog.content}</p>

                            <div className="mt-3 flex flex-wrap gap-4">
                                {blog?.images?.map((img, index) => (
                                    <div key={index} className="relative w-32 h-32">
                                        <img src={img} alt="Blog" className="w-full h-full object-cover rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>No blogs posted yet.</p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className={`px-4 py-2 rounded ${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"} disabled:opacity-50`}
                    >
                        Previous
                    </button>
                    <span>{currentPage} / {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className={`px-4 py-2 rounded ${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"} disabled:opacity-50`}
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

                            <div>
                                <p className="font-medium mb-2">Images</p>
                                <div className="flex flex-wrap gap-4">
                                    {editImages.map((img, index) => (
                                        <div key={index} className="relative w-24 h-24">
                                            <img src={img} alt="Blog" className="w-full h-full object-cover rounded" />
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

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
