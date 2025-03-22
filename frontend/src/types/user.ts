export interface User {
    id: string;
    username: string;
    isPremium?: boolean;
}

export interface UserContextType {
    isAuth: boolean;
    user: User | null;
    logout: () => void;
}

export interface Profile {
    _id?: string;
    name: string;
    email: string;
    username?: string;
    profileImage: string | null;
    bio?: string;
    skills: string[];
    role: string;
    isEmailVerified: boolean;
}

export interface UserDetailsProps {
    profile: Profile;
    isDark: boolean;
    updateProfile: (key: string, value: string) => void;
}


export interface SkillProps {
    skills: string[],
    isDark: boolean,
    userId: string,
    setSkills: (skills: string[]) => void;
}

export interface SkillProps {
    skills: string[],
    isDark: boolean,
    userId: string,
    setSkills: (skills: string[]) => void;
}

export interface CroppedArea {
    width: number;
    height: number;
    x: number;
    y: number;
}

export interface VideoPlayerProps {
    publicId: string;
    isDark: boolean;
}

export interface WishlistItem {
    _id: string;
    title: string;
    price: number;
    poster_url: string;
}

export interface Wishlist {
    userId: string;
    items: WishlistItem[];
}