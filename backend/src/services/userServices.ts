import { UserModel } from "../models/User";

const profilePictureList = [
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Jack",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Brian",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Jocelyn",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Jade",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Wyatt",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Ryan",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Sara",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Riley",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Jessica",
  "https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Mackenzie",
];
export class UserService {
  static async createUser(userName: string, email: string, password: string) {
    try {
      const randomIndex = Math.floor(Math.random() * profilePictureList.length);
      const user = new UserModel({
        userName,
        email,
        password,
        profilePicture: profilePictureList[randomIndex],
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
  static async findUserById(userId: string) {
    try {
      const user = UserModel.findById(userId);
      return user;
    } catch (error) {
      console.log("Error finding user by ID:", error);
      throw new Error("Error finding user by ID");
    }
  }
}
