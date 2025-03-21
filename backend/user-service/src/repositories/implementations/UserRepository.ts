import { injectable } from 'inversify';
import User, { IUser } from '../../models/UserModel';
import { IUserRepository } from '../interfaces/IUserRepository';

@injectable()
export class UserRepository implements IUserRepository {
    
    async createUser(user: IUser): Promise<IUser> {
        try {
            return await User.create(user);
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
        }
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.error("Error fetching user by email:", error);
            throw new Error("Failed to fetch user");
        }
    }

    async getUserById(id: string): Promise<IUser | null> {
        try {
            return await User.findOne({ _id: id });
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw new Error("Failed to fetch user");
        }
    }

    async deleteUserById(id: string): Promise<void> {
        try {
            await User.deleteOne({ _id: id });
        } catch (error) {
            console.error("Error deleting user:", error);
            throw new Error("Failed to delete user");
        }
    }

    async updateUser(id: string, user: Partial<IUser>): Promise<IUser | null> {
        try {
            return await User.findOneAndUpdate(
                { _id: id },
                { $set: user },
                { new: true }
            );
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error("Failed to update user");
        }
    }

    async findUserByUsername(username: string): Promise<IUser | null> {
        try {
            return await User.findOne({ username });
        } catch (error) {
            console.error("Error fetching user by username:", error);
            throw new Error("Failed to fetch user");
        }
    }

    async updateUserSave(user: IUser): Promise<void> {
        await user.save();
    }
}
