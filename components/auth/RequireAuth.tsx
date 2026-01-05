"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.replace("/authentication");
      return;
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="p-8">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  return <>{children}</>;
}
