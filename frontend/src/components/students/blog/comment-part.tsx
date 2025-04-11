import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { addComment, getComments, deleteComment, toggleCommentLike as toggleCommentLikeAPI, addSubComment, toggleSubCommentLike, deleteSubComment, editComment } from "@/api/blog";
import { Comment, CommentModalProps } from "@/types/blog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

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
    const [activeComment, setActiveComment] = useState<string | null>(null);
    const [newSubComment, setNewSubComment] = useState<string>("");
    const [isAddSubInputOpen, setIsSubInputOpen] = useState<boolean>(false);
    const [newEditComment, setNewEditComment] = useState<string>("");
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

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

    const handleEditComment = async (commentId: string) => {
        try {
            await editComment(blogId, commentId, newEditComment);
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === commentId ? { ...comment, content: newEditComment } : comment
                )
            );
            setEditingCommentId(null);
            setNewEditComment("");
        } catch (err: any) {
            console.error(err?.response?.data?.error);
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

    const handleAddSubComment = (commentId: string, isOpen: boolean) => {
        setIsSubInputOpen(isOpen);
        setActiveComment(commentId);
        setNewSubComment("");
    };

    const handleSubmitSubComment = async (commentId: string) => {
        if (!newSubComment.trim()) return;

        try {
            await addSubComment(blogId, commentId, userId, newSubComment, username);
            setNewSubComment("");
            setActiveComment(null);
            await fetchComments();
        } catch (err: any) {
            console.error("Failed to add sub-comment:", err.response?.data?.error || err.message);
        }
    };


    const handleToggleSubCommentLike = async (commentId: string, subCommentId: string) => {
        try {
            setComments((prevComments) =>
                prevComments.map((comment) => {
                    if (comment._id === commentId) {
                        return {
                            ...comment,
                            sub_comments: comment.sub_comments.map((subComment) => {
                                if (subComment._id === subCommentId) {
                                    const isLiked = subComment.likes.includes(userId);
                                    const updatedLikes = isLiked
                                        ? subComment.likes.filter((id) => id !== userId)
                                        : [...subComment.likes, userId];
                                    return { ...subComment, likes: updatedLikes };
                                }
                                return subComment;
                            }),
                        };
                    }
                    return comment;
                })
            );

            await toggleSubCommentLike(blogId, commentId, subCommentId, userId);
        } catch (err: any) {
            console.error("Failed to toggle sub-comment like:", err.response?.data?.error || err.message);
        }
    };

    const handleDeleteSubComment = async (commentId: string, subCommentId: string) => {
        try {
            await deleteSubComment(blogId, commentId, subCommentId);

            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === commentId
                        ? { ...comment, sub_comments: comment.sub_comments.filter((sub) => sub._id !== subCommentId) }
                        : comment
                )
            );
        } catch (err: any) {
            console.error("Failed to delete sub-comment:", err.response?.data?.error || err.message);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`max-w-2xl ${isDark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}`}>
                <DialogHeader>
                    <DialogTitle className={`${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                        Comments
                    </DialogTitle>
                </DialogHeader>

                {/* Comments List */}
                <div className={`space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {comments?.length > 0 ? comments.map((comment) => {
                        const isLikedByUser = comment.likes.includes(userId);
                        const isEditing = editingCommentId === comment._id;

                        return (
                            <motion.div
                                key={comment._id}
                                className={`flex flex-col border-b pb-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={newEditComment}
                                                onChange={(e) => setNewEditComment(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        handleEditComment(comment._id);
                                                    }
                                                }}
                                                className={`w-full px-2 py-1 rounded-md outline-none border ${isDark ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                                            />
                                        ) : (
                                            <p>
                                                <Link to={`/blog/profile/${comment?.username}`} className="font-semibold text-sm hover:text-blue-400">
                                                    @{comment?.username}:
                                                </Link> {comment.content}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Like Button */}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => handleToggleCommentLike(comment._id)}
                                                    className={`flex items-center gap-1 text-sm cursor-pointer ${isLikedByUser ? "text-pink-500" : isDark ? "text-gray-400" : "text-gray-500"}`}
                                                >
                                                    {isLikedByUser ? <FaHeart /> : <FaRegHeart />}
                                                    <span>{comment.likes.length}</span>
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>{isLikedByUser ? "Dislike" : "Like"}</TooltipContent>
                                        </ Tooltip>

                                        {/* Reply Button */}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => handleAddSubComment(comment._id, !isAddSubInputOpen)}
                                                    className={`flex items-center gap-1 text-sm ${isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-300 hover:text-gray-500"} cursor-pointer`}
                                                >
                                                    <FaReply />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Reply</TooltipContent>
                                        </ Tooltip>

                                        {/* Delete option */}
                                        {/* Edit & Delete Buttons */}
                                        {(userId === comment.user_id || userId === blogOwnerId) && (
                                            <div className="flex items-center gap-2">
                                                {userId === comment.user_id ? ( // Only comment owner can edit
                                                    isEditing ? (
                                                        <>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={() => handleEditComment(comment._id)}
                                                                        className="text-green-500 hover:text-green-600 cursor-pointer"
                                                                    >
                                                                        <FiSend />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Save</TooltipContent>
                                                            </Tooltip>

                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingCommentId(null);
                                                                            setNewEditComment("");
                                                                        }}
                                                                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                                                    >
                                                                        <XCircle size={18} />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Cancel</TooltipContent>
                                                            </Tooltip>
                                                        </>
                                                    ) : (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingCommentId(comment._id);
                                                                        setNewEditComment(comment.content);
                                                                    }}
                                                                    className="text-gray-300 hover:text-blue-500 cursor-pointer"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Edit</TooltipContent>
                                                        </Tooltip>
                                                    )
                                                ) : null}

                                                {userId === blogOwnerId && ( // Only blog owner can delete
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => handleDeleteComment(comment._id)}
                                                                className="text-gray-300 hover:text-red-500 cursor-pointer"
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Delete</TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sub-comments Section */}
                                {comment.sub_comments.length > 0 && (
                                    <div className="ml-5 mr-5 mt-2 space-y-2 pl-3">
                                        {comment.sub_comments.map((subComment) => {
                                            const isLikedByUser = subComment.likes.includes(userId);
                                            return (
                                                <motion.div key={subComment._id} className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p><Link to={`/blog/profile/${subComment?.username}`} className="font-semibold text-sm hover:text-blue-400">
                                                            @{subComment?.username}:
                                                        </Link> {subComment.content}</p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {/* Like Sub-comment */}
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    onClick={() => handleToggleSubCommentLike(comment._id, subComment._id)}
                                                                    className={`flex items-center gap-1 text-sm cursor-pointer ${isLikedByUser ? "text-pink-500" : isDark ? "text-gray-400" : "text-gray-500"}`}
                                                                >
                                                                    {isLikedByUser ? <FaHeart /> : <FaRegHeart />}
                                                                    <span>{subComment.likes.length}</span>
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>{isLikedByUser ? "Dislike" : "Like"}</TooltipContent>
                                                        </ Tooltip>

                                                        {(userId === subComment.user_id || userId === blogOwnerId) && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={() => handleDeleteSubComment(comment._id, subComment._id)}
                                                                        className="text-gray-300 hover:text-red-600 cursor-pointer"
                                                                    >
                                                                        <FaTrash size={14} />
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Delete</TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Sub-comment Input */}
                                {activeComment === comment._id && isAddSubInputOpen && (
                                    <div className="ml-5 mt-2 flex gap-1">
                                        <input
                                            type="text"
                                            placeholder="Write reply..."
                                            className={`flex-1 bg-transparent outline-none border rounded-sm px-3 py-1 text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200 hover:border-gray-400' : 'bg-gray-100 border-gray-200 text-gray-800 hover:border-gray-500'}`}
                                            value={newSubComment}
                                            onChange={(e) => setNewSubComment(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    handleSubmitSubComment(comment._id);
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={() => handleSubmitSubComment(comment._id)}
                                            disabled={!newSubComment.trim()}
                                            className={`px-3 py-2 rounded-sm text-sm font-medium flex items-center justify-center ${newSubComment.trim()
                                                ? `${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white cursor-pointer`
                                                : `${isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-300 text-gray-600'} cursor-not-allowed`
                                                }`}
                                        >
                                            <FiSend className="text-lg" />
                                        </button>
                                    </div>
                                )}
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
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                handleAddComment();
                            }
                        }}
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
