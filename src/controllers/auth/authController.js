"use strict";
import adminAccount from "../../config/adminAccount";
import DEFINE_PERMISSIONS from "../../config/permission";
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
      const isSuperAdmin = authService.isSuperAdmin({
        userName,
        password,
      });
      if (isSuperAdmin) {
        const accessToken = tokenService.generateToken({
          _id: "id-of-super-admin-0123",
          userName: adminAccount.userName,
          role: adminAccount.role,
          permissions: new Array(DEFINE_PERMISSIONS.ALL_PERMISSIONS),
        });
        res.status(200).json({
          message: "Đăng nhập thành công",
          data: {
            user: {
              _id: "id-of-super-admin-0123",
              userName: adminAccount.userName,
              role: adminAccount.role,
              permissions: new Array(DEFINE_PERMISSIONS.ALL_PERMISSIONS),
            },
            accessToken: accessToken,
          },
        });
        return;
      }
      const rs = await authService.login({ userName, password });
      if (!rs.data) {
        return res.status(401).json({ message: rs.message });
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
      res.status(500).json({ message: error.message });
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
