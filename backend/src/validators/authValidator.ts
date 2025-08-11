import { AppError } from "../types/common";
import { LoginSchema } from "../schema/auth/loginSchema";
import { SignUpSchema } from "../schema/auth/signUpSchema";
import { AuthService } from "../services/authService";
import { logger } from "../config/logger";

export class AuthValidator {
  constructor(private authService: AuthService) {}

  async validateLoginInput(email: string, password: string) {
    const { error } = LoginSchema.safeParse({ email, password });
    if (error) {
      logger.error("Invalid login attempt");
      logger.error("Error validating login input:", error);
      logger.error("user credentials:", { email, password });
      throw new AppError("Invalid login input", 400);
    }
  }

  async validateSignUpInput(
    userName: string,
    email: string,
    password: string
  ): Promise<boolean> {
    const { error } = SignUpSchema.safeParse({
      username: userName,
      email,
      password,
    });
    if (error) {
      logger.error("Error validating registration input:", error);
      logger.error("user credentials:", { userName, email, password });
      throw new AppError("Invalid registration input", 400);
    }
    const isEmailTaken = await this.checkIfUserExistsByEmail(email);
    if (isEmailTaken) {
      throw new AppError("A user with this email already exists", 400);
    }
    return true;
  }

  async checkIfUserExistsByEmail(email: string): Promise<boolean> {
    const user = await this.authService.getUserByEmail(email);
    return user !== null;
  }

  async checkIfUserExistsById(id: string): Promise<boolean> {
    const user = await this.authService.getUserById(id);
    return user !== null;
  }
}
