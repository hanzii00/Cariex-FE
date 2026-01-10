"use client";

import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Eye, EyeClosed, Lock, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RegisterProps {
  onSuccess?: () => void;
}

export default function Register({ onSuccess }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      const { register } = await import("@/services/auth.service");
      await register({ username, email, password, password2: confirmPassword });
      toast.success("Registration successful! Please check your email to verify your account.");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const message = err?.message || "Registration failed.";
      const fields = err?.fields;

      if (fields && typeof fields === "object") {
        const msgs = Object.values(fields)
          .flat()
          .map((v: any) => (Array.isArray(v) ? v.join(" ") : String(v)))
          .join(" ");
        toast.error(msgs || message);
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }; 

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Username"
          className="pl-12 h-11 bg-slate-50 border-slate-200"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="email"
          placeholder="Email address"
          className="pl-12 h-11 bg-slate-50 border-slate-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="pl-12 h-11 bg-slate-50 border-slate-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {showPassword ? (
          <EyeClosed
            className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:cursor-pointer"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <Eye
            className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:cursor-pointer"
            onClick={() => setShowPassword(true)}
          />
        )}
      </div>

      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          className="pl-12 h-11 bg-slate-50 border-slate-200"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {showConfirmPassword ? (
          <EyeClosed
            className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:cursor-pointer"
            onClick={() => setShowConfirmPassword(false)}
          />
        ) : (
          <Eye
            className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:cursor-pointer"
            onClick={() => setShowConfirmPassword(true)}
          />
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 mt-3 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 bg-linear-to-r from-blue-600 to-blue-500 border-0 hover:cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}