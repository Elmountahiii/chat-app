import { UserDocumentType, UserModel } from "../schema/mongodb/userSchema";
import { PROFILE_PICTURE_LIST } from "../types/constants";
import { User } from "../types/User";
import {
  FriendshipDocumentType,
  FriendshipModel,
} from "../schema/mongodb/friendshipSchema";

export class UserRepository {
  async createUser(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const randomIndex = Math.floor(Math.random() * PROFILE_PICTURE_LIST.length);
    const user = new UserModel({
      username,
      firstName,
      lastName,
      email,
      password,
      profilePicture: PROFILE_PICTURE_LIST[randomIndex],
    });
    await user.save();
    return user.toObject() as User;
  }

  async findUserByEmail(email: string) {
    return await UserModel.findOne({ email }).select("-password").lean();
  }
  async findUserByEmailWithPassword(email: string) {
    return await UserModel.findOne({ email }).lean();
  }
  async findUserById(userId: string) {
    return await UserModel.findById(userId).select("-password").lean();
  }

  async findByUserName(username: string) {
    return await UserModel.findOne({ username }).select("-password").lean();
  }

  async updateUser(userId: string, updateData: Partial<User>) {
    return await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    })
      .select("-password")
      .lean();
  }

  async deleteUser(userId: string) {
    return await UserModel.findByIdAndDelete(userId).select("-password").lean();
  }
  async getAllUsers() {
    return await UserModel.find({}).select("-password").lean();
  }
  async searchUsers(query: string, userId: string) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const users = await UserModel.find({
      $or: [
        { username: regex },
        { firstName: regex },
        { lastName: regex },
        { email: regex },
      ],
    })
      .select("-password")
      .lean();

    const otherUsers = users.filter(
      (u: UserDocumentType) => u._id.toString() !== userId
    );
    if (otherUsers.length === 0) return [];

    const orClauses = otherUsers.flatMap((u: UserDocumentType) => [
      { requester: userId, recipient: u._id },
      { requester: u._id, recipient: userId },
    ]);

    const friendships = await FriendshipModel.find({ $or: orClauses }).lean();

    const friendshipMap = new Map<string, FriendshipDocumentType>();
    friendships.forEach((f: FriendshipDocumentType) => {
      const requesterId = f.requester.toString();
      const recipientId = f.recipient.toString();
      const otherId = requesterId === userId ? recipientId : requesterId;
      friendshipMap.set(otherId, f);
    });

    return otherUsers.map((u: UserDocumentType) => {
      const f = friendshipMap.get(u._id.toString());
      if (!f) {
        return { ...u, friendship: { id: null, status: "none" } };
      }
      return {
        ...u,
        friendship: {
          id: f._id,
          status: f.status,
          requester: f.requester.toString(),
          recipient: f.recipient.toString(),
          isRequester: f.requester.toString() === userId,
        },
      };
    });
  }
}
