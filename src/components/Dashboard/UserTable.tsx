import React, { useState, useEffect } from "react";
import { User } from "@/types/utils"; // Assuming you have a User type defined

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, loading }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-lg rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Permissions</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {/* Loading State */}
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-600">
                <div className="animate-spin border-t-4 border-blue-600 w-12 h-12 mx-auto rounded-full"></div>
                <span className="block mt-2">Loading...</span>
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-600">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-100 border-b border-gray-200 transition-colors duration-200"
              >
                <td className="px-6 py-3 text-sm text-gray-800">{user.name || "N/A"}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{user.email || "N/A"}</td>
                <td className="px-6 py-3 text-sm text-gray-800">{user.role?.name || "N/A"}</td>
                <td className="px-6 py-3 text-sm text-gray-800">
                  {user.permissions?.length > 0
                    ? user.permissions.map((permission) => permission.name).join(", ")
                    : "No permissions"}
                </td>
                <td className="px-6 py-3 text-sm text-gray-800">{user.status}</td>
                <td className="px-6 py-3 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      aria-label="Edit user"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                      aria-label="Delete user"
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
