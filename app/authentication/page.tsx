"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      router.push('/'); // Navigate to home
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Dynamic Blue Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-500 z-0 pointer-events-none"
        style={{ 
          clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 100%)' 
        }} 
      />

      {/* Optional: Subtle blur orb for texture */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 px-4"
      >
        <div className="text-center mb-8">
          <Image
            src="/logo/cariex-logo-white.svg"
            alt="Cariex"
            width={192}
            height={192}
            className="mx-auto w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
          />
          <h1 className="sr-only">Cariex</h1>
          <p className="text-blue-100">Advanced Dental Intelligence System</p>
        </div>

        <Card className="border-0 shadow-2xl overflow-hidden">
          <CardHeader className="space-y-1 bg-white pb-6">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white pt-2">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="pl-10 h-11 bg-slate-50 border-slate-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10 h-11 bg-slate-50 border-slate-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 bg-linear-to-r from-blue-600 to-blue-500 border-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Authenticating..."
                ) : (
                  <span className="flex items-center">
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <div className="bg-slate-50 px-6 py-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Unauthorized access is prohibited.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}