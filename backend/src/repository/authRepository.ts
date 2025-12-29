import { UserModel, User } from "../schema/mongodb/userSchema";
import { PROFILE_PICTURE_LIST } from "../types/constants";

export class AuthRepository {
	constructor() {}

	async createUser(
		username: string,
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		profilePicture?: string,
	): Promise<User> {
		// Use provided profile picture or fall back to random selection
		const picture =
			profilePicture ||
			PROFILE_PICTURE_LIST[Math.floor(Math.random() * PROFILE_PICTURE_LIST.length)];
		const user = new UserModel({
			username,
			firstName,
			lastName,
			email,
			password,
			profilePicture: picture,
		});
		await user.save();
		return user.toObject();
	}

	async findUserByEmail(email: string): Promise<User | null> {
		return await UserModel.findOne({ email }).select("-password").lean();
	}

	async findUserById(userId: string): Promise<User | null> {
		return await UserModel.findById(userId).select("-password").lean();
	}

	async findUserByEmailWithPassword(email: string): Promise<User | null> {
		return await UserModel.findOne({ email }).select("+password").lean();
	}

	async emailExists(email: string): Promise<boolean> {
		const user = await UserModel.findOne({ email }).select("_id").lean();
		return user !== null;
	}

	async usernameExists(username: string): Promise<boolean> {
		const user = await UserModel.findOne({ username }).select("_id").lean();
		return user !== null;
	}

	async updatePassword(userId: string, hashedPassword: string): Promise<void> {
		await UserModel.findByIdAndUpdate(userId, {
			password: hashedPassword,
		});
	}
}
