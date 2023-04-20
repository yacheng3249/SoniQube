import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { MUTATION_LOGIN, GET_user } from "../utils/apolloGraphql";
import useSignInStore from "../zustand/useSignInStore";
import { Link } from "react-router-dom";

const SignIn = ({ isSubmitted }) => {
  const { token, setToken, removeToken } = useSignInStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loginFn, { loading: loginLoading }] = useMutation(MUTATION_LOGIN, {
    onCompleted({ login }) {
      if (login.success) {
        setToken(login.user?.token);
      } else {
        console.log(login.message);
      }
    },
    onError() {
      return null;
    },
  });

  const loginOptions = useMemo(
    () => ({
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

  const handleLogin = async (data) => {
    const { email, password } = data;
    await loginFn({
      variables: { email, password },
    });
    isSubmitted.current = true;
  };

  const handleLogOut = () => {
    removeToken();
    isSubmitted.current = false;
    reset();
  };

  const {
    data: userData,
    loading: getUserLoading,
    refetch: getUser,
  } = useQuery(GET_user, {
    skip: !token,
    onError() {
      return null;
    },
  });
  const user = userData?.user;
  // const user = useMemo(() => userData?.user, [userData, token]);

  // useEffect(() => {
  //   getUser();
  // }, [getUser]);

  console.log(token);
  console.log(user);

  return (
    <SignInContainer>
      {isSubmitted.current && user ? (
        <div>
          <h2>Welcome {user.name}!</h2>
          <button>
            <Link to="/">Back to music player</Link>
          </button>
          <button onClick={() => handleLogOut()}>Log out</button>
        </div>
      ) : (
        <>
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit(handleLogin)}>
            <Field>
              <label>Email</label>
              <input
                type="email"
                name="email"
                {...register("email", loginOptions.email)}
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
                {...register("password", loginOptions.password)}
              />
              <small
                style={{
                  color: "#DC143C",
                }}
              >
                {errors?.password && errors.password.message}
              </small>
            </Field>
            <Buttons>
              <button>Submit</button>
              <Link to="/registration">Sign Up</Link>
            </Buttons>
          </form>
        </>
      )}
    </SignInContainer>
  );
};

const SignInContainer = styled.div`
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

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default SignIn;
