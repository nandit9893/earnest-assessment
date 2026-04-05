const generateOTP = (digit: number) => {
  if (digit <= 0) return "";
  let otp = "";
  otp += Math.floor(Math.random() * 9) + 1;
  for (let i = 1; i < digit; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

export default generateOTP;