import dayjs from "dayjs";

const { default: Information } = require("../models/infomation");

const informationService = {
  getAllInformation: (
    page,
    limit,
    nameLike,
    userId,
    phoneNumber,
    status,
    datePayable
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
        const infos = await Information.find(query).skip(skip).limit(limit);
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
        const newInfo = new Information(info);
        const rs = await newInfo.save();
        if (rs) {
          return resolve({
            data: rs,
            message: "Save information success!",
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
        const rs = await Information.findByIdAndUpdate(_id, data, {
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
  updateStatusMultiInfo: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const today = dayjs().toDate();
        const users = await Information.find({
          date_payable: { $lt: today },
          status: { $ne: "OVER_DATE" },
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
};

export default informationService;
