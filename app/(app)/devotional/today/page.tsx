"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";

export default function TodayRedirect() {
  const { getCurrentDay, loading } = useUserData();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(`/devotional/${getCurrentDay()}`);
    }
  }, [loading, getCurrentDay, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-parchment-400 dark:text-neutral-600 animate-pulse">
        A carregar...
      </div>
    </div>
  );
}
