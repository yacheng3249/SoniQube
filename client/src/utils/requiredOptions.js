export const requiredOptions = {
  name: { required: "* Name is required." },
  email: { required: "* Email is required." },
  password: {
    required: "* Password is required.",
    minLength: {
      value: 6,
      message: "Password must have at least 6 characters.",
    },
  },
  rePassword: {
    required: "* Please enter the password again.",
    minLength: {
      value: 6,
      message: "Password must have at least 6 characters.",
    },
  },
  oldPassword: {
    required: "* Please enter your current password.",
  },
  verificationCode: { required: "* Verification code is required." },
};
