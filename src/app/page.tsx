"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true); // Set loading state to true when form is being submitted

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setError(error);
        setLoading(false); // Reset loading state on error
        return;
      }

      const { token } = await res.json();
      document.cookie = `authToken=${token}; path=/;`;
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false); // Reset loading state on error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-96"
      >
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Admin Login
        </h1>
        
        {/* Error message */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
            aria-label="Email address"
          />
        </div>
        
        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
            aria-label="Password"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LandingPage;
