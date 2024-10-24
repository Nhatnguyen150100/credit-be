import { default as mongoose } from "mongoose"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Kết nối MongoDB thành công!');
  } catch (err) {
    console.error('Lỗi kết nối MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;