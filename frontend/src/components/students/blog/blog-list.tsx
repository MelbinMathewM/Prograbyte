import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaCommentDots } from "react-icons/fa";
import { toggleBlogLike } from "@/api/blog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import CommentModal from "./comment-part";
import { BlogListProps } from "@/types/blog";

const BlogList: React.FC<BlogListProps> = ({ userId, username, isDark, blogs, setBlogs }) => {
    const [imageModal, setImageModal] = useState<{ open: boolean; image: string, title: string, content: string }>({
        open: false,
        image: "",
        title: "",
        content: ""
    });
    const [commentsModal, setCommentsModal] = useState<{ open: boolean; blogId: string, user_id: string }>({
        open: false,
        blogId: "",
        user_id: ""
    });

    const toggleLike = async (blogId: string) => {
        try {
            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) => {
                    if (blog._id === blogId) {
                        const isLiked = blog.likes.includes(userId);
                        const updatedLikes = isLiked
                            ? blog.likes.filter((id) => id !== userId)
                            : [...blog.likes, userId];
                        return { ...blog, likes: updatedLikes };
                    }
                    return blog;
                })
            );

            await toggleBlogLike(blogId, userId);
        } catch (err: any) {
            console.error("Failed to toggle like:", err.response?.data?.error || err.message);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                    <motion.div
                        key={blog?._id}
                        className={`p-4 rounded shadow-md border 
                        ${isDark ? "bg-gray-800 text-gray-200 border-gray-700" : "bg-white text-gray-800 border-gray-200"}`}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog?.username || "User"}`}
                                alt={blog?.username}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="font-bold">{blog?.username}</h2>
                                <p className="text-xs text-gray-400">Just now</p>
                            </div>
                        </div>

                        {blog?.image && (
                            <div className="mb-4 cursor-pointer" onClick={() => setImageModal({ open: true, image: blog?.image as string, title: blog?.title, content: blog?.content })}>
                                <img src={blog?.image} alt="Blog" className="w-full h-60 object-cover rounded-lg" />
                            </div>
                        )}

                        <h3 className="text-xl font-semibold mb-2">{blog?.title}</h3>
                        <p className="text-sm mb-4">{blog?.content}</p>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => toggleLike(blog?._id)}
                                className={`flex items-center gap-2 ${blog?.likes?.includes(userId) ? "text-pink-500" : "text-gray-500"}`}
                            >
                                {blog?.likes?.includes(userId) ? <FaHeart /> : <FaRegHeart />}
                                {blog?.likes?.length} likes
                            </button>


                            <button
                                className="flex items-center gap-2 text-gray-500"
                                onClick={() => setCommentsModal({ open: true, blogId: blog?._id, user_id: blog?.user_id })}
                            >
                                <FaCommentDots />
                                <span>{ blog?.comments ? blog?.comments : 0 } Comments</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Image Modal */}
            <Dialog open={imageModal.open} onOpenChange={(open) => setImageModal({ ...imageModal, open })}>
                <DialogContent
                    className={`max-h-[100vh] ${isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                        }`}
                >
                    <DialogHeader>
                        <DialogTitle className={isDark ? "text-gray-100" : "text-gray-900"}>
                            {imageModal.title}
                        </DialogTitle>
                    </DialogHeader>

                    <p className={`${isDark ? "text-gray-300" : "text-gray-600"} pb-3`}>
                        {imageModal.content}
                    </p>
                    <div className="overflow-auto max-h-[70vh]">
                        <img
                            src={imageModal?.image}
                            alt="Full Blog"
                            className="w-full object-contain rounded-lg"
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Comments Modal */}
            <CommentModal
                isOpen={commentsModal.open}
                onClose={() => setCommentsModal({ ...commentsModal, open: false })}
                blogId={commentsModal.blogId}
                userId={userId}
                isDark={isDark}
                username={username}
                blogOwnerId={commentsModal?.user_id}
            />

        </>
    );
};

export default BlogList;
