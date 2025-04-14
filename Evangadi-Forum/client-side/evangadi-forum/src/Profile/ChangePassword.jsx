import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import profileService from "../services/profileService";
import { appState } from "../App";
import styles from "./style/ChangePassword.module.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useContext(appState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords must match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { confirmPassword, ...passwordData } = formData;
      await profileService.changePassword(passwordData, token);
      setSuccess(true);
      setSubmitError("");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setSubmitError(err.response?.data?.msg || "Incorrect current password");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2 className={styles.title}>Change Password</h2>

        {submitError && (
          <div className={styles.errorMessage}>{submitError}</div>
        )}
        {success && (
          <div className={styles.successMessage}>
            Password changed successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword" className={styles.label}>
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.currentPassword ? styles.inputError : ""
              }`}
            />
            {errors.currentPassword && (
              <div className={styles.fieldError}>{errors.currentPassword}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.newPassword ? styles.inputError : ""
              }`}
            />
            {errors.newPassword && (
              <div className={styles.fieldError}>{errors.newPassword}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.confirmPassword ? styles.inputError : ""
              }`}
            />
            {errors.confirmPassword && (
              <div className={styles.fieldError}>{errors.confirmPassword}</div>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Changing..." : "Change Password"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
