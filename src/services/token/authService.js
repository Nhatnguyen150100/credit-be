import bcrypt from "bcryptjs";
import User from "../../models/user";
import DEFINE_ROLE from "../../config/role";
import Information from "../../models/infomation";
import tokenService from "./tokenService";

const authService = {
  getAllUserAdmin: (page, limit, userName) => {
    return new Promise(async (resolve, reject) => {
      try {
        const query = {
          role: DEFINE_ROLE.ADMIN,
        };
        if (userName) {
          query.userName = new RegExp(userName, "i");
        }
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
        await Information.updateMany(
          { assignee: deletedUser._id },
          { $set: { assignee: null } }
        );

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

  getAllSystemAdmin: (page, limit, userName) => {
    return new Promise(async (resolve, reject) => {
      try {
        const query = { role: DEFINE_ROLE.SYSTEM_ADMIN };
        if (userName) {
          query.userName = new RegExp(userName, "i");
        }
        const users = await User.find(query)
          .select("-password")
          .skip((page - 1) * limit)
          .limit(limit)
          .exec();
        const totalItems = await User.countDocuments(query);
        return resolve({ data: users, totalItems });
      } catch (error) {
        reject(error.message);
      }
    });
  },

  createSystemAdmin: (userName, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const existing = await User.findOne({ userName });
        if (existing) {
          return reject("Tên đăng nhập đã tồn tại");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await new User({
          userName,
          password: hashedPassword,
          role: DEFINE_ROLE.SYSTEM_ADMIN,
        }).save();
        return resolve({
          data: { _id: newUser._id, userName: newUser.userName, role: newUser.role },
          message: "Tạo tài khoản SYSTEM_ADMIN thành công",
        });
      } catch (error) {
        reject(error.message);
      }
    });
  },

  updateSystemAdmin: (id, userName) => {
    return new Promise(async (resolve, reject) => {
      try {
        const target = await User.findOne({ _id: id, role: DEFINE_ROLE.SYSTEM_ADMIN });
        if (!target) {
          return reject("Tài khoản SYSTEM_ADMIN không tồn tại");
        }
        if (userName && userName !== target.userName) {
          const duplicate = await User.findOne({ userName });
          if (duplicate) return reject("Tên đăng nhập đã tồn tại");
        }
        const updated = await User.findByIdAndUpdate(
          id,
          { userName },
          { new: true, select: "-password" }
        );
        return resolve({ data: updated, message: "Cập nhật thành công" });
      } catch (error) {
        reject(error.message);
      }
    });
  },

  deleteSystemAdmin: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const target = await User.findOne({ _id: id, role: DEFINE_ROLE.SYSTEM_ADMIN });
        if (!target) {
          return reject("Tài khoản SYSTEM_ADMIN không tồn tại");
        }
        await User.findByIdAndDelete(id);
        return resolve({ data: target, message: "Xóa tài khoản SYSTEM_ADMIN thành công" });
      } catch (error) {
        reject(error.message);
      }
    });
  },

  resetSystemAdminPassword: (id, newPassword) => {
    return new Promise(async (resolve, reject) => {
      try {
        const target = await User.findOne({ _id: id, role: DEFINE_ROLE.SYSTEM_ADMIN });
        if (!target) {
          return reject("Tài khoản SYSTEM_ADMIN không tồn tại");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(id, { password: hashedPassword });
        return resolve({ message: "Reset mật khẩu thành công" });
      } catch (error) {
        reject(error.message);
      }
    });
  },

  changePassword: (userName, currentPassword, newPassword) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ userName });
        if (!user) {
          return reject({ message: "Tài khoản không tồn tại" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return reject({ message: "Mật khẩu hiện tại không đúng" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        return resolve({ message: "Đổi mật khẩu thành công" });
      } catch (error) {
        reject(error.message);
      }
    });
  },

  supervisorLogin: ({ requestIP }) => {
    return new Promise((resolve, reject) => {
      try {
        const isDevelopment = process.env.NODE_ENV === "development";

        const allowedIPs = (process.env.IP_SUPERVISOR || "")
          .split(",")
          .map((ip) => ip.trim())
          .filter(Boolean);

        if (!isDevelopment && allowedIPs.length > 0 && !allowedIPs.includes(requestIP)) {
          return reject({ status: 403, message: "IP không được phép truy cập" });
        }

        const accessToken = tokenService.generateSupervisorToken({
          _id: "supervisor",
          userName: "supervisor",
          role: DEFINE_ROLE.SUPERVISOR,
        });

        return resolve({
          user: {
            userName: "supervisor",
            role: DEFINE_ROLE.SUPERVISOR,
          },
          accessToken,
        });
      } catch (error) {
        reject({ status: 500, message: error.message });
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

};

export default authService;
