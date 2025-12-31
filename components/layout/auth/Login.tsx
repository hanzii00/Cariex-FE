"use client";

import { useState } from "react";
import { Eye, EyeClosed, Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface LoginProps {
  onSuccess?: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address!");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Login successful!");
      if (onSuccess) onSuccess();
    }, 1500);
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
        <a
          href="/forgot-password"
          className="text-xs text-blue-600 hover:underline hover:text-blue-700 transition-all duration-200"
        >
          Forgot password?
        </a>
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
