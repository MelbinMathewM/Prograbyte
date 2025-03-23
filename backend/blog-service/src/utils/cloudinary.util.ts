import streamifier from "streamifier";
import cloudinary from "@/configs/cloudinary.config";

export const uploadToCloudinary = (fileBuffer: Buffer, folder?: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                folder: folder || 'blog-images',
            },
            (error, result) => {
                if (error) return reject(error);
                if (result) return resolve(result.secure_url);
                reject(new Error('Failed to upload to Cloudinary'));
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

export const extractCloudinaryPublicId = (imageUrl: string): string | null => {
    try {
        const urlParts = imageUrl.split('/');

        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1) return null;

        const afterUploadParts = urlParts.slice(uploadIndex + 1);
        if (afterUploadParts.length === 0) return null;

        if (/^v\d+$/.test(afterUploadParts[0])) {
            afterUploadParts.shift();
        }

        const fileName = afterUploadParts.pop()!;
        const publicIdWithoutExt = fileName.split('.')[0];
        const folderPath = afterUploadParts.join('/');

        return folderPath ? `${folderPath}/${publicIdWithoutExt}` : publicIdWithoutExt;
    } catch (error) {
        console.error("Failed to extract Cloudinary public_id", error);
        return null;
    }
};


export const removeFromCloudinary = async (publicId: string): Promise<void> => {
    try{
        await cloudinary.uploader.destroy(publicId);
        console.log("Image deleted from Cloudinary");
    }catch(err){
        console.error("Failed to delete image from Cloudinary", err);
    }
}
