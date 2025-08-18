import { UserModel } from "../schema/mongodb/userSchema";
import { PROFILE_PICTURE_LIST } from "../types/constants";
import { User } from "../types/User";
import { FriendshipModel } from "../schema/mongodb/friendshipSchema";

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
    return await UserModel.findOne({ email }).lean();
  }

  async findUserById(userId: string) {
    return await UserModel.findById(userId).lean();
  }

  async findByUserName(username: string) {
    return await UserModel.findOne({ username }).lean();
  }

  async updateUser(userId: string, updateData: Partial<User>) {
    return await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).lean();
  }

  async deleteUser(userId: string) {
    return await UserModel.findByIdAndDelete(userId);
  }
  async getAllUsers() {
    return await UserModel.find({});
  }
  async searchUsers(query: string, userId: string) {
    // sanitize and create case-insensitive regex
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    // find matching users (exclude password)
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


    // exclude the current user from results
    const otherUsers = users.filter((u: any) => u._id.toString() !== userId);
    if (otherUsers.length === 0) return [];

    // build OR query to fetch all friendships between userId and matched users
    const orClauses = otherUsers.flatMap((u: any) => [
      { requester: userId, recipient: u._id },
      { requester: u._id, recipient: userId },
    ]);

    const friendships = await FriendshipModel.find({ $or: orClauses }).lean();

    // map friendship by the other user's id for quick lookup
    const friendshipMap = new Map<string, any>();
    friendships.forEach((f: any) => {
      const requesterId = f.requester.toString();
      const recipientId = f.recipient.toString();
      const otherId = requesterId === userId ? recipientId : requesterId;
      friendshipMap.set(otherId, f);
    });

    // attach friendship info to each user
    return otherUsers.map((u: any) => {
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
