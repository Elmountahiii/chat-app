import { UserRepository } from "../repository/userRepository";
import { UserDataUpdates } from "../schema/user/updateUserInfoSchema";

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

	async updateUser(userId: string, updateData: UserDataUpdates) {
		return await this.userRepository.updateUser(userId, updateData);
	}

	async updateLastSeen(userId: string) {
		return await this.userRepository.updateLastSeen(userId);
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
