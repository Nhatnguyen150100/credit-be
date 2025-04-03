import dayjs from "dayjs";
import User from "../models/user";
import DEFINE_ROLE from "../config/role";

const { default: Information } = require("../models/infomation");

const informationService = {
  getAllInformation: (
    page,
    limit,
    nameLike,
    userId,
    phoneNumber,
    status,
    datePayable,
    assignee
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const skip = (page - 1) * limit;
        const query = {};

        if (nameLike) {
          query.name = new RegExp(nameLike, "i");
        }
        if (userId) {
          query.user_id = new RegExp(userId, "i");
        }
        if (phoneNumber) {
          query.phone_number = new RegExp(phoneNumber, "i");
        }
        if (status) {
          query.status = new RegExp(status, "i");
        }
        if (datePayable) {
          query.date_payable = new Date(datePayable);
        }

        if (assignee && assignee.role === DEFINE_ROLE.ADMIN) {
          query.assignee = assignee.id;
        }

        const infos = await Information.find(query)
          .populate("assignee", "userName")
          .skip(skip)
          .limit(limit);
        const total = await Information.countDocuments(query);
        return resolve({
          data: {
            total,
            data: infos,
          },
          message: "Get all information success!",
        });
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  saveInformation: (info) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { user_id } = info;
        const userExists = await Information.findOne({ user_id });
        if (userExists) {
          return reject({
            message:
              "Số căn cước công dân đã tồn tại. Hãy kiểm tra lại thông tin!",
          });
        }

        const newInfo = new Information(info);
        const rs = await newInfo.save();
        if (rs) {
          return resolve({
            data: rs,
            message: "Lưu thông tin thành công",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  updateInformation: (_id, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { assignee, ...updateData } = data;
        const rs = await Information.findByIdAndUpdate(_id, updateData, {
          new: true,
        });
        if (rs) {
          return resolve({
            data: rs,
            message: "Update information success!",
          });
        } else {
          return resolve({
            data: null,
            message: "Information not found!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  deleteInformation: (_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const rs = await Information.findByIdAndDelete(_id);
        if (rs) {
          return resolve({
            message: "Delete information success!",
          });
        } else {
          return resolve({
            message: "Information not found!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  deleteMultiInfo: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const rs = await Information.deleteMany({ _id: { $in: data } });
        if (rs.deletedCount > 0) {
          return resolve({
            message: "Xóa các bản ghi thành công",
          });
        } else {
          return resolve({
            message: "Information not found!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  checkUserExits: (user_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const rs = await Information.findOne({ user_id });
        if (rs) {
          return resolve({
            data: rs,
            message: "User exits!",
          });
        } else {
          return resolve({
            data: null,
            message: "User not exits!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },

  checkUserExitsV2: (user_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userExists = await Information.findOne({ user_id });
        if (userExists) {
          return reject({
            message:
              "Số căn cước công dân đã tồn tại. Hãy kiểm tra lại thông tin!",
          });
        }
        return resolve({
          message: "CCCD hợp lệ",
        });
      } catch (error) {
        return reject(error.message);
      }
    });
  },

  getInformation: (_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const info = await Information.findById(_id);
        const data = { ...info._doc };
        if (data) {
          return resolve({
            data,
            message: "Get information success!",
          });
        } else {
          return resolve({
            data: null,
            message: "Information not found!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  getInformationByPhoneNumber: (phoneNumber) => {
    return new Promise(async (resolve, reject) => {
      try {
        const info = await Information.findOne({
          phone_number: phoneNumber,
        });
        const data = { ...info?._doc };
        if (data) {
          return resolve({
            data,
            message: "Lấy thông tin thành công",
          });
        } else {
          return resolve({
            data: null,
            message: "Không tìm thấy thông tin tài khoản",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  updateStatusMultiInfo: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const today = dayjs().startOf("day").toDate();
        const users = await Information.find({
          date_payable: { $lt: today },
          status: "NOT_PAY",
        });

        const bulkOps = users.map((user) => {
          const newAmountPayable = Math.round(user.amount_payable * 1.1);
          return {
            updateOne: {
              filter: { _id: user._id },
              update: {
                $set: {
                  status: "OVER_DATE",
                  amount_payable: newAmountPayable,
                },
              },
            },
          };
        });
        const result = await Information.bulkWrite(bulkOps);
        if (result.nModified > 0) {
          return resolve({
            message: "Cập nhật trạng thái thành công",
          });
        } else {
          return resolve({
            message: "Information not found!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },

  assigneeInformation: async (data) => {
    try {
      const { listInformationIds, userId: _id } = data;

      const assignee = await User.findById(_id).lean();
      if (!assignee) {
        throw new Error("Không tìm thấy người dùng cần gán thông tin");
      }

      if (!Array.isArray(listInformationIds)) {
        throw new Error("Danh sách thông tin không hợp lệ");
      }

      const updateResult = await Information.updateMany(
        {
          _id: { $in: listInformationIds },
        },
        { $set: { assignee: _id } }
      );

      if (updateResult.matchedCount === 0) {
        throw new Error("Không tìm thấy thông tin phù hợp để gán");
      }

      return {
        message: `Gán thông tin thành công cho ${updateResult.modifiedCount} bản ghi`,
        data: {
          totalMatched: updateResult.matchedCount,
          totalModified: updateResult.modifiedCount,
        },
      };
    } catch (error) {
      console.error("[Assignee Error]", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi trong quá trình gán thông tin"
      );
    }
  },
};

export default informationService;
