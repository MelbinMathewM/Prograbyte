import { v2 as cloudinary } from "cloudinary";

async function getSecureVideoUrl(publicId: string): Promise<string> {
    const secureUrl = cloudinary.url(publicId, {
        resource_type: "video",
        type: "authenticated",
        sign_url: true,
        secure: true,
        expires_at: Math.floor(Date.now() / 1000) + 300,
    });

    return secureUrl;
}

export default getSecureVideoUrl;
