"use client";

import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Eye, EyeClosed, Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ForgetPasswordDialog } from "./ForgetPasswordDialog";

interface LoginProps {
  onSuccess?: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address!");
      setIsLoading(false);
      return;
    }

    try {
      const { login } = await import("@/services/auth.service");
      await login({ email, password });
      toast.success("Login successful!");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const message = err?.message || (typeof err === "string" ? err : "Login failed.");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
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

      <div className="flex justify-end -mt-3">
        <ForgetPasswordDialog>
          <button className="text-xs text-blue-600 hover:underline">Forgot password?</button>
        </ForgetPasswordDialog>
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 bg-linear-to-r from-blue-600 to-blue-500 border-0 hover:cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? (
          "Authenticating..."
        ) : (
          <span className="flex items-center">Log in</span>
        )}
      </Button>
    </form>
  );
}