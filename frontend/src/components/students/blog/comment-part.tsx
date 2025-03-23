import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { addComment, getComments, deleteComment, toggleCommentLike as toggleCommentLikeAPI } from "@/api/blog";
import { Comment, CommentModalProps } from "@/types/blog";

const CommentModal: React.FC<CommentModalProps> = ({
    isOpen,
    onClose,
    blogId,
    userId,
    username,
    isDark,
    blogOwnerId
}) => {

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (isOpen) fetchComments();
    }, [isOpen]);

    const fetchComments = async () => {
        try {
            const response = await getComments(blogId);
            setComments(response.comments);
        } catch (err: any) {
            console.error("Failed to fetch comments:", err.response?.data?.error || err.message);
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim() && userId && blogId) {
            try {
                const response = await addComment(blogId, userId, newComment, username);
                setComments(response.comments.comments);
                setNewComment("");
            } catch (err: any) {
                console.error("Failed to add comment:", err.response?.data?.error || err.message);
            }
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(blogId, commentId);
            setComments((prev) => prev.filter((comment) => comment._id !== commentId));
        } catch (err: any) {
            console.error("Failed to delete comment:", err.response?.data?.error || err.message);
        }
    };

    const handleToggleCommentLike = async (commentId: string) => {
        try {
            setComments((prevComments) =>
                prevComments.map((comment) => {
                    if (comment._id === commentId) {
                        const isLiked = comment.likes.includes(userId);
                        const updatedLikes = isLiked
                            ? comment.likes.filter((id) => id !== userId)
                            : [...comment.likes, userId];
                        return { ...comment, likes: updatedLikes };
                    }
                    return comment;
                })
            );

            await toggleCommentLikeAPI(blogId, commentId, userId);
        } catch (err: any) {
            console.error("Failed to toggle like:", err.response?.data?.error || err.message);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`max-w-lg ${isDark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}`}>
                <DialogHeader>
                    <DialogTitle className={`${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                        Comments
                    </DialogTitle>
                </DialogHeader>

                {/* Comments List */}
                <div className={`space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {comments?.length > 0 ? comments.map((comment) => {
                        const isLikedByUser = comment.likes.includes(userId);
                        return (
                            <motion.div
                                key={comment._id}
                                className={`flex justify-between items-start border-b pb-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex-1">
                                    <p><span className="font-medium">{comment.username}:</span> {comment.content}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Like Button */}
                                    <button
                                        onClick={() => handleToggleCommentLike(comment._id)}
                                        className={`flex items-center gap-1 text-sm ${isLikedByUser ? "text-pink-500" : isDark ? "text-gray-400" : "text-gray-500"}`}
                                    >
                                        {isLikedByUser ? <FaHeart /> : <FaRegHeart />}
                                        <span>{comment.likes.length}</span>
                                    </button>

                                    {/* Delete option */}
                                    {(userId === comment.user_id || userId === blogOwnerId) && (
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="text-gray-300 hover:text-red-600 cursor-pointer"
                                            title="Delete Comment"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    }) : <p>No comments yet.</p>}
                </div>

                {/* Add Comment Section */}
                <div className={`mt-4 border rounded-lg p-1 ps-3 flex items-center gap-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        className={`flex-1 bg-transparent outline-none text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center ${newComment.trim()
                                ? `${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white cursor-pointer`
                                : `${isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-300 text-gray-600'} cursor-not-allowed`
                            }`}
                    >
                        <FiSend className="text-lg" />
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CommentModal;
