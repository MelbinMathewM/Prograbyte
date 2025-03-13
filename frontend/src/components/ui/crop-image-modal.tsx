import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import Button from "./Button";
import Cropper from "react-easy-crop";
import { Dispatch, SetStateAction } from "react";

interface CropImageModalProps {
    modalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    imageSrc: string | null;
    crop: { x: number; y: number };
    setCrop: Dispatch<SetStateAction<{ x: number; y: number }>>;
    zoom: number;
    setZoom: Dispatch<SetStateAction<number>>;
    onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
    getCroppedImage: () => void;
    isDark: boolean;
    aspectRatio?: number;
}

const CropImageModal: React.FC<CropImageModalProps> = ({
    modalOpen,
    setModalOpen,
    imageSrc,
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    getCroppedImage,
    isDark,
    aspectRatio = 1
}) => {
    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className={`backdrop-blur-md ${isDark ? "bg-gray-900/80" : "bg-gray-100/95"} p-6 rounded-xl shadow-xl w-full max-w-lg transition-all`}>
                <DialogHeader>
                    <DialogTitle className={`text-center ${isDark ? "text-white" : "text-grey-600"} text-xl font-semibold`}>
                        Crop & Adjust Image
                    </DialogTitle>
                </DialogHeader>

                {/* Cropper Container */}
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Cropper
                        image={imageSrc || ""}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                {/* Action Buttons */}
                <DialogFooter className="flex justify-between mt-6">
                    <Button variant="destructive" onClick={() => setModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={getCroppedImage}>
                        Crop & Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CropImageModal;
