import { useState } from "react";
import { X } from "lucide-react";

interface Course {
    _id: string;
    title: string;
    description: string;
    category_id: { _id: string; name: string };
    price: number;
    rating: number | null;
    preview_video_url: string;
    poster_url: string;
    approval_status: "Pending" | "Approved" | "Rejected";
}

interface EditCourseModalProps {
    course: Partial<Course>;
    categories: Category[];
    onClose: () => void;
    onSave: (updatedCourse: Partial<Course>,  files: { poster?: File; video?: File }) => void;
}

interface Category {
    _id: string;
    name: string;
    type: string;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({ course, categories, onClose, onSave }) => {
    const [updatedCourse, setUpdatedCourse] = useState<Partial<Course>>({ ...course });
    const [files, setFiles] = useState<{ poster?: File; video?: File }>({});

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Course</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Course Title */}
                <label className="text-sm font-semibold">Title</label>
                <input
                    type="text"
                    value={updatedCourse?.title || ""}
                    onChange={(e) => setUpdatedCourse({ ...updatedCourse, title: e.target.value })}
                    className="w-full p-2 border rounded mt-1"
                />

                {/* Course Description */}
                <label className="text-sm font-semibold mt-3 block">Description</label>
                <textarea
                    value={updatedCourse?.description || ""}
                    onChange={(e) => setUpdatedCourse({ ...updatedCourse, description: e.target.value })}
                    className="w-full p-2 border rounded mt-1"
                ></textarea>

                {/* Category Dropdown */}
                <label className="text-sm font-semibold mt-3 block">Category</label>
                <select
                    value={updatedCourse?.category_id?._id || ""}
                    onChange={(e) =>
                        setUpdatedCourse({
                            ...updatedCourse,
                            category_id: { _id: e.target.value, name: e.target.selectedOptions[0].text },
                        })
                    }
                    className="w-full p-2 border rounded mt-1"
                >
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                {/* Price */}
                <label className="text-sm font-semibold mt-3 block">Price ($)</label>
                <input
                    type="number"
                    value={updatedCourse?.price || ""}
                    onChange={(e) => setUpdatedCourse({ ...updatedCourse, price: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded mt-1"
                />

                {/* Preview Video Upload */}
                <label className="text-sm font-semibold mt-3 block">Preview Video</label>
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setFiles((prev) => ({ ...prev, video: file }));
                            if (updatedCourse?.preview_video_url) {
                                URL.revokeObjectURL(updatedCourse.preview_video_url);
                            }

                            const newPreviewUrl = URL.createObjectURL(file);

                            setUpdatedCourse((prev) => ({ ...prev, preview_video_url: "" }));
                            setTimeout(() => {
                                setUpdatedCourse((prev) => ({ ...prev, preview_video_url: newPreviewUrl }));
                            }, 0);
                        }
                    }}
                    className="w-full p-2 border rounded mt-1"
                />

                {updatedCourse?.preview_video_url && (
                    <video className="w-full mt-2 rounded-lg shadow-md" controls>
                        <source src={updatedCourse.preview_video_url} type="video/mp4" />
                    </video>
                )}

                {/* Poster Image Upload */}
                <label className="text-sm font-semibold mt-3 block">Poster Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setFiles((prev) => ({ ...prev, poster: file }));
                            setUpdatedCourse({ ...updatedCourse, poster_url: URL.createObjectURL(e.target.files[0]) });
                        }
                    }}
                    className="w-full p-2 border rounded mt-1"
                />
                {updatedCourse?.poster_url && (
                    <img src={updatedCourse.poster_url} alt="Course Poster" className="w-full h-auto mt-2 rounded-lg shadow-md" />
                )}

                {/* Save Changes Button */}
                <button
                    onClick={() => onSave(updatedCourse, files)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 w-full hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditCourseModal;
