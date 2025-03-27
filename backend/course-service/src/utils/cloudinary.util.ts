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


export const extractCloudinaryDetails = (url: string): {
    publicId: string;
    resourceType: string;
    isAuthenticated: boolean;
} => {
    try {
        const match = url.match(/\/(upload|authenticated)\/(?:s--[^/]+--\/)?v\d+\/(.+?)(\.\w+)?$/);
        if (!match) return { publicId: "", resourceType: "auto", isAuthenticated: false };

        const [, type, publicId] = match;
        const resourceType = url.includes("/video/") ? "video" : url.includes("/image/") ? "image" : "raw";
        const isAuthenticated = type === "authenticated";

        return { publicId, resourceType, isAuthenticated };
    } catch {
        return { publicId: "", resourceType: "auto", isAuthenticated: false };
    }
};

export const extractCloudinaryPublicId = (url: string): string => {
    try {
        const match = url.match(/\/(upload|authenticated)\/(?:s--[^/]+--\/)?v\d+\/(.+?)(\.\w+)?$/);
        if (!match) return "";
        const [, , publicId] = match;
        return publicId;
    } catch {
        return "";
    }
};

export const deleteFromCloudinary = async (publicId: string, resourceType: string = 'auto', isAuthenticated: boolean = false): Promise<void> => {
    try {

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            type: isAuthenticated ? 'authenticated' : 'upload',
        });

        if (result.result !== 'ok' && result.result !== 'not found') {
            console.error("Unexpected Cloudinary deletion result:", result);
            throw new Error("Failed to delete resource from Cloudinary");
        }

        console.log(`Cloudinary resource deleted: ${publicId}`);

    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw new Error("Error deleting from cloudinary");
    }
};

