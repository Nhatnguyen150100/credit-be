import { default as mongoose } from "mongoose";

const BankSchema = new mongoose.Schema({
  name_bank: { type: String, required: true},
  name_account: { type: String, required: true},
  account_number: { type: String, required: true, unique: true },
  qr_code_img: { type: String, required: true},
  created_at: { type: Date, default: Date.now },
});

const Bank = mongoose.model("Bank", BankSchema);

export default Bank;
