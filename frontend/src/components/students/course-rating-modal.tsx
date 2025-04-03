import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import axiosInstance from "@/configs/axiosConfig";

interface CourseRatingModalProps {
    courseId: string;
    isDark?: boolean;
    userId: string;
}

const CourseRatingModal: React.FC<CourseRatingModalProps> = ({ courseId, isDark, userId }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return alert("Please select a rating!");
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post("/course/courses/rating", { userId, courseId, rating, review });
            alert("Review submitted successfully!");
            setRating(0);
            setReview("");
        } catch (error) {
            console.error("Error submitting review", error);
            alert("Failed to submit review.");
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog>
            <DialogTrigger className="text-blue-500 rounded-md hover:text-violet-500 transition">
                Rate ⭐
            </DialogTrigger>
            <DialogContent className={isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}>
                <DialogHeader>
                    <DialogTitle>Rate this Course</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center space-x-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`cursor-pointer transition-all ${rating >= star ? "text-yellow-500" : "text-gray-400"}`}
                            size={32}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
                <textarea
                    className={`w-full p-2 border rounded-md ${isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 text-gray-900"}`}
                    rows={4}
                    placeholder="Write your review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <DialogFooter>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50">
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CourseRatingModal;