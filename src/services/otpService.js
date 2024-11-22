import { Infobip, AuthType } from '@infobip-api/sdk';

const infobipClient = new Infobip({
  baseUrl: process.env.INFOBIP_URL,
  apiKey: process.env.INFOBIP_KEY,
  authType: AuthType.ApiKey,
});

const otpService = {
  sentOTP: (phone_number) => {
    return new Promise(async (resolve, reject) => {
      try {
        const otpGenerated = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        const infobipResponse = await infobipClient.channels.sms.send({
          type: 'text',
          messages: [{
            destinations: [
              {
                to: `+84${Number(phone_number)}`,
              },
            ],
            from: 'Cat credit',
            text: `Nhập mã OTP ${otpGenerated} để đăng nhập.`,
          }],
        });
        return resolve({
          status: infobipResponse.status,
          message:
            "Gửi otp thành công. Hãy kiểm tra điện thoại và nhập opt trong vòng 3 phút",
          data: {
            otp: otpGenerated,
          },
        });
      } catch (error) {
        console.error(error.message);
        return reject({
          status: 400,
          message: "Gửi OTP thất bại.",
        });
      }
    });
  },
};

export default otpService;
