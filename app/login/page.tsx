"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Eye, EyeOff, User } from "lucide-react";
import Image from "next/image";
import useAuthStore from "@/lib/stores/auth-store";
import { Role } from "@/lib/types/users.types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useAuthStore((state) => state.login);
  const { isAuthenticated, accessToken, user, isAuthDelay, setIsAuthDelay } =
    useAuthStore();
  const router = useRouter();

  useEffect(() => setIsAuthDelay(false), []);

  useEffect(() => {
    console.log("STATUS", isAuthenticated);
    console.log("User", user);
    if (isAuthenticated && user) {
      setIsAuthDelay(true);
      switch (user.role) {
        case Role.ADMIN:
          console.log("PUSHING ADMIN DASHBOARD");
          router.push("/admin/dashboard");
          break;
        case Role.TEACHER:
          router.push("/teacher/dashboard");
          break;
        case Role.STUDENT:
          router.push("/student/dashboard");
          break;
      }
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, error } = await login(email, password);
    if (success) {
      console.log("Login successfull");
    } else {
      console.log("Login failed");
      setError(error ?? "Error");
    }
  };

  return (
    !isAuthDelay && (
      <div className="flex h-screen">
        <div className="hidden w-1/2 bg-indigo-900 p-12 md:flex md:flex-col md:justify-between">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="h-8 w-8" />
            <span className="text-2xl font-bold">
              Intelligent School Scheduler
            </span>
          </div>
          <div className="relative h-96 w-full">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Scheduling illustration"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-bold">Intelligent School Scheduler</h2>
            <p className="mt-2 text-gray-300">
              Welcome to the Intelligent School Scheduler – the platform that
              simplifies schedule management for teachers and students. Access
              and organize your class schedules effortlessly, all in one place!
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center bg-gray-100 p-8 md:w-1/2">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold">Login to continue</h1>
              <p className="mt-2 text-gray-600">
                Enter your credentials to access the admin dashboard
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="admin@email.email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className="pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-600 text-center -mt-4">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
