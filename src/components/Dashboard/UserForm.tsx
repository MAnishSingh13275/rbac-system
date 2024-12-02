import React, { useState, useEffect } from "react";
import { addUser, updateUser, fetchRoles, fetchPermissions } from "@/services/userService";
import { User, UserStatus } from "@/types/utils";
import AddRoleModal from "./AddRoleModal";
import AddPermissionModal from "./AddPermissionModal";
import Spinner from "../Spinner"; // Correctly import the Spinner component

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
  const [role, setRole] = useState(editingUser?.role?.id || ""); // Ensure role is an ID
  const [permissions, setPermissions] = useState<string[]>(editingUser?.permissions?.map(p => p.name) || []);
  const [status, setStatus] = useState<UserStatus>(editingUser?.status || UserStatus.ACTIVE);
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
      setRole(editingUser.role?.id || ""); // Ensure role is an ID
      setPermissions(editingUser.permissions.map(p => p.name));
      setStatus(editingUser.status || "ACTIVE");
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
    const user = { 
      id: editingUser?.id, 
      name, 
      email, 
      role: roles.find(r => r.id === role) || { id: role, name: '' }, 
      permissions: permissions.map(p => ({ name: p })), 
      status 
    };
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter username"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <div className="flex items-center">
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
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            id="status"
            className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Permissions</label>
          {loadingPermissions ? (
            <Spinner />
          ) : (
            permissionsOptions.map((permission) => (
              <div key={permission} className="flex items-center">
                <input
                  type="checkbox"
                  id={permission}
                  name="permissions"
                  value={permission}
                  checked={permissions.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={permission} className="ml-2 block text-sm text-gray-900">
                  {permission}
                </label>
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
            disabled={submitting}
          >
            {submitting ? "Submitting..." : editingUser ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
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