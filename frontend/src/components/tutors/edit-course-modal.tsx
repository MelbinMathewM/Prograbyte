import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import Input from "../../components/ui/Input";
import { Textarea } from "../../components/ui/textarea";
import Button from "../../components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "react-hot-toast";

interface Course {
    _id: string;
    title: string;
    description: string;
    category_id: { _id: string; name: string };
    price: number;
    preview_video_urls: [string];
    poster_url: string;
}

interface EditCourseModalProps {
    open: boolean;
    course: Partial<Course>;
    categories: { _id: string; name: string }[];
    onClose: () => void;
    onSave: (updatedCourse: Partial<Course>, files: { poster?: File; video?: File }) => void;
    isDark?: boolean;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({ open, course, categories, onClose, onSave, isDark }) => {
    const [updatedCourse, setUpdatedCourse] = useState<Partial<Course>>({ ...course });
    const [files, setFiles] = useState<{ poster?: File; video?: File }>({});
    const [posterPreview, setPosterPreview] = useState<string | null>(course.poster_url || null);
    const [videoPreview, setVideoPreview] = useState<string | null>(course?.preview_video_urls?.[0] || null);

    const handleSave = () => {
        if (!updatedCourse.title?.trim()) return toast.error("Course title is required.");
        if (!updatedCourse.description?.trim()) return toast.error("Course description is required.");
        if (!updatedCourse.category_id?._id) return toast.error("Please select a category.");
        if (!updatedCourse.price || updatedCourse.price < 0) return toast.error("Price must be a positive number.");

        onSave(updatedCourse, files);
    };

    const handleFileChange = (type: "poster" | "video", file: File | null) => {
        if (file) {
            setFiles((prev) => ({ ...prev, [type]: file }));
            const previewUrl = URL.createObjectURL(file);
            if (type === "poster") setPosterPreview(previewUrl);
            if (type === "video") setVideoPreview(previewUrl);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className={`mt-2 max-w-3xl ${isDark ? "bg-gray-900 text-white" : "bg-white"} rounded-lg p-6 max-h-[80vh] overflow-y-auto`}>
                <DialogHeader>
                    <DialogTitle className={`${isDark ? "text-white" : "text-black"}`}>Edit Course</DialogTitle>
                </DialogHeader>
    
                <div className="space-y-4">
                    <div>
                        <Label className={`${isDark ? "text-gray-200" : "text-black"}`}>Title</Label>
                        <Input
                            className={`${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}
                            value={updatedCourse.title || ""}
                            onChange={(e) => setUpdatedCourse({ ...updatedCourse, title: e.target.value })}
                        />
                    </div>
    
                    <div>
                        <Label className={`${isDark ? "text-gray-200" : "text-black"}`}>Description</Label>
                        <Textarea
                            className={`${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}
                            value={updatedCourse.description || ""}
                            onChange={(e) => setUpdatedCourse({ ...updatedCourse, description: e.target.value })}
                        />
                    </div>
    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label className={`${isDark ? "text-gray-200" : "text-black"}`}>Category</Label>
                            <Select
                                onValueChange={(value) => setUpdatedCourse({ ...updatedCourse, category_id: { _id: value, name: "" } })}
                                value={updatedCourse.category_id?._id || ""}
                            >
                                <SelectTrigger className={`${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className={`${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}>
                                    {categories.map((category) => (
                                        <SelectItem key={category._id} value={category._id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
    
                        <div>
                            <Label className={`${isDark ? "text-gray-200" : "text-black"}`}>Price ($)</Label>
                            <Input
                                type="number"
                                className={`${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}
                                value={updatedCourse.price || ""}
                                onChange={(e) => setUpdatedCourse({ ...updatedCourse, price: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label className={`${isDark ? "text-gray-200" : "text-black"}`}>Poster Image</Label>
                            {posterPreview && (
                                <img
                                    src={posterPreview}
                                    alt="Course Poster"
                                    className="w-full h-40 object-cover rounded-md border mb-2"
                                />
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                className={`${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}
                                onChange={(e) => e.target.files && handleFileChange("poster", e.target.files[0])}
                            />
                        </div>
    
                        <div>
                            <Label className={`${isDark ? "text-gray-200" : "text-black"}`}>Preview Video</Label>
                            {videoPreview && (
                                <video
                                    controls
                                    src={videoPreview}
                                    className="w-full h-40 object-cover rounded-md border mb-2"
                                />
                            )}
                            <Input
                                type="file"
                                accept="video/*"
                                className={`${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}
                                onChange={(e) => e.target.files && handleFileChange("video", e.target.files[0])}
                            />
                        </div>
                    </div>
    
                    <Button
                        className={`mt-4 w-full ${isDark ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-400 hover:bg-blue-500 text-white"}`}
                        onClick={handleSave}
                    >
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );    
};

export default EditCourseModal;
