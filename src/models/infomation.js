import { default as mongoose } from "mongoose";

const InformationSchema = new mongoose.Schema({
  order_code: { type: String, required: true, unique: true },
  review_results: { type: String, required: true },
  loan_amount: { type: Number, required: true },
  amount_to_the_account: { type: Number, required: true },
  confirm_loan_status: { type: String, required: true },
  application_period: { type: String, required: true },
  loan_date: { type: String, required: true },
  overdue: { type: Number },
  amount_payable: { type: Number, required: true },
  order_type: { type: String, required: true },
  assessment_score: { type: Number, required: true },
  loan_cycle: { type: Number, required: true },
  loan_type: { type: String, required: true },
  application_chanel: { type: String, required: true },
  order_status: { type: String, required: true },
  date_payable: { type: String },
  staff_withdraw_payment: { type: String, required: true },
  front_end_user_id_img: { type: String, required: true },
  back_end_user_id_img: { type: String, required: true },
  user_id: { type: String, required: true, unique: true },
  name: { type: String }
});

const Information = mongoose.model("Information", InformationSchema);

export default Information;
