"use strict";
import informationService from "../../services/informationService";
import authService from "../../services/token/authService";
import tokenService from "../../services/token/tokenService";

const authController = {
  getAllUserAdmin: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const userName = req.query.nameLike;
      const { message, data } = await authService.getAllUserAdmin(
        page,
        limit,
        userName
      );
      res.status(200).json({
        message,
        data: data.map((_item) => {
          const { password, ...item } = _item.toObject();
          return item;
        }),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { userName, password } = req.body;
      const rs = await authService.login({ userName, password });
      if(!rs.data) {
        res.status(400).json({ message: rs.message });
      }
      const accessToken = tokenService.generateToken({
        _id: rs.data._id,
        userName: rs.data.userName,
        role: rs.data.role,
        permissions: rs.data.permissions,
      });
      res.status(200).json({
        message: rs.message || "Đăng nhập thành công",
        data: {
          user: {
            _id: rs.data._id,
            userName: rs.data.userName,
            role: rs.data.role,
            permissions: rs.data.permissions,
          },
          accessToken: accessToken,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message || error });
    }
  },
  register: async (req, res) => {
    try {
      const { userName, password } = req.body;
      const rs = await authService.register({
        userName,
        password,
      });
      if (!rs.data) {
        return res.status(400).json({ message: rs.message });
      }
      res.status(200).json({
        data: rs.data,
        message: rs.message || "Đăng ký tài khoản mới thành công",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id, permissions, userName } = req.body;
      const rs = await authService.updateUser(id, userName, permissions);
      if (!rs.data) {
        return res.status(400).json({ message: rs.message });
      }
      res.status(200).json({
        data: rs.data,
        message: rs.message || "Cập nhật quyền thành công",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      }
      if (currentPassword === newPassword) {
        return res
          .status(400)
          .json({ message: "Mật khẩu mới không được trùng mật khẩu hiện tại" });
      }
      const userName = req.user.userName;
      const rs = await authService.changePassword(userName, currentPassword, newPassword);
      res.status(200).json({ message: rs.message });
    } catch (error) {
      res.status(400).json({ message: error.message || error });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await authService.deleteUser(id);
      if (!rs.data) {
        return res.status(400).json({ message: rs.message });
      }
      res.status(200).json({
        data: rs.data,
        message: rs.message || "Xóa tài khoản thành công",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllSystemAdmin: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const userName = req.query.nameLike;
      const { data, totalItems } = await authService.getAllSystemAdmin(page, limit, userName);
      res.status(200).json({ data, totalItems });
    } catch (error) {
      res.status(500).json({ message: error.message || error });
    }
  },

  createSystemAdmin: async (req, res) => {
    try {
      const { userName, password } = req.body;
      if (!userName || !password) {
        return res.status(400).json({ message: "Vui lòng nhập userName và password" });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
      }
      const rs = await authService.createSystemAdmin(userName, password);
      res.status(201).json({ data: rs.data, message: rs.message });
    } catch (error) {
      res.status(400).json({ message: error.message || error });
    }
  },

  updateSystemAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const { userName } = req.body;
      if (!userName) {
        return res.status(400).json({ message: "Vui lòng nhập userName" });
      }
      const rs = await authService.updateSystemAdmin(id, userName);
      res.status(200).json({ data: rs.data, message: rs.message });
    } catch (error) {
      res.status(400).json({ message: error.message || error });
    }
  },

  deleteSystemAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const rs = await authService.deleteSystemAdmin(id);
      res.status(200).json({ data: rs.data, message: rs.message });
    } catch (error) {
      res.status(400).json({ message: error.message || error });
    }
  },

  resetSystemAdminPassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      }
      const rs = await authService.resetSystemAdminPassword(id, newPassword);
      res.status(200).json({ message: rs.message });
    } catch (error) {
      res.status(400).json({ message: error.message || error });
    }
  },

  supervisorLogin: async (req, res) => {
    try {
      const authHeader = req.headers.authorization || "";
      const accessToken = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

      const rs = await authService.supervisorLogin({ accessToken });
      return res.status(200).json({ message: "Đăng nhập thành công", data: rs });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ message: error.message || error });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const rs = await informationService.getInformationByPhoneNumber(
        phoneNumber
      );

      res.status(200).json({
        data: rs.data,
        message: "Đăng nhập thành công",
      });
    } catch (error) {
      res.status(500).json({ message: "Đăng nhập thất bại" });
    }
  },
};

export default authController;
