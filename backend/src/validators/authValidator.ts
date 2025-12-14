import { LoginSchema } from "../schema/auth/loginSchema";
import { SignUpSchema } from "../schema/auth/signUpSchema";

export class AuthValidator {
	constructor() {}

	async validateLoginInput(body: unknown) {
		const validatedData = LoginSchema.parse(body);
		return validatedData;
	}

	async validateSignUpInput(body: unknown) {
		const validatedData = SignUpSchema.parse(body);
		return validatedData;
	}
}
