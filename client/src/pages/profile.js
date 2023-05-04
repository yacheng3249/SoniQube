import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useQuery } from "@apollo/client";
import { GET_user } from "../utils/apolloGraphql";
import useSignInStore from "../zustand/useSignInStore";

const Profile = () => {
  const [editable, setEditable] = useState(false);
  const [defaultName, setDefaultName] = useState("");
  const { token } = useSignInStore();

  const editOptions = useMemo(
    () => ({
      name: { required: "* Name is required" },
    }),
    []
  );

  const { data: userData, refetch: getUser } = useQuery(GET_user, {
    fetchPolicy: "network-only",
    skip: !token,
    onCompleted({ user }) {
      setDefaultName(user.name);
    },
    onError() {
      return null;
    },
  });
  const user = userData?.user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  console.log(token);
  console.log(user);

  return (
    // <div className="form-container">
    <div className="profile-container">
      {user &&
        (editable ? (
          <div>
            <form /*onSubmit={handleSubmit(handleRegistration)}*/>
              <div className="field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={defaultName}
                  {...register("name", editOptions.name)}
                />
                <small>{errors?.name && errors.name.message}</small>
              </div>
              <div className="field">
                <label>Email</label>
                <input value={user.email} {...register("email")} disabled />
                <small>{errors?.email && errors.email.message}</small>
              </div>
              <button className="submit-button">Submit</button>
            </form>
          </div>
        ) : (
          <>
            <h2>PROFILE</h2>
            <p>
              Name: <span>{user.name}</span>
            </p>
            <p>
              Email: <span>{user.email}</span>
            </p>
            <FontAwesomeIcon icon={faEdit} onClick={() => setEditable(true)} />
          </>
        ))}
    </div>

    // </div>
  );
};

export default Profile;
