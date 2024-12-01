import React, { useState, useEffect } from "react";
import { addUser, updateUser, fetchRoles, deleteRole, fetchPermissions } from "@/services/userService";
import { User } from "@/types/utils";
import AddRoleModal from "./AddRoleModal";
import AddPermissionModal from "./AddPermissionModal";
import Spinner from "../Spinner";

const UserForm = ({
  onClose,
  onUserAdded,
  editingUser,
}: {
  onClose: () => void;
  onUserAdded: () => void;
  editingUser: User | null;
}) => {
  const [name, setUsername] = useState(editingUser?.name || "");
  const [email, setEmail] = useState(editingUser?.email || "");
  const [role, setRole] = useState(editingUser?.role?.id || ""); 
  const [permissions, setPermissions] = useState<string[]>(editingUser?.permissions?.map(p => p.name) || []);
  const [roles, setRoles] = useState<{ id: string, name: string }[]>([]);
  const [permissionsOptions, setPermissionsOptions] = useState<string[]>([]);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isAddPermissionModalOpen, setIsAddPermissionModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setUsername(editingUser.name || "");
      setEmail(editingUser.email);
      setRole(editingUser.role?.id || "");
      setPermissions(editingUser.permissions.map(p => p.name));
    }
  }, [editingUser]);

  useEffect(() => {
    const loadRoles = async () => {
      setLoadingRoles(true);
      const rolesData = await fetchRoles();
      setRoles(rolesData.map((role: { id: string, name: string }) => ({ id: role.id, name: role.name })));
      setLoadingRoles(false);
    };
    loadRoles();
  }, []);

  useEffect(() => {
    const loadPermissions = async () => {
      setLoadingPermissions(true);
      const permissionsData = await fetchPermissions();
      setPermissionsOptions(permissionsData.map((permission: { name: string }) => permission.name));
      setLoadingPermissions(false);
    };
    loadPermissions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError("Please select a role.");
      return;
    }
    const user = { id: editingUser?.id, name, email, role, permissions };
    setSubmitting(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, user);
      } else {
        await addUser(user);
      }
      onUserAdded();
      onClose();
    } catch (error) {
      console.error("Failed to save user:", error);
      setError("Failed to save user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePermissionChange = (permission: string) => {
    setPermissions((prevPermissions) =>
      prevPermissions.includes(permission)
        ? prevPermissions.filter((p) => p !== permission)
        : [...prevPermissions, permission]
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-xl w-full sm:w-96 mx-auto">
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <div className="flex items-center space-x-2">
            {loadingRoles ? (
              <Spinner />
            ) : (
              <select
                name="role"
                id="role"
                className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={() => setIsAddRoleModalOpen(true)}
              className="ml-3 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Role
            </button>
          </div>
        </div>

        {/* Permissions Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Permissions</label>
          {loadingPermissions ? (
            <Spinner />
          ) : (
            permissionsOptions.map((permission) => (
              <div key={permission} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={permission}
                  name="permissions"
                  value={permission}
                  checked={permissions.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={permission} className="ml-2 block text-sm text-gray-900">{permission}</label>
              </div>
            ))
          )}
          <button
            type="button"
            onClick={() => setIsAddPermissionModalOpen(true)}
            className="mt-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Permission
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : editingUser ? "Update User" : "Create User"}
          </button>
        </div>
      </form>

      {/* Modals for Adding Roles and Permissions */}
      {isAddRoleModalOpen && (
        <AddRoleModal
          onClose={() => setIsAddRoleModalOpen(false)}
          onRoleAdded={async () => {
            const rolesData = await fetchRoles();
            setRoles(rolesData.map((role: { id: string, name: string }) => ({ id: role.id, name: role.name })));
          }}
        />
      )}
      {isAddPermissionModalOpen && (
        <AddPermissionModal
          onClose={() => setIsAddPermissionModalOpen(false)}
          onPermissionAdded={async () => {
            const permissionsData = await fetchPermissions();
            setPermissionsOptions(permissionsData.map((permission: { name: string }) => permission.name));
          }}
        />
      )}
    </>
  );
};

export default UserForm;
