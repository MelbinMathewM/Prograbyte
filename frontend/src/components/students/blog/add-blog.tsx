import { ChangeEvent, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import CropImageModal from "@/components/ui/crop-image-modal";
import { getCroppedImage } from "@/libs/imageCropper";
import { AddBlogModalProps } from "@/types/blog";
import { FaSpinner } from "react-icons/fa";

const AddBlogModal = ({
    isOpen,
    onClose,
    newTitle,
    setNewTitle,
    newContent,
    setNewContent,
    setNewImage,
    handleAddBlog,
    isDark,
    isLoading
}: AddBlogModalProps) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [rawImage, setRawImage] = useState<string | null>(null);
    const [error, setError] = useState<string>('');

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRawImage(reader.result as string);
                setCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (_croppedArea: any, croppedPixels: any) => {
        setCroppedAreaPixels(croppedPixels);
    };

    const handleCropAndSetImage = async () => {
        if (!rawImage || !croppedAreaPixels) return;
        const base64Image = await getCroppedImage(rawImage, croppedAreaPixels);
        if (!base64Image) return;

        setImagePreview(base64Image);

        const res = await fetch(base64Image);
        const blob = await res.blob();
        const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
        setNewImage(file);
        setCropModalOpen(false);
    };

    const handleSubmitBlog = async () => {
        if(!newTitle.trim()){
            setError("Title is required");
        }else if(!newContent.trim()){
            setError("Content is required");
        }else{
            setError("");
            handleAddBlog();
        }
    }

    return (
        <>
            {/* Add Blog Modal */}
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent
                    className={`${isDark ? "bg-gray-800 text-white" : "bg-white text-black"
                        } max-w-lg max-h-[80vh] flex flex-col`}
                >
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className={`${isDark ? "text-gray-200" : "text-black"}`}>
                            Add New Blog
                        </DialogTitle>
                    </DialogHeader>
                    {error && <p className="text-red-400 font-semibold text-sm pb-1">{error}</p>}
                    <div className="overflow-y-auto flex-1 space-y-4 pr-2">
                        <div>
                            <label className="block mb-1 font-medium">Title</label>
                            <input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className={`w-full p-2 rounded ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
                                    }`}
                                placeholder="Enter blog title"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Content</label>
                            <textarea
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                rows={4}
                                className={`w-full p-2 rounded ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
                                    }`}
                                placeholder="Write your content here..."
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={`w-full p-2 rounded ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
                                    }`}
                            />
                        </div>

                        {imagePreview && (
                            <div>
                                <p className="mb-2 font-medium">Image Preview:</p>
                                <img
                                    src={imagePreview}
                                    alt="Blog Preview"
                                    className="w-full object-cover rounded"
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex-shrink-0 mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmitBlog}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2
                            ${isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add Blog"
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cropper Modal */}
            <CropImageModal
                modalOpen={cropModalOpen}
                setModalOpen={setCropModalOpen}
                imageSrc={rawImage}
                crop={crop}
                setCrop={setCrop}
                zoom={zoom}
                setZoom={setZoom}
                onCropComplete={handleCropComplete}
                getCroppedImage={handleCropAndSetImage}
                isDark={isDark}
            />
        </>
    );
};

export default AddBlogModal;
