import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import profileService from "../services/profileService";
import { appState } from "../App";
import styles from "./style/ProfileEdit.module.css";

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token } = useContext(appState);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.firstname.trim())
      newErrors.firstname = "First name is required";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await profileService.updateProfile(formData, token);
      setSuccess(true);
      setError("");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Update failed");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile(token);
        setFormData({
          username: data.user_name,
          firstname: data.first_name,
          lastname: data.last_name,
          email: data.email,
        });
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Edit Profile</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>Profile updated successfully!</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? styles.inputError : ""}
            />
            {errors.username && (
              <div className={styles.errorText}>{errors.username}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className={errors.firstname ? styles.inputError : ""}
            />
            {errors.firstname && (
              <div className={styles.errorText}>{errors.firstname}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className={errors.lastname ? styles.inputError : ""}
            />
            {errors.lastname && (
              <div className={styles.errorText}>{errors.lastname}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.inputError : ""}
            />
            {errors.email && (
              <div className={styles.errorText}>{errors.email}</div>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.saveButton}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
