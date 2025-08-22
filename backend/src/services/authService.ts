import { AppError } from "../types/common";
import { User } from "../types/User";
import bcrypt from "bcrypt";
import { UsernameGenerator } from "../utils/usernameGenerator";
import { UserRepository } from "../repository/userRepository";

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async registerUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const usernameGenerator = new UsernameGenerator(
      firstName,
      lastName,
      this.userRepo
    );
    const username = await usernameGenerator.generate();
    const user = await this.userRepo.createUser(
      username,
      firstName,
      lastName,
      email,
      hashedPassword
    );
    return user;
  }

  async loginUser(email: string, password: string) {
    const user = await this.userRepo.findUserByEmailWithPassword(email);
    if (!user) throw new AppError("Wrong email or password", 401);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new AppError("Wrong email or password", 401);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(userId: string) {
    return await this.userRepo.findUserById(userId);
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.findUserByEmail(email);
  }

  async updateUser(userId: string, updateData: Partial<User>) {
    return await this.userRepo.updateUser(userId, updateData);
  }

  async deleteUser(userId: string) {
    return await this.userRepo.deleteUser(userId);
  }

  async getAllUsers() {
    return await this.userRepo.getAllUsers();
  }
}
