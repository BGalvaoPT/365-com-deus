"use client";

import { CrossIcon, SunIcon, MoonIcon, LogOutIcon } from "./Icons";
import { useTheme } from "./ThemeProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-parchment-100/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-parchment-200 dark:border-neutral-800">
      <div className="max-w-lg mx-auto flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-2 text-gold-600 dark:text-gold-500">
          <CrossIcon size={22} />
          <span className="text-[15px] font-semibold tracking-tight">
            365 com Deus
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 text-parchment-500 dark:text-neutral-400 hover:text-gold-600 dark:hover:text-gold-500 transition-colors"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-parchment-400 dark:text-neutral-500 hover:text-red-500 transition-colors"
            aria-label="Sair"
          >
            <LogOutIcon size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
