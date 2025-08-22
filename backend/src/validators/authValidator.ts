import { AppError } from "../types/common";
import { LoginSchema } from "../schema/auth/loginSchema";
import { SignUpSchema } from "../schema/auth/signUpSchema";
import { AuthService } from "../services/authService";

export class AuthValidator {
  constructor(private authService: AuthService) {}

  async validateLoginInput(body: unknown) {
    const validatedData = LoginSchema.parse(body);
    return validatedData;
  }

  async validateSignUpInput(body: unknown) {
    const validatedData = SignUpSchema.parse(body);

    const isEmailTaken = await this.checkIfUserExistsByEmail(
      validatedData.email
    );
    if (isEmailTaken) {
      throw new AppError("A user with this email already exists", 400);
    }
    return validatedData;
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
