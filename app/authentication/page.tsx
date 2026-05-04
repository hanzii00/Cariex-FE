"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Login from "@/app/authentication/components/Login";
import Register from "@/app/authentication/components/Register";

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("mode") === "register") setIsLogin(false);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 z-0 pointer-events-none"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 100%)" }}
      />
      <div className="absolute top-10 right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 space-y-8"
      >
        <div className="flex flex-col items-center">
          <Image src="/logo/cariex-logo-white.svg" alt="Cariex" width={192} height={64} />
          <p className="text-blue-100">Advanced Dental Intelligence System</p>
        </div>

        <Card className="border-0 shadow-2xl overflow-hidden py-8 px-3">
          <CardHeader className="bg-white gap-1">
            <CardTitle className="text-2xl text-center">
              {isLogin ? "Welcome to Cariex" : "Create an Account"}
            </CardTitle>
            <CardDescription className="text-center text-sm">
              {isLogin
                ? "Access the dashboard and AI analysis tools"
                : "Sign up to get started with Cariex"}
            </CardDescription>
          </CardHeader>

          <CardContent className="bg-white pt-2">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? (
                <Login onSuccess={() => router.push('/dashboard')} />
              ) : (
                <Register onSuccess={() => { setIsLogin(true); toast.info('Please check your email to verify your account.'); }} />
              )}
            </motion.div>

            <div className="flex justify-center items-center gap-4 mt-6 text-xs">
              <p className="text-slate-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline hover:text-blue-700 transition-all duration-200"
              >
                {isLogin ? "Create an account" : "Access account"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
