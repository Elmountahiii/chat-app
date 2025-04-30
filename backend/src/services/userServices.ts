import { UserModel } from "../models/User";

export class UserService {
  static async createUser(userName: string, email: string, password: string) {
    try {
      const user = new UserModel({
        userName,
        email,
        password,
      });
      await user.save();
      return user;
    } catch (error) {
      console.log("Error creating user:", error);
      throw new Error("Error creating user");
    }
  }
  static async findUserByEmail(email: string) {
    try {
      const user = UserModel.findOne({ email });
      return user;
    } catch (error) {
      console.log("Error finding user by email:", error);
      throw new Error("Error finding user by email");
    }
  }
}
