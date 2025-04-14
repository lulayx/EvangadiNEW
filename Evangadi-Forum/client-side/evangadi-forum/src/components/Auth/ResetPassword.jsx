import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ResetPassword.module.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  // API configuration
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://evangadi.digitalyibeltal.com/api";

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/users/verify-reset-token/${token}`,
          { timeout: 10000 }
        );

        if (response.data.success) {
          setIsValidToken(true);
          setResetToken(response.data.resetToken);
        } else {
          toast.error(response.data.message);
          navigate("/forgot-password");
        }
      } catch (error) {
        console.error("Token verification error:", error);
        if (error.response) {
          if (error.response.status === 404) {
            toast.error("Reset link not found. Please request a new one.");
          } else {
            toast.error(error.response.data?.message || "Verification failed");
          }
        } else if (error.request) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("An unexpected error occurred");
        }
        navigate("/forgot-password");
      }
    };

    if (token) {
      verifyToken();
    } else {
      toast.error("Invalid reset link - no token provided");
      navigate("/forgot-password");
    }
  }, [token, navigate, API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/reset-password`,
        { resetToken, newPassword },
        { timeout: 10000 }
      );

      if (response.data.success) {
        toast.success("Password reset successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Reset error:", error);
      if (error.response?.status === 404) {
        toast.error("Reset endpoint not found (404)");
      } else {
        toast.error(error.response?.data?.message || "Reset failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Verifying reset link...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="8"
              placeholder="Minimum 8 characters"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
