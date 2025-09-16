import { UpdateUserSchema } from "../schema/user/updateUserInfoSchema";
import * as z from "zod";

const UUIDSchema = z.string().min(1, "Invalid UUID format");

export class UserValidator {
  constructor() {}

  validateUserData(data: unknown) {
    const validatedData = UpdateUserSchema.parse(data);
    return validatedData;
  }
  validateUUID(uuid: unknown) {
    return UUIDSchema.parse(uuid);
  }
}
