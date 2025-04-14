import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import profileService from "../services/profileService";
import { appState } from "../App";
import styles from "./style/ProfileView.module.css";

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, token } = useContext(appState);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile(token);
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("No authentication token found");
    }
  }, [token]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} ${styles.error}`}>
        <div className={styles.alert}>{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.info}>No profile data available</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <h1 className={styles.title}>User Profile</h1>
        <div className={styles.profileCard}>
          <ul className={styles.profileList}>
            <li className={styles.profileItem}>
              <span className={styles.label}>Username</span>
              <span className={styles.value}>{profile.user_name}</span>
            </li>
            <div className={styles.divider}></div>
            <li className={styles.profileItem}>
              <span className={styles.label}>First Name</span>
              <span className={styles.value}>{profile.first_name}</span>
            </li>
            <div className={styles.divider}></div>
            <li className={styles.profileItem}>
              <span className={styles.label}>Last Name</span>
              <span className={styles.value}>{profile.last_name}</span>
            </li>
            <div className={styles.divider}></div>
            <li className={styles.profileItem}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{profile.email}</span>
            </li>
          </ul>
          <div className={styles.buttonGroup}>
            <button
              className={styles.edit}
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </button>
            <button
              className={styles.changeButton}
              onClick={() => navigate("/change-password")}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
