export const getCroppedImage = async (
    imageSrc: string,
    croppedAreaPixels: { x: number; y: number; width: number; height: number },
    outputWidth?: number,
    outputHeight?: number
): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject("Failed to get canvas context");
                return;
            }

            canvas.width = outputWidth || croppedAreaPixels.width;
            canvas.height = outputHeight || croppedAreaPixels.height;
            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                canvas.width,
                canvas.height
            );

            const base64Image = canvas.toDataURL("image/jpeg");
            resolve(base64Image);
        };

        image.onerror = () => reject("Error loading image");
    });
};
