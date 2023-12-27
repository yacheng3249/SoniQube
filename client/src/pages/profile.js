import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER, UPDATE_MEMBER } from "../utils/apolloGraphql";
import { requiredOptions } from "../utils/requiredOptions";
import useSignInStore from "../zustand/useSignInStore";
import { useAlert } from "../providers/AlertProvider";

const Profile = () => {
  const [profileState, setProfileState] = useState("profile");
  const { token } = useSignInStore();
  const { notify } = useAlert();

  const { data: userData, refetch: getUser } = useQuery(GET_USER, {
    fetchPolicy: "network-only",
    skip: !token,
    onError() {
      return null;
    },
  });
  const user = userData?.user;

  const [update_userInfo_Fn] = useMutation(UPDATE_MEMBER, {
    onCompleted({ updateUserInfo: { message } }) {
      if (message) {
        notify(message);
      } else {
        getUser();
        setProfileState("profile");
      }
    },
    onError(error) {
      console.log(error);
      return null;
    },
  });

  const profileContent = () => {
    switch (profileState) {
      case "profile":
        return <UserInfo user={user} setProfileState={setProfileState} />;
      case "edit":
        return (
          <EditProfile
            setProfileState={setProfileState}
            user={user}
            getUser={getUser}
            update_userInfo_Fn={update_userInfo_Fn}
          />
        );
      case "passwordSetting":
        return (
          <ChangePassword
            setProfileState={setProfileState}
            update_userInfo_Fn={update_userInfo_Fn}
          />
        );
      default:
        return null;
    }
  };

  return <div className="profile-container">{user && profileContent()}</div>;
};

const UserInfo = ({ user, setProfileState }) => {
  return (
    <>
      <h2>PROFILE</h2>
      <div className="profile-format">
        <p>Name</p>
        <p>{user.name}</p>
      </div>
      <div className="profile-format">
        <p>Email</p>
        <p>{user.email}</p>
      </div>
      <div className="profile-format">
        <p>Mobile</p>
        <p>{user.mobile}</p>
      </div>
      <div className="profile-format">
        <p>Gender</p>
        <p>{user.gender}</p>
      </div>
      <div className="profile-format">
        <p>Birthday</p>
        <p>{user.birthday ? user.birthday.split("T")[0] : user.birthday}</p>
      </div>
      <FontAwesomeIcon icon={faEdit} onClick={() => setProfileState("edit")} />
    </>
  );
};

const EditProfile = ({ setProfileState, update_userInfo_Fn, user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleUpdate = async (data) => {
    await update_userInfo_Fn({
      variables: {
        userUpdateInput: {
          name: data.name,
          mobile: data.mobile,
          gender: data.gender,
          birthday: new Date(data.birthday),
        },
      },
    });
  };

  return (
    <div>
      <form>
        <div className="edit-field">
          <label>Name</label>
          <div style={{ width: "100%" }}>
            <input
              type="text"
              defaultValue={user.name}
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
          <label>Mobile</label>
          <div style={{ width: "100%" }}>
            <input
              type="text"
              defaultValue={user.mobile}
              {...register("mobile")}
            />
          </div>
        </div>
        <div className="edit-field">
          <label>Gender</label>
          <p className="checkbox">
            <input
              type="radio"
              value="male"
              defaultChecked={user.gender === "male"}
              {...register("gender")}
            />
            male
          </p>
          <p className="checkbox">
            <input
              type="radio"
              value="female"
              defaultChecked={user.gender === "female"}
              {...register("gender")}
            />
            female
          </p>
          <p className="checkbox">
            <input
              type="radio"
              value="other"
              defaultChecked={user.gender === "other"}
              {...register("gender")}
            />
            other
          </p>
        </div>
        <div className="edit-field">
          <label>Birthday</label>
          <input
            type="date"
            defaultValue={
              user.birthday ? user.birthday.split("T")[0] : user.birthday
            }
            {...register("birthday")}
          />
        </div>
        <div className="edit-field">
          <label>Password</label>
          <a onClick={() => setProfileState("passwordSetting")}>
            Change Password
          </a>
        </div>
        <ul className="edit-buttons">
          <button onClick={() => setProfileState("profile")}>CANCEL</button>
          <button onClick={handleSubmit(handleUpdate)}>SAVE</button>
        </ul>
      </form>
    </div>
  );
};

const ChangePassword = ({ setProfileState, update_userInfo_Fn }) => {
  const { notify } = useAlert();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleUpdate = async (data) => {
    const { oldPassword, newPassword, rePassword } = data;
    if (newPassword !== rePassword) {
      return notify(
        "The new password does not match the confirmed new password."
      );
    } else {
      await update_userInfo_Fn({
        variables: { userUpdateInput: { oldPassword, newPassword } },
      });
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "2.5rem" }}>Change password</h2>
      <form>
        <div className="field change-password-input">
          <label>Old password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showOldPassword ? "text" : "password"}
              {...register("oldPassword", requiredOptions.oldPassword)}
            />
            <FontAwesomeIcon
              className="visibility"
              onClick={() => setShowOldPassword(!showOldPassword)}
              size="1x"
              icon={showOldPassword ? faEye : faEyeSlash}
            />
          </div>
          <small>{errors?.oldPassword && errors.oldPassword.message}</small>
        </div>
        <div className="field change-password-input">
          <label>New password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showNewPassword ? "text" : "password"}
              {...register("newPassword", requiredOptions.password)}
            />
            <FontAwesomeIcon
              className="visibility"
              onClick={() => setShowNewPassword(!showNewPassword)}
              size="1x"
              icon={showNewPassword ? faEye : faEyeSlash}
            />
          </div>
          <small>{errors?.newPassword && errors.newPassword.message}</small>
        </div>
        <div className="field change-password-input">
          <label>Confirm new password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showRePassword ? "text" : "password"}
              {...register("rePassword", requiredOptions.rePassword)}
            />
            <FontAwesomeIcon
              className="visibility"
              onClick={() => setShowRePassword(!showRePassword)}
              size="1x"
              icon={showRePassword ? faEye : faEyeSlash}
            />
          </div>
          <small>{errors?.rePassword && errors.rePassword.message}</small>
        </div>
        <ul className="edit-buttons">
          <button onClick={() => setProfileState("profile")}>CANCEL</button>
          <button onClick={handleSubmit(handleUpdate)}>SAVE</button>
        </ul>
      </form>
    </div>
  );
};

export default Profile;
