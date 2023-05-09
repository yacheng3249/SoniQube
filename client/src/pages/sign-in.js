import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { MUTATION_LOGIN } from "../utils/apolloGraphql";
import { requiredOptions } from "../utils/requiredOptions";
import useSignInStore from "../zustand/useSignInStore";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const { setToken } = useSignInStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginFn] = useMutation(MUTATION_LOGIN, {
    onCompleted({ login }) {
      if (login.success) {
        setToken(login.user?.token);
        navigate("/");
      } else {
        console.log(login.message);
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
          <input
            type="email"
            name="email"
            {...register("email", requiredOptions.email)}
          />
          <small>{errors?.email && errors.email.message}</small>
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            {...register("password", requiredOptions.password)}
          />
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
