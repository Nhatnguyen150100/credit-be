import { default as mongoose } from "mongoose";

const InformationSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  user_take_id_img: { type: String },
  front_end_user_id_img: { type: String },
  bank_name: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true },
  loan_amount: { type: Number, required: true },
  loan_date: { type: Date, required: true },
  receiving_account_number: { type: String, required: true },
  date_payable: { type: Date, required: true },
  amount_payable: { type: Number, required: true },
  status: { type: String, required: true },
  address: { type: String },
  company: { type: String },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    validate: {
      validator: function (value) {
        return value === null || mongoose.Types.ObjectId.isValid(value);
      },
      message: "Invalid assignee ID",
    },
  },
});

const Information = mongoose.model("Information", InformationSchema);

export default Information;
