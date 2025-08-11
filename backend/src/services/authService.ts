import jwt from "jsonwebtoken";
import { AuthRepository } from "../repository/authRepository";
import { AppError } from "../types/common";
import { User } from "../types/User";
import bcrypt from "bcrypt";
import { config } from "../config/environment";
import type { StringValue } from "ms";

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async registerUser(userName: string, email: string, password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.authRepository.createUser(
      userName,
      email,
      hashedPassword
    );
    return user;
  }

  async loginUser(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) throw new AppError("Wrong email or password", 401);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new AppError("Wrong email or password", 401);
    return user;
  }

  async getUserById(userId: string) {
    return await this.authRepository.findUserById(userId);
  }

  async getUserByEmail(email: string) {
    return await this.authRepository.findUserByEmail(email);
  }

  async updateUser(userId: string, updateData: Partial<User>) {
    return await this.authRepository.updateUser(userId, updateData);
  }

  async deleteUser(userId: string) {
    return await this.authRepository.deleteUser(userId);
  }

  async getAllUsers() {
    return await this.authRepository.getAllUsers();
  }

  async signToken(userId: string) {
    return jwt.sign(
      {
        userId: userId,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRATION as StringValue,
      }
    );
  }

  async verifyToken(token: string) {
    if (!token) throw new AppError("Unauthorized", 401);
    try {
      const decode = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload & {
        userId: string;
      };
      return await this.getUserById(decode.userId);
    } catch (e) {
      throw new AppError("Invalid or expired token", 401);
    }
  }

}
