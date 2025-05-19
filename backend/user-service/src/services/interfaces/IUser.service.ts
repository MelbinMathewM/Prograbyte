import { IUser } from "@/models/user.model";

export interface IUserService {
    registerUser(user: IUser): Promise<void>;
    registerTutor(tutor: IUser): Promise<void>;
    registerUserGAuth(userData: { googleId: string; email: string; name: string }): Promise<{ accessToken: string, refreshToken: string, role: string }>;
    getUserByXId(id: string): Promise<Partial<IUser>>;
    getUserById(userId: string): Promise<Partial<IUser>>;
    revokePremium(userId: string): Promise<void>;
    getProfile(userId: string): Promise<IUser>;
    updateProfile(userId: string, updatedUser: Partial<IUser>): Promise<IUser>;
    verifyEmailLink(email: string): Promise<void>;
    verifyEmail(email: string): Promise<void>;
    addSkill(userId: string, skill: string): Promise<string[]>;
    editSkill(userId: string, oldSkill: string, newSkill: string): Promise<string[]>;
    deleteSkill(userId: string, skill: string): Promise<string[]>;
    updateToPremium(email: string): Promise<void>;
    getTutors(): Promise<IUser[]>;
    getUsers(): Promise<IUser[]>;
    updateTutorStatus(tutorId: string, action: string): Promise<string>;
    updateUserStatus(userId: string, action: string): Promise<string>;
}