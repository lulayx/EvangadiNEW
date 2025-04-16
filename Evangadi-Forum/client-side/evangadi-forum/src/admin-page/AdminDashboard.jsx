import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";

import axios from "axios";
import styles from "./style/adminDashboard.module.css";
import { appState } from "../App";
import { MdRefresh } from "react-icons/md";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(appState);
  const token = localStorage.getItem("token");
  const location = useLocation();

  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    totalRatings: 0,
    activeReports: 0,
  });
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [reportedContent, setReportedContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/");
  };

  // Authentication check
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("userData");

      if (!token || !userDataString) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const userData = JSON.parse(userDataString);
        if (!userData?.isAdmin) {
          handleLogout();
          return;
        }
        setAuthChecked(true);
      } catch (error) {
        console.error("Authentication error:", error);
        handleLogout();
      }
    };

    verifyAuth();
  }, [navigate]);

  // Update active tab based on current route
  useEffect(() => {
    if (!authChecked) return;

    const path = location.pathname;
    if (path.includes("/dashboard")) setActiveTab("dashboard");
    else if (path.includes("/questions")) setActiveTab("questions");
    else if (path.includes("/users")) setActiveTab("users");
    else if (path.includes("/question-full")) setActiveTab("question-full");
    else if (path.includes("/register-user")) setActiveTab("register-user");
  }, [location, authChecked]);

  // Fetch dashboard data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, questionsRes] = await Promise.all([
        axios.get("https://server-side-r4vi.onrender.com/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get("https://server-side-r4vi.onrender.com/api/admin/recent-questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setStats(statsRes.data);
      setRecentQuestions(questionsRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setStats({
        totalUsers: "N/A",
        totalQuestions: "N/A",
        totalAnswers: "N/A",
        totalRatings: "N/A",
        activeReports: "N/A",
      });
      setRecentQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authChecked || activeTab !== "dashboard") return;
    fetchData();
  }, [authChecked, activeTab, lastRefresh]);

  // Handle refresh
  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

  if (!authChecked) {
    return <div className={styles.loading}>Verifying authentication...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.adminHeader}>
          <h2>Admin Dashboard</h2>
          <p>Welcome back, {user.user?.username}(Admin)</p>
        </div>

        <nav className={styles.navMenu}>
          <button
            className={`${styles.navItem} ${
              activeTab === "dashboard" ? styles.active : ""
            }`}
            onClick={() => navigate("/admin/dashboard")}
          >
            Dashboard Overview
          </button>

          <button
            className={`${styles.navItem} ${
              activeTab === "register-user" ? styles.active : ""
            }`}
            onClick={() => navigate("/admin/register-user")}
          >
            Create Account For User
          </button>
          <button
            className={`${styles.navItem} ${
              activeTab === "users" ? styles.active : ""
            }`}
            onClick={() => navigate("/admin/users")}
          >
            User Management
          </button>
          <button
            className={`${styles.navItem} ${
              activeTab === "questions" ? styles.active : ""
            }`}
            onClick={() => navigate("/admin/questions")}
          >
            Questions Management
          </button>
          <button
            className={`${styles.navItem} ${
              activeTab === "question-full" ? styles.active : ""
            }`}
            onClick={() => navigate("/admin/question-full")}
          >
            Answer Management
          </button>
        </nav>

        <button className={styles.logoutButton} onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {isLoading && activeTab === "dashboard" ? (
          <div className={styles.loading}>Loading dashboard data...</div>
        ) : (
          <>
            {/* Dashboard Overview */}
            {activeTab === "dashboard" && (
              <div className={styles.dashboardOverview}>
                <div className={styles.dashboardHeader}>
                  <h2>System Overview</h2>
                  <button
                    onClick={handleRefresh}
                    className={styles.refreshButton}
                    disabled={isLoading}
                  >
                    <MdRefresh /> Refresh
                  </button>
                </div>

                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Total Questions</h3>
                    <p>{stats.totalQuestions}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Total Answers</h3>
                    <p>{stats.totalAnswers}</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Answer Ratings</h3>
                    <p>{stats.totalRatings}</p>
                  </div>
                  {/* <div className={styles.statCard}>
                    <h3>Active Reports</h3>
                    <p>{stats.activeReports}</p>
                  </div> */}
                </div>

                <div className={styles.recentActivity}>
                  <h3>Recent Questions</h3>
                  {recentQuestions.length === 0 ? (
                    <p>No recent questions</p>
                  ) : (
                    <ul>
                      {recentQuestions.map((question) => (
                        <li key={question.id} className={styles.questionItem}>
                          <Link to={`/questions/${question.id}`}>
                            {question.title}
                          </Link>
                          <Link to={`/questions/${question.id}`}>
                            {question.description}
                          </Link>
                          <div className={styles.questionMeta}>
                            <span className={styles.user}>
                              Asked By: {question.user_name}
                            </span>
                            <span>
                              {new Date(question.created_at).toLocaleString()}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Outlet for nested routes */}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
