import mongoose from "mongoose";

const importJobSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    totalRows: { type: Number, default: 0 },
    processedRows: { type: Number, default: 0 },
    inserted: { type: Number, default: 0 },
    duplicates: { type: Array, default: [] },
    errors: { type: Array, default: [] },
    failReason: { type: String, default: null },
    createdBy: { type: String },
  },
  { timestamps: true }
);

const ImportJob = mongoose.model("ImportJob", importJobSchema);

export default ImportJob;
