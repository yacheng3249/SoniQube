import React, { useMemo } from "react";
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

  const [loginFn] = useMutation(MUTATION_LOGIN, {
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
    <div className="login-container">
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
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                {...register("email", loginOptions.email)}
              />
              <small>{errors?.email && errors.email.message}</small>
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                {...register("password", loginOptions.password)}
              />
              <small>{errors?.password && errors.password.message}</small>
            </div>
            <div className="login-action">
              <button>Submit</button>
              <Link to="/registration">Sign Up</Link>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SignIn;
