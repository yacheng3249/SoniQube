import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  CHECK_EMAIL,
  SEND_VERIFICATIONCODE,
  CHECK_VERIFICATIONCODE,
  RESET_PASSWORD,
} from "../utils/apolloGraphql";
import { useAlert } from "../providers/AlertProvider";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { requiredOptions } from "../utils/requiredOptions";

const ForgetPassword = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const stepContent = () => {
    switch (step) {
      case "email":
        return <CheckEmail setStep={setStep} setEmail={setEmail} />;
      case "verify":
        return <VerifyCode setStep={setStep} email={email} />;
      case "reset":
        return <ResetPassword email={email} />;
      default:
        return null;
    }
  };

  const resetForm = useForm({
    defaultValues: {
      email: "",
      verificationCode: "",
      password: "",
      rePassword: "",
      //
      _showPassword: false,
      _showRePassword: false,
    },
  });
  return (
    <div className="form-container">
      <h2>Reset your password</h2>
      <FormProvider {...resetForm}>{stepContent()}</FormProvider>
    </div>
  );
};

const CheckEmail = ({ setStep, setEmail }) => {
  const { notify } = useAlert();
  const {
    handleSubmit,
    getValues,
    register,
    formState: { errors },
  } = useFormContext();

  const [sendVerificationCode_Fn, { loading: send_VerificationCode_loading }] =
    useMutation(SEND_VERIFICATIONCODE, {
      onCompleted({ sendVerificationCode: { message } }) {
        if (message) {
          notify(message);
        } else {
          setStep("verify");
        }
      },
      onError(error) {
        console.log(error);
        return null;
      },
    });

  const [checkEmail_Fn, { loading: check_Email_loading }] = useMutation(
    CHECK_EMAIL,
    {
      onCompleted({ checkEmail: { message } }) {
        if (message) {
          notify(message);
        } else {
          const email = getValues("email");
          sendVerificationCode_Fn({
            variables: {
              email,
            },
          });
        }
      },
      onError() {
        return null;
      },
    }
  );

  const onSubmit = (data) => {
    setEmail(data.email);
    checkEmail_Fn({
      variables: {
        email: data.email,
      },
    });
  };

  return (
    <div className="formProvider">
      <div className="field">
        <label required>Account Email</label>
        <input
          placeholder="Please enter your email"
          type="text"
          {...register("email", requiredOptions.email)}
        />
        <small>{errors?.email && errors.email.message}</small>
      </div>

      <button
        className="submit-button"
        style={{ "font-size": "16px", width: "60%" }}
        onClick={handleSubmit(onSubmit)}
      >
        {check_Email_loading || send_VerificationCode_loading ? (
          <FontAwesomeIcon size="1x" icon={faSpinner} spin={true} />
        ) : (
          <>Send Verification Code</>
        )}
      </button>
    </div>
  );
};

const VerifyCode = ({ setStep, email }) => {
  const { notify } = useAlert();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useFormContext();

  const [
    check_VerificationCodeFn,
    { loading: check_VerificationCode_loading },
  ] = useMutation(CHECK_VERIFICATIONCODE, {
    fetchPolicy: "network-only",
    onCompleted({ checkVerificationCode: { message } }) {
      if (message) {
        notify(message);
      } else {
        setStep("reset");
      }
    },
    onError(error) {
      console.log(error);
      return null;
    },
  });

  const onSubmit = (data) => {
    check_VerificationCodeFn({
      variables: {
        email,
        verificationCode: data.verificationCode,
      },
    });
  };

  const [sendVerificationCode_Fn, { loading: send_VerificationCode_loading }] =
    useMutation(SEND_VERIFICATIONCODE, {
      onCompleted({ sendVerificationCode: { message } }) {
        if (message) {
          notify(message);
        } else {
          notify("Code just resent!");
        }
      },
      onError(error) {
        console.log(error);
        return null;
      },
    });

  const handleResentEmail = () => {
    sendVerificationCode_Fn({
      variables: {
        email,
      },
    });
  };

  return (
    <div className="formProvider">
      <div className="field">
        <p>We just sent a verification code over to {email}</p>
        <input
          placeholder="Please enter code"
          type="text"
          {...register("verificationCode", requiredOptions.verificationCode)}
        />
        <small>
          {errors?.verificationCode && errors.verificationCode.message}
        </small>
      </div>
      <button className="submit-button" onClick={handleSubmit(onSubmit)}>
        {check_VerificationCode_loading ? (
          <FontAwesomeIcon size="1x" icon={faSpinner} spin={true} />
        ) : (
          <>Confirm</>
        )}
      </button>
      <button className="resend-code" onClick={handleSubmit(handleResentEmail)}>
        {send_VerificationCode_loading ? (
          <FontAwesomeIcon size="1x" icon={faSpinner} spin={true} />
        ) : (
          <>Resend code</>
        )}
      </button>
    </div>
  );
};

const ResetPassword = ({ email }) => {
  const navigate = useNavigate();
  const { notify } = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  const [resetPassword_Fn] = useMutation(RESET_PASSWORD, {
    onCompleted({ resetPassword: { message } }) {
      if (message) {
        notify(message);
      } else {
        notify("Password reset successfully!");
        navigate("/login");
      }
    },
    onError(error) {
      console.log(error);
      return null;
    },
  });

  const handleResetting = (data) => {
    if (data.password !== data.rePassword) {
      return notify("The two passwords do not match.");
    } else {
      resetPassword_Fn({
        variables: {
          email,
          password: data.password,
        },
      });
    }
  };

  return (
    <div className="formProvider">
      <div className="field">
        <label>Enter new password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            {...register("password", requiredOptions.password)}
          />
          <FontAwesomeIcon
            className="visibility"
            onClick={() => setShowPassword(!showPassword)}
            size="1x"
            icon={showPassword ? faEye : faEyeSlash}
          />
        </div>
        <small>{errors?.password && errors.password.message}</small>
      </div>
      <div className="field">
        <label>Confirm new password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showRePassword ? "text" : "password"}
            name="rePassword"
            {...register("rePassword", requiredOptions.rePassword)}
          />
          <FontAwesomeIcon
            className="visibility"
            onClick={() => setShowRePassword(!showRePassword)}
            size="1x"
            icon={showRePassword ? faEye : faEyeSlash}
          />
        </div>
        <small>{errors?.rePassword && errors.rePassword.message}</small>
      </div>
      <button className="submit-button" onClick={handleSubmit(handleResetting)}>
        Reset Password
      </button>
    </div>
  );
};

export default ForgetPassword;
