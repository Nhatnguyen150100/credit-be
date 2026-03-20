import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import Information from "../models/infomation";

// CSV columns that map directly to Information fields (images and assignee excluded)
const CSV_COLUMNS = [
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
  "address",
  "company",
];

const csvService = {
  importCsv: (fileBuffer) => {
    return new Promise(async (resolve, reject) => {
      try {
        let records;
        try {
          records = parse(fileBuffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            bom: true,
          });
        } catch (parseError) {
          return reject("File CSV không hợp lệ: " + parseError.message);
        }

        if (records.length === 0) {
          return reject("File CSV không có dữ liệu");
        }

        // Validate that required columns exist
        const requiredColumns = [
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
        const fileColumns = Object.keys(records[0]);
        const missingColumns = requiredColumns.filter(
          (col) => !fileColumns.includes(col)
        );
        if (missingColumns.length > 0) {
          return reject(
            `File CSV thiếu các cột bắt buộc: ${missingColumns.join(", ")}`
          );
        }

        const results = {
          inserted: 0,
          duplicates: [],
          errors: [],
        };

        for (let i = 0; i < records.length; i++) {
          const row = records[i];
          const rowNum = i + 2; // account for header row

          try {
            const loanDate = new Date(row.loan_date);
            const datePayable = new Date(row.date_payable);

            if (isNaN(loanDate.getTime())) {
              results.errors.push({
                row: rowNum,
                user_id: row.user_id,
                reason: "loan_date không hợp lệ",
              });
              continue;
            }
            if (isNaN(datePayable.getTime())) {
              results.errors.push({
                row: rowNum,
                user_id: row.user_id,
                reason: "date_payable không hợp lệ",
              });
              continue;
            }

            const doc = {
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
            };

            await Information.create(doc);
            results.inserted++;
          } catch (err) {
            if (err.code === 11000) {
              // Duplicate key (user_id or phone_number)
              const duplicateField = Object.keys(err.keyPattern || {})[0];
              results.duplicates.push({
                row: rowNum,
                user_id: row.user_id,
                reason: `Trùng lặp ${duplicateField}`,
              });
            } else {
              results.errors.push({
                row: rowNum,
                user_id: row.user_id,
                reason: err.message,
              });
            }
          }
        }

        return resolve({
          data: results,
          message: `Import thành công ${results.inserted}/${records.length} bản ghi`,
        });
      } catch (error) {
        reject(error.message);
      }
    });
  },

  exportCsv: (filters) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { nameLike, phoneNumber, status, datePayable, userId, assigneeIds } =
          filters || {};

        const query = {};
        if (nameLike) query.name = new RegExp(nameLike, "i");
        if (phoneNumber) query.phone_number = new RegExp(phoneNumber, "i");
        if (status) query.status = status;
        if (userId) query.user_id = new RegExp(userId, "i");
        if (datePayable) query.date_payable = { $lte: new Date(datePayable) };
        if (assigneeIds) {
          const ids = Array.isArray(assigneeIds) ? assigneeIds : [assigneeIds];
          query.assignee = { $in: ids };
        }

        const records = await Information.find(query)
          .select(CSV_COLUMNS.join(" "))
          .lean();

        const rows = records.map((record) => {
          const row = {};
          CSV_COLUMNS.forEach((col) => {
            const val = record[col];
            if (val instanceof Date) {
              row[col] = val.toISOString().split("T")[0];
            } else {
              row[col] = val ?? "";
            }
          });
          return row;
        });

        const csvString = stringify(rows, {
          header: true,
          columns: CSV_COLUMNS,
        });

        return resolve({
          data: "\ufeff" + csvString,
          message: `Export thành công ${records.length} bản ghi`,
        });
      } catch (error) {
        reject(error.message);
      }
    });
  },
};

export default csvService;
