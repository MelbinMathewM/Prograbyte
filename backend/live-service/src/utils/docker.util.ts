export const formatPathForDocker = (windowsPath: string): string => {
    return windowsPath
        .replace(/\\/g, "/")
        .replace(/^([A-Za-z]):/, (_, driveLetter: string) => `/${driveLetter.toLowerCase()}`);
};