import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
    const { name, email,password } = payload;
    const user = await User.create({
        name,
        email,
        password
    })

    return user

}

const getAllUsers = async () => {
  const users = await User.find({});
  const total = await User.countDocuments({});
  return { users, meta: { total } };
};

export const UserServices = {
    createUser,
    getAllUsers
}