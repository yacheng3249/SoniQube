import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { MUTATION_LOGIN } from "../utils/apolloGraphql";
import { requiredOptions } from "../utils/requiredOptions";
import useSignInStore from "../zustand/useSignInStore";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../providers/AlertProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const SignIn = () => {
  const navigate = useNavigate();
  const { notify } = useAlert();
  const { setToken } = useSignInStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const [loginFn] = useMutation(MUTATION_LOGIN, {
    onCompleted({ login }) {
      if (login.success) {
        setToken(login.user?.token);
        navigate("/");
      } else {
        notify(login.message);
      }
    },
    onError() {
      return null;
    },
  });

  const handleLogin = async (data) => {
    const { email, password } = data;
    await loginFn({
      variables: { email, password },
    });
  };

  return (
    <div className="form-container">
      <h2>SIGN IN</h2>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="field">
          <label>Email</label>
          <input type="email" {...register("email", requiredOptions.email)} />
          <small>{errors?.email && errors.email.message}</small>
        </div>
        <div className="field">
          <label>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
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
          <Link
            to="/reset_password"
            style={{ "text-align": "right", display: "block" }}
          >
            Forget password?
          </Link>
        </div>
        <div className="login-action">
          <button className="submit-button">Submit</button>
          <Link to="/registration">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
