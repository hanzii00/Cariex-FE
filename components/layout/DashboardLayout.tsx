import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <Header title={title} />
      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
