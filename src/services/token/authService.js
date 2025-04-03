import bcrypt from "bcryptjs";
import User from "../../models/user";
import adminAccount from "../../config/adminAccount";
import DEFINE_ROLE from "../../config/role";

const authService = {
  getAllUserAdmin: (page, limit, userName) => {
    console.log("🚀 ~ userName:", userName);
    return new Promise(async (resolve, reject) => {
      try {
        const query = {
          role: DEFINE_ROLE.ADMIN,
        };
        if (userName) {
          query.userName = new RegExp(userName, "i");
        }
        console.log("🚀 ~ returnnewPromise ~ query:", query);
        const users = await User.find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .exec();

        const totalItems = await User.countDocuments(query);

        return resolve({
          data: users,
          totalItems,
        });
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  register: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { userName, password, role } = userData;

        const existingUser = await User.findOne({ userName });
        if (existingUser) {
          return reject("Tên đăng nhập đã tồn tại");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          userName,
          password: hashedPassword,
          role,
        });

        const savedUser = await newUser.save();
        return resolve({
          data: {
            userName: savedUser.userName,
            role: savedUser.role,
          },
          message: "Tạo mới tài khoản thành công",
        });
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },

  updateUser: (id, userName, permissions) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { userName, permissions },
          { new: true }
        );
        if (!updatedUser) {
          return reject("Tài khoản không tồn tại");
        }
        return resolve({
          data: updatedUser,
          message: "Cập nhật quyền thành công",
        });
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },

  deleteUser: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          return reject("Tài khoản không tồn tại");
        }
        return resolve({
          data: deletedUser,
          message: "Xóa tài khoản thành công",
        });
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },

  login: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { userName, password } = userData;

        const user = await User.findOne({ userName });
        if (!user) {
          return reject({
            message: "Tài khoản không tồn tại",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return reject({
            message: "Mật khẩu không đúng",
          });
        }

        return resolve({
          data: user,
          message: "Đăng nhập thành công",
        });
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },

  isSuperAdmin: ({ userName, password }) => {
    return (
      userName === adminAccount.userName && password === adminAccount.password
    );
  },
};

export default authService;
