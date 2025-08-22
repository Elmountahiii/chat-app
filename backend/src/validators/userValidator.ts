import { UpdateUserSchema } from "../schema/user/updateUserInfoSchema";

export class UserValidator {
  constructor() {}

  validateUserData(data: unknown) {
    const validatedData = UpdateUserSchema.parse(data);
    return validatedData;
  }
}
