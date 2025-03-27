import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config";

// Course storage
const storageCourse = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async () => ({
        folder: "prograbyte/courses",
        resource_type: "auto",
    }),
});

// Topic storage
const storageTopic = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: "prograbyte/topics",
        resource_type: file.mimetype.startsWith("video/") ? "video" : file.mimetype === "application/pdf" ? "raw" : "auto",
        type: file.mimetype.startsWith("video/") ? "authenticated" : "upload",
    }),
});

// Multer for course
export const uploadCourse = multer({
    storage: storageCourse,
}).any();

// Multer for topic
export const uploadTopic = multer({ 
    storage: storageTopic 
}).any();
