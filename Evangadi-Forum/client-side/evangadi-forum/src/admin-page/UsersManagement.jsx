// export default UsersManagement;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../api/axios";
import axios from "axios";
// import styles from "./style/adminDashboard.module.css";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import styles from "./style/usersManagement.module.css";
const UsersManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://evangadi-api.digitalyibeltal.com/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data.users || []);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axios.delete(
        `https://evangadi-api.digitalyibeltal.com/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setUsers(users.filter((user) => user.user_id !== id));
        alert("User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.msg || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.user_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm)
  );

  if (loading) return <div className={styles.loading}>Loading users...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.userManagement}>
      <h2>User Management ({filteredUsers.length})</h2>
      <div className={styles.usersContainer}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search users..."
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
      </div>

      <div className={styles.usersTableContainer}>
        {filteredUsers.length === 0 && searchTerm ? (
          <div className={styles.noResults}>No users match your search</div>
        ) : (
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Actions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.user_name}</td>
                  <td>
                    {user.first_name} {user.last_name}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.is_admin ? "Yes" : "No"}</td>
                  <td className={styles.actionCells}>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => navigate(`/admin/users/${user.user_id}`)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDeleteUser(user.user_id)}
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
