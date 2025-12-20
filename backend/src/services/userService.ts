import { UserRepository } from "../repository/userRepository";
import bcrypt from "bcrypt";

export class UserService {
	constructor(private userRepository: UserRepository) {}

	async findUserByEmail(email: string) {
		return await this.userRepository.findUserByEmail(email);
	}

	async findUserByEmailWithPassword(email: string) {
		return await this.userRepository.findUserByEmailWithPassword(email);
	}

	async findUserById(userId: string) {
		return await this.userRepository.findUserById(userId);
	}

	async findByUserName(username: string) {
		return await this.userRepository.findByUserName(username);
	}

	async updateUserInformation(
		userId: string,
		updates: {
			firstName: string;
			lastName: string;
			profilePicture: string;
			password?: string;
			confirmPassword?: string;
		},
	) {
		if (updates.password != undefined && updates.password !== "") {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(updates.password, salt);
			await this.userRepository.updateUserPassword(userId, hashedPassword);
		}
		return this.userRepository.updateUserInformation(userId, {
			firstName: updates.firstName,
			lastName: updates.lastName,
			profilePicture: updates.profilePicture,
		});
	}

	async updateUserStatus(
		userId: string,
		status: "online" | "offline" | "away",
	) {
		return await this.userRepository.updateUserStatus(userId, status);
	}

	async updateProfilePicture(userId: string, profilePictureUrl: string) {
		return await this.userRepository.updateProfilePicture(
			userId,
			profilePictureUrl,
		);
	}

	async searchUsers(query: string, userId: string) {
		if (query === "") return [];
		return await this.userRepository.searchUsers(query, userId);
	}

	async deleteUser(userId: string) {
		return await this.userRepository.deleteUser(userId);
	}

	async getAllUsers() {
		return await this.userRepository.getAllUsers();
	}
}
