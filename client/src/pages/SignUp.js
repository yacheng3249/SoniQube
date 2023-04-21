import React, { useMemo } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "../utils/apolloGraphql";
import useSignInStore from "../zustand/useSignInStore";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const { setToken } = useSignInStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [signUpFn, { loading: signUpLoading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted({ signUp }) {
      if (signUp.success) {
        setToken(signUp.user?.token);
        navigate("/login");
      }
    },
    onError(error) {
      reset();
      alert(error);
      return null;
    },
  });

  const signUpOptions = useMemo(
    () => ({
      name: { required: "* Name is required" },
      email: { required: "* Email is required" },
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

  const handleRegistration = async (data) => {
    const { name, email, password } = data;
    await signUpFn({
      variables: { name, email, password },
    });
  };

  return (
    <SignUpContainer>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit(handleRegistration)}>
        <Field>
          <label>Name</label>
          <input
            type="text"
            name="name"
            {...register("name", signUpOptions.name)}
          />
          <small
            style={{
              color: "#DC143C",
            }}
          >
            {errors?.name && errors.name.message}
          </small>
        </Field>
        <Field>
          <label>Email</label>
          <input
            type="email"
            name="email"
            {...register("email", signUpOptions.email)}
          />
          <small
            style={{
              color: "#DC143C",
            }}
          >
            {errors?.email && errors.email.message}
          </small>
        </Field>
        <Field>
          <label>Password</label>
          <input
            type="password"
            name="password"
            {...register("password", signUpOptions.password)}
          />
          <small
            style={{
              color: "#DC143C",
            }}
          >
            {errors?.password && errors.password.message}
          </small>
        </Field>
        <button>Submit</button>
      </form>
    </SignUpContainer>
  );
};

const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button {
    font-size: 1rem;
    font-weight: normal;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    background: #ff7676;
    color: white;
    &:hover {
      background-color: #1b1b1b;
      color: white;
    }
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 8px;
  input {
    width: 100%;
    font-size: 1.5rem;
    padding: 0.5rem;
    margin: 0.5rem 0rem;
    background-color: #fafafa;
    border-width: thin;
  }
`;

export default SignUp;
