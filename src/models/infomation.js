import { default as mongoose } from "mongoose";

const InformationSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  user_take_id_img: { type: String, required: true },
  front_end_user_id_img: { type: String, required: true },
  // back_end_user_id_img: { type: String, required: true },
  bank_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  loan_amount: { type: Number, required: true },
  loan_date: { type: Date, required: true },
  receiving_account_number: { type: String, required: true },
  date_payable: { type: Date, required: true },
  amount_payable: { type: Number, required: true },
  status: { type: String, required: true },
  address: { type: String, required: true },
  company: { type: String, required: true },
});

const Information = mongoose.model("Information", InformationSchema);

export default Information;
