import https from "https";

const ACCESS_TOKEN = "BBkN9XV1SNG7w2DKyuRZemMcnLVz_vNs";

const smsService = {
  sendSMS: (phones, content, type = 2, sender = "") => {
    return new Promise((resolve, reject) => {
      if (!phones || !content) {
        return reject(new Error("Missing phone numbers or content"));
      }

      const apiUrl = new URL("https://api.speedsms.vn/index.php/sms/send");
      const postData = JSON.stringify({
        to: Array.isArray(phones) ? phones : [phones],
        content: content,
        sms_type: type,
        sender,
      });

      const authHeader =
        "Basic " + Buffer.from(`${ACCESS_TOKEN}:`).toString("base64");

      const options = {
        hostname: apiUrl.hostname,
        port: 443,
        path: apiUrl.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let responseBody = "";

        res.setEncoding("utf8");
        res.on("data", (chunk) => (responseBody += chunk));

        res.on("end", () => {
          try {
            const result = responseBody ? JSON.parse(responseBody) : {};

            console.log("🚀 ~ res.on ~ result:", result);
            if (res.statusCode === 200 && result.status === "success") {
              console.log("SMS sent successfully");
              resolve(result);
            } else {
              const errorMsg = result.message || `HTTP ${res.statusCode}`;
              console.error("SMS failed:", errorMsg);
              reject({ message: `SMS failed: ${errorMsg}` });
            }
          } catch (e) {
            reject({ message: `Invalid JSON response: ${e.message}` });
          }
        });
      });

      req.on("error", (e) => {
        console.error("Request error:", e);
        reject({ message: `Network error: ${e.message}` });
      });

      req.write(postData);
      req.end();
    });
  },
};

export default smsService;
