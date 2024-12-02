import React, { useState } from "react";
import { addRole } from "@/services/userService";

const AddRoleModal = ({ onClose, onRoleAdded }: { onClose: () => void; onRoleAdded: () => void }) => {
  const [roleName, setRoleName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addRole({ name: roleName, permissions: [] });
      onRoleAdded();
      onClose();
    } catch (error) {
      console.error("Failed to add role:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Add Role</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;