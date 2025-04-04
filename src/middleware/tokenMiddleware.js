"use strict";
import DEFINE_PERMISSIONS from "../config/permission";
import DEFINE_ROLE from "../config/role";
import tokenService from "../services/token/tokenService";

const tokenMiddleware = {
  verifyTokenAdmin: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }
    const accessToken = token.split(" ")[1];
    const user = tokenService.verifyToken(accessToken);
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }
    if (user.role === DEFINE_ROLE.SUPER_ADMIN) {
      req.user = user;
      next();
      return;
    }
    if (user.role !== DEFINE_ROLE.ADMIN) {
      return res
        .status(403)
        .json({ message: "Chỉ ADMIN mới có quyền thực hiện hành động này" });
    }
    req.user = user;
    next();
  },
  verifyTokenAdminCreate: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }
    const accessToken = token.split(" ")[1];
    const user = tokenService.verifyToken(accessToken);
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }
    if (user.role === DEFINE_ROLE.SUPER_ADMIN) {
      req.user = user;
      next();
      return;
    }
    if (user.role !== DEFINE_ROLE.ADMIN) {
      return res
        .status(403)
        .json({ message: "Chỉ ADMIN mới có quyền thực hiện hành động này" });
    }
    if (!user.permissions?.includes(DEFINE_PERMISSIONS.CREATE)) {
      return res.status(403).json({
        message: "ADMIN không có quyền tạo mới",
      });
    }
    req.user = user;
    next();
  },
  verifyTokenAdminUpdate: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }
    const accessToken = token.split(" ")[1];
    const user = tokenService.verifyToken(accessToken);
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }
    if (user.role === DEFINE_ROLE.SUPER_ADMIN) {
      req.user = user;
      next();
      return;
    }
    if (user.role !== DEFINE_ROLE.ADMIN) {
      return res
        .status(403)
        .json({ message: "Chỉ ADMIN mới có quyền thực hiện hành động này" });
    }
    if (!user.permissions?.includes(DEFINE_PERMISSIONS.UPDATE)) {
      return res.status(403).json({
        message: "ADMIN không có quyền cập nhật",
      });
    }
    req.user = user;
    next();
  },
  verifyTokenAdminDelete: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }
    const accessToken = token.split(" ")[1];
    const user = tokenService.verifyToken(accessToken);
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }
    if (user.role === DEFINE_ROLE.SUPER_ADMIN) {
      req.user = user;
      next();
      return;
    }
    if (user.role !== DEFINE_ROLE.ADMIN) {
      return res
        .status(403)
        .json({ message: "Chỉ ADMIN mới có quyền thực hiện hành động này" });
    }
    if (!user.permissions?.includes(DEFINE_PERMISSIONS.DELETE)) {
      return res.status(403).json({
        message: "ADMIN không có quyền xóa",
      });
    }
    req.user = user;
    next();
  },
  verifyTokenSuperAdmin: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }
    const accessToken = token.split(" ")[1];
    const user = tokenService.verifyToken(accessToken);
    if (!user) {
      return res.status(403).json({ message: "Invalid token" });
    }
    if (user.role !== DEFINE_ROLE.SUPER_ADMIN) {
      return res
        .status(403)
        .json({ message: "Unauthorized access for user (only Super Admin)" });
    }
    req.user = user;
    next();
  },
};

export default tokenMiddleware;
