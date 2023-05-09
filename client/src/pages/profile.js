import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@apollo/client";
import { GET_user, UPDATE_MEMBER } from "../utils/apolloGraphql";
import { requiredOptions } from "../utils/requiredOptions";
import useSignInStore from "../zustand/useSignInStore";

const Profile = () => {
  const [editable, setEditable] = useState(false);
  const [defaultName, setDefaultName] = useState("");
  const { token } = useSignInStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const [update_userInfo_Fn] = useMutation(UPDATE_MEMBER, {
    onCompleted() {
      getUser();
      setEditable(false);
    },
    onError(error) {
      console.log(error);
      return null;
    },
  });

  const handleUpdate = async (data) => {
    console.log(data);
    const { name, password } = data;
    await update_userInfo_Fn({
      variables: { userUpdateInput: { name, password } },
    });
  };

  return (
    // <div className="form-container">
    <div className="profile-container">
      {user &&
        (editable ? (
          <div>
            <form>
              <div className="edit-field">
                <label>Name</label>
                <div style={{ width: "100%" }}>
                  <input
                    type="text"
                    name="name"
                    defaultValue={defaultName}
                    {...register("name", requiredOptions.name)}
                  />
                  <small>{errors?.name && errors.name.message}</small>
                </div>
              </div>
              <div className="edit-field">
                <label>Email</label>
                <input
                  style={{ background: "#5f5e5e" }}
                  value={user.email}
                  {...register("email")}
                  disabled
                />
              </div>
              <div className="edit-field">
                <label>Password</label>
                <a>Change Password</a>
              </div>
              <ul className="edit-buttons">
                <button onClick={() => setEditable(false)}>CANCEL</button>
                <button onClick={handleSubmit(handleUpdate)}>SAVE</button>
              </ul>
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
