import { AppError } from "../types/common";
import bcrypt from "bcrypt";
import { UsernameGenerator } from "../utils/usernameGenerator";
import { AuthRepository } from "../repository/authRepository";

export class AuthService {
	constructor(private authRepo: AuthRepository) {}

	async registerUser(
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		profilePicture?: string,
	) {
		const existingUser = await this.authRepo.findUserByEmail(email);
		if (existingUser) {
			throw new AppError("Email already in use", 400);
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const usernameGenerator = new UsernameGenerator(
			firstName,
			lastName,
			this.authRepo,
		);
		const username = await usernameGenerator.generate();
		const user = await this.authRepo.createUser(
			username,
			firstName,
			lastName,
			email,
			hashedPassword,
			profilePicture,
		);
		const { password: _, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}

	async loginUser(email: string, password: string) {
		const user = await this.authRepo.findUserByEmailWithPassword(email);
		if (!user) throw new AppError("Wrong email or password", 401);
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) throw new AppError("Wrong email or password", 401);
		const { password: _, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}

	async findUserByEmail(email: string) {
		return await this.authRepo.findUserByEmail(email);
	}

	async findUserById(userId: string) {
		return await this.authRepo.findUserById(userId);
	}

	async emailExists(email: string) {
		return await this.authRepo.emailExists(email);
	}

	async usernameExists(username: string) {
		return await this.authRepo.usernameExists(username);
	}

	async updatePassword(userId: string, hashedPassword: string) {
		return await this.authRepo.updatePassword(userId, hashedPassword);
	}
}
