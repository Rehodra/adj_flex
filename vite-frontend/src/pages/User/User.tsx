import React from "react";
import styles from "./User.module.scss";
import { Navigate, useNavigate } from "react-router";
import { Link } from "react-router-dom";

const User = () => {
  const localStorageLicenseKey = localStorage.getItem("LicenseKey");
  const navigate = useNavigate();

  if (localStorageLicenseKey === null) {
    return <Navigate to="/authentication" />;
  }

  return (
    <div className={styles.parentContainer}>
      <div className={styles.top}>
        <img
          style={{ width: "30px", marginRight: "2rem" }}
          src="/images/Logo.png"
          alt="Logo"
        />
        <div className={styles.navButtons}>
          <Link className={styles.navButtonsLinks} to={"/search"}>
            Search Tags
          </Link>
          <Link className={styles.navButtonsLinks} to={"/judgementsearch"}>
            Suggest Actions
          </Link>
        </div>
        <div className={styles.top_left}>
          <button
            onClick={() => {
              localStorage.removeItem("LicenseKey");
              navigate("/authentication");
            }}
          >
            Logout
          </button>
          <img
            style={{ width: "40px", marginRight: "2rem" }}
            src="/images/avataaars.png"
            alt="User Avatar"
          />
        </div>
      </div>
    </div>
  );
};

export default User;
