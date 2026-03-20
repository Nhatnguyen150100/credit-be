import { Worker } from "bullmq";
import { parse } from "csv-parse/sync";
import fs from "fs";
import Information from "../models/infomation";
import ImportJob from "../models/importJob";
import { redisConnection } from "../config/queue";

const CHUNK_SIZE = 100;

const REQUIRED_COLUMNS = [
  "user_id",
  "name",
  "bank_name",
  "phone_number",
  "loan_amount",
  "loan_date",
  "receiving_account_number",
  "date_payable",
  "amount_payable",
  "status",
];

async function processChunk(records, startIndex) {
  const inserted = [];
  const duplicates = [];
  const errors = [];

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const rowNum = startIndex + i + 2;

    try {
      const loanDate = new Date(row.loan_date);
      const datePayable = new Date(row.date_payable);

      if (isNaN(loanDate.getTime())) {
        errors.push({ row: rowNum, user_id: row.user_id, reason: "loan_date không hợp lệ" });
        continue;
      }
      if (isNaN(datePayable.getTime())) {
        errors.push({ row: rowNum, user_id: row.user_id, reason: "date_payable không hợp lệ" });
        continue;
      }

      await Information.create({
        user_id: row.user_id,
        name: row.name,
        bank_name: row.bank_name,
        phone_number: row.phone_number,
        loan_amount: Number(row.loan_amount),
        loan_date: loanDate,
        receiving_account_number: row.receiving_account_number,
        date_payable: datePayable,
        amount_payable: Number(row.amount_payable),
        status: row.status,
        address: row.address || "",
        company: row.company || "",
      });

      inserted.push(rowNum);
    } catch (err) {
      if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyPattern || {})[0];
        duplicates.push({
          row: rowNum,
          user_id: row.user_id,
          reason: `Trùng lặp ${duplicateField}`,
        });
      } else {
        errors.push({ row: rowNum, user_id: row.user_id, reason: err.message });
      }
    }
  }

  return { inserted: inserted.length, duplicates, errors };
}

export function startImportWorker() {
  const worker = new Worker(
    "csv-import",
    async (job) => {
      const { jobId, filePath } = job.data;

      await ImportJob.findByIdAndUpdate(jobId, { status: "processing" });

      let records;
      try {
        const fileBuffer = fs.readFileSync(filePath);
        records = parse(fileBuffer, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          bom: true,
        });
      } catch (parseErr) {
        await ImportJob.findByIdAndUpdate(jobId, {
          status: "failed",
          failReason: "Không thể đọc file CSV: " + parseErr.message,
        });
        throw parseErr;
      }

      if (records.length > 0) {
        const fileColumns = Object.keys(records[0]);
        const missing = REQUIRED_COLUMNS.filter((c) => !fileColumns.includes(c));
        if (missing.length > 0) {
          const reason = `Thiếu cột bắt buộc: ${missing.join(", ")}`;
          await ImportJob.findByIdAndUpdate(jobId, { status: "failed", failReason: reason });
          fs.unlinkSync(filePath);
          throw new Error(reason);
        }
      }

      await ImportJob.findByIdAndUpdate(jobId, { totalRows: records.length });

      let totalInserted = 0;

      for (let i = 0; i < records.length; i += CHUNK_SIZE) {
        const chunk = records.slice(i, i + CHUNK_SIZE);
        const result = await processChunk(chunk, i);

        totalInserted += result.inserted;

        await ImportJob.findByIdAndUpdate(jobId, {
          $inc: { processedRows: chunk.length, inserted: result.inserted },
          $push: {
            duplicates: { $each: result.duplicates },
            errors: { $each: result.errors },
          },
        });

        const progress = Math.round(((i + chunk.length) / records.length) * 100);
        await job.updateProgress(progress);
      }

      try {
        fs.unlinkSync(filePath);
      } catch (_) {}

      await ImportJob.findByIdAndUpdate(jobId, { status: "completed" });

      return { inserted: totalInserted, total: records.length };
    },
    {
      connection: redisConnection,
      concurrency: 1,
    }
  );

  worker.on("failed", async (job, err) => {
    console.error(`[ImportWorker] Job ${job?.id} failed:`, err.message);
    if (job?.data?.jobId) {
      await ImportJob.findByIdAndUpdate(job.data.jobId, {
        status: "failed",
        failReason: err.message,
      }).catch(() => {});
    }
  });

  worker.on("completed", (job) => {
    console.info(`[ImportWorker] Job ${job.id} completed`);
  });

  console.info("[ImportWorker] Started and listening for jobs");
  return worker;
}
