import React, { useState, useMemo } from "react";
import { useMutation } from "@apollo/client";
import {
  CHECK_EMAIL,
  SEND_VERIFICATIONCODE,
  CHECK_VERIFICATIONCODE,
} from "../utils/apolloGraphql";
import { useAlert } from "../providers/AlertProvider";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
        return (
          <ResetForm />
          // <div>
          //   <Stack spacing={2}>

          //     <ResetSubmitButton />
          //   </Stack>
          // </div>
        );

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
    <div>
      <h2>Reset your password</h2>
      <FormProvider {...resetForm}>{stepContent()}</FormProvider>
    </div>
  );
};

const CheckEmail = ({ setStep, setEmail }) => {
  const { notify } = useAlert();
  const { handleSubmit, getValues, register } = useFormContext();

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
      onError(err) {
        // console.log(err);
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
    <div>
      <label required>Account Email</label>
      <input
        placeholder="Please enter your email"
        type="text"
        name="email"
        {...register("email" /*{ required: "* Email is required" }*/)}
      />
      <button onClick={handleSubmit(onSubmit)}>Send Verification Code</button>
    </div>
  );
};

const VerifyCode = ({ setStep, email }) => {
  const { notify } = useAlert();
  const { handleSubmit, register } = useFormContext();
  const [resend, setResend] = useState(false);
  const [sendingDialig, setSendingDialig] = useState(true);

  // const handleCloseDialog = () => {
  //   setSendingDialig(false);
  // };
  // const onEndClock = useCallback(() => {
  //   setResend(false);
  // }, []);

  // verify codes
  const [
    check_VerificationCodeFn,
    { loading: check_VerificationCode_loading },
  ] = useMutation(CHECK_VERIFICATIONCODE, {
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

  const [sendVerificationCode_Fn] = useMutation(SEND_VERIFICATIONCODE, {
    onCompleted({ sendVerificationCode: { message } }) {
      if (message) {
        notify(message);
      } else {
        setResend(true);
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
    <div>
      <p>We just sent a verification code over to {email}</p>
      <input
        placeholder="Please enter code"
        type="text"
        name="verificationCode"
        {...register(
          "verificationCode" /*{ required: "* Email is required" }*/
        )}
      />
      <button onClick={handleSubmit(onSubmit)}>Confirm</button>
      <a onClick={handleSubmit(handleResentEmail)}>Resend code</a>
    </div>
  );
};

const ResetForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const resetOptions = useMemo(
    () => ({
      password: {
        required: "* Password is required",
        minLength: {
          value: 6,
          message: "Password must have at least 6 characters",
        },
      },
    }),
    []
  );

  return (
    <div>
      <div className="field">
        <label>Enter new password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          {...register("password", resetOptions.password)}
        />
        <FontAwesomeIcon
          onClick={() => setShowPassword(!showPassword)}
          size="1x"
          icon={showPassword ? faEye : faEyeSlash}
        />
        <small>{errors?.password && errors.password.message}</small>
      </div>
      <div className="field">
        <label>Confirm new password</label>
        <input
          type={showRePassword ? "text" : "password"}
          name="password"
          {...register("password", resetOptions.password)}
        />
        <FontAwesomeIcon
          onClick={() => setShowRePassword(!showRePassword)}
          size="1x"
          icon={showRePassword ? faEye : faEyeSlash}
        />
        <small>{errors?.password && errors.password.message}</small>
      </div>
      <button className="submit-button">Submit</button>
    </div>
  );
};

export default ForgetPassword;
