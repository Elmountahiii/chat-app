import { PROFILE_PICTURE_LIST } from "../types/constants";
import { User, UserModel } from "../types/User";

export class AuthRepository {
  async createUser(userName: string, email: string, password: string) {
    const randomIndex = Math.floor(Math.random() * PROFILE_PICTURE_LIST.length);
    const user = new UserModel({
      userName,
      email,
      password,
      profilePicture: PROFILE_PICTURE_LIST[randomIndex],
    });
    await user.save();
    return user;
  }

  async findUserByEmail(email: string) {
    return await UserModel.findOne({ email }).lean();
  }
  async findUserById(userId: string) {
    return await UserModel.findById(userId).lean();
  }

  async updateUser(userId: string, updateData: Partial<User>) {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData);
    return updatedUser;
  }

  async deleteUser(userId: string) {
    return await UserModel.findByIdAndDelete(userId);
  }
  async getAllUsers() {
    return await UserModel.find({});
  }
}
