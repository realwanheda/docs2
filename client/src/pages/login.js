import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import styles from "./login.module.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import loginPic from "../assets/loginpic.png"; // Importing the image

import { api } from "../api.js";

export default function Login() {
  const navigate = useNavigate();
  const loginUser = async (res) => {
    const { name, email, picture } = jwtDecode(res.credential);
    localStorage.setItem("userInfo", JSON.stringify({ name, email, picture }));

    const response = await api.post("/api/user/register", {
      name,
      email,
      picture,
    });

    if (response.status === 200 || response.status === 201) {
      console.log(response.data);
      localStorage.setItem("token", response.data.data._id);
      navigate("/dashboard");
    }
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.welcomeText}>Welcome to Ground Zero</h1>
      <div className={styles.content}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            loginUser(credentialResponse);
          }}
          size="large"
          theme="dark"
          type="standard"
          onError={() => {
            console.log("Login Failed");
          }}
          useOneTap
        />
      </div>
      <div className={styles.imageContainer}>
        <img src={loginPic} alt="Login Pic" /> {/* Using imported image */}
      </div>
    </div>
  );
}
