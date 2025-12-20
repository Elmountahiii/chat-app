import { User, UserModel } from "../schema/mongodb/userSchema";

export class UserRepository {
	constructor() {}

	async findUserByEmail(email: string): Promise<User | null> {
		return await UserModel.findOne({ email }).select("-password").lean();
	}

	async findUserByEmailWithPassword(email: string): Promise<User | null> {
		return await UserModel.findOne({ email }).select("+password").lean();
	}

	async findUserById(userId: string): Promise<User | null> {
		return await UserModel.findById(userId).select("-password").lean();
	}

	async findByUserName(username: string): Promise<User | null> {
		return await UserModel.findOne({ username }).select("-password").lean();
	}

	async updateUserStatus(
		userId: string,
		status: "online" | "offline" | "away",
	): Promise<void> {
		await UserModel.findByIdAndUpdate(userId, {
			status,
			lastActive: new Date(),
		});
	}

	async updateProfilePicture(
		userId: string,
		profilePictureUrl: string,
	): Promise<User | null> {
		return await UserModel.findByIdAndUpdate(
			userId,
			{ profilePicture: profilePictureUrl },
			{ new: true },
		)
			.select("-password")
			.lean();
	}

	async updateUserInformation(
		userId: string,
		updates: {
			firstName: string;
			lastName: string;
			profilePicture: string;
		},
	): Promise<User | null> {
		return await UserModel.findByIdAndUpdate(userId, updates, {
			new: true,
		})
			.select("-password")
			.lean();
	}

	async updateUserPassword(
		userId: string,
		hashedPassword: string,
	): Promise<User | null> {
		return await UserModel.findByIdAndUpdate(
			userId,
			{ password: hashedPassword },
			{
				new: true,
			},
		)
			.select("-password")
			.lean();
	}

	async deleteUser(userId: string): Promise<boolean> {
		const result = await UserModel.findByIdAndDelete(userId);
		return result !== null;
	}
	async getAllUsers(): Promise<User[]> {
		return await UserModel.find({}).select("-password").lean();
	}

	async searchUsers(query: string, userId: string): Promise<User[]> {
		const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const regex = new RegExp(escaped, "i");

		const users = await UserModel.find({
			$or: [
				{ username: regex },
				{ firstName: regex },
				{ lastName: regex },
				{ email: regex },
			],
		})
			.select("-password")
			.lean();

		const otherUsers = users.filter((u) => u._id.toString() !== userId);
		return otherUsers;
	}
}
