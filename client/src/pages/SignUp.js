import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "../utils/apolloGraphql";
import { requiredOptions } from "../utils/requiredOptions";
import useSignInStore from "../zustand/useSignInStore";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../providers/AlertProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
  const navigate = useNavigate();
  const { notify } = useAlert();
  const { setToken } = useSignInStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const [signUpFn] = useMutation(SIGNUP_MUTATION, {
    onCompleted({ signUp }) {
      if (signUp.message) {
        reset();
        notify(signUp.message);
      } else {
        setToken(signUp.user?.token);
        notify(`Welcome to SoniQube, ${signUp.user.name}`);
        navigate("/");
      }
    },
    onError() {
      return null;
    },
  });

  const handleRegistration = async (data) => {
    const { name, email, password } = data;
    await signUpFn({
      variables: { name, email, password },
    });
  };

  return (
    <div className="form-container">
      <h2>SIGN UP</h2>
      <form onSubmit={handleSubmit(handleRegistration)}>
        <div className="field">
          <label>Name</label>
          <input
            type="text"
            name="name"
            {...register("name", requiredOptions.name)}
          />
          <small>{errors?.name && errors.name.message}</small>
        </div>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            {...register("email", requiredOptions.email)}
          />
          <small>{errors?.email && errors.email.message}</small>
        </div>
        <div className="field">
          <label>Password</label>
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
        <button className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default SignUp;
