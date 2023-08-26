import { UserModel } from "./models/users.model.js";

export class UsersDao {
  constructor() {}

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async createUser(user) {
    const newUser = await UserModel.create(user);
    return newUser;
  }

  async updateUser(id, userToReplace) {
    let updatedUser = await UserModel.findByIdAndUpdate(
      { _id: id },
      userToReplace
    );
    return updatedUser;
  }

  async deleteUser(id) {
    let deletedUser = await UserModel.findByIdAndDelete({ _id: id });
    return deletedUser;
  }
}