import { UserRepository } from "../repository/userRepository";
import { User } from "../types/User";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUserByEmail(email: string) {
    return await this.userRepository.findUserByEmail(email);
  }

  async findUserById(userId: string) {
    return await this.userRepository.findUserById(userId);
  }

  async updateUser(
    userId: string,
    updateData: Partial<Omit<User, "createdAt" | "updatedAt" | "password">>
  ) {
    return await this.userRepository.updateUser(userId, updateData);
  }

  async searchUsers(query: string, userId: string) {
    return await this.userRepository.searchUsers(query, userId);
  }

  async deleteUser(userId: string) {
    return await this.userRepository.deleteUser(userId);
  }
}
