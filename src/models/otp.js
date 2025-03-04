import { default as mongoose } from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    otpCustom: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
      maxlength: 6,
      validate: {
        validator: (value) => /^[0-9]{6}$/.test(value),
        message: "OTP phải là 6 chữ số",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model("Otp", OtpSchema);

export default Otp;
