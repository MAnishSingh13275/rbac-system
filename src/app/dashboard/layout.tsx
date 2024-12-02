"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!token) {
      router.push("/");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch("/api/verify-token", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Invalid token");
        }

        const data = await response.json();
        if (data.decoded.role !== "admin") {
          router.push("/");
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        router.push("/");
      }
    };

    verifyToken();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="animate-spin border-t-4 border-blue-600 w-12 h-12 rounded-full"></div>
        <span className="ml-4 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">{children}</div>
  );
};

export default DashboardLayout;
