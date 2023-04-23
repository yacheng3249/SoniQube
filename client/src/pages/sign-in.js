import React, { useMemo } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { MUTATION_LOGIN, GET_user } from "../utils/apolloGraphql";
import useSignInStore from "../zustand/useSignInStore";
import useCurrentSongStore from "../zustand/useCurrentSongStore";
import { Link } from "react-router-dom";

const SignIn = () => {
  const { token, setToken, removeToken } = useSignInStore();
  const { removeCurrentSong } = useCurrentSongStore();
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
  };

  const handleLogOut = () => {
    removeToken();
    removeCurrentSong();
    reset();
  };

  const {
    data: userData,
    loading: getUserLoading,
    refetch: getUser,
  } = useQuery(GET_user, {
    fetchPolicy: "network-only",
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
      {user ? (
        <div>
          <h2>Welcome {user.name}!</h2>
          <Link to="/">Back to SonoQube Player</Link>
          <p onClick={() => handleLogOut()}>Log out</p>
        </div>
      ) : (
        <>
          <h2>SIGN IN</h2>
          <form onSubmit={handleSubmit(handleLogin)}>
            <Field>
              <label>Email</label>
              <input
                type="email"
                name="email"
                {...register("email", loginOptions.email)}
              />
              <small>{errors?.email && errors.email.message}</small>
            </Field>
            <Field>
              <label>Password</label>
              <input
                type="password"
                name="password"
                {...register("password", loginOptions.password)}
              />
              <small>{errors?.password && errors.password.message}</small>
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
  margin-top: 2rem;

  h2 {
    color: rgb(65, 65, 65);
  }

  p {
    text-decoration: underline;
    cursor: pointer;
    color: rgb(65, 65, 65);
  }

  a {
    color: rgb(65, 65, 65);
  }

  form {
    color: rgb(65, 65, 65);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
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

const Buttons = styled.div`
  width: 80%;
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

  a {
    width: 50%;
    font-size: 1.2rem;
    margin-top: 2rem;
    margin-left: 1rem;
    color: rgb(65, 65, 65);
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }
`;

export default SignIn;
