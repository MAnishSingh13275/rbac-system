"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/Dashboard/Modal";
import UserForm from "@/components/Dashboard/UserForm";
import UserTable from "@/components/Dashboard/UserTable";
import { User } from "@/types/utils";
import { fetchUsers, deleteUser } from "@/services/userService";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

const DashboardPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success("User deleted successfully!");
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user.");
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">User Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, roles, and permissions.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
        >
          Logout
        </button>
      </header>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
        >
          Add New User
        </button>
      </div>

      <UserTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        loading={loading}
      />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <UserForm
            onClose={() => setIsModalOpen(false)}
            onUserAdded={loadUsers}
            editingUser={editingUser}
          />
        </Modal>
      )}
    </div>
  );
};

export default DashboardPage;
