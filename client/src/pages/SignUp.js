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
        alert("Successfully signed up!");
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
      <h2>SIGN UP</h2>
      <form onSubmit={handleSubmit(handleRegistration)}>
        <Field>
          <label>Name</label>
          <input
            type="text"
            name="name"
            {...register("name", signUpOptions.name)}
          />
          <small>{errors?.name && errors.name.message}</small>
        </Field>
        <Field>
          <label>Email</label>
          <input
            type="email"
            name="email"
            {...register("email", signUpOptions.email)}
          />
          <small>{errors?.email && errors.email.message}</small>
        </Field>
        <Field>
          <label>Password</label>
          <input
            type="password"
            name="password"
            {...register("password", signUpOptions.password)}
          />
          <small>{errors?.password && errors.password.message}</small>
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
  margin-top: 2rem;

  h2 {
    color: rgb(65, 65, 65);
  }

  form {
    color: rgb(65, 65, 65);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;

    button {
      width: 50%;
      font-size: 1.2rem;
      padding: 0.5rem;
      margin-top: 2rem;
      margin-right: 1rem;
      background: transparent;
      color: rgb(65, 65, 65);
      border: 2px solid rgb(65, 65, 65);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &:hover {
        background-color: rgb(65, 65, 65);
        color: white;
      }
    }
  }
`;

const Field = styled.div`
  width: 80%;

  label {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    font-size: 1rem;
    padding: 0.5rem;
    margin: 0.5rem 0rem;
    background-color: #fafafa;
    border-width: thin;
    border-color: #d3d3d3;
    border-radius: 4px;

    &:focus {
      outline: none;
      border-color: rgb(65, 65, 65);
    }
  }

  small {
    font-size: 1rem;
    margin-top: 0.5rem;
    color: #dc143c;
  }
`;

export default SignUp;
