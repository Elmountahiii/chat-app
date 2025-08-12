import { User, UserModel } from "../types/User";

export class UserRepository {
  async findUserByEmail(email: string) {
    return await UserModel.findOne({ email }).lean();
  }
  async findUserById(userId: string) {
    return await UserModel.findById(userId).lean();
  }

  async updateUser(userId: string, updateData: Partial<User>) {
    return await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).lean();
  }
}
