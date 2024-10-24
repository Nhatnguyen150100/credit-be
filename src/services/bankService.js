import Bank from "../models/bank"

const bankService = {
  createBank: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newBank = new Bank(data);
        const rs = await newBank.save();
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
  updateBank: (_id, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const bank = await Bank.findByIdAndUpdate(_id, data, { new: true });
        if (bank) {
          return resolve({
            data: bank,
            message: "Update information success!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  deleteBank: (_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const bank = await Bank.findByIdAndDelete(_id);
        if (bank) {
          return resolve({
            data: bank,
            message: "Delete information success!",
          });
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  },
  getAllBank: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const banks = await Bank.find({});
        return resolve({
          data: banks,
        });
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    })
  }
}

export default bankService;